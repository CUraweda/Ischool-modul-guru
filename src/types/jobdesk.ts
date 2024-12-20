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
  personal_grade: number;
  personal_graded_at: Date | null;
  partner_grade: number;
  partner_graded_at: Date | null;
  assesor_grade: number;
  assesor_graded_at: Date | null;
  overall_grade_raw: number;
  overall_grade: string;
  grading_id: number;
  choosen_grade_id: number | null;
  unit_id: number;
  evaluation_id: number;
  evaluation_items_id: number;
  employee: Employee;
  grader: unknown;
};

export type Identifier = "SUPERVISOR" | "PARTNER" | "PERSONAL";

export type PayloadUpdateGrade = {
  id: number;
  grade: number;
  identifier: Identifier;
};

export type UpdateGradeState = Omit<PayloadUpdateGrade, "grade"> & {
  grade: string;
};
