import { useEffect, useRef, useState } from "react";
import {
  IpageMeta,
  PaginationControl,
} from "../../component/PaginationControl";
import { Input, Select, Textarea } from "../../component/Input";
import { FaDownload, FaPlus, FaSearch, FaTrash } from "react-icons/fa";
import { Store } from "../../store/Store";
import { AchievementSiswa, Class, Student } from "../../midleware/api";
import Swal from "sweetalert2";
import { formatTime } from "../../utils/date";
import { FaPencil } from "react-icons/fa6";
import * as Yup from "yup";
import { useFormik } from "formik";
import Modal, { closeModal, openModal } from "../../component/modal";
import { getAcademicYears, getCurrentAcademicYear } from "../../utils/common";

const certificateExts = ["pdf", "jpeg", "jpg", "png"];

const schema = Yup.object().shape({
  id: Yup.string().optional(),
  student_id: Yup.string().required("Siswa tidak boleh kosong"),
  achievement_desc: Yup.string().required("Deskripsi tidak boleh kosong"),
  issued_at: Yup.date().required("Tanggal terbit tidak boleh kosong"),
  file: Yup.mixed<File>()
    .nullable()
    .optional()
    .test(
      "is-valid-type",
      "File harus pdf atau gambar",
      (value) =>
        !value ||
        (value &&
          certificateExts.includes(
            value.name.split(".").pop()?.toLowerCase() || ""
          ))
    )
    .test(
      "is-valid-size",
      "Ukuran melebihi batas 5MB",
      (value) => !value || (value && value.size <= 5000000)
    ),
});

