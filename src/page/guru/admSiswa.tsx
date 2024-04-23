import { useState, useEffect, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { FiPlus } from "react-icons/fi";
import Modal from "../../component/modal";
import "react-day-picker/dist/style.css";
import { FaListCheck, FaPenClip } from "react-icons/fa6";
import { BiDownload, BiTrash } from "react-icons/bi";
import { Task, Student } from "../../controller/api";
import { useStore } from "../../store/Store";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { VscTasklist } from "react-icons/vsc";

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
  const { token } = useStore();
  const navigate = useNavigate();

  const [task, setTask] = useState<any>([]);
  const [taskClass, setTaskClass] = useState<any>([]);
  const [kelas, setKelas] = useState<any[]>([]);
  const [mapel, setMapel] = useState<any[]>([]);
  const [file, setFile] = useState<any>(null);
  const [siswa, setSiswa] = useState<any>("all-student");
  const [DataSiswa, setDataSiswa] = useState<any[]>([]);

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
  }, [formik.values.classId]);

  useEffect(() => {
    getTask();
    getTaskClass();
  }, []);

  const showModal = (props: string) => {
    let modalElement = document.getElementById(props) as HTMLDialogElement;
    if (modalElement) {
      modalElement.showModal();
      getClass();
      getMapel();
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
    setKelas(response.data.data.result);
  };

  const getMapel = async () => {
    const response = await Task.GetAllMapel(token, 0, 20);
    setMapel(response.data.data.result);
  };

  const getStudent = async () => {
    const idClass = parseInt(formik.values.classId);
    const response = await Student.GetStudentByClass(
      token,
      idClass,
      "2023/2024"
    );
    setDataSiswa(response.data.data);
    console.log(response.data.data);
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
    // formData.append("academic_year", tahun);
    // formData.append("semester", semester);
    formData.append("subject_id", subjectId);
    formData.append("topic", topik);
    formData.append("task_category_id", jenis);
    // formData.append("characteristic", jenis);
    formData.append("start_date", startDate);
    formData.append("end_date", endDate);
    formData.append("status", status);
    formData.append("up_file", file);

    try {
      const response = await Task.createTaskClass(token, formData);
      console.log(response);
      window.location.reload();
    } catch (error) {
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
    formData.append("status", status);
    formData.append("up_file", file);

    try {
      const response = await Task.createTask(token, formData);
      console.log(formData);

      console.log(response);
      // window.location.reload();
    } catch (error) {
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
    const file = event.target.files?.[0];
    setFile(file || null);
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

  const handleEdit = async (show: string, hidden: string) => {
    document.getElementById(hidden)?.classList.add("hidden");
    document.getElementById(show)?.classList.remove("hidden");
  };

  return (
    <>
      <div className="w-full flex flex-col items-center">
        <div className="my-10 flex flex-col text-center">
          <span className="text-4xl font-bold">Administrasi Siswa</span>
          <span>Kelas II</span>
        </div>
        <div className="flex justify-between w-full flex-wrap">
          <div className="p-3 sm:w-1/4 w-full">
            <div className="bg-green-100 shadow-md w-full rounded-md p-3 flex flex-col items-center">
              <span className="text-xl font-bold">Hadir</span>
              <div className="flex justify-center w-full">
                <div className="w-full my-4 flex justify-center items-center">
                  <span className="text-8xl md:text-8xl font-bold">12</span>
                  <span className="text-xl font-bold">Hari</span>
                </div>
              </div>
            </div>
          </div>
          <div className="p-3 sm:w-1/4 w-full">
            <div className="bg-blue-100 shadow-md w-full rounded-md p-3 flex flex-col items-center">
              <span className="text-xl font-bold">Sakit</span>
              <div className="flex justify-center w-full">
                <div className="w-full my-4 flex justify-center items-center">
                  <span className="text-8xl md:text-8xl font-bold">12</span>
                  <span className="text-xl font-bold">Hari</span>
                </div>
              </div>
            </div>
          </div>
          <div className="p-3 sm:w-1/4 w-full">
            <div className="bg-red-100 shadow-md w-full rounded-md p-3 flex flex-col items-center">
              <span className="text-xl font-bold">Izin</span>
              <div className="flex justify-center w-full">
                <div className="w-full my-4 flex justify-center items-center">
                  <span className="text-8xl md:text-8xl font-bold">12</span>
                  <span className="text-xl font-bold">Hari</span>
                </div>
              </div>
            </div>
          </div>
          <div className="p-3 sm:w-1/4 w-full">
            <div className="bg-yellow-100 shadow-md w-full rounded-md p-3 flex flex-col items-center">
              <span className="text-xl font-bold">Alfa</span>
              <div className="flex justify-center w-full">
                <div className="w-full my-4 flex justify-center items-center">
                  <span className="text-8xl md:text-8xl font-bold">12</span>
                  <span className="text-xl font-bold">Hari</span>
                </div>
              </div>
            </div>
          </div>
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
            <table className="table table-zebra shadow-md mt-5">
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
                  <tr>
                    <th>{index + 1}</th>
                    <td>{item?.topic}</td>
                    <td>{item?.subject.name}</td>
                    <td>{item?.class?.class_name}</td>
                    <td>{formatDate(item?.start_date)}</td>
                    <td>{formatDate(item?.end_date)}</td>
                    <td>
                      {item?.characteristic == 1 ? "WWP" : "Project Kelompok"}
                    </td>
                    <td>{item?.status}</td>
                    <td className="join text-white">
                      {/* <button
                        className="btn btn-sm btn-ghost bg-orange-600 text-xl join-item"
                        onClick={() => showModal("edit-task")}
                      >
                        <FaPenClip />
                      </button> */}
                      <button
                        className="btn btn-sm btn-ghost bg-red-600 text-xl join-item"
                        onClick={() => deleteTaskClass2(item.id)}
                      >
                        <BiTrash />
                      </button>
                      <button
                        className="btn btn-sm btn-ghost bg-blue-600 text-xl join-item"
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
            <table className="table table-zebra shadow-md mt-5">
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
                  <tr>
                    <th>{index + 1}</th>
                    <td>{item?.studentclass?.student?.full_name}</td>
                    <td>{item?.topic}</td>
                    <td>{item?.subject.name}</td>
                    <td>{formatDate(item?.start_date)}</td>
                    <td>{formatDate(item?.end_date)}</td>
                    <td>
                      {item?.characteristic == 1 ? "WWP" : "Project Kelompok"}
                    </td>
                    <td>{item?.status}</td>
                    <td className="join text-white">
                      
                      <button
                        className="btn btn-sm btn-ghost bg-red-600 text-xl join-item"
                        onClick={() => deleteTask(item.id)}
                      >
                        <BiTrash />
                      </button>
                      <button
                        className={`${
                          !item?.down_file ? "btn-disabled" : ""
                        } btn btn-sm btn-ghost bg-blue-600 text-xl join-item`}
                      >
                        <BiDownload />
                      </button>
                      <button
                        className={`${
                          !item?.down_file ? "btn-disabled" : ""
                        } btn btn-sm btn-ghost bg-green-600 text-xl join-item`}
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
          <span className="text-xl font-bold">Tambah Tugas</span>
          <div className="flex w-full mt-5 flex-col">
            <div className="w-full flex flex-col gap-2">
              <label className="mt-4 font-bold">Kelas</label>
              <select
                className="select select-bordered bg-white"
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
              <div className="w-full flex justify-center">
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
                    className="input input-bordered bg-white"
                    onChange={(e) =>
                      formik.setFieldValue("endDate", e.target.value)
                    }
                  />
                </div>
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
          <span className="text-xl font-bold">Edit Tugas</span>
          <div className="flex w-full mt-5 flex-col">
            <div className="w-full flex flex-col gap-2">
              <label className="mt-4 font-bold">Kelas</label>
              <div
                id="kelasShow"
                className="w-full h-10 bg-gray-100 rounded-md p-3 flex justify-between items-center"
              >
                <p>XII</p>
                <button
                  className="btn btn-sm btn-ghost text-orange-500 join-item"
                  onClick={() => handleEdit("selectClass", "kelasShow")}
                >
                  <FaPenClip />
                </button>
              </div>

              <select
                id="selectClass"
                className="select select-bordered bg-white hidden"
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
              <div
                id="siswaShow"
                className="w-full h-10 bg-gray-100 rounded-md p-3 flex justify-between items-center"
              >
                <p>XII</p>
                <button
                  className="btn btn-sm btn-ghost text-orange-500 join-item"
                  onClick={() => handleEdit("siswaClass", "siswaShow")}
                >
                  <FaPenClip />
                </button>
              </div>
              <select
                id="siswaClass"
                value={siswa}
                className="select select-bordered bg-white hidden"
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
              <div className="w-full flex justify-center">
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
                    className="input input-bordered bg-white"
                    onChange={(e) =>
                      formik.setFieldValue("endDate", e.target.value)
                    }
                  />
                </div>
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
              onClick={handleCreate}
            >
              Submit
            </button>
            {/* <button className="btn bg-green-500 text-white font-bold">Submit</button> */}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AdmSiswa;
