import { useState, useEffect } from "react";
import { DashboardSiswa } from "../../midleware/api";
import { Store } from "../../store/Store";
import { FaEdit, FaRegTrashAlt } from "react-icons/fa";
import Modal from "../../component/modal";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";

const validationSchema = Yup.object({
  topic: Yup.string().required("Topik tidak boleh kosong"),
  meaningful_understanding: Yup.string().required(
    "Pemahaman tidak boleh kosong"
  ),
  period: Yup.string().required("Periode tidak boleh kosong"),
  tup: Yup.string().required("TUP tidak boleh kosong"),
  status: Yup.string().required("Status tidak boleh kosong"),
});

const OverviewSiswa = () => {
  const { token } = Store();
  const [overview, setOverview] = useState<any>([]);
  const [idOverview, setIdOverview] = useState<string>("");

  const formik = useFormik({
    initialValues: {
      topic: "",
      meaningful_understanding: "",
      period: "",
      tup: "",
      status: "",
    },
    validationSchema,
    onSubmit: (values) => {
      console.log(values);
    },
  });

  useEffect(() => {
    getOverview();
  }, []);

  const showModal = (props: string) => {
    let modalElement = document.getElementById(props) as HTMLDialogElement;
    if (modalElement) {
      modalElement.showModal();
    }
  };

  const closeModal = (props: string) => {
    let modalElement = document.getElementById(props) as HTMLDialogElement;
    if (modalElement) {
      modalElement.close();
    }
  };

  const getOverview = async () => {
    const response = await DashboardSiswa.getAllOverView(token);
    setOverview(response?.data?.data?.result);
  };

  const handleCreateOverview = async () => {
    try {
      const { topic, meaningful_understanding, tup, period, status } =
        formik.values;
      const data = {
        topic,
        meaningful_understanding,
        period,
        tup,
        status,
      };
      await DashboardSiswa.createOverview(token, data);

      formik.resetForm();
      getOverview();
      closeModal("add-overview");
      alert();
    } catch (error) {
      console.log(error);
    }
  };

  const GetByIdOverview = async (id: string) => {
    try {
      const response = await DashboardSiswa.getByIdOverView(token, id);

      const data = response.data.data;
      console.log(data);
      formik.setFieldValue("topic", data.topic);
      formik.setFieldValue("period", data.period);
      formik.setFieldValue(
        "meaningful_understanding",
        data.meaningful_understanding
      );
      formik.setFieldValue("tup", data.tup);
      formik.setFieldValue("status", data.status);
    } catch (error) {
      console.log(error);
    }
  };

  const trigerEdit = async (id: string) => {
    showModal("edit-overview");
    setIdOverview(id);
    GetByIdOverview(id);
  };

  const EditOverview = async () => {
    try {
      const { topic, meaningful_understanding, tup, period, status } =
        formik.values;
      const data = {
        topic,
        meaningful_understanding,
        period,
        tup,
        status,
      };
      await DashboardSiswa.UpdateOverview(
        token,
        idOverview,
        data
      );

      getOverview();
      closeModal("edit-overview");
      formik.resetForm();
      alert();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteOverview = async (id: string) => {
    await DashboardSiswa.DeleteOverview(token, id);
    Swal.fire({
      title: "Deleted!",
      text: "Your data has been deleted.",
      icon: "success",
    });
    getOverview();
  };

  const deleteOverviewTriger = async (id: string) => {
    try {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          deleteOverview(id);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const alert = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Your work has been saved",
      showConfirmButton: false,
      timer: 1500,
    });
  };
  return (
    <>
      <div className="overflow-x-auto">
        <div className="w-full flex justify-end">
          <button
            id="tambah-pengumuman"
            className="btn btn-ghost bg-green-500 text-white"
            onClick={() => showModal("add-overview")}
          >
            tambah
          </button>
        </div>
        <table className="table table-zebra mt-4">
          {/* head */}
          <thead className="bg-blue-300">
            <tr>
              <th>No</th>
              <th>Tema</th>
              <th>Pemahaman</th>
              <th>Periode</th>
              <th>TUP</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {overview?.map((item: any, index: number) => (
              <tr key={index}>
                <th>{index + 1}</th>
                <td>{item?.topic}</td>
                <td>{item?.meaningful_understanding}</td>
                <td>{item?.period}</td>
                <td>{item?.tup}</td>
                <td>{item?.status}</td>
                {/* <td>{item?.status}</td> */}
                <td>
                  <div className="flex gap-1 text-xl">
                    <button
                      className="btn btn-ghost btn-sm text-xl text-orange-500"
                      onClick={() => trigerEdit(item?.id)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="btn btn-ghost btn-sm text-xl text-red-500"
                      onClick={() => deleteOverviewTriger(item?.id)}
                    >
                      <FaRegTrashAlt />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal id="add-overview">
        <div className="w-full flex flex-col items-center">
          <span className="font-bold">Tambah Overview</span>
          <form action="" onSubmit={formik.handleSubmit} className="w-full">
            <div className="w-full flex flex-col gap-2 mt-5">
              <label htmlFor="" className="font-bold">
                Topik
              </label>
              <div className="flex gap-1 justify-center items-center w-full ">
                <input
                  type="text"
                  className={`input input-bordered w-full ${
                    formik.touched.topic && formik.errors.topic
                      ? "input-error"
                      : ""
                  }`}
                  name="topic"
                  value={formik.values.topic}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              {formik.touched.topic && formik.errors.topic ? (
                <div className="text-red-500 text-xs">
                  {formik.errors.topic}
                </div>
              ) : null}
            </div>
            <div className="w-full flex flex-col gap-2 mt-5">
              <label htmlFor="" className="font-bold">
                Pemahaman
              </label>
              <div className="flex gap-1 justify-center items-center w-full ">
                <input
                  type="text"
                  className={`input input-bordered w-full ${
                    formik.touched.meaningful_understanding &&
                    formik.errors.meaningful_understanding
                      ? "input-error"
                      : ""
                  }`}
                  name="meaningful_understanding"
                  value={formik.values.meaningful_understanding}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              {formik.touched.meaningful_understanding &&
              formik.errors.meaningful_understanding ? (
                <div className="text-red-500 text-xs">
                  {formik.errors.meaningful_understanding}
                </div>
              ) : null}
            </div>
            <div className="w-full flex flex-col gap-2 mt-5">
              <label htmlFor="" className="font-bold">
                Periode
              </label>
              <div className="flex gap-1 justify-center items-center w-full ">
                <select
                  className={`select select-bordered w-full ${
                    formik.touched.period && formik.errors.period
                      ? "select-error"
                      : ""
                  }`}
                  name="period"
                  value={formik.values.period}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  <option value={""}>Pilih periode</option>
                  <option value={"2023/2024"}>2023/2024</option>
                  <option value={"2024/2025"}>2024/2025</option>
                </select>
              </div>
              {formik.touched.period && formik.errors.period ? (
                <div className="text-red-500 text-xs">
                  {formik.errors.period}
                </div>
              ) : null}
            </div>
            <div className="w-full flex flex-col gap-2 mt-5">
              <label htmlFor="" className="font-bold">
                TUP
              </label>
              <div className="flex gap-1 justify-center items-center w-full ">
                <textarea
                  placeholder="TUP"
                  className={`textarea textarea-bordered w-full ${
                    formik.touched.tup && formik.errors.tup
                      ? "textarea-error"
                      : ""
                  }`}
                  name="tup"
                  value={formik.values.tup}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              {formik.touched.tup && formik.errors.tup ? (
                <div className="text-red-500 text-xs">{formik.errors.tup}</div>
              ) : null}
            </div>
            <div className="w-full flex flex-col gap-2 mt-5">
              <label htmlFor="" className="font-bold">
                Status
              </label>
              <div className="flex gap-1 justify-center items-center w-full ">
                <select
                  className={`select select-bordered w-full ${
                    formik.touched.status && formik.errors.status
                      ? "select-error"
                      : ""
                  }`}
                  name="status"
                  value={formik.values.status}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  <option value={""}>Pilih status</option>
                  <option value={"Aktif"}>Aktif</option>
                  <option value={"Non Aktif"}>Non Aktif</option>
                </select>
              </div>
              {formik.touched.status && formik.errors.status ? (
                <div className="text-red-500 text-xs">
                  {formik.errors.status}
                </div>
              ) : null}
            </div>
            <button
              className="btn btn-ghost w-full bg-green-500 text-white mt-5"
              onClick={handleCreateOverview}
            >
              Simpan
            </button>
          </form>
        </div>
      </Modal>
      <Modal id="edit-overview">
        <div className="w-full flex flex-col items-center">
          <span className="font-bold">Edit Overview</span>
          <form action="" onSubmit={formik.handleSubmit} className="w-full">
            <div className="w-full flex flex-col gap-2 mt-5">
              <label htmlFor="" className="font-bold">
                Topik
              </label>
              <div className="flex gap-1 justify-center items-center w-full ">
                <input
                  type="text"
                  className={`input input-bordered w-full ${
                    formik.touched.topic && formik.errors.topic
                      ? "input-error"
                      : ""
                  }`}
                  name="topic"
                  value={formik.values.topic}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              {formik.touched.topic && formik.errors.topic ? (
                <div className="text-red-500 text-xs">
                  {formik.errors.topic}
                </div>
              ) : null}
            </div>
            <div className="w-full flex flex-col gap-2 mt-5">
              <label htmlFor="" className="font-bold">
                Pemahaman
              </label>
              <div className="flex gap-1 justify-center items-center w-full ">
                <input
                  type="text"
                  className={`input input-bordered w-full ${
                    formik.touched.meaningful_understanding &&
                    formik.errors.meaningful_understanding
                      ? "input-error"
                      : ""
                  }`}
                  name="meaningful_understanding"
                  value={formik.values.meaningful_understanding}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              {formik.touched.meaningful_understanding &&
              formik.errors.meaningful_understanding ? (
                <div className="text-red-500 text-xs">
                  {formik.errors.meaningful_understanding}
                </div>
              ) : null}
            </div>
            <div className="w-full flex flex-col gap-2 mt-5">
              <label htmlFor="" className="font-bold">
                Periode
              </label>
              <div className="flex gap-1 justify-center items-center w-full ">
                <select
                  className={`select select-bordered w-full ${
                    formik.touched.period && formik.errors.period
                      ? "select-error"
                      : ""
                  }`}
                  name="period"
                  value={formik.values.period}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  <option value={""}>Pilih periode</option>
                  <option value={"2023/2024"}>2023/2024</option>
                  <option value={"2024/2025"}>2024/2025</option>
                </select>
              </div>
              {formik.touched.period && formik.errors.period ? (
                <div className="text-red-500 text-xs">
                  {formik.errors.period}
                </div>
              ) : null}
            </div>
            <div className="w-full flex flex-col gap-2 mt-5">
              <label htmlFor="" className="font-bold">
                TUP
              </label>
              <div className="flex gap-1 justify-center items-center w-full ">
                <textarea
                  placeholder="TUP"
                  className={`textarea textarea-bordered w-full ${
                    formik.touched.tup && formik.errors.tup
                      ? "textarea-error"
                      : ""
                  }`}
                  name="tup"
                  value={formik.values.tup}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              {formik.touched.tup && formik.errors.tup ? (
                <div className="text-red-500 text-xs">{formik.errors.tup}</div>
              ) : null}
            </div>
            <div className="w-full flex flex-col gap-2 mt-5">
              <label htmlFor="" className="font-bold">
                Status
              </label>
              <div className="flex gap-1 justify-center items-center w-full ">
                <select
                  className={`select select-bordered w-full ${
                    formik.touched.status && formik.errors.status
                      ? "select-error"
                      : ""
                  }`}
                  name="status"
                  value={formik.values.status}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  <option value={""}>Pilih status</option>
                  <option value={"Aktif"}>Aktif</option>
                  <option value={"Non Aktif"}>Non Aktif</option>
                </select>
              </div>
              {formik.touched.status && formik.errors.status ? (
                <div className="text-red-500 text-xs">
                  {formik.errors.status}
                </div>
              ) : null}
            </div>
            <button
              className="btn btn-ghost w-full bg-green-500 text-white mt-5"
              onClick={EditOverview}
            >
              Simpan
            </button>
          </form>
        </div>
      </Modal>
    </>
  );
};

export default OverviewSiswa;
