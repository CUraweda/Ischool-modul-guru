import create, { SetState } from "zustand";
import { StoreState , StoreProps} from "./Utils";

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
}));

export { Store, useProps };
