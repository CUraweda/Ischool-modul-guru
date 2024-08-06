import { useEffect, useState } from "react";
import {
  IpageMeta,
  PaginationControl,
} from "../../component/PaginationControl";
import { Input, Select, Textarea } from "../../component/Input";
import {
  FaArrowRight,
  FaMapPin,
  FaPlus,
  FaSearch,
  FaTrash,
} from "react-icons/fa";
import { Store } from "../../store/Store";
import Swal from "sweetalert2";
import { FaFaceSmile, FaPencil } from "react-icons/fa6";
import * as Yup from "yup";
import { useFormik } from "formik";
import Modal, { closeModal, openModal } from "../../component/modal";
import { formatTime } from "../../utils/date";

const statuses = [
  "Menunggu",
  "Disetujui",
  "Ditolak",
  "Proses Pelatihan",
  "Tuntas",
];

const schema = Yup.object().shape({
  id: Yup.string().optional(),
  type: Yup.string().required("Nama pelatihan harus diisi"),
  start_date: Yup.date().required("Tanggal mulai harus diisi"),
  end_date: Yup.date()
    .min(
      Yup.ref("start_date"),
      "Tanggal selesai harus lebih dari tanggal mulai"
    )
    .optional(),
  purpose: Yup.string().required("Tujuan harus diisi"),
  location: Yup.string().required("Lokasi harus diisi"),
});

const DaftarPelatihan = () => {
  const {} = Store(),
    modalFormId = "form-pelatihan",
    modalAttendance = "form-kehadiran-pelatihan";

  // filter
  const [search, setSearch] = useState("");
  const [pageMeta, setPageMeta] = useState<IpageMeta>({ page: 0, limit: 10 });
  const [filter, setFilter] = useState({
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
  const [dataList, setDataList] = useState<any[]>([
    // temp
    {
      id: 0,
      title: "Eksplorasi Bakat Anak",
      purpose: "Upgrade Ilmu",
      location: "Kab. Cirebon, New York City, Norwegia",
      start_date: "2024-08-05T12:30:00",
      end_date: "2024-08-06T12:30:00",
      status: "Tuntas",
    },
  ]);
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
        text: "Gagal Mengambil data daftar pelatihan, silakan coba lain kali",
      });
    }
  };

  useEffect(() => {
    getDataList();
  }, [filter]);

  // create & edit
  const form = useFormik({
    initialValues: {
      id: "",
      name: "",
      start_date: "",
      end_date: "",
      purpose: "",
      location: "",
    },
    validationSchema: schema,
    validateOnChange: false,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(false);

      try {
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("start_date", values.start_date);
        formData.append("end_date", values.end_date);

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
  };

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
      text: `Aksi ini tidak dapat dibatalkan. Apakah Anda yakin ingin melanjutkan menghapus ${xtra}?`,
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
            text: "Berhasil menghapus data pelatihan",
          });

          getDataList();
        }
      } catch {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Gagal menghapus data pelatihan",
        });
      } finally {
        setIsDelLoading(false);
      }
    });
  };

  // get attendance evidences
  const [isGetAttEvLoading, setIsGetAttEvLoading] = useState(false);
  const getAttendEvidences = (id: string) => {
    setIsGetAttEvLoading(true);
    try {
      console.log(id);
      openModal(modalAttendance);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `Gagal mendapatkan daftar bukti kehadiran`,
      });
    } finally {
      setIsGetAttEvLoading(false);
    }
  };

  return (
    <>
      <Modal id={modalAttendance}>
        <h3 className="text-xl font-bold mb-6">Bukti Kehadiran</h3>

        <button className="btn btn-primary w-full mt-10">Tambah</button>
      </Modal>

      <Modal id={modalFormId} onClose={handleReset}>
        <form onSubmit={form.handleSubmit}>
          <h3 className="text-xl font-bold mb-6">
            {form.values.id ? "Edit" : "Buat"} Pengajuan
          </h3>

          <Input
            label="Nama pelatihan"
            name="name"
            value={form.values.name}
            onChange={form.handleChange}
            errorMessage={form.errors.name}
          />

          <Textarea
            label="Tujuan"
            name="purpose"
            value={form.values.purpose}
            onChange={form.handleChange}
            errorMessage={form.errors.purpose}
          />

          <Input
            label="Lokasi"
            name="location"
            value={form.values.location}
            onChange={form.handleChange}
            errorMessage={form.errors.location}
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
        <span className="font-bold text-xl mb-6">DAFTAR PELATIHAN</span>

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
                  <th>Nama</th>
                  <th>Tujuan</th>
                  <th>Lokasi</th>
                  <th>Tanggal</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {dataList.map((dat, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>
                      <div className="min-w-[100px]">{dat.title ?? "-"}</div>
                    </td>
                    <td>
                      <div className="min-w-[100px]">{dat.purpose ?? "-"}</div>
                    </td>
                    <td>
                      <div className="flex gap-2 items-center min-w-[150px]">
                        <FaMapPin className="text-error" size={20} />{" "}
                        {dat.location ?? "-"}
                      </div>
                    </td>
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
                              <FaArrowRight />
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
                    <td>{dat.status ?? ""}</td>
                    {/* ...the rest of data  */}
                    <td>
                      <div className="join">
                        <button
                          className="btn btn-primary btn-sm join-item  tooltip"
                          data-tip="Bukti kehadiran"
                          disabled={isGetAttEvLoading}
                          onClick={() => getAttendEvidences(dat.id)}
                        >
                          <FaFaceSmile />
                        </button>
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
                          <FaTrash />
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

export default DaftarPelatihan;
