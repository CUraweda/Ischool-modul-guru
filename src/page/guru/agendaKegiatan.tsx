import { ViewState } from "@devexpress/dx-react-scheduler";
import {
  AppointmentForm,
  Appointments,
  DateNavigator,
  MonthView,
  Scheduler,
  TodayButton,
  Toolbar,
} from "@devexpress/dx-react-scheduler-material-ui";
import { Button } from "@mui/material";
import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { Kalender } from "../../middleware/api";
import { employeeStore } from "../../store/Store";

const AgendaKegiatan = () => {
  const { employee } = employeeStore();
  const [open, setOpen] = useState(false);
  const [eduList, setEduList] = useState<any[]>([]);
  const [dataList, setDataList] = useState<any[]>([]);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [editingAppointment, setEditingAppointment] = useState<any>(null);
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
  const handleModalClose = () => {
    setOpen(false);
    setEditingAppointment(null);
    setValue("start_date", new Date().toISOString().slice(0, 16));
    setValue("end_date", new Date().toISOString().slice(0, 16));
    setValue("agenda", "");
    setValue("color", "#06b6d4");
    setValue("edu_id", "");
  };

  useEffect(() => {
    if (editingAppointment) {
      setValue(
        "start_date",
        new Date(editingAppointment.startDate).toISOString().slice(0, 16)
      );
      setValue(
        "end_date",
        new Date(editingAppointment.endDate).toISOString().slice(0, 16)
      );
      setValue("agenda", editingAppointment.title || "");
      setValue("edu_id", editingAppointment.edu_id || "");
    }
  }, [editingAppointment, setValue]);

  const handleAppointmentClick = (appointmentData: any) => {
    setEditingAppointment(appointmentData); // Set appointment yang di-edit
    console.log(appointmentData);
    setOpen(true);
  };

  const onSubmit = async (data: any) => {
    try {
      const newData = {
        teacher_id: employee.id,
        edu_id: data.edu_id,
        start_date: new Date(data.start_date).toISOString(),
        end_date: new Date(data.end_date).toISOString(),
        agenda: data.agenda,
        color: data.color,
      };

      // Mengirim data ke API
      if (editingAppointment) {
        // Update existing appointment
        Kalender.updateAgenda(newData, editingAppointment.id)
          .then((response) => {
            if (response.status === 200) {
              handleModalClose();
              getDataList();
              Swal.fire({
                icon: "success",
                title: "Berhasil...",
                text: "Agenda Berhasil dirubah",
              });
            }
          })
          .catch((error) => {
            console.error(error);
            Swal.fire({
              icon: "error",
              title: "Terjadi Kesalahan",
              text: "Gagal mengupdate agenda.",
            });
          });
      } else {
        Kalender.createAgenda(newData)
          .then((response) => {
            if (response.status === 201) {
              handleModalClose();
              getDataList();
              Swal.fire({
                icon: "success",
                title: "Berhasil...",

                text: "Agenda Berhasil Ditambahkan",
              });
            }
          })
          .catch((error) => {
            console.error(error);
            Swal.fire({
              icon: "error",
              title: "Terjadi Kesalahan",
              text: "Gagal menyimpan agenda.",
            });
          });
      }
    } catch (error) {
      console.error("Error creating agenda:", error);
    }
  };

  const fetchDataEdu = async () => {
    try {
      const res = await Kalender.getListEdu();
      setEduList(res.data.data.result);
    } catch (error) {
      console.error(error);
    }
  };
  const getDataList = async () => {
    try {
      setDataList([]);
      const id = employee?.id; // Pastikan employee tidak null
      if (!id) {
        console.error("Employee data is null");
        return;
      }
      const res = await Kalender.getByGuru(id);
      if (res.status === 200) {
        const fixedData = res.data.data?.map((dat: any) => {
          const startDate = new Date(dat.start_date);
          const endDate = new Date(dat.end_date);

          // Jika endDate lebih kecil dari startDate, atur endDate menjadi startDate
          const fixedEndDate = endDate < startDate ? startDate : endDate;

          return {
            id: dat.id,
            startDate: startDate,
            endDate: fixedEndDate,
            title: dat.agenda,
            edu_id: dat.edu_id,
            color: dat.color.split("_")[0],
          };
        });

        setDataList(fixedData);
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

  const deleteDataAgenda = async () => {
    const confirm = await Swal.fire({
      title: "Apakah Anda yakin ingin menghapus agenda ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, Hapus",
    });
    try {
      if (confirm.isConfirmed) {
        Kalender.deleteAgenda(editingAppointment.id)
          .then((response) => {
            if (response.status === 200) {
              getDataList();
              handleModalClose();
              Swal.fire({
                icon: "success",
                title: "Berhasil...",
                text: "Agenda Berhasil Dihapus",
              });
            }
          })
          .catch((error) => {
            console.error(error);
            Swal.fire({
              icon: "error",
              title: "Terjadi Kesalahan",
              text: "Gagal menghapus agenda.",
            });
          });
      }
    } catch (error) {
      console.error("Error creating agenda:", error);
    }
  };

  useEffect(() => {
    getDataList();
    fetchDataEdu();
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
        <div className="modal modal-open" onClick={handleModalClose}>
          <div
            className="modal-box"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
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
                {editingAppointment ? (
                  <button
                    type="button"
                    className="btn btn-error"
                    onClick={deleteDataAgenda}
                  >
                    Delete
                  </button>
                ) : (
                  ""
                )}
                <button type="submit" className="btn btn-success">
                  {editingAppointment ? "Update" : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Scheduler */}
      <div className="w-full p-3">
        <Paper>
          <Scheduler data={dataList} locale={"id"}>
            <ViewState
              currentDate={currentDate}
              onCurrentDateChange={(date) => setCurrentDate(date)}
            />
            <MonthView />
            <Appointments
              appointmentComponent={(props) => (
                <Appointments.Appointment
                  {...props}
                  onDoubleClick={() => handleAppointmentClick(props.data)}
                />
              )}
            />
            <Toolbar />
            <DateNavigator />
            <TodayButton />
            <AppointmentForm />
          </Scheduler>
        </Paper>
      </div>
    </div>
  );
};

export default AgendaKegiatan;
