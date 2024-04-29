export interface StoreState {
  token: string | null;
  setToken: (token: string | null) => void;
  removeToken: () => void;

  data: string | null;
  setData: (data: string | null) => void;
  removeData: () => void;
}
