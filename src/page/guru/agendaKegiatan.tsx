import { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import {
  Scheduler,
  Appointments,
  AppointmentTooltip,
  MonthView,
  Toolbar,
  DateNavigator,
  TodayButton,
} from "@devexpress/dx-react-scheduler-material-ui";
import { Button } from "@mui/material";
import { ViewState } from "@devexpress/dx-react-scheduler";
import { Kalender } from "../../midleware/api";
import { employeeStore, Store } from "../../store/Store";
import { useForm } from "react-hook-form";

const AgendaKegiatan = () => {
  const { token } = Store();
  const { employee } = employeeStore();
  const [dataAppointment, setDataAppointment] = useState<any[]>([]);
  const [tanggalPekanan, setTanggalPekanan] = useState(new Date());
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

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Kalender.getByGuru(token, employee.id);
        console.log("Data fetched", response.data.data);

        // Memetakan data dari API ke format yang dibutuhkan Scheduler
        const appointmentsData = response.data.data.map((item: any) => ({
          id: item.id,
          startDate: new Date(item.start_date),
          endDate: new Date(item.end_date),
          title: item.agenda,
          color: item.color.replace("_", "") || "#06b6d4",
        }));

        setDataAppointment(appointmentsData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setDataAppointment([]); // Set ke array kosong jika error
      }
    };
    setEduList([]);

    fetchData();
  }, [token, employee]);

  const handlePerubahanTanggal = (newDate: Date) => {
    setTanggalPekanan(newDate);
  };

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

  return (
    <div>
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
      <Paper>
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
      </Paper>
    </div>
  );
};

export default AgendaKegiatan;
