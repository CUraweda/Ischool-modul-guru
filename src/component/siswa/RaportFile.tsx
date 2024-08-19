import { useEffect, useRef, useState } from "react";
import { globalStore, Store } from "../../store/Store";
import { IpageMeta, PaginationControl } from "../PaginationControl";
import { Class, FileRaporSiswa, Student } from "../../midleware/api";
import Swal from "sweetalert2";
import { Input, Select } from "../Input";
import { FaFile, FaPlus, FaSearch, FaTrash } from "react-icons/fa";
import Modal, { closeModal, openModal } from "../modal";
import { FaPencil } from "react-icons/fa6";
import * as Yup from "yup";
import { useFormik } from "formik";

const raportExts = ["pdf"];

const schema = Yup.object().shape({
  id: Yup.string().optional(),
  student_id: Yup.string().required("Siswa tidak boleh kosong"),
  academic_year: Yup.string().required("Tahun pelajaran tidak boleh kosong"),
  semester: Yup.date().required("Semester tidak boleh kosong"),
  file: Yup.mixed<File>()
    .nullable()
    .optional()
    .test(
      "is-valid-type",
      "File harus pdf atau gambar",
      (value) =>
        !value ||
        (value &&
          raportExts.includes(value.name.split(".").pop()?.toLowerCase() || ""))
    )
    .test(
      "is-valid-size",
      "Ukuran melebihi batas 5MB",
      (value) => !value || (value && value.size <= 5000000)
    ),
});

