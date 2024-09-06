import { BsDownload } from "react-icons/bs";
import { Lesson } from "../../midleware/api";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Store } from "../../store/Store";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { BsPencilFill } from "react-icons/bs";
const BahanAjar: React.FC<{}> = () => {
  const { token } = Store();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [DataLesson, setDataLesson] = useState<any[]>([]);
  const [selectedUpdate, setSelectedUpdate] = useState<any>();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalType, setModalType] = useState<boolean>(true);
  const [filter, setFilter] = useState({
    page: 0,
    limit: 10,
    search: "",
    totalRows: 0,
    totalPage: 0,
  });

  const getLesson = async () => {
    try {
      const res = await Lesson.getAllData(token);
      setDataLesson(res.data.data);
      setFilter((prev) => ({
        ...prev,
        page: res.data.page,
        totalRows: res.data.totalRows,
        totalPage: res.data.totalPage,
      }));
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Data tidak ditemukan",
      });
    }
  };

  const createLesson = async (payload: any) => {
    try {
      const res = await Lesson.CreateNewLesson(token, payload);
      if (res.data.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Berhasil dibuat",
          showConfirmButton: true,
          timer: 1500,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };
  const updateDataLesson = async (payload: any, id: number) => {
    try {
      const res = await Lesson.UpdateLesson(token, payload, id);
      if (res.data.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Berhasil dirubah",
          showConfirmButton: true,
          timer: 1500,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getLesson();
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setSelectedFile(file || null);
  };
  // Validation schema for formik
  const validationSchema = Yup.object({
    assignments_name: Yup.string().required("Required"),
    subjects_name: Yup.string().required("Required"),
    class: Yup.string().required("Required"),
    description: Yup.string().required("Required"),
  });

  const handleSubmit = async (values: any) => {
    const formData = new FormData();
    formData.append("assignments_name", values.assignments_name);
    formData.append("subjects_name", values.subjects_name);
    formData.append("class", values.class);
    formData.append("description", values.description);
    if (selectedFile) {
      formData.append("file", selectedFile);
    }
    try {
      if (modalType) {
        createLesson(formData);
      } else {
        updateDataLesson(formData, selectedUpdate.id);
      }
      console.log(values);
      setShowModal(false);
    } catch (error) {
      Swal.fire("Error", "Failed to add lesson", "error");
    }
  };

  return (
    <>
      {showModal && (
        <dialog
          className="modal modal-open"
          onClick={() => setShowModal(false)}
        >
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <button
              className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2"
              onClick={() => setShowModal(false)}
            >
              ✕
            </button>
            <h3 className="text-lg font-bold">Tambah Bahan Ajar</h3>

            {/* Formik form inside modal */}
            <Formik
              initialValues={{
                assignments_name: "",
                subjects_name: "",
                class: "",
                description: "",
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ setFieldValue }) => (
                <Form className="form-control">
                  <div className="mb-4 w-full">
                    <label htmlFor="assignments_name" className="label">
                      Nama Tugas
                    </label>
                    <Field
                      name="assignments_name"
                      type="text"
                      className="input input-bordered w-full"
                    />
                    <ErrorMessage
                      name="assignments_name"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                  <div className="mb-4 w-full">
                    <label htmlFor="subjects_name" className="label">
                      Mapel
                    </label>
                    <Field
                      name="subjects_name"
                      as="select"
                      className="input input-bordered w-full"
                    >
                      <option value="">Pilih Mapel</option>
                      <option value="IPA">IPA</option>
                      <option value="IPS">IPS</option>
                      <option value="MTK">MTK</option>
                      <option value="PKN">PKN</option>
                    </Field>
                    <ErrorMessage
                      name="subjects_name"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  <div className="mb-4 w-full">
                    <label htmlFor="class" className="label">
                      Kelas
                    </label>
                    <Field
                      name="class"
                      type="text"
                      className="input input-bordered w-full"
                    />
                    <ErrorMessage
                      name="class"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                  <div className="mb-4 w-full">
                    <label className="label">Upload File</label>
                    <input
                      type="file"
                      name="file"
                      className="file-input file-input-bordered w-full"
                      onChange={(event) => {
                        handleFileChange(event);
                        setFieldValue("file", event.currentTarget.files?.[0]);
                      }}
                    />
                  </div>

                  <div className="mb-4 w-full">
                    <label htmlFor="description" className="label">
                      Keterangan
                    </label>
                    <Field
                      name="description"
                      as="textarea"
                      className="input input-bordered w-full min-h-[100px]"
                    />
                    <ErrorMessage
                      name="description"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  <div className="modal-action">
                    <button
                      type="submit"
                      className="btn bg-blue-500 text-white"
                    >
                      Simpan
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </dialog>
      )}

      <div className="w-full flex flex-col items-center">
        <div className="w-full flex justify-center mt-10">
          <span className="text-4xl font-bold">Bahan Ajar Guru</span>
        </div>

        <div className="w-full flex justify-center mt-10 flex-col items-center">
          <div className="w-full justify-between flex px-5">
            <select className="select select-primary w-32 max-w-xs">
              <option disabled selected>
                Mapel
              </option>
              <option>IPA</option>
              <option>IPS</option>
              <option>MTK</option>
              <option>PKN</option>
            </select>
            <div className="join">
              <button
                onClick={() => (
                  setShowModal(true), setModalType(true), selectedUpdate()
                )}
                className="btn join-item bg-blue-500 text-white"
              >
                Tambah
              </button>
            </div>
          </div>

          <div className="overflow-x-auto w-full p-5">
            <table className="table shadow-lg">
              <thead className="bg-blue-200">
                <tr>
                  <th>No</th>
                  <th>Nama</th>
                  <th>Mapel</th>
                  <th>Kelas</th>
                  <th>Keterangan</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {DataLesson?.map((item: any, index) => (
                  <tr key={index}>
                    <th>{index + 1}</th>
                    <td>{item.assignments_name}</td>
                    <td>{item.subjects_name}</td>
                    <td>{item.class}</td>
                    <td>{item.description}</td>
                    <td>
                      <button
                        onClick={() => (
                          setShowModal(true),
                          setModalType(false),
                          setSelectedUpdate(item)
                        )}
                        className="btn bg-blue-400 text-xl font-bold text-white"
                      >
                        <BsPencilFill />
                      </button>
                      <button className="btn bg-blue-400 text-xl font-bold text-white">
                        <BsDownload />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="join grid grid-cols-2">
            <button
              className="join-item btn btn-outline btn-sm"
              onClick={() => {
                setFilter((prev) => ({ ...prev, page: filter.page - 1 }));
              }}
              disabled={filter.page === 0}
            >
              Previous page
            </button>
            <button
              className="join-item btn btn-outline btn-sm"
              onClick={() =>
                setFilter((prev) => ({
                  ...prev,
                  page: filter.page + 1,
                }))
              }
              disabled={filter.page === filter.totalPage - 1}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default BahanAjar;
