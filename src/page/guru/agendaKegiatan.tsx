import { ViewState } from "@devexpress/dx-react-scheduler";
import dayjs from "dayjs";
import {
  Appointments,
  DateNavigator,
  MonthView,
  Scheduler,
  TodayButton,
  Toolbar,
} from "@devexpress/dx-react-scheduler-material-ui";
import { Button } from "@mui/material";
import Paper from "@mui/material/Paper";
import { employeeStore } from "../../store/Store";
import { Kalender } from "../../middleware/api";
import Swal from "sweetalert2";
// import { BiTrash } from "react-icons/bi";
// import { CiClock2 } from "react-icons/ci";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";

const AgendaKegiatan = () => {
  const { employee } = employeeStore();
  const [dataList, setDataList] = useState<any[]>([]);
  const [currentDate, setCurrentDate] = useState<Date>(new Date("2025-08-15"));
  const [open, setOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<any>(null);
  const { register, handleSubmit, setValue } = useForm({
    defaultValues: {
      start_date: "",
      end_date: "",
      agenda: "",
      color: "#06b6d4",
    },
  });

  const getDataList = async () => {
    try {
      const res = await Kalender.getByGuru(employee.id);
      if (res.status === 200) {
        const mapped = res.data.data.map((dat: any) => {
          const startDate = new Date(dat.start_date);
          let endDate = new Date(dat.end_date);
          if (endDate <= startDate) {
            endDate = new Date(startDate.getTime() + 60000);
          }
          return {
            id: dat.id,
            title: dat.agenda,
            startDate,
            endDate,
            color: dat.color || "#06b6d4",
          };
        });
        setDataList(mapped);
      }
    } catch (err) {
      console.error("Failed to fetch data:", err);
    }
  };

  const handleModalOpen = () => setOpen(true);
  const handleModalClose = () => {
    setOpen(false);
    setEditingAppointment(null);
    setValue("start_date", "");
    setValue("end_date", "");
    setValue("agenda", "");
    setValue("color", "#06b6d4");
  };

  const deleteAgenda = async () => {
    if (!editingAppointment) return;
    const confirm = await Swal.fire({
      title: "Hapus agenda ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, hapus",
    });
    if (confirm.isConfirmed) {
      try {
        await Kalender.deleteAgenda(editingAppointment.id);
        Swal.fire("Dihapus!", "Agenda berhasil dihapus.", "success");
        handleModalClose();
        getDataList();
      } catch (err) {
        Swal.fire("Gagal", "Tidak bisa menghapus agenda.", "error");
      }
    }
  };

  // const formatDate = (date: string) => {
  //   return new Date(date).toLocaleDateString("id-ID", {
  //     day: "numeric",
  //     month: "long",
  //     year: "numeric",
  //   });
  // };

  // const CustomAppointment = ({ children, style, ...restProps }: any) => {
  //   const backgroundColor = restProps.data.color?.split("_")[0] || "#06b6d4";
  //   return (
  //     <Appointments.Appointment
  //       {...restProps}
  //       style={{
  //         ...style,
  //         backgroundColor,
  //         borderRadius: "8px",
  //         fontSize: "14px",
  //         display: "flex",
  //         justifyContent: "center",
  //         alignItems: "center",
  //       }}
  //       onDoubleClick={() => handleAppointmentClick(restProps.data)}
  //     >
  //       {children}
  //     </Appointments.Appointment>
  //   );
  // };

  // const CustomTooltipContent = ({ appointmentData }: any) => (
  //   <div className="w-full p-3">
  //     <div className="flex justify-between items-center">
  //       <h3 className="font-bold text-lg">{appointmentData.title}</h3>
  //       <div className="flex gap-2">
  //         <button
  //           onClick={() => handleAppointmentClick(appointmentData)}
  //           className="text-blue-500 text-xl"
  //         >
  //           Edit
  //         </button>
  //         <button
  //           onClick={() => {
  //             setEditingAppointment(appointmentData);
  //             deleteAgenda();
  //           }}
  //           className="text-red-500 text-xl"
  //         >
  //           <BiTrash />
  //         </button>
  //       </div>
  //     </div>
  //     <div className="mt-3 flex items-center gap-2 text-gray-700">
  //       <CiClock2 />
  //       <span>
  //         {formatDate(appointmentData.startDate)} -{" "}
  //         {formatDate(appointmentData.endDate)}
  //       </span>
  //     </div>
  //   </div>
  // );

  useEffect(() => {
    getDataList();
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
  }, [employee, editingAppointment, setValue]);

  const handleAppointmentClick = (appointmentData: any) => {
    setEditingAppointment(appointmentData);
    setOpen(true);
  };

  const onSubmit = async (data: any) => {
    const newData = {
      teacher_id: employee.id,
      start_date: data.start_date,
      end_date: data.end_date,
      agenda: data.agenda,
      color: data.color,
    };

    try {
      if (editingAppointment) {
        await Kalender.updateAgenda(newData, editingAppointment.id);
        Swal.fire("Berhasil", "Agenda berhasil diperbarui", "success");
      } else {
        await Kalender.createAgenda(newData);
        Swal.fire("Berhasil", "Agenda berhasil ditambahkan", "success");
      }
      handleModalClose();
      getDataList();
    } catch (error) {
      Swal.fire("Error", "Gagal menyimpan agenda", "error");
    }
  };

  return (
    <div className="p-5">
      <h1 className="text-xl font-bold mb-4 text-center">Agenda Kegiatan</h1>
      <Button variant="contained" color="primary" onClick={handleModalOpen}>
        Tambah Agenda
      </Button>

      {open && (
        <div className="modal modal-open" onClick={handleModalClose}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-bold text-lg">
              {editingAppointment ? "Edit Agenda" : "Tambah Agenda"}
            </h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Start Date</span>
                </label>
                <input
                  type="datetime-local"
                  {...register("start_date", { required: true })}
                  className="input input-bordered"
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">End Date</span>
                </label>
                <input
                  type="datetime-local"
                  {...register("end_date", { required: true })}
                  className="input input-bordered"
                />
              </div>
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
              <div className="modal-action">
                <button
                  type="button"
                  className="btn"
                  onClick={handleModalClose}
                >
                  Cancel
                </button>
                {editingAppointment && (
                  <button
                    type="button"
                    className="btn btn-error"
                    onClick={deleteAgenda}
                  >
                    Delete
                  </button>
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
            <MonthView
              timeTableCellComponent={({ startDate, ...props }) => (
                <MonthView.TimeTableCell
                  {...props}
                  startDate={startDate}
                  onDoubleClick={() => {
                    setValue(
                      "start_date",
                      dayjs(startDate).startOf("day").format("YYYY-MM-DDTHH:mm")
                    );
                    setValue(
                      "end_date",
                      dayjs(startDate).endOf("day").format("YYYY-MM-DDTHH:mm")
                    );
                    handleModalOpen();
                  }}
                />
              )}
            />
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
          </Scheduler>
        </Paper>
      </div>
    </div>
  );
};

export default AgendaKegiatan;
