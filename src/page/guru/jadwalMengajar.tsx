import { useState, useEffect } from "react";
import { FaChevronDown } from "react-icons/fa";
import KalenderPekanan from "../../component/CalendarPekanan";
import Modal, { closeModal, openModal } from "../../component/modal";
import { Kalender, Task } from "../../midleware/api";
import { globalStore, Store } from "../../store/Store";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import moment from "moment";
import { formatTime } from "../../utils/date";
import { Input, Select, Textarea } from "../../component/Input";
import { getSemesters } from "../../utils/common";
import ModalCreateRencanaPekananByHistory from "../../component/guru/ModalCreateRencanaPekananByHistory";

const schema = Yup.object({
  tahun: Yup.string().required("required"),
  kelas: Yup.string().required("required"),
  semester: Yup.string().required("required"),
  title: Yup.string().required("required"),
  start_date: Yup.string().required("required"),
  end_date: Yup.string().required("required"),
  hide: Yup.boolean().required("required"),
});

const JadwalMengajar = () => {
  const { academicYear } = globalStore();
  const { tanggalPekanan, tanggalStartDate, setTanggalStartDate } = Store();
  const [triggerShow, setTriggerShow] = useState(true);
  const [kelas, setKelas] = useState<any[]>([]);
  const [smt, setSmt] = useState<string>("1");
  const [idClass, setIdClass] = useState<string>("");

  const formik = useFormik({
    initialValues: {
      tahun: academicYear,
      kelas: "",
      semester: "",
      title: "",
      start_date: "",
      end_date: "",
      hide: false,
    },
    validationSchema: schema,
    validateOnChange: false,
    onSubmit: async (values, { setFieldError }) => {
      const { tahun, title, kelas, semester, start_date, end_date, hide } =
        values;

      const data = {
        academic_year: tahun,
        class_id: kelas,
        semester,
        title,
        start_date: new Date(formatDateCreate(start_date)),
        end_date: new Date(formatDateCreate(end_date)),
        hide_student: !hide,
      };

      const pertama = new Date(data["start_date"]).getTime();
      const kedua = new Date(data["end_date"]).getTime();
      const jeda = Math.abs(kedua - pertama);
      const jedaMenit = jeda / (1000 * 60);

      if (jedaMenit < 5) {
        setFieldError("end_date", "Rentang waktu minimal 5 menit.");
        return;
      }

      try {
        await Kalender.createTimeTable(data);
        formik.resetForm();
        setTriggerShow(!triggerShow);

        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Berhasil menambahkan rencana pekanan",
        });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Gagal",
          text: "Gagal menambahkan rencana pekanan",
        });
      } finally {
        closeModal("add-rencana");
      }
    },
  });

  useEffect(() => {
    getClass();
  }, []);

  useEffect(() => {
    formik.setFieldValue("tahun", academicYear);
  }, [academicYear]);

  useEffect(() => {
    console.log(tanggalStartDate);
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

  const getClass = async () => {
    const response = await Task.GetAllClass(0, 20, "Y");
    setKelas(response.data.data.result);
  };

  const formatDateCreate = (props: any) => {
    const dateObject = new Date(tanggalStartDate);
    const tanggalFormatted = dateObject.toLocaleDateString("en-CA");
    const finalDate = tanggalFormatted + "T" + props;
    return finalDate;
  };

  return (
    <>
      <ModalCreateRencanaPekananByHistory
        modalId="add-rencana-history"
        postCreate={() => setTriggerShow(!triggerShow)}
      />

      <div className="my-10 w-full flex flex-col items-center">
        <div className=" flex flex-col items-center w-full text-3xl font-bold text-center">
          <span>RENCANA PEKANAN</span>
          <span className="text-xl">
            Bulan {moment(tanggalPekanan).format("MMMM YYYY")}
          </span>
        </div>
        <div className="w-full p-6">
          <div className="text-right">
            <div className="join">
              <select
                className="select select-bordered w-36 join-item"
                value={idClass}
                onChange={(e) => setIdClass(e.target.value)}
              >
                <option value="" selected>
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
                value={smt}
                onChange={(e) => setSmt(e.target.value)}
              >
                <option value="" selected>
                  Semester
                </option>
                {getSemesters().map((dat, i) => (
                  <option key={i} value={dat.value}>
                    {dat.label}
                  </option>
                ))}
              </select>

              <div className="dropdown dropdown-end">
                <button
                  tabIndex={0}
                  className="btn btn-ghost bg-secondary text-white join-item"
                >
                  Tambah
                  <FaChevronDown />
                </button>
                <ul
                  tabIndex={0}
                  className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow-lg"
                >
                  <li>
                    <button
                      onClick={() => {
                        setTanggalStartDate(new Date());
                        openModal("add-rencana");
                      }}
                    >
                      Hari ini
                    </button>
                  </li>
                  <li>
                    <button onClick={() => openModal("add-rencana-history")}>
                      Duplikat dari riwayat
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className={`w-full bg-white mt-5`}>
            <KalenderPekanan
              smt={smt}
              kelas={idClass}
              triggerShow={triggerShow}
            />
          </div>
        </div>

        <Modal id="add-rencana">
          <form
            onSubmit={formik.handleSubmit}
            className="w-full flex flex-col items-center"
          >
            <span className="text-xl font-bold">Tambah Rencana Pekanan</span>
            <span className="text-xl font-bold">
              {formatTime(moment(tanggalStartDate), "DD MMMM YYYY")}
            </span>

            <div className="flex w-full mt-5 flex-col">
              <Input
                label="Tahun pelajaran"
                name="tahun"
                value={formik.values.tahun}
                disabled
              />

              <Select
                label="Semester"
                name="semester"
                keyValue="value"
                keyDisplay="label"
                options={getSemesters()}
                value={formik.values.semester}
                onChange={formik.handleChange}
                errorMessage={formik.errors.semester}
              />

              <Select
                label="Kelas"
                name="kelas"
                options={kelas}
                keyValue="id"
                displayBuilder={(opt) => `${opt.level}-${opt.class_name}`}
                value={formik.values.kelas}
                onChange={formik.handleChange}
                errorMessage={formik.errors.kelas}
              />

              <Textarea
                label="Detail rencana"
                name="title"
                value={formik.values.title}
                onChange={formik.handleChange}
                errorMessage={formik.errors.title}
              />
            </div>
            <div className="flex gap-2 w-full items-center">
              <Input
                type="time"
                label="Mulai"
                name="start_date"
                min="07:00"
                max="15:30"
                value={formik.values.start_date}
                onChange={formik.handleChange}
                errorMessage={formik.errors.start_date}
              />
              <span>-</span>
              <Input
                type="time"
                label="Selesai"
                name="end_date"
                min="07:00"
                max="15:30"
                value={formik.values.end_date}
                onChange={formik.handleChange}
                errorMessage={formik.errors.end_date}
              />
            </div>
            <div className="w-full items-center flex gap-3">
              <input
                type="checkbox"
                className="checkbox"
                checked={formik.values.hide}
                onChange={(e) => {
                  formik.setFieldValue("hide", e.target.checked);
                }}
              />
              <label className="font-bold">
                Jangan tampilkan di modul siswa
              </label>
            </div>

            <button
              className={`btn mt-10 btn-ghost bg-green-500 text-white font-bold w-full `}
              type="submit"
            >
              Simpan
            </button>
          </form>
        </Modal>
      </div>
    </>
  );
};

export default JadwalMengajar;
