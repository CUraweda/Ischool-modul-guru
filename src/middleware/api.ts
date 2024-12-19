/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosPromise } from "axios";
import { LoginResponse } from "./Utils";
import { token } from "../utils/common";

const instance = axios.create({
  baseURL: import.meta.env.VITE_REACT_API_URL,
});

instance.interceptors.request.use((config) => {
  const currentToken = localStorage.getItem("token") || token.get();
  if (currentToken) {
    config.headers.Authorization = `Bearer ${currentToken}`;
  }
  return config;
});

const Auth = {
  Login: async (
    email: string | null,
    password: string | null
  ): AxiosPromise<LoginResponse> =>
    instance({
      method: "POST",
      url: "/auth/login",
      data: { email, password },
    }),

  MeData: () =>
    instance({
      method: "GET",
      url: "/user/me",
    }),
  EditProfile: (id: any, data: any) =>
    instance({
      method: "PUT",
      url: `/employee/update/${id}`,
      data,
    }),
  EditPassword: (data: any) =>
    instance({
      method: "PUT",
      url: `/user/change-password`,
      data,
    }),
  EditPicture: (id: any, data: any) =>
    instance({
      method: "PUT",
      url: `/auth/update-profile/${id}`,
      data,
    }),
  AddSignature: (data: any) =>
    instance({
      method: `POST`,
      url: `/employee-signature/add-mine`,
      data,
    }),
  UpdateSignature: (id: any, data: any) =>
    instance({
      method: `POST`,
      url: `/employee-signature/update/${id}`,
      data,
    }),
  DataClass: () =>
    instance({
      method: `GET`,
      url: `/classes?limit=1000`,
    }),
};

const User = {
  showAll: (search: string | null) =>
    instance({
      method: "GET",
      url: `/user?search_query=${search}`,
    }),
};

const Student = {
  GetStudentByClass: (id: string | null, tahun: string | null) =>
    instance({
      method: "GET",
      url: `/student-class/show-by-class/${id}?academic=${tahun}`,
    }),

  GetStudentByLevel: (level: string | null, tahun: string | null) =>
    instance({
      method: "GET",
      url: `/student-class/show-by-level/${level}?academic=${tahun}`,
    }),

  GetStudents: (
    search: string | null,
    class_id: string | null,
    tahun: string | null,
    page: number | null,
    limit: number | null
  ) =>
    instance({
      method: "GET",
      url: `/student-class?search_query=${search}&academic=${tahun}&class_id=${class_id}&page=${page}&limit=${limit}`,
    }),

  CreatePresensi: (data: any) =>
    instance({
      method: "POST",
      url: "/student-attendance/create",
      data,
    }),
  UpdatePresensi: (id: string, data: any) =>
    instance({
      method: "PUT",
      url: `/student-attendance/update/${id}`,
      data,
    }),
  showAllPresensi: (
    search: string | null,
    page: number | null,
    limit: number | null,
    classId: string | null,
    attDate: string | null,
    academic: string | null,
    withAssign: string | null = "N"
  ) =>
    instance({
      method: "GET",
      url: `/student-attendance?academic=${academic}&search_query=${search}&page=${page}&limit=${limit}&class_id=${classId}&att_date=${attDate}&with_assign=${withAssign}`,
    }),
  GetPresensiByClassDate: (id: number | null, date: string | null) =>
    instance({
      method: "GET",
      url: `/student-attendance/show-by-class/${id}?att_date=${date}`,
    }),
  GetPresensiById: (id: number | null) =>
    instance({
      method: "GET",
      url: `/student-attendance/show/${id}`,
    }),

  deletePresensi: (id: number | null) =>
    instance({
      method: "DELETE",
      url: `/student-attendance/delete/${id}`,
    }),
};

const Mapel = {
  GetAllDataMapel: (page: number, limit: number) =>
    instance({
      method: "GET",
      url: `/subject?search_query=&page=${page}&limit=${limit}`,
    }),
};

