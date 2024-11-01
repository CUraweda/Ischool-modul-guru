/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { token } from "../utils/common";

export const instance = axios.create({
  baseURL: import.meta.env.VITE_REACT_API_HRD_URL,
  headers: {
    Authorization: `Bearer ${token.get}`,
  },
});

const Attendance = {
  getEmployeeAttendance: (
    page: number,
    limit: number,
    type: string[],
    status: string[],
    search: string,
    division: any,
    date: string
  ) => {
    const typeParam = type.length ? type.join(",") : "";
    const statusParam = status.length ? status.join(",") : "";

    return instance.get(`/employee-attendance`, {
      params: {
        search,
        type: typeParam,
        status: statusParam,
        division_id: division,
        date,
        page,
        limit,
      },
    });
  },
  deleteAttendance: (id: number) =>
    instance.delete(`/employee-attendance/delete/${id}`),
  getAllEmployeeMonth: (search: string) => {
    return instance.get(`/employee-attendance/recap-month-employee`, {
      params: {
        search_query: search,
      },
    });
  },
  getAllDivision: () => {
    return instance.get(`/division`);
  },
  getVacation: (
    page: number,
    limit: number,
    search: string,
    type: string[],
    status: string[],
    date: string,
    divisi: any
  ) => {
    const typeParam = type.length ? type.join(",") : "";
    const statusParam = status.length ? status.join(",") : "";

    return instance.get("/employee-vacation", {
      params: {
        search,
        page,
        limit,
        type: typeParam,
        status: statusParam,
        date,
        division_id: divisi,
      },
    });
  },

  createVacation: (data: any) =>
    instance.post("/employee-vacation/create", data),

  updateVacation: (id: number, data: any) =>
    instance.put(`/employee-vacation/update/${id}`, data),

  acceptVacation: (id: number, data: null) =>
    instance({
      method: `PUT`,
      url: `/employee-vacation/change-status/accept/${id}`,
      data,
    }),

  rejectVacation: (id: number, data: null) =>
    instance({
      method: `PUT`,
      url: `/employee-vacation/change-status/reject/${id}`,
      data,
    }),

  deleteVacation: (id: number) =>
    instance.delete(`/employee-vacation/delete/${id}`),
  requestVacation: (data: any) =>
    instance.post(`/employee-vacation/create`, data),
};

const Karyawan = {
  DataKaryawan: async (
    page: number,
    limit: number,
    search: string,
    status: string
  ) =>
    await instance({
      method: "GET",
      url: `/employee?page=${page}&limit=${limit}&search=${search}&status=${status}`,
    }),
  TambahKaryawan: (data: any) =>
    instance({
      method: `POST`,
      url: `/employee/create`,
      data,
    }),
  EditKaryawan: (data: any, id: string) =>
    instance({
      method: `PUT`,
      url: `/employee/update/${id}`,
      data,
    }),
  HapusKaryawan: (id: string) =>
    instance({
      method: `DELETE`,
      url: `/employee/delete/${id}`,
    }),
  ProfilKaryawan: (id: string | undefined) =>
    instance({
      method: `GET`,
      url: `/employee/detail/${id}`,
    }),
  DaftarPenilaian: (page: number, limit: number, search: string) =>
    instance({
      method: `GET`,
      url: `/employee?page=${page}&limit=${limit}&search=${search}`,
    }),
  AddPenilaian: (data: any) =>
    instance({
      method: `POST`,
      url: `/employee/create`,
      data,
    }),
  EditPenilaian: (data: any, id: string) =>
    instance({
      method: `PUT`,
      url: `/employee/update/${id}`,
      data,
    }),
  EditNilai: async (data: any, id: string) =>
    await instance({
      method: `PUT`,
      url: `/employee/update/${id}`,
      data,
    }),
  JobdeskList: (id?: string, graded?: number) =>
    instance({
      method: `GET`,
      url: `/employee-jobdesk?page=0&limit=200&employee_id=${id}&raw_grade=${graded}`,
    }),
};

const Jobdesk = {
  getAllJobdesk: (limit: number, search: string, page: number, id: string) =>
    instance.get(`/employee?employee_id=${id}`, {
      params: {
        limit: limit,
        search,
        page: page,
      },
    }),
  createJobdesk: (data: any) =>
    instance.post("/employee?page=0&limit=20&employee_id=1", data),
};

