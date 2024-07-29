import { useState } from "react";
import bg from "../../assets/bg2.png";
import ApexChart from "../../component/ApexChart";
import FaceDetection from "../../component/FaceRegocnition";

import MapWithTwoRadiusPins from "../../component/MapWithTwoRadiusPins";

import Modal from "../../component/modal";
import { employeeStore, useProps } from "../../store/Store";

const Dashboard = () => {
  const { employee, formTeachers } = employeeStore();

  const [camera, setCamera] = useState<boolean>(false);
  const { inArea, distance } = useProps();

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

  return (
    <div
      className="flex min-h-screen items-start flex-wrap p-5"
      style={{ backgroundImage: `url('${bg}')`, backgroundSize: "cover" }}
    >
      <div className="w-full flex flex-col">
        <div className="w-full flex flex-col sm:flex-row ">
          <div className="w-full sm:w-2/5 p-3 ">
            <div className="rounded-md glass bg-green-400 shadow-lg flex flex-col justify-center items-center p-3 text-white">
              <div className="my-3 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold">11.20</span>
                <span>selasa, 4 Juni 2024</span>
              </div>
              <div className="avatar">
                <div className="w-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                </div>
              </div>
              <div className="my-3 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold">
                  {employee.full_name ?? "-"}
                </span>
                <span className="text-md">
                  {formTeachers
                    .map((ft) => `Wali Kelas ${ft.class?.class_name ?? "-"}`)
                    .join(" | ")}
                </span>
              </div>
              <div className="my-3 px-5 w-full gap-3 flex flex-col items-center justify-center text-white">
                <div className="w-full glass bg-green-500 flex flex-col items-center p-3 rounded-md justify-center ">
                  <span className="font-bold text-sm sm:text-md">
                    Jadwal Masuk (07.00 - 08.00)
                  </span>
                  <p className="text-sm sm:text-md">
                    Presensi Masuk : <span className="font-bold">07.20</span>
                  </p>
                  <div className="badge badge-secondary text-sm sm:text-md">
                    Tepat Waktu
                  </div>
                </div>
                <div className="w-full glass bg-green-500 flex flex-col items-center p-3 rounded-md justify-center">
                  <span className="font-bold text-sm sm:text-md">
                    Jadwal Pulang (07.00 - 08.00)
                  </span>
                  <p className="text-sm sm:text-md">
                    Presensi Pulang : <span className="font-bold">07.20</span>
                  </p>
                  <div className="badge badge-secondary">Tepat Waktu</div>
                </div>
              </div>
              <div className="w-full flex justify-center mt-5 gap-2">
                <button
                  className="btn bg-blue-500 hover:bg-blue-800 btn-ghost w-32 text-white"
                  onClick={() => showModalAdd("modal-absen")}
                >
                  Presensi
                </button>
                <button className="btn  btn-warning w-32 text-white">
                  Ajukan Cuti
                </button>
              </div>
            </div>
          </div>
          <div className="w-full flex flex-col sm:w-3/5 p-3 gap-3 ">
            <div className="w-full flex flex-wrap gap-3 sm:gap-0 ">
              <div className="flex w-full sm:w-1/2 pr-0 sm:pr-2">
                <div className="shadow-lg glass bg-cyan-600 text-white flex w-full  p-3 flex-col items-center rounded-md">
                  <span className="text-xl font-bold">Rekap Presensi </span>
                  <span className="text-md">Bulan Juni</span>
                  <div className="overflow-x-auto w-full">
                    <table className="table table-zebra ">
                      <thead className="text-white">
                        <tr>
                          <th>Hadir</th>
                          <th>9 Hari</th>
                        </tr>
                        <tr>
                          <th>Izin</th>
                          <th>2 Hari</th>
                        </tr>
                        <tr>
                          <th>Cuti</th>
                          <th>4 Hari</th>
                        </tr>
                      </thead>
                    </table>
                  </div>
                </div>
              </div>
              <div className="flex w-full sm:w-1/2 pl-0 sm:pl-2 ">
                <div className="glass bg-cyan-500 text-white shadow-lg flex w-full flex-col p-3 items-center rounded-md">
                  <span className="text-xl font-bold">Daftar Pelatihan</span>
                  <div className="overflow-x-auto w-full">
                    <table className="table table-zebra">
                      <thead className="text-white">
                        <tr>
                          <th>Pelatihan Managent</th>
                          <th>04-06-2024</th>
                        </tr>
                        <tr>
                          <th>Pelatihan Managent</th>
                          <th>04-06-2024</th>
                        </tr>
                        <tr>
                          <th>Pelatihan Managent</th>
                          <th>04-06-2024</th>
                        </tr>
                      </thead>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full flex glass bg-cyan-300 shadow-lg h-full rounded-md p-3">
              <div className="w-full flex flex-col items-center justify-center">
                <span className="text-xl font-bold">Chart Absensi</span>
                <div className="h-full min-h-52 w-full bg-white rounded-md">
                  <ApexChart />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className=" w-full flex min-h-60">
          <div className="w-full p-3">
            <div className="glass bg-green-300 shadow-lg p-3 flex-col rounded-md flex">
              <span className="text-xl font-bold">Pengumuman</span>
              <div className="h-52 w-full bg-white rounded-md flex justify-center items-center">
                <span className="text-gray-300 font-bold">
                  tidak ada pengumuman
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
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