const Class = {
  showAll: (
    page: number | null,
    limit: number | null,
    withAssign: string | null = "N",
    withSubject: string = "Y",
    withFormClass: string = "Y"
  ) =>
    instance({
      method: "GET",
      url: `/classes?search_query=&page=${page}&limit=${limit}&with_assign=${withAssign}&with_subject=${withSubject}&with_form_class=${withFormClass}`,
    }),
};

const Task = {
  GetAll: (
    search: string | null,
    classId: string | null,
    academic: string | null,
    page: number | null,
    limit: number | null,
    withAssign: string = "N"
  ) =>
    instance({
      method: "GET",
      url: `/student-task?academic=${academic}&search_query=${search}&page=${page}&limit=${limit}&class_id=${classId}&with_assign=${withAssign}`,
    }),
  GetAllTask: (
    search: string | null,
    classId: string | null,
    page: number | null,
    limit: number | null,
    withAssign: string = "N"
  ) =>
    instance({
      method: "GET",
      url: `/task?search_query=${search}&page=${page}&limit=${limit}&class_id=${classId}&with_assign=${withAssign}`,
    }),
  GetAllClass: (
    page: number | null,
    limit: number | null,
    withAssign: string | null = "N",
    // is_active: string | null = "Y",
    withSubject: string = "Y",
    withFormClass: string = "Y"
  ) =>
    instance({
      method: "GET",
      url: `/classes?search_query=&page=${page}&limit=${limit}&with_assign=${withAssign}&with_subject=${withSubject}&with_form_class=${withFormClass}&is_active=Y`,
    }),
  GetAllMapel: (
    page: number | null,
    withAssign: string | null = "Y",
    limit: number | null
  ) =>
    instance({
      method: "GET",
      url: `/subject?search_query=&page=${page}&limit=${limit}&with_assign=${withAssign}`,
    }),
  createTask: (data: any) =>
    instance({
      method: "POST",
      url: `/student-task/create`,
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data,
    }),
  editTask: (id: string | null, data: any) =>
    instance({
      method: "PUT",
      url: `/student-task/update/${id}`,
      data,
    }),
  editTaskClass: (id: string | null, data: any) =>
    instance({
      method: "PUT",
      url: `/task/update/${id}`,
      data,
    }),
  editTaskDetail: (id: string | null, data: any) =>
    instance({
      method: "PUT",
      url: `/task-detail/update/${id}`,
      data,
    }),
  createTaskClass: (data: any) =>
    instance({
      method: "POST",
      url: `/task/create`,
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data,
    }),

  deleteTask: (id: number | null) =>
    instance({
      method: "DELETE",
      url: `/student-task/delete/${id}`,
    }),
  deleteTaskClass: (id: number | null) =>
    instance({
      method: "DELETE",
      url: `/task/delete/${id}`,
    }),

  getDetailTask: (id: number | null) =>
    instance({
      method: "GET",
      url: `/task-detail/show-by-task/${id}`,
    }),
  getTaskById: (id: string | null) =>
    instance({
      method: "GET",
      url: `/task/show/${id}`,
    }),
  downloadTugas: (path: string | null) =>
    instance({
      method: "GET",
      url: `/student-task/download?filepath=${path}`,
      responseType: "blob",
    }),
};

