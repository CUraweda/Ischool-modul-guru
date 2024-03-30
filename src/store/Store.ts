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
}));

export const useStore = Store;
