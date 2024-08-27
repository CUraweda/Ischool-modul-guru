import { useEffect, useRef, useState } from "react";
import { employeeStore, Store } from "../../../store/Store";
import {
  IpageMeta,
  PaginationControl,
} from "../../../component/PaginationControl";
import { PelatihanKaryawan } from "../../../midleware/api-hrd";
import Swal from "sweetalert2";
import { Input, Select } from "../../../component/Input";
import {
  FaArrowRight,
  FaEye,
  FaMapPin,
  FaPlus,
  FaSearch,
  FaSmile,
} from "react-icons/fa";
import { formatTime } from "../../../utils/date";
import Modal, { closeModal, openModal } from "../../../component/modal";
import * as y from "yup";
import { useFormik } from "formik";

const attendFileExts = ["jpeg", "jpg", "png"];
const schemaAttend = y.object().shape({
  title: y.string().required("Judul wajib diisi"),
  file: y
    .mixed<File>()
    .required("Bukti file harus disertakan")
    .test(
      "is-valid-type",
      "File harus berupa gambar",
      (value) =>
        !value ||
        (value &&
          attendFileExts.includes(
            value.name.split(".").pop()?.toLowerCase() || ""
          ))
    )
    .test(
      "is-valid-size",
      "Ukuran melebihi batas 5MB",
      (value) => !value || (value && value.size <= 5000000)
    ),
});

