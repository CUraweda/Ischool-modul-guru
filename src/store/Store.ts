import create, { SetState } from "zustand";
import { StoreState } from "./Utils";

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


export const useStore = Store;
