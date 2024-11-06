import React, { useEffect, useRef, useState } from "react";

import { useFormik } from "formik";
import "react-day-picker/dist/style.css";
import {
  FaCalendar,
  FaFileUpload,
  FaRegFileAlt,
  FaSearch,
  FaTrash,
} from "react-icons/fa";
import { IoDocumentTextOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import * as Yup from "yup";
import { Input, Select, Textarea } from "../../component/Input";
import Modal, { closeModal, openModal } from "../../component/modal";
import {
  IpageMeta,
  PaginationControl,
} from "../../component/PaginationControl";
import { ForCountryDetail } from "../../middleware/api";
import { globalStore } from "../../store/Store";
import { formatTime } from "../../utils/date";

type TformNav = "data" | "schedule" | "certificate" | "profile";

interface IscheduleDate {
  date?: string;
  start?: string;
  end?: string;
}

const activities = [
  "Library",
  "Green House",
  "Green Lab",
  "Little Pond",
  "Little Farm",
  "Waste Bank",
  "Guru Tamu",
  "Display Kelas",
  "Lainnya",
];

const statuses = ["Menunggu Pelaksanaan", "Dalam Pelaksanaan", "Selesai"];

const editDetailSchema = Yup.object().shape({
  activity: Yup.string()
    .oneOf(activities, "Pilihan aktivitas tidak sesuai")
    .required("Aktivitas tidak boleh kosong"),
  activity_extra: Yup.string().when("activity", {
    is: (val: any) => val == "Lainnya",
    then: () => Yup.string().required("Aktivitas lainnya tidak boleh kosong"),
    otherwise: () => Yup.string().optional(),
  }),
  remark: Yup.string(),
  duration: Yup.number().moreThan(
    0,
    "Durasi harus lebih atau sama dengan 1 jam"
  ),
  status: Yup.string()
    .oneOf(statuses, "Pilihan status tidak sesuai")
    .required("Status tidak boleh kosong"),
});

const scheduleDateSchema = Yup.object().shape({
  date: Yup.string().required("Tanggal tidak boleh kosong"),
  start: Yup.string().required("Jam mulai tidak boleh kosong"),
  end: Yup.string().required("Jam selesai tidak boleh kosong"),
});

const ODFYC = () => {
  const { academicYear } = globalStore(),
    modalDetailEdit = "form-detail-edit";

  // main
  const [dataList, setDataList] = useState<any[]>([]);
  const [pageMeta, setPageMeta] = useState<IpageMeta>({ page: 0, limit: 10 });
  const [search, setSearch] = useState<string>("");
  const [filter, setFilter] = useState({
    search: "",
    page: 0,
    limit: 10,
  });

  const handleFilter = (key: string, value: any) => {
    const obj = {
      ...filter,
      [key]: value,
    };
    if (key != "page") obj["page"] = 0;
    setFilter(obj);
  };

  const getDataList = async () => {
    try {
      const res = await ForCountryDetail.showAll(
        "",
        academicYear,
        filter.page,
        filter.limit,
        "Y"
      );

      const { result, ...meta } = res.data.data;

      setDataList(result);
      setPageMeta(meta);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Gagal Mengambil data ODYFC, silakan refresh halaman!",
      });
    }
  };

  useEffect(() => {
    getDataList();
  }, []);

  const dataFilter = search
    ? dataList.filter(
        (item) =>
          item.forcountry.user.full_name
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          item.activity.toLowerCase().includes(search.toLowerCase()) ||
          item.forcountry.academic_year
            .toLowerCase()
            .includes(search.toLowerCase())
      )
    : dataList;

  useEffect(() => {
    getDataList();
  }, [filter, academicYear, search]);

  // handle detail edit
  const [formNav, setFormNav] = useState<TformNav>("data");
  const [dataDetail, setDataDetail] = useState<any>({});

  const detailForm = useFormik({
    initialValues: {
      activity: "",
      activity_extra: "",
      remark: "",
      duration: 1,
      status: "",
    },
    validateOnChange: false,
    validationSchema: editDetailSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);

      const copyValues: any = { ...values };
      if (copyValues.activity == "Lainnya")
        copyValues.activity = copyValues.activity_extra;
      delete copyValues.activity_extra;

      try {
        await ForCountryDetail.update(dataDetail.id, copyValues);

        setDataDetail({});
        getDataList();

        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Berhasil memperbarui data detail One Day For Your Country",
        });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Gagal memperbarui data detail One Day For Your Country",
        });
      } finally {
        closeModal(modalDetailEdit);
        setSubmitting(false);
      }
    },
  });

  const [isLoadingDetailEdit, setIsLoadingDetailEdit] = useState(false);
  const getDataDetail = async (id: any, nav: TformNav = "data") => {
    setSchedulesDatesError([]);
    setFormNav(nav);
    setIsLoadingDetailEdit(true);

    try {
      const res = await ForCountryDetail.showOne(id),
        data = res.data.data;

      detailForm.setValues({
        activity: data.activity
          ? !activities.includes(data.activity)
            ? "Lainnya"
            : data.activity
          : "",
        activity_extra: !activities.includes(data.activity)
          ? data.activity
          : "",
        remark: data.remark ?? "",
        duration: data.duration ?? 0,
        status: data.status ?? "",
      });
      setDataDetail(data);

      openModal(modalDetailEdit);
    } catch {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Gagal Mengambil data detail ODYFC",
      });
    } finally {
      setIsLoadingDetailEdit(false);
    }
  };

  // handle atur jadwal
  const [scheduleDates, setScheduleDates] = useState<IscheduleDate[]>([{}]);
  const [schedulesDatesError, setSchedulesDatesError] = useState<
    IscheduleDate[]
  >([]);
  const [isLoadingSetSchedule, setIsLoadingSetSchedule] = useState(false);

  const handleSaveSchedule = async () => {
    setIsLoadingSetSchedule(true);
    setSchedulesDatesError([]);

    // validation
    let isValidError = false;
    const validErrors = [];
    for (let i = 0; i < scheduleDates.length; i++) {
      try {
        await scheduleDateSchema.validate(scheduleDates[i], {
          abortEarly: false,
        });
        validErrors.push({});
      } catch (err: any) {
        const obj: any = {};
        err.inner.forEach((e: any) => {
          obj[e.path] = e.message;
        });
        isValidError = true;
        validErrors.push(obj);
      }
    }

    setSchedulesDatesError(validErrors);
    if (isValidError) {
      setIsLoadingSetSchedule(false);
      return;
    }

    try {
      await ForCountryDetail.update(dataDetail.id, {
        plan_date: JSON.stringify(scheduleDates),
      });

      setDataDetail({});
      getDataList();

      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Berhasil memperbarui data jadwal One Day For Your Country",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Gagal memperbarui data jadwal One Day For Your Country",
      });
    } finally {
      closeModal(modalDetailEdit);
      setIsLoadingSetSchedule(false);
    }
  };

  const handleChangeSchedule = (i: number, key: any, val: string) => {
    setScheduleDates([
      ...scheduleDates.map((dat, id) =>
        id == i
          ? {
              ...dat,
              [key]: val,
            }
          : dat
      ),
    ]);
  };

  const handleDeleteSchedule = (i: number) => {
    setSchedulesDatesError([]);
    setScheduleDates([...scheduleDates.filter((_, id) => id !== i)]);
  };

  const handleAddSchedule = () => {
    setSchedulesDatesError([]);
    setScheduleDates([...scheduleDates, {}]);
  };

  const renderDatesOnTable = (dat: any) => {
    const dates = JSON.parse(dat.plan_date ?? "[]");
    if (!Array.isArray(dates)) return <></>;

    return dates.map((d: any, i: any) => (
      <div
        key={i}
        className="badge tooltip cursor-default badge-secondary"
        data-tip={`${d.start} - ${d.end}`}
      >
        {formatTime(d.date, "DD MMMM YYYY")}
      </div>
    ));
  };

  useEffect(() => {
    if (!Object.keys(dataDetail).length) setScheduleDates([{}]);
    else {
      try {
        const dates = JSON.parse(dataDetail.plan_date ?? "[]");
        if (Array.isArray(dates)) setScheduleDates(dates);
      } catch {}
    }
  }, [dataDetail]);

  // handle delete
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  const handleDelete = async (id: any, full_name?: any) => {
    setIsLoadingDelete(true);

    Swal.fire({
      icon: "question",
      title: "Anda Yakin?",
      text: `Aksi ini akan menghapus data One Day For Your Country ${full_name ?? ""}`,
      showCancelButton: true,
      confirmButtonText: "Yakin",
      cancelButtonText: "Batalkan",
    }).then(async (result) => {
      try {
        if (result.isConfirmed) {
          await ForCountryDetail.delete(id);

          Swal.fire({
            icon: "success",
            title: "Berhasil",
            text: "Berhasil menghapus data One Day For Your Country",
          });

          getDataList();
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Gagal menghapus data One Day For Your Country",
        });
      } finally {
        setIsLoadingDelete(false);
      }
    });
  };

  // hanlde upload certiface
  const [certFile, setCertFile] = useState<File | null>(null),
    [certFilePreview, setCertFilePreview] = useState(""),
    [isLoadingUpCertificate, setIsLoadingUpCertificate] = useState(false),
    refInputCert = useRef<HTMLInputElement>(null);

  const handleCertFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCertFile(file);
      setCertFilePreview(URL.createObjectURL(file));
    }
  };

  const handleUploadCertificate = async () => {
    if (!certFile || !(certFile instanceof File)) return;

    setIsLoadingUpCertificate(true);
    try {
      const formData = new FormData();
      formData.append("file", certFile);

      await ForCountryDetail.uploadCertificate(dataDetail.id, formData);

      setDataDetail({});
      setCertFile(null);
      setCertFilePreview("");
      getDataList();
      if (refInputCert.current) refInputCert.current.value = "";

      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Berhasil mengunggah sertifikat",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Gagal mengunggah sertifikat",
      });
    } finally {
      closeModal(modalDetailEdit);
      setIsLoadingUpCertificate(false);
    }
  };

  const handleDowloadCertificate = async () => {
    if (!dataDetail.certificate_path) return;

    try {
      const response = await ForCountryDetail.downloadCertificate(
        dataDetail.certificate_path
      );
      const blob = new Blob([response.data], { type: "application/pdf" }); //
      setCertFilePreview(URL.createObjectURL(blob));
    } catch (error) {}
  };

  useEffect(() => {
    if (!Object.keys(dataDetail).length) {
      setCertFile(null);
      setCertFilePreview("");
    }
    handleDowloadCertificate();
  }, [dataDetail]);

  return (
    <>
      <div className="w-full p-3">
        <div className="flex w-full flex-col justify-center items-center p-3">
          <span className="font-bold text-xl">ONE DAY FOR YOUR COUNTRY</span>
        </div>
        <div className="w-full bg-white p-3 rounded-md">
          {/* filter bar  */}
          <div className="w-full flex justify-end my-3 gap-2">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleFilter("search", search);
              }}
            >
              <label className="input input-md input-bordered flex items-center gap-2">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="grow"
                  placeholder="Cari..."
                />
                <FaSearch />
              </label>
            </form>
            <div className="flex gap-2">
              <Link
                to={"/guru/one-day-partisipan"}
                className="btn btn-ghost bg-blue-500 btn-md text-white "
              >
                Partisipan
              </Link>
              {/* <button className="btn btn-ghost bg-blue-500 btn-sm text-white ">
                <FaPlus />
                Tambah
              </button> */}
            </div>
          </div>

          {/* data list  */}
          <div className="overflow-x-auto w-full">
            <table className="table table-zebra">
              {/* head */}
              <thead className="bg-blue-400">
                <tr>
                  <th>No</th>
                  <th>Nama</th>
                  <th>Aktivitas</th>
                  <th>Tahun Pelajaran</th>
                  <th>Tanggal Pelaksanaan</th>
                  <th>Durasi</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {dataFilter.map((dat, i) => (
                  <tr key={i}>
                    <th>
                      {i + 1 + (pageMeta?.page ?? 0) * (pageMeta?.limit ?? 0)}
                    </th>
                    <td>{dat.forcountry?.user?.full_name ?? "-"}</td>
                    <td>{dat.activity ?? "-"}</td>
                    <td>{dat.forcountry?.academic_year ?? "-"}</td>
                    <td>
                      <div className="flex flex-wrap gap-2 max-w-72">
                        {dat.plan_date ? renderDatesOnTable(dat) : "-"}
                      </div>
                    </td>
                    <td>{dat.duration ?? "-"}</td>
                    <td>{dat.status ?? "-"}</td>
                    <td>
                      <div className="join">
                        <button
                          className="join-item tooltip btn btn-primary btn-sm text-md"
                          data-tip="Detail"
                          disabled={isLoadingDetailEdit}
                          onClick={() => getDataDetail(dat.id, "data")}
                        >
                          <FaRegFileAlt />
                        </button>
                        <button
                          className="join-item tooltip btn btn-secondary text-white btn-sm text-md"
                          data-tip="Atur jadwal"
                          disabled={dat.is_date_approved}
                          onClick={() => getDataDetail(dat.id, "schedule")}
                        >
                          <FaCalendar />
                        </button>
                        <button
                          className="join-item tooltip btn btn-accent text-white btn-sm text-md"
                          data-tip="Unggah sertifikat"
                          disabled={
                            dat.status?.toLowerCase() != "selesai" ||
                            dat.certificate_path
                          }
                          onClick={() => getDataDetail(dat.id, "certificate")}
                        >
                          <FaFileUpload />
                        </button>
                        <button
                          className="join-item tooltip btn btn-error text-white btn-sm text-md"
                          data-tip="Hapus"
                          disabled={isLoadingDelete}
                          onClick={() =>
                            handleDelete(dat.id, dat.forcountry.user.full_name)
                          }
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <PaginationControl
            meta={pageMeta}
            onPrevClick={() => handleFilter("page", pageMeta.page - 1)}
            onNextClick={() => handleFilter("page", pageMeta.page + 1)}
            onJumpPageClick={(val) => handleFilter("page", val)}
            onLimitChange={(val) => handleFilter("limit", val)}
          />
        </div>
      </div>

      <Modal
        id={modalDetailEdit}
        width="w-11/12 max-w-2xl"
        onClose={() => detailForm.resetForm()}
      >
        <h4 className="text-xl font-bold mb-6">Detail</h4>

        <div role="tablist" className="tabs tabs-lifted">
          <input
            type="radio"
            name="tabs_detail_odyfc"
            role="tab"
            className="tab"
            aria-label="Data"
            checked={formNav == "data"}
            onClick={() => setFormNav("data")}
          />
          <div
            role="tabpanel"
            className="tab-content border-base-300 rounded-box p-6"
          >
            <form onSubmit={detailForm.handleSubmit}>
              <Select
                label="Aktivitas"
                name="activity"
                options={activities}
                value={detailForm.values.activity}
                onChange={detailForm.handleChange}
                errorMessage={detailForm.errors.activity}
              />

              {detailForm.values.activity == "Lainnya" && (
                <Input
                  label="Aktivitas lainnya"
                  name="activity_extra"
                  value={detailForm.values.activity_extra}
                  onChange={detailForm.handleChange}
                  errorMessage={detailForm.errors.activity_extra}
                />
              )}

              <Textarea
                label="Keterangan"
                name="remark"
                value={detailForm.values.remark}
                onChange={detailForm.handleChange}
                errorMessage={detailForm.errors.remark}
              />

              <Input
                label="Durasi"
                type="number"
                name="duration"
                value={detailForm.values.duration}
                onChange={detailForm.handleChange}
                errorMessage={detailForm.errors.duration}
              />

              <Select
                label="Status"
                name="status"
                options={statuses}
                value={detailForm.values.status}
                onChange={detailForm.handleChange}
                errorMessage={detailForm.errors.status}
              />

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={detailForm.isSubmitting}
                >
                  {detailForm.isSubmitting ? (
                    <span className="loading loading-dots loading-md mx-auto"></span>
                  ) : (
                    "Simpan"
                  )}
                </button>
              </div>
            </form>
          </div>

          <input
            type="radio"
            name="tabs_detail_odyfc"
            role="tab"
            className="tab"
            aria-label="Jadwal"
            checked={formNav == "schedule"}
            onClick={() => setFormNav("schedule")}
          />
          <div
            role="tabpanel"
            className="tab-content border-base-300 w-full overflow-x-hidden rounded-box p-6"
          >
            <div className="overflow-x-auto">
              <table className="table table-xs">
                <thead>
                  <tr>
                    <th>Tanggal</th>
                    <th>Jam mulai</th>
                    <th>Jam selesai</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {scheduleDates.map((dat, i) => (
                    <tr key={i}>
                      <td>
                        <Input
                          type="date"
                          value={dat.date ?? ""}
                          onChange={(e) =>
                            handleChangeSchedule(i, "date", e.target.value)
                          }
                          errorMessage={schedulesDatesError[i]?.date ?? ""}
                        />
                      </td>
                      <td>
                        <Input
                          type="time"
                          value={dat.start ?? ""}
                          onChange={(e) =>
                            handleChangeSchedule(i, "start", e.target.value)
                          }
                          errorMessage={schedulesDatesError[i]?.start ?? ""}
                        />
                      </td>
                      <td>
                        <Input
                          type="time"
                          value={dat.end ?? ""}
                          onChange={(e) =>
                            handleChangeSchedule(i, "end", e.target.value)
                          }
                          errorMessage={schedulesDatesError[i]?.end ?? ""}
                        />
                      </td>
                      <td>
                        <button
                          onClick={() => handleDeleteSchedule(i)}
                          type="button"
                          disabled={
                            isLoadingSetSchedule || dataDetail.is_date_approved
                          }
                          className="btn btn-ghost btn-sm text-error"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="overflow-x-auto mb-3"></div>
            <div className="flex items-center gap-3">
              {dataDetail.is_date_approved && (
                <p className="text-xs text-error max-w-96">
                  Tanggal sudah disetujui oleh pelaksana
                </p>
              )}
              <button
                className="btn ms-auto"
                onClick={handleAddSchedule}
                disabled={isLoadingSetSchedule || dataDetail.is_date_approved}
              >
                Tambah
              </button>
              <button
                onClick={handleSaveSchedule}
                className="btn btn-primary"
                disabled={isLoadingSetSchedule || dataDetail.is_date_approved}
              >
                {isLoadingSetSchedule ? (
                  <span className="loading loading-dots loading-md mx-auto"></span>
                ) : (
                  "Simpan"
                )}
              </button>
            </div>
          </div>

          <input
            type="radio"
            name="tabs_detail_odyfc"
            role="tab"
            className="tab"
            aria-label="Sertifikat"
            checked={formNav == "certificate"}
            onClick={() => setFormNav("certificate")}
          />
          <div
            role="tabpanel"
            className="tab-content border-base-300 rounded-box p-6"
          >
            {!certFilePreview ? (
              <div
                className="w-full h-96 rounded-md flex flex-col justify-center items-center border-dashed border-2 border-gray-300"
                onClick={() => refInputCert?.current?.click()}
              >
                <div className="flex gap-3 items-center text-gray-500">
                  <IoDocumentTextOutline size={28} />
                  Fail tidak tersedia
                </div>
              </div>
            ) : (
              <>
                <iframe
                  src={certFilePreview}
                  frameBorder="0"
                  width="100%"
                  height="450px"
                  className="mt-4"
                />
              </>
            )}

            <input
              type="file"
              ref={refInputCert}
              className="file-input file-input-bordered w-full my-3"
              onChange={handleCertFileChange}
              accept=".pdf"
            />

            <button
              onClick={handleUploadCertificate}
              className="btn btn-primary w-full"
              disabled={!certFile || isLoadingUpCertificate}
            >
              {isLoadingUpCertificate ? (
                <span className="loading loading-dots loading-md mx-auto"></span>
              ) : (
                "Simpan"
              )}
            </button>
          </div>

          <input
            type="radio"
            name="tabs_detail_odyfc"
            role="tab"
            className="tab"
            aria-label="Profil"
            checked={formNav == "profile"}
            onClick={() => setFormNav("profile")}
          />
          <div
            role="tabpanel"
            className="tab-content border-base-300 rounded-box p-6"
          >
            <table className="table">
              <tbody>
                {/* row 1 */}
                <tr>
                  <th>Nama</th>
                  <th>:</th>
                  <td>{dataDetail.forcountry?.user?.full_name ?? "-"}</td>
                </tr>
                <tr>
                  <th>Tahun pembelajaran</th>
                  <th>:</th>
                  <td>{dataDetail.forcountry?.academic_year ?? "-"}</td>
                </tr>
                <tr>
                  <th>Target</th>
                  <th>:</th>
                  <td>{dataDetail.forcountry?.target ?? 0} Jam</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ODFYC;
