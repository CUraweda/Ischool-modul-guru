import { useState, useEffect } from "react";
import Modal from "../modal";
import { FaFilePdf } from "react-icons/fa";
import { Task, Student, Raport } from "../../midleware/api";
import { Store, useProps } from "../../store/Store";
import Swal from "sweetalert2";

const RaportAll = () => {
  const { token } = Store();
  const { setKelasProps, kelasProps } = useProps();
  const [Class, setClass] = useState<any[]>([]);
  const [siswa, setSiswa] = useState<any[]>([]);
  const [idClass, setIdClass] = useState<string>(kelasProps);
  const [semester, setSemester] = useState<string>("");
  const [selectedStudents, setSelectedStudents] = useState<any[]>([]);
  const [dataRaport, setDataRaport] = useState<any>([]);

  const showModal = (props: string) => {
    let modalElement = document.getElementById(`${props}`) as HTMLDialogElement;
    if (modalElement) {
      getClass();
      modalElement.showModal();
    }
  };

  const closeModal = (props: string) => {
    let modalElement = document.getElementById(props) as HTMLDialogElement;
    if (modalElement) {
      modalElement.close();
    }
  };

  useEffect(() => {
    getStudent();
    getDataRaport();
  }, [idClass]);

  useEffect(() => {
    getDataRaport();
    getClass();
  }, []);

  const getClass = async () => {
    const response = await Task.GetAllClass(token, 0, 20);
    setClass(response.data.data.result);
  };

  const getStudent = async () => {
    const id = idClass ? parseInt(idClass) : 11;

    try {
      const response = await Student.GetStudentByClass(token, id, "2023/2024");
      setSiswa(response.data.data);
    } catch (error) {
      closeModal("add-presensi");
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Gagal Mengambil data siswa, silakan refresh halaman !",
      });
    }
  };

  const getDataRaport = async () => {
    try {
      const id = idClass ? idClass : '11';
      const response = await Raport.getAllStudentReport(token, id);
      setDataRaport(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const createRaport = async () => {
    if (selectedStudents) {
      const createPromise = selectedStudents.map((item: any) => {
        const dataRest = {
          student_class_id: item.student_id,
          semester: semester,
        };
        return create(dataRest);
      });
      await Promise.all(createPromise);
      closeModal("add-raport-siswa");
    }
  };
  const create = async (data: any) => {
    await Raport.createStudentRaport(token, data);
    getDataRaport();
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

  return (
    <div>
      <div className="w-full flex justify-between gap-2">
        <div className="join">
          <select
            className="select select-bordered w-full"
            value={idClass}
            onChange={(e) => {
              setIdClass(e.target.value), setKelasProps(e.target.value);
            }}
          >
            <option selected>
              Kelas
            </option>
            {Class?.map((item: any, index: number) => (
              <option
                value={item.id}
                key={index}
              >{`${item.level}-${item.class_name}`}</option>
            ))}
          </select>
        </div>
        <button
          className="btn btn-ghost bg-green-500 btn-sm text-white"
          onClick={() => showModal("add-raport-siswa")}
        >
          Tambah
        </button>
      </div>
      <div className="overflow-x-auto mt-5">
        <table className="table table-md">
          <thead>
            <tr className="bg-blue-300">
              <th>No</th>
              <th>Nama Siswa</th>
              <th>Rapot Angka</th>
              <th>Rapot Narasi</th>
              <th>Raport Portofolio</th>
              <th>Raport Siswa</th>
              {/* <th>Action</th> */}
            </tr>
          </thead>
          <tbody>
            {dataRaport?.map((item: any, index: number) => (
              <tr key={index}>
                <th>{index + 1}</th>
                <td>{item?.studentclass.student.full_name}</td>
                <td>
                  <button
                    className={`btn btn-sm join-item bg-green-500 text-white tooltip ${
                      !item?.number_path ? "btn-disabled" : ""
                    }`}
                    data-tip="Download Rapor Angka"
                    onClick={() => downloadTugas(item?.number_path)}
                  >
                    <span className="text-xl">
                      <FaFilePdf />
                    </span>
                  </button>
                </td>
                <td>
                  <button
                    className={`btn btn-sm join-item bg-green-500 text-white tooltip ${
                      !item?.narrative_path ? "btn-disabled" : ""
                    }`}
                    data-tip="Download Rapor Narasi"
                    onClick={() => downloadTugas(item?.narrative_path)}
                  >
                    <span className="text-xl">
                      <FaFilePdf />
                    </span>
                  </button>
                </td>
                <td>
                  <button
                    className={`btn btn-sm join-item bg-green-500 text-white tooltip ${
                      !item?.portofolio_path ? "btn-disabled" : ""
                    }`}
                    data-tip="Download Rapor Portofolio"
                    onClick={() => downloadTugas(item?.portofolio_path)}
                  >
                    <span className="text-xl">
                      <FaFilePdf />
                    </span>
                  </button>
                </td>

                <td>
                  <button
                    className={`btn btn-sm join-item bg-green-500 text-white tooltip ${
                      !item?.merged_path ? "btn-disabled" : ""
                    }`}
                    data-tip="Download Rapor Siswa"
                    onClick={() => downloadTugas(item?.merged_path)}
                  >
                    <span className="text-xl">
                      <FaFilePdf />
                    </span>
                  </button>
                </td>
                {/* <td>
                  <button
                    className={`btn btn-sm join-item bg-green-500 text-white tooltip ${
                      !item?.number_path && !item?.narrative_path && !item?.portofolio_path ? "btn-disabled" : ""
                    }`}
                    data-tip="Download Rapor Siswa"
                    onClick={() => downloadTugas(item?.merged_path)}
                  >
                    <span className="text-xl">
                      <FaFilePdf />
                    </span>
                  </button>
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal id="add-raport-siswa" width="w-11/12 max-w-5xl">
        <div className="w-full flex flex-col items-center">
          <p className="text-xl font-bold">Tambah Raport Siswa</p>
          <div className="w-full flex flex-col gap-2">
            <label className="mt-4 font-bold">Kelas</label>
            <select
              className="select select-bordered w-full"
              onChange={(e) => setIdClass(e.target.value)}
            >
              <option disabled selected>
                Kelas
              </option>
              {Class?.map((item: any, index: number) => (
                <option
                  value={item.id}
                  key={index}
                >{`${item.level}-${item.class_name}`}</option>
              ))}
            </select>
          </div>
          <div className="w-full flex flex-col gap-2">
            <label className="mt-4 font-bold">Semester</label>
            <select
              className="select select-bordered w-full"
              onChange={(e) => setSemester(e.target.value)}
            >
              <option disabled selected>
                Semester
              </option>
              <option value={"1"}>Semester 1</option>
              <option value={"2"}>Semester 2</option>
            </select>
          </div>

          <div className="w-full max-h-[400px] mt-10 overflow-auto">
            <table className="table shadow-lg">
              <thead className="bg-blue-400 text-white">
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      className="checkbox"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedStudents(siswa);
                        } else {
                          setSelectedStudents([]);
                        }
                      }}
                    />
                  </th>
                  <th>Name</th>
                  <th>NIS</th>
                  <th>Kelas</th>
                </tr>
              </thead>
              <tbody>
                {siswa?.map((item: any, index: number) => (
                  <tr key={index} className={``}>
                    <th>
                      <input
                        type="checkbox"
                        checked={selectedStudents.some(
                          (student) => student.student.id === item.student.id
                        )}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedStudents([...selectedStudents, item]);
                          } else {
                            setSelectedStudents(
                              selectedStudents.filter(
                                (student) =>
                                  student.student.id !== item.student.id
                              )
                            );
                          }
                        }}
                        className="checkbox"
                      />
                    </th>
                    <td>{item?.student?.full_name}</td>
                    <td>{item?.student?.nis}</td>
                    <td>{item?.student?.class}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="w-full flex gap-3 mt-5 justify-end">
            <button
              className="btn btn-ghost bg-green-500 text-white"
              onClick={createRaport}
            >
              Submit
            </button>
            <button
              className="btn btn-ghost bg-gray-500 text-white"
              onClick={() => closeModal("add-raport-siswa")}
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default RaportAll;
