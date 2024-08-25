import { useEffect, useState } from "react";
import bg from "../../assets/bg2.png";
import ApexChart from "../../component/ApexChart";
import FaceDetection from "../../component/FaceRegocnition";
import { DashboardGuru, Auth } from "../../midleware/api";
import MapWithTwoRadiusPins from "../../component/MapWithTwoRadiusPins";
import { Formik, Field, Form, ErrorMessage } from "formik";
import Modal from "../../component/modal";
import { employeeStore, Store, useProps } from "../../store/Store";
import { FaDoorClosed, FaDoorOpen } from "react-icons/fa";
import moment from "moment";
import { formatTime } from "../../utils/date";
import * as Yup from "yup";
import Swal from "sweetalert2";
import dayjs from "dayjs";
const Dashboard = () => {
  const { token, id } = Store(),
    { formTeachers } = employeeStore();

  const currentDate = moment();
  const [DataAttendance, setDataAttendance] = useState<any[]>([]);
  const [camera, setCamera] = useState<boolean>(false);
  const [DataAnnouncment, setDataAnnouncment] = useState<any[]>([]);
  const { inArea, distance } = useProps();
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
  const getWorkTime = async () => {
    if (id && token) {
      try {
        const response = await DashboardGuru.getWorkTime(token);
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
        const response = await DashboardGuru.getRecapMonthly(token, id);
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
        const response = await DashboardGuru.getTraining(token, id);
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

  const handleSubmit = (values: any) => {
    const formData = new FormData();
    formData.append("type", "CUTI");
    formData.append("start_date", values.start_date);
    formData.append("end_date", values.end_date);
    formData.append("description", values.deskripsi);
    if (id) {
      formData.append("employee_id", id);
    } else {
      console.error("Employee ID is missing");
    }
    if (values.file) {
      formData.append("file", values.file);
    }
    requestCuti(formData);
  };
  const requestCuti = async (data: any) => {
    try {
      const response = await DashboardGuru.requestCuti(token, data);
      if (response.status === 201) {
        Swal.fire({
          icon: "success",
          title: "Request Cuti Berhasil",
          text: response.data.message,
        });
        closeModalAdd("modal-cuti");
      }
    } catch (err) {
      console.log("error:" + err);
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
        const response = await DashboardGuru.getRecapYear(token, id);
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
  const validationSchema = Yup.object({
    start_date: Yup.string().required("Tanggal mulai diperlukan"),
    end_date: Yup.string().required("Tanggal berakhir diperlukan"),
    file: Yup.mixed().required("File diperlukan").nullable(),
    deskripsi: Yup.string().required("Deskripsi diperlukan"),
  });

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
                onClick={() => showModalAdd("modal-absen", "camera")}
              >
                Presensi
              </button>
              <button
                className="btn btn-warning grow"
                onClick={() => showModalAdd("modal-cuti", "cuti")}
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

      <Modal id="modal-cuti">
        <div className={`mt-4 flex justify-center`}>
          <div className="w-full gap-2 block">
            <h2 className="text-lg font-bold mb-4">Ajukan Cuti</h2>
            <Formik
              initialValues={{
                start_date: "",
                end_date: "",
                file: null,
                deskripsi: "",
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ setFieldValue }) => (
                <Form>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">
                      Tanggal Mulai
                    </label>
                    <Field
                      type="date"
                      name="start_date"
                      className="w-full p-2 border rounded"
                    />
                    <ErrorMessage
                      name="start_date"
                      component="div"
                      className="text-red-600 text-sm"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">
                      Tanggal Berakhir
                    </label>
                    <Field
                      type="date"
                      name="end_date"
                      className="w-full p-2 border rounded"
                    />
                    <ErrorMessage
                      name="end_date"
                      component="div"
                      className="text-red-600 text-sm"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">
                      Deskripsi
                    </label>
                    <Field
                      type="textarea"
                      name="deskripsi"
                      className="w-full p-2 border rounded"
                    />
                    <ErrorMessage
                      name="deskripsi"
                      component="div"
                      className="text-red-600 text-sm"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">
                      File (Image/PDF)
                    </label>
                    <input
                      type="file"
                      className="w-full p-2 border rounded"
                      accept="image/*,.pdf"
                      onChange={(event) => {
                        setFieldValue("file", event.currentTarget.files![0]);
                      }}
                    />
                    <ErrorMessage
                      name="file"
                      component="div"
                      className="text-red-600 text-sm"
                    />
                  </div>
                  <div className="mt-4 flex justify-center">
                    <div className="w-full flex gap-2">
                      <button
                        className={`btn bg-gray-500 text-white `}
                        onClick={() => closeModalAdd("modal-cuti")}
                      >
                        Close
                      </button>
                      <button
                        type="submit"
                        className="btn bg-blue-500 text-white"
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </Modal>
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
        <div className={`mt-4 flex justify-center`}>
          {camera ? (
            <>
              <MapWithTwoRadiusPins />
              <FaceDetection />
            </>
          ) : (
            <img
              src="https://png.pngtree.com/png-clipart/20230917/original/pngtree-flat-vector-illustration-of-photo-camera-icon-and-no-image-available-png-image_12324435.png"
              alt=""
            />
          )}
        </div>
        <div className="my-3 w-full flex flex-col justify-center items-center">
          <img src="" alt="" />
          <span className={` text-bold`}>
            Jarak anda ke area presensi terdekat adalah {distance} meter{" "}
          </span>
          <span className={`${inArea ? "hidden" : ""} text-bold text-red-500`}>
            Anda Berada Diluar Area !{" "}
          </span>
          <div className="w-full flex gap-2">
            <button
              className={`btn bg-gray-500 w-full text-white `}
              onClick={() => closeModalAdd("modal-absen")}
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Dashboard;
