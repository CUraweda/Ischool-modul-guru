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
  PosJenisPembayaran,
  PosPembayaran,
} from "../../midleware/api";
import { Store } from "../../store/Store";
import Swal from "sweetalert2";

const jenisPembayaranSchema = Yup.object().shape({
  name: Yup.string().required("Keterangan harus diisi"),
  payment_post_id: Yup.number().required("Pos pembayaran harus dipilih satu"),
  due_date: Yup.date().required("Tanggal jatuh tempo harus diisi"),
  total: Yup.number().required("Total bayar harus ditentukan"),
  academic_year: Yup.string().required("Tahun pembelajaran harus dipilih"),
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
  const [postPayments, setPostPayments] = useState<any[]>([]);

  const jenisPembayaranForm = useFormik({
    initialValues: {
      name: "",
      payment_post_id: 0,
      due_date: "",
      academic_year: "",
      total: "",
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
        jenisPembayaranForm.setValues({
          name: data.data.name,
          payment_post_id: data.data.payment_post_id,
          due_date: moment(data.data.due_date).format("YYYY-MM-DD"),
          academic_year: data.data.academic_year,
          total: data.data.total,
        });

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
                      <p className="text-xl font-bold">
                        {dat.total ? moneyFormat(dat.total) : "Rp -"}
                      </p>
                    </td>

                    <td>
                      <div className="join">
                        <Link
                          className="btn flex btn-ghost btn-sm join-item bg-blue-500 text-white tooltip"
                          data-tip="Detail"
                          to={"/keuangan/jenis-pembayaran/" + dat.id}
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
