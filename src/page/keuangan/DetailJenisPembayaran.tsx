// import React from "react";
import moment from "moment";
import { useEffect, useState } from "react";
import { FaCheck, FaSearch, FaTrash } from "react-icons/fa";
import { MdInsertPhoto } from "react-icons/md";
import { Class, Student, TagihanSiswa } from "../../midleware/api";
import { Store } from "../../store/Store";
import Modal, { closeModal, openModal } from "../../component/modal";
import { Select } from "../../component/Input";
import { Link, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import * as Yup from "yup";
import { useFormik } from "formik";

const tambahSiswaSchema = Yup.object().shape({
  level: Yup.string()
    .oneOf(["TK", "SD", "SM"], "Pilih antara TK, SD, atau SM")
    .required("Pilih antara TK, SD, atau SM"),
  class_id: Yup.number().optional(),
  student_id: Yup.number().optional(),
});

const DetailJenisPembayaran = () => {
  const { token } = Store(),
    { id: billId } = useParams(),
    modalFormTambah = "form-tambah-siswa";

  // data state
  const [classes, setClasses] = useState<any[]>([]);
  const [dataList, setDataList] = useState<any[]>([]);
  const [pageMeta, setPageMeta] = useState<any>({ page: 0 });
  const [filter, setFilter] = useState({
    page: 0,
    search: "",
    classId: "",
  });

  // UI states
  const [search, setSearch] = useState<string>("");

  const handleFilter = (key: string, value: string) => {
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
        token,
        filter.search,
        billId,
        filter.page
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
      const res = await Class.showAll(token, 0, 1000);
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
    },
    validateOnChange: false,
    validationSchema: tambahSiswaSchema,
    onSubmit: async (_, { setSubmitting }) => {
      setSubmitting(true);

      try {
        const res = await TagihanSiswa.bulkCreate(token, {
          student_ids: studentsToAdd.map((dat: any) => dat.id),
          payment_bill_id: billId,
        });

        getDataList();
        const lenCreated = res.data.data.length;

        Swal.fire({
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
      const { class_id, level } = tambahSiswaForm.values;

      if (class_id) {
        result = await Student.GetStudentByClass(token, class_id, "2023/2024");
        tambahSiswaForm.setFieldValue("student_id", 0);
      } else if (level) {
        result = await Student.GetStudentByLevel(token, level, "2023/2024");
        tambahSiswaForm.setFieldValue("student_id", 0);
        tambahSiswaForm.setFieldValue("class_id", 0);
      }

      if (!result) return;

      const students = result.data.data.map((dat: any) => dat.student);
      setStudentsToAdd(students);
      setStudentsToAddShow(students);
    } catch {}
  };

  const getClassesInForm = async () => {
    try {
      const res = await Class.showAll(token, 0, 1000);
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
  }, [tambahSiswaForm.values.level, tambahSiswaForm.values.class_id]);

  useEffect(() => {
    selectOneStudent();
  }, [tambahSiswaForm.values.student_id]);

  const [loadingDel, setLoadingDel] = useState(false);
  const handleDelete = async (id: any) => {
    setLoadingDel(true);
    try {
      await TagihanSiswa.delete(token, id);

      Swal.fire({
        icon: "success",
        title: "Sip Mantap",
        text: "Berhasil menghapus siswa",
      });

      getDataList();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Gagal menghapus siswa",
      });
    } finally {
      setLoadingDel(false);
    }
  };

  return (
    <>
      <Modal id={modalFormTambah} onClose={() => tambahSiswaForm.resetForm()}>
        <form onSubmit={tambahSiswaForm.handleSubmit}>
          <h3 className="text-xl font-bold mb-6">Tambah Siswa</h3>
          <Select
            label="Jenjang"
            name="level"
            options={["TK", "SD", "SM"]}
            value={tambahSiswaForm.values.level}
            onChange={tambahSiswaForm.handleChange}
            errorMessage={tambahSiswaForm.errors.level}
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
        <div className="w-full p-3 bg-white">
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

          <div className="w-full flex justify-end my-3 gap-2">
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
                    <td>{dat.student?.full_name ?? "-"}</td>
                    <td>{dat.student?.nis ?? "-"}</td>
                    <td>{dat.studentpaymentbill?.name ?? "-"}</td>
                    <td>
                      <p
                        className={
                          "font-extrabold " +
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
                      >
                        <MdInsertPhoto />
                      </button>
                    </td>
                    <td>
                      {dat.paidoff_at
                        ? moment(dat.paidoff_at).format("DD MMMM YYYY")
                        : "-"}
                    </td>

                    <td>
                      <div className="join">
                        <button
                          disabled={dat.status == "LUNAS"}
                          className="btn btn-ghost btn-sm join-item bg-success text-white tooltip"
                          data-tip="Terima"
                        >
                          <FaCheck />
                        </button>
                        <button
                          className="btn btn-ghost btn-sm join-item bg-red-500 text-white tooltip"
                          data-tip="Hapus"
                          disabled={loadingDel}
                          onClick={() => handleDelete(dat.id)}
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

          {/* pagination control  */}
          <div className="w-full justify-end flex mt-3">
            <div className="join">
              <button
                className="join-item btn"
                onClick={() =>
                  handleFilter("page", (pageMeta.page - 1).toString())
                }
                disabled={pageMeta.page == 0}
              >
                «
              </button>
              <button className="join-item btn">
                Page {pageMeta.page + 1}
              </button>
              <button
                className="join-item btn"
                onClick={() =>
                  handleFilter("page", (pageMeta.page + 1).toString())
                }
                disabled={pageMeta.page + 1 == pageMeta.totalPage}
              >
                »
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DetailJenisPembayaran;
