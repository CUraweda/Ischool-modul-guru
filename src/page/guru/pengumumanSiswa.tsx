import { useState, useEffect } from "react";
import { Pengumuman, Task } from "../../midleware/api";
import { Store } from "../../store/Store";
import { FaEdit, FaRegTrashAlt } from "react-icons/fa";
import Modal, { closeModal, openModal } from "../../component/modal";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import {
  IpageMeta,
  PaginationControl,
} from "../../component/PaginationControl";
import { formatTime } from "../../utils/date";

const validationSchema = Yup.object({
  startDate: Yup.string().required("Tanggal mulai tidak boleh kosong"),
  endDate: Yup.string().required("Tanggal selesai tidak boleh kosong"),
  anouncement: Yup.string().required("Pengumuman tidak boleh kosong"),
  class_id: Yup.string().optional(),
});

const PengumumanSiswa = () => {
  const { token, role } = Store();
  const [idPengumuman, setIdPengumuman] = useState<string>("");
  const [classes, setClasses] = useState<any[]>([]);

  const formik = useFormik({
    initialValues: {
      startDate: "",
      endDate: "",
      anouncement: "",
      class_id: 0,
    },
    validationSchema,
    onSubmit: (values, { setFieldError }) => {
      console.log(values);
      if (role == "6" && !values.class_id)
        setFieldError("class_id", "Kelas tidak boleh kosong");
    },
  });

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
    const response = await Task.GetAllClass(token, 0, 2000, "Y");
    setClasses(response.data.data.result);
  };

  const getDataList = async () => {
    try {
      const response = await Pengumuman.getAllPengumuman(
        token,
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

  const formatDateFormik = (date: any) => {
    const tanggal = new Date(date);
    const year = tanggal.getFullYear();
    const bulan = ("0" + (tanggal.getMonth() + 1)).slice(-2);
    const day = ("0" + tanggal.getDate()).slice(-2);

    const formattedDate = `${year}-${bulan}-${day}`;
    return formattedDate;
  };

  const GetByIdPengumuman = async (id: string) => {
    try {
      const response = await Pengumuman.getByIdPengumuman(token, id);
      const data = response.data.data;
      formik.setFieldValue("startDate", formatDateFormik(data.date_start));
      formik.setFieldValue("endDate", formatDateFormik(data.date_end));
      formik.setFieldValue("anouncement", data.announcement_desc);
      formik.setFieldValue("class_id", data.class_id);
    } catch (error) {
      console.log(error);
    }
  };

  const trigerEdit = async (id: string) => {
    openModal("edit-pengumuman");
    setIdPengumuman(id);
    GetByIdPengumuman(id);
  };

  const CreatePengumuman = async () => {
    try {
      const { anouncement, startDate, endDate, class_id } = formik.values;
      if (role == "6" && !class_id) return;

      const data = {
        date_start: startDate,
        date_end: endDate,
        announcement_desc: anouncement,
        class_id: !class_id ? null : class_id,
      };
      await Pengumuman.createPengumuman(token, data);
      getDataList();
      closeModal("add-pengumuman");
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Your work has been saved",
        showConfirmButton: false,
        timer: 1500,
      });
      formik.resetForm();
    } catch (error) {
      console.log(error);
    }
  };

  const EditPengumuman = async () => {
    try {
      const { anouncement, startDate, endDate, class_id } = formik.values;
      if (role == "6" && !class_id) return;

      const data = {
        date_start: startDate,
        date_end: endDate,
        announcement_desc: anouncement,
        class_id: !class_id ? null : class_id,
      };
      await Pengumuman.UpdatePengumuman(token, idPengumuman, data);

      getDataList();
      closeModal("edit-pengumuman");
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Your work has been saved",
        showConfirmButton: false,
        timer: 1500,
      });
      formik.resetForm();
    } catch (error) {
      console.log(error);
    }
  };

  const deletePengumuman = async (id: string) => {
    await Pengumuman.DeletePengumuman(token, id);
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
          id="tambah-pengumuman"
          className="btn btn-ghost bg-green-500 text-white"
          onClick={() => openModal("add-pengumuman")}
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
                <th>{index + 1 + filter.page * filter.limit}</th>

                <td>
                  <p className="min-w-80">{item?.announcement_desc}</p>
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

      <Modal id="add-pengumuman">
        <div className="flex flex-col gap-2 items-center">
          <span className="text-xl font-bold">Tambah Pengumuman</span>
          <form action="" onSubmit={formik.handleSubmit} className="w-full">
            <div className="w-full flex flex-col gap-2 mt-5">
              <label htmlFor="" className="font-bold">
                Tanggal
              </label>
              <div className="flex gap-1 justify-center items-center w-full ">
                <input
                  type="date"
                  className={`input input-bordered w-full ${
                    formik.touched.startDate && formik.errors.startDate
                      ? "input-error"
                      : ""
                  }`}
                  name="startDate"
                  value={formik.values.startDate}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <p>-</p>
                <input
                  type="date"
                  className={`input input-bordered w-full ${
                    formik.touched.endDate && formik.errors.endDate
                      ? "input-error"
                      : ""
                  }`}
                  name="endDate"
                  value={formik.values.endDate}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              {formik.touched.startDate && formik.errors.startDate ? (
                <div className="text-red-500 text-xs">
                  {formik.errors.startDate}
                </div>
              ) : null}
              {formik.touched.endDate && formik.errors.endDate ? (
                <div className="text-red-500 text-xs">
                  {formik.errors.endDate}
                </div>
              ) : null}
            </div>
            <div className="w-full flex flex-col gap-2 mt-5">
              <label htmlFor="" className="font-bold">
                Kelas
              </label>
              <div className="flex gap-1 justify-center items-center w-full ">
                <select
                  name="class_id"
                  className={`select select-bordered w-full ${
                    formik.touched.class_id && formik.errors.class_id
                      ? "select-error"
                      : ""
                  }`}
                  value={formik.values.class_id}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  <option value="">Pilih Kelas</option>
                  {classes.map((item, index) => (
                    <option value={item.id} key={index}>
                      {item.class_name}
                    </option>
                  ))}
                </select>
              </div>
              {formik.touched.class_id && formik.errors.class_id ? (
                <div className="text-red-500 text-xs">
                  {formik.errors.class_id}
                </div>
              ) : null}
            </div>
            <div className="w-full flex flex-col gap-2 mt-5">
              <label htmlFor="" className="font-bold">
                Pengumuman
              </label>
              <div className="flex gap-1 justify-center items-center w-full ">
                <textarea
                  placeholder="Pengumuman"
                  className={`textarea textarea-bordered w-full ${
                    formik.touched.anouncement && formik.errors.anouncement
                      ? "textarea-error"
                      : ""
                  }`}
                  name="anouncement"
                  value={formik.values.anouncement}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              {formik.touched.anouncement && formik.errors.anouncement ? (
                <div className="text-red-500 text-xs">
                  {formik.errors.anouncement}
                </div>
              ) : null}
            </div>
            <button
              type="submit"
              className="btn btn-ghost w-full bg-green-500 text-white mt-5"
              onClick={CreatePengumuman}
            >
              Simpan
            </button>
          </form>
        </div>
      </Modal>

      <Modal id="edit-pengumuman">
        <div className="flex flex-col gap-2 items-center">
          <span className="text-xl font-bold">Edit Pengumuman</span>
          <form action="" onSubmit={formik.handleSubmit} className="w-full">
            <div className="w-full flex flex-col gap-2 mt-5">
              <label htmlFor="" className="font-bold">
                Tanggal
              </label>
              <div className="flex gap-1 justify-center items-center w-full ">
                <input
                  type="date"
                  className={`input input-bordered w-full ${
                    formik.touched.startDate && formik.errors.startDate
                      ? "input-error"
                      : ""
                  }`}
                  name="startDate"
                  value={formik.values.startDate}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <p>-</p>
                <input
                  type="date"
                  className={`input input-bordered w-full ${
                    formik.touched.endDate && formik.errors.endDate
                      ? "input-error"
                      : ""
                  }`}
                  name="endDate"
                  value={formik.values.endDate}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              {formik.touched.startDate && formik.errors.startDate ? (
                <div className="text-red-500 text-xs">
                  {formik.errors.startDate}
                </div>
              ) : null}
              {formik.touched.endDate && formik.errors.endDate ? (
                <div className="text-red-500 text-xs">
                  {formik.errors.endDate}
                </div>
              ) : null}
            </div>
            <div className="w-full flex flex-col gap-2 mt-5">
              <label htmlFor="" className="font-bold">
                Kelas
              </label>
              <div className="flex gap-1 justify-center items-center w-full ">
                <select
                  name="class_id"
                  className={`select select-bordered w-full ${
                    formik.touched.class_id && formik.errors.class_id
                      ? "select-error"
                      : ""
                  }`}
                  value={formik.values.class_id}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  <option value="">Pilih Kelas</option>
                  {classes.map((item, index) => (
                    <option key={index} value={item.id}>
                      {item.class_name}
                    </option>
                  ))}
                </select>
              </div>
              {formik.touched.class_id && formik.errors.class_id ? (
                <div className="text-red-500 text-xs">
                  {formik.errors.class_id}
                </div>
              ) : null}
            </div>
            <div className="w-full flex flex-col gap-2 mt-5">
              <label htmlFor="" className="font-bold">
                Pengumuman
              </label>
              <div className="flex gap-1 justify-center items-center w-full ">
                <textarea
                  placeholder="Pengumuman"
                  className={`textarea textarea-bordered w-full ${
                    formik.touched.anouncement && formik.errors.anouncement
                      ? "textarea-error"
                      : ""
                  }`}
                  name="anouncement"
                  value={formik.values.anouncement}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              {formik.touched.anouncement && formik.errors.anouncement ? (
                <div className="text-red-500 text-xs">
                  {formik.errors.anouncement}
                </div>
              ) : null}
            </div>
            <button
              type="submit"
              className="btn btn-ghost w-full bg-green-500 text-white mt-5"
              onClick={EditPengumuman}
            >
              Simpan
            </button>
          </form>
        </div>
      </Modal>
    </>
  );
};

export default PengumumanSiswa;
