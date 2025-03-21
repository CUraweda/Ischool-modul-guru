// import React from "react";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import Swal from "sweetalert2";
import * as Yup from "yup";
import { Input, Select, Textarea } from "../../component/Input";
import Modal, { closeModal, openModal } from "../../component/modal";
import {
  IpageMeta,
  PaginationControl,
} from "../../component/PaginationControl";
import { PosPembayaran } from "../../middleware/api";

const posPembayaranSchema = Yup.object().shape({
  name: Yup.string().required("Nama pos pembayaran harus diisi"),
  desc: Yup.string().required("Keterangan harus diisi"),
  billing_cycle: Yup.string()
    .oneOf(["Bulanan", "Tahunan", "Sekali"], "Siklus pembayaran harus dipilih")
    .required("Siklus pembayaran harus dipilih"),
});

function PosKeuangan() {
  // page states
  const [dataIdxInForm, setDataIdxInForm] = useState<any>(null);
  const [dataList, setDataList] = useState<any[]>([]);
  const [pageMeta, setPageMeta] = useState<IpageMeta>({ page: 0, limit: 10 });
  const [filter, setFilter] = useState({
    page: 0,
    limit: 10,
  });

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
      const res = await PosPembayaran.showAll("", filter.page, filter.limit);

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
          ? await PosPembayaran.create(values)
          : await PosPembayaran.update(dataList[dataIdxInForm].id, values);

        closeModal("form-pos-pembayaran");

        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: `Berhasil ${
            dataIdxInForm != null ? "memperbarui" : "menambahkan"
          } data pos pembayaran`,
        });

        setDataIdxInForm(null);
        getDataList();
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `Gagal ${
            dataIdxInForm != null ? "memperbarui" : "menambahkan"
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
    Swal.fire({
      icon: "question",
      title: "Anda Yakin?",
      text: `Aksi ini tidak dapat dibatalkan. Apakah Anda yakin ingin melanjutkan?`,
      showCancelButton: true,
      confirmButtonText: "Yakin",
      cancelButtonText: "Batalkan",
    }).then(async (result) => {
      try {
        if (result.isConfirmed) {
          await PosPembayaran.delete(id);

          Swal.fire({
            icon: "success",
            title: "Aksi Berhasil",
            text: "Berhasil menghapus data pos pembayaran",
          });

          getDataList();
        }
      } catch {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Gagal menghapus data pos pembayaran",
        });
      }
    });
  };

  return (
    <>
      {/* modal form  */}
      <Modal onClose={() => setDataIdxInForm(null)} id="form-pos-pembayaran">
        <form onSubmit={posPembayaranForm.handleSubmit}>
          <h3 className="text-xl font-bold mb-6">
            {dataIdxInForm != null ? "Edit" : "Tambah"} Pos Pembayaran
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
        <div className="w-full p-3 bg-white rounded-lg">
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
}

export default PosKeuangan;
