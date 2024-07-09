// import React from "react";
import { FaTrash } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import { Store } from "../../store/Store";
import { useEffect, useState } from "react";
import { PosPembayaran } from "../../midleware/api";
import Swal from "sweetalert2";
import Modal, { closeModal, openModal } from "../../component/modal";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Input, Select, Textarea } from "../../component/Input";

const posPembayaranSchema = Yup.object().shape({
  name: Yup.string().required("Nama pos pembayaran harus diisi"),
  desc: Yup.string().required("Keterangan harus diisi"),
  billing_cycle: Yup.string()
    .oneOf(["Bulanan", "Tahunan", "Sekali"], "Siklus pembayaran harus dipilih")
    .required("Siklus pembayaran harus dipilih"),
});

function PosKeuangan() {
  const { token } = Store();

  // page states
  const [dataIdxInForm, setDataIdxInForm] = useState<any>(null);
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
      const res = await PosPembayaran.showAll(token, "", filter.page);

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

  // entry point
  useEffect(() => {
    getDataList();
  }, [filter]);

  // create / update
  const posPembayaranForm = useFormik({
    initialValues: {
      name: "",
      desc: "",
      billing_cycle: "",
    },
    validateOnChange: false,
    validationSchema: posPembayaranSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);

      try {
        dataIdxInForm == null
          ? PosPembayaran.create(token, values)
          : await PosPembayaran.update(
              token,
              dataList[dataIdxInForm].id,
              values,
            );

        closeModal("form-pos-pembayaran");

        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: `Berhasil ${
            dataIdxInForm ? "memperbarui" : "menambahkan"
          } data pos pembayaran`,
        });

        setDataIdxInForm(null);
        getDataList();
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `Gagal ${
            dataIdxInForm ? "memperbarui" : "menambahkan"
          } data pos pembayaran`,
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  const fillPosPembayaranForm = () => {
    if (dataIdxInForm == null) {
      posPembayaranForm.setValues({
        name: "",
        desc: "",
        billing_cycle: "",
      });
    } else {
      posPembayaranForm.setValues({
        name: dataList[dataIdxInForm].name,
        desc: dataList[dataIdxInForm].desc,
        billing_cycle: dataList[dataIdxInForm].billing_cycle,
      });
      openModal("form-pos-pembayaran");
    }
  };

  useEffect(() => {
    fillPosPembayaranForm();
  }, [dataIdxInForm]);

  const handleDelete = async (id: any) => {
    try {
      await PosPembayaran.delete(token, id);

      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Berhasil menghapus data pos pembayaran",
      });

      getDataList();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Gagal menghapus data pos pembayaran",
      });
    }
  };

  return (
    <>
      {/* modal form  */}
      <Modal onClose={() => setDataIdxInForm(null)} id="form-pos-pembayaran">
        <form onSubmit={posPembayaranForm.handleSubmit}>
          <h3 className="text-xl font-bold mb-6">
            {dataIdxInForm ? "Edit" : "Tambah"} Pos Pembayaran
          </h3>
          <Input
            type="text"
            label="Nama"
            name="name"
            value={posPembayaranForm.values.name}
            onChange={posPembayaranForm.handleChange}
            errorMessage={posPembayaranForm.errors.name}
          />

          <Textarea
            label="Keterangan"
            name="desc"
            value={posPembayaranForm.values.desc}
            onChange={posPembayaranForm.handleChange}
            errorMessage={posPembayaranForm.errors.desc}
          />

          <Select
            label="Siklus pembayaran"
            name="billing_cycle"
            options={["Bulanan", "Tahunan", "Sekali"]}
            value={posPembayaranForm.values.billing_cycle}
            onChange={posPembayaranForm.handleChange}
            errorMessage={posPembayaranForm.errors.billing_cycle}
          />

          <div className="modal-action">
            <button
              disabled={posPembayaranForm.isSubmitting}
              onClick={() => posPembayaranForm.resetForm()}
              className="btn"
              type="button"
            >
              Atur ulang
            </button>
            <button
              disabled={posPembayaranForm.isSubmitting}
              className="btn btn-primary"
              type="submit"
            >
              {posPembayaranForm.isSubmitting ? (
                <span className="loading loading-dots loading-md mx-auto"></span>
              ) : (
                "Simpan"
              )}
            </button>
          </div>
        </form>
      </Modal>

      <div className="w-full flex justify-center flex-col items-center p-3">
        <span className="font-bold text-xl">POS PEMBAYARAN SISWA</span>
        <div className="w-full p-3 bg-white">
          <div className="w-full flex justify-end my-3 gap-3">
            <button
              onClick={() => {
                openModal("form-pos-pembayaran");
              }}
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
                  <th>Nama</th>
                  <th>Keterangan</th>
                  <th>Siklus Pembayaran</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {/* row 1 */}
                {dataList.map((dat, i) => (
                  <tr key={i}>
                    <th>{i + 1}</th>
                    <td>{dat.name ?? "-"}</td>
                    <td>{dat.desc ?? "-"}</td>
                    <td>{dat.billing_cycle ?? "-"}</td>
                    <td>
                      <div className="join">
                        <button
                          className="btn btn-ghost btn-sm join-item bg-orange-500 text-white tooltip"
                          data-tip="Edit"
                          onClick={() => setDataIdxInForm(i)}
                        >
                          <FaPencil />
                        </button>
                        <button
                          className="btn btn-ghost btn-sm join-item bg-red-500 text-white tooltip"
                          data-tip="Hapus"
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
}

export default PosKeuangan;
