import axios, { AxiosPromise } from "axios";
import { LoginResponse } from "./Utils";
const instance = axios.create({ baseURL: 'https://api-dev.curaweda.com:7000' });

const Auth ={
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
}

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
    })
}

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
    })
}

export {
    Auth, Task, Kalender
}