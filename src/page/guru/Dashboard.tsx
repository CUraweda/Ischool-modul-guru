import { useEffect, useState } from "react";
import bg from "../../assets/bg2.png";
import ApexChart from "../../component/ApexChart";
import FaceDetection from "../../component/FaceRegocnition";
import { FaCheckCircle } from "react-icons/fa";

import MapWithTwoRadiusPins from "../../component/MapWithTwoRadiusPins";
import axios from "axios";
import Modal from "../../component/modal";
import { employeeStore, Store } from "../../store/Store";
import { FaDoorClosed, FaDoorOpen } from "react-icons/fa";
import moment from "moment";
import { formatTime } from "../../utils/date";
import {
  PelatihanKaryawan,
  PengumumanKaryawan,
  Rekapan,
} from "../../midleware/api-hrd";

const Dashboard: React.FC = () => {
  const currentDate = moment();
  const { token } = Store();
  const { employee, formTeachers } = employeeStore();

  const [inAreas, setInAreas] = useState<boolean>(false);
  const handleInAreas = () => {
    setInAreas(true);
  };
  const handleIsntAreas = () => {
    setInAreas(false);
  };

  const [isAbsen, setIsAbsen] = useState<boolean>(false);
  const [isReAbsen, setReIsAbsen] = useState<boolean>(false);

  const [currentTime, setCurrentTime] = useState<string>("");
  const [isLate, setIsLate] = useState<boolean>(false);

  const [attendanceData, setAttendanceData] = useState<any>(null);

  const handleFaceDetectionSuccess = (data: any) => {
    setAttendanceData(data);
    setIsAbsen(true);
    const date = new Date();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const formattedTime = `${hours.toString().padStart(2, "0")}.${minutes.toString().padStart(2, "0")}`;
    setCurrentTime(formattedTime);

    const timeInMinutes = hours * 60 + minutes;
    const targetTimeInMinutes = 8 * 60; // 08:00
    if (timeInMinutes > targetTimeInMinutes) {
      setIsLate(true);
    } else {
      setIsLate(false);
    }
    stopCamera();
  };
  const handleReAbsen = () => {
    setIsAbsen(true);
    setReIsAbsen(true);
    stopCamera();
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

  const [camera, setCamera] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const kamera = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(function (stream) {
        setCamera(true);
        setCameraStream(stream);
        console.log("Izin kamera telah diberikan");
      })
      .catch(function (err) {
        console.log(err);

        setCamera(false);
        console.log("Izin kamera ditolak atau tidak diberikan");
      });
  };

  const stopCamera = () => {
    if (cameraStream) {
      console.log("masuk stop kamera");
      (cameraStream as MediaStream)
        .getTracks()
        .forEach((track: MediaStreamTrack) => track.stop());
      setCamera(false);
      console.log("Kamera telah dihentikan");
    }
  };

  const [workTime, setWorkTime] = useState<{
    start_time: string;
    end_time: string;
  } | null>(null);
  const getWorkTime = async () => {
    try {
      const url = `${import.meta.env.VITE_REACT_API_HRD_URL}/api/worktime/1`;
      const response = await axios.get<{
        data: { start_time: string; end_time: string };
      }>(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setWorkTime(response.data.data);
    } catch (error) {
      console.error("Error fetching work time data:", error);
    }
  };

  useEffect(() => {
    getRekapPresensi();
    getWorkTime();
  }, [employee]);

  const isBeforeWorkTime = () => {
    if (!workTime || !currentTime) return false;

    const now = new Date();
    const [hours, minutes] = currentTime.split(":").map(Number);
    now.setHours(hours, minutes, 0, 0);

    const [startHours, startMinutes] = workTime.start_time
      .split(":")
      .map(Number);
    const startTime = new Date(now);
    startTime.setHours(startHours, startMinutes, 0, 0);

    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(23, 59, 59, 999);

    return now < startTime && now > yesterday;
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

  // get latest training
  const [latestTraining, setLatestTraining] = useState<any[]>([]);
  const getLatestTraining = async () => {
    if (!employee) return;
    try {
      const response = await PelatihanKaryawan.showAll(
        token,
        "",
        employee.id,
        "",
        0,
        3
      );
      setLatestTraining(response.data.data.result);
    } catch {}
  };

  // get employee announcement
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const getAnnouncements = async () => {
    try {
      const res = await PengumumanKaryawan.showAll(token, "", "1", "");
      setAnnouncements(res.data.data.result);
    } catch {}
  };

  // get attendance summary chart
  const [recapPresensiChart, setRecapPresensiChart] = useState({
    cuti: [],
    izin: [],
    hadir: [],
    categories: [],
    maxValue: 0,
  });
  const getRecapPresensiChart = async () => {
    if (!employee) return;
    try {
      const response = await Rekapan.presensiSetahun(token, employee.id);
      const data = response.data.data;

      const cutiData: any = [];
      const izinData: any = [];
      const hadirData: any = [];
      const categories: any = [];

      Object.keys(data).forEach((key) => {
        categories.push(data[key].name);
        cutiData.push(Number(data[key].cuti));
        izinData.push(Number(data[key].izin));
        hadirData.push(Number(data[key].hadir));
      });

      // Hitung nilai maksimum untuk sumbu Y
      const maxDataValue = Math.max(...cutiData, ...izinData, ...hadirData);

      // Tambahkan sedikit padding pada nilai maksimum
      const maxValue = maxDataValue > 0 ? Math.ceil(maxDataValue * 1.1) : 5;

      setRecapPresensiChart({
        cuti: cutiData,
        izin: izinData,
        hadir: hadirData,
        categories,
        maxValue,
      });
    } catch {}
  };

  // entry point concurrently get many data
  const getData = async () => {
    getRekapPresensi();
    getLatestTraining();
    getAnnouncements();
    getRecapPresensiChart();
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
                    Jadwal Masuk (
                    {workTime
                      ? `${moment(workTime.start_time, "HH:mm:ss").format("HH:mm").replace(":", ".")} - ${moment(workTime.end_time, "HH:mm:ss").format("HH:mm").replace(":", ".")}`
                      : "Loading..."}
                    )
                  </h6>
                  <p className="text-sm sm:text-md">
                    Presensi Masuk :{" "}
                    <span className="font-bold">
                      {" "}
                      {attendanceData
                        ? new Date(
                            attendanceData.createdAt
                          ).toLocaleTimeString()
                        : "Belum absen"}
                    </span>
                  </p>
                  <div
                    className={`${isLate ? "bg-red-600 text-white border-none" : "badge-secondary"} badge text-sm sm:text-md`}
                  >
                    {attendanceData
                      ? attendanceData.status
                      : "Belum ada status"}
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
          </div>

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
                        {latestTraining?.map((item: any, index: any) => (
                          <tr key={index}>
                            <th>
                              <p className="line-clamp-2 text-ellipsis overflow-hidden">
                                {item.title}
                              </p>
                            </th>
                            <td className="whitespace-nowrap">
                              {item.start_date.split("T")[0]}
                            </td>
                          </tr>
                        ))}
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
                <ApexChart data={recapPresensiChart} />
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
            {announcements.length ? (
              announcements.map((item, i) => (
                <div key={i} className="p-3 border-b-2">
                  {item.plan_date && (
                    <b className="text-sm text-secondary">
                      {formatTime(item.plan_date, "dddd, DD MMMM YYYY")}{" "}
                    </b>
                  )}
                  <p className="mb-1">{item.notes ?? "-"}</p>
                  {item.createdAt == item.updatedAt ? (
                    <span className="text-xs opacity-60">
                      Dibuat pada tanggal{" "}
                      {formatTime(item.createdAt, "DD MMMM YYYY")}
                    </span>
                  ) : (
                    <span className="text-xs opacity-60">
                      Diedit pada tanggal{" "}
                      {formatTime(item.updatedAt, "DD MMMM YYYY")}
                    </span>
                  )}
                </div>
              ))
            ) : (
              <div className="flex p-12">
                <p className="opacity-40 m-auto">Tidak ada pengumuman</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal id="modal-absen">
        {isBeforeWorkTime() && workTime ? (
          <div className="flex flex-col items-center justify-center h-full">
            <p className="text-xl font-bold text-center">
              Absen bisa dimulai dari jam {workTime.start_time}
            </p>
            <button
              className="btn bg-gray-500 w-1/2 text-white mt-4"
              onClick={() => closeModalAdd("modal-absen")}
            >
              Close
            </button>
          </div>
        ) : !isAbsen ? (
          <>
            <div className={`mt-4 flex justify-center`}>
              {camera ? (
                <>
                  <div className="flex flex-col">
                    {inAreas ? (
                      <FaceDetection
                        onSuccess={handleFaceDetectionSuccess}
                        reAbsen={handleReAbsen}
                      />
                    ) : (
                      <img
                        src="https://png.pngtree.com/png-clipart/20230917/original/pngtree-flat-vector-illustration-of-photo-camera-icon-and-no-image-available-png-image_12324435.png"
                        alt=""
                      />
                    )}
                    <MapWithTwoRadiusPins
                      onAreas={handleInAreas}
                      notOnAreas={handleIsntAreas}
                    />
                  </div>
                </>
              ) : (
                <div className="flex flex-col">
                  <div className="camera-blocked-message text-center">
                    <p>
                      Izin kamera diblokir. Silakan izinkan akses kamera di
                      pengaturan browser Anda.
                    </p>
                  </div>
                  <img
                    src="https://png.pngtree.com/png-clipart/20230917/original/pngtree-flat-vector-illustration-of-photo-camera-icon-and-no-image-available-png-image_12324435.png"
                    alt=""
                  />
                </div>
              )}
            </div>
            <div className="w-full flex gap-2">
              <button
                className={`btn bg-gray-500 w-full text-white `}
                onClick={() => closeModalAdd("modal-absen")}
              >
                Close
              </button>
            </div>
          </>
        ) : isReAbsen ? (
          <>
            <div className="h-full w-full flex items-center justify-center">
              <div className="flex w-full justify-center items-center flex-col gap-10">
                <span className="text-green-500 text-[200px]">
                  <FaCheckCircle />
                </span>
                <span className="text-xl font-bold text-center">
                  Anda sudah Melakukan Absen Sebelumnya
                </span>
                <button
                  onClick={() => closeModalAdd("modal-absen")}
                  className="btn bg-green-500 text-white w-1/2 mt-5"
                >
                  Oke
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="h-full w-full flex items-center justify-center">
              <div className="flex w-full justify-center items-center flex-col">
                <span className="text-green-500 text-[300px]">
                  <FaCheckCircle />
                </span>
                <span className="text-2xl font-bold text-white ">
                  Berhasil Absensi
                </span>
                <div className="mt-5 w-full px-6 flex justify-center item-center flex-col gap-3">
                  <div className="w-full h-14 bg-white p-3 justify-center flex text-black font-bold text-xl shadow-md rounded-md">
                    {employee?.full_name ?? "-"}
                  </div>
                  <div className="w-full h-14 bg-white p-3 justify-center flex flex-col items-center text-black font-bold text-xl shadow-md rounded-md">
                    <p>{currentTime} WIB</p>
                  </div>
                </div>
                <button
                  onClick={() => closeModalAdd("modal-absen")}
                  className="btn bg-green-500 text-white w-1/2 mt-5"
                >
                  Oke
                </button>
              </div>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
};

export default Dashboard;
