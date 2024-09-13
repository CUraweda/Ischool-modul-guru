import { useEffect, useState } from "react";
import bg from "../../assets/bg2.png";
import ApexChart from "../../component/ApexChart";
import FaceDetection from "../../component/FaceRegocnition";

import MapWithTwoRadiusPins from "../../component/MapWithTwoRadiusPins";
import Modal, { closeModal, openModal } from "../../component/modal";
import { employeeStore, Store } from "../../store/Store";
import {
  FaDoorClosed,
  FaDoorOpen,
  FaExclamationTriangle,
} from "react-icons/fa";
import moment from "moment";
import { formatTime } from "../../utils/date";
import {
  PelatihanKaryawan,
  PengumumanKaryawan,
  Rekapan,
  waktukerja,
} from "../../midleware/api-hrd";
import { useNavigate } from "react-router-dom";
import { Auth, Task } from "../../midleware/api";

const Dashboard: React.FC = () => {
  const currentDate = moment();
  const { token } = Store();
  const { employee, formTeachers } = employeeStore();
  const navigate = useNavigate();

  const [inAreas, setInAreas] = useState<boolean>(false);
  const handleInAreas = () => {
    setInAreas(true);
  };
  const handleIsntAreas = () => {
    setInAreas(false);
  };

  // submit attendance
  const [attends, setAttends] = useState({
    total: 0,
    done: 0,
  });
  const handleFaceDetectionSuccess = (_: any) => {
    stopCamera();
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

  // get today worktime
  const [todayWorktimes, setTodayWorktimes] = useState<any[]>([]);
  const getTodayWorktime = async () => {
    try {
      const res = await waktukerja.today(token);
      setTodayWorktimes(res.data?.data ?? []);
      const doneCount = res.data?.data?.reduce((count: number, item: any) => {
        return item.employeeattendances?.length ? count + 1 : count;
      }, 0);

      setAttends((d) => ({
        ...d,
        total: res.data?.data?.length ?? 0,
        done: doneCount,
      }));
    } catch {}
  };

  // request cuti action
  const requestCutiClick = () => {
    navigate("/karyawan/daftar-cuti-izin", {
      state: { openModalId: "form-cuti-izin" },
    });
  };

  // get attendance summary
  const [rekapPresensi, setRekapPresensi] = useState<any>(null);
  const getRekapPresensi = async () => {
    if (!employee) return;

    try {
      const res = await Rekapan.jumlahPresensi(token, employee.id);
      setRekapPresensi(res.data?.data ?? null);
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
      setLatestTraining(response.data?.data?.result ?? []);
    } catch {}
  };

  // get employee announcement
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const getAnnouncements = async () => {
    try {
      const res = await PengumumanKaryawan.showAll(token, "", "1", "");
      setAnnouncements(res.data?.data?.result ?? []);
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
      const data = response.data?.data ?? null;
      if (!data) return;

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
    getTodayWorktime();
  };
  const getMe = async () => {
    try {
      const res = await Auth.MeData(token);
      previewProfile(res.data.data.avatar);
    } catch (error) {
      console.error(error);
    }
  };
  const [image, setImage] = useState<any>(null);
  const previewProfile = async (path: any) => {
    try {
      const lowerCasePath = path.toLowerCase();
      const response = await Task.downloadTugas(token, lowerCasePath);
      let mimeType = "application/pdf";

      if (lowerCasePath.endsWith(".png")) {
        mimeType = "image/png";
      } else if (
        lowerCasePath.endsWith(".jpg") ||
        lowerCasePath.endsWith(".jpeg")
      ) {
        mimeType = "image/jpeg";
      } else {
        throw new Error("Unsupported file type");
      }

      const blob = new Blob([response.data], { type: mimeType });
      const blobUrl = window.URL.createObjectURL(blob);
      setImage(blobUrl);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    getData();
    getMe();
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
                  <img
                    className="text-center"
                    src={`${image ? image : "https://korpri.padang.go.id/assets/img/dewan_pengurus/no-pict.jpg"}`}
                    alt="No Picture"
                  />
                </div>
              </div>
              <h3 className="text-2xl text-center font-bold">
                {employee?.full_name ?? "-"}
              </h3>
              <p className=" text-justify">
                {formTeachers
                  ?.map((ft) => `Wali Kelas ${ft.class?.class_name ?? "-"} `)
                  .join(" | ")}
              </p>
            </div>

            {/* division attendance schedule  */}
            <div className="p-6 grow">
              {todayWorktimes.map((item, i) => {
                const attendData = item.employeeattendances?.length
                  ? item.employeeattendances[0]
                  : null;

                return (
                  <div
                    key={i}
                    className="w-full flex items-center bg-base-200 p-3 rounded-md mb-3"
                  >
                    <div className="grow">
                      <h6 className="font-bold text-md capitalize">
                        Jadwal {item.type?.toLowerCase()} (
                        {item.start_time.split(":")[0] +
                          ":" +
                          item.start_time.split(":")[1]}{" "}
                        -{" "}
                        {item.end_time.split(":")[0] +
                          ":" +
                          item.end_time.split(":")[1]}
                        )
                      </h6>

                      {/* employee attendance data  */}
                      <p className="text-sm sm:text-md mb-2">
                        Presensi Anda :{" "}
                        <span className="font-bold">
                          {attendData
                            ? formatTime(attendData.createdAt, "HH:mm")
                            : "Belum ada"}
                        </span>
                      </p>

                      {/* badge  */}
                      <div
                        className={`${attendData ? (attendData.status == "Tepat Waktu" ? "badge-success text-white" : attendData.status == "Terlambat" ? "badge-error text-white" : attendData.status == "Terlalu Cepat" ? "badge-warning" : "") : "badge-primary"} badge text-sm sm:text-md`}
                      >
                        {attendData ? attendData.status : "Belum ada status"}
                      </div>
                    </div>

                    {/* icon  */}
                    {item.type == "MASUK" ? (
                      <FaDoorOpen size={32} className="grow opacity-20" />
                    ) : (
                      <FaDoorClosed size={32} className="grow opacity-20" />
                    )}
                  </div>
                );
              })}
            </div>

            <div className="px-6 pb-3 flex flex-col gap-2">
              <button
                className="btn btn-primary grow"
                disabled={attends.done == attends.total}
                onClick={() => {
                  if (attends.done == attends.total) return;
                  openModal("modal-absen", () => {
                    kamera();
                  });
                }}
              >
                Presensi
              </button>
              <button
                onClick={requestCutiClick}
                className="btn  btn-warning grow"
              >
                Ajukan Cuti
              </button>
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
                        {latestTraining.length < 1 ? (
                          <tr>Tidak Ada data pelatihan</tr>
                        ) : (
                          latestTraining?.map((item: any, index: any) => (
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
                          ))
                        )}
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

      <Modal
        id="modal-absen"
        onClose={() => {
          setCamera(false);
        }}
      >
        <div className={`mt-4 flex justify-center`}>
          {camera ? (
            <>
              <div className="flex flex-col">
                {inAreas ? (
                  <FaceDetection
                    onSuccess={handleFaceDetectionSuccess}
                    reAbsen={() => {}}
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
              <div role="alert" className="alert alert-warning font-semibold">
                <FaExclamationTriangle size={24} />
                <span>
                  Izin kamera diblokir. Silakan izinkan akses kamera di
                  pengaturan browser Anda.
                </span>
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
            onClick={() => closeModal("modal-absen")}
          >
            Tutup
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Dashboard;
