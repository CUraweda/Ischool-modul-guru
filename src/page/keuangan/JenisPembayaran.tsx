// import React from "react";
import { FaRegFileAlt, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { FaPencil } from "react-icons/fa6";
import { useEffect, useState } from "react";
import moment from "moment";
import { getAcademicYears, moneyFormat } from "../../utils/common";
import Modal, { openModal, closeModal } from "../../component/modal";
import { Input, Select } from "../../component/Input";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Class,
  PosJenisPembayaran,
  PosPembayaran,
  Student,
} from "../../midleware/api";
import { Store } from "../../store/Store";
import Swal from "sweetalert2";

const jenisPembayaranSchema = Yup.object().shape({
  name: Yup.string().required("Keterangan harus diisi"),
  payment_post_id: Yup.number().required("Pos pembayaran harus dipilih satu"),
  due_date: Yup.date().required("Tanggal jatuh tempo harus diisi"),
  academic_year: Yup.string().required("Tahun pembelajaran harus dipilih"),
  total: Yup.number().required("Total bayar harus ditentukan"),
  level: Yup.string()
    .oneOf(["SD", "SM", "TK"])
    .required("Jenjang pendidikan harus dipilih satu"),
  class_id: Yup.number().optional(),
  student_id: Yup.number().optional(),
});

