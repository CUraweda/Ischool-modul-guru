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

const Demo = () => {
  const { token } = useStore();

  const [data, setData] = useState<any[]>([]);
  const [triger, setTriger] = useState<boolean>(false)
  const [currentDate, setCurrentDate] = useState(new Date());

  const getKalenderPendidikan = async () => {
    try {
      const response = await Kalender.GetAllDetail(token, 0, 20);
      const dataList = response.data.data.result;

      const setNewData = dataList.map((item: any) => {
        const dataRest = {
          id: item.id,
          title: item.agenda,
          startDate: new Date(item.start_date),
          endDate: new Date(item.end_date),
          location: "Room 3",
        };
        return dataRest;
      });
      console.log(setNewData);
      

      setData(setNewData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getKalenderPendidikan();
  }, [triger]);

  const editAgenda = async (id: number, data: any) => {
    try {
      const dataRest = {
        ...(data.startDate ? { start_date: data.startDate } : {}),
        ...(data.endDate ? { end_date: data.endDate } : {}),
        ...(data.title ? { agenda: data.title } : {}),
      };
      const response = await Kalender.EditDetail(token, id, dataRest);
      console.log(response);
      setTriger(!triger)
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
    setTriger(!triger)
  };

  const deleteDetail = async (id: number) => {
   
   const response = await Kalender.deleteDetail(token, id);
    console.log(response);
    
    setTriger(!triger)
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
      
      Object.keys(changed).forEach((id) => {
        console.log(id);
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
      <Scheduler data={data}>
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
