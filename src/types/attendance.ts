import { Division } from "./division";
import { Employee } from "./employee";
import { Worktime } from "./worktime";

export type Attendance = {
  id: number;
  worktime_id: number;
  employee_id: number;
  uid: string;
  description: string;
  status: string;
  outstation_id: number | null;
  is_outstation: boolean;
  file_path: string | null;
  attendance_time_differences: number;
  createdAt: string;
  updatedAt: string;
  worktime: Worktime;
  employee: Employee & { division: Division };
};