const PrestasiSiswa = () => {
  const { token } = Store(),
    modalFormId = "form-achievement";

  // filter
  const [search, setSearch] = useState("");
  const [pageMeta, setPageMeta] = useState<IpageMeta>({ page: 0, limit: 10 });
  const [filter, setFilter] = useState({
    classId: "",
    search: "",
    page: 0,
    limit: 0,
  });

  const handleFilter = (key: string, value: any) => {
    const obj = {
      ...filter,
      [key]: value,
    };
    if (key != "page") obj["page"] = 0;
    setFilter(obj);
  };

  const [classes, setClasses] = useState<any[]>([]);
  const getClasses = async () => {
    try {
      const res = await Class.showAll(token, 0, 0, "Y");
      setClasses(res.data.data.result);
    } catch {}
  };

  useEffect(() => {
    getClasses();
  }, []);

  // retrieve data
  const [dataList, setDataList] = useState<any[]>([]);
  const getDataList = async () => {
    try {
      const res = await AchievementSiswa.showAll(
        token,
        filter.search,
        filter.classId,
        filter.page,
        filter.limit,
        "Y"
      );

      const { result, ...meta } = res.data.data;

      setDataList(result);
      setPageMeta(meta);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Gagal Mengambil data prestasi siswa, silakan coba lain kali",
      });
    }
  };

  useEffect(() => {
    getDataList();
  }, [filter]);

  // create & edit
  const [academicYear, setAcademicYear] = useState(getCurrentAcademicYear()); // maybe temporary
  const [students, setStudents] = useState<any[]>([]);

  const getStudents = async () => {
    form.setFieldValue("student_id", "");
    if (!academicYear || !filter.classId) return;

    try {
      const res = await Student.GetStudentByClass(
        token,
        filter.classId,
        academicYear
      );
      setStudents(res.data.data?.map((dat: any) => dat.student) ?? []);
    } catch {}
  };

  const inpCertificateFile = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getStudents();
  }, [academicYear, filter.classId]);

  const form = useFormik({
    initialValues: {
      id: "",
      student_id: "",
      achievement_desc: "",
      issued_at: "",
      file: "",
    },
    validationSchema: schema,
    validateOnChange: false,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(false);

      try {
        const formData = new FormData();
        formData.append("student_id", values.student_id);
        formData.append("achievement_desc", values.achievement_desc);
        formData.append("issued_at", values.issued_at);
        if (values.file) formData.append("file", values.file);

        values.id
          ? await AchievementSiswa.update(token, values.id, formData)
          : await AchievementSiswa.create(token, formData);

        handleReset();
        closeModal(modalFormId);
        getDataList();

        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: `Berhasil ${values.id ? "mengedit" : "menambahkan"} prestasi siswa`,
        });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `Gagal ${values.id ? "mengedit" : "menambahkan"} prestasi siswa`,
        });
      } finally {
        setSubmitting(true);
      }
    },
  });

  const handleReset = () => {
    form.resetForm();
    if (inpCertificateFile.current) inpCertificateFile.current.value = "";
  };

  // handle get one
  const [isGetLoading, setIsGetLoading] = useState(false);
  const getData = async (id: string) => {
    setIsGetLoading(true);

    try {
      const res = await AchievementSiswa.showOne(token, id);

      form.setValues({
        id: res.data.data?.id ?? "",
        student_id: res.data.data?.student_id ?? "",
        achievement_desc: res.data.data?.achievement_desc ?? "",
        issued_at: res.data.data?.issued_at
          ? formatTime(res.data.data.issued_at, "YYYY-MM-DD")
          : "",
        file: "",
      });
      openModal(modalFormId);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `Gagal mendapatkan data prestasi siswa`,
      });
    } finally {
      setIsGetLoading(false);
    }
  };

  return (
    <>
      <Modal id={modalFormId} onClose={handleReset}>
        <form onSubmit={form.handleSubmit}>
          <h3 className="text-xl font-bold mb-6">
            {form.values.id ? "Edit" : "Tambah"} Prestasi
          </h3>

          {!form.values.id && (
            <>
              <Select
                label="Tahun pelajaran"
                options={getAcademicYears()}
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
              />

              <Select
                label="Kelas"
                value={filter.classId}
                onChange={(e) => handleFilter("classId", e.target.value)}
                keyValue="id"
                displayBuilder={(opt) => `${opt.level}-${opt.class_name}`}
                options={classes}
              />

              <div className="divider"></div>

              <Select
                label="Siswa"
                name="student_id"
                keyValue="id"
                keyDisplay="full_name"
                options={students}
                value={form.values.student_id}
                onChange={form.handleChange}
                errorMessage={form.errors.student_id}
              />
            </>
          )}

          <Textarea
            label="Deskripsi"
            name="achievement_desc"
            value={form.values.achievement_desc}
            onChange={form.handleChange}
            errorMessage={form.errors.achievement_desc}
          />

          <Input
            label="Tanggal terbit"
            type="date"
            name="issued_at"
            value={form.values.issued_at}
            onChange={form.handleChange}
            errorMessage={form.errors.issued_at}
          />

          <Input
            label="Sertifikat"
            name="file"
            type="file"
            ref={inpCertificateFile}
            accept={certificateExts.map((ext) => "." + ext).join(", ")}
            // value={form.values.file}
            onChange={(e) => {
              if (e.target.files) {
                form.setFieldValue("file", e.target.files[0]);
              }
            }}
            errorMessage={form.errors.file}
          />

          <button
            type="submit"
            className="btn btn-secondary w-full mt-10"
            // disabled={form.isSubmitting}
            onClick={() => console.log(form.values)}
          >
            {form.isSubmitting ? "Menyimpan..." : "Simpan"}
          </button>
        </form>
      </Modal>

      <div className="w-full flex justify-center flex-col items-center p-3">
        <span className="font-bold text-xl">PRESTASI SISWA</span>

        <div className="w-full p-3 bg-white rounded-lg">
          {/* filter  */}
          <div className="w-full flex flex-wrap justify-end my-3 gap-2">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleFilter("search", search);
              }}
              className="join"
            >
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari"
                slotRight={<FaSearch />}
              />
            </form>

            <div>
              <Select
                placeholder="Kelas"
                value={filter.classId}
                onChange={(e) => handleFilter("classId", e.target.value)}
                keyValue="id"
                displayBuilder={(opt) => `${opt.level}-${opt.class_name}`}
                options={classes}
              />
            </div>

            <button
              onClick={() => openModal(modalFormId)}
              className="btn btn-secondary"
            >
              <FaPlus />
              Tambah
            </button>
          </div>

          {/* table  */}
          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead className="bg-blue-400">
                <tr>
                  <th>No</th>
                  <th>Siswa</th>
                  <th>Deskripsi</th>
                  <th>Tanggal Terbit</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {dataList.map((dat, i) => (
                  <tr key={i}>
                    <th>{i + 1}</th>
                    <td>{dat.student.full_name ?? "-"}</td>
                    <td>{dat.achievement_desc ?? "-"}</td>
                    <td>
                      {dat.issued_at
                        ? formatTime(dat.issued_at, "DD MMMM YYYY")
                        : "-"}
                    </td>

                    <td>
                      <div className="join">
                        <button
                          className="btn btn-primary btn-sm join-item tooltip"
                          data-tip="Unduh sertifikat"
                        >
                          <FaDownload />
                        </button>
                        <button
                          className="btn btn-secondary btn-sm join-item  tooltip"
                          data-tip="Edit"
                          disabled={isGetLoading}
                          onClick={() => getData(dat.id)}
                        >
                          <FaPencil />
                        </button>
                        <button
                          className="btn btn-error btn-sm join-item text-white tooltip"
                          data-tip="Hapus"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* control  */}
          <PaginationControl
            meta={pageMeta}
            onPrevClick={() => handleFilter("page", pageMeta.page - 1)}
            onNextClick={() => handleFilter("page", pageMeta.page + 1)}
            onJumpPageClick={(val) => handleFilter("page", val)}
            onLimitChange={(val) => handleFilter("limit", val)}
          />
        </div>
      </div>
    </>
  );
};

export default PrestasiSiswa;
