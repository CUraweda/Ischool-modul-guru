import { useState, useEffect, useRef } from "react";
import { Pengumuman, Task } from "../../midleware/api";
import { Store } from "../../store/Store";
import { FaEdit, FaFile, FaRegTrashAlt } from "react-icons/fa";
import Modal, { closeModal, openModal } from "../../component/modal";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import {
  IpageMeta,
  PaginationControl,
} from "../../component/PaginationControl";
import { formatTime } from "../../utils/date";
import { Input, Select, Textarea } from "../../component/Input";

const fileExts = ["pdf"];

const validationSchema = Yup.object({
  startDate: Yup.string().required("Tanggal mulai tidak boleh kosong"),
  endDate: Yup.string().required("Tanggal selesai tidak boleh kosong"),
  anouncement: Yup.string().required("Pengumuman tidak boleh kosong"),
  class_id: Yup.string().optional(),
  file: Yup.mixed<File>()
    .nullable()
    .optional()
    .test(
      "is-valid-type",
      "File harus pdf atau gambar",
      (value) =>
        !value ||
        (value &&
          fileExts.includes(value.name.split(".").pop()?.toLowerCase() || ""))
    )
    .test(
      "is-valid-size",
      "Ukuran melebihi batas 5MB",
      (value) => !value || (value && value.size <= 5000000)
    ),
  filePath: Yup.string().optional(),
});

