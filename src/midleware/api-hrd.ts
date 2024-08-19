import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_REACT_API_HRD_URL,
});

const CutiIzin = {
  create: (token: string | null, data: any) =>
    instance({
      method: "POST",
      url: "/api/for-country/create",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data,
    }),
};

export { CutiIzin };
