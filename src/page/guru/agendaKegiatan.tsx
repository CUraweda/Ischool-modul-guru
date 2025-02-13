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
import dayjs from "dayjs";

const AgendaKegiatan = () => {
  const { employee } = employeeStore();
  const [open, setOpen] = useState(false);
  const [dataList, setDataList] = useState<any[]>([]);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [editingAppointment, setEditingAppointment] = useState<any>(null);
  const { register, handleSubmit, setValue } = useForm({
    defaultValues: {
      start_date: "",
      end_date: "",
      agenda: "",
      color: "#06b6d4",
    },
  });

  const handleModalOpen = () => setOpen(true);
  const handleModalClose = () => {
    setOpen(false);
    setEditingAppointment(null);
    setValue("start_date", "");
    setValue("end_date", "");
    setValue("agenda", "");
    setValue("color", "#06b6d4");
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
        start_date: data.start_date,
        end_date: data.end_date,
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
          const dateFormat = "YYYY-MM-DDTHH:mm";
          const startDate = dayjs(dat.start_date).format(dateFormat);
          const endDate = dayjs(dat.end_date).format(dateFormat);

          // Jika endDate lebih kecil dari startDate, atur endDate menjadi startDate
          const fixedEndDate = endDate < startDate ? startDate : endDate;

          return {
            id: dat.id,
            startDate: startDate,
            endDate: fixedEndDate,
            title: dat.agenda,
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