const RaportFile = () => {
  const { token } = Store(),
    { academicYear } = globalStore(),
    modalForm = "form-file-rapor-siswa",
    modalFile = "form-file-rapor-siswa-viewer";

  // filter
  const [search, setSearch] = useState("");
  const [pageMeta, setPageMeta] = useState<IpageMeta>({ page: 0, limit: 10 });
  const [filter, setFilter] = useState({
    classId: "",
    studentId: "",
    semester: "",
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
      const res = await FileRaporSiswa.showAll(
        token,
        filter.page,
        filter.limit,
        filter.search,
        filter.studentId,
        "",
        filter.semester,
        filter.classId,
        "Y"
      );

      const { result, ...meta } = res.data.data;

      setDataList(result);
      setPageMeta(meta);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Gagal Mengambil data file rapor siswa, silakan coba lain kali",
      });
    }
  };

  // create & edit
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

  useEffect(() => {
    getStudents();
  }, [academicYear, filter.classId]);

  const form = useFormik({
    initialValues: {
      id: "",
      student_id: "",
      academic_year: "",
      semester: "",
      file: "",
      file_path: "",
    },
    validationSchema: schema,
    validateOnChange: false,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(false);

      try {
        const formData = new FormData();
        formData.append("student_id", values.student_id);
        formData.append("academic_year", values.academic_year);
        formData.append("semester", values.semester);
        if (values.file) formData.append("file", values.file);

        values.id
          ? await FileRaporSiswa.update(token, values.id, formData)
          : await FileRaporSiswa.create(token, formData);

        handleReset();
        closeModal(modalForm);
        getDataList();

        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: `Berhasil ${values.id ? "mengedit" : "menambahkan"} file rapor siswa`,
        });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `Gagal ${values.id ? "mengedit" : "menambahkan"} file rapor siswa`,
        });
      } finally {
        setSubmitting(true);
      }
    },
  });

  useEffect(() => {
    getDataList();
  }, [filter]);

  const inpFile = useRef<HTMLInputElement>(null);

  const handleReset = () => {
    form.resetForm();
    if (inpFile.current) inpFile.current.value = "";
  };

  // handle get one
  const [isGetLoading, setIsGetLoading] = useState(false);
  const getData = async (id: string) => {
    setIsGetLoading(true);

    try {
      const res = await FileRaporSiswa.showOne(token, id);

      form.setValues({
        id: res.data.data?.id ?? "",
        student_id: res.data.data?.student_id ?? "",
        academic_year: res.data.data?.academic_year ?? "",
        semester: res.data.data?.semester ?? "",
        file: "",
        file_path: res.data.data?.file_path ?? "",
      });
      openModal(modalForm);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `Gagal mendapatkan data file rapor siswa`,
      });
    } finally {
      setIsGetLoading(false);
    }
  };

  // delete
  const [isDelLoading, setIsDelLoading] = useState(false);
  const deleteData = async (id: string, xtra: string) => {
    Swal.fire({
      icon: "question",
      title: "Anda Yakin?",
      text: `Aksi ini tidak dapat dibatalkan. Apakah Anda yakin ingin melanjutkan hapus ${xtra}?`,
      showCancelButton: true,
      confirmButtonText: "Yakin",
      cancelButtonText: "Batalkan",
    }).then(async (result) => {
      try {
        setIsDelLoading(true);
        if (result.isConfirmed) {
          await FileRaporSiswa.delete(token, id);

          Swal.fire({
            icon: "success",
            title: "Aksi Berhasil",
            text: "Berhasil menghapus data file rapor siswa",
          });

          getDataList();
        }
      } catch {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Gagal menghapus data file rapor siswa",
        });
      } finally {
        setIsDelLoading(false);
      }
    });
  };

  // view certificate
  const [isFileLoading, setIsFileLoading] = useState(false),
    [fileView, setFileView] = useState("");

  const viewFile = async (path?: string) => {
    setFileView("");
    if (!path) return;

    console.log(path);

    setIsFileLoading(true);
    try {
      const response = await FileRaporSiswa.downloadFile(token, path);
      const blob = new Blob([response.data], { type: "application/pdf" });
      setFileView(URL.createObjectURL(blob));
      openModal(modalFile);
    } catch (error: any) {
      let message = "Gagal mengunduh file rapor siswa";
      if (error.response?.status == 404)
        message = "File rapor siswa tidak ditemukan";

      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: message,
      });
    } finally {
      setIsFileLoading(false);
    }
  };

  return (
    <>
      <Modal id={modalFile}>
        <h3 className="text-xl font-bold mb-6">File Rapor Siswa</h3>
        <iframe
          src={fileView}
          frameBorder="0"
          width="100%"
          height="450px"
          className="mt-4"
        />
        <button
          onClick={() => closeModal(modalFile)}
          className="btn w-full btn-primary mt-10"
        >
          Tutup
        </button>
      </Modal>

      <Modal id={modalForm} onClose={handleReset}>
        <form onSubmit={form.handleSubmit}>
          <h3 className="text-xl font-bold mb-6">
            {form.values.id ? "Edit" : "Tambah"} File Rapor Siswa
          </h3>

          <Input
            label="Tahun pelajaran"
            placeholder="cth: 2023/2024"
            name="academic_year"
            value={form.values.academic_year}
            onChange={form.handleChange}
            errorMessage={form.errors.academic_year}
          />

          <Select
            label="Semester"
            name="semester"
            keyValue="value"
            keyDisplay="label"
            options={[
              {
                value: "1",
                label: "Ganjil",
              },
              {
                value: "2",
                label: "Genap",
              },
            ]}
            value={form.values.semester}
            onChange={form.handleChange}
            errorMessage={form.errors.semester}
          />

          {!form.values.id && (
            <>
              <Select
                label="Kelas"
                value={filter.classId}
                onChange={(e) => handleFilter("classId", e.target.value)}
                keyValue="id"
                displayBuilder={(opt) => `${opt.level}-${opt.class_name}`}
                options={classes}
              />

              <Select
                label="Siswa"
                name="student_id"
                keyValue="id"
                displayBuilder={(o) =>
                  `${o.nis ?? "-"} - ${o.full_name ?? "-"}`
                }
                options={students}
                value={form.values.student_id}
                onChange={form.handleChange}
                errorMessage={form.errors.student_id}
              />
            </>
          )}

          <Input
            label="File"
            name="file"
            type="file"
            ref={inpFile}
            accept={raportExts.map((ext) => "." + ext).join(", ")}
            // value={form.values.file}
            hint={
              form.values.file_path
                ? "File rapor sebelumnya akan tertimpa dengan file rapor baru"
                : ""
            }
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
            disabled={form.isSubmitting}
          >
            {form.isSubmitting ? "Menyimpan..." : "Simpan"}
          </button>
        </form>
      </Modal>

      {/* filter  */}
      <div className="w-full flex flex-wrap justify-end gap-2">
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
            placeholder="Semester"
            value={filter.semester}
            onChange={(e) => handleFilter("semester", e.target.value)}
            keyValue="value"
            keyDisplay="label"
            options={[
              {
                value: "1",
                label: "Ganjil",
              },
              {
                value: "2",
                label: "Genap",
              },
            ]}
          />
        </div>

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
          onClick={() => openModal(modalForm)}
          className="btn btn-secondary"
        >
          <FaPlus />
          Tambah
        </button>
      </div>

      {/* table  */}
      <div className="overflow-x-auto mt-3">
        <table className="table table-zebra">
          <thead className="bg-blue-300">
            <tr>
              <th>No</th>
              <th>Siswa</th>
              <th>Tahun pelajaran</th>
              <th>Semester</th>
              <th>File</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {dataList.map((dat, i) => (
              <tr key={i}>
                <th>{i + 1}</th>
                <td>{dat.student?.full_name ?? "-"}</td>
                <td>{dat.academic_year ?? "-"}</td>
                <td>
                  {dat.semester
                    ? dat.semester == "1"
                      ? "Ganjil"
                      : "Genap"
                    : "-"}
                </td>
                <td>
                  <button
                    className="btn flex btn-primary btn-sm btn-square tooltip"
                    data-tip="Lihat file"
                    disabled={!dat.file_path || isFileLoading}
                    onClick={() => viewFile(dat.file_path)}
                  >
                    <FaFile />
                  </button>
                </td>
                <td>
                  <div className="join">
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
                      disabled={isDelLoading}
                      onClick={() =>
                        deleteData(
                          dat.id,
                          `file rapor ${dat.student?.full_name ?? ""}`
                        )
                      }
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
    </>
  );
};

export default RaportFile;