const Kalender = {
  GetAllDetail: (
    academic: string | null,
    page: number | null,
    limit: number | null
  ) =>
    instance({
      method: "GET",
      url: `/edu-calendar-detail?academic=${academic}&search_query=&page=${page}&limit=${limit}`,
    }),
  GetAllDetailById: (id: number | null) =>
    instance({
      method: "GET",
      url: `/edu-calendar-detail/show/${id}`,
    }),
  GetAllTopik: (
    academic: string | null,
    page: number | null,
    limit: number | null
  ) =>
    instance({
      method: "GET",
      url: `/edu-calendar?academic=${academic}&search_query=&page=${page}&limit=${limit}`,
    }),

  EditDetail: (id: number | null, data: any) =>
    instance({
      method: "PUT",
      url: `/edu-calendar-detail/update/${id}`,
      data,
    }),
  createDetail: (data: any) =>
    instance({
      method: "POST",
      url: `/edu-calendar-detail/create`,
      data,
    }),
  createTopik: (data: any) =>
    instance({
      method: "POST",
      url: `/edu-calendar/create`,
      data,
    }),

  deleteDetail: (id: number | null) =>
    instance({
      method: "DELETE",
      url: `/edu-calendar-detail/delete/${id}`,
    }),
  deleteTimeTable: (id: number | null) =>
    instance({
      method: "DELETE",
      url: `/timetable/delete/${id}`,
    }),
  GetAllTimetable: (kelas: string | null, semester: string | null) =>
    instance({
      method: "GET",
      url: `/timetable/show-by-class/${kelas}?semester=${semester}&academic=2023/2024`,
    }),
  GetAllTimetableByClass: (
    classId: string | null,
    semester: string | null,
    academic: string,
    withAssign: string = "N"
  ) =>
    instance({
      method: "GET",
      url: `/timetable/show-by-class?semester=${semester}&academic=${academic}&class_id=${classId}&with_assign=${withAssign}`,
    }),

  GetTimetableById: (id: number | null) =>
    instance({
      method: "GET",
      url: `/timetable/show/${id}`,
    }),

  createTimeTable: (data: any) =>
    instance({
      method: "POST",
      url: `/timetable/create`,
      data,
    }),

  duplicateTimetable: (data: any) =>
    instance({
      method: "POST",
      url: `/timetable/duplicate-create`,
      data,
    }),

  EditTimeTable: (id: string | null, data: any) =>
    instance({
      method: "PUT",
      url: `/timetable/update/${id}`,
      data,
    }),

  getByGuru: (id: number) =>
    instance({
      method: "GET",
      url: `/edu-calendar-detail/show-by-teacher/${id}`,
    }),
  createAgenda: (data: any) =>
    instance({
      method: `POST`,
      url: `/edu-calendar-detail/create`,
      data,
    }),
  getListEdu: () =>
    instance({
      method: "GET",
      url: `/edu-calendar/`,
    }),
  updateAgenda: (data: any, id: any) =>
    instance({
      method: `PUT`,
      url: `/edu-calendar-detail/update/${id}`,
      data,
    }),
  deleteAgenda: (id: any) =>
    instance({
      method: `DELETE`,
      url: `/edu-calendar-detail/delete/${id}`,
    }),
};