const Employee = {
  getOneEmployee: (id: any) => instance.get(`/employee/show/${id}`),
  getAllEmployee: (limit: number, search_query: any) =>
    instance.get("/employee", {
      params: {
        limit: limit,
        search: search_query,
      },
    }),
  getAllEmployeePage: (limit: number, search_query: string, page: number) =>
    instance.get("/employee", {
      params: {
        limit: limit,
        search: search_query,
        page: page,
      },
    }),
  updateDivisi: (id: number, data: any) =>
    instance.put(`/employee/update/${id}`, {
      division_id: data,
    }),
};

const CutiIzin = {
  showAll: (
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
      url: "/employee-vacation",
      params: {
        search,
        employee_id: employeeId,
        type,
        date,
        status,
        page,
        limit,
      },
    }),
  showOne: (id: string) => instance.get("/employee-vacation/" + id),
  request: (data: any) => instance.post("/employee-vacation/request", data),
  change: (id: string, data: any) =>
    instance.put("/employee-vacation/change/" + id, data),
  remove: (id: string) => instance.delete("/employee-vacation/remove/" + id),
  downloadFile: (path: string | null) =>
    instance.get("/employee-vacation/download", {
      params: {
        file_path: path,
      },
      responseType: "blob",
    }),
};

const PengajuanPelatihanKaryawan = {
  request: (data: any) => instance.post("/training-suggestion/request", data),
  showAll: (
    search: string,
    employeeId: string,
    page: number = 0,
    limit: number = 10
  ) =>
    instance.get("/training-suggestion", {
      params: { search, employee_id: employeeId, page, limit },
    }),
  showOne: (id: string | null) => instance.get("/training-suggestion/" + id),
  update: (id: string | number | null, data: any) =>
    instance.put("/training-suggestion/update/" + id, data),
  delete: (id: string | number | null) =>
    instance.delete("/training-suggestion/delete/" + id),
};

const EmployeeJobdesk = {
  getAllJobdesk: (limit: number, search: any, page: number) =>
    instance.get("/employee-jobdesk", {
      params: {
        limit: limit,
        search,
        page: page,
      },
    }),
  getDifference: (id: number) => instance.get(`/employee/difference-day/${id}`),
  createJobdesk: (data: any) => instance.post("/employee-jobdesk/create", data),
};

const DownloadFile = {
  Download: (file_path: string) =>
    instance({
      method: `GET`,
      url: `/download?filepath=${file_path}`,
    }),
  DownloadSade: (file_path: string) =>
    instance({
      method: `GET`,
      url: `/student-task/download?filepath=${file_path}`,
    }),
};

const PelatihanKaryawan = {
  showAll: (
    search: string,
    employeeId: string,
    status: string,
    page: number = 0,
    limit: number = 10
  ) =>
    instance.get("/training", {
      params: { search, employee_id: employeeId, status, page, limit },
    }),
  showOne: (id: string | null) => instance.get("/training/" + id),
  showAllDokumentasi: (
    trainingId: string,
    page: number = 0,
    limit: number = 10000
  ) =>
    instance.get("/training-attendance", {
      params: { training_id: trainingId, page, limit },
    }),

  uploadDokumentasi: (training_id: string, data: any) =>
    instance.post(
      "/training-attendance/attend-specific/" + training_id,
      data,
      {}
    ),
  hapusDokumentasi: (id: string) =>
    instance.delete("/training-attendance/delete/" + id),
};

const waktukerja = {
  today: () => instance.get(`/worktime/today`),
};

const Rekapan = {
  kalendarKehadiran: (startDate: string, endDate: string) =>
    instance.get("/employee-attendance/recap-calendar-by-token", {
      params: { start_date: startDate, end_date: endDate },
    }),
  jumlahPresensi: (employeeId: string) =>
    instance.get("/employee-attendance/recap-month-employee/" + employeeId),
  presensiSetahun: (id: any | null) =>
    instance.get(`/employee-attendance/recap-year-employee/${id}`),
};

const PengumumanKaryawan = {
  showAll: (
    search: string,
    specific: string,
    employeeId: string,
    page: number = 0,
    limit: number = 10
  ) =>
    instance.get("/employee-announcement", {
      params: {
        search,
        only_specific: specific,
        employee_id: employeeId,
        page,
        limit,
      },
    }),
  showOne: (id: string | null) => instance.get("/employee-announcement/" + id),
};

const PresensiKaryawan = {
  hadir: (data: any) => instance.post("/employee-attendance/attend", data),
};

export {
  Attendance,
  CutiIzin,
  DownloadFile,
  Employee,
  EmployeeJobdesk,
  Jobdesk,
  Karyawan,
  PelatihanKaryawan,
  PengajuanPelatihanKaryawan,
  PengumumanKaryawan,
  PresensiKaryawan,
  Rekapan,
  waktukerja,
};
