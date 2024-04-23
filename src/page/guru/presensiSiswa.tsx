import { useState, useEffect } from "react";
import { FiPlus } from "react-icons/fi";
import Modal from "../../component/modal";
import { BiTrash } from "react-icons/bi";
import { Task, Student } from "../../controller/api";
import { useStore } from "../../store/Store";
import Swal from "sweetalert2";

const PresensiSiswa = () => {
  const { token } = useStore();
  const today = new Date();
  const [date, setDate] = useState<any>(today.toISOString().substr(0, 10));
  const [kelas, setKelas] = useState<any[]>([]);
  const [siswa, setSiswa] = useState<any[]>([]);
  const [idClass, setIdClass] = useState<string>("");
  const [selectedStudents, setSelectedStudents] = useState<any[]>([]);
  const [totalCreate, setTotalCreate] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    getClass();
  }, []);

  useEffect(() => {
    getStudent();
  }, [idClass]);

  const formattedDate = new Date(date).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

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

  const getClass = async () => {
    const response = await Task.GetAllClass(token, 0, 20);
    setKelas(response.data.data.result);
  };

  const getStudent = async () => {
    const id = parseInt(idClass);
    try {
      const response = await Student.GetStudentByClass(token, id, "2023/2024");
      setSiswa(response.data.data);
    } catch (error) {
      closeModal('add-presensi')
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Gagal Mengambil data siswa, silakan refresh halaman !",
      });
    }
  };

  const createPresensi = async () => {
    if (selectedStudents) {
      try {
        setLoading(true);
        const dataStatus = selectedStudents
          .filter((item: any) => !item.presensi || !item.transportasi)
          .map((item: any) => item.student.id);

        setTotalCreate(dataStatus);

        if (dataStatus.length === 0) {
          const createPromises = selectedStudents.map((item: any) => {
            const dataRest = {
              student_class_id: item.student.id,
              att_date: new Date(date),
              status: item.presensi,
              remark: item.transportasi,
            };
            return create(dataRest);
          });

          await Promise.all(createPromises);

          closeModal("add-presensi");

          Swal.fire({
            position: "center",
            icon: "success",
            title: "Data Berhasil Disimpan",
            showConfirmButton: false,
            timer: 1500,
          });
          // Update your state here instead of reloading the page
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
  };

  const create = async (data: any) => {
    await Student.CreatePresensi(token, data);
  };

  return (
    <>
      <div className="flex justify-center w-full mt-5 flex-col items-center">
        <span className="text-3xl font-bold">Presensi Siswa</span>
        <span className="text-xl">{formattedDate}</span>
        <div className="overflow-x-auto my-10 w-full p-5 bg-white">
          <div className="join w-full flex justify-end mb-5">
            <select
              className="select select-bordered w-36 join-item"
              onChange={(e) => setIdClass(e.target.value)}
            >
              <option disabled selected>
                Kelas
              </option>
              {kelas?.map((item: any, index: number) => (
                <option
                  value={item.id}
                  key={index}
                >{`${item.level}-${item.class_name}`}</option>
              ))}
            </select>
            <input
              type="date"
              placeholder="Type here"
              className="input input-bordered  join-item"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <button
              className="btn bg-green-500 text-white font-bold join-item"
              onClick={() => showModal("add-presensi")}
            >
              <span className="text-xl">
                <FiPlus />
              </span>{" "}
              Tambah
            </button>
          </div>
          <table className="table shadow-lg">
            {/* head */}
            <thead className="bg-blue-400">
              <tr>
                <th>No</th>
                <th>Name</th>
                <th>NIS</th>
                <th>Kelas</th>
                <th>Presensi</th>
                <th>Transportasi</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {/* row 1 */}
              <tr>
                <th>1</th>
                <td>aldi</td>
                <td>123123123</td>
                <td>VIII</td>
                <td>Izin</td>
                <td>Sepeda</td>
                <td className="join text-white">
                  <button
                    className="btn btn-sm btn-ghost bg-red-600 text-xl join-item"
                    // onClick={() => deleteTask(item.id)}
                  >
                    <BiTrash />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <Modal id="add-presensi" width="w-11/12 max-w-5xl">
        <div className="w-full flex justify-center flex-col items-center">
          <span className="text-xl font-bold">Tambah Presensi</span>
          <div className="w-full flex flex-col gap-2">
            <label className="mt-4 font-bold">Kelas</label>
            <select
              className="select select-bordered w-full"
              onChange={(e) => setIdClass(e.target.value)}
            >
              <option disabled selected>
                Kelas
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
            <label className="mt-4 font-bold">Tangal Presensi</label>
            <input
              type="date"
              placeholder="Type here"
              className="input input-bordered  join-item"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="w-full max-h-[400px] mt-10 overflow-auto">
            <table className="table shadow-lg">
              {/* head */}
              <thead className="bg-blue-400">
                <tr>
                  <th></th>
                  <th>Name</th>
                  <th>NIS</th>
                  <th>Kelas</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {siswa?.map((item: any, index: number) => (
                  <tr key={index} className={``}>
                    <th>
                      <input
                        type="checkbox"
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
                    <td className="flex join">
                      <select
                        className={`select select-bordered w-32 max-w-xs join-item ${
                          totalCreate.some((id) => id === item.student.id)
                            ? "bg-red-400"
                            : ""
                        }`}
                        onChange={(e) => {
                          item.presensi = e.target.value;
                          if (
                            selectedStudents.some(
                              (student) =>
                                student.student.id === item.student.id
                            )
                          ) {
                            setSelectedStudents(
                              selectedStudents.map((student) =>
                                student.student.id === item.student.id
                                  ? { ...student, presensi: e.target.value }
                                  : student
                              )
                            );
                          }
                        }}
                        disabled={
                          !selectedStudents.some(
                            (student) => student.student.id === item.student.id
                          )
                        }
                      >
                        <option disabled selected>
                          Presensi
                        </option>
                        <option value="Hadir">Hadir</option>
                        <option value="Izin">Izin</option>
                        <option value="Alfa">Alfa</option>
                        <option value="Sakit">Sakit</option>
                      </select>
                      <select
                        className={`select select-bordered w-32 max-w-xs join-item ${
                          totalCreate.some((id) => id === item.student.id)
                            ? "bg-red-400"
                            : ""
                        }`}
                        onChange={(e) => {
                          item.transportasi = e.target.value;
                          if (
                            selectedStudents.some(
                              (student) =>
                                student.student.id === item.student.id
                            )
                          ) {
                            setSelectedStudents(
                              selectedStudents.map((student) =>
                                student.student.id === item.student.id
                                  ? { ...student, transportasi: e.target.value }
                                  : student
                              )
                            );
                          }
                        }}
                        disabled={
                          !selectedStudents.some(
                            (student) => student.student.id === item.student.id
                          )
                        }
                      >
                        <option disabled selected>
                          Transportasi
                        </option>
                        <option value="🚶‍♂️jalan kaki">Jalan Kaki</option>
                        <option value="🚌kendaraan umum">Kendaraan Umum</option>
                        <option value="🚗antar jemput">Antar Jemput</option>
                        <option value="🚲sepeda">Sepeda</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="w-full flex gap-3 justify-end mt-10 items-center">
            <span
              className={`text-red-500 font-bold ${
                totalCreate.length === 0 ? "hidden" : ""
              }`}
            >
              Isi Semua Field Terpilih !
            </span>
            <div className="flex gap-2">
              <button
                className="btn btn-ghost bg-green-500 w-32 text-white"
                onClick={createPresensi}
              >
                {loading ? (
                  <span className="loading loading-infinity loading-lg"></span>
                ) : (
                  "Submit"
                )}
              </button>
              <button
                className="btn btn-ghost bg-gray-400 w-32 text-white"
                onClick={() => closeModal("add-presensi")}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default PresensiSiswa;
