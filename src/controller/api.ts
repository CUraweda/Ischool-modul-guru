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
      url: `/api/student-task/create-by-class`,
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
};

export { Auth, Task, Kalender };
