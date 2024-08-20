import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_REACT_API_HRD_URL,
});

const CutiIzin = {
  showAll: (
    token: string | null,
    search: string,
    employeeId: string,
    type: string,
    date: string,
    status: string,
    page: number = 0,
    limit: number = 10
  ) =>
    instance({
      method: "GET",
      url: "/api/employee-vacation",
      params: {
        search,
        employee_id: employeeId,
        type,
        date,
        status,
        page,
        limit,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  showOne: (token: string | null, id: string) =>
    instance.get("/api/employee-vacation/" + id, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  request: (token: string | null, data: any) =>
    instance.post("/api/employee-vacation/request", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  change: (token: string | null, id: string, data: any) =>
    instance.put("/api/employee-vacation/change/" + id, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  remove: (token: string | null, id: string) =>
    instance.delete("/api/employee-vacation/remove/" + id, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
};

export { CutiIzin };
