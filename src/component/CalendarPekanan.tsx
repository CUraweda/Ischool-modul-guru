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
import Modal from "../component/modal";

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
}

const schema = Yup.object({
  tahun: Yup.string().required("required"),
  kelas: Yup.string().required("required"),
  semester: Yup.string().required("required"),
  title: Yup.string().required("required"),
  start_date: Yup.string().required("required"),
  end_date: Yup.string().required("required"),
  hide: Yup.boolean().required("required"),
  id: Yup.boolean().required("required"),
});

const KalenderPekanan: FC<Props> = ({ smt, kelas }) => {
  const { token, setTanggalPekanan, tanggalPekanan, setTanggalStartDate } =
    Store();
  const [Dataappointment, setData] = useState<any[]>([]);
  const [trigger, setTrigger] = useState<boolean>(false);
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
    onSubmit: (values) => {
      console.log(values);
    },
  });

  const getKalenderPendidikan = async () => {
    try {
      // const smt = sessionStorage.getItem("smt") ? sessionStorage.getItem("smt") : '1'
      const response = await Kalender.GetAllTimetable(token, kelas, smt);
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
  }, [trigger, smt, kelas]);

  const editDetail = async () => {
    const { tahun, title, kelas, semester, start_date, end_date, hide, id } =
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
    await Kalender.EditTimeTable(token, id, data);
    window.location.reload();
  };

  const formatDateCreate = (props: any) => {
    const dateObject = new Date(dateProps);
    const tanggalFormatted = dateObject.toLocaleDateString("en-CA");
    const finalDate = tanggalFormatted + "T" + props;
    return finalDate;
  };

  const deleteDetail = async (id: number) => {
    await Kalender.deleteTimeTable(token, id);
    window.location.reload();
    setTrigger(!trigger);
  };

  const getClass = async () => {
    const response = await Task.GetAllClass(token, 0, 20);
    setClass(response.data.data.result);
  };

  const timeFormat = (date: Date) => {
    const hours = new Date(date).getHours().toString().padStart(2, "0");
    const minutes = new Date(date).getMinutes().toString().padStart(2, "0");

    return `${hours}:${minutes}`;
  };

  const getTimeTableById = async (id: number) => {
    try {
      const response = await Kalender.GetTimetableById(token, id);
      const dataRest = response.data.data;

      formik.setFieldValue("tahun", dataRest?.academic_year);
      formik.setFieldValue("id", id);
      formik.setFieldValue("semester", dataRest?.semester);
      formik.setFieldValue("kelas", dataRest?.class_id);
      formik.setFieldValue("title", dataRest?.title);
      formik.setFieldValue("start_date", timeFormat(dataRest?.start_date));
      formik.setFieldValue("end_date", timeFormat(dataRest?.end_date));
      formik.setFieldValue("hide", dataRest?.hide_student);
      setDateProps(dataRest?.start_date);

      showModal("edit-rencana");
    } catch (error) {
      console.log(error);
    }
  };

  const showModal = (props: string) => {
    let modalElement = document.getElementById(`${props}`) as HTMLDialogElement;
    if (modalElement) {
      modalElement.showModal();
    }
  };

  const getDate = (tanggal: any) => {
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    const date = new Date(tanggal)
      .toLocaleDateString("id-ID", options)
      .toUpperCase();
    return date;
  };

  const DayCell: React.FC<any> = (props) => (
    <DayView.TimeTableCell
      {...props}
      onClick={() => {
        setTanggalStartDate(props.startDate);
        showModal("add-rencana");
      }}
    />
  );
  const mountCell: React.FC<any> = (props) => (
    <MonthView.TimeTableCell
      {...props}
      onClick={() => {
        setTanggalStartDate(props.startDate);
        showModal("add-rencana");
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
              className="btn btn-ghost btn-circle text-xl text-orange-500 "
            >
              <FaPencil />
            </button>
            <button
              onClick={() => deleteDetail(appointmentData.id)}
              className="btn btn-ghost btn-circle text-xl text-red-500 "
            >
              <BiTrash />
            </button>
          </div>
        </div>
        <div className="mt-4 flex pl-3 items-center gap-3">
          <span className="text-2xl ">
            <CiClock2 />
          </span>
          <span className="">
            {getDate(appointmentData.startDate)} -
            {getDate(appointmentData.endDate)}
          </span>
        </div>
      </div>
    </>
  );

  return (
    <>
      <Paper>
        <Scheduler data={Dataappointment} height={650}>
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
        <div className="w-full flex flex-col items-center">
          <span className="text-xl font-bold">Edit Rencana Pekanan</span>
         
          <div className="flex w-full mt-5 flex-col">
            <div className="w-full flex flex-col gap-2">
              <label className="mt-4 w-full font-bold">Tahun Pelajaran</label>
              <select
                className="select select-bordered w-full"
                value={formik.values.tahun}
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
                value={formik.values.semester}
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
                value={formik.values.kelas}
                onChange={(e) => formik.setFieldValue("kelas", e.target.value)}
              >
                <option disabled selected>
                  Kelas
                </option>
                {Class?.map((item: any, index: number) => (
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
                value={formik.values.title}
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
              checked={formik.values.hide}
              onChange={(e) => {
                formik.setFieldValue("hide", e.target.checked);
              }}
            />
            <label className="font-bold">Tampilkan di modul siswa ?</label>
          </div>

          <div className="w-full flex justify-center mt-10 gap-2">
            <button
              className={`btn btn-ghost bg-green-500 text-white font-bold w-full `}
              onClick={editDetail}
            >
              Simpan
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default KalenderPekanan;