const PengumumanSiswa = () => {
  const { role } = Store();
  const [idPengumuman, setIdPengumuman] = useState<string>("");
  const [classes, setClasses] = useState<any[]>([]);

  const formik = useFormik({
    initialValues: {
      startDate: "",
      endDate: "",
      anouncement: "",
      class_id: "",
      file: "",
      filePath: "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      if (role == "6" && !values.class_id) {
        setFieldError("class_id", "Kelas tidak boleh kosong");
        return;
      }

      const formData = new FormData();
      formData.append("date_start", values.startDate);
      formData.append("date_end", values.endDate);
      formData.append("announcement_desc", values.anouncement);
      if (values.class_id) formData.append("class_id", values.class_id);
      if (values.file) formData.append("file", values.file);

      setSubmitting(true);

      try {
        idPengumuman
          ? await Pengumuman.UpdatePengumuman(idPengumuman, formData)
          : await Pengumuman.createPengumuman(formData);

        getDataList();

        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: `Berhasil ${idPengumuman ? "mengedit" : "menambahkan"} pengumuman`,
          showConfirmButton: false,
          timer: 1500,
        });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Gagal",
          text: `Gagal ${idPengumuman ? "mengedit" : "menambahkan"} pengumuman`,
          showConfirmButton: false,
          timer: 1500,
        });
      } finally {
        setSubmitting(false);
        closeModal("form-pengumuman");
      }
    },
  });

  const resetForm = () => {
    formik.resetForm();
    setIdPengumuman("");
    setFilePreview("");
    if (inpFile.current) inpFile.current.value = "";
  };

  const [dataList, setDataList] = useState<any[]>([]);
  const [pageMeta, setPageMeta] = useState<IpageMeta>({ page: 0, limit: 10 });
  const [filter, setFilter] = useState({
    page: 0,
    limit: 10,
    search: "",
    classId: "",
    startDate: "",
    endDate: "",
  });

  const handleFilter = (key: string, value: any) => {
    const obj = {
      ...filter,
      [key]: value,
    };
    if (key != "page") obj["page"] = 0;
    setFilter(obj);
  };

  useEffect(() => {
    getDataList();
    getClassByEmployee();
  }, [filter]);

  const getClassByEmployee = async () => {
    const response = await Task.GetAllClass(0, 2000, "Y");
    setClasses(response.data.data.result);
  };

  const getDataList = async () => {
    try {
      const response = await Pengumuman.getAllPengumuman(
        filter.search,
        filter.classId,
        filter.startDate,
        filter.endDate,
        filter.page,
        filter.limit,
        "Y"
      );

      const { result, ...meta } = response.data?.data ?? {};

      setDataList(result);
      setPageMeta(meta);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Gagal Mengambil data pengumuman, silakan refresh halaman!",
      });
    }
  };

  const GetByIdPengumuman = async (id: string) => {
    try {
      const response = await Pengumuman.getByIdPengumuman(id);
      const data = response.data.data;
      formik.setValues({
        startDate: data.date_start
          ? formatTime(data.date_start, "YYYY-MM-DD")
          : "",
        endDate: data.date_end ? formatTime(data.date_end, "YYYY-MM-DD") : "",
        anouncement: data.announcement_desc ?? "",
        class_id: data.class_id ?? "",
        file: "",
        filePath: "",
      });
    } catch (error) {
      console.log(error);
    }
  };

  const trigerEdit = async (id: string) => {
    openModal("form-pengumuman");
    setIdPengumuman(id);
    GetByIdPengumuman(id);
  };

  const deletePengumuman = async (id: string) => {
    await Pengumuman.DeletePengumuman(id);
    Swal.fire({
      title: "Deleted!",
      text: "Your file has been deleted.",
      icon: "success",
    });
    getDataList();
  };

  const deletePengumunanTriger = async (id: string) => {
    try {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          deletePengumuman(id);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const [filePreview, setFilePreview] = useState("");
  const inpFile = useRef<HTMLInputElement>(null);

  const downloadFile = async () => {
    if (!idPengumuman) return;

    try {
      const res = await Pengumuman.downloadFile(idPengumuman);
      const blob = new Blob([res.data], { type: "application/pdf" });
      setFilePreview(URL.createObjectURL(blob));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    downloadFile();
  }, [idPengumuman]);

  return (
    <>
      <div className="w-full gap-3 flex flex-wrap justify-end">
        {/* filter bar  */}
        <div className="flex items-center">
          <input
            type="date"
            className="input input-bordered"
            value={filter.startDate}
            onChange={(e) => handleFilter("startDate", e.target.value)}
          />
          <div className="w-4 h-1 bg-base-300"></div>
          <input
            type="date"
            className="input input-bordered"
            value={filter.endDate}
            onChange={(e) => handleFilter("endDate", e.target.value)}
          />
        </div>
        <select
          value={filter.classId}
          onChange={(e) => handleFilter("classId", e.target.value)}
          className="select select-bordered w-32"
        >
          <option value={""}>Pilih Kelas</option>
          {classes.map((dat, i) => (
            <option value={dat.id} key={i}>
              {dat.class_name}
            </option>
          ))}
        </select>
        <button
          className="btn btn-ghost bg-green-500 text-white"
          onClick={() => openModal("form-pengumuman")}
        >
          tambah
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="table table-zebra mt-4">
          {/* head */}
          <thead className="bg-blue-300">
            <tr>
              <th>No</th>
              <th>Pengumuman</th>
              <th>Tanggal</th>
              <th>Kelas</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {dataList.map((item: any, index: number) => (
              <tr key={index}>
                <th>
                  {index + 1 + (pageMeta?.page ?? 0) * (pageMeta?.limit ?? 0)}
                </th>

                <td>
                  <p className="min-w-80">{item?.announcement_desc}</p>
                  {item.file_path && (
                    <p className="text-primary flex gap-1 text-xs items-center mt-1">
                      <FaFile size={12} /> Dengan file lampiran
                    </p>
                  )}
                </td>
                <td className="whitespace-nowrap">
                  {formatTime(item?.date_start, "DD MMMM YYYY")}-{" "}
                  {formatTime(item?.date_end, "DD MMMM YYYY")}
                </td>
                <td>{item.class?.class_name ?? "-"}</td>

                <td>
                  <div className="flex gap-1 text-xl">
                    <button
                      className="btn btn-ghost btn-sm text-xl text-orange-500"
                      onClick={() => trigerEdit(item?.id)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="btn btn-ghost btn-sm text-xl text-red-500"
                      onClick={() => deletePengumunanTriger(item?.id)}
                    >
                      <FaRegTrashAlt />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <PaginationControl
        meta={pageMeta}
        onPrevClick={() => handleFilter("page", pageMeta.page - 1)}
        onNextClick={() => handleFilter("page", pageMeta.page + 1)}
        onJumpPageClick={(val) => handleFilter("page", val)}
        onLimitChange={(val) => handleFilter("limit", val)}
      />

      <Modal id="form-pengumuman" onClose={() => resetForm()}>
        <div className="flex flex-col gap-2 items-center">
          <h3 className="text-xl font-bold">
            {idPengumuman ? "Edit" : "Tambah"} Pengumuman
          </h3>
          <form action="" onSubmit={formik.handleSubmit} className="w-full">
            <div className="w-full flex  gap-2 mt-5">
              <Input
                label="Tanggal"
                type="date"
                name="startDate"
                value={formik.values.startDate}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                errorMessage={formik.errors.startDate}
              />
              <Input
                label="Selesai"
                type="date"
                name="endDate"
                value={formik.values.endDate}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                errorMessage={formik.errors.endDate}
              />
            </div>

            <Select
              label="Kelas"
              placeholder="Pilih kelas"
              name="class_id"
              keyValue="id"
              displayBuilder={(op) => `${op.level} - ${op.class_name}`}
              options={classes}
              value={formik.values.class_id}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              errorMessage={formik.errors.class_id}
            />

            <Textarea
              label="Pengumuman"
              name="anouncement"
              value={formik.values.anouncement}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              errorMessage={formik.errors.anouncement}
            />

            {filePreview ? (
              <iframe
                src={filePreview}
                frameBorder="0"
                width="100%"
                height="240px"
              />
            ) : (
              <div className="w-full h-[240px] border rounded-md border-dashed flex">
                <p className="m-auto opacity-40">Pratinjau file</p>
              </div>
            )}

            <Input
              label="File lampiran"
              name="file"
              type="file"
              ref={inpFile}
              accept={fileExts.map((ext) => "." + ext).join(", ")}
              // value={form.values.file}
              onChange={(e) => {
                if (e.target.files) {
                  formik.setFieldValue("file", e.target.files[0]);
                  setFilePreview(URL.createObjectURL(e.target.files[0]));
                } else {
                  setFilePreview("");
                }
              }}
              errorMessage={formik.errors.file}
            />

            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="btn btn-ghost w-full bg-green-500 text-white mt-5"
            >
              {formik.isSubmitting ? "Menyimpan..." : "Simpan"}
            </button>
          </form>
        </div>
      </Modal>
    </>
  );
};

export default PengumumanSiswa;
