import { useState, useEffect } from "react";
import { MdOutlineDocumentScanner } from "react-icons/md";
import { Link } from "react-router-dom";
import Modal from "../modal";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { Task, Raport } from "../../controller/api";
import { useStore } from "../../store/Store";

const RaportNarasi = () => {
  const { token } = useStore();
  const [kelas, setKelas] = useState<any[]>([]);
  const [DataSiswa, setDataSiswa] = useState<any[]>([]);
  const [idClass, setClass] = useState<string>("");
  const [komen, setKomen] = useState<string>("");
  
  const [studentClass, setStudentClass] = useState<string>("");
  const [smt, setSmt] = useState<string>("");
  const [reportId, setReportId] = useState<string>("");

  useEffect(() => {
    getStudent();
  }, [idClass]);

  useEffect(() => {
    getClass();
  }, []);

  const showModal = (props: string) => {
    let modalElement = document.getElementById(`${props}`) as HTMLDialogElement;
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

  const getClass = async () => {
    const response = await Task.GetAllClass(token, 0, 20);
    setKelas(response.data.data.result);
  };

  const getStudent = async () => {
    try {
      const response = await Raport.getAllStudentReport(token, idClass);
      console.log(response.data.data);
      setDataSiswa(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const CreateKomenGuru = async () => {
    const data = {
      student_class_id: studentClass,
      semester: smt,
      nar_teacher_comments: komen,
    };

    await Raport.createKomentar(token, reportId, data);
    getStudent()
    closeModal('komen-guru-narasi')
    setKomen('')
    
  };

  const handleKomen = (
    komen: string,
    kelas: string,
    id: string,
    smt: string
  ) => {
    showModal("komen-guru-narasi");
    setKomen(komen? komen : '');
    setReportId(id);
    setStudentClass(kelas);
    setSmt(smt);
  };

  return (
    <div>
      <div className="w-full flex justify-between gap-2">
        <div className="join">
          <select className="select select-sm join-item w-32 max-w-md select-bordered">
            <option disabled selected>
              Tahun Pelajaran
            </option>
            <option>2023/2024</option>
            <option>2024/2025</option>
          </select>
          <select
            className="select select-sm join-item w-32 max-w-md select-bordered"
            onChange={(e) => sessionStorage.setItem("smt", e.target.value)}
          >
            <option disabled selected>
              Semester
            </option>
            <option value={"1"}>Ganjil</option>
            <option value={"2"}>Genap</option>
          </select>
          <select
            className="select select-sm join-item w-32 max-w-md select-bordered"
            onChange={(e) => setClass(e.target.value)}
          >
            <option disabled selected>
              pilih kelas
            </option>
            {kelas?.map((item: any, index: number) => (
              <option
                value={item.id}
                key={index}
              >{`${item.level}-${item.class_name}`}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="overflow-x-auto mt-5">
        <table className="table table-md table-zebra">
          <thead>
            <tr className="bg-blue-300 ">
              <th>No</th>
              <th>Nama</th>
              <th>Kelas</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {DataSiswa?.map((item: any, index: number) => (
              <tr key={index}>
                <th>{index + 1}</th>
                <td>{item?.studentclass?.student.full_name}</td>
                <td>{item?.studentclass?.class?.class_name}</td>

                <td className="">
                  <div className="join">
                    <Link to={"/guru/rapor-siswa/narasi"}>
                      <button
                        className="btn join-item btn-ghost btn-sm text-xl text-white bg-blue-500 tooltip"
                        data-tip="Detail"
                        onClick={() => {
                          {sessionStorage.setItem("idNar", item?.id),
                            sessionStorage.setItem('idSiswa', item?.studentclass?.id)
                          };
                        }}
                      >
                        <MdOutlineDocumentScanner />
                      </button>
                    </Link>
                    <button
                      className={`btn join-item btn-ghost btn-sm text-xl text-white tooltip ${
                        item.nar_teacher_comments
                          ? "bg-green-500"
                          : "bg-gray-400"
                      }`}
                      data-tip="Komentar Guru"
                      onClick={() =>
                        handleKomen(
                          item.nar_teacher_comments,
                          item.student_class_id,
                          item.id,
                          item.semester
                        )
                      }
                    >
                      <IoChatboxEllipsesOutline />
                    </button>
                    <button
                      className={`btn join-item btn-ghost btn-sm text-xl text-white bg-yellow-500 tooltip ${
                        item.nar_parent_comments ? "" : "btn-disabled"
                      }`}
                      data-tip="Komentar Ortu"
                      onClick={() => showModal("komen-ortu-narasi")}
                    >
                      <IoChatboxEllipsesOutline />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal id="komen-ortu-narasi" width="w-11/12 max-w-5xl">
        <div className="w-full flex justify-center flex-col items-center">
          <p className="text-xl font-bold">Komentar Orang Tua / Wali</p>
          <div className="w-full border-1 min-h-96 max-h-96 bg-gray-200 mt-5 rounded-md shadow-md p-3 overflow-auto">
            <span>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book. It has
              survived not only five centuries, but also the leap into
              electronic typesetting, remaining essentially unchanged. It was
              popularised in the 1960s with the release of Letraset sheets
              containing Lorem Ipsum passages, and more recently with desktop
              publishing software like Aldus PageMaker including versions of
              Lorem Ipsum.
            </span>
          </div>
        </div>
      </Modal>
      <Modal id="komen-guru-narasi" width="w-11/12 max-w-5xl">
        <div className="w-full flex justify-center flex-col items-center">
          <p className="text-xl font-bold">Komentar Guru</p>
          <textarea
            className="textarea textarea-bordered w-full min-h-96 mt-5"
            placeholder="Komentar"
            value={komen}
            onChange={(e) => setKomen(e.target.value)}
          />

          <div className="w-full justify-end flex mt-5">
            <button className="btn btn-ghost bg-green-500 text-white" onClick={CreateKomenGuru}>
              Submit
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default RaportNarasi;
