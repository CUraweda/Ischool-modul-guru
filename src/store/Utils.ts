export interface StoreState {
  token: string | null;
  setToken: (token: string | null) => void;
  removeToken: () => void;
}
