import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { BsDownload, BsPencilFill } from "react-icons/bs";
import Swal from "sweetalert2";
import * as Yup from "yup";
import { FileRaporSiswa, Lesson, Mapel, Task } from "../../midleware/api";
const BahanAjar: React.FC<{}> = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [DataLesson, setDataLesson] = useState<any[]>([]);
  const [selectedUpdate, setSelectedUpdate] = useState<any>();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [ListMapel, setListMapel] = useState<any[]>([]);
  const [modalType, setModalType] = useState<boolean>(true);
  const [Class, setClass] = useState<any[]>([]);
  const [filter, setFilter] = useState({
    page: 0,
    limit: 10,
    search: "",
    totalRows: 0,
    totalPage: 0,
  });
  const getClass = async () => {
    const response = await Task.GetAllClass(0, 20, "Y", "N", "Y");
    setClass(response.data.data.result);
  };

  const getLesson = async () => {
    try {
      const res = await Lesson.getAllData(
        filter.page,
        filter.limit,
        filter.search
      );
      setDataLesson(res.data.data.result);
      setFilter((prev) => ({
        ...prev,
        limit: res.data.limit,
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
  const getMapel = async () => {
    try {
      const res = await Mapel.GetAllDataMapel(0, 0);
      if (res.status === 200) {
        const { result } = res.data.data;
        setListMapel(result);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const createLesson = async (payload: any) => {
    try {
      const res = await Lesson.CreateNewLesson(payload);
      if (res.data.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Berhasil dibuat",
          showConfirmButton: true,
          timer: 1500,
        });
        getLesson();
      }
    } catch (error) {
      console.error(error);
    }
  };
  const DownloadFile = async (path?: string, type?: boolean) => {
    if (!path) return;

    console.log(path);
    try {
      const response = await FileRaporSiswa.downloadFile(path);
      const blob = new Blob([response.data], { type: "application/pdf" });

      const fileUrl = URL.createObjectURL(blob);

      if (type === true) {
        const link: any = document.createElement("a");
        link.href = fileUrl;
        link.download = path.split("/").pop();
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error: any) {
      let message = "Gagal mengunduh file rapor siswa";
      if (error.response?.status == 404)
        message = "File rapor siswa tidak ditemukan";

      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: message,
      });
    } finally {
      Swal.fire({
        icon: "success",
        title: "Berhasil...",
        text: "Download berhasil",
      });
    }
  };
  const updateDataLesson = async (payload: any, id: number) => {
    try {
      const res = await Lesson.UpdateLesson(payload, id);
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
    getMapel();
    getClass();
  }, []);

  useEffect(() => {
    getLesson();
  }, [filter.search, filter.page, filter.limit]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setSelectedFile(file || null);
  };
  // Validation schema for formik
  const validationSchema = Yup.object({
    assignments_name: Yup.string().required("Required"),
    subjects_name: Yup.string().required("Required"),
    class: Yup.number().required("Required"),
    description: Yup.string().required("Required"),
    file: Yup.mixed().required("Required"),
  });

  const handleSubmit = async (values: any) => {
    const formData = new FormData();
    formData.append("assignments_name", values.assignments_name);
    formData.append("subjects_name", values.subjects_name);
    formData.append("class_id", values.class);
    formData.append("description", values.description);
    if (selectedFile) {
      formData.append("lesson_plan_file", selectedFile);
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

  const resetForm = () => {
    setSelectedFile(null);
    setSelectedUpdate(null);
    setShowModal(false);
    setModalType(true);
  };
  return (
    <>
      {showModal && (
        <dialog
          className="modal modal-open"
          onClick={() => {
            setShowModal(false), resetForm();
          }}
        >
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <button
              className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2"
              onClick={() => {
                setShowModal(false), resetForm();
              }}
            >
              ✕
            </button>
            <h3 className="text-lg font-bold">Tambah Bahan Ajar</h3>

            {/* Formik form inside modal */}
            <Formik
              initialValues={{
                assignments_name: selectedUpdate?.assignments_name || "",
                subjects_name: selectedUpdate?.subjects_name || "",
                class: selectedUpdate?.class,
                description: selectedUpdate?.description,
                file: selectedUpdate?.file_path || null,
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
                      {ListMapel.map((item, i) => (
                        <option key={i} value={item.name}>
                          {item.level + "-" + item.name}
                        </option>
                      ))}
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
                      as="select"
                      className="input input-bordered w-full"
                    >
                      <option selected>Kelas</option>
                      {Class?.map((item: any, index: number) => (
                        <option
                          value={item.id}
                          key={index}
                        >{`${item.level}-${item.class_name}`}</option>
                      ))}
                    </Field>
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
            {/* <select
              className="select select-primary w-32 max-w-xs"
              value={filter.search}
              onChange={(e) =>
                setFilter((prev) => ({ ...prev, search: e.target.value }))
              }
            >
              <option disabled selected>
                Mapel
              </option>
              <option value="">Pilih Mapel</option>
              {ListMapel.map((item, i) => (
                <option key={i} value={item.name}>
                  {item.level + "-" + item.name}
                </option>
              ))}
            </select> */}
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
            <table className="table shadow-lg bg-white">
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
              <tbody className="bg-white">
                {DataLesson?.map((item: any, index) => (
                  <tr key={index}>
                    <th>{index + 1}</th>
                    <td>{item.assignments_name}</td>
                    <td>{item.subjects_name}</td>
                    <td>{item.class.class_name + "-" + item.class.level}</td>
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
                      <button
                        className="btn bg-blue-400 text-xl font-bold text-white"
                        onClick={() => DownloadFile(item.file_path, true)}
                      >
                        <BsDownload />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="join flex my-5">
              <button
                className="join-item btn btn-sm"
                onClick={() => {
                  setFilter((prev) => ({ ...prev, page: filter.page - 1 }));
                }}
                disabled={filter.page === 0}
              >
                Previous page
              </button>
              <button
                className="join-item btn  btn-sm"
                onClick={() => {
                  setFilter((prev) => ({ ...prev, page: 10 }));
                }}
                disabled={filter.page === 10}
              >
                10
              </button>
              <button
                className="join-item btn btn-sm"
                onClick={() => {
                  setFilter((prev) => ({ ...prev, page: 20 }));
                }}
                disabled={filter.page === 20}
              >
                20
              </button>

              <button
                className="join-item btn  btn-sm"
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
      </div>
    </>
  );
};

export default BahanAjar;