const Raport = {
  downloadMergeRaport: (id: any) =>
    instance({
      method: "PUT",
      url: `/student-report/merge/${id}`,
    }),

  createStudentRaport: (data: any) =>
    instance({
      method: "POST",
      url: `/student-report/create`,
      data,
    }),

  deleteStudentRaport: (id: any) =>
    instance({
      method: "DELETE",
      url: `/student-report/delete/${id}`,
    }),

  updateStudentReportAccess: (id: string | null) =>
    instance({
      method: "PUT",
      url: `/student-report/update-access/${id}`,
    }),
  getAllStudentReport: (
    id: string | null,
    semester: string | null,
    academic: string | null,
    subject_id: string | null = null
  ) =>
    instance({
      method: "GET",
      url: `/student-report/show-by-class/${id}?semester=${semester}&academic=${academic}
      ${subject_id ? `&subject_id=${subject_id}` : ""}`,
    }),
  showAllStudentReport: (
    classId: string,
    semester: string,
    page: number | null,
    limit: number | null,
    withAssign: string | null = "N",
    academic: string
  ) =>
    instance({
      method: "GET",
      url: `/student-report?search_query=&page=${page}&class_id=${classId}&semester=${semester}&limit=${limit}&with_assign=${withAssign}&academic=${academic}`,
    }),
  // raport angka
  getAllNumberReport: (data: any) =>
    instance({
      method: "GET",
      url: `/number-report/filter-by-params?academic=${data.tahun}&semester=${data.semester}&class_id=${data.class}`,
    }),
  showAllNumberReport: (
    search: string | null,
    classId: string | null,
    academic: string | null,
    semester: string | null,
    subjectId: string | null,
    page: number | null,
    limit: number | null,
    withAssign: string | null = "N"
  ) =>
    instance({
      method: "GET",
      url: `/number-report?search_query=${search}&academic=${academic}&subject_id=${subjectId}&page=${page}&class_id=${classId}&semester=${semester}&limit=${limit}&with_assign=${withAssign}`,
    }),
  getNumberReportByStudent: (id: string | null, smt: string | null) =>
    instance({
      method: "GET",
      url: `/number-report/show-by-student/${id}?semester=${smt}`,
    }),
  generateNumberReport: (
    id: string | null,
    smt: string | null,
    date: string | null
  ) =>
    instance({
      method: "GET",
      url: `/number-report/generate/${id}?semester=${smt}&date=${date}`,
    }),
  getByIdNumberReport: (id: string) =>
    instance({
      method: "GET",
      url: `/number-report/show/${id}`,
    }),
  createNumberRaport: (data: any) =>
    instance({
      method: "POST",
      url: `/number-report/create`,
      data,
    }),

  deleteNumberReport: (id: string) =>
    instance({
      method: "DELETE",
      url: `/number-report/delete/${id}`,
    }),

  editNumberRaport: (id: string, data: any) =>
    instance({
      method: "PUT",
      url: `/number-report/update/${id}`,
      data,
    }),

  // Raport Narasi
  getKategoriNarasi: (id: string | null) =>
    instance({
      method: "GET",
      url: `/narrative-category/show-by-class/${id} `,
    }),
  getDeskripsiNarasi: (id: string | null) =>
    instance({
      method: "GET",
      url: `/narrative-desc/show-by-subcategory/${id}`,
    }),
  createDeskripsi: (data: any) =>
    instance({
      method: "POST",
      url: `/narrative-desc/create`,
      data,
    }),
  createKategori: (data: any) =>
    instance({
      method: "POST",
      url: `/narrative-category/create`,
      data,
    }),
  createKomentarKategori: (data: any) =>
    instance({
      method: "POST",
      url: `/narrative-comment/create`,
      data,
    }),
  updateKomentarKategori: (id: string | null, data: any) =>
    instance({
      method: "PUT",
      url: `/narrative-comment/update/${id}`,
      data,
    }),
  deleteKomentarNarasi: (id: string | null) =>
    instance({
      method: "DELETE",
      url: `/narrative-comment/delete/${id}`,
    }),
  deleteKategoriNarasi: (id: string | null) =>
    instance({
      method: "DELETE",
      url: `/narrative-category/delete/${id}`,
    }),
  deleteSubKategoriNarasi: (id: string | null) =>
    instance({
      method: "DELETE",
      url: `/narrative-sub-category/delete/${id}`,
    }),
  editKategori: (id: string | null, data: any) =>
    instance({
      method: "PUT",
      url: `/narrative-category/update/${id}`,
      data,
    }),
  editSubKategori: (id: string | null, data: any) =>
    instance({
      method: "PUT",
      url: `/narrative-sub-category/update/${id}`,
      data,
    }),
  editReportNarasi: (id: string | null, data: any) =>
    instance({
      method: "PUT",
      url: `/narrative-report/update/${id}`,
      data,
    }),
  deleteNarasi: (id: string | null) =>
    instance({
      method: "DELETE",
      url: `/narrative-report/delete/${id}`,
    }),
  createSubKategori: (data: any) =>
    instance({
      method: "POST",
      url: `/narrative-sub-category/create`,
      data,
    }),
  getSubCategoriNarasi: (id: string | null) =>
    instance({
      method: "GET",
      url: `/narrative-sub-category/show-by-category/${id}`,
    }),
  deleteDeskripsiNarasi: (id: string | null) =>
    instance({
      method: "DELETE",
      url: `/narrative-desc/delete/${id}`,
    }),

  getDataNarasiSiswa: (id: string | null, smt: string | null) =>
    instance({
      method: "GET",
      url: `/narrative-report/show-by-student/${id}?semester=${smt}`,
    }),
  generatePdfNarasi: (
    id: string | null,
    smt: string | null,
    report_id: string | null
  ) =>
    instance({
      method: "GET",
      url: `/narrative-report/generate/${id}?semester=${smt}&report_id=${report_id}`,
    }),
  getKomentarNarasiSiswa: (id: string | null) =>
    instance({
      method: "GET",
      url: `/narrative-comment/show-by-student-report/${id}`,
    }),

  // Raport Portofolio
  getPortofolioByRaport: (id: string | null) =>
    instance({
      method: "GET",
      url: `/portofolio-report/show-all-by-student-report/${id}`,
    }),

  uploadPortofolio: (data: any) =>
    instance({
      method: "POST",
      url: `/portofolio-report/create`,
      data,
    }),

  createKomentar: (id: string | null, data: any) =>
    instance({
      method: "PUT",
      url: `/student-report/update/${id}`,
      data,
    }),
  createRapotNarasi: (data: any) =>
    instance({
      method: "POST",
      url: `/narrative-report/create`,
      data,
    }),

  mergePortofolio: (id: string | null) =>
    instance({
      method: "PUT",
      url: `/portofolio-report/merge/${id}`,
    }),
};

