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
  DateNavigator,
  Toolbar,
  TodayButton,
} from "@devexpress/dx-react-scheduler-material-ui";
import { useStore } from "../store/Store";
import { Kalender } from "../controller/api";

const appointments = [
  {
    id: 1,
    title: "Hadir",
    startDate: new Date(2024, 3, 20).toISOString(), // Correctly formatted as string
    endDate: new Date(2024, 3, 21).toISOString(), // Correctly formatted as string
    location: "Room 3",
  },
  // ...other appointments
];

const Demo = () => {
  const { token } = useStore();

  const [data, setData] = useState<any[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  const getKalenderPendidikan = async () => {
    try {
      const response = await Kalender.GetAllDetail(token, 0, 20);
      const dataList = response.data.data.result;
      
      
      const setNewData = dataList.map((item: any, index: number) => {
          console.log(item.start_date);
        const dataRest = {
          id: index,
          title: item.agenda,
          startDate: new Date(item.start_date),
          endDate: new Date(item.end_date),
          location: "Room 3",
        };
        return dataRest;
      });

      setData(setNewData)
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getKalenderPendidikan();
  }, []);

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
      console.log(added);
    }

    if (changed) {
      console.log(changed);
    }

    if (deleted !== undefined) {
      console.log(deleted);
    }
  };
  console.log(data);
  

  return (
    <Paper>
      <Scheduler data={data} height={660}>
        <ViewState
          currentDate={currentDate}
          onCurrentDateChange={setCurrentDate}
        />
        <EditingState onCommitChanges={commitChanges} />
        <IntegratedEditing />
        <MonthView />
        <ConfirmationDialog />
        <Appointments />
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
