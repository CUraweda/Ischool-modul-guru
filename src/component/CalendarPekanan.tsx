import { useState, useEffect, FC } from "react";
import Paper from "@mui/material/Paper";
import {
  ViewState,
  EditingState,
  IntegratedEditing,
} from "@devexpress/dx-react-scheduler";
import {
  Scheduler,
  Appointments,
  AppointmentForm,
  AppointmentTooltip,
  ConfirmationDialog,
  Toolbar,
  DateNavigator,
  TodayButton,
  DayView,
  MonthView,
  ViewSwitcher,
} from "@devexpress/dx-react-scheduler-material-ui";
import { useStore } from "../store/Store";
import { Kalender } from "../controller/api";

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

const KalenderPekanan: FC<Props> = ({ smt, kelas }) => {
  const { token, setTanggalPekanan, tanggalPekanan } = useStore();
  const [Dataappointment, setData] = useState<any[]>([]);
  const [trigger, setTrigger] = useState<boolean>(false);

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
      console.log(newData);

      setData(newData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getKalenderPendidikan();
  }, [trigger, smt, kelas]);

  const editAgenda = async (id: number, data: any) => {
    try {
      const dataRest = {
        ...(data.startDate ? { start_date: data.startDate } : {}),
        ...(data.endDate ? { end_date: data.endDate } : {}),
        ...(data.title ? { agenda: data.title } : {}),
      };
      console.log({ dataRest });
      const response = await Kalender.EditTimeTable(token, id, dataRest);

      console.log(response);
      setTrigger(!trigger);
    } catch (error) {
      console.log(error);
    }
  };

  const createAgenda = async (data: any) => {
    const dataRest = {
      edu_id: 1,
      start_date: data.startDate,
      end_date: data.endDate,
      agenda: data.title,
    };
    const response = await Kalender.createDetail(token, dataRest);
    console.log(response);
    setTrigger(!trigger);
  };

  const deleteDetail = async (id: number) => {
    const response = await Kalender.deleteTimeTable(token, id);
    console.log(response);

    setTrigger(!trigger);
  };

  const commitChanges = ({
    added,
    changed,
    deleted,
  }: {
    added?: any;
    changed?: any;
    deleted?: any;
  }) => {
    if (added) {
      createAgenda(added);
      // console.log(added);
    }

    if (changed) {
      console.log({ changed });

      Object.keys(changed).forEach((id) => {
        console.log("ini id", id);
        const changes = changed[id];
        editAgenda(parseInt(id), changes);
      });
    }

    if (deleted !== undefined) {
      console.log(deleted);

      deleteDetail(deleted);
    }
  };

  const showModal = (props: string) => {
    let modalElement = document.getElementById(`${props}`) as HTMLDialogElement;
    if (modalElement) {
      modalElement.showModal();
    }
  };

  const DayCell: React.FC<any> = (props) => (
    <DayView.TimeTableCell
      {...props}
      onClick={() => {
        console.log(props);

        showModal("add-rencana");
      }}
    />
  );
  const mountCell: React.FC<any> = (props) => (
    <MonthView.TimeTableCell
      {...props}
      onClick={() => {
        console.log(props);

        showModal("add-kalender");
      }}
    />
  );

  const handlePerubahanTanggal = (tanggal: any) => {
    setTanggalPekanan(tanggal)
  };

  return (
    <Paper>
      <Scheduler data={Dataappointment} height={650}>
        <ViewState
          currentDate={tanggalPekanan}
          onCurrentDateChange={handlePerubahanTanggal}
        />
        <EditingState onCommitChanges={commitChanges} />
        <IntegratedEditing />
        <DayView
          displayName="Pekan"
          startDayHour={7}
          endDayHour={16}
          intervalCount={7}
          timeTableCellComponent={DayCell}
        />
        <MonthView timeTableCellComponent={mountCell} displayName="Bulan" />
        <ConfirmationDialog />
        <Appointments appointmentComponent={CustomAppointment} />
        <Toolbar />
        <ViewSwitcher />
        <DateNavigator />
        <TodayButton />
        <AppointmentTooltip showOpenButton showDeleteButton />
        <AppointmentForm />
      </Scheduler>
    </Paper>
  );
};

export default KalenderPekanan;