const Pengumuman = {
  createPengumuman: (data: any) =>
    instance({
      method: "POST",
      url: `/announcement/create`,
      data,
    }),
  UpdatePengumuman: (id: string | number | null, data: any) =>
    instance({
      method: "PUT",
      url: `/announcement/update/${id}`,
      data,
    }),

  getAllPengumuman: (
    search: string | null,
    classId: string | null,
    start: string | null,
    end: string | null,
    page: number | null,
    limit: number | null,
    withAssign: string = "N"
  ) =>
    instance({
      method: "GET",
      url: `/announcement?search_query=${search}&class_id=${classId}&start_date=${start}&end_date=${end}&page=${page}&limit=${limit}&with_assign=${withAssign}`,
    }),
  getByIdPengumuman: (id: string | null) =>
    instance({
      method: "GET",
      url: `/announcement/show/${id}`,
    }),
  DeletePengumuman: (id: string | null) =>
    instance({
      method: "DELETE",
      url: `/announcement/delete/${id}`,
    }),
  downloadFile: (id: string) =>
    instance({
      method: "GET",
      url: `/announcement/download/${id}`,
      responseType: "blob",
    }),
};

const DashboardSiswa = {
  getAllOverView: (
    classId: string | null,
    academic: string | null,
    page: number | null,
    limit: number | null,
    withAssign: string = "N"
  ) =>
    instance({
      method: "GET",
      url: `/overview?academic=${academic}&search_query=&page=${page}&limit=${limit}&class_id=${classId}&with_assign=${withAssign}`,
    }),
  getByIdOverView: (id: string | null) =>
    instance({
      method: "GET",
      url: `/overview/show/${id}`,
    }),

  createOverview: (data: any) =>
    instance({
      method: "POST",
      url: `/overview/create`,
      data,
    }),

  UpdateOverview: (id: string | number | null, data: any) =>
    instance({
      method: "PUT",
      url: `/overview/update/${id}`,
      data,
    }),
  DeleteOverview: (id: string | null) =>
    instance({
      method: "DELETE",
      url: `/overview/delete/${id}`,
    }),
};

const KepribadianSiswa = {
  add: (data: any) =>
    instance({
      method: "POST",
      url: "/student-personality/create",
      data,
    }),
  showAll: (search?: string, page: number = 0, limit: number = 10) =>
    instance({
      method: "GET",
      url: `/student-personality?search_query=${search}&page=${page}&limit=${limit}`,
    }),
  update: (id: string | number | null, data: any) =>
    instance({
      method: "PUT",
      url: "/student-personality/update/" + id,
      data,
    }),
  delete: (id: string | number | null) =>
    instance({
      method: "DELETE",
      url: "/student-personality/delete/" + id,
    }),
};

