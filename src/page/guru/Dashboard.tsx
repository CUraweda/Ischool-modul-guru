import { useEffect, useState } from "react";
import bg from "../../assets/bg2.png";
import ApexChart from "../../component/ApexChart";
import FaceDetection from "../../component/FaceRegocnition";
import { FaCheckCircle } from "react-icons/fa";

import MapWithTwoRadiusPins from "../../component/MapWithTwoRadiusPins";

import Modal from "../../component/modal";
import { employeeStore, Store } from "../../store/Store";
import { FaDoorClosed, FaDoorOpen } from "react-icons/fa";
import { Rekapan } from "../../midleware/api-hrd";
import moment from "moment";
import { formatTime } from "../../utils/date";

const currentDate = moment();

const Dashboard = () => {
  const { employee, formTeachers } = employeeStore();
  const { token } = Store();

  const [inAreas, setInAreas] = useState<boolean>(false);
  const handleInAreas = () => {
    setInAreas(true);
  };
  const handleIsntAreas = () => {
    setInAreas(false);
  };


  const [camera, setCamera] = useState<boolean>(false);
  const [isAbsen, setIsAbsen] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [isLate, setIsLate] = useState<boolean>(false);

  const handleFaceDetectionSuccess = () => {
    setIsAbsen(true);
    const date = new Date();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const formattedTime = `${hours.toString().padStart(2, '0')}.${minutes.toString().padStart(2, '0')}`;
    setCurrentTime(formattedTime);

    const timeInMinutes = hours * 60 + minutes;
    const targetTimeInMinutes = 8 * 60; // 08:00
    if (timeInMinutes > targetTimeInMinutes) {
      setIsLate(true);
    } else {
      setIsLate(false);
    }
  };

  const showModalAdd = (props: string) => {
    let modalElement = document.getElementById(props) as HTMLDialogElement;
    if (modalElement) {
      modalElement.showModal();
      kamera();
    }
  };
  const closeModalAdd = (props: string) => {
    let modalElement = document.getElementById(props) as HTMLDialogElement;
    if (modalElement) {
      modalElement.close();
      setCamera(false);
    }
  };
  const kamera = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(function (stream) {
        setCamera(true);
        console.log("Izin kamera telah diberikan");
        stream.getTracks().forEach((track) => track.stop());
      })
      .catch(function (err) {
        console.log(err);

        setCamera(false);
        console.log("Izin kamera ditolak atau tidak diberikan");
      });
  };

  // get attendance summary
  const [rekapPresensi, setRekapPresensi] = useState<any>(null);
  const getRekapPresensi = async () => {
    if (!employee) return;

    try {
      const res = await Rekapan.jumlahPresensi(token, employee.id);
      setRekapPresensi(res.data.data);
    } catch {}
  };

  // entry point concurrently get many data
  const getData = async () => {
    await Promise.all([getRekapPresensi()]);
  };

  useEffect(() => {
    getData();
  }, [employee]);

  return (
    <div
      className="flex min-h-screen items-start flex-wrap p-3"
      style={{ backgroundImage: `url('${bg}')`, backgroundSize: "cover" }}
    >
      <div className="w-full flex flex-col gap-3">
        <div className="w-full items-stretch flex gap-3 flex-col md:flex-row ">
          {/* main card  */}
          <div className="w-full flex flex-col bg-base-100 rounded-md overflow-hidden border md:w-2/5">
            {/* profile  */}
            <div className="glass bg-secondary flex flex-col items-center p-6 text-white">
              <div className="avatar mb-3">
                <div className="w-28 rounded-full">
                  <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                </div>
              </div>
              <h3 className="text-2xl text-center font-bold">
                {employee?.full_name ?? "-"}
              </h3>
              <p className="text-center">
                {formTeachers
                  ?.map((ft) => `Wali Kelas ${ft.class?.class_name ?? "-"}`)
                  .join(" | ")}
              </p>
            </div>

            {/* division attendance schedule  */}
            <div className="p-6 grow">
              {/* clock in  */}
              <div className="w-full flex items-center bg-base-200 p-3 rounded-md mb-3">
                <div className="grow">
                  <h6 className="font-bold text-md">
                    Jadwal Masuk (07.00 - 08.00)
                  </h6>
                  <p className="text-sm sm:text-md">
                    Presensi Masuk : <span className="font-bold">{currentTime ? currentTime : "-"}</span>
                  </p>
                  <div className={`${isLate ? 'bg-red-600 text-white border-none' : 'badge-secondary'} badge text-sm sm:text-md`}>
                    {isLate ? isLate ? 'Tidak Tepat Waktu' : 'Tepat Waktu' : "-"}
                  </div>
                </div>
                <FaDoorOpen size={32} className="grow opacity-20" />
              </div>

              {/* clock out  */}
              <div className="w-full flex items-center bg-base-200 p-3 rounded-md">
                <div className="grow">
                  <h6 className="font-bold text-md">
                    Jadwal Pulang (16.00 - 17.00)
                  </h6>
                  <p className="text-sm">
                    Presensi anda : <span className="font-bold">16.01</span>
                  </p>
                  <div className="badge badge-success mt-3 text-white font-bold">
                    Tepat waktu
                  </div>
                </div>
                <FaDoorClosed size={32} className="grow opacity-20" />
              </div>
            </div>

            <div className="px-6 pb-3 flex flex-col gap-2">
              <button
                className="btn btn-primary grow"
                onClick={() => showModalAdd("modal-absen")}
              >
                Presensi
              </button>
              <button className="btn  btn-warning grow">Ajukan Cuti</button>
            </div>
          </div>z

          {/* row  */}
          <div className="w-full flex flex-col md:w-3/5 gap-3 ">
            {/* row  */}
            <div className="w-full grid md:grid-cols-2 gap-3 ">
              {/* attendance summary  */}
              <div className="bg-base-100 flex flex-col rounded-md overflow-hidden border">
                <div className="px-3 py-1 bg-primary text-white glass">
                  <h3 className="text-lg font-bold">Rekap Presensi</h3>
                  <p className="text-sm font-medium">
                    Bulan {formatTime(currentDate.toString(), "MMMM YYYY")}
                  </p>
                </div>
                <div className="px-3 py-1 grow">
                  <div className="overflow-x-auto">
                    <table className="table">
                      <tbody>
                        <tr>
                          <th>Hadir</th>
                          <td>{rekapPresensi?.HADIR ?? "0"} Hari</td>
                        </tr>
                        <tr>
                          <th>Izin</th>
                          <td>{rekapPresensi?.IZIN ?? "0"} Hari</td>
                        </tr>
                        <tr>
                          <th>Cuti</th>
                          <td>{rekapPresensi?.CUTI ?? "0"} Hari</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* latest training  */}
              <div className="bg-base-100 flex flex-col rounded-md overflow-hidden border">
                <div className="px-3 py-1 bg-accent text-white glass">
                  <h3 className="text-lg font-bold">Daftar Pelatihan</h3>
                  <p className="text-sm font-medium">Terbaru</p>
                </div>
                <div className="px-3 py-1 grow">
                  <div className="overflow-x-auto">
                    <table className="table">
                      <tbody>
                        <tr>
                          <th>
                            <p className="line-clamp-2 text-ellipsis overflow-hidden">
                              Pelatihan Management{" "}
                            </p>
                          </th>
                          <td className="whitespace-nowrap">9 Agustus 2024</td>
                        </tr>
                        <tr>
                          <th>
                            <p className="line-clamp-2 text-ellipsis overflow-hidden">
                              Pelatihan Management{" "}
                            </p>
                          </th>
                          <td className="whitespace-nowrap">9 Agustus 2024</td>
                        </tr>
                        <tr>
                          <th>
                            <p className="line-clamp-2 text-ellipsis overflow-hidden">
                              Pelatihan Management{" "}
                            </p>
                          </th>
                          <td className="whitespace-nowrap">9 Agustus 2024</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            {/* attendance rate chart  */}
            <div className="bg-base-100 flex flex-col rounded-md overflow-hidden border">
              <div className="px-3 py-1 bg-primary text-white glass">
                <h3 className="text-lg font-bold">Chart Presensi</h3>
              </div>
              <div className="px-3 py-1 grow">
                <ApexChart />
              </div>
            </div>
          </div>
        </div>

        {/* annoucement  */}
        <div className="bg-base-100 flex w-full min-h-60 flex-col rounded-md overflow-hidden border">
          <div className="px-3 py-1 bg-secondary text-white glass">
            <h3 className="text-lg font-bold">Pengumuman</h3>
          </div>
          <div className="px-3 py-1 grow">
            <div className="flex p-12">
              <p className="opacity-40 m-auto">Tidak ada pengumuman</p>
            </div>
          </div>
        </div>
      </div>

      <Modal id="modal-absen">
        {!isAbsen ? (
          <>
            <div className={`mt-4 flex justify-center`}>
              {camera ? (
                <>
                  <div className="flex flex-col">
                    {inAreas ? (
                      <FaceDetection onSuccess={handleFaceDetectionSuccess} />
                    ) : (
                      <img
                        src="https://png.pngtree.com/png-clipart/20230917/original/pngtree-flat-vector-illustration-of-photo-camera-icon-and-no-image-available-png-image_12324435.png"
                        alt=""
                      />
                    )}
                    <MapWithTwoRadiusPins onAreas={handleInAreas} notOnAreas={handleIsntAreas} />
                  </div>
                </>
              ) : (
                <div className="flex flex-col">
                  <div className="camera-blocked-message text-center">
                    <p>Izin kamera diblokir. Silakan izinkan akses kamera di pengaturan browser Anda.</p>
                  </div>
                  <img
                    src="https://png.pngtree.com/png-clipart/20230917/original/pngtree-flat-vector-illustration-of-photo-camera-icon-and-no-image-available-png-image_12324435.png"
                    alt=""
                  />
                </div>
              )}
            </div>
            {/* <div className="my-3 w-full flex flex-col justify-center items-center">
              <img src="" alt="" />
              <span className={` text-bold`}>
                Jarak anda ke area presensi terdekat adalah {distance} meter{" "}
              </span>
              <span className={`${inArea ? "hidden" : ""} text-bold text-red-500`}>
                Anda Berada Diluar Area !{" "}
              </span> */}
            <div className="w-full flex gap-2">
              <button
                className={`btn bg-gray-500 w-full text-white `}
                onClick={() => closeModalAdd("modal-absen")}
              >
                Close
              </button>
            </div>
            {/* </div> */}
          </>
        ) : (
          <>
            <div className='h-full w-full flex items-center justify-center'>
              <div className="flex w-full justify-center items-center flex-col">
                <span className="text-green-500 text-[300px]">
                  <FaCheckCircle />
                </span>
                <span className="text-2xl font-bold text-white ">
                  Berhasil Absensi
                </span>
                <div className="mt-5 w-full px-6 flex justify-center item-center flex-col gap-3">

                  <div className="w-full h-14 bg-white p-3 justify-center flex text-black font-bold text-xl shadow-md rounded-md">{employee?.full_name ?? "-"}</div>
                  <div className="w-full h-14 bg-white p-3 justify-center flex flex-col items-center text-black font-bold text-xl shadow-md rounded-md">
                    <p>{currentTime} WIB</p>
                    <div className="badge badge-accent badge-outline">{isLate ? 'Tidak Tepat Waktu' : 'Tepat Waktu'}</div>
                  </div>
                </div>
                <button onClick={() => closeModalAdd("modal-absen")} className="btn bg-green-500 text-white w-1/2 mt-5">Oke</button>
              </div>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
};

export default Dashboard;
