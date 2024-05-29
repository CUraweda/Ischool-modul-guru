import { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import KalenderPekanan from "../../component/CalendarPekanan";
import Modal from "../../component/modal";
import { Kalender, Task } from "../../midleware/api";
import { Store } from "../../store/Store";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";

const schema = Yup.object({
  tahun: Yup.string().required("required"),
  kelas: Yup.string().required("required"),
  semester: Yup.string().required("required"),
  title: Yup.string().required("required"),
  start_date: Yup.string().required("required"),
  end_date: Yup.string().required("required"),
  hide: Yup.boolean().required("required"),
});

const jadwalMengajar = () => {
  const { token, tanggalPekanan, tanggalStartDate } = Store();
  const [kelas, setKelas] = useState<any[]>([]);
  const [smt, setSmt] = useState<string>("1");
  const [idClass, setIdClass] = useState<string>("11");

  const formik = useFormik({
    initialValues: {
      tahun: "",
      kelas: "",
      semester: "",
      title: "",
      start_date: "",
      end_date: "",
      hide: false,
    },
    validationSchema: schema,
    onSubmit: (values) => {
      console.log(values);
    },
  });

  useEffect(() => {
    getClass();
  }, []);

  useEffect(() => {
    if (tanggalStartDate) {
      const hours = new Date(tanggalStartDate)
        .getHours()
        .toString()
        .padStart(2, "0");

      let minutes = new Date(tanggalStartDate).getMinutes();
      const minutesStart = new Date(tanggalStartDate)
        .getMinutes()
        .toString()
        .padStart(2, "0");
      minutes += 30;

      if (minutes > 59) {
        const additionalHours = Math.floor(minutes / 60);
        minutes %= 60;
        const newHours = parseInt(hours) + additionalHours;
        formik.setFieldValue(
          "end_date",
          `${newHours.toString().padStart(2, "0")}:${minutes
            .toString()
            .padStart(2, "0")}`
        );

        formik.setFieldValue("start_date", `${hours}:${minutesStart}`);
      } else {
        formik.setFieldValue(
          "end_date",
          `${hours}:${minutes.toString().padStart(2, "0")}`
        );
        formik.setFieldValue("start_date", `${hours}:${minutesStart}`);
      }
    }
  }, [tanggalStartDate]);

  const showModal = (props: string) => {
    let modalElement = document.getElementById(`${props}`) as HTMLDialogElement;
    if (modalElement) {
      modalElement.showModal();
    }
    getClass();
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

  const createAgenda = async () => {
    const { tahun, title, kelas, semester, start_date, end_date, hide } =
      formik.values;

    const data = {
      academic_year: tahun,
      class_id: kelas,
      semester,
      title,
      start_date: new Date(formatDateCreate(start_date)),
      end_date: new Date(formatDateCreate(end_date)),
      hide_student: hide ? hide : false,
    };

    const pertama = new Date(start_date).getTime();
    const kedua = new Date(end_date).getTime();
    const jeda = Math.abs(kedua - pertama);
    const jedaMenit = jeda / (1000 * 60);

    if (jedaMenit < 5) {
      closeModal("add-rencana");
      Swal.fire({
        title: "Waktu Error?",
        text: "Rentang waktu minimal 5 menit. Harap ubah tanggal atau jam.",
        icon: "error",
      });
    } else {
      await Kalender.createTimeTable(token, data);
      window.location.reload();
    }
  };

  const getDate = () => {
    const options: Intl.DateTimeFormatOptions = {
      month: "long",
      year: "numeric",
    };
    const date = new Date(tanggalPekanan)
      .toLocaleDateString("id-ID", options)
      .toUpperCase();
    return date;
  };

  const formatDate = () => {
    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "long",
      year: "numeric",
    };
    const date = new Date(tanggalStartDate).toLocaleDateString(
      "id-ID",
      options
    );
    return date;
  };

  const formatDateCreate = (props: any) => {
    const dateObject = new Date(tanggalStartDate);
    const tanggalFormatted = dateObject.toLocaleDateString("en-CA");
    const finalDate = tanggalFormatted + "T" + props;
    return finalDate;
  };

  return (
    <div className="my-10 w-full flex flex-col items-center">
      <div className=" flex flex-col items-center w-full text-3xl font-bold text-center">
        <span>RENCANA PEKANAN</span>
        <span className="text-xl">Bulan {getDate()}</span>
      </div>
      <div className="w-full p-6">
        <div className="text-right">
          <div className="join">
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
            <select
              className="select select-bordered w-36 join-item"
              onChange={(e) => setSmt(e.target.value)}
            >
              <option disabled selected>
                Semester
              </option>
              <option value={1}>1</option>
              <option value={2}>2</option>
            </select>
            <button
              className="btn bg-green-500 btn-ghost text-white join-item"
              onClick={() => showModal("add-rencana")}
            >
              <span className="text-xl">
                <FaPlus />
              </span>
              Tambah
            </button>
          </div>
        </div>

        <div className={`w-full bg-white mt-5`}>
          <KalenderPekanan smt={smt} kelas={idClass} />
        </div>
      </div>

      <Modal id="add-rencana">
        <div className="w-full flex flex-col items-center">
          <span className="text-xl font-bold">Tambah Rencana Pekanan</span>
          <span className="text-xl font-bold">{formatDate()}</span>
          <div className="flex w-full mt-5 flex-col">
            <div className="w-full flex flex-col gap-2">
              <label className="mt-4 w-full font-bold">Tahun Pelajaran</label>
              <select
                className="select select-bordered w-full"
                onChange={(e) => formik.setFieldValue("tahun", e.target.value)}
              >
                <option disabled selected>
                  Pilih Tahun
                </option>
                <option value={"2023/2024"}>2023 / 2024</option>
                <option value={"2024/2025"}>2024 / 2025</option>
              </select>
            </div>
            <div className="w-full flex flex-col gap-2">
              <label className="mt-4 w-full font-bold">Semester</label>
              <select
                className="select select-bordered w-full"
                onChange={(e) =>
                  formik.setFieldValue("semester", e.target.value)
                }
              >
                <option disabled selected>
                  Pilih Semester
                </option>
                <option value={1}>1</option>
                <option value={2}>2</option>
              </select>
            </div>
            <div className="w-full flex flex-col gap-2">
              <label className="mt-4 w-full font-bold">Kelas</label>
              <select
                className="select select-bordered join-item"
                onChange={(e) => formik.setFieldValue("kelas", e.target.value)}
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
              <label className="mt-4 w-full font-bold">
                Detail Rencana Pekanan
              </label>
              <textarea
                className="textarea textarea-bordered bg-white shadow-md scrollbar-hide"
                placeholder="Agenda"
                onChange={(e) => formik.setFieldValue("title", e.target.value)}
              ></textarea>
            </div>
          </div>
          <div className="w-full">
            <div className="w-full flex flex-col gap-2">
              <label className="mt-4 font-bold">Pukul</label>
              <div className="flex gap-2 justify-center items-center">
                <input
                  type="time"
                  className="input input-bordered bg-white shadow-md w-full"
                  min="07:00"
                  max="15:30"
                  value={formik.values.start_date}
                  onChange={(e) =>
                    formik.setFieldValue("start_date", e.target.value)
                  }
                />
                <span>-</span>
                <input
                  type="time"
                  className="input input-bordered bg-white shadow-md w-full"
                  min="07:00"
                  max="15:30"
                  value={formik.values.end_date}
                  onChange={(e) =>
                    formik.setFieldValue("end_date", e.target.value)
                  }
                />
              </div>
            </div>
          </div>
          <div className="w-full mt-3 justify-start items-center flex gap-3">
            <input
              type="checkbox"
              className="checkbox"
              onChange={(e) => {
                formik.setFieldValue("hide", e.target.checked);
              }}
            />
            <label className="font-bold">Tampilkan di modul siswa ?</label>
          </div>

          <div className="w-full flex justify-center mt-10 gap-2">
            <button
              className={`btn btn-ghost bg-green-500 text-white font-bold w-full `}
              onClick={createAgenda}
            >
              Simpan
            </button>
          </div>
        </div>
      </Modal>
     
    </div>
  );
};

export default jadwalMengajar;
