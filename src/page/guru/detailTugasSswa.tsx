import { useState, useEffect } from "react";
import { BiDownload } from "react-icons/bi";
import { VscTasklist } from "react-icons/vsc";
import { Link } from "react-router-dom";
import { Store } from "../../store/Store";
import { Task } from "../../midleware/api";
import { BsEye } from "react-icons/bs";
import Modal from "../../component/modal";
import Swal from "sweetalert2";

const DetailTugasSswa = () => {
  const { token } = Store();
  const [taskList, setTaskList] = useState<any>([]);
  const [task, setTask] = useState<any>();
  const [showFile, setShowFile] = useState<any>();
  const [feedback, setFeedback] = useState<string>("");
  const [idDetail, setIdDetail] = useState<string>("");
  const [idSiswa, setIdSiswa] = useState<string>("");

  useEffect(() => {
    getTaskDetail();
    getTaskId();
  }, []);
  const getTaskDetail = async () => {
    try {
      const id: string | null = sessionStorage.getItem("idTask");
      let idTask: number | null = null;

      if (id !== null) {
        idTask = parseInt(id);
      }
      const response = await Task.getDetailTask(token, idTask);
      console.log(response);

      setTaskList(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  const getTaskId = async () => {
    try {
      const id: string | null = sessionStorage.getItem("idTask");

      const response = await Task.getTaskById(token, id);

      setTask(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const formatDate = (date: string) => {
    let Newdate = new Date(date);
    let formattedDate = Newdate.toLocaleString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: false,
    });
    return formattedDate;
  };

  const downloadFileTugas = async () => {
    try {
      const path = task?.task_file;
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
  const showFileTugas = async () => {
    try {
      downloadFileTugas();
      const path = task?.task_file;
      if (!path) throw new Error("File tidak tersedia");

      const response = await Task.downloadTugas(token, path);
      const lowerCasePath = path.toLowerCase();

      let mimeType = "application/pdf";
      if (lowerCasePath.endsWith(".png")) {
        mimeType = "image/png";
      } else if (
        lowerCasePath.endsWith(".jpg") ||
        lowerCasePath.endsWith(".jpeg")
      ) {
        mimeType = "image/jpeg";
      } else if (!lowerCasePath.endsWith(".pdf")) {
        throw new Error("Unsupported file type");
      }

      const blob = new Blob([response.data], { type: mimeType });
      const blobUrl = window.URL.createObjectURL(blob);
      console.log(blob);
      setShowFile(blobUrl);

      showModal("show-file");
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Terjadi kesalahan saat menampilkan file",
      });
    }
  };

  const showModal = (props: string) => {
    let modalElement = document.getElementById(props) as HTMLDialogElement;
    if (modalElement) {
      modalElement.showModal();
    }
  };

  const closeModal = (props: string) => {
    let modalElement = document.getElementById(props) as HTMLDialogElement;
    if (modalElement) {
      modalElement.close();
    }
  };

  const handleAddFeedback = async () => {
    try {
      const id: string | null = sessionStorage.getItem("idTask");
      const data = {
        task_id: id,
        feedback: feedback,
        student_id: idSiswa,
      };
      const response = await Task.editTaskDetail(token, idDetail, data);
      console.log(response);
      closeModal("add-feedback-detail");
    } catch (error: any) {
      closeModal("add-feedback-detail");
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error?.message,
      });
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

  const handleFeed = (idSiswa: string, idDetail: string, feed: string) => {
    setIdDetail(idDetail);
    setIdSiswa(idSiswa);
    showModal("add-feedback-detail");
    setFeedback(feed);
  };

  const handleModal = () => {
    showModal("show-file");
    showFileTugas();
  };

  return (
    <>
      <div className="p-3">
        <div className="text-sm breadcrumbs">
          <ul>
            <li>
              <Link to={"/guru/adm-siswa"}>
                <a>Siswa</a>
              </Link>
            </li>
            <li>
              <Link to={"/guru/adm-siswa"}>
                <a>Administrasi</a>
              </Link>
            </li>
            <li>Tugas</li>
          </ul>

          <div className="mt-5 w-full bg-white p-3 rounded-md">
            <div className="text-center">
              <p className="text-xl font-bold">Detail Tugas</p>
            </div>
            <div className="w-full flex justify-between">
              <div className="w-1/2 mt-5">
                <table className="table">
                  <tbody>
                    <tr>
                      <th>Topik</th>
                      <td>:</td>
                      <td>{task?.topic}</td>
                    </tr>
                    <tr>
                      <th>Mapel</th>
                      <td>:</td>
                      <td>{task?.subject?.name}</td>
                    </tr>
                    <tr>
                      <th>Kelas</th>
                      <td>:</td>
                      <td>{task?.class?.class_name}</td>
                    </tr>
                    <tr>
                      <th>Tanggal Mulai</th>
                      <td>:</td>
                      <td>{formatDate(task?.start_date)}</td>
                    </tr>
                    <tr>
                      <th>Tanggal Selesai</th>
                      <td>:</td>
                      <td>{formatDate(task?.end_date)}</td>
                    </tr>
                    <tr>
                      <th>Jenis</th>
                      <td>:</td>
                      <td>
                        {task?.task_category_id == 1
                          ? "WWP"
                          : task?.task_category_id == 2
                            ? "Project Kelompok"
                            : "Prbadi"}
                      </td>
                    </tr>
                    <tr>
                      <th>File Tugas</th>
                      <td>:</td>
                      <td>
                        <button
                          className="btn btn-sm btn-ghost bg-green-600 text-white text-xl join-item"
                          onClick={() => handleModal()}
                        >
                          <BsEye />
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="w-40 h-40 mr-10 rounded-md p-3 flex flex-wrap justify-center items-center shadow-xl">
                <div className="w-full text-8xl font-bold flex justify-center text-blue-500">
                  {taskList?.length}
                </div>
                <div className="w-full font-bold flex justify-center">
                  Siswa Mengerjakan
                </div>
              </div>
            </div>
            <div className="overflow-x-auto mt-10">
              <table className="table table-zebra shadow-md mt-5">
                {/* head */}
                <thead className="bg-blue-200">
                  <tr>
                    <th>No</th>
                    <th>Nama Siswa</th>
                    <th>Kelas</th>
                    <th>Jenis</th>
                    <th>Tanggal Upload</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {taskList?.map((item: any, index: number) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item?.student?.full_name}</td>
                      <td>{item?.student?.class}</td>
                      <td>
                        {item?.task?.task_category_id === 1
                          ? "WWP"
                          : item?.task?.task_category_id === 2
                            ? "Project Kelompok"
                            : "Mandiri"}
                      </td>
                      <td>{formatDate(item?.createdAt)}</td>
                      <td className="flex items-center gap-2">
                        <button
                          className="btn btn-sm btn-ghost bg-blue-600 text-xl join-item tooltip"
                          data-tip="Download"
                          onClick={() => downloadTugas(item.task_file)}
                        >
                          <BiDownload />
                        </button>
                        <button
                          className={`btn btn-sm btn-ghost ${item.feedback ? "bg-green-600" : "bg-red-600"} text-xl join-item tooltip`}
                          data-tip="Feedback"
                          onClick={() => {
                            handleFeed(
                              item?.student.id,
                              item?.id,
                              item?.feedback
                            );
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
      </div>
      <Modal id={"show-file"} width="w-11/12 max-w-5xl">
        <div className="w-full flex flex-col items-center min-h-svh">
          <iframe className="w-full min-h-svh mt-5" src={showFile} />
        </div>
      </Modal>
      <Modal id={"add-feedback-detail"}>
        <div className="w-full flex justify-center flex-col items-center">
          <span className="text-xl font-bold mb-4">Feedback</span>
          <textarea
            className="textarea textarea-bordered w-full"
            placeholder="Feedback"
            value={feedback}
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
    </>
  );
};

export default DetailTugasSswa;