const JenisPembayaran = () => {
  const { token } = Store(),
    modalFormId = "form-jenis-pembayaran";

  // data state
  const [dataIdInForm, setDataIdInForm] = useState<any>(null);
  const [dataList, setDataList] = useState<any[]>([]);
  const [pageMeta, setPageMeta] = useState<any>({ page: 0 });
  const [filter, setFilter] = useState({
    page: 0,
  });

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
      const res = await PosJenisPembayaran.showAll(token, "", filter.page);

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

  // state in modal form
  const [students, setStudents] = useState<any[]>([]);
  const [postPayments, setPostPayments] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);

  const jenisPembayaranForm = useFormik({
    initialValues: {
      name: "",
      payment_post_id: 0,
      due_date: "",
      academic_year: "",
      total: "",
      level: "",
      class_id: 0,
      student_id: 0,
    },
    validateOnChange: false,
    validationSchema: jenisPembayaranSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);

      try {
        dataIdInForm == null
          ? await PosJenisPembayaran.create(token, values)
          : await PosJenisPembayaran.update(token, dataIdInForm, values);

        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: `Berhasil ${
            dataIdInForm ? "memperbarui" : "menambahkan"
          } data jenis pembayaran`,
        });

        setDataIdInForm(null);
        getDataList();
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `Gagal ${
            dataIdInForm ? "memperbarui" : "menambahkan"
          } data jenis pembayaran`,
        });
      } finally {
        setSubmitting(false);
        closeModal(modalFormId);
      }
    },
  });

  const getPostPayments = async () => {
    try {
      const res = await PosPembayaran.showAll(token, "", 0, 1000);
      if (res.data?.data?.result) setPostPayments(res.data.data.result);
    } catch {}
  };

  const getClasses = async () => {
    setClasses([]);
    try {
      const res = await Class.showAll(token, 0, 1000);
      const classByLevel: any[] = res.data.data.result.filter(
        (dat: any) => dat.level == jenisPembayaranForm.values.level
      );
      if (
        !classByLevel.find((c) => c.id == jenisPembayaranForm.values.class_id)
      ) {
        jenisPembayaranForm.setFieldValue("class_id", 0);
        jenisPembayaranForm.setFieldValue("student_id", 0);
      }

      setClasses(classByLevel);
    } catch {}
  };

  const getStudents = async () => {
    setStudents([]);
    try {
      const { academic_year, class_id } = jenisPembayaranForm.values;
      if (!class_id || !academic_year) return;
      const res = await Student.GetStudentByClass(
        token,
        class_id,
        academic_year
      );
      const studentList: any[] = res.data.data.map((dat: any) => dat.student);
      if (
        !studentList.find((d) => d.id == jenisPembayaranForm.values.student_id)
      )
        jenisPembayaranForm.setFieldValue("student_id", 0);

      setStudents(studentList);
    } catch {}
  };

  useEffect(() => {
    getStudents();
  }, [
    jenisPembayaranForm.values.class_id,
    jenisPembayaranForm.values.academic_year,
  ]);

  useEffect(() => {
    getClasses();
  }, [jenisPembayaranForm.values.level]);

  const handleOpenForm = () => {
    getPostPayments();
    openModal(modalFormId);
  };

  const parseHandleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    jenisPembayaranForm.setFieldValue(
      name,
      value == "" ? undefined : parseInt(value)
    );
  };

  const [loadingGetOne, setLoadingGetOne] = useState(false);

  const fillJenisPembayaranForm = async () => {
    if (dataIdInForm == null) {
      jenisPembayaranForm.resetForm();
    } else {
      setLoadingGetOne(true);
      try {
        const { data } = await PosJenisPembayaran.showOne(token, dataIdInForm);
        jenisPembayaranForm.setFieldValue("name", data.data.name);
        jenisPembayaranForm.setFieldValue(
          "payment_post_id",
          data.data.payment_post_id
        );
        jenisPembayaranForm.setFieldValue(
          "due_date",
          moment(data.data.due_date).format("YYYY-MM-DD")
        );
        jenisPembayaranForm.setFieldValue(
          "academic_year",
          data.data.academic_year
        );
        jenisPembayaranForm.setFieldValue("total", data.data.total);
        jenisPembayaranForm.setFieldValue("level", data.data.level);
        jenisPembayaranForm.setFieldValue("class_id", data.data.class_id);
        jenisPembayaranForm.setFieldValue("student_id", data.data.student_id);

        handleOpenForm();
      } catch (error) {
        setDataIdInForm(null);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Gagal mendapatkan data jenis pembayaran",
        });
      } finally {
        setLoadingGetOne(false);
      }
    }
  };

  useEffect(() => {
    fillJenisPembayaranForm();
  }, [dataIdInForm]);

  const [loadingDelete, setLoadingDelete] = useState(false);
  const handleDelete = async (id: any) => {
    setLoadingDelete(true);
    try {
      await PosJenisPembayaran.delete(token, id);

      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Berhasil menghapus data jenis pembayaran",
      });

      getDataList();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Gagal menghapus data jenis pembayaran",
      });
    } finally {
      setLoadingDelete(false);
    }
  };

  return (
    <>
      <Modal id={modalFormId} onClose={() => setDataIdInForm(null)}>
        <form onSubmit={jenisPembayaranForm.handleSubmit}>
          <h3 className="text-xl font-bold mb-6">
            {dataIdInForm ? "Edit" : "Tambah"} Jenis Pembayaran
          </h3>

          <Input
            label="Keterangan"
            name="name"
            value={jenisPembayaranForm.values.name}
            onChange={jenisPembayaranForm.handleChange}
            errorMessage={jenisPembayaranForm.errors.name}
          />

          <Select
            label="Pos pembayaran"
            name="payment_post_id"
            type="number"
            options={postPayments}
            keyValue="id"
            keyDisplay="name"
            value={jenisPembayaranForm.values.payment_post_id}
            onChange={parseHandleChange}
            errorMessage={jenisPembayaranForm.errors.payment_post_id}
          />

          <Input
            type="date"
            label="Jatuh tempo"
            name="due_date"
            value={jenisPembayaranForm.values.due_date}
            onChange={jenisPembayaranForm.handleChange}
            errorMessage={jenisPembayaranForm.errors.due_date}
          />

          <Select
            label="Tahun pembelajaran"
            name="academic_year"
            options={getAcademicYears()}
            value={jenisPembayaranForm.values.academic_year}
            onChange={jenisPembayaranForm.handleChange}
            errorMessage={jenisPembayaranForm.errors.academic_year}
          />

          <Input
            type="number"
            label="Total"
            name="total"
            value={jenisPembayaranForm.values.total}
            onChange={jenisPembayaranForm.handleChange}
            errorMessage={jenisPembayaranForm.errors.total}
          />

          <Select
            label="Jenjang"
            name="level"
            options={["TK", "SD", "SM"]}
            value={jenisPembayaranForm.values.level}
            onChange={jenisPembayaranForm.handleChange}
            errorMessage={jenisPembayaranForm.errors.level}
          />

          <div className="divider">Khusus</div>

          <Select
            label="Kelas"
            name="class_id"
            type="number"
            helpMessage="Opsional"
            options={classes}
            keyValue="id"
            keyDisplay="class_name"
            disabled={!jenisPembayaranForm.values.level}
            value={jenisPembayaranForm.values.class_id}
            onChange={parseHandleChange}
            errorMessage={jenisPembayaranForm.errors.class_id}
          />

          <Select
            label="Siswa"
            name="student_id"
            type="number"
            helpMessage="Opsional"
            options={students}
            keyValue="id"
            keyDisplay="full_name"
            disabled={
              !jenisPembayaranForm.values.academic_year ||
              !jenisPembayaranForm.values.class_id
            }
            value={jenisPembayaranForm.values.student_id}
            onChange={parseHandleChange}
            errorMessage={jenisPembayaranForm.errors.student_id}
          />

          <div className="modal-action">
            <button
              disabled={jenisPembayaranForm.isSubmitting}
              className="btn"
              onClick={jenisPembayaranForm.handleReset}
              type="reset"
            >
              Atur ulang
            </button>
            <button
              disabled={jenisPembayaranForm.isSubmitting}
              className="btn btn-primary"
              type="submit"
            >
              {jenisPembayaranForm.isSubmitting ? (
                <span className="loading loading-dots loading-md mx-auto"></span>
              ) : (
                "Simpan"
              )}
            </button>
          </div>
        </form>
      </Modal>

      <div className="w-full flex justify-center flex-col items-center p-3">
        <span className="font-bold text-xl">JENIS PEMBAYARAN</span>
        <div className="w-full p-3 bg-white">
          <div className="w-full flex justify-end my-3 gap-2">
            <select className="select select-bordered w-32">
              <option>Filter</option>
              <option>Han Solo</option>
              <option>Greedo</option>
            </select>
            <button
              onClick={handleOpenForm}
              className="btn btn-ghost bg-blue-500 text-white"
            >
              Tambah
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="table table-zebra">
              {/* head */}
              <thead className="bg-blue-400">
                <tr>
                  <th>No</th>
                  <th>Keterangan</th>
                  <th>POS</th>
                  <th>Jatuh Tempo</th>
                  <th>Siswa</th>
                  <th>Total</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {dataList.map((dat, i) => (
                  <tr key={i}>
                    <th>{i + 1}</th>
                    <td>
                      <p className="text-lg">{dat.name}</p>
                      <p className="text-xs text-gray-400">
                        {dat.academic_year}
                      </p>
                    </td>
                    <td>{dat.paymentpost?.name ?? "-"}</td>
                    <td>
                      {dat.due_date
                        ? moment(dat.due_date).format("DD MMMM YYYY")
                        : "-"}
                    </td>
                    <td>
                      <div className="flex flex-wrap gap-2 max-w-40">
                        <div className="badge badge-primary">{dat.level}</div>
                        {dat.class && (
                          <div className="badge badge-secondary">
                            {dat.class.class_name}
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <p className="text-xl font-bold">
                        {dat.total ? moneyFormat(dat.total) : "Rp -"}
                      </p>
                    </td>

                    <td>
                      <div className="join">
                        <Link
                          className="btn flex btn-ghost btn-sm join-item bg-blue-500 text-white tooltip"
                          data-tip="Detail"
                          to={"/keuangan/jenis-pembayaran/detail"}
                        >
                          <FaRegFileAlt />
                        </Link>
                        <button
                          className="btn btn-ghost btn-sm join-item bg-orange-500 text-white tooltip"
                          data-tip="Edit"
                          disabled={loadingGetOne}
                          onClick={() => setDataIdInForm(dat.id)}
                        >
                          {loadingGetOne && dataIdInForm == dat.id ? (
                            <span className="loading loading-dots loading-md mx-auto"></span>
                          ) : (
                            <FaPencil />
                          )}
                        </button>
                        <button
                          className="btn btn-ghost btn-sm join-item bg-red-500 text-white tooltip"
                          data-tip="Hapus"
                          disabled={loadingDelete}
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

export default JenisPembayaran;
