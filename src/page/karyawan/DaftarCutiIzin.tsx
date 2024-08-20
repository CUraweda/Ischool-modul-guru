import { useEffect, useRef, useState } from "react";
import {
  IpageMeta,
  PaginationControl,
} from "../../component/PaginationControl";
import { Input, Select, Textarea } from "../../component/Input";
import { FaPlus, FaSearch } from "react-icons/fa";
import { Store } from "../../store/Store";
import Swal from "sweetalert2";
import { FaPencil, FaX } from "react-icons/fa6";
import * as Yup from "yup";
import { useFormik } from "formik";
import Modal, { closeModal, openModal } from "../../component/modal";
// import { setYear } from "date-fns/esm";

// const evidenceExts = ["pdf", "jpeg", "jpg", "png"];
const types = ["CUTI", "IZIN"];
const statuses = ["Menunggu", "Disetujui", "Ditolak"];
const evidenceExts = ["pdf", "jpeg", "jpg", "png"];

const schema = Yup.object().shape({
  id: Yup.string().optional(),
  type: Yup.string()
    .oneOf(types, "Pilihan tipe tidak sesuai")
    .required("Tipe harus diisi"),
  start_date: Yup.date().required("Tanggal mulai harus diisi"),
  end_date: Yup.date()
    .min(
      Yup.ref("start_date"),
      "Tanggal selesai harus lebih dari tanggal mulai"
    )
    .optional(),
  info: Yup.string().required("Keterangan harus diisi"),
  evidence: Yup.mixed<File>()
    .required()
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
  const {} = Store(),
    modalFormId = "form-cuti-izin";

  // filter
  const [search, setSearch] = useState("");
  const [pageMeta, setPageMeta] = useState<IpageMeta>({ page: 0, limit: 10 });
  const [filter, setFilter] = useState({
    type: "",
    status: "",
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

  // retrieve data
  const [dataList, setDataList] = useState<any[]>([]);
  const getDataList = async () => {
    try {
      // fetch find all
      const res: any = {};

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
  }, [filter]);

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
      info: "",
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
        formData.append("info", values.info);
        formData.append("file", values.evidence);

        // values.id
        //   ? await AchievementSiswa.update(token, values.id, formData)
        //   : await AchievementSiswa.create(token, formData);

        handleReset();
        closeModal(modalFormId);
        getDataList();

        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: `Berhasil ${values.id ? "mengedit" : "menambahkan"} cuti izin`,
        });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `Gagal ${values.id ? "mengedit" : "menambahkan"} cuti izin`,
        });
      } finally {
        setSubmitting(true);
      }
    },
  });

  const handleReset = () => {
    form.resetForm();
    setEvidencePreview(undefined);
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
  const [isGetLoading, setIsGetLoading] = useState(false);
  const getData = async (id: string) => {
    setIsGetLoading(true);

    try {
      // fetch get one
      // set to formik values
      console.log(id);

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
          // fetch delete one
          console.log(id);

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

  return (
    <>
      <Modal id={modalFormId} onClose={handleReset}>
        <form onSubmit={form.handleSubmit}>
          <h3 className="text-xl font-bold mb-6">
            {form.values.id ? "Edit" : "Buat"} Pengajuan
          </h3>

          <Select
            label="Tipe"
            placeholder="- Tipe"
            name="type"
            options={types}
            value={form.values.type}
            onChange={form.handleChange}
            errorMessage={form.errors.type}
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
            name="info"
            value={form.values.info}
            onChange={form.handleChange}
            errorMessage={form.errors.info}
          />

          {evidencePreview ? (
            <iframe
              src={evidencePreview}
              frameBorder="0"
              width="100%"
              height="300px"
            />
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
              }
            }}
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
                placeholder="- Tipe"
                options={types}
                value={filter.type}
                onChange={(e) => handleFilter("type", e.target.value)}
              />
            </div>

            <div>
              <Select
                placeholder="- Status"
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
                    {/* ...the rest of data  */}
                    <td>
                      <div className="join">
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
                          onClick={() => deleteData(dat.id, "")}
                        >
                          <FaX />
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
        </div>
      </div>
    </>
  );
};

export default DaftarCutiIzin;
