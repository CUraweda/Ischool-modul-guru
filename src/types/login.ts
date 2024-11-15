export type Payload = {
  email: string;
  password: string;
};

export type LoginResponse = {
  status: boolean;
  code: number;
  message: string;
  data: UserData;
  tokens: Tokens;
};

export type UserData = {
  id: number;
  uuid: string;
  role_id: number;
  full_name: string;
  email: string;
  status: number;
  email_verified: number;
  address: string | null;
  phone_number: string | null;
  avatar: string;
  reset_token: string | null;
  reset_token_exp: string | null;
  createdAt: string;
  updatedAt: string;
  useraccesses: unknown[];
  employee: Employee;
};

export type Employee = {
  id: number;
  full_name: string;
  is_asessor: boolean;
  headmaster: null;
  formteachers: FormTeacher[];
  formsubjects: FormSubject[];
  formextras: unknown[];
};

export type FormTeacher = {
  id: number;
  class_id: number;
  academic_year: string;
  class: ClassInfo;
};

export type ClassInfo = {
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

export type Tokens = {
  access: TokenDetails;
  refresh: TokenDetails;
};

export type TokenDetails = {
  token: string;
  expires: string;
};
