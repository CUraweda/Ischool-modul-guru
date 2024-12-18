import { create } from "zustand";
import { getCurrentAcademicYear, getMonday } from "../utils/common";
import { IemployeeState, IglobalState, StoreProps, StoreState } from "./Utils";

const Store = create<StoreState>((set) => ({
  token: localStorage.getItem("token"),
  setToken: (token) => {
    if (token) {
      localStorage.setItem("token", token);
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

  id: sessionStorage.getItem("id"),
  setId: (id) => {
    if (id) {
      sessionStorage.setItem("id", id);
    } else {
      sessionStorage.removeItem("id");
    }
    set({ id });
  },

  tanggalPekanan: getMonday(new Date()),
  setTanggalPekanan: (data) => set({ tanggalPekanan: data }),

  tanggalStartDate: new Date(),
  setTanggalStartDate: (data) => set({ tanggalStartDate: data }),

  data: sessionStorage.getItem("data")
    ? JSON.parse(sessionStorage.getItem("data") as string)
    : null,
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
  tahunProps: "",
  setTahunProps: (tahunProps: string) => set({ tahunProps }),

  semesterProps: "",
  setSemesterProps: (semesterProps: string) => set({ semesterProps }),

  academicProps: "",
  setAcademicYearProps: (academicProps: string) => set({ academicProps }),

  kelasProps: "",
  setKelasProps: (kelasProps: string) => set({ kelasProps }),

  mapelProps: "",
  setMapelProps: (mapelProps: string) => set({ mapelProps }),

  inArea: false,
  setInareaProps: (inArea: boolean) => set({ inArea }),

  distance: 0,
  setDistanceProps: (distance: number) => set({ distance }),

  userClasses: [],
  setUserClasses: (userClasses: any[]) => set({ userClasses }),
}));

const employeeStore = create<IemployeeState>((set, get) => ({
  employee: null,
  setEmployee: (employee) => set({ employee }),

  headmaster: null,
  setHeadmaster: (headmaster) => set({ headmaster }),

  formTeachers: [],
  setFormTeachers: (formTeachers) => set({ formTeachers }),

  formSubjects: [],
  setFormSubjects: (formSubjects) => set({ formSubjects }),

  formXtras: [],
  setFormXtras: (formXtras) => set({ formXtras }),

  employeeSignature: [],
  setEmployeeSignature: (employeeSignature) => set({ employeeSignature }),

  isAsessor: false,
  setIsAsessor: (isAsessor) => set({ isAsessor }),

  isHeadmaster: () => get().employee != null && Store().role?.toString() == "4",

  clearStore: () =>
    set({
      employee: null,
      headmaster: null,
      isAsessor: false,
      formTeachers: [],
      formSubjects: [],
      formXtras: [],
      employeeSignature: [],
    }),
}));

const globalStore = create<IglobalState>((set) => ({
  academicYear: getCurrentAcademicYear(),
  setAcademicYear: (academicYear: string) => set({ academicYear }),

  clearStore: () =>
    set({
      academicYear: getCurrentAcademicYear(),
    }),
}));

export { employeeStore, globalStore, Store, useProps };
