import { useState, useEffect } from "react";
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
  MonthView,
  Toolbar,
  DateNavigator,
  TodayButton,
} from "@devexpress/dx-react-scheduler-material-ui";
import { useStore } from "../store/Store";
import { Kalender } from "../controller/api";

const CustomAppointment: React.FC<any> = ({
  children,
  style,
  data,
  ...restProps
}) => {
  const warna = data?.color;
  if (warna) {
    const [colorCode] = warna.split("_");
    const customStyle = {
      ...style,
      backgroundColor: colorCode,
    };

    return (
      <Appointments.Appointment {...restProps} style={customStyle}>
        {children}
      </Appointments.Appointment>
    );
  }
  const Style = {
    ...style,
    backgroundColor: "#3b82f6",
  };
  return (
    <Appointments.Appointment {...restProps} style={Style}>
      {children}
    </Appointments.Appointment>
  );
};

const Demo: React.FC = () => {
  const { token } = useStore();
  const [Data, setData] = useState<any[]>([]);
  const [trigger, setTrigger] = useState<boolean>(false);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  const getKalenderPendidikan = async () => {
    try {
      const response = await Kalender.GetAllDetail(token, 0, 20);
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

  useEffect(() => {
    getKalenderPendidikan();
  }, [trigger]);

  const editAgenda = async (id: number, data: any) => {
    try {
      const dataRest = {
        ...(data.startDate ? { start_date: data.startDate } : {}),
        ...(data.endDate ? { end_date: data.endDate } : {}),
        ...(data.title ? { agenda: data.title } : {}),
      };
      const response = await Kalender.EditDetail(token, id, dataRest);
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
    const response = await Kalender.deleteDetail(token, id);
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
      console.log(changed);

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
  return (
    <Paper>
      <Scheduler data={Data}>
        <ViewState
          currentDate={currentDate}
          onCurrentDateChange={setCurrentDate}
        />
        <EditingState onCommitChanges={commitChanges} />
        <IntegratedEditing />
        <MonthView />
        <ConfirmationDialog />
        {/* <Appointments/> */}
        <Appointments appointmentComponent={CustomAppointment} />
        <Toolbar />
        <DateNavigator />
        <TodayButton />
        <AppointmentTooltip showOpenButton showDeleteButton />
        <AppointmentForm />
      </Scheduler>
    </Paper>
  );
};

export default Demo;
