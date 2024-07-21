import { useState, useEffect, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { FiPlus } from "react-icons/fi";
import Modal from "../../component/modal";
import "react-day-picker/dist/style.css";
import { FaListCheck, FaPenClip } from "react-icons/fa6";
import { IoInformationCircleOutline } from "react-icons/io5";
import { BiDownload, BiTrash } from "react-icons/bi";
import { Task, Student } from "../../midleware/api";
import { Store } from "../../store/Store";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { VscTasklist } from "react-icons/vsc";
import { BsEyeFill } from "react-icons/bs";

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
});

const AdmSiswa = () => {
  const { token } = Store();
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
  const [showFile, setShowFile] = useState<any>();
  const [level, setLevel] = useState<string>("");

  const formik = useFormik({
    initialValues: {
      classId: "",
      subjectId: "",
      tahun: "",
      semester: "",
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
  }, [formik?.values.classId]);

  useEffect(() => {
    getTask();
    getTaskClass();
  }, []);

  useEffect(() => {
    getMapel();
    getTask();
  }, [level]);

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
      const response = await Task.GetAll(token, 0, 20);
      setTask(response.data.data.result);
    } catch (error) {
      console.log(error);
    }
  };
  const getTaskClass = async () => {
    try {
      const response = await Task.GetAllTask(token, 0, 20);
      setTaskClass(response.data.data.result);
    } catch (error) {
      console.log(error);
    }
  };

  const getClass = async () => {
    const response = await Task.GetAllClass(token, 0, 20);
    const kelasData = response.data.data.result;
    const kelasFilter = kelasData.filter(
      (value: any) => value.id == formik.values.classId
    );
    setLevel(kelasFilter[0]?.level);
    console.log("level", kelasFilter[0]?.level);

    setKelas(kelasData);
  };

  const getMapel = async () => {
    const response = await Task.GetAllMapel(token, 0, 100);
    const mapelData = response.data.data.result;
    const mapelFilter = mapelData.filter((value: any) => value.level == level);
    setMapel(mapelFilter);
  };

  const getStudent = async () => {
    const classId = formik.values.classId;
    const idClass = classId ? parseInt(classId) : null;
    const response = await Student.GetStudentByClass(
      token,
      idClass,
      "2023/2024"
    );
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

  const createTugas = async () => {
    const { classId, subjectId, topik, startDate, endDate, status, jenis } =
      formik.values;

    const formData = new FormData();
    formData.append("class_id", classId);
    formData.append("subject_id", subjectId);
    formData.append("topic", topik);
    formData.append("task_category_id", jenis);
    formData.append("start_date", startDate);
    formData.append("end_date", endDate);
    formData.append("status", status == "1" ? "Open" : "Close");
    formData.append("task_file", file);

    try {
      await Task.createTaskClass(token, formData);
      formik.resetForm({ values: formik.initialValues });
      closeModal("add-task");
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Data Berhasil Disimpan",
        showConfirmButton: false,
        timer: 3000,
      });
      getTaskClass();
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
    formData.append("task_category_id", jenis);
    formData.append("characteristic", jenis);
    formData.append("start_date", startDate);
    formData.append("end_date", endDate);
    formData.append("status", status == "1" ? "Open" : "Close");
    formData.append("up_file", file);

    try {
      await Task.createTask(token, formData);
      formik.resetForm({ values: formik.initialValues });
      closeModal("add-task");
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Data Berhasil Disimpan",
        showConfirmButton: false,
        timer: 3000,
      });
      getClass();
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
      if (selectedFile.type !== "application/pdf") {
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
    await Task.deleteTask(token, id);
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
    await Task.deleteTaskClass(token, id);
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

  const handleEdit = async (id: string) => {
    showModal("edit-task");
    setIdTugas(id);
    getTaskById(id);
  };

  const handleEditTaskClass = async () => {
    const { classId, subjectId, topik, startDate, endDate, status, jenis } =
      formik.values;

    const formData = new FormData();
    formData.append("class_id", classId);
    formData.append("subject_id", subjectId);
    formData.append("topic", topik);
    formData.append("task_category_id", jenis);
    formData.append("start_date", startDate);
    formData.append("end_date", endDate);
    formData.append("status", status == "1" ? "Open" : "Close");

    try {
      await Task.editTaskClass(token, idTugas, formData);
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
      const response = await Task.getTaskById(token, id);
      const data = response.data.data;
      formik.setFieldValue("classId", data.class.id);
      formik.setFieldValue("subjectId", data.subject.id);
      formik.setFieldValue("topik", data.topic);
      formik.setFieldValue("jenis", data.task_category_id);
      formik.setFieldValue("startDate", formatDateFormik(data.start_date));
      formik.setFieldValue("endDate", formatDateFormik(data.end_date));
      formik.setFieldValue("status", data.status == "Open" ? "1" : "2");
    } catch (error) {
      console.log(error);
    }
  };

  const downloadTugas = async (path: string) => {
    try {
      const response = await Task.downloadTugas(token, path);
      const urlParts = path.split("/");
      const fileName = urlParts.pop() || "";
      const blobUrl = window.URL.createObjectURL(response.data);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.setAttribute("download", fileName);
      link.style.display = "none";

      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.log(error);
    }
  };
  const showFileTugas = async (path: string) => {
    try {
      const response = await Task.downloadTugas(token, path);
      const blob = new Blob([response.data], { type: "application/pdf" }); //
      const blobUrl = window.URL.createObjectURL(blob);

      setShowFile(blobUrl);
    } catch (error) {
      console.log(error);
    }
  };
  const getTahunAjaran = (startYear: any, endYear: any) => {
    const currentYear = new Date().getFullYear();
    const start = currentYear - startYear;
    const end = currentYear + endYear;
    const years = [];

    for (let year = start; year <= end; year++) {
      const year1 = year;
      const year2 = year1 + 1;
      years.push(`${year1}/${year2}`);
    }

    return years;
  };

  const tahunAjaranOptions = getTahunAjaran(1, 0);
  const handleAddFeedback = async () => {
    try {
      const data = {
        feed_fwd: feedback,
      };
      const response = await Task.editTask(token, idTugas, data);
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
      <div className="w-full flex flex-col items-center">
        <div className="my-10 flex flex-col text-center">
          <span className="text-4xl font-bold">Daftar Tugas</span>
          {/* <span>Kelas II</span> */}
        </div>

        <div className="overflow-x-auto w-full flex flex-col p-5 my-10 justify-center bg-white">
          <div className="w-full justify-between bg-red flex">
            <span className="text-2xl font-bold">Tugas Siswa</span>
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
                    <th>{index + 1}</th>
                    <td>{item?.topic}</td>
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
                        onClick={() => handleEdit(item.id)}
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
          <div className="overflow-x-auto mt-10">
            <p className="text-xl font-bold">Tugas Berdasarkan Siswa</p>
            <table className="table table-zebra mt-5">
              {/* head */}
              <thead className="bg-blue-200">
                <tr>
                  <th>No</th>
                  <th>Nama Siswa</th>
                  <th>Topik</th>
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
                    <th>{index + 1}</th>
                    <td>{item?.studentclass?.student?.full_name}</td>
                    <td>{item?.topic}</td>
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
                          showFileTugas(item?.up_file), showModal("show-file");
                        }}
                      >
                        <BsEyeFill />
                      </button>
                      <button
                        className={`${
                          !item?.down_file ? "btn-disabled" : ""
                        } btn btn-sm btn-ghost bg-blue-600 text-xl join-item tooltip`}
                        data-tip="download tugas siswa"
                        onClick={() => downloadTugas(item?.down_file)}
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
        </div>
      </div>

      <Modal id="add-task">
        <div className="w-full flex flex-col items-center">
          <span className="text-xl font-bold">Tugas</span>
          <div className="flex w-full mt-5 flex-col">
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

            <div
              className={`w-full flex flex-col gap-2 ${
                siswa === "all-student" ? "hidden" : ""
              }`}
            >
              <label className="mt-4 font-bold">Tahun Pelajaran</label>
              <select
                className="input input-bordered w-full"
                onChange={(e) => formik.setFieldValue("tahun", e.target.value)}
              >
                <option value="" disabled selected>
                  Pilih Tahun Pelajaran
                </option>
                {tahunAjaranOptions.map((tahun, index) => (
                  <option key={index} value={tahun}>
                    {tahun}
                  </option>
                ))}
              </select>
            </div>
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
                <option value={1}>1</option>
                <option value={2}>2</option>
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
                <option value={2}>Project Kelompok</option>
                <option value={1}>WWP</option>
                <option value={3}>Mandiri</option>
              </select>
              <label className="mt-4 w-full font-bold">Periode</label>
              <div className="flex gap-2 justify-center items-center">
                <input
                  type="datetime-local"
                  className="input input-bordered bg-white"
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
                <div className="tooltip" data-tip="Only PDF">
                  <IoInformationCircleOutline />
                </div>
              </div>
              <input
                type="file"
                onChange={handleFile}
                className="file-input file-input-bordered w-full"
                accept=".pdf"
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
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            <div
              className={`w-full flex flex-col gap-2 ${
                siswa === "all-student" ? "hidden" : ""
              }`}
            >
              <label className="mt-4 font-bold">Tahun Pelajaran</label>
              <input
                type="text"
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
          <iframe className="w-full min-h-svh mt-5" src={showFile} />
        </div>
      </Modal>
    </>
  );
};

export default AdmSiswa;