const DaftarPelatihan = () => {
  const { token } = Store(),
    { employee } = employeeStore(),
    modDetail = "detail-pelatihan-karyawan",
    modUpAttendance = "upload-kehadiran-pelatihan";

  // filter
  const [search, setSearch] = useState("");
  const [pageMeta, setPageMeta] = useState<IpageMeta>({ page: 0, limit: 10 });
  const [filter, setFilter] = useState({
    search: "",
    status: "",
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

  // retrieve data
  const [dataList, setDataList] = useState<any[]>([]);
  const getDataList = async () => {
    if (!employee?.id) return;

    try {
      // fetch find all
      const res = await PelatihanKaryawan.showAll(
        token,
        filter.search,
        employee.id,
        filter.status,
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
        text: "Gagal Mengambil data daftar pelatihan, silakan coba lain kali",
      });
    }
  };

  useEffect(() => {
    getDataList();
  }, [filter, employee]);

  // tab props in detail modal
  const [idDetail, setIdDetail] = useState("");
  const [detailTab, setDetailTab] = useState<"info" | "dokumentasi">("info");
  useEffect(() => {
    if (detailTab == "info") getData();
    else if (detailTab == "dokumentasi") getAttendances();
  }, [detailTab, idDetail]);

  // get one data
  const [data, setData] = useState<any>(null);
  const [isGetLoading, setIsGetLoading] = useState(false);
  const getData = async () => {
    if (!idDetail) return;
    setIsGetLoading(true);

    try {
      // fetch get one
      const res = await PelatihanKaryawan.showOne(token, idDetail);
      setData(res.data.data ?? null);

      openModal(modDetail);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `Gagal mendapatkan data detail pelatihan`,
      });
      closeModal(modDetail);
    } finally {
      setIsGetLoading(false);
    }
  };

  // training documentations / attendance evidences
  const [attendanceList, setAttendanceList] = useState<any[]>([]);
  const [isGetAttendLoading, setIsGetAttendLoading] = useState(false);
  const getAttendances = async () => {
    if (!idDetail) return;
    setIsGetAttendLoading(true);

    try {
      const res = await PelatihanKaryawan.showAllDokumentasi(token, idDetail);
      setAttendanceList(res.data.data?.result ?? []);
      openModal(modDetail);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `Gagal mendapatkan data detail pelatihan`,
      });
      closeModal(modDetail);
    } finally {
      setIsGetAttendLoading(false);
    }
  };

  const formAttend = useFormik({
    initialValues: {
      title: "",
      file: "",
    },
    validateOnChange: false,
    validationSchema: schemaAttend,
    onSubmit: async (values, { setSubmitting }) => {
      if (!idDetail) return;

      setSubmitting(false);

      try {
        const formData = new FormData();
        formData.append("title", values.title);
        formData.append("file", values.file);

        await PelatihanKaryawan.uploadDokumentasi(token, idDetail, formData);

        handleResetAttend();
        getAttendances();
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `Gagal menambahkan dokumentasi pelatihan`,
        });
        closeModal(modDetail);
      } finally {
        setSubmitting(true);
        closeModal(modUpAttendance);
      }
    },
  });

  const handleResetAttend = () => {
    formAttend.resetForm();
    setFileAttendPreview("");
    if (inpFileAttend.current) inpFileAttend.current.value = "";
  };

  const [fileAttendPreview, setFileAttendPreview] = useState("");
  const inpFileAttend = useRef<HTMLInputElement>(null);

  const delAttendance = async (id: string) => {
    try {
      await PelatihanKaryawan.hapusDokumentasi(token, id);
      getAttendances();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `Gagal menambahkan dokumentasi pelatihan`,
      });
      closeModal(modDetail);
    }
  };

  return (
    <>
      <div className="w-full flex flex-wrap justify-end mb-3 gap-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleFilter("search", search);
          }}
          className="join"
        >
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari"
            slotRight={<FaSearch />}
          />
        </form>

        <div>
          <Select
            placeholder="Status"
            options={["Tuntas", "Proses pelatihan"]}
            value={filter.status}
            onChange={(e) => handleFilter("status", e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="table table-zebra">
          <thead className="bg-blue-400">
            <tr>
              <th>No</th>
              <th>Judul</th>
              <th>Lokasi</th>
              <th>Tanggal pelaksanaan</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {dataList.map((dat, i) => (
              <tr key={i}>
                <th>{i + 1}</th>
                <td>
                  <div className="min-w-32">{dat.title ?? "-"}</div>
                </td>
                <td>
                  <div className="flex gap-2 items-center min-w-32">
                    <FaMapPin className="text-error" />
                    {dat.location ?? "-"}
                  </div>
                </td>
                <td>
                  {dat.start_date ? (
                    <div className="flex items-center flex-wrap gap-2">
                      <div className="badge whitespace-nowrap">
                        {formatTime(dat.start_date, "dddd, DD MMMM YYYY")}
                      </div>
                      {dat.end_date && (
                        <div className="flex items-center gap-2">
                          <FaArrowRight size={10} />
                          <div className="badge whitespace-nowrap">
                            {formatTime(dat.end_date, "dddd, DD MMMM YYYY")}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    "-"
                  )}
                </td>
                <td className="uppercase font-bold">{dat.status ?? "-"}</td>
                <td>
                  <div className="join">
                    <button
                      type="button"
                      className="btn btn-sm btn-primary join-item tooltip"
                      data-tip="Detail"
                      disabled={isGetLoading}
                      onClick={() => {
                        setIdDetail(dat.id);
                        setDetailTab("info");
                      }}
                    >
                      <FaEye />
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-secondary join-item tooltip"
                      data-tip="Dokumentasi kehadiran"
                      disabled={isGetAttendLoading}
                      onClick={() => {
                        setIdDetail(dat.id);
                        setDetailTab("dokumentasi");
                      }}
                    >
                      <FaSmile />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* control  */}
      <PaginationControl
        meta={pageMeta}
        onPrevClick={() => handleFilter("page", pageMeta.page - 1)}
        onNextClick={() => handleFilter("page", pageMeta.page + 1)}
        onJumpPageClick={(val) => handleFilter("page", val)}
        onLimitChange={(val) => handleFilter("limit", val)}
      />

      <Modal
        id={modDetail}
        onClose={() => {
          setIdDetail("");
          setData(null);
          setAttendanceList([]);
        }}
      >
        <h3 className="text-xl font-bold mb-6">Detail Pelatihan</h3>

        <div role="tablist" className="tabs tabs-lifted">
          <input
            type="radio"
            name="detail-pelatihan-tab"
            role="tab"
            className={
              "tab font-bold " + (detailTab == "info" ? "" : "bg-blue-300")
            }
            aria-label="Informasi"
            checked={detailTab == "info"}
            onChange={() => setDetailTab("info")}
          />
          <div
            role="tabpanel"
            className="tab-content bg-base-100 border-base-300 rounded-e-box rounded-b-box p-3"
          >
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <tbody>
                  <tr>
                    <th>Judul</th>
                    <td>{data?.title ?? "-"}</td>
                  </tr>
                  <tr>
                    <th>Tujuan</th>
                    <td>{data?.purpose ?? "-"}</td>
                  </tr>
                  <tr>
                    <th>Lokasi</th>
                    <td>{data?.location ?? "-"}</td>
                  </tr>
                  <tr>
                    <th className="whitespace-nowrap">Tanggal mulai</th>
                    <td>
                      {data?.start_date
                        ? formatTime(data.start_date, "dddd, DD MMMM YYYY")
                        : "-"}
                    </td>
                  </tr>
                  <tr>
                    <th className="whitespace-nowrap">Tanggal selesai</th>
                    <td>
                      {data?.end_date
                        ? formatTime(data.end_date, "dddd, DD MMMM YYYY")
                        : "-"}
                    </td>
                  </tr>
                  <tr>
                    <th className="whitespace-nowrap">Ditujukan kepada</th>
                    <td>{data?.employee?.full_name ?? "-"}</td>
                  </tr>
                  <tr>
                    <th className="whitespace-nowrap">Oleh</th>
                    <td>{data?.proposer?.full_name ?? "-"}</td>
                  </tr>
                  <tr>
                    <th>Status</th>
                    <td className="uppercase">{data?.status ?? "-"}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <input
            type="radio"
            name="detail-pelatihan-tab"
            role="tab"
            className={
              "tab font-bold " +
              (detailTab === "dokumentasi" ? "" : "bg-blue-300")
            }
            aria-label="Dokumentasi"
            checked={detailTab == "dokumentasi"}
            onChange={() => setDetailTab("dokumentasi")}
          />
          <div
            role="tabpanel"
            className="tab-content bg-base-100 relative border-base-300 rounded-e-box rounded-b-box pb-16 p-6"
          >
            {attendanceList.map((dat, i) => (
              <div key={i}>
                <div className="w-full max-h-[300px] rounded-md overflow-hidden">
                  <img
                    src={
                      import.meta.env.VITE_REACT_API_HRD_URL +
                      "/training-attendance/" +
                      dat.img_path?.split("/").at(-1)
                    }
                    alt=""
                  />
                </div>
                <div className="flex gap-3 justify-between flex-wrap items-center mt-3 mb-6">
                  <div>
                    <p className="font-bold">{dat.title ?? "-"}</p>
                    <p className="text-xs opacity-60">
                      {formatTime(dat.created_at, "dddd, DD MMMM YYYY")}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="btn btn-outline btn-error btn-sm"
                    onClick={() => delAttendance(dat.id)}
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))}
            <button
              className="flex btn btn-secondary absolute bottom-3 right-3 z-10 btn-circle tooltip"
              data-tip="Tambah"
              onClick={() => openModal(modUpAttendance)}
            >
              <FaPlus size={20} />
            </button>
          </div>
        </div>
      </Modal>

      <Modal id={modUpAttendance} onClose={handleResetAttend}>
        <h3 className="text-xl font-bold mb-6">Tambah dokumentasi</h3>

        <form onSubmit={formAttend.handleSubmit}>
          {fileAttendPreview ? (
            <img
              src={fileAttendPreview}
              width="100%"
              className="rounded-lg bg-base-200"
            />
          ) : (
            <div
              onClick={() => {
                inpFileAttend.current?.click();
              }}
              className="flex h-[300px] border border-dashed justify-center items-center rounded-lg"
            >
              <p className="text-neutral-500 text-sm">Pratinjau bukti</p>
            </div>
          )}

          <Input
            label="Bukti"
            type="file"
            name="file"
            ref={inpFileAttend}
            accept={attendFileExts.map((ext) => "." + ext).join(", ")}
            // value={form.values.file}
            onChange={(e) => {
              if (e.target.files) {
                formAttend.setFieldValue("file", e.target.files[0]);
                setFileAttendPreview(URL.createObjectURL(e.target.files[0]));
              }
            }}
            errorMessage={formAttend.errors.file}
          />

          <Input
            label="Judul"
            name="title"
            value={formAttend.values.title}
            onChange={formAttend.handleChange}
            errorMessage={formAttend.errors.title}
          />

          <button
            type="submit"
            className="btn btn-secondary w-full mt-6"
            disabled={formAttend.isSubmitting}
          >
            {formAttend.isSubmitting ? "Menyimpan..." : "Simpan"}
          </button>
        </form>
      </Modal>
    </>
  );
};

export default DaftarPelatihan;
