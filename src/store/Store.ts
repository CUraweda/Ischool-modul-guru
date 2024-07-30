import create, { SetState } from "zustand";
import { StoreState , StoreProps, IemployeeState, IglobalState} from "./Utils";
import { getCurrentAcademicYear } from "../utils/common";

const Store = create<StoreState>((set: SetState<StoreState>) => ({
  token: localStorage.getItem("token"),
  setToken: (token) => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
    set({ token });
  },
  removeToken: () => {
    localStorage.removeItem("token");
    set({ token: null });
  },

  role: sessionStorage.getItem("role"),
  setRole: (role) => {
    if (role) {
      sessionStorage.setItem("role", role);
    } else {
      sessionStorage.removeItem("role");
    }
    set({ role });
  },

  tanggalPekanan: new Date(),
  setTanggalPekanan: (data) => set({ tanggalPekanan: data }),

  tanggalStartDate: new Date(),
  setTanggalStartDate: (data) => set({ tanggalStartDate: data }),
 

  data: sessionStorage.getItem("data") ? JSON.parse(sessionStorage.getItem("data") as string) : null,
  setData: (data) => {
    if (data) {
      sessionStorage.setItem("data", JSON.stringify(data));
    } else {
      sessionStorage.removeItem("data");
    }
    set({ data });
  },
  removeData: () => {
    sessionStorage.removeItem("data");
    set({ data: null });
  },

}));

const useProps = create<StoreProps>((set) => ({
  tahunProps: '',
  setTahunProps: (tahunProps: string) => set({ tahunProps }),

  semesterProps: '',
  setSemesterProps: (semesterProps: string) => set({ semesterProps }),

  kelasProps: '',
  setKelasProps: (kelasProps: string) => set({ kelasProps }),

  mapelProps: '',
  setMapelProps: (mapelProps: string) => set({ mapelProps }),

  inArea: false,
  setInareaProps: (inArea: boolean) => set({ inArea }),

  distance: 0,
  setDistanceProps: (distance: number) => set({ distance }),

  userClasses: [],
  setUserClasses: (userClasses: any[]) => set({ userClasses })
}));

const employeeStore = create<IemployeeState>((set, get) => ({
  employee: null,
  setEmployee: (employee: any) => set({ employee }),

  headmaster: null,
  setHeadmaster: (headmaster: any) => set({ headmaster }),

  formTeachers: [],
  setFormTeachers: (formTeachers: any[]) => set({ formTeachers }),

  formSubjects: [],
  setFormSubjects: (formSubjects: any[]) => set({ formSubjects }),

  formXtras: [],
  setFormXtras: (formXtras: any[]) => set({ formXtras }),

  isHeadmaster: () => get().employee != null && Store().role?.toString() == "4",

  clearStore: () => set({
    employee: null,
    headmaster: null,
    formTeachers: [],
    formSubjects: [],
    formXtras: []
  })
}))

const globalStore = create<IglobalState>((set) => ({
  academicYear: getCurrentAcademicYear(),
  setAcademicYear: (academicYear: string) => set({academicYear}),

  clearStore: () => set({
    academicYear: getCurrentAcademicYear()
  })
}))

export { Store, useProps, employeeStore, globalStore };