const PosPembayaran = {
  create: (data: any) =>
    instance({
      method: "POST",
      url: "/payment-post/create",
      data,
    }),
  showAll: (search?: string, page: number = 0, limit: number = 10) =>
    instance({
      method: "GET",
      url: `/payment-post?search_query=${search}&page=${page}&limit=${limit}`,
    }),
  showOne: (id: string | null) =>
    instance({
      method: "GET",
      url: `/payment-post/show/${id}`,
    }),
  update: (id: string | number | null, data: any) =>
    instance({
      method: "PUT",
      url: "/payment-post/update/" + id,
      data,
    }),
  delete: (id: string | number | null) =>
    instance({
      method: "DELETE",
      url: "/payment-post/delete/" + id,
    }),
};

const Kepribadian = {
  showAll: (search: string = "", page: number = 0, limit: number = 10) =>
    instance({
      method: "GET",
      url: `/personality?search_query=${search}&page=${page}&limit=${limit}`,
    }),
};

const PosJenisPembayaran = {
  create: (data: any) =>
    instance({
      method: "POST",
      url: "/student-payment-bills/create",
      data,
    }),
  bulkCreate: (data: any) =>
    instance({
      method: "POST",
      url: "/student-payment-bills/bulk-create",
      data,
    }),
  showAll: (
    search?: string,
    paymentPostId?: string | null,
    academicYear?: string | null,
    page: number = 0,
    limit: number = 10
  ) =>
    instance({
      method: "GET",
      url: `/student-payment-bills?search_query=${search}&payment_post_id=${paymentPostId}&academic_year=${academicYear}&page=${page}&limit=${limit}`,
    }),
  showOne: (id: string | null) =>
    instance({
      method: "GET",
      url: `/student-payment-bills/get-by-id/${id}`,
    }),
  update: (id: string | number | null, data: any) =>
    instance({
      method: "PUT",
      url: "/student-payment-bills/update/" + id,
      data,
    }),
  delete: (id: string | number | null) =>
    instance({
      method: "DELETE",
      url: "/student-payment-bills/delete/" + id,
    }),
};

const TagihanSiswa = {
  create: (data: any) =>
    instance({
      method: "POST",
      url: "/student-bills/create",
      data,
    }),
  bulkCreate: (data: any) =>
    instance({
      method: "POST",
      url: "/student-bills/bulk-create",
      data,
    }),
  showAll: (
    search?: string,
    billId?: string,
    classId?: string,
    page: number = 0,
    limit: number = 10
  ) =>
    instance({
      method: "GET",
      url: `/student-bills?search_query=${search}&bill_id=${billId}&class_id=${classId}&page=${page}&limit=${limit}`,
    }),
  showAllReports: (
    paymentCatId?: string,
    classId?: string,
    studentId?: string,
    startPaid?: string,
    endPaid?: string,
    status?: string,
    nisPrefix?: string,
    page: number = 0,
    limit: number = 10
  ) =>
    instance({
      method: "GET",
      url: `/student-payment-report?payment_category_id=${paymentCatId}&class_id=${classId}&student_id=${studentId}&start_paid=${startPaid}&end_paid=${endPaid}&status=${status}&nis_prefix=${nisPrefix}&page=${page}&limit=${limit}`,
    }),
  exportReports: (
    paymentCatId?: string,
    classId?: string,
    studentId?: string,
    startPaid?: string,
    endPaid?: string,
    status?: string,
    nisPrefix?: string
  ) =>
    instance({
      method: "GET",
      url: `/student-payment-report/export-all?payment_category_id=${paymentCatId}&class_id=${classId}&student_id=${studentId}&start_paid=${startPaid}&end_paid=${endPaid}&status=${status}&nis_prefix=${nisPrefix}`,
      responseType: "blob",
    }),
  showAllArrears: (
    search?: string,
    classId?: string,
    page: number = 0,
    limit: number = 10
  ) =>
    instance({
      method: "GET",
      url: `/student-arrears?search_query=${search}&class_id=${classId}&page=${page}&limit=${limit}`,
    }),
  exportArrears: (search?: string, classId?: string) =>
    instance({
      method: "GET",
      url: `/student-arrears/export-all?search_query=${search}&class_id=${classId}`,
      responseType: "blob",
    }),
  showByStudentId: (studentId?: string | null) =>
    instance({
      method: "GET",
      url: `/student-bills/get-by-student-id/${studentId}`,
    }),
  showOne: (id: string | null) =>
    instance({
      method: "GET",
      url: `/student-bills/get-by-id/${id}`,
    }),
  update: (id: string | number | null, data: any) =>
    instance({
      method: "PUT",
      url: "/student-bills/update/" + id,
      data,
    }),
  confirmEvidence: (id: string | number | null) =>
    instance({
      method: "PUT",
      url: "/student-bills/confirm-evidence/" + id,
    }),
  delete: (id: string | number | null) =>
    instance({
      method: "DELETE",
      url: "/student-bills/delete/" + id,
    }),
};

