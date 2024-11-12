export type User = {
  id: number;
  uuid: string;
  role_id: number;
  full_name: string;
  email: string;
  status: number;
  email_verified: number;
  address: string | null;
  phone_number: string | null;
  avatar: string | null;
  reset_token: string | null;
  reset_token_exp: string | null;
  createdAt: string;
  updatedAt: string;
  useraccesses: Array<string | number>;
  employee: Employee;
};

export type Employee = {
  id: number;
  user_id: number;
  employee_no: string;
  full_name: string;
  gender: string;
  pob: string;
  dob: string;
  religion: string;
  marital_status: string;
  last_education: string;
  certificate_year: string;
  is_education: string;
  major: string;
  employee_status: string;
  work_start_date: string;
  occupation: string;
  is_teacher: string;
  duty: string;
  job_desc: string;
  grade: string;
  email: string;
  is_asessor: boolean;
  createdAt: string;
  updatedAt: string;
  headmaster: unknown | null;
  formteachers: FormTeacher[];
  formsubjects: FormSubject[];
  formextras: Array<unknown>;
};

export type FormTeacher = {
  id: number;
  class_id: number;
  academic_year: string;
  class: Class;
};

export type Class = {
  id: number;
  level: string;
  class_name: string;
};

export type FormSubject = {
  id: number;
  subject_id: number;
  academic_year: string;
  subject: Subject;
};

export type Subject = {
  id: number;
  level: string;
  name: string;
};
