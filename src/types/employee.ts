export type Employee = {
  id: number;
  user_id: number | null;
  employee_no: string | null;
  full_name: string;
  email: string;
  phone: string | null;
  nik: string | null;
  religion: string;
  gender: string | null;
  pob: string;
  dob: string;
  marital_status: string | null;
  last_education: string;
  major: string | null;
  certificate_year: string;
  is_education: string;
  employee_status: string;
  work_start_date: string;
  occupation: string | null;
  is_teacher: string;
  duty: string | null;
  job_desc: string | null;
  grade: string | null;
  raw_grade: number;
  raw_finished_task: number;
  still_in_probation: boolean;
  probation_start_date: string | null;
  probation_end_date: string | null;
  division_id: number | null;
  is_outstation: boolean;
  active_outstation_id: string | null;
  is_asessor: boolean;
  raw_workhour: number;
  needed_employee_files: string;
  createdAt: string;
  updatedAt: string;
};