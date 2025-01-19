import { useFormik } from "formik";
import { useEffect, useRef, useState } from "react";
import {
  FaArrowRight,
  FaExclamationTriangle,
  FaImage,
  FaPlus,
  FaSearch,
  FaTrash,
} from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import { useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import * as Yup from "yup";
import { Input, Select, Textarea } from "../../component/Input";
import Modal, { closeModal, openModal } from "../../component/modal";
import {
  IpageMeta,
  PaginationControl,
} from "../../component/PaginationControl";
import { CutiIzin } from "../../middleware/api-hrd";
import { employeeStore } from "../../store/Store";
import { formatTime } from "../../utils/date";
import { mimeTypes } from "../../constant/fileType";
const types = ["CUTI", "IZIN"];
const statuses = ["Menunggu", "Disetujui", "Ditolak"];
const evidenceExts = ["pdf", "jpeg", "jpg", "png"];

const schema = Yup.object().shape({
  id: Yup.string().optional(),
  type: Yup.string()
    .oneOf(types, "Pilihan tipe tidak sesuai")
    .when("id", {
      is: (id: any) => !!id,
      then: () => Yup.string().optional(),
      otherwise: () => Yup.string().required("Tipe harus diisi"),
    }),
  start_date: Yup.date().required("Tanggal mulai harus diisi"),
  end_date: Yup.date()
    .min(
      Yup.ref("start_date"),
      "Tanggal selesai harus lebih dari tanggal mulai"
    )
    .optional(),
  description: Yup.string().required("Keterangan harus diisi"),
  evidence: Yup.mixed<File>()
    .when("id", {
      is: (id: any) => !!id,
      then: () => Yup.mixed<File>().optional(),
      // ,otherwise: () =>
      //   Yup.mixed<File>().required("Bukti file harus disertakan"),
    })
    .test(
      "is-valid-type",
      "File harus pdf atau gambar",
      (value) =>
        !value ||
        (value &&
          evidenceExts.includes(
            value.name.split(".").pop()?.toLowerCase() || ""
          ))
    )
    .test(
      "is-valid-size",
      "Ukuran melebihi batas 5MB",
      (value) => !value || (value && value.size <= 5000000)
    ),
});

const DaftarCutiIzin = () => {
  const [fileExtensionEdit, setFileExtensionEdit] = useState<string>("");
  const { employee } = employeeStore(),
    modalFormId = "form-cuti-izin",
    modEvidence = "form-bukti-cuti-izin";
  const location = useLocation();
  // filter
  const [search, setSearch] = useState("");
  const [pageMeta, setPageMeta] = useState<IpageMeta>({ page: 0, limit: 10 });
  const [filter, setFilter] = useState({
    date: "",
    type: "",
    status: "",
    search: "",
    page: 0,
    limit: 0,
  });

  useEffect(() => {
    // Cek apakah ada state `openModalId` yang diteruskan dari halaman sebelumnya
    if (location.state?.openModalId) {
      openModal(location.state.openModalId);
    }
  }, [location.state]);
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
      const res = await CutiIzin.showAll(
        filter.search,
        employee.id,
        filter.type,
        filter.date,
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
        text: "Gagal Mengambil data daftar izin dan cuti, silakan coba lain kali",
      });
    }
  };

  useEffect(() => {
    getDataList();
  }, [filter, employee]);

  // create & edit
  const [evidencePreview, setEvidencePreview] = useState<string | undefined>(
    undefined
  );
  const inpEvidence = useRef<HTMLInputElement>(null);

  const form = useFormik({
    initialValues: {
      id: "",
      type: "",
      start_date: "",
      end_date: "",
      description: "",
      evidence: "",
    },
    validationSchema: schema,
    validateOnChange: false,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(false);

      try {
        const formData = new FormData();
        formData.append("type", values.type);
        formData.append("start_date", values.start_date);
        formData.append("end_date", values.end_date);
        formData.append("description", values.description);
        formData.append("file", values.evidence);

        if (values.id) {
          await CutiIzin.change(values.id, formData);
        } else {
          formData.append("status", "Menunggu");
          await CutiIzin.request(formData);
        }

        handleReset();
        closeModal(modalFormId);
        getDataList();

        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: `Berhasil ${values.id ? "mengedit" : "menambahkan"} pengajuan ${values.type ?? "cuti/izin"}`,
        });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `Gagal ${values.id ? "mengedit" : "menambahkan"} pengajuan ${values.type ?? "cuti/izin"}`,
        });
      } finally {
        setSubmitting(true);
      }
    },
  });

  const handleReset = () => {
    form.resetForm();
    setIsFilePathExist(false);
    setEvidencePreview(undefined);
    setFileView("");
    if (inpEvidence.current) inpEvidence.current.value = "";
  };

  useEffect(() => {
    if (form.values.evidence) {
      try {
        // @ts-ignore
        setEvidencePreview(URL.createObjectURL(form.values.evidence));
      } catch {}
    }
  }, [form.values.evidence]);

  // handle get one
  const [isFilePathExist, setIsFilePathExist] = useState(false);
  const [isGetLoading, setIsGetLoading] = useState(false);
  const getData = async (id: string) => {
    setIsGetLoading(true);

    try {
      // fetch get one
      const res = await CutiIzin.showOne(id);
      const dat = res.data.data;
      form.setValues({
        id: dat.id ?? "",
        type: dat.type,
        description: dat.description,
        end_date: dat.end_date
          ? formatTime(dat.end_date, "YYYY-MM-DD HH:mm")
          : "",
        start_date: dat.start_date
          ? formatTime(dat.start_date, "YYYY-MM-DD HH:mm")
          : "",
        evidence: "",
      });
      if (dat.file_path) {
        setIsFilePathExist(true);
        const typePath = dat?.file_path?.split(".");
        const ext = typePath ? typePath[typePath.length - 1].toLowerCase() : "";
        setFileExtensionEdit(ext);

        try {
          const resEvidence = await CutiIzin.downloadFile(dat.file_path);
          const mimeType =
            mimeTypes?.[ext as keyof typeof mimeTypes] ||
            "application/octet-stream";
          const blob = new Blob([resEvidence.data], { type: mimeType });
          setEvidencePreview(URL.createObjectURL(blob));
        } catch {}
      }

      openModal(modalFormId);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `Gagal mendapatkan data`,
      });
    } finally {
      setIsGetLoading(false);
    }
  };

  // delete
  const [isDelLoading, setIsDelLoading] = useState(false);
  const deleteData = async (id: string, xtra: string) => {
    Swal.fire({
      icon: "question",
      title: "Anda Yakin?",
      text: `Aksi ini tidak dapat dibatalkan. Apakah Anda yakin ingin melanjutkan membatalkan ${xtra}?`,
      showCancelButton: true,
      confirmButtonText: "Yakin",
      cancelButtonText: "Batalkan",
    }).then(async (result) => {
      try {
        setIsDelLoading(true);
        if (result.isConfirmed) {
          await CutiIzin.remove(id);

          Swal.fire({
            icon: "success",
            title: "Aksi Berhasil",
            text: "Berhasil menghapus data cuti izin",
          });

          getDataList();
        }
      } catch {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Gagal menghapus data cuti izin",
        });
      } finally {
        setIsDelLoading(false);
      }
    });
  };

  // view evidence file
  const [isFileLoading, setIsFileLoading] = useState(false),
    [fileView, setFileView] = useState("");
  const [fileExtension, setFileExtension] = useState("");
  const viewFile = async (path?: string) => {
    setFileView("");
    if (!path) return;

    setIsFileLoading(true);
    try {
      const response = await CutiIzin.downloadFile(path);

      const contentType = response.headers["content-type"];
      const typePath = path.split(".");
      const fileExtension = typePath[typePath.length - 1];
      const blob = new Blob([response.data], {
        type: fileExtension === "pdf" ? "application/pdf" : contentType,
      });
      setFileExtension(fileExtension);
      setFileView(URL.createObjectURL(blob));
      openModal(modEvidence);
    } catch (error: any) {
      let message = "Gagal mengunduh file bukti";
      if (error.response?.status == 404) message = "File bukti tidak ditemukan";

      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: message,
      });
    } finally {
      setIsFileLoading(false);
    }
  };

  return (
    <>
      <Modal id={modEvidence} onClose={handleReset}>
        <h3 className="text-xl font-bold mb-6">File Bukti</h3>
        {fileExtension === "pdf" ? (
          <iframe className="w-full h-fit min-h-svh" src={fileView} />
        ) : (
          <img src={fileView} alt="Report image" className="w-full h-fit" />
        )}
        <button
          onClick={() => closeModal(modEvidence)}
          className="btn w-full btn-primary mt-10"
        >
          Tutup
        </button>
      </Modal>

      <Modal id={modalFormId} onClose={handleReset}>
        <form onSubmit={form.handleSubmit}>
          <h3 className="text-xl font-bold mb-6">
            {form.values.id ? "Edit" : "Buat"} Pengajuan
          </h3>

          <Select
            label="Tipe"
            placeholder="Tipe"
            name="type"
            options={types}
            value={form.values.type}
            onChange={form.handleChange}
            errorMessage={form.errors.type}
            disabled={!!form.values.id}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Mulai"
              type="datetime-local"
              name="start_date"
              value={form.values.start_date}
              onChange={form.handleChange}
              errorMessage={form.errors.start_date}
            />
            <Input
              label="Selesai"
              type="datetime-local"
              name="end_date"
              value={form.values.end_date}
              onChange={form.handleChange}
              errorMessage={form.errors.end_date}
            />
          </div>

          <Textarea
            label="Keterangan"
            name="description"
            value={form.values.description}
            onChange={form.handleChange}
            errorMessage={form.errors.description}
          />

          {evidencePreview ? (
            fileExtensionEdit === "pdf" ? (
              <embed
                src={evidencePreview}
                type="application/pdf"
                className="h-[200px] w-full"
              />
            ) : (
              <img
                src={evidencePreview}
                alt="Report image"
                className="w-full h-fit"
              />
            )
          ) : (
            <div
              onClick={() => {
                inpEvidence.current?.click();
              }}
              className="flex h-[300px] border border-dashed justify-center items-center rounded-lg"
            >
              <p className="text-neutral-500 text-sm">Pratinjau bukti</p>
            </div>
          )}

          <Input
            label="Bukti"
            type="file"
            name="evidence"
            ref={inpEvidence}
            accept={evidenceExts.map((ext) => "." + ext).join(", ")}
            // value={form.values.file}
            onChange={(e) => {
              if (e.target.files) {
                form.setFieldValue("evidence", e.target.files[0]);
                setFileExtensionEdit(e.target.files[0].type.split("/")[1]);
              }
            }}
            hint={
              isFilePathExist
                ? "File bukti sebelumnya akan tertimpa dengan file bukti baru"
                : ""
            }
            errorMessage={form.errors.evidence}
          />

          <button
            type="submit"
            className="btn btn-secondary w-full mt-10"
            disabled={form.isSubmitting}
          >
            {form.isSubmitting ? "Menyimpan..." : "Simpan"}
          </button>
        </form>
      </Modal>

      <div className="w-full flex justify-center flex-col items-center p-3">
        <span className="font-bold text-xl mb-6">PENGAJUAN CUTI dan IZIN</span>

        {!employee && (
          <div role="alert" className="alert alert-warning mb-6">
            <FaExclamationTriangle />
            <span>Akun anda belum terhubung ke data karyawan!</span>
          </div>
        )}

        <div className="w-full p-3 bg-white rounded-lg">
          {/* filter  */}
          <div className="w-full flex flex-wrap justify-end my-3 gap-2">
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
                placeholder="Tipe"
                options={types}
                value={filter.type}
                onChange={(e) => handleFilter("type", e.target.value)}
              />
            </div>

            <div>
              <Input
                value={filter.date}
                type="date"
                onChange={(e) => handleFilter("date", e.target.value)}
              />
            </div>

            <div>
              <Select
                placeholder="Status"
                options={statuses}
                value={filter.status}
                onChange={(e) => handleFilter("status", e.target.value)}
              />
            </div>

            <button
              onClick={() => openModal(modalFormId)}
              className="btn btn-secondary"
            >
              <FaPlus />
              Buat Pengajuan
            </button>
          </div>

          {/* table  */}
          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead className="bg-blue-400">
                <tr>
                  <th>No</th>
                  <th>Tipe</th>
                  <th>Tanggal</th>
                  <th>Keterangan</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {dataList.map((dat, i) => (
                  <tr key={i}>
                    <th>{i + 1}</th>
                    <td>{dat.type ?? "-"}</td>
                    <td>
                      {dat.start_date ? (
                        <div className="flex items-center flex-wrap gap-2">
                          <div className="badge whitespace-nowrap">
                            {formatTime(
                              dat.start_date,
                              "dddd, DD MMMM YYYY HH:mm"
                            )}
                          </div>
                          {dat.end_date && (
                            <div className="flex items-center gap-2">
                              <FaArrowRight size={10} />
                              <div className="badge whitespace-nowrap">
                                {formatTime(
                                  dat.end_date,
                                  "dddd, DD MMMM YYYY HH:mm"
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td>{dat.description ?? "-"}</td>
                    <td
                      className={
                        "uppercase font-bold " +
                        (dat.is_approved != null
                          ? dat.is_approved
                            ? "text-success"
                            : "text-error"
                          : "")
                      }
                    >
                      {dat.status ?? "-"}
                    </td>
                    <td>
                      <div className="join">
                        <button
                          className="btn btn-primary btn-sm join-item tooltip"
                          data-tip="Lihat bukti"
                          disabled={!dat.file_path || isFileLoading}
                          onClick={() => viewFile(dat.file_path)}
                        >
                          <FaImage />
                        </button>
                        {dat.is_approved == null && (
                          <>
                            <button
                              className="btn btn-secondary btn-sm join-item  tooltip"
                              data-tip="Edit"
                              disabled={isGetLoading}
                              onClick={() => getData(dat.id)}
                            >
                              <FaPencil />
                            </button>
                            <button
                              className="btn btn-error btn-sm join-item text-white tooltip"
                              data-tip="Batalkan"
                              disabled={isDelLoading}
                              onClick={() =>
                                deleteData(dat.id, dat.type ?? "cuti/izin")
                              }
                            >
                              <FaTrash />
                            </button>
                          </>
                        )}
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
        </div>
      </div>
    </>
  );
};

export default DaftarCutiIzin;
