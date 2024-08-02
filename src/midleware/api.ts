import axios, { AxiosPromise } from "axios";
import { LoginResponse } from "./Utils";
const instance = axios.create({ baseURL: import.meta.env.VITE_REACT_API_URL });

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
  MeData: (token: string | null): AxiosPromise<any> =>
    instance({
      method: "GET",
      url: "/api/user/me",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
};

const Student = {
  GetStudentByClass: (
    token: string | null,
    id: string | null,
    tahun: string | null
  ): AxiosPromise<any> =>
    instance({
      method: "GET",
      url: `/api/student-class/show-by-class/${id}?academic=${tahun}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  GetStudentByLevel: (
    token: string | null,
    level: string | null,
    tahun: string | null
  ): AxiosPromise<any> =>
    instance({
      method: "GET",
      url: `/api/student-class/show-by-level/${level}?academic=${tahun}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  GetStudents: (
    token: string | null,
    search: string | null,
    class_id: string | null,
    tahun: string | null,
    page: number | null,
    limit: number | null
  ): AxiosPromise<any> =>
    instance({
      method: "GET",
      url: `/api/student-class?search_query=${search}&academic=${tahun}&class_id=${class_id}&page=${page}&limit=${limit}`,
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
  UpdatePresensi: (
    token: string | null,
    id: string,
    data: any
  ): AxiosPromise<any> =>
    instance({
      method: "PUT",
      url: `/api/student-attendance/update/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data,
    }),
  showAllPresensi: (
    token: string | null,
    search: string | null,
    page: number | null,
    limit: number | null,
    classId: string | null,
    attDate: string | null,
    academic: string | null,
    withAssign: string | null = "N"
  ): AxiosPromise<any> =>
    instance({
      method: "GET",
      url: `/api/student-attendance?academic=${academic}&search_query=${search}&page=${page}&limit=${limit}&class_id=${classId}&att_date=${attDate}&with_assign=${withAssign}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
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
  GetPresensiById: (
    token: string | null,
    id: number | null
  ): AxiosPromise<any> =>
    instance({
      method: "GET",
      url: `/api/student-attendance/show/${id}`,
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

const Class = {
  showAll: (
    token: string | null,
    page: number | null,
    limit: number | null,
    withAssign: string | null = "N",
    withSubject: string = "Y",
    withFormClass: string = "Y"
  ): AxiosPromise<any> =>
    instance({
      method: "GET",
      url: `/api/classes?search_query=&page=${page}&limit=${limit}&with_assign=${withAssign}&with_subject=${withSubject}&with_form_class=${withFormClass}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
};

const Task = {
  GetAll: (
    token: string | null,
    search: string | null,
    classId: string | null,
    page: number | null,
    limit: number | null,
    withAssign: string = "N"
  ): AxiosPromise<any> =>
    instance({
      method: "GET",
      url: `/api/student-task?search_query=${search}&page=${page}&limit=${limit}&class_id=${classId}&with_assign=${withAssign}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  GetAllTask: (
    token: string | null,
    search: string | null,
    classId: string | null,
    page: number | null,
    limit: number | null,
    withAssign: string = "N"
  ): AxiosPromise<any> =>
    instance({
      method: "GET",
      url: `/api/task?search_query=${search}&page=${page}&limit=${limit}&class_id=${classId}&with_assign=${withAssign}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  GetAllClass: (
    token: string | null,
    page: number | null,
    limit: number | null,
    withAssign: string | null = "N",
    // is_active: string | null = "Y",
    withSubject: string = "Y",
    withFormClass: string = "Y"
  ): AxiosPromise<any> =>
    instance({
      method: "GET",
      url: `/api/classes?search_query=&page=${page}&limit=${limit}&with_assign=${withAssign}&with_subject=${withSubject}&with_form_class=${withFormClass}&is_active=Y`,
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
        "Content-Type": "multipart/form-data",
      },
      data,
    }),
  editTask: (
    token: string | null,
    id: string | null,
    data: any
  ): AxiosPromise<any> =>
    instance({
      method: "PUT",
      url: `/api/student-task/update/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data,
    }),
  editTaskClass: (
    token: string | null,
    id: string | null,
    data: any
  ): AxiosPromise<any> =>
    instance({
      method: "PUT",
      url: `/api/task/update/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data,
    }),
  editTaskDetail: (
    token: string | null,
    id: string | null,
    data: any
  ): AxiosPromise<any> =>
    instance({
      method: "PUT",
      url: `/api/task-detail/update/${id}`,
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
        "Content-Type": "multipart/form-data",
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
  getTaskById: (token: string | null, id: string | null): AxiosPromise<any> =>
    instance({
      method: "GET",
      url: `/api/task/show/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  downloadTugas: (
    token: string | null,
    path: string | null
  ): AxiosPromise<any> =>
    instance({
      method: "GET",
      url: `/api/student-task/download?filepath=${path}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: "blob",
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
  GetAllDetailById: (
    token: string | null,
    id: number | null
  ): AxiosPromise<any> =>
    instance({
      method: "GET",
      url: `/api/edu-calendar-detail/show/${id}`,
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
  deleteTimeTable: (
    token: string | null,
    id: number | null
  ): AxiosPromise<any> =>
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
  GetAllTimetableByClass: (
    token: string | null,
    classId: string | null,
    semester: string | null,
    academic: string,
    withAssign: string = "N"
  ): AxiosPromise<any> =>
    instance({
      method: "GET",
      url: `/api/timetable/show-by-class?semester=${semester}&academic=${academic}&class_id=${classId}&with_assign=${withAssign}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  GetTimetableById: (
    token: string | null,
    id: number | null
  ): AxiosPromise<any> =>
    instance({
      method: "GET",
      url: `/api/timetable/show/${id}`,
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

  duplicateTimetable: (token: string | null, data: any): AxiosPromise<any> =>
    instance({
      method: "POST",
      url: `/api/timetable/duplicate-create`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data,
    }),

  EditTimeTable: (
    token: string | null,
    id: string | null,
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
  downloadMergeRaport: (token: string | null, id: any): AxiosPromise<any> =>
    instance({
      method: "PUT",
      url: `/api/student-report/merge/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  createStudentRaport: (token: string | null, data: any): AxiosPromise<any> =>
    instance({
      method: "POST",
      url: `/api/student-report/create`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data,
    }),
  updateStudentReportAccess: (
    token: string | null,
    id: string | null
  ): AxiosPromise<any> =>
    instance({
      method: "PUT",
      url: `/api/student-report/update-access/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  getAllStudentReport: (
    token: string | null,
    id: string | null,
    semester: string | null,
    academic: string | null
  ): AxiosPromise<any> =>
    instance({
      method: "GET",
      url: `/api/student-report/show-by-class/${id}?semester=${semester}&academic=${academic}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  showAllStudentReport: (
    token: string | null,
    classId: string,
    semester: string,
    page: number | null,
    limit: number | null,
    withAssign: string | null = "N",
    academic: string
  ): AxiosPromise<any> =>
    instance({
      method: "GET",
      url: `/api/student-report?search_query=&page=${page}&class_id=${classId}&semester=${semester}&limit=${limit}&with_assign=${withAssign}&academic=${academic}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  // raport angka
  getAllNumberReport: (token: string | null, data: any): AxiosPromise<any> =>
    instance({
      method: "GET",
      url: `/api/number-report/filter-by-params?academic=${data.tahun}&semester=${data.semester}&class_id=${data.class}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  showAllNumberReport: (
    token: string | null,
    search: string | null,
    classId: string | null,
    academic: string | null,
    semester: string | null,
    subjectId: string | null,
    page: number | null,
    limit: number | null,
    withAssign: string | null = "N"
  ): AxiosPromise<any> =>
    instance({
      method: "GET",
      url: `/api/number-report?search_query=${search}&academic=${academic}&subject_id=${subjectId}&page=${page}&class_id=${classId}&semester=${semester}&limit=${limit}&with_assign=${withAssign}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  getNumberReportByStudent: (
    token: string | null,
    id: string | null,
    smt: string | null
  ): AxiosPromise<any> =>
    instance({
      method: "GET",
      url: `/api/number-report/show-by-student/${id}?semester=${smt}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  generateNumberReport: (
    token: string | null,
    id: string | null,
    smt: string | null
  ): AxiosPromise<any> =>
    instance({
      method: "GET",
      url: `/api/number-report/generate/${id}?semester=${smt}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  getByIdNumberReport: (token: string | null, id: string): AxiosPromise<any> =>
    instance({
      method: "GET",
      url: `/api/number-report/show/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  createNumberRaport: (token: string | null, data: any): AxiosPromise<any> =>
    instance({
      method: "POST",
      url: `/api/number-report/create`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data,
    }),

  deleteNumberReport: (token: string | null, id: string): AxiosPromise<any> =>
    instance({
      method: "DELETE",
      url: `/api/number-report/delete/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  editNumberRaport: (
    token: string | null,
    id: string,
    data: any
  ): AxiosPromise<any> =>
    instance({
      method: "PUT",
      url: `/api/number-report/update/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data,
    }),

  // Raport Narasi
  getKategoriNarasi: (
    token: string | null,
    id: string | null
  ): AxiosPromise<any> =>
    instance({
      method: "GET",
      url: `/api/narrative-category/show-by-class/${id} `,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  getDeskripsiNarasi: (
    token: string | null,
    id: string | null
  ): AxiosPromise<any> =>
    instance({
      method: "GET",
      url: `/api/narrative-desc/show-by-subcategory/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  createDeskripsi: (token: string | null, data: any): AxiosPromise<any> =>
    instance({
      method: "POST",
      url: `/api/narrative-desc/create`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data,
    }),
  createKategori: (token: string | null, data: any): AxiosPromise<any> =>
    instance({
      method: "POST",
      url: `/api/narrative-category/create`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data,
    }),
  createKomentarKategori: (
    token: string | null,
    data: any
  ): AxiosPromise<any> =>
    instance({
      method: "POST",
      url: `/api/narrative-comment/create`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data,
    }),
  updateKomentarKategori: (
    token: string | null,
    id: string | null,
    data: any
  ): AxiosPromise<any> =>
    instance({
      method: "PUT",
      url: `/api/narrative-comment/update/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data,
    }),
  deleteKomentarNarasi: (
    token: string | null,
    id: string | null
  ): AxiosPromise<any> =>
    instance({
      method: "DELETE",
      url: `/api/narrative-comment/delete/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  deleteKategoriNarasi: (
    token: string | null,
    id: string | null
  ): AxiosPromise<any> =>
    instance({
      method: "DELETE",
      url: `/api/narrative-category/delete/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  deleteSubKategoriNarasi: (
    token: string | null,
    id: string | null
  ): AxiosPromise<any> =>
    instance({
      method: "DELETE",
      url: `/api/narrative-sub-category/delete/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  editKategori: (
    token: string | null,
    id: string | null,
    data: any
  ): AxiosPromise<any> =>
    instance({
      method: "PUT",
      url: `/api/narrative-category/update/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data,
    }),
  editSubKategori: (
    token: string | null,
    id: string | null,
    data: any
  ): AxiosPromise<any> =>
    instance({
      method: "PUT",
      url: `/api/narrative-sub-category/update/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data,
    }),
  editReportNarasi: (
    token: string | null,
    id: string | null,
    data: any
  ): AxiosPromise<any> =>
    instance({
      method: "PUT",
      url: `/api/narrative-report/update/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data,
    }),
  deleteNarasi: (token: string | null, id: string | null): AxiosPromise<any> =>
    instance({
      method: "DELETE",
      url: `/api/narrative-report/delete/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  createSubKategori: (token: string | null, data: any): AxiosPromise<any> =>
    instance({
      method: "POST",
      url: `/api/narrative-sub-category/create`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data,
    }),
  getSubCategoriNarasi: (
    token: string | null,
    id: string | null
  ): AxiosPromise<any> =>
    instance({
      method: "GET",
      url: `/api/narrative-sub-category/show-by-category/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  deleteDeskripsiNarasi: (
    token: string | null,
    id: string | null
  ): AxiosPromise<any> =>
    instance({
      method: "DELETE",
      url: `/api/narrative-desc/delete/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  getDataNarasiSiswa: (
    token: string | null,
    id: string | null,
    smt: string | null
  ): AxiosPromise<any> =>
    instance({
      method: "GET",
      url: `/api/narrative-report/show-by-student/${id}?semester=${smt}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  generatePdfNarasi: (
    token: string | null,
    id: string | null,
    smt: string | null
  ): AxiosPromise<any> =>
    instance({
      method: "GET",
      url: `/api/narrative-report/generate/${id}?semester=${smt}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  getKomentarNarasiSiswa: (
    token: string | null,
    id: string | null
  ): AxiosPromise<any> =>
    instance({
      method: "GET",
      url: `/api/narrative-comment/show-by-student-report/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  // Raport Portofolio
  getPortofolioByRaport: (
    token: string | null,
    id: string | null
  ): AxiosPromise<any> =>
    instance({
      method: "GET",
      url: `/api/portofolio-report/show-all-by-student-report/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  uploadPortofolio: (token: string | null, data: any): AxiosPromise<any> =>
    instance({
      method: "POST",
      url: `/api/portofolio-report/create`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data,
    }),

  createKomentar: (
    token: string | null,
    id: string | null,
    data: any
  ): AxiosPromise<any> =>
    instance({
      method: "PUT",
      url: `/api/student-report/update/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data,
    }),
  createRapotNarasi: (token: string | null, data: any): AxiosPromise<any> =>
    instance({
      method: "POST",
      url: `/api/narrative-report/create`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data,
    }),

  mergePortofolio: (
    token: string | null,
    id: string | null
  ): AxiosPromise<any> =>
    instance({
      method: "PUT",
      url: `/api/portofolio-report/merge/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
};

const Pengumuman = {
  createPengumuman: (token: string | null, data: any): AxiosPromise<any> =>
    instance({
      method: "POST",
      url: `/api/announcement/create`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data,
    }),
  UpdatePengumuman: (
    token: string | null,
    id: string | number | null,
    data: any
  ): AxiosPromise<any> =>
    instance({
      method: "PUT",
      url: `/api/announcement/update/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data,
    }),

  getAllPengumuman: (
    token: string | null,
    search: string | null,
    classId: string | null,
    start: string | null,
    end: string | null,
    page: number | null,
    limit: number | null,
    withAssign: string = "N"
  ): AxiosPromise<any> =>
    instance({
      method: "GET",
      url: `/api/announcement?search_query=${search}&class_id=${classId}&start_date=${start}&end_date=${end}&page=${page}$limit=${limit}&with_assign=${withAssign}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  getByIdPengumuman: (
    token: string | null,
    id: string | null
  ): AxiosPromise<any> =>
    instance({
      method: "GET",
      url: `/api/announcement/show/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  DeletePengumuman: (
    token: string | null,
    id: string | null
  ): AxiosPromise<any> =>
    instance({
      method: "DELETE",
      url: `/api/announcement/delete/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
};

const DashboardSiswa = {
  getAllOverView: (
    token: string | null,
    classId: string | null,
    page: number | null,
    limit: number | null,
    withAssign: string = "N"
  ): AxiosPromise<any> =>
    instance({
      method: "GET",
      url: `/api/overview?search_query=&page=${page}&limit=${limit}&class_id=${classId}&with_assign=${withAssign}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  getByIdOverView: (
    token: string | null,
    id: string | null
  ): AxiosPromise<any> =>
    instance({
      method: "GET",
      url: `/api/overview/show/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  createOverview: (token: string | null, data: any): AxiosPromise<any> =>
    instance({
      method: "POST",
      url: `/api/overview/create`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data,
    }),

  UpdateOverview: (
    token: string | null,
    id: string | number | null,
    data: any
  ): AxiosPromise<any> =>
    instance({
      method: "PUT",
      url: `/api/overview/update/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data,
    }),
  DeleteOverview: (
    token: string | null,
    id: string | null
  ): AxiosPromise<any> =>
    instance({
      method: "DELETE",
      url: `/api/overview/delete/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
};

const KepribadianSiswa = {
  add: (token: string | null, data: any) =>
    instance({
      method: "POST",
      url: "/api/student-personality/create",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data,
    }),
  showAll: (
    token: string | null,
    search?: string,
    page: number = 0,
    limit: number = 10
  ): AxiosPromise<any> =>
    instance({
      method: "GET",
      url: `/api/student-personality?search_query=${search}&page=${page}&limit=${limit}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  update: (
    token: string | null,
    id: string | number | null,
    data: any
  ): AxiosPromise<any> =>
    instance({
      method: "PUT",
      url: "/api/student-personality/update/" + id,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data,
    }),
  delete: (
    token: string | null,
    id: string | number | null
  ): AxiosPromise<any> =>
    instance({
      method: "DELETE",
      url: "/api/student-personality/delete/" + id,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
};

const PosPembayaran = {
  create: (token: string | null, data: any) =>
    instance({
      method: "POST",
      url: "/api/payment-post/create",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data,
    }),
  showAll: (
    token: string | null,
    search?: string,
    page: number = 0,
    limit: number = 10
  ): AxiosPromise<any> =>
    instance({
      method: "GET",
      url: `/api/payment-post?search_query=${search}&page=${page}&limit=${limit}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  showOne: (token: string | null, id: string | null): AxiosPromise<any> =>
    instance({
      method: "GET",
      url: `/api/payment-post/show/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  update: (
    token: string | null,
    id: string | number | null,
    data: any
  ): AxiosPromise<any> =>
    instance({
      method: "PUT",
      url: "/api/payment-post/update/" + id,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data,
    }),
  delete: (
    token: string | null,
    id: string | number | null
  ): AxiosPromise<any> =>
    instance({
      method: "DELETE",
      url: "/api/payment-post/delete/" + id,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
};

const Kepribadian = {
  showAll: (
    token: string | null,
    search: string = "",
    page: number = 0,
    limit: number = 10
  ): AxiosPromise<any> =>
    instance({
      method: "GET",
      url: `/api/personality?search_query=${search}&page=${page}&limit=${limit}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
};

const PosJenisPembayaran = {
  create: (token: string | null, data: any) =>
    instance({
      method: "POST",
      url: "/api/student-payment-bills/create",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data,
    }),
  bulkCreate: (token: string | null, data: any) =>
    instance({
      method: "POST",
      url: "/api/student-payment-bills/bulk-create",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data,
    }),
  showAll: (
    token: string | null,
    search?: string,
    paymentPostId?: string | null,
    academicYear?: string | null,
    page: number = 0,
    limit: number = 10
  ): AxiosPromise<any> =>
    instance({
      method: "GET",
      url: `/api/student-payment-bills?search_query=${search}&payment_post_id=${paymentPostId}&academic_year=${academicYear}&page=${page}&limit=${limit}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  showOne: (token: string | null, id: string | null): AxiosPromise<any> =>
    instance({
      method: "GET",
      url: `/api/student-payment-bills/get-by-id/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  update: (
    token: string | null,
    id: string | number | null,
    data: any
  ): AxiosPromise<any> =>
    instance({
      method: "PUT",
      url: "/api/student-payment-bills/update/" + id,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data,
    }),
  delete: (
    token: string | null,
    id: string | number | null
  ): AxiosPromise<any> =>
    instance({
      method: "DELETE",
      url: "/api/student-payment-bills/delete/" + id,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
};

const TagihanSiswa = {
  create: (token: string | null, data: any) =>
    instance({
      method: "POST",
      url: "/api/student-bills/create",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data,
    }),
  bulkCreate: (token: string | null, data: any) =>
    instance({
      method: "POST",
      url: "/api/student-bills/bulk-create",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data,
    }),
  showAll: (
    token: string | null,
    search?: string,
    billId?: string,
    classId?: string,
    page: number = 0,
    limit: number = 10
  ): AxiosPromise<any> =>
    instance({
      method: "GET",
      url: `/api/student-bills?search_query=${search}&bill_id=${billId}&class_id=${classId}&page=${page}&limit=${limit}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  showAllReports: (
    token: string | null,
    paymentCatId?: string,
    classId?: string,
    studentId?: string,
    startPaid?: string,
    endPaid?: string,
    status?: string,
    page: number = 0,
    limit: number = 10
  ): AxiosPromise<any> =>
    instance({
      method: "GET",
      url: `/api/student-payment-report?payment_category_id=${paymentCatId}&class_id=${classId}&student_id=${studentId}&start_paid=${startPaid}&end_paid=${endPaid}&status=${status}&page=${page}&limit=${limit}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  exportReports: (
    token: string | null,
    paymentCatId?: string,
    classId?: string,
    studentId?: string,
    startPaid?: string,
    endPaid?: string,
    status?: string
  ): AxiosPromise<any> =>
    instance({
      method: "GET",
      url: `/api/student-payment-report/export-all?payment_category_id=${paymentCatId}&class_id=${classId}&student_id=${studentId}&start_paid=${startPaid}&end_paid=${endPaid}&status=${status}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: "blob",
    }),
  showAllArrears: (
    token: string | null,
    search?: string,
    classId?: string,
    page: number = 0,
    limit: number = 10
  ): AxiosPromise<any> =>
    instance({
      method: "GET",
      url: `/api/student-arrears?search_query=${search}&class_id=${classId}&page=${page}&limit=${limit}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  exportArrears: (
    token: string | null,
    search?: string,
    classId?: string
  ): AxiosPromise<any> =>
    instance({
      method: "GET",
      url: `/api/student-arrears/export-all?search_query=${search}&class_id=${classId}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: "blob",
    }),
  showByStudentId: (
    token: string | null,
    studentId?: string | null
  ): AxiosPromise<any> =>
    instance({
      method: "GET",
      url: `/api/student-bills/get-by-student-id/${studentId}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  showOne: (token: string | null, id: string | null): AxiosPromise<any> =>
    instance({
      method: "GET",
      url: `/api/student-bills/get-by-id/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  update: (
    token: string | null,
    id: string | number | null,
    data: any
  ): AxiosPromise<any> =>
    instance({
      method: "PUT",
      url: "/api/student-bills/update/" + id,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data,
    }),
  confirmEvidence: (
    token: string | null,
    id: string | number | null
  ): AxiosPromise<any> =>
    instance({
      method: "PUT",
      url: "/api/student-bills/confirm-evidence/" + id,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  delete: (
    token: string | null,
    id: string | number | null
  ): AxiosPromise<any> =>
    instance({
      method: "DELETE",
      url: "/api/student-bills/delete/" + id,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
};

const ForCountryDetail = {
  showAll: (
    token: string | null,
    search?: string,
    page: number = 0,
    limit: number = 10,
    withAssign: string = "N"
  ): AxiosPromise<any> =>
    instance({
      method: "GET",
      url: `/api/for-country-detail?search_query=${search}&page=${page}&limit=${limit}&with_assign=${withAssign}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  showOne: (token: string | null, id: string | null): AxiosPromise<any> =>
    instance({
      method: "GET",
      url: `/api/for-country-detail/show/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  update: (
    token: string | null,
    id: string | number | null,
    data: any
  ): AxiosPromise<any> =>
    instance({
      method: "PUT",
      url: "/api/for-country-detail/update/" + id,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data,
    }),
  delete: (
    token: string | null,
    id: string | number | null
  ): AxiosPromise<any> =>
    instance({
      method: "DELETE",
      url: "/api/for-country-detail/delete/" + id,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  uploadCertificate: (
    token: string | null,
    id: string | number | null,
    data: any
  ): AxiosPromise<any> =>
    instance({
      method: "PUT",
      url: "/api/for-country-detail/update/" + id,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
      data,
    }),
  downloadCertificate: (
    token: string | null,
    path: string | null
  ): AxiosPromise<any> =>
    instance({
      method: "GET",
      url: `/api/for-country-detail/download?filepath=${path}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: "blob",
    }),
};

const DashboardKeuangan = {
  getCards: (token: string | null): AxiosPromise<any> =>
    instance({
      method: "GET",
      url: `api/dashboard/admin-keuangan`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  getChart: (
    token: string | null,
    startDate: string,
    endDate: string,
    postPaymentId: string
  ): AxiosPromise<any> =>
    instance({
      method: "GET",
      url: `api/dashboard/admin-keuangan-chart?start_date=${startDate}&end_date=${endDate}&post_payment_id=${postPaymentId}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
};

const CustomerCare = {
  GetAllUserChat: (
    token: string | null,
    id: string | null
  ): AxiosPromise<any> =>
    instance({
      method: "GET",
      url: `/api/user-chat/show-by-user/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  GetMessage: (
    token: string | null,
    id: string | null,
    withId: number
  ): AxiosPromise<any> =>
    instance({
      method: "GET",
      url: `/api/user-chat/show-conversation?userid=${id}&withid=${withId}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  GetUserToChat: (token: string | null): AxiosPromise<any> =>
    instance({
      method: "GET",
      url: `/api/user?limit=10000`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  GetUserToChatGuru: (token: string | null): AxiosPromise<any> =>
    instance({
      method: "GET",
      url: `/api/user-chat/show-by-guru`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  PostMessage: (token: string | null, data: any): AxiosPromise<any> =>
    instance({
      method: "POST",
      url: `/api/message/create`,
      data,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
};

const AchievementSiswa = {
  create: (token: string | null, data: any) =>
    instance({
      method: "POST",
      url: "/api/achievement/create",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data,
    }),
  showAll: (
    token: string | null,
    search?: string,
    classId?: string,
    page: number = 0,
    limit: number = 10,
    withAssign: string = "N"
  ): AxiosPromise<any> =>
    instance({
      method: "GET",
      url: `/api/achievement?search_query=${search}&class_id=${classId}&with_assign=${withAssign}&page=${page}&limit=${limit}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  showOne: (token: string | null, id: string | null): AxiosPromise<any> =>
    instance({
      method: "GET",
      url: `/api/achievement/show/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  update: (
    token: string | null,
    id: string | number | null,
    data: any
  ): AxiosPromise<any> =>
    instance({
      method: "PUT",
      url: "/api/achievement/update/" + id,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data,
    }),
  delete: (
    token: string | null,
    id: string | number | null
  ): AxiosPromise<any> =>
    instance({
      method: "DELETE",
      url: "/api/achievement/delete/" + id,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  downloadCertificate: (
    token: string | null,
    path: string | null
  ): AxiosPromise<any> =>
    instance({
      method: "GET",
      url: `/api/achievement/download?filepath=${path}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: "blob",
    }),
};

const Year = {
  getYear: (
    token: string | null,
    querysearch: string,
    limit: number,
    page: number
  ): AxiosPromise<any> =>
    instance({
      method: "GET",
      url: `/api/academic-year`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        search_query: querysearch,
        limit: limit,
        page: page,
      },
    }),
};

export {
  Auth,
  Task,
  Year,
  Kalender,
  Student,
  Raport,
  Pengumuman,
  DashboardSiswa,
  KepribadianSiswa,
  Kepribadian,
  Class,
  PosPembayaran,
  PosJenisPembayaran,
  TagihanSiswa,
  ForCountryDetail,
  DashboardKeuangan,
  CustomerCare,
  AchievementSiswa,
};
