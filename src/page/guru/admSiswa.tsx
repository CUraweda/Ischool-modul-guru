import { useFormik } from "formik";
import { ChangeEvent, useEffect, useState } from "react";
import "react-day-picker/dist/style.css";
import { BiDownload, BiTrash } from "react-icons/bi";
import { BsEyeFill } from "react-icons/bs";
import { FaSearch } from "react-icons/fa";
import { FaListCheck, FaPenClip } from "react-icons/fa6";
import { FiPlus } from "react-icons/fi";
import { IoInformationCircleOutline } from "react-icons/io5";
import { VscTasklist } from "react-icons/vsc";
import { Document, Page } from "react-pdf";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import * as Yup from "yup";
import { Input } from "../../component/Input";
import Modal from "../../component/modal";
import {
  IpageMeta,
  PaginationControl,
} from "../../component/PaginationControl";
import { Student, Task } from "../../middleware/api";
import { globalStore } from "../../store/Store";

const schema = Yup.object({
  classId: Yup.string().required("required"),
  subjectId: Yup.string().required("required"),
  tahun: Yup.string().required("required"),
  semester: Yup.string().required("required"),
  topik: Yup.string().required("required"),
  jenis: Yup.string().required("required"),
  startDate: Yup.string().required("required"),
  endDate: Yup.string().required("required"),
  status: Yup.string().required("required"),
  description: Yup.string().required("required"),
});

const AdmSiswa = () => {
  const { academicYear } = globalStore();
  const navigate = useNavigate();

  const [task, setTask] = useState<any>([]);
  const [taskClass, setTaskClass] = useState<any>([]);
  const [kelas, setKelas] = useState<any[]>([]);
  const [mapel, setMapel] = useState<any[]>([]);
  const [file, setFile] = useState<any | null>(null);
  const [siswa, setSiswa] = useState<any>("all-student");
  const [DataSiswa, setDataSiswa] = useState<any[]>([]);
  const [feedback, setFeedback] = useState<string>("");
  const [idTugas, setIdTugas] = useState<string>("");
  // const [showFile, setShowFile] = useState<any>();
  const [level, setLevel] = useState<string>("");
  const [showFile, setShowFile] = useState<{ url?: string; isPdf: boolean }>({
    isPdf: false,
  });
  const [pageMeta, setPageMeta] = useState<IpageMeta>({ page: 0, limit: 10 });
  const [filter, setFilter] = useState({
    classId: "",
    search: "",
    page: 0,
    limit: 10,
  });

  const handleFilter = (key: string, value: any) => {
    const obj = {
      ...filter,
      [key]: value,
    };
    if (key != "page") obj["page"] = 0;
    setFilter(obj);
  };

  const [search, setSearch] = useState("");
  const [pageMetaSiswa, setPageMetaSiswa] = useState<IpageMeta>({
    page: 0,
    limit: 10,
  });
  const [filterSiswa, setFilterSiswa] = useState({
    search: "",
    page: 0,
    limit: 10,
  });

  const handleFilterSiswa = (key: string, value: any) => {
    const obj = {
      ...filterSiswa,
      [key]: value,
    };
    if (key != "page") obj["page"] = 0;
    setFilterSiswa(obj);
  };

  const formik = useFormik({
    initialValues: {
      classId: "",
      subjectId: "",
      tahun: academicYear,
      semester: "",
      description: "",
      topik: "",
      jenis: "",
      startDate: "",
      endDate: "",
      status: "",
    },
    validationSchema: schema,
    onSubmit: (values) => {
      console.log(values);
    },
  });
  useEffect(() => {
    getStudent();
    getClass();
  }, [formik?.values.classId, academicYear]);

  useEffect(() => {
    getTask();
    getTaskClass();
  }, [filter, filterSiswa]);

  useEffect(() => {
    getMapel();
  }, [level]);

  useEffect(() => {
    getTask();
  }, [level, academicYear]);

  const showModal = (props: string) => {
    let modalElement = document.getElementById(props) as HTMLDialogElement;
    if (modalElement) {
      modalElement.showModal();
      getClass();
    }
  };

  const closeModal = (props: string) => {
    let modalElement = document.getElementById(props) as HTMLDialogElement;
    if (modalElement) {
      modalElement.close();
    }
  };

  const getTask = async () => {
    try {
      const response = await Task.GetAll(
        filterSiswa.search,
        filter.classId,
        academicYear,
        filterSiswa.page,
        filterSiswa.limit,
        "Y"
      );
      const { result, ...meta } = response.data.data;
      setTask(result);
      setPageMetaSiswa(meta);
    } catch (error) {
      console.log(error);
    }
  };
  const getTaskClass = async () => {
    try {
      const response = await Task.GetAllTask(
        filter.search,
        filter.classId,
        filter.page,
        filter.limit,
        "Y"
      );
      const { result, ...meta } = response.data.data;
      setTaskClass(result);
      setPageMeta(meta);
    } catch (error) {
      console.log(error);
    }
  };

  const getClass = async () => {
    const response = await Task.GetAllClass(0, 20, "Y");
    const kelasData = response.data.data.result;
    const kelasFilter = kelasData.filter(
      (value: any) => value.id == formik.values.classId
    );
    setLevel(kelasFilter[0]?.level);
    console.log("level", kelasFilter[0]?.level);

    setKelas(kelasData);
  };

  const getMapel = async () => {
    const response = await Task.GetAllMapel(0, "Y", 100);
    const mapelData = response.data.data.result;
    const mapelFilter = mapelData.filter((value: any) => value.level == level);
    setMapel(mapelFilter);
  };
  const getStudent = async () => {
    const classId = formik.values.classId;
    if (!classId || !academicYear) return;
    const response = await Student.GetStudentByClass(classId, academicYear);
    setDataSiswa(response.data.data);
  };

  const formatDate = (date: string) => {
    let Newdate = new Date(date);
    let formattedDate = Newdate.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    return formattedDate;
  };
  const delay = (ms: any) => new Promise((res) => setTimeout(res, ms));
  const createTugas = async () => {
    const {
      classId,
      subjectId,
      description,
      topik,
      startDate,
      endDate,
      status,
      jenis,
    } = formik.values;

    const formData = new FormData();
    formData.append("class_id", classId);
    formData.append("subject_id", subjectId);
    formData.append("topic", topik);
    formData.append("task_category_id", jenis);
    formData.append("start_date", startDate);
    formData.append("end_date", endDate);
    formData.append("status", status == "1" ? "Open" : "Close");
    formData.append("up_file", file);
    formData.append("description", description);

    try {
      await Task.createTaskClass(formData);
      formik.resetForm({ values: formik.initialValues });
      closeModal("add-task");
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Data Berhasil Disimpan Refresh kembali jika data tidak muncul",
        showConfirmButton: false,
        timer: 3000,
      });
      getTaskClass();
      // await delay(2500);
      // location.reload();
    } catch (error: any) {
      closeModal("add-task");
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.message,
      });
      console.log(error);
    }
  };
  const createTugasSiswa = async () => {
    const {
      subjectId,
      tahun,
      topik,
      description,
      startDate,
      endDate,
      status,
      semester,
      jenis,
    } = formik.values;

    const formData = new FormData();
    formData.append("student_class_id", siswa);
    formData.append("academic_year", tahun);
    formData.append("semester", semester);
    formData.append("subject_id", subjectId);
    formData.append("topic", topik);
    formData.append("description", description);
    formData.append("task_category_id", jenis);
    formData.append("characteristic", jenis);
    formData.append("start_date", startDate);
    formData.append("end_date", endDate);
    formData.append("status", status == "1" ? "Open" : "Close");
    formData.append("up_file", file);

    try {
      await Task.createTask(formData);
      formik.resetForm({ values: formik.initialValues });
      closeModal("add-task");
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Data Berhasil Disimpan Refresh kembali jika data tidak muncul",
        showConfirmButton: false,
        timer: 3000,
      });
      getClass();
      await delay(2500);
      // location.reload();
    } catch (error: any) {
      closeModal("add-task");
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.message,
      });
      console.log(error);
    }
  };

  const handleCreate = () => {
    if (siswa === "all-student") {
      createTugas();
    } else {
      createTugasSiswa();
    }
  };

  const handleFile = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      const allowedTypes = [
        "application/pdf",
        "image/png",
        "image/jpg",
        "image/jpeg",
      ];

      if (!allowedTypes.includes(selectedFile.type)) {
        console.warn("Please upload a PDF file");
        setFile(null);
        return;
      }
      setFile(selectedFile);
      console.log(selectedFile);
    } else {
      console.warn("No file selected");
      setFile(null);
    }
  };

  const deleteTask2 = async (id: number) => {
    await Task.deleteTask(id);
    Swal.fire({
      title: "Deleted!",
      text: "Your file has been deleted.",
      icon: "success",
    });
    getTask();
  };

  const deleteTask = async (id: number) => {
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
          deleteTask2(id);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const deleteTaskClass = async (id: number) => {
    await Task.deleteTaskClass(id);
    Swal.fire({
      title: "Deleted!",
      text: "Your file has been deleted.",
      icon: "success",
    });
    getTaskClass();
  };

  const deleteTaskClass2 = async (id: number) => {
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
          deleteTaskClass(id);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleDetailTask = async (id: number) => {
    sessionStorage.setItem("idTask", `${id}`);
    navigate("/guru/task/siswa");
  };

  const handleEdit = async (data: any) => {
    showModal("edit-task");
    setIdTugas(data.id);
    getTaskById(data.id);
  };

  const handleEditTaskClass = async () => {
    const {
      classId,
      subjectId,
      topik,
      startDate,
      endDate,
      status,
      jenis,
      description,
    } = formik.values;

    const formData = new FormData();
    formData.append("class_id", classId);
    formData.append("subject_id", subjectId);
    formData.append("topic", topik);
    formData.append("description", description);
    formData.append("task_category_id", jenis);
    formData.append("start_date", startDate);
    formData.append("end_date", endDate);
    formData.append("status", status == "1" ? "Open" : "Close");

    try {
      await Task.editTaskClass(idTugas, formData);
      closeModal("edit-task");
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Data Berhasil Disimpan",
        showConfirmButton: false,
        timer: 1500,
      });
      formik.resetForm({ values: formik.initialValues });
      getTaskClass();
    } catch (error: any) {
      closeModal("edit-task");
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.message,
      });
      console.log(error);
    }
  };

  const formatDateFormik = (date: any) => {
    const tanggal = new Date(date);
    const year = tanggal.getFullYear();
    const bulan = ("0" + (tanggal.getMonth() + 1)).slice(-2);
    const day = ("0" + tanggal.getDate()).slice(-2);
    const hours = ("0" + tanggal.getHours()).slice(-2);
    const minutes = ("0" + tanggal.getMinutes()).slice(-2);

    const formattedDate = `${year}-${bulan}-${day}T${hours}:${minutes}`;
    return formattedDate;
  };

  const getTaskById = async (id: string | null) => {
    try {
      const response = await Task.getTaskById(id);
      const data = response.data.data;
      formik.setFieldValue("classId", data.class.id);
      formik.setFieldValue("subjectId", data.subject.id);
      formik.setFieldValue("topik", data.topic);
      formik.setFieldValue("description", data.description);
      formik.setFieldValue("jenis", data.task_category_id);
      formik.setFieldValue("startDate", formatDateFormik(data.start_date));
      formik.setFieldValue("endDate", formatDateFormik(data.end_date));
      formik.setFieldValue("status", data.status == "Open" ? "1" : "2");
    } catch (error) {
      console.log(error);
    }
  };

  const downloadFileTugas = async (path: string) => {
    try {
      const response = await Task.downloadTugas(path);
      const urlParts = path.split("/");
      const fileName = urlParts.pop() || "";
      const blobUrl = window.URL.createObjectURL(new Blob([response.data]));

      // Simpan URL blob ke state

      // Tetap menyediakan opsi download jika diperlukan
      const link = document.createElement("a");
      link.href = blobUrl;
      link.setAttribute("download", fileName);
      link.style.display = "none";

      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download Error:", error);
    }
  };

  const showFileTugas = async (path: string) => {
    try {
      const response = await Task.downloadTugas(path);
      downloadFileTugas(path);
      // Convert path to lowercase to make comparison case-insensitive
      const lowerCasePath = path.toLowerCase();

      let mimeType = "application/pdf";
      let isPdf = false;

      if (lowerCasePath.endsWith(".png")) {
        mimeType = "image/png";
      } else if (
        lowerCasePath.endsWith(".jpg") ||
        lowerCasePath.endsWith(".jpeg")
      ) {
        mimeType = "image/jpeg";
      } else if (lowerCasePath.endsWith(".pdf")) {
        isPdf = true;
      } else {
        throw new Error("Unsupported file type");
      }

      const blob = new Blob([response.data], { type: mimeType });
      const blobUrl = window.URL.createObjectURL(blob);

      setShowFile({ url: blobUrl, isPdf });
      console.log(showFile.url, showFile.isPdf);
    } catch (error) {
      console.error("Show File Error:", error);
    }
  };

  useEffect(() => {
    formik.setFieldValue("tahun", academicYear);
  }, [academicYear]);

  const handleAddFeedback = async () => {
    try {
      const data = {
        feed_fwd: feedback,
      };
      const response = await Task.editTask(idTugas, data);
      console.log(response);
      closeModal("add-feedback");
      getTask();
    } catch (error: any) {
      closeModal("add-feedback");
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error?.message,
      });
    }
  };
  return (
    <>
      <div className="w-full flex flex-col items-center p-3 overflow-x-auto">
        <div className="my-10 flex flex-col text-center">
          <span className="text-4xl font-bold">Daftar Tugas</span>
          {/* <span>Kelas II</span> */}
        </div>

        <div role="tablist" className="tabs tabs-lifted w-full">
          <input
            type="radio"
            name="my_tabs_2"
            role="tab"
            className="tab bg-blue-300 font-bold whitespace-nowrap"
            aria-label="Semua Tugas"
            defaultChecked
          />
          <div
            role="tabpanel"
            className="tab-content bg-base-100 border-base-300 rounded-box rounded-ss-none p-6"
          >
            <div className="w-full gap-3 flex flex-wrap">
              <span className="text-2xl font-bold me-auto">Tugas Siswa</span>
              <select
                className="select select-bordered"
                value={filter.classId}
                onChange={(e) => {
                  handleFilter("classId", e.target.value);
                  formik.setFieldValue("classId", e.target.value);
                }}
              >
                <option selected>Kelas</option>
                {kelas?.map((item: any, index: number) => (
                  <option
                    value={item.id}
                    key={index}
                  >{`${item.level}-${item.class_name}`}</option>
                ))}
              </select>
              <button
                className="btn bg-green-500 text-white font-bold"
                onClick={() => showModal("add-task")}
              >
                <span className="text-xl">
                  <FiPlus />
                </span>{" "}
                Tambah
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="table table-zebra mt-5">
                {/* head */}
                <thead className="bg-blue-200">
                  <tr>
                    <th>No</th>
                    <th>Topik</th>
                    <th>Deskripsi</th>
                    <th>Mapel</th>
                    <th>Kelas</th>
                    <th>Tgl Mulai</th>
                    <th>Tgl Selesai</th>
                    <th>Jenis</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {taskClass?.map((item: any, index: number) => (
                    <tr key={index}>
                      <th>
                        {index +
                          1 +
                          (pageMeta?.page ?? 0) * (pageMeta?.limit ?? 0)}
                      </th>
                      <td>{item?.topic}</td>
                      <td>{item?.description}</td>
                      <td>{item?.subject.name}</td>
                      <td>{item?.class?.class_name}</td>
                      <td>{formatDate(item?.start_date)}</td>
                      <td>{formatDate(item?.end_date)}</td>
                      <td>
                        {item?.task_category_id == 1
                          ? "WWP"
                          : item?.task_category_id == 2
                            ? "Project Kelompok"
                            : "Prbadi"}
                      </td>
                      <td>{item?.status}</td>
                      <td className="join text-white">
                        <button
                          className="btn btn-sm btn-ghost bg-orange-600 text-xl join-item tooltip"
                          data-tip="Edit"
                          onClick={() => handleEdit(item)}
                        >
                          <FaPenClip />
                        </button>
                        <button
                          className="btn btn-sm btn-ghost bg-red-600 text-xl join-item tooltip"
                          data-tip="Hapus"
                          onClick={() => deleteTaskClass2(item.id)}
                        >
                          <BiTrash />
                        </button>
                        <button
                          className="btn btn-sm btn-ghost bg-blue-600 text-xl join-item tooltip"
                          data-tip="Detail"
                          onClick={() => handleDetailTask(item.id)}
                        >
                          <FaListCheck />
                        </button>
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
          </div>

          <input
            type="radio"
            name="my_tabs_2"
            role="tab"
            className="tab bg-blue-300 font-bold whitespace-nowrap"
            aria-label="Tugas Siswa"
          />
          <div
            role="tabpanel"
            className="tab-content bg-base-100 border-base-300 rounded-box rounded-ss-none p-6"
          >
            <div className="flex gap-3 items-center flex-wrap">
              <p className="text-xl font-bold me-auto">
                Tugas Berdasarkan Siswa
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleFilterSiswa("search", search);
                }}
                className="join-item input input-bordered flex items-center gap-2"
              >
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  type="text"
                  placeholder="Cari"
                  className="grow"
                />
                <FaSearch />
              </form>
            </div>

            <div className="overflow-x-auto">
              <table className="table table-zebra mt-5">
                {/* head */}
                <thead className="bg-blue-200">
                  <tr>
                    <th>No</th>
                    <th>Nama Siswa</th>
                    <th>Topik</th>
                    <th>Deskripsi</th>
                    <th>Mapel</th>
                    <th>Tgl Mulai</th>
                    <th>Tgl Selesai</th>
                    <th>Jenis</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {task?.map((item: any, index: number) => (
                    <tr key={index}>
                      <th>
                        {index +
                          1 +
                          (pageMetaSiswa?.page ?? 0) *
                            (pageMetaSiswa?.limit ?? 0)}
                      </th>
                      <td>{item?.studentclass?.student?.full_name}</td>
                      <td>{item?.topic}</td>
                      <td>{item?.description}</td>
                      <td>{item?.subject.name}</td>
                      <td>{formatDate(item?.start_date)}</td>
                      <td>{formatDate(item?.end_date)}</td>
                      <td>
                        {item?.characteristic == 1
                          ? "WWP"
                          : item?.characteristic == 2
                            ? "Project Kelompok"
                            : "Prbadi"}
                      </td>
                      <td>{item?.status}</td>
                      <td className="join text-white">
                        <button
                          className="btn btn-sm btn-ghost bg-red-600 text-xl join-item tooltip"
                          data-tip="hapus tugas"
                          onClick={() => deleteTask(item.id)}
                        >
                          <BiTrash />
                        </button>
                        <button
                          className={`btn btn-sm btn-ghost bg-orange-600 text-xl join-item tooltip`}
                          data-tip="download file Tugas"
                          onClick={() => {
                            showFileTugas(item?.up_file),
                              showModal("show-file");
                          }}
                        >
                          <BsEyeFill />
                        </button>
                        <button
                          className={`${
                            !item?.down_file ? "btn-disabled" : ""
                          } btn btn-sm btn-ghost bg-blue-600 text-xl join-item tooltip`}
                          data-tip="download tugas siswa"
                          onClick={() => downloadFileTugas(item?.down_file)}
                        >
                          <BiDownload />
                        </button>

                        <button
                          className={`${
                            !item?.down_file ? "btn-disabled" : ""
                          } btn btn-sm btn-ghost bg-green-600 text-xl join-item tooltip`}
                          data-tip="feedback"
                          onClick={() => {
                            setIdTugas(item.id), showModal("add-feedback");
                          }}
                        >
                          <VscTasklist />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <PaginationControl
              meta={pageMetaSiswa}
              onPrevClick={() =>
                handleFilterSiswa("page", pageMetaSiswa.page - 1)
              }
              onNextClick={() =>
                handleFilterSiswa("page", pageMetaSiswa.page + 1)
              }
              onJumpPageClick={(val) => handleFilterSiswa("page", val)}
              onLimitChange={(val) => handleFilterSiswa("limit", val)}
            />
          </div>
        </div>
      </div>

      <Modal id="add-task">
        <div className="w-full flex flex-col items-center">
          <span className="text-xl font-bold">Tugas</span>
          <div className="flex w-full mt-5 flex-col">
            <Input label="Tahun pelajaran" value={academicYear} disabled />

            <div className="w-full flex flex-col gap-2">
              <label className="mt-4 font-bold">Kelas</label>
              <select
                className="select select-bordered bg-white"
                onChange={(e) =>
                  formik.setFieldValue("classId", e.target.value)
                }
              >
                <option selected>Pick one</option>
                {kelas?.map((item: any, index: number) => (
                  <option
                    value={item.id}
                    key={index}
                  >{`${item.level}-${item.class_name}`}</option>
                ))}
              </select>
            </div>
            <div className="w-full flex flex-col gap-2">
              <label className="mt-4 font-bold">Siswa</label>
              <select
                value={siswa}
                className="select select-bordered bg-white"
                onChange={(e) => setSiswa(e.target.value)}
              >
                <option value="all-student">Semua Siswa</option>
                {DataSiswa?.map((item: any, index: number) => (
                  <option value={item?.id} key={index}>
                    {item?.student?.full_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-full flex flex-col gap-2">
              <label className="mt-4 font-bold">Pelajaran</label>
              <select
                className="select select-bordered bg-white"
                onChange={(e) =>
                  formik.setFieldValue("subjectId", e.target.value)
                }
              >
                <option selected>Pick one</option>
                {mapel?.map((item: any, index: number) => (
                  <option value={item.id} key={index}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
            {/* 
            <div
              className={`w-full flex flex-col gap-2 ${
                siswa === "all-student" ? "hidden" : ""
              }`}
            >
              <label className="mt-4 font-bold">Tahun Pelajaran</label>
              <select
                className="input input-bordered w-full"
                value={formik.values.tahun}
                onChange={(e) => formik.setFieldValue("tahun", e.target.value)}
              >
                <option value="" disabled selected>
                  Pilih Tahun Pelajaran
                </option>
                {TahunAjaran?.map((list: any, index: any) => (
                  <option key={index} value={list.name}>
                    {list.name}
                  </option>
                ))}
              </select>
            </div> */}
            <div
              className={`w-full flex flex-col gap-2 ${
                siswa === "all-student" ? "hidden" : ""
              }`}
            >
              <label className="mt-4 font-bold">Semester</label>
              <select
                className="select select-bordered bg-white"
                onChange={(e) =>
                  formik.setFieldValue("semester", e.target.value)
                }
              >
                <option selected>Pick one</option>
                <option value={1}>Ganjil</option>
                <option value={2}>Genap</option>
              </select>
            </div>
            <div className="w-full flex flex-col gap-2">
              <label className="mt-4 font-bold">Topik</label>
              <input
                type="text"
                className="input input-bordered w-full"
                onChange={(e) => formik.setFieldValue("topik", e.target.value)}
              />
            </div>
            {/* {siswa === "all-student" ? ( */}
            <div className="w-full flex flex-col gap-2">
              <label className="mt-4 font-bold">Deskripsi</label>
              <input
                type="text"
                className="input input-bordered w-full"
                onChange={(e) =>
                  formik.setFieldValue("description", e.target.value)
                }
              />
            </div>
            {/* ) : null} */}
          </div>
          <div className="w-full">
            <div className="w-full flex flex-col gap-2">
              <label className="mt-4 font-bold">Kategori</label>
              <select
                className="select select-bordered bg-white"
                onChange={(e) => formik.setFieldValue("jenis", e.target.value)}
              >
                <option disabled selected>
                  Pick one
                </option>
                <>
                  <option value={2}>Project Kelompok</option>
                  <option value={1}>WWP</option>
                  <option value={3}>Mandiri</option>
                </>
              </select>
              <label className="mt-4 w-full font-bold">Periode</label>
              <div className="w-full flex gap-2 justify-center items-center">
                <input
                  type="datetime-local"
                  className="input input-bordered bg-white w-2/4"
                  onChange={(e) =>
                    formik.setFieldValue("startDate", e.target.value)
                  }
                />
                <span>-</span>
                <input
                  type="datetime-local"
                  value={formik.values.endDate}
                  className="input input-bordered bg-white"
                  onChange={(e) =>
                    formik.setFieldValue("endDate", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="w-full flex flex-col gap-2">
              <label className="mt-4 font-bold">Status</label>
              <select
                className="select select-bordered bg-white"
                onChange={(e) => formik.setFieldValue("status", e.target.value)}
              >
                <option disabled selected>
                  Pick one
                </option>
                <option value={1}>Open</option>
                <option value={2}>Close</option>
              </select>
            </div>
            <div className="w-full mt-5 gap-2 flex flex-col">
              <div className="flex items-center mt-4 gap-2">
                <label className=" font-bold">Upload File</label>
                <div
                  className="tooltip"
                  data-tip="Format Penugasan PDF, JPG, JPEG, PNG"
                >
                  <IoInformationCircleOutline />
                </div>
              </div>
              <input
                type="file"
                onChange={handleFile}
                className="file-input file-input-bordered w-full"
                accept=".pdf,.png,.jpg,.jpeg"
              />
            </div>
          </div>

          <div className="w-full flex justify-center mt-10 gap-2">
            <button
              className="btn bg-green-500 text-white font-bold w-full"
              onClick={handleCreate}
            >
              Submit
            </button>
            {/* <button className="btn bg-green-500 text-white font-bold">Submit</button> */}
          </div>
        </div>
      </Modal>
      <Modal id="edit-task">
        <div className="w-full flex flex-col items-center">
          <span className="text-xl font-bold">Tugas</span>
          <div className="flex w-full mt-5 flex-col">
            <div className="w-full flex flex-col gap-2">
              <label className="mt-4 font-bold">Kelas</label>
              <select
                className="select select-bordered bg-white"
                value={formik.values.classId}
                onChange={(e) =>
                  formik.setFieldValue("classId", e.target.value)
                }
              >
                <option disabled selected>
                  Pick one
                </option>
                {kelas?.map((item: any, index: number) => (
                  <option
                    value={item.id}
                    key={index}
                  >{`${item.level}-${item.class_name}`}</option>
                ))}
              </select>
            </div>
            <div className="w-full flex flex-col gap-2">
              <label className="mt-4 font-bold">Siswa</label>
              <select
                value={siswa}
                className="select select-bordered bg-white"
                onChange={(e) => setSiswa(e.target.value)}
              >
                <option value="all-student">Semua Siswa</option>
                {DataSiswa?.map((item: any, index: number) => (
                  <option value={item?.id} key={index}>
                    {item?.student?.full_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-full flex flex-col gap-2">
              <label className="mt-4 font-bold">Pelajaran</label>
              <select
                className="select select-bordered bg-white"
                value={formik.values.subjectId}
                onChange={(e) =>
                  formik.setFieldValue("subjectId", e.target.value)
                }
              >
                <option disabled selected>
                  Pick one
                </option>
                {mapel?.map((item: any, index: number) => (
                  <option value={item.id} key={index}>
                    {item.name} - {item.level}
                  </option>
                ))}
              </select>
            </div>
            <div className={`w-full flex flex-col gap-2`}>
              <label className="mt-4 font-bold">Deskripsi</label>
              <input
                type="text"
                className="input input-bordered w-full"
                value={formik.values.description}
                onChange={(e) =>
                  formik.setFieldValue("description", e.target.value)
                }
              />
            </div>
            <div
              className={`w-full flex flex-col gap-2 ${
                siswa === "all-student" ? "hidden" : ""
              }`}
            >
              <label className="mt-4 font-bold">Tahun Pelajaran</label>
              <input
                type="text"
                value={formik.values.tahun}
                className="input input-bordered w-full"
                onChange={(e) => formik.setFieldValue("tahun", e.target.value)}
              />
            </div>

            <div
              className={`w-full flex flex-col gap-2 ${
                siswa === "all-student" ? "hidden" : ""
              }`}
            >
              <label className="mt-4 font-bold">Semester</label>
              <select
                className="select select-bordered bg-white"
                value={formik.values.semester}
                onChange={(e) =>
                  formik.setFieldValue("semester", e.target.value)
                }
              >
                <option disabled selected>
                  Pick one
                </option>
                <option value={1}>1</option>
                <option value={2}>2</option>
              </select>
            </div>
            <div className="w-full flex flex-col gap-2">
              <label className="mt-4 font-bold">Topik</label>
              <input
                type="text"
                className="input input-bordered w-full"
                value={formik.values.topik}
                onChange={(e) => formik.setFieldValue("topik", e.target.value)}
              />
            </div>
          </div>
          <div className="w-full">
            <div className="w-full flex flex-col gap-2">
              <label className="mt-4 font-bold">Kategori</label>
              <select
                className="select select-bordered bg-white"
                value={formik.values.jenis}
                onChange={(e) => formik.setFieldValue("jenis", e.target.value)}
              >
                <option disabled selected>
                  Pick one
                </option>
                <option value={2}>Project Kelompok</option>
                <option value={1}>WWP</option>
                <option value={3}>Mandiri</option>
              </select>
              <label className="mt-4 w-full font-bold">Periode</label>
              <div className="flex gap-2 justify-center items-center">
                <input
                  type="datetime-local"
                  className="input input-bordered bg-white"
                  value={formik.values.startDate}
                  onChange={(e) =>
                    formik.setFieldValue("startDate", e.target.value)
                  }
                />
                <span>-</span>
                <input
                  type="datetime-local"
                  value={formik.values.endDate}
                  className="input input-bordered bg-white"
                  onChange={(e) =>
                    formik.setFieldValue("endDate", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="w-full flex flex-col gap-2">
              <label className="mt-4 font-bold">Status</label>
              <select
                className="select select-bordered bg-white"
                value={formik.values.status}
                onChange={(e) => formik.setFieldValue("status", e.target.value)}
              >
                <option disabled selected>
                  Pick one
                </option>
                <option value={"Open"}>Open</option>
                <option value={"Close"}>Close</option>
              </select>
            </div>
            <div className="w-full mt-5 gap-2 flex flex-col">
              <label className="mt-4 font-bold">Upload File</label>
              <input
                type="file"
                onChange={handleFile}
                className="file-input file-input-bordered w-full"
              />
            </div>
          </div>

          <div className="w-full flex justify-center mt-10 gap-2">
            <button
              className="btn bg-green-500 text-white font-bold w-full"
              onClick={handleEditTaskClass}
            >
              Submit
            </button>
            {/* <button className="btn bg-green-500 text-white font-bold">Submit</button> */}
          </div>
        </div>
      </Modal>

      <Modal id={"add-feedback"}>
        <div className="w-full flex justify-center flex-col items-center">
          <span className="text-xl font-bold mb-4">Feedback</span>
          <textarea
            className="textarea textarea-bordered w-full"
            placeholder="Feedback"
            onChange={(e) => setFeedback(e.target.value)}
          ></textarea>
          <button
            className="btn btn-ghost bg-green-500 text-white mt-5 w-full"
            onClick={handleAddFeedback}
          >
            Submit
          </button>
        </div>
      </Modal>

      <Modal id={"show-file"} width="w-11/12 max-w-5xl">
        <div className="w-full flex flex-col items-center min-h-svh">
          {showFile.isPdf ? (
            <div className="w-full min-h-svh mt-5">
              <Document file={showFile.url} onLoadError={console.error}>
                <Page pageNumber={1} />
              </Document>
              <iframe className="w-full min-h-svh mt-5" src={showFile.url} />
            </div>
          ) : (
            <iframe className="w-full min-h-svh mt-5" src={showFile.url} />
          )}
        </div>
      </Modal>
    </>
  );
};

export default AdmSiswa;
