import { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import Modal from "../component/modal";
import { ViewState } from "@devexpress/dx-react-scheduler";
import {
  Scheduler,
  Appointments,
  AppointmentForm,
  AppointmentTooltip,
  MonthView,
  Toolbar,
  DateNavigator,
  TodayButton,
} from "@devexpress/dx-react-scheduler-material-ui";
import { employeeStore, globalStore, Store } from "../store/Store";
import { Kalender } from "../midleware/api";
import { FaPencil } from "react-icons/fa6";
import { BiTrash } from "react-icons/bi";
import { CiClock2 } from "react-icons/ci";

import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";

const schema = Yup.object({
  edu_id: Yup.string().required("required"),
  agenda: Yup.string().required("required"),
  start_date: Yup.string().required("required"),
  end_date: Yup.string().required("required"),
  tahun: Yup.string().required("required"),
  level: Yup.string().required("required"),
  smt: Yup.string().required("required"),
});

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

interface propsColor {
  color: string;
  value: string;
  title: string;
}

const Demo: React.FC = () => {
  const { academicYear } = globalStore();
  const { isHeadmaster } = employeeStore();
  const { token, setTanggalPekanan, tanggalPekanan } = Store();
  const [Dataappointment, setData] = useState<any[]>([]);
  const [topik, setTopik] = useState<any[]>([]);
  const [idCal, setIdCal] = useState<number>(0);
  const [Color, setColor] = useState<any>();

  const formik = useFormik({
    initialValues: {
      edu_id: "",
      agenda: "",
      start_date: "",
      end_date: "",
      tahun: "",
      level: "",
      smt: "",
    },
    validationSchema: schema,
    onSubmit: (values) => {
      console.log(values);
    },
  });
  const dataColor = [
    {
      color: "bg-red-500",
      value: "#dc2626_red",
      title: "Libur",
    },
    {
      color: "bg-orange-500",
      value: "#f97316_orange",
      title: "Sosialisai/Parenting",
    },

    {
      color: "bg-green-500",
      value: "#22c55e_green",
      title: "Ekskul",
    },

    {
      color: "bg-cyan-500",
      value: "#06b6d4_cyan",
      title: "Kegiatan/Event",
    },
    {
      color: "bg-blue-500",
      value: "#3b82f6_blue",
      title: "Konsultasi Rapot",
    },
  ];

  const getKalenderPendidikan = async () => {
    try {
      const response = await Kalender.GetAllDetail(token, academicYear, 0, 20);
      const dataList = response.data.data.result;

      const newData = dataList.map((item: any) => ({
        id: item.id,
        title: item.agenda,
        startDate: new Date(item.start_date),
        endDate: new Date(item.end_date),
        color: item.color,
      }));
      setData(newData);
    } catch (error) {
      console.error(error);
    }
  };
  const getKalenderPendidikanById = async (id: number) => {
    try {
      const response = await Kalender.GetAllDetailById(token, id);
      const data = response.data.data[0];
      formik.setFieldValue("edu_id", data.edu_id);
      formik.setFieldValue("agenda", data.agenda);
      formik.setFieldValue("end_date", formatDateFormik(data.end_date));
      formik.setFieldValue("start_date", formatDateFormik(data.start_date));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getKalenderPendidikan();
    // isHeadmaster()
  }, [academicYear]);

  const formatDateFormik = (date: any) => {
    const tanggal = new Date(date);
    const year = tanggal.getFullYear();
    const bulan = ("0" + (tanggal.getMonth() + 1)).slice(-2);
    const day = ("0" + tanggal.getDate()).slice(-2);
    const hours = ("0" + tanggal.getHours()).slice(-2);
    const minutes = ("0" + tanggal.getMinutes()).slice(-2);

    const formattedDate = `${year}-${bulan}-${day}T${hours}:${minutes}`;
    return formattedDate;
  };

  const editAgenda = async () => {
    try {
      const { edu_id, start_date, end_date, agenda } = formik.values;
      const color = Color ? Color.value : "";
      const dataRest = {
        edu_id: parseInt(edu_id),
        start_date,
        end_date,
        agenda,
        ...(color ? { color } : {}),
      };
      await Kalender.EditDetail(token, idCal, dataRest);
      closeModal("edit-kalender");
      window.location.reload();
    } catch (error: any) {
      Swal.fire({
        title: "Error",
        text: error.massage,
        icon: "error",
      });
      console.log(error);
    }
  };

  const deleteDetail = async (id: number) => {
    await Kalender.deleteDetail(token, id);
    window.location.reload();
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

  const showModal = (props: string) => {
    let modalElement = document.getElementById(`${props}`) as HTMLDialogElement;
    if (modalElement) {
      modalElement.showModal();
    }
  };

  const closeModal = (props: string) => {
    let modalElement = document.getElementById(props) as HTMLDialogElement;
    if (modalElement) {
      modalElement.close();
    }
  };

  const handleOpen = (id: number) => {
    showModal("edit-kalender");
    getTopik();
    getKalenderPendidikanById(id);
    setIdCal(id);
  };

  const getTopik = async () => {
    const response = await Kalender.GetAllTopik(token, academicYear, 0, 10);
    setTopik(response.data.data.result);
  };

  const DayCell: React.FC<any> = (props) => (
    <MonthView.TimeTableCell
      {...props}
      onClick={isHeadmaster() ? () => showModal("add-kalender") : ""}
    />
  );
  const handlePerubahanTanggal = (tanggal: any) => {
    setTanggalPekanan(tanggal);
  };

  const CustomTooltip: React.FC<any> = ({ appointmentData }) => (
    <>
      <div className="w-full p-3">
        <div className="w-full flex gap-1 justify-between items-center pl-3">
          <div className="text-xl font-bold ">{appointmentData.title}</div>
          {isHeadmaster() && (
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
          )}
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
        <Scheduler data={Dataappointment}>
          <ViewState
            currentDate={tanggalPekanan}
            onCurrentDateChange={handlePerubahanTanggal}
          />
          <MonthView timeTableCellComponent={DayCell} />
          <Appointments appointmentComponent={CustomAppointment} />
          <Toolbar />
          <DateNavigator />
          <TodayButton />
          <AppointmentTooltip contentComponent={CustomTooltip} />
          <AppointmentForm />
        </Scheduler>
      </Paper>

      <Modal id="edit-kalender">
        <div className="w-full flex flex-col items-center">
          <span className="text-xl font-bold">Edit Kalender Pendidikan</span>
          <div className="flex w-full mt-5 flex-col">
            <div className="w-full flex flex-col gap-2">
              <select
                className="select select-bordered bg-white shadow-md"
                value={formik.values.edu_id}
                onChange={(e) => formik.setFieldValue("edu_id", e.target.value)}
              >
                <option disabled selected>
                  Pick one
                </option>
                {topik?.map((item: any, index: number) => (
                  <option
                    value={item.id}
                    key={index}
                  >{`${item.level}-${item.academic_year}-SMT${item.semester}`}</option>
                ))}
              </select>
            </div>
            <div className="w-full flex flex-col gap-2">
              <label className="mt-4 w-full font-bold">Detail Topik</label>
              <textarea
                className="textarea textarea-bordered bg-white shadow-md scrollbar-hide"
                placeholder="Agenda"
                value={formik.values.agenda}
                onChange={(e) => formik.setFieldValue("agenda", e.target.value)}
              ></textarea>
            </div>
          </div>
          <div className="w-full">
            <div className="w-full flex flex-col gap-2">
              <label className="mt-4 font-bold">Tanggal</label>
              <div className="flex gap-2 justify-center items-center">
                <input
                  type="datetime-local"
                  value={formik.values.start_date}
                  className="input input-bordered bg-white shadow-md"
                  onChange={(e) =>
                    formik.setFieldValue("start_date", e.target.value)
                  }
                />
                <span>-</span>
                <input
                  type="datetime-local"
                  value={formik.values.end_date}
                  className="input input-bordered bg-white shadow-md"
                  onChange={(e) =>
                    formik.setFieldValue("end_date", e.target.value)
                  }
                />
              </div>
            </div>
          </div>
          <div className="w-full mt-5">
            <label className="mt-4 font-bold">Warna Background</label>
            <div className="w-full flex gap-2 mt-3">
              {dataColor.map((item: propsColor, index: number) => (
                <span
                  key={index}
                  className={`w-8 h-8 rounded-md tooltip ${
                    item.color
                  } cursor-pointer  ${
                    Color?.value === item.value
                      ? "ring ring-primary ring-offset-base-100 ring-offset-2"
                      : ""
                  }`}
                  data-tip={item.title}
                  onClick={() => setColor(item)}
                />
              ))}
            </div>
          </div>

          <div className="w-full flex justify-center mt-10 gap-2">
            <button
              className={`btn btn-ghost bg-green-500 text-white font-bold w-full `}
              onClick={editAgenda}
            >
              Simpan
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Demo;
