import { useEffect, useState } from "react";
import bg from "../../assets/bg2.png";
import ApexChart from "../../component/ApexChart";
import FaceDetection from "../../component/FaceRegocnition";
import { DashboardGuru, Auth } from "../../midleware/api";
import { useNavigate } from "react-router-dom";
import {
  PelatihanKaryawan,
  waktukerja,
  Rekapan,
} from "../../midleware/api-hrd";
import { FaCheckCircle } from "react-icons/fa";

import MapWithTwoRadiusPins from "../../component/MapWithTwoRadiusPins";
import Modal from "../../component/modal";
import { employeeStore, Store } from "../../store/Store";
import {
  FaDoorClosed,
  FaDoorOpen,
  FaExclamationTriangle,
} from "react-icons/fa";
import moment from "moment";
import { formatTime } from "../../utils/date";
import Swal from "sweetalert2";
import dayjs from "dayjs";

const Dashboard = () => {
  const currentDate = moment();
  const { employee, formTeachers } = employeeStore();
  const { token, id } = Store();

  const [inAreas, setInAreas] = useState<boolean>(false);
  const handleInAreas = () => {
    setInAreas(true);
  };
  const handleIsntAreas = () => {
    setInAreas(false);
  };

  const navigate = useNavigate();
  const [camera, setCamera] = useState<boolean>(false);
  const [DataAnnouncment, setDataAnnouncment] = useState<any[]>([]);
  const [isAbsen, setIsAbsen] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<string>("");
  const [isLate, setIsLate] = useState<boolean>(false);

  const handleFaceDetectionSuccess = () => {
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
  };
  const [DataAttendance, setDataAttendance] = useState<any[]>([]);
  const [rekapPresensi, setRekapPresensi] = useState<any>(null);
  const [workTime, setWorkTime] = useState<any[]>([]);
  const [User, setUser] = useState<any>(null);
  const [DetTraining, setDetTraining] = useState<any>(null);
  const [DataTraining, setDataTraining] = useState<any[]>([]);
  const [rekapYear, setRekapYear] = useState({
    cuti: [],
    izin: [],
    hadir: [],
    categories: [],
    maxValue: 0,
  });
  const today = dayjs().format("YYYY-MM-DD");
  const filteredAttendance = DataAttendance.filter(
    (attendance) => dayjs(attendance.createdAt).format("YYYY-MM-DD") === today
    //  &&
    //   attendance.worktime.type === "MASUK"
  );

  const handleCutiButtonClick = () => {
    navigate("/karyawan/daftar-cuti-izin", {
      state: { openModalId: "form-cuti-izin" },
    });
  };
  const getWorkTime = async () => {
    if (id && token) {
      try {
        const response = await waktukerja.getWorkTime(token);
        setWorkTime(response.data.data);
      } catch (err) {
        console.log("error:" + err);
      }
    } else {
      console.error("Missing id or token in sessionStorage");
    }
  };
  const getRecap = async () => {
    if (id && token) {
      try {
        const response = await Rekapan.getRecapMonthly(token, id);
        setRekapPresensi(response.data.data);
      } catch (err) {
        console.log("error:" + err);
      }
    } else {
      console.error("Missing id or token in sessionStorage");
    }
  };
  const getTraining = async () => {
    if (id && token) {
      try {
        const response = await PelatihanKaryawan.getTraining(token, id);
        setDataTraining(response.data.data.result);
      } catch (err) {
        console.log("error:" + err);
      }
    } else {
      console.error("Missing id or token in sessionStorage");
    }
  };
  const getDataAttendance = async () => {
    if (id && token) {
      try {
        const response = await DashboardGuru.getAttendance(token, id);
        const data = response.data.data.result;
        setDataAttendance(data);
      } catch (error) {
        console.error("Failed to fetch attendance data", error);
      }
    } else {
      console.error("Missing id or token in sessionStorage");
    }
  };

  const getAnnouncement = async () => {
    if (id && token) {
      try {
        const response = await DashboardGuru.getAnnouncement(token, 1);
        setDataAnnouncment(response.data.data.result);
      } catch (error) {
        console.error("Failed to fetch attendance data", error);
      }
    } else {
      console.error("Missing id or token in sessionStorage");
    }
  };
  const getProfile = async () => {
    try {
      const response = await Auth.MeData(token);
      setUser(response.data.data);
    } catch (err) {
      console.log("error:" + err);
    }
  };
  const showModalAdd = (props: string, type: string) => {
    let modalElement = document.getElementById(props) as HTMLDialogElement;
    if (modalElement) {
      modalElement.showModal();
      if (type === "camera") {
        kamera();
      }
    }
  };
  const closeModalAdd = (props: string) => {
    let modalElement = document.getElementById(props) as HTMLDialogElement;
    if (modalElement) {
      modalElement.close();
      setCamera(false);
    }
  };
  const getAllRecapYear = async () => {
    if (id && token) {
      try {
        const response = await Rekapan.getRecapYear(token, id);
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

        setRekapYear({
          cuti: cutiData,
          izin: izinData,
          hadir: hadirData,
          categories,
          maxValue,
        });
      } catch (err) {
        console.log("error:" + err);
      }
    }
  };

  useEffect(() => {
    getDataAttendance();
    getRecap();
    getWorkTime();
    getTraining();
    getAnnouncement();
    getProfile();
    getAllRecapYear();
  }, []);
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

  const triggerCheck = () => {
    const time = new Date();
    const currentTime = time.toTimeString().split(" ")[0];

    const isWithinWorkTime = workTime.some((work) => {
      const { start_time, end_time } = work;
      return (
        (currentTime >= start_time && currentTime <= end_time) ||
        currentTime > end_time
      );
    });

    // Memeriksa apakah saat ini sebelum waktu kerja dimulai
    const isBeforeWorkTime = workTime.every(
      (work) => currentTime < work.start_time
    );

    if (isWithinWorkTime && !isBeforeWorkTime) {
      showModalAdd("modal-absen", "camera");
    } else {
      Swal.fire({
        icon: "warning",
        title: "Waktu presensi di luar jam kerja",
        text: "Silakan coba lagi.",
      });
    }
  };

  return (
    <div
      className="flex min-h-screen items-start flex-wrap p-3"
      style={{ backgroundImage: `url('${bg}')`, backgroundSize: "cover" }}
    >
      {!employee && (
        <div role="alert" className="alert alert-warning mb-6">
          <FaExclamationTriangle />
          <span>Akun anda belum terhubung ke data karyawan!</span>
        </div>
      )}
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
                {User?.full_name ?? "-"} <br />
                <span className="text-sm font-semibold">
                  {User?.email ?? "-"}
                </span>
              </h3>
              <p className="text-center">
                {formTeachers
                  ?.map((ft) => `Wali Kelas ${ft.class?.class_name ?? "-"}`)
                  .join(" | ")}
              </p>
            </div>
            <div className="p-6 grow">
              <div>
                <div className="grow">
                  {workTime.map((item: any, index: any) => {
                    // Filter attendance sesuai dengan tipe worktime
                    const relevantAttendance = filteredAttendance.filter(
                      (attendance) => attendance.worktime.type === item.type
                    );

                    return (
                      <div className="w-full flex items-center bg-base-200 p-3 rounded-md mb-3">
                        <div key={index} className="mb-4">
                          <h6 className="font-bold text-md">
                            Jadwal {item.type} (
                            {item.start_time.split(":")[0] +
                              ":" +
                              item.start_time.split(":")[1]}{" "}
                            -{" "}
                            {item.end_time.split(":")[0] +
                              ":" +
                              item.end_time.split(":")[1]}
                            )
                          </h6>

                          {relevantAttendance.length > 0 ? (
                            relevantAttendance.map((attendance, index) => (
                              <div key={index} className="mt-2">
                                <p className="text-sm">
                                  Presensi anda:
                                  <span className="font-bold px-2">
                                    {
                                      attendance.createdAt
                                        .split("T")[1]
                                        .split(".")[0]
                                    }
                                  </span>
                                </p>

                                {/* Conditional Rendering for Badge */}
                                <div className="flex justify-between w-full">
                                  <div
                                    className={`badge mt-3 text-white font-bold ${
                                      attendance.status.toLowerCase() ===
                                      "tepat waktu"
                                        ? "badge-success"
                                        : attendance.status.toLowerCase() ===
                                            "terlambat"
                                          ? "badge-error"
                                          : "badge-warning"
                                    }`}
                                  >
                                    {attendance.status}
                                  </div>

                                  {attendance.worktime.type === "MASUK" ? (
                                    <FaDoorOpen
                                      size={32}
                                      className="grow opacity-20"
                                    />
                                  ) : (
                                    <FaDoorClosed
                                      size={32}
                                      className="grow opacity-20"
                                    />
                                  )}
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-sm text-gray-500 mt-2">
                              Belum ada presensi
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="px-6 pb-3 flex flex-col gap-2">
              <button
                className="btn btn-primary grow"
                onClick={() => triggerCheck()}
              >
                Presensi
              </button>
              <button
                onClick={handleCutiButtonClick}
                className="btn btn-warning grow"
              >
                Ajukan Cuti
              </button>
            </div>
          </div>
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
                        {DataTraining.map((item: any, index: any) => (
                          <tr key={index}>
                            <div
                              className="cursor-pointer"
                              onClick={() => {
                                showModalAdd("modal-Training", "");
                                setDetTraining(item);
                              }}
                            >
                              <th>
                                <p className="line-clamp-2 text-ellipsis overflow-hidden">
                                  {item.title} <br /> {item.purpose}{" "}
                                  {item.location}
                                </p>
                              </th>
                              <td className="whitespace-nowrap">
                                {item.start_date.split("T")[0]}
                              </td>
                            </div>
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
                <ApexChart data={rekapYear} />
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
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">ID</th>
                  <th className="py-2 px-4 border-b">Plan Date</th>
                  <th className="py-2 px-4 border-b">Notes</th>
                </tr>
              </thead>
              <tbody>
                {DataAnnouncment.map((announcement: any, index: number) => (
                  <tr key={index}>
                    <td className="py-2 px-4 border-b text-center">
                      {index + 1}
                    </td>
                    <td className="py-2 px-4 border-b text-center">
                      {announcement.plan_date.split("T")[0]}
                    </td>
                    <td className="py-2 px-4 border-b">{announcement.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex p-12">
            <div className="m-auto">
              {/* <div className="m-auto">Tidak Ada Pengumuman</div> */}
            </div>
          </div>
        </div>
      </div>

      <Modal id="modal-Training">
        <h2 className="text-lg font-bold mb-4">Detail Pelatihan </h2>
        <div className={`mt-4 flex justify-center`}>
          <table className="min-w-full bg-white">
            <tbody>
              <tr>
                <td className="py-2 px-4 border-b">Judul</td>
                <td className="py-2 px-4 border-b">{DetTraining?.title}</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b">Lokasi</td>
                <td className="py-2 px-4 border-b">{DetTraining?.location}</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b">Deskripsi</td>
                <td className="py-2 px-4 border-b">{DetTraining?.purpose}</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b">Status</td>
                <td className="py-2 px-4 border-b">{DetTraining?.status}</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b">Tanggal</td>
                <td className="py-2 px-4 border-b">
                  {DetTraining?.start_date.split("T")[0]} s/d{" "}
                  {DetTraining?.end_date.split("T")[0]}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Modal>

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
                    <div className="badge badge-accent badge-outline">
                      {isLate ? "Tidak Tepat Waktu" : "Tepat Waktu"}
                    </div>
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
