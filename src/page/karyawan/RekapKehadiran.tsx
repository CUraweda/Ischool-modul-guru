import Paper from "@mui/material/Paper";
import { ViewState } from "@devexpress/dx-react-scheduler";
import {
  Scheduler,
  Toolbar,
  DateNavigator,
  TodayButton,
  MonthView,
  Appointments,
} from "@devexpress/dx-react-scheduler-material-ui";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Rekapan } from "../../midleware/api-hrd";
import { Store } from "../../store/Store";
import moment from "moment";

const RekapKehadiran = () => {
  const { token } = Store();

  const [dataList, setDataList] = useState<any[]>([]);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  const getDataList = async () => {
    const inputDate = moment(currentDate),
      firstDay = inputDate.startOf("month").format("YYYY-MM-DD"),
      lastDay = inputDate.endOf("month").format("YYYY-MM-DD");

    try {
      setDataList([]);

      const res = await Rekapan.kalendarKehadiran(token, firstDay, lastDay);
      setDataList(
        res.data.data?.map((dat: any) => ({
          ...dat,
          startDate: dat.start_date,
          endDate: dat.end_date,
        }))
      );
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Gagal Mengambil data rekap kehadiran, silakan coba lain kali",
      });
    }
  };

  useEffect(() => {
    getDataList();
  }, [currentDate]);

  return (
    <div className="w-full p-3">
      <p className="font-bold w-full text-center text-xl mb-6">
        REKAP KEHADIRAN
      </p>

      <Paper>
        <Scheduler data={dataList} locale={"id"} height={650}>
          <ViewState
            defaultCurrentDate={currentDate}
            onCurrentDateChange={(date) => setCurrentDate(date)}
          />

          {/* widgets  */}
          <Toolbar />
          <DateNavigator />
          <TodayButton />

          {/* views  */}
          <MonthView displayName="Bulan" />
          {/* <WeekView displayName="Mingguan" /> */}
          {/* <ViewSwitcher /> */}

          {/* appointment card  */}
          <Appointments
            appointmentComponent={({ children, ...props }) => {
              const data = props.data;

              // default for attendance 100%
              let ic = "✅",
                bg = "!bg-success";

              if (data.type == "PRESENSI" && data.is_outstation) {
                ic = "🚙";
                bg = "!bg-primary";
              } else if (data.type == "PRESENSI" && data.is_late) {
                ic = "⏰";
                bg = "!bg-error";
              } else if (data.type == "CUTI") {
                ic = "🌴";
                bg = "!bg-orange-400";
              } else if (data.type == "IZIN") {
                ic = "📝";
                bg = "!bg-yellow-400";
              }

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

export default RekapKehadiran;