const ForCountryDetail = {
  showAll: (
    search?: string,
    academic?: string | null,
    page: number = 0,
    limit: number = 10,
    withAssign: string = "N"
  ) =>
    instance({
      method: "GET",
      url: `/for-country-detail?academic=${academic}&search_query=${search}&page=${page}&limit=${limit}&with_assign=${withAssign}`,
    }),
  showOne: (id: string | null) =>
    instance({
      method: "GET",
      url: `/for-country-detail/show/${id}`,
    }),
  update: (id: string | number | null, data: any) =>
    instance({
      method: "PUT",
      url: "/for-country-detail/update/" + id,
      data,
    }),
  delete: (id: string | number | null) =>
    instance({
      method: "DELETE",
      url: "/for-country-detail/delete/" + id,
    }),
  uploadCertificate: (id: string | number | null, data: any) =>
    instance({
      method: "PUT",
      url: "/for-country-detail/update/" + id,
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data,
    }),
  downloadCertificate: (path: string | null) =>
    instance({
      method: "GET",
      url: `/for-country-detail/download?filepath=${path}`,
      responseType: "blob",
    }),
};

const DashboardKeuangan = {
  getCards: (startDate: string, endDate: string, postPaymentId: string) =>
    instance({
      method: "GET",
      url: `/dashboard/admin-keuangan?start_date=${startDate}&end_date=${endDate}&post_payment_id=${postPaymentId}`,
    }),
  getChart: (startDate: string, endDate: string, postPaymentId: string) =>
    instance({
      method: "GET",
      url: `/dashboard/admin-keuangan-chart?start_date=${startDate}&end_date=${endDate}&post_payment_id=${postPaymentId}`,
    }),
};

const CustomerCare = {
  GetAllUserChat: (id: string | null) =>
    instance({
      method: "GET",
      url: `/user-chat/show-by-user/${id}`,
    }),

  GetMessage: (id: string | null, withId: number) =>
    instance({
      method: "GET",
      url: `/user-chat/show-conversation?userid=${id}&withid=${withId}`,
    }),

  GetUserToChat: () =>
    instance({
      method: "GET",
      url: `/user?limit=10000`,
    }),

  GetUserToChatGuru: () =>
    instance({
      method: "GET",
      url: `/user-chat/show-by-guru`,
    }),

  PostMessage: (data: any) =>
    instance({
      method: "POST",
      url: `/message/create`,
      data,
    }),
};

