import axios, { AxiosPromise } from "axios";
import { LoginResponse } from "./Utils";
const instance = axios.create({ baseURL: "https://api-dev.curaweda.com:7000" });

const Auth = {
  Login: (
    email: string | null,
    password: string | null
  ): AxiosPromise<LoginResponse> =>
    instance({
      method: "POST",
      url: "/api/auth/login",
      data: {
        email,
        password,
      },
    }),
};

const Student = {
  GetStudentByClass: (
    token: string | null,
    id: number | null,
    tahun: string | null
  ): AxiosPromise<any> =>
    instance({
      method: "GET",
      url: `/api/student-class/show-by-class/${id}?academic=${tahun}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  CreatePresensi: (token: string | null, data: any): AxiosPromise<any> =>
    instance({
      method: "POST",
      url: "/api/student-attendance/create",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data,
    }),
  GetPresensiByClassDate: (
    token: string | null,
    id: number | null,
    date: string | null
  ): AxiosPromise<any> =>
    instance({
      method: "GET",
      url: `/api/student-attendance/show-by-class/${id}?att_date=${date}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  deletePresensi: (
    token: string | null,
    id: number | null
  ): AxiosPromise<any> =>
    instance({
      method: "DELETE",
      url: `/api/student-attendance/delete/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
};

const Task = {
  GetAll: (
    token: string | null,
    page: number | null,
    limit: number | null
  ): AxiosPromise<any> =>
    instance({
      method: "GET",
      url: `/api/student-task?search_query=&page=${page}&limit=${limit}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  GetAllTask: (
    token: string | null,
    page: number | null,
    limit: number | null
  ): AxiosPromise<any> =>
    instance({
      method: "GET",
      url: `/api/task?search_query=&page=${page}&limit=${limit}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  GetAllClass: (
    token: string | null,
    page: number | null,
    limit: number | null
  ): AxiosPromise<any> =>
    instance({
      method: "GET",
      url: `/api/classes?search_query=&page=${page}&limit=${limit}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  GetAllMapel: (
    token: string | null,
    page: number | null,
    limit: number | null
  ): AxiosPromise<any> =>
    instance({
      method: "GET",
      url: `/api/subject?search_query=&page=${page}&limit=${limit}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  createTask: (token: string | null, data: any): AxiosPromise<any> =>
    instance({
      method: "POST",
      url: `/api/student-task/create`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data,
    }),
  createTaskClass: (token: string | null, data: any): AxiosPromise<any> =>
    instance({
      method: "POST",
      url: `/api/task/create`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data,
    }),

  deleteTask: (token: string | null, id: number | null): AxiosPromise<any> =>
    instance({
      method: "DELETE",
      url: `/api/student-task/delete/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  deleteTaskClass: (
    token: string | null,
    id: number | null
  ): AxiosPromise<any> =>
    instance({
      method: "DELETE",
      url: `/api/task/delete/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  getDetailTask: (token: string | null, id: number | null): AxiosPromise<any> =>
    instance({
      method: "GET",
      url: `/api/task-detail/show-by-task/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  getTaskById: (token: string | null, id: number | null): AxiosPromise<any> =>
    instance({
      method: "GET",
      url: `/api/task/show/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  downloadTugas: (token: string | null, path: string | null): AxiosPromise<any> =>
    instance({
      method: "GET",
      url: `/api/student-task/download?filepath=${path}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: 'blob',
    }),

};

const Kalender = {
  GetAllDetail: (
    token: string | null,
    page: number | null,
    limit: number | null
  ): AxiosPromise<any> =>
    instance({
      method: "GET",
      url: `/api/edu-calendar-detail?search_query=&page=${page}&limit=${limit}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  GetAllTopik: (
    token: string | null,
    page: number | null,
    limit: number | null
  ): AxiosPromise<any> =>
    instance({
      method: "GET",
      url: `/api/edu-calendar?search_query=&page=${page}&limit=${limit}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  EditDetail: (
    token: string | null,
    id: number | null,
    data: any
  ): AxiosPromise<any> =>
    instance({
      method: "PUT",
      url: `/api/edu-calendar-detail/update/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data,
    }),
  createDetail: (token: string | null, data: any): AxiosPromise<any> =>
    instance({
      method: "POST",
      url: `/api/edu-calendar-detail/create`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data,
    }),
  createTopik: (token: string | null, data: any): AxiosPromise<any> =>
    instance({
      method: "POST",
      url: `/api/edu-calendar/create`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data,
    }),

  deleteDetail: (token: string | null, id: number | null): AxiosPromise<any> =>
    instance({
      method: "DELETE",
      url: `/api/edu-calendar-detail/delete/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  deleteTimeTable: (token: string | null, id: number | null): AxiosPromise<any> =>
    instance({
      method: "DELETE",
      url: `/api/timetable/delete/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  GetAllTimetable: (
    token: string | null,
    kelas: string | null,
    semester: string | null
  ): AxiosPromise<any> =>
    instance({
      method: "GET",
      url: `/api/timetable/show-by-class/${kelas}?semester=${semester}&academic=2023/2024`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  createTimeTable: (token: string | null, data: any): AxiosPromise<any> =>
    instance({
      method: "POST",
      url: `/api/timetable/create`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data,
    }),
    EditTimeTable: (
      token: string | null,
      id: number | null,
      data: any
    ): AxiosPromise<any> =>
      instance({
        method: "PUT",
        url: `/api/timetable/update/${id}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data,
      }),
};

const Raport = {
  createNumberRaport: (token: string | null, data: any): AxiosPromise<any> =>
    instance({
      method: "POST",
      url: `/api/number-report/create`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data,
    }),
}

export { Auth, Task, Kalender, Student, Raport };
