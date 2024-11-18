// import React from "react";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { FaCheck, FaSearch, FaTrash } from "react-icons/fa";
import { MdInsertPhoto } from "react-icons/md";
import { Link, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import * as Yup from "yup";
import { Input, Select } from "../../component/Input";
import Modal, { closeModal, openModal } from "../../component/modal";
import {
  IpageMeta,
  PaginationControl,
} from "../../component/PaginationControl";
import { Class, Student, TagihanSiswa } from "../../middleware/api";
import { globalStore } from "../../store/Store";
import { formatTime } from "../../utils/date";

const apiAssets = import.meta.env.VITE_REACT_API_URL;

const tambahSiswaSchema = Yup.object().shape({
  academic_year: Yup.string().optional(),
  level: Yup.string()
    .oneOf(["TK", "SD", "SM"], "Pilih antara TK, SD, atau SM")
    .required("Pilih antara TK, SD, atau SM"),
  class_id: Yup.number().optional(),
  student_id: Yup.number().optional(),
  nis_prefix: Yup.string().optional(),
});

const DetailJenisPembayaran = () => {
  const { academicYear } = globalStore(),
    { id: billId } = useParams(),
    modalFormTambah = "form-tambah-siswa",
    modalBuktiBayar = "form-bukti-bayar";

  // data state
  const [classes, setClasses] = useState<any[]>([]);
  const [dataList, setDataList] = useState<any[]>([]);
  const [pageMeta, setPageMeta] = useState<IpageMeta>({ page: 0, limit: 70 });
  const [filter, setFilter] = useState({
    page: 0,
    limit: 10,
    search: "",
    classId: "",
  });

  // UI states
  const [search, setSearch] = useState<string>("");

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
      const res = await TagihanSiswa.showAll(
        filter.search,
        billId,
        filter.classId,
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
        text: "Gagal Mengambil data pos pembayaran, silakan refresh halaman!",
      });
    }
  };

  useEffect(() => {
    getDataList();
  }, [filter]);

  const getClasses = async () => {
    try {
      const res = await Class.showAll(0, 1000);
      setClasses(res.data.data.result);
    } catch {}
  };

  useEffect(() => {
    getClasses();
  }, []);

  const [studentsToAdd, setStudentsToAdd] = useState([]);
  const [studentsToAddShow, setStudentsToAddShow] = useState([]);
  const [classesInForm, setClassesInForm] = useState([]);

  const tambahSiswaForm = useFormik({
    initialValues: {
      level: "",
      class_id: 0,
      student_id: 0,
      academic_year: academicYear,
      nis_prefix: "",
    },
    validateOnChange: false,
    validationSchema: tambahSiswaSchema,
    onSubmit: async (_, { setSubmitting }) => {
      setSubmitting(true);

      try {
        const res = await TagihanSiswa.bulkCreate({
          student_ids: studentsToAdd.map((dat: any) => dat.id),
          payment_bill_id: billId,
        });

        getDataList();
        resetForm();
        const lenCreated = res.data.data.length;

        lenCreated == 0
          ? Swal.fire({
              icon: "warning",
              title: "Peringatan",
              text: `Semua siswa sudah terdaftar`,
            })
          : Swal.fire({
              icon: "success",
              title: "Sip Mantap",
              text:
                `Berhasil menambahkan ${lenCreated} siswa` +
                (lenCreated < studentsToAdd.length
                  ? ` dengan ${studentsToAdd.length - lenCreated} siswa sudah terdaftar`
                  : ""),
            });
      } catch {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `Gagal menambahkan ${studentsToAdd.length} siswa`,
        });
      } finally {
        setSubmitting(false);
        closeModal(modalFormTambah);
      }
    },
  });

  useEffect(() => {
    tambahSiswaForm.setFieldValue("academic_year", academicYear);
  }, [academicYear]);

  const resetForm = () => {
    tambahSiswaForm.resetForm();
    setStudentsToAdd([]);
    setStudentsToAddShow([]);
  };

  const parseHandleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    tambahSiswaForm.setFieldValue(
      name,
      value == "" ? undefined : parseInt(value)
    );
  };

  const getStudentsToAdd = async () => {
    let result;

    try {
      const { class_id, level, academic_year, nis_prefix } =
        tambahSiswaForm.values;

      if (class_id) {
        result = await Student.GetStudentByClass(
          class_id.toString(),
          academic_year
        );
        tambahSiswaForm.setFieldValue("student_id", 0);
      } else if (level) {
        result = await Student.GetStudentByLevel(level, academic_year);
        tambahSiswaForm.setFieldValue("student_id", 0);
        tambahSiswaForm.setFieldValue("class_id", 0);
      }

      if (!result) return;

      let students = result.data.data.map((dat: any) => dat.student);

      if (nis_prefix && nis_prefix.length == 4) {
        students = students.filter((st: any) => st.nis.startsWith(nis_prefix));
      }

      setStudentsToAdd(students);
      setStudentsToAddShow(students);
    } catch {}
  };

  const filterStudentByNis = async () => {
    const len = tambahSiswaForm.values.nis_prefix.length;
    if (len == 4 || len == 0) getStudentsToAdd();
  };

  useEffect(() => {
    filterStudentByNis();
  }, [tambahSiswaForm.values.nis_prefix]);

  const getClassesInForm = async () => {
    try {
      const res = await Class.showAll(0, 1000);
      setClassesInForm(
        res.data.data.result.filter(
          (dat: any) => dat.level == tambahSiswaForm.values.level
        )
      );
    } catch {}
  };

  const selectOneStudent = () => {
    const { student_id } = tambahSiswaForm.values;
    if (!student_id) return;
    setStudentsToAdd(studentsToAdd.filter((dat: any) => dat.id == student_id));
  };

  useEffect(() => {
    getClassesInForm();
  }, [tambahSiswaForm.values.level]);

  useEffect(() => {
    getStudentsToAdd();
  }, [
    tambahSiswaForm.values.level,
    tambahSiswaForm.values.class_id,
    tambahSiswaForm.values.academic_year,
  ]);

  useEffect(() => {
    selectOneStudent();
  }, [tambahSiswaForm.values.student_id]);

  const [loadingDel, setLoadingDel] = useState(false);
  const handleDelete = async (id: any, student_name = "") => {
    setLoadingDel(true);
    Swal.fire({
      icon: "question",
      title: "Anda Yakin?",
      text: `Aksi ini akan menghapus data pembayaran ${student_name}`,
      showCancelButton: true,
      confirmButtonText: "Sip, Yakin",
      cancelButtonText: "Batalkan",
    }).then(async (result) => {
      try {
        if (result.isConfirmed) {
          await TagihanSiswa.delete(id);

          Swal.fire({
            icon: "success",
            title: "Sip Mantap",
            text: "Berhasil menghapus pembayaran siswa",
          });

          getDataList();
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Gagal menghapus pembayaran siswa",
        });
      } finally {
        setLoadingDel(false);
      }
    });
  };

  const [evidenceInModal, setEvidenceInModal] = useState("");

  useEffect(() => {
    if (evidenceInModal) openModal(modalBuktiBayar);
  }, [evidenceInModal]);

  const [loadingConfirm, setLoadingConfirm] = useState(false);
  const handleConfirm = async (id: any, student_name: string = "") => {
    setLoadingConfirm(true);

    Swal.fire({
      icon: "question",
      title: "Anda Yakin?",
      text: `Yakin sudah mengecek dananya? aksi ini akan menandai status pembayaran ${student_name} sudah lunas`,
      showCancelButton: true,
      confirmButtonText: "Sip, Yakin",
      cancelButtonText: "Batalkan",
    }).then(async (result) => {
      try {
        if (result.isConfirmed) {
          await TagihanSiswa.confirmEvidence(id);

          Swal.fire({
            icon: "success",
            title: "Sip Mantap",
            text: "Berhasil menerima pembayaran",
          });

          getDataList();
        }
      } catch {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Gagal menerima pembayaran",
        });
      } finally {
        setLoadingConfirm(false);
      }
    });
  };

  return (
    <>
      <Modal id={modalBuktiBayar} onClose={() => setEvidenceInModal("")}>
        <h3 className="text-xl font-bold mb-3">Bukti Bayar</h3>
        <div className="w-full rounded">
          <img src={apiAssets.replace(`api/`, "") + evidenceInModal} alt="" />
        </div>
        <form className="modal-action" method="dialog">
          <button className="btn w-full btn-outline btn-primary">Tutup</button>
        </form>
      </Modal>

      <Modal id={modalFormTambah} onClose={() => resetForm()}>
        <form onSubmit={tambahSiswaForm.handleSubmit}>
          <h3 className="text-xl font-bold mb-6">Tambah Siswa</h3>

          <Input label="Tahun pelajaran" value={academicYear} disabled />

          <Select
            label="Jenjang"
            name="level"
            options={["TK", "SD", "SM"]}
            value={tambahSiswaForm.values.level}
            onChange={tambahSiswaForm.handleChange}
            errorMessage={tambahSiswaForm.errors.level}
          />

          <Input
            label="Angkatan"
            name="nis_prefix"
            placeholder="ex: 1617, 2324"
            maxLength={4}
            hint="Dicocokan berdasarkan awalan NIS, panjang minimal 4 karakter"
            disabled={!tambahSiswaForm.values.level}
            value={tambahSiswaForm.values.nis_prefix}
            onChange={tambahSiswaForm.handleChange}
            errorMessage={tambahSiswaForm.errors.nis_prefix}
          />

          <Select
            label="Kelas"
            name="class_id"
            disabled={!tambahSiswaForm.values.level}
            options={classesInForm}
            keyValue="id"
            keyDisplay="class_name"
            value={tambahSiswaForm.values.class_id}
            onChange={parseHandleChange}
            errorMessage={tambahSiswaForm.errors.class_id}
          />

          <Select
            label="Siswa"
            name="student_id"
            disabled={!tambahSiswaForm.values.class_id}
            options={studentsToAddShow}
            keyValue="id"
            keyDisplay="full_name"
            value={tambahSiswaForm.values.student_id}
            onChange={parseHandleChange}
            errorMessage={tambahSiswaForm.errors.student_id}
          />

          <div className="modal-action">
            <button
              disabled={studentsToAdd.length == 0}
              className="btn btn-primary"
              type="submit"
            >
              {tambahSiswaForm.isSubmitting ? (
                <span className="loading loading-dots loading-md mx-auto"></span>
              ) : (
                `Tambahkan ${studentsToAdd.length} Siswa`
              )}
            </button>
          </div>
        </form>
      </Modal>

      <div className="w-full flex justify-center flex-col items-center p-3">
        <div className="w-full p-3 bg-white rounded-lg">
          {/* breadcrumbs  */}
          <div className="breadcrumbs text-sm">
            <ul>
              <li>
                <Link to={"/keuangan"}>Home</Link>
              </li>
              <li>Pembayaran</li>
              <li>
                <Link to={"/keuangan/jenis-pembayaran"}>Jenis Pembayaran</Link>
              </li>
              <li>Detail Jenis Pembayaran</li>
            </ul>
          </div>

          <div className="w-full flex flex-wrap justify-end my-3 gap-2">
            {/* search bar  */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleFilter("search", search);
              }}
              className="join"
            >
              <label className="input input-bordered flex items-center gap-2">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  type="text"
                  placeholder="Cari Siswa"
                  className="grow"
                />
                <FaSearch />
              </label>
            </form>

            {/* filters  */}
            <select
              value={filter.classId}
              onChange={(e) => handleFilter("classId", e.target.value)}
              className="select select-bordered w-fit"
            >
              <option value={""}>Pilih Kelas</option>
              {classes.map((dat, i) => (
                <option value={dat.id} key={i}>
                  {dat.class_name}
                </option>
              ))}
            </select>

            <button
              onClick={() => openModal(modalFormTambah)}
              className="btn btn-ghost bg-blue-500 text-white"
            >
              Tambah
            </button>
          </div>

          {/* data  */}
          <div className="overflow-x-auto">
            <table className="table table-zebra">
              {/* head */}
              <thead className="bg-blue-400">
                <tr>
                  <th>No</th>
                  <th>Nama</th>
                  <th>NIS</th>
                  <th>Pembayaran</th>
                  <th>Status</th>
                  <th>Bukti Bayar</th>
                  <th>Tanggal Bayar</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {dataList.map((dat, i) => (
                  <tr key={i}>
                    <th>{i + 1}</th>
                    <td>
                      <p className="text-lg line-clamp-2">
                        {dat.student?.full_name ?? "-"}
                      </p>
                    </td>
                    <td>{dat.student?.nis ?? "-"}</td>
                    <td>{dat.studentpaymentbill?.name ?? "-"}</td>
                    <td>
                      <p
                        className={
                          "font-extrabold whitespace-nowrap " +
                          (dat.status.toLowerCase() == "lunas"
                            ? "text-success"
                            : "") +
                          (dat.status.toLowerCase() == "belum lunas"
                            ? "text-error"
                            : "")
                        }
                      >
                        {dat.status?.toUpperCase() ?? "-"}
                      </p>
                    </td>
                    <td>
                      <button
                        disabled={dat.evidence_path == null}
                        className="btn btn-ghost btn-sm text-2xl "
                        onClick={() => setEvidenceInModal(dat.evidence_path)}
                      >
                        <MdInsertPhoto />
                      </button>
                    </td>
                    <td className="whitespace-nowrap">
                      {dat.paidoff_at
                        ? formatTime(dat.paidoff_at, "DD MMMM YYYY HH:mm")
                        : "-"}
                    </td>

                    <td>
                      <div className="join">
                        <button
                          className="btn btn-ghost btn-sm join-item bg-success text-white tooltip"
                          data-tip="Terima"
                          disabled={
                            dat.status?.toLowerCase() == "lunas" ||
                            loadingConfirm
                          }
                          onClick={() =>
                            handleConfirm(dat.id, dat.student?.full_name ?? "")
                          }
                        >
                          <FaCheck />
                        </button>
                        <button
                          className="btn btn-ghost btn-sm join-item bg-red-500 text-white tooltip"
                          data-tip="Hapus"
                          disabled={loadingDel}
                          onClick={() =>
                            handleDelete(dat.id, dat.student?.full_name ?? "")
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
    </>
  );
};

export default DetailJenisPembayaran;
