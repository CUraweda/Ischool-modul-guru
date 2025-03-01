export interface StoreState {
  token: string | null;
  setToken: (token: string | null) => void;
  removeToken: () => void;

  role: string | null;
  setRole: (role: string | null) => void;

  id: string | null;
  setId: (id: string | null) => void;

  employeeId: string | null;
  setEmployeeId: (employeeId: string | null) => void;

  tanggalPekanan: any;
  setTanggalPekanan: (tanggalPekanan: any) => void;

  tanggalStartDate: Date;
  setTanggalStartDate: (tanggalStartDate: any) => void;

  data: string | null;
  setData: (data: string | null) => void;
  removeData: () => void;
}

export interface StoreProps {
  tahunProps: string;
  setTahunProps: (tahunProps: string) => void;

  semesterProps: string;
  setSemesterProps: (semesterProps: string) => void;

  kelasProps: string;
  setKelasProps: (kelasProps: string) => void;

  academicProps: string;
  setAcademicYearProps: (academicProps: string) => void;

  mapelProps: string;
  setMapelProps: (mapelProps: string) => void;

  inArea: boolean;
  setInareaProps: (inArea: boolean) => void;

  distance: number;
  setDistanceProps: (distance: number) => void;

  userClasses: any[];
  setUserClasses: (userClasses: any[]) => void;
}

// global state
export interface IglobalState {
  academicYear: string;
  setAcademicYear: (academicYear: string) => void;

  clearStore: () => void;
}

// for employee related
export interface IemployeeState {
  employee: any;
  setEmployee: (employee: any) => void;

  headmaster: any;
  setHeadmaster: (headmaster: any) => void;

  formTeachers: any[];
  setFormTeachers: (formTeachers: any[]) => void;

  formSubjects: any[];
  setFormSubjects: (formSubjects: any[]) => void;

  formXtras: any[];
  setFormXtras: (formXtras: any[]) => void;

  employeeSignature: any[];
  setEmployeeSignature: (employeeSignature: any[]) => void;

  isAsessor: Boolean;
  setIsAsessor: (isAsessor: Boolean) => void;

  isHeadmaster: () => boolean;
  clearStore: () => void;
}
