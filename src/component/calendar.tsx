import React from "react";
import { styled, alpha } from "@mui/material/styles";
import { ViewState } from "@devexpress/dx-react-scheduler";
import {
  Scheduler,
  DayView,
  Appointments,
  MonthView,
  Toolbar,
  DateNavigator,
  ViewSwitcher,
  TodayButton,
  AppointmentTooltip,
} from "@devexpress/dx-react-scheduler-material-ui";
import { indigo, blue, teal } from "@mui/material/colors";
import Paper from "@mui/material/Paper";

const PREFIX = "Demo";

const classes = {
  appointment: `${PREFIX}-appointment`,
  highPriorityAppointment: `${PREFIX}-highPriorityAppointment`,
  mediumPriorityAppointment: `${PREFIX}-mediumPriorityAppointment`,
  lowPriorityAppointment: `${PREFIX}-lowPriorityAppointment`,
  weekEndCell: `${PREFIX}-weekEndCell`,
  weekEndDayScaleCell: `${PREFIX}-weekEndDayScaleCell`,
  text: `${PREFIX}-text`,
  content: `${PREFIX}-content`,
  container: `${PREFIX}-container`,
};

const StyledMonthViewDayScaleCell = styled(MonthView.DayScaleCell)(
  ({ theme: { palette } }) => ({
    [`&.${classes.weekEndDayScaleCell}`]: {
      backgroundColor: alpha(palette.action.disabledBackground, 0.06),
    },
  })
);

const StyledMonthViewTimeTableCell = styled(MonthView.TimeTableCell)(
  ({ theme: { palette } }) => ({
    [`&.${classes.weekEndCell}`]: {
      backgroundColor: alpha(palette.action.disabledBackground, 0.04),
      "&:hover": {
        backgroundColor: alpha(palette.action.disabledBackground, 0.04),
      },
      "&:focus": {
        backgroundColor: alpha(palette.action.disabledBackground, 0.04),
      },
    },
  })
);

const StyledAppointmentsAppointment = styled(Appointments.Appointment)(() => ({
  [`&.${classes.appointment}`]: {
    borderRadius: 0,
    borderBottom: 0,
  },
  [`&.${classes.highPriorityAppointment}`]: {
    borderLeft: `4px solid ${teal[500]}`,
  },
  [`&.${classes.mediumPriorityAppointment}`]: {
    borderLeft: `4px solid ${blue[500]}`,
  },
  [`&.${classes.lowPriorityAppointment}`]: {
    borderLeft: `4px solid ${indigo[500]}`,
  },
}));

interface MySchedulerProps {
  data: any[]; // Modify the type according to your data structure
}

const MyScheduler: React.FC<MySchedulerProps> = ({ data }) => (
  <Paper>
    <Scheduler data={data}>
      <ViewState defaultCurrentDate={new Date()} />
      <MonthView
        dayScaleCellComponent={StyledMonthViewDayScaleCell}
        timeTableCellComponent={StyledMonthViewTimeTableCell}
      />
      <DayView
        displayName="Three days"
        startDayHour={7}
        endDayHour={18}
        intervalCount={7}
      />
      <Appointments appointmentComponent={StyledAppointmentsAppointment} />
      <AppointmentTooltip showCloseButton />
      <Toolbar />
      <DateNavigator />
      <ViewSwitcher />
      <TodayButton />
    </Scheduler>
  </Paper>
);

export default MyScheduler;
