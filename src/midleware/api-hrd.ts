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
  downloadFile: (token: string | null, path: string | null) =>
    instance.get("/api/employee-vacation/download", {
      params: {
        file_path: path,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: "blob",
    }),
};

const PengajuanPelatihanKaryawan = {
  request: (token: string | null, data: any) =>
    instance.post("/api/training-suggestion/request", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  showAll: (
    token: string | null,
    search: string,
    employeeId: string,
    page: number = 0,
    limit: number = 10
  ) =>
    instance.get("/api/training-suggestion", {
      params: { search, employee_id: employeeId, page, limit },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  showOne: (token: string | null, id: string | null) =>
    instance.get("/api/training-suggestion/" + id, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  update: (token: string | null, id: string | number | null, data: any) =>
    instance.put("/api/training-suggestion/update/" + id, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  delete: (token: string | null, id: string | number | null) =>
    instance.delete("/api/training-suggestion/delete/" + id, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
};

const PelatihanKaryawan = {
  showAll: (
    token: string | null,
    search: string,
    employeeId: string,
    status: string,
    page: number = 0,
    limit: number = 10
  ) =>
    instance.get("/api/training", {
      params: { search, employee_id: employeeId, status, page, limit },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  showOne: (token: string | null, id: string | null) =>
    instance.get("/api/training/" + id, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  showAllDokumentasi: (
    token: string | null,
    trainingId: string,
    page: number = 0,
    limit: number = 10000
  ) =>
    instance.get("/api/training-attendance", {
      params: { training_id: trainingId, page, limit },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  uploadDokumentasi: (token: string | null, training_id: string, data: any) =>
    instance.post(
      "/api/training-attendance/attend-specific/" + training_id,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    ),
  hapusDokumentasi: (token: string | null, id: string) =>
    instance.delete("/api/training-attendance/delete/" + id, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
};
const waktukerja = {
  today: (token: string | null) =>
    instance.get(`api/worktime/today`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
};
const Rekapan = {
  kalendarKehadiran: (
    token: string | null,
    startDate: string,
    endDate: string
  ) =>
    instance.get("/api/employee-attendance/recap-calendar-by-token", {
      params: { start_date: startDate, end_date: endDate },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  jumlahPresensi: (token: string | null, employeeId: string) =>
    instance.get(
      "/api/employee-attendance/recap-month-employee/" + employeeId,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    ),
  presensiSetahun: (token: string | null, id: any | null) =>
    instance.get(`/api/employee-attendance/recap-year-employee/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
};

const PengumumanKaryawan = {
  showAll: (
    token: string | null,
    search: string,
    specific: string,
    employeeId: string,
    page: number = 0,
    limit: number = 10
  ) =>
    instance.get("/api/employee-announcement", {
      params: {
        search,
        only_specific: specific,
        employee_id: employeeId,
        page,
        limit,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  showOne: (token: string | null, id: string | null) =>
    instance.get("/api/employee-announcement/" + id, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
};

const PresensiKaryawan = {
  hadir: (token: string, data: any) =>
    instance.post("/api/employee-attendance/attend", data, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    }),
};

export {
  CutiIzin,
  PengajuanPelatihanKaryawan,
  PelatihanKaryawan,
  Rekapan,
  waktukerja,
  PengumumanKaryawan,
  PresensiKaryawan,
};
