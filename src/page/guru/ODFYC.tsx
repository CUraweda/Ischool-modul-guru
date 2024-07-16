import React, { useEffect, useRef, useState } from "react";

import { FaFileUpload, FaRegFileAlt, FaSearch, FaTrash } from "react-icons/fa";
import Modal, { closeModal, openModal } from "../../component/modal";
import { IoDocumentTextOutline } from "react-icons/io5";
import { Store } from "../../store/Store";
import {
  IpageMeta,
  PaginationControl,
} from "../../component/PaginationControl";
import Swal from "sweetalert2";
import { ForCountryDetail } from "../../midleware/api";
import { formatTime } from "../../utils/date";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Input, Select, Textarea } from "../../component/Input";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

const activities = [
  "Library",
  "green house",
  "green lab",
  "little pond",
  "little farm",
  "waste bank",
  "guru tamu",
  "display kelas",
];

const statuses = ["Menunggu Pelaksanaan", "Dalam Pelaksanaan", "Selesai"];

const editDetailSchema = Yup.object().shape({
  activity: Yup.string()
    .oneOf(activities, "Pilihan aktivitas tidak sesuai")
    .required("Aktivitas tidak boleh kosong"),
  remark: Yup.string(),
  duration: Yup.number().moreThan(
    0,
    "Durasi harus lebih atau sama dengan 1 jam"
  ),
  status: Yup.string()
    .oneOf(statuses, "Pilihan status tidak sesuai")
    .required("Status tidak boleh kosong"),
});

const ODFYC = () => {
  const { token } = Store(),
    modalUpSertifikat = "form-upload-sertifikat",
    modalDetailEdit = "form-detail-edit";

  // main
  const [dataList, setDataList] = useState<any[]>([]);
  const [pageMeta, setPageMeta] = useState<IpageMeta>({ page: 0, limit: 10 });
  const [search, setSearch] = useState<string>("");
  const [filter, setFilter] = useState({
    search: "",
    page: 0,
    limit: 0,
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
        token,
        filter.search,
        filter.page,
        filter.limit
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
  }, [filter]);

  // handle detail edit
  const [dataDetail, setDataDetail] = useState<any>({});

  const detailForm = useFormik({
    initialValues: {
      activity: "",
      remark: "",
      duration: 1,
      status: "",
    },
    validateOnChange: false,
    validationSchema: editDetailSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);

      try {
        await ForCountryDetail.update(token, dataDetail.id, values);

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
  const getDataDetail = async (id: any) => {
    setIsLoadingDetailEdit(true);

    try {
      const res = await ForCountryDetail.showOne(token, id),
        data = res.data.data;

      detailForm.setValues({
        activity: data.activity ?? "",
        remark: data.remark ?? "",
        duration: data.duration ?? 0,
        status: data.status ?? "",
      });
      setDataDetail(data);
      setScheduleDates(
        data.plan_date?.split(",").map((d: string) => new Date(d)) ?? []
      );

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
  const [scheduleDates, setScheduleDates] = useState<any[]>([]);
  const [isLoadingSetSchedule, setIsLoadingSetSchedule] = useState(false);

  const handleSetSchedule = async () => {
    setIsLoadingSetSchedule(true);

    const dates = scheduleDates.map((d) => formatTime(d, "YYYY-MM-DD"));

    try {
      await ForCountryDetail.update(token, dataDetail.id, {
        plan_date: dates.join(","),
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

  useEffect(() => {
    if (!Object.keys(dataDetail).length) setScheduleDates([]);
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
          await ForCountryDetail.delete(token, id);

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
  const [fileUrl, setFileUrl] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const newFileUrl = URL.createObjectURL(file);
      setFileUrl(newFileUrl);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <div className="w-full p-3">
        <div className="flex w-full flex-col justify-center items-center p-3">
          <span className="font-bold text-xl">ONE DAY FOR YOUR COUNTRY</span>
        </div>
        <div className="w-full bg-white p-3 rounded-md">
          {/* filter bar  */}
          <div className="w-full flex justify-end my-3 gap-2">
            {/* search  */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleFilter("search", search);
              }}
            >
              <label className="input input-bordered flex items-center gap-2">
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
                  <th>Tanggal Pelaksanaan</th>
                  <th>Durasi</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {dataList.map((dat, i) => (
                  <tr key={i}>
                    <th>{i + 1}</th>
                    <td>{dat.forcountry?.user?.full_name ?? "-"}</td>
                    <td>{dat.activity ?? "-"}</td>
                    <td>
                      <div className="flex flex-wrap gap-2 max-w-72">
                        {dat.plan_date
                          ? dat.plan_date.split(",").map((d: any, i: any) => (
                              <div key={i} className="badge badge-secondary">
                                {formatTime(d, "DD MMMM YYYY")}
                              </div>
                            ))
                          : "-"}
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
                          onClick={() => getDataDetail(dat.id)}
                        >
                          <FaRegFileAlt />
                        </button>
                        <button
                          className="join-item tooltip btn btn-success text-white btn-sm text-md"
                          data-tip="Unggah sertifikat"
                          disabled={
                            dat.status?.toLowerCase() != "selesai" ||
                            dat.status?.toLowerCase() != "done"
                          }
                          onClick={() => openModal(modalUpSertifikat)}
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
        onClose={() => {
          setDataDetail({});
          detailForm.resetForm();
        }}
      >
        <h4 className="text-xl font-bold mb-6">Detail</h4>

        <div role="tablist" className="tabs tabs-lifted">
          <input
            type="radio"
            name="tabs_detail_odyfc"
            role="tab"
            className="tab"
            aria-label="Data"
            defaultChecked
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
          />
          <div
            role="tabpanel"
            className="tab-content border-base-300 rounded-box p-6"
          >
            <DayPicker
              className="!w-full !m-auto"
              mode="multiple"
              classNames={{
                day_selected: "!bg-secondary",
                months: "w-full",
                table: "w-full",
              }}
              selected={scheduleDates}
              onSelect={(dates) => setScheduleDates(dates || [])}
            />
            <div className="flex items-center">
              {dataDetail.is_date_approved && (
                <p className="text-xs text-gray-500 max-w-96">
                  Tanggal sudah disetujui oleh pelaksana
                </p>
              )}
              <button
                onClick={handleSetSchedule}
                className="btn btn-primary ms-auto"
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
            aria-label="Profil"
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

      <Modal id={modalUpSertifikat}>
        <div className="w-full flex justify-center flex-col items-center gap-3">
          <span className="text-xl font-bold">Upload Sertifikat</span>
          {!fileUrl && (
            <div
              className="w-full h-96 rounded-md flex flex-col justify-center items-center border-dashed border-2 border-sky-500 cursor-not-allowed"
              onClick={triggerFileInput}
            >
              <span className="text-5xl">
                <IoDocumentTextOutline />
              </span>
              <span>No preview Document</span>
            </div>
          )}

          {fileUrl && (
            <>
              <iframe
                src={fileUrl}
                frameBorder="0"
                width="100%"
                height="450px"
                className="mt-4"
              />
            </>
          )}
          <input
            type="file"
            ref={fileInputRef}
            className="file-input file-input-bordered w-full"
            onChange={handleFileChange}
            accept=".pdf"
          />

          <button className="btn btn-ghost bg-green-500 text-white w-full">
            Simpan
          </button>
        </div>
      </Modal>
    </>
  );
};

export default ODFYC;
