import { useState, useEffect, FC } from "react";
import Paper from "@mui/material/Paper";
import { ViewState } from "@devexpress/dx-react-scheduler";
import {
  Scheduler,
  Appointments,
  AppointmentTooltip,
  Toolbar,
  DateNavigator,
  TodayButton,
  DayView,
  MonthView,
  ViewSwitcher,
} from "@devexpress/dx-react-scheduler-material-ui";
import { Store } from "../store/Store";
import { Kalender, Task } from "../midleware/api";
import { FaPencil } from "react-icons/fa6";
import { BiTrash } from "react-icons/bi";
import { CiClock2 } from "react-icons/ci";
import { useFormik } from "formik";
import * as Yup from "yup";
import Modal, { closeModal, openModal } from "../component/modal";
import { Input, Select, Textarea } from "./Input";
import { getAcademicYears } from "../utils/common";
import { formatTime } from "../utils/date";
import Swal from "sweetalert2";

const CustomAppointment: React.FC<any> = ({
  children,
  style,
  ...restProps
}) => {
  const colorProps = restProps.data.color;
  const [colorCode] = colorProps ? colorProps.split("_") : "";
  const backgroundColor = colorCode;

  return (
    <Appointments.Appointment
      {...restProps}
      className="z-0"
      style={{
        ...style,
        backgroundColor: backgroundColor,
        borderRadius: "8px",
        fontSize: "15px",
        textAlign: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {children}
    </Appointments.Appointment>
  );
};

interface Props {
  smt: string;
  kelas: string;
  triggerShow: boolean;
}

const schema = Yup.object({
  tahun: Yup.string().required("required"),
  kelas: Yup.string().required("required"),
  semester: Yup.string().required("required"),
  title: Yup.string().required("required"),
  start_date: Yup.string().required("required"),
  end_date: Yup.string().required("required"),
  hide: Yup.boolean().required("required"),
  id: Yup.string().required("required"),
});

const KalenderPekanan: FC<Props> = ({ smt, kelas, triggerShow }) => {
  const { token, setTanggalPekanan, tanggalPekanan, setTanggalStartDate } =
    Store();
  const [Dataappointment, setData] = useState<any[]>([]);
  const [Class, setClass] = useState<any[]>([]);
  const [dateProps, setDateProps] = useState<any>();

  const formik = useFormik({
    initialValues: {
      tahun: "",
      kelas: "",
      semester: "",
      title: "",
      start_date: "",
      end_date: "",
      hide: false,
      id: "",
    },
    validationSchema: schema,
    validateOnChange: false,
    onSubmit: async (values) => {
      const { tahun, title, kelas, semester, start_date, end_date, hide, id } =
        values;

      try {
        const data = {
          academic_year: tahun,
          class_id: kelas,
          semester,
          title,
          start_date: new Date(formatDateCreate(start_date)),
          end_date: new Date(formatDateCreate(end_date)),
          hide_student: !hide,
        };
        await Kalender.EditTimeTable(token, id, data);

        getKalenderPendidikan();

        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Berhasil memperbarui rencana pekanan",
          showCloseButton: true,
        }).then(() => {
          window.location.reload();
        });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Gagal",
          text: "Gagal memperbarui rencana pekanan",
        });
      } finally {
        closeModal("edit-rencana");
      }
    },
  });

  const getKalenderPendidikan = async () => {
    try {
      // const smt = sessionStorage.getItem("smt") ? sessionStorage.getItem("smt") : '1'
      const response = await Kalender.GetAllTimetableByClass(
        token,
        kelas,
        smt,
        "2023/2024",
        "Y"
      );
      const dataList = response.data.data;

      const newData = dataList.map((item: any) => ({
        id: item.id,
        title: item.title,
        startDate: new Date(item.start_date),
        endDate: new Date(item.end_date),
        // color: item.color,
      }));

      setData(newData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getKalenderPendidikan();
  }, [smt, kelas, triggerShow]);

  const formatDateCreate = (props: any) => {
    const dateObject = new Date(dateProps);
    const tanggalFormatted = dateObject.toLocaleDateString("en-CA");
    const finalDate = tanggalFormatted + "T" + props;
    return finalDate;
  };

  const deleteDetail = async (id: number) => {
    try {
      await Kalender.deleteTimeTable(token, id);
      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Berhasil menghapus rencana pekanan",
        showCloseButton: true,
      }).then(() => {
        window.location.reload();
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Gagal menghapus rencana pekanan",
      });
    }
  };

  const getClass = async () => {
    const response = await Task.GetAllClass(token, 0, 20, "Y");
    setClass(response.data.data.result);
  };

  const getTimeTableById = async (id: number) => {
    formik.resetForm();
    try {
      const response = await Kalender.GetTimetableById(token, id);
      const dataRest = response.data.data;

      formik.setFieldValue("tahun", dataRest?.academic_year);
      formik.setFieldValue("id", id);
      formik.setFieldValue("semester", dataRest?.semester);
      formik.setFieldValue("kelas", dataRest?.class_id);
      formik.setFieldValue("title", dataRest?.title);
      formik.setFieldValue(
        "start_date",
        formatTime(dataRest?.start_date, "hh:mm")
      );
      formik.setFieldValue("end_date", formatTime(dataRest?.end_date, "hh:mm"));
      formik.setFieldValue("hide", !dataRest?.hide_student);
      setDateProps(dataRest?.start_date);

      openModal("edit-rencana");
    } catch (error) {
      console.log(error);
    }
  };

  const DayCell: React.FC<any> = (props) => (
    <DayView.TimeTableCell
      {...props}
      onClick={() => {
        setTanggalStartDate(props.startDate);
        openModal("add-rencana");
      }}
    />
  );
  const mountCell: React.FC<any> = (props) => (
    <MonthView.TimeTableCell
      {...props}
      onClick={() => {
        setTanggalStartDate(props.startDate);
        openModal("add-rencana");
      }}
    />
  );

  const handlePerubahanTanggal = (tanggal: any) => {
    setTanggalPekanan(tanggal);
  };

  const handleOpen = (id: number) => {
    getClass();
    getTimeTableById(id);
  };

  const CustomTooltip: React.FC<any> = ({ appointmentData }) => (
    <>
      <div className="w-full p-3">
        <div className="w-full flex gap-1 justify-between items-center pl-3">
          <div className="text-xl font-bold ">{appointmentData.title}</div>
          <div className="flex">
            <button
              onClick={() => {
                handleOpen(appointmentData.id);
              }}
              className="btn btn-ghost btn-square text-xl text-orange-500 "
            >
              <FaPencil />
            </button>
            <button
              onClick={() => deleteDetail(appointmentData.id)}
              className="btn btn-ghost btn-square text-xl text-red-500 "
            >
              <BiTrash />
            </button>
          </div>
        </div>
        <div className="mt-2 flex pl-3 pb-3 items-center gap-3">
          <span className="text-2xl ">
            <CiClock2 />
          </span>
          <span className="">
            {formatTime(appointmentData.startDate, "hh:mm")} -
            {formatTime(appointmentData.endDate, "hh:mm")}
          </span>
        </div>
      </div>
    </>
  );

  return (
    <>
      <Paper>
        <Scheduler data={Dataappointment} locale={"id"} height={650}>
          <ViewState
            currentDate={tanggalPekanan}
            onCurrentDateChange={handlePerubahanTanggal}
          />

          <DayView
            displayName="Pekan"
            startDayHour={7}
            endDayHour={16}
            intervalCount={7}
            timeTableCellComponent={DayCell}
          />
          <MonthView timeTableCellComponent={mountCell} displayName="Bulan" />

          <Appointments appointmentComponent={CustomAppointment} />
          <Toolbar />
          <ViewSwitcher />
          <DateNavigator />
          <TodayButton />
          <AppointmentTooltip contentComponent={CustomTooltip} />
        </Scheduler>
      </Paper>

      <Modal id="edit-rencana">
        <form
          onSubmit={formik.handleSubmit}
          className="w-full flex flex-col items-center"
        >
          <span className="text-xl font-bold">Edit Rencana Pekanan</span>

          <div className="flex w-full mt-5 flex-col">
            <Select
              label="Tahun pelajaran"
              name="tahun"
              options={getAcademicYears()}
              value={formik.values.tahun}
              onChange={formik.handleChange}
              errorMessage={formik.errors.tahun}
            />

            <Select
              label="Semester"
              name="semester"
              options={[1, 2]}
              value={formik.values.semester}
              onChange={formik.handleChange}
              errorMessage={formik.errors.semester}
            />
            {/* <select
              value={formik.values.semester}
              onChange={formik.handleChange}
              className="input input-sm input-bordered items-center gap-2 grow mt-1 block w-full border rounded-md shadow-sm sm:text-sm"
            >
              <option disabled value="">
                Pilih semester
              </option>
              <option value={1}>Ganjil</option>
              <option value={2}>Genap</option>
            </select> */}
            <Select
              label="Kelas"
              name="kelas"
              options={Class}
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
            <label className="font-bold">Jangan tampilkan di modul siswa</label>
          </div>

          <button
            className={`btn btn-ghost mt-10 bg-green-500 text-white font-bold w-full `}
            type="submit"
          >
            Simpan
          </button>
        </form>
      </Modal>
    </>
  );
};

export default KalenderPekanan;
