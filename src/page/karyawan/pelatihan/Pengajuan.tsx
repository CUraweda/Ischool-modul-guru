import * as y from "yup";
import { employeeStore, Store } from "../../../store/Store";
import { useEffect, useState } from "react";
import {
  IpageMeta,
  PaginationControl,
} from "../../../component/PaginationControl";
import { PengajuanPelatihanKaryawan } from "../../../midleware/api-hrd";
import Swal from "sweetalert2";
import { Input, Textarea } from "../../../component/Input";
import {
  FaArrowRight,
  FaExclamationTriangle,
  FaPlus,
  FaSearch,
  FaTrash,
} from "react-icons/fa";
import { formatTime } from "../../../utils/date";
import { FaPencil } from "react-icons/fa6";
import { useFormik } from "formik";
import Modal, { closeModal, openModal } from "../../../component/modal";
import { filterEmptyPayload } from "../../../utils/common";

const schema = y.object().shape({
  id: y.string().optional(),
  title: y
    .string()
    .max(50, "Maksimal 50 karakter")
    .required("Judul wajib diisi"),
  notes: y.string().max(100, "Maksimal 100 karakter").optional(),
  start_date: y.date().optional(),
  end_date: y
    .date()
    .min(y.ref("start_date"), "Tanggal selesai harus lebih dari tanggal mulai")
    .optional(),
});

const PengajuanPelatihan = () => {
  const { token } = Store(),
    { employee } = employeeStore(),
    modalFormId = "form-pengajuan";

  // filter
  const [search, setSearch] = useState("");
  const [pageMeta, setPageMeta] = useState<IpageMeta>({ page: 0, limit: 10 });
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

  // retrieve data
  const [dataList, setDataList] = useState<any[]>([]);
  const getDataList = async () => {
    if (!employee?.id) return;

    try {
      // fetch find all
      const res = await PengajuanPelatihanKaryawan.showAll(
        token,
        filter.search,
        employee.id,
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
        text: "Gagal Mengambil data daftar pengajuan pelatihan, silakan coba lain kali",
      });
    }
  };

  useEffect(() => {
    getDataList();
  }, [filter, employee]);

  // create update
  const form = useFormik({
    initialValues: {
      id: "",
      title: "",
      notes: "",
      start_date: "",
      end_date: "",
    },
    validationSchema: schema,
    validateOnChange: false,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(false);

      try {
        const payload = filterEmptyPayload({ ...values });
        values.id
          ? await PengajuanPelatihanKaryawan.update(token, values.id, payload)
          : await PengajuanPelatihanKaryawan.request(token, payload);

        handleReset();
        getDataList();

        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: `Berhasil ${values.id ? "mengedit" : "menambahkan"} pengajuan pelatihan`,
        });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `Gagal ${values.id ? "mengedit" : "menambahkan"} pengajuan pelatihan`,
        });
      } finally {
        closeModal(modalFormId);
        setSubmitting(true);
      }
    },
  });

  const handleReset = () => {
    form.resetForm();
  };

  const [isGetLoading, setIsGetLoading] = useState(false);
  const getData = async (id: string) => {
    setIsGetLoading(true);

    try {
      // fetch get one
      const res = await PengajuanPelatihanKaryawan.showOne(token, id);
      const dat = res.data.data;
      form.setValues({
        id: dat.id ?? "",
        title: dat.title ?? "",
        notes: dat.notes ?? "",
        end_date: dat.end_date ? formatTime(dat.end_date, "YYYY-MM-DD") : "",
        start_date: dat.start_date
          ? formatTime(dat.start_date, "YYYY-MM-DD")
          : "",
      });

      openModal(modalFormId);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `Gagal mendapatkan data pengajuan pelatihan`,
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
      text: `Aksi ini tidak dapat dibatalkan. Apakah Anda yakin ingin melanjutkan menghapus ${xtra}?`,
      showCancelButton: true,
      confirmButtonText: "Yakin",
      cancelButtonText: "Batalkan",
    }).then(async (result) => {
      try {
        setIsDelLoading(true);
        if (result.isConfirmed) {
          await PengajuanPelatihanKaryawan.delete(token, id);

          Swal.fire({
            icon: "success",
            title: "Aksi Berhasil",
            text: "Berhasil menghapus data pengajuan pelatihan",
          });

          getDataList();
        }
      } catch {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Gagal menghapus data pengajuan pelatihan",
        });
      } finally {
        setIsDelLoading(false);
      }
    });
  };

  return (
    <>
      <Modal id={modalFormId}>
        <form onSubmit={form.handleSubmit}>
          <h3 className="text-xl font-bold mb-6">
            {form.values.id ? "Edit" : "Buat"} Pengajuan
          </h3>

          <Input
            label="Judul"
            name="title"
            value={form.values.title}
            onChange={form.handleChange}
            errorMessage={form.errors.title}
          />

          <Textarea
            label="Catatan"
            name="notes"
            helpMessage="Opsional"
            value={form.values.notes}
            onChange={form.handleChange}
            errorMessage={form.errors.notes}
          />

          <div className="flex gap-3">
            <Input
              label="Tanggal mulai"
              type="date"
              name="start_date"
              value={form.values.start_date}
              onChange={form.handleChange}
              errorMessage={form.errors.start_date}
            />
            <Input
              label="Tanggal selesai"
              type="date"
              name="end_date"
              value={form.values.end_date}
              onChange={form.handleChange}
              errorMessage={form.errors.end_date}
            />
          </div>

          <button
            type="submit"
            className="btn btn-secondary w-full mt-10"
            disabled={form.isSubmitting}
          >
            {form.isSubmitting ? "Menyimpan..." : "Simpan"}
          </button>
        </form>
      </Modal>

      {!employee && (
        <div role="alert" className="alert alert-warning mb-6">
          <FaExclamationTriangle />
          <span>Akun anda belum terhubung ke data karyawan!</span>
        </div>
      )}

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

        <button
          onClick={() => openModal(modalFormId)}
          type="button"
          className="btn btn-secondary"
        >
          <FaPlus />
          Buat pengajuan
        </button>
      </div>

      {/* table  */}
      <div className="overflow-x-auto">
        <table className="table table-zebra">
          <thead className="bg-blue-400">
            <tr>
              <th>No</th>
              <th>Judul</th>
              <th>Tanggal pelaksanaan</th>
              <th>Catatan</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {dataList.map((dat, i) => (
              <tr key={i}>
                <th>{i + 1}</th>
                <td>
                  <p className="min-w-32">{dat.title ?? "-"}</p>
                </td>
                <td>
                  {dat.start_date ? (
                    <div className="flex items-center flex-wrap gap-2">
                      <div className="badge whitespace-nowrap">
                        {formatTime(dat.start_date, "dddd, DD MMMM YYYY HH:mm")}
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
                <td>
                  <p className="opacity-60 min-w-52">{dat.notes ?? "-"}</p>
                </td>
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
                  {dat.is_approved != null
                    ? dat.is_approved
                      ? "Disetujui"
                      : "Ditolak"
                    : "Menunggu"}
                </td>
                <td>
                  <div className="join">
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
                            deleteData(
                              dat.id,
                              `pelatihan "${dat.title ?? "-"}"`
                            )
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
    </>
  );
};

export default PengajuanPelatihan;