const AchievementSiswa = {
  create: (data: any) =>
    instance({
      method: "POST",
      url: "/achievement/create",
      data,
    }),
  showAll: (
    search?: string,
    classId?: string,
    page: number = 0,
    limit: number = 10,
    withAssign: string = "N"
  ) =>
    instance({
      method: "GET",
      url: `/achievement?search_query=${search}&class_id=${classId}&with_assign=${withAssign}&page=${page}&limit=${limit}`,
    }),
  showOne: (id: string | null) =>
    instance({
      method: "GET",
      url: `/achievement/show/${id}`,
    }),
  update: (id: string | number | null, data: any) =>
    instance({
      method: "PUT",
      url: "/achievement/update/" + id,
      data,
    }),
  delete: (id: string | number | null) =>
    instance({
      method: "DELETE",
      url: "/achievement/delete/" + id,
    }),
  downloadCertificate: (path: string | null) =>
    instance({
      method: "GET",
      url: `/achievement/download?filepath=${path}`,
      responseType: "blob",
    }),
};

const ForCountry = {
  create: (data: any) =>
    instance({
      method: "POST",
      url: "/for-country/create-bulk",
      data,
    }),
  showAll: (
    search?: string | null,
    academic?: string | null,
    page: number = 0,
    limit: number = 10
  ) =>
    instance({
      method: "GET",
      url: `/for-country?search_query=${search}&academic=${academic}&page=${page}&limit=${limit}`,
    }),
  showOne: (id: string | null) =>
    instance({
      method: "GET",
      url: `/for-country/show/${id}`,
    }),
  update: (id: string | number | null, data: any) =>
    instance({
      method: "PUT",
      url: "/for-country/update/" + id,
      data,
    }),
  delete: (id: string | number | null) =>
    instance({
      method: "DELETE",
      url: "/for-country/delete/" + id,
    }),
};

const Year = {
  getYear: (querysearch: string, limit: number, page: number) =>
    instance({
      method: "GET",
      url: `/academic-year`,
      params: {
        search_query: querysearch,
        limit: limit,
        page: page,
      },
    }),
};

const FileRaporSiswa = {
  create: (data: any) =>
    instance({
      method: "POST",
      url: "/student-report-file/create",
      data,
    }),
  showAll: (
    page: number = 0,
    limit: number = 10,
    search: string = "",
    studentId: string = "",
    academic: string = "",
    semester: string = "",
    classId: string = "",
    withAssign: string = "Y"
  ) =>
    instance({
      method: "GET",
      url: `/student-report-file?search_query=${search}&student_id=${studentId}&academic=${academic}&semester=${semester}&class_id=${classId}&with_assign=${withAssign}&page=${page}&limit=${limit}`,
    }),
  showOne: (id: string | null) =>
    instance({
      method: "GET",
      url: `/student-report-file/show/${id}`,
    }),
  update: (id: string | number | null, data: any) =>
    instance({
      method: "PUT",
      url: "/student-report-file/update/" + id,
      data,
    }),
  delete: (id: string | number | null) =>
    instance({
      method: "DELETE",
      url: "/student-report-file/delete/" + id,
    }),
  downloadFile: (path: string | null) =>
    instance({
      method: "GET",
      url: `/student-report-file/download?file_path=${path}`,
      responseType: "blob",
    }),
};

const Lesson = {
  getAllData: (page: any, limit: any, search: string) =>
    instance({
      method: "GET",
      url: `/lesson-plan?page=${page}&limit=${limit}&search=${search}`,
    }),

  CreateNewLesson: (data: any) =>
    instance({
      method: "POST",
      url: `/lesson-plan/create`,
      data,
    }),
  UpdateLesson: (data: any, id: string | number) =>
    instance({
      method: "PUT",
      url: `/lesson-plan/update/${id}`,
      data,
    }),
};

export {
  AchievementSiswa,
  Auth,
  Class,
  CustomerCare,
  DashboardKeuangan,
  DashboardSiswa,
  FileRaporSiswa,
  ForCountry,
  ForCountryDetail,
  Kalender,
  Kepribadian,
  KepribadianSiswa,
  Lesson,
  Mapel,
  Pengumuman,
  PosJenisPembayaran,
  PosPembayaran,
  Raport,
  Student,
  TagihanSiswa,
  Task,
  User,
  Year,
};
