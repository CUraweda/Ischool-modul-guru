import { Employee } from "./employee";

export type Jobdesk = {
  id: number;
  employee_id: number;
  grader_id: number | null;
  name: string;
  description: string;
  due_date: string;
  priority: number;
  priority_label: string;
  is_finish: boolean;
  finished_at: string | null;
  is_graded: boolean;
  graded_at: string | null;
  grade: number;
  asessor_ids: string;
  createdAt: string;
  updatedAt: string;
  employee: Employee;
  grader: unknown;
};


