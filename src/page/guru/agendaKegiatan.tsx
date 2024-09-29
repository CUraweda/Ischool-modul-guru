import { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import {
  Scheduler,
  Appointments,
  MonthView,
  Toolbar,
  DateNavigator,
  TodayButton,
} from "@devexpress/dx-react-scheduler-material-ui";
import { Button } from "@mui/material";
import { ViewState } from "@devexpress/dx-react-scheduler";
import { Kalender } from "../../midleware/api";
// import { Rekapan } from "../../midleware/api-hrd";
import { employeeStore, Store } from "../../store/Store";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
const AgendaKegiatan = () => {
  const { token } = Store();
  const { employee } = employeeStore();
  const [open, setOpen] = useState(false);
  const [eduList, setEduList] = useState([
    { id: 1, academic_year: "2024", level: "SM", semester: 1 },
    { id: 2, academic_year: "2024", level: "SM", semester: 2 },
  ]);
  const { register, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      start_date: new Date().toISOString().slice(0, 16),
      end_date: new Date().toISOString().slice(0, 16),
      agenda: "",
      color: "#06b6d4",
      edu_id: "",
    },
  });

  const handleModalOpen = () => setOpen(true);
  const handleModalClose = () => setOpen(false);

  const onSubmit = async (data: any) => {
    try {
      const newData = {
        teacher_id: employee.id,
        edu_id: data.edu_id,
        start_date: data.start_date,
        end_date: data.end_date,
        agenda: data.agenda,
        color: data.color,
      };

      // Mengirim data ke API
      await Kalender.createAgenda(token, newData);
      handleModalClose(); // Menutup modal setelah sukses
    } catch (error) {
      console.error("Error creating agenda:", error);
    }
  };
  const [dataList, setDataList] = useState<any[]>([]);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  const getDataList = async () => {
    const id = employee.id;
    try {
      setDataList([]);
      const res = await Kalender.getByGuru(token, id);
      if (res.status === 200) {
        setDataList(
          res.data.data?.map((dat: any) => ({
            ...dat,
            startDate: dat.start_date, // pastikan mapping ke format Scheduler
            endDate: dat.end_date,
            title: dat.agenda, // tambahkan title untuk jadwal
            color: dat.color.split("_")[0], // ambil warna valid dari response
          }))
        );
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `${error} Gagal Mengambil data rekap kehadiran, silakan coba lain kali`,
      });
    }
  };

  useEffect(() => {
    getDataList();
  }, [employee]);
  return (
    <div className="w-full p-3">
      <p className="font-bold w-full text-center text-xl mb-6">
        Agenda Kegiatan
      </p>
      <Button variant="contained" color="primary" onClick={handleModalOpen}>
        Tambah Agenda
      </Button>

      {/* Modal Form */}
      {open && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Tambah Agenda Kegiatan</h3>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Start Date */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Start Date</span>
                </label>
                <input
                  type="datetime-local"
                  {...register("start_date", { required: true })}
                  className="input input-bordered"
                  value={watch("start_date")}
                  onChange={(e) => setValue("start_date", e.target.value)}
                />
              </div>

              {/* End Date */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">End Date</span>
                </label>
                <input
                  type="datetime-local"
                  {...register("end_date", { required: true })}
                  className="input input-bordered"
                  value={watch("end_date")}
                  onChange={(e) => setValue("end_date", e.target.value)}
                />
              </div>

              {/* Agenda */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Agenda</span>
                </label>
                <input
                  type="text"
                  {...register("agenda", { required: true })}
                  className="input input-bordered"
                />
              </div>

              {/* Edu ID */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Edu ID</span>
                </label>
                <select
                  {...register("edu_id", { required: true })}
                  className="select select-bordered"
                >
                  {eduList.map((edu) => (
                    <option key={edu.id} value={edu.id}>
                      {edu.academic_year} - {edu.level} Semester {edu.semester}
                    </option>
                  ))}
                </select>
              </div>

              {/* Modal Actions */}
              <div className="modal-action">
                <button
                  type="button"
                  className="btn"
                  onClick={handleModalClose}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Scheduler View */}
      {/* <Paper>
        <Scheduler data={dataAppointment}>
          <ViewState
            currentDate={tanggalPekanan}
            onCurrentDateChange={handlePerubahanTanggal}
          />
          <MonthView />
          <Appointments
            appointmentComponent={({ children, ...props }) => {
              const data = props.data;
              return (
                <Appointments.Appointment
                  {...props}
                  style={{ backgroundColor: data.color }}
                >
                  {children}
                </Appointments.Appointment>
              );
            }}
          />
          <Toolbar />
          <DateNavigator />
          <TodayButton />
          <AppointmentTooltip />
        </Scheduler>
      </Paper> */}
      <Paper>
        <Scheduler data={dataList} locale={"id"} height={650}>
          <ViewState
            defaultCurrentDate={currentDate}
            onCurrentDateChange={(date) => setCurrentDate(date)}
          />

          {/* widgets */}
          <Toolbar />
          <DateNavigator />
          <TodayButton />

          {/* views */}
          <MonthView displayName="Bulan" />

          {/* appointment card */}
          <Appointments
            appointmentComponent={({ children, ...props }) => {
              // const data = props.data;

              // default for attendance 100%
              let ic = "✅",
                bg = "!bg-success";

              return (
                <Appointments.Appointment
                  {...props}
                  className={
                    "rounded-md flex ps-2 items-center !font-bold " + bg
                  }
                >
                  {ic}
                  {children}
                </Appointments.Appointment>
              );
            }}
          />
        </Scheduler>
      </Paper>
    </div>
  );
};

export default AgendaKegiatan;
