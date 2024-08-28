import { useState, useEffect } from "react";
import { MdOutlineDocumentScanner } from "react-icons/md";
import { Link } from "react-router-dom";
import Modal from "../modal";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { Task, Raport } from "../../midleware/api";
import { globalStore, Store, useProps } from "../../store/Store";
import { FaGear } from "react-icons/fa6";
import { PiNotePencilBold } from "react-icons/pi";
import { BiTrash } from "react-icons/bi";
import * as Yup from "yup";
import { useFormik } from "formik";
import Swal from "sweetalert2";
import { FaFilePdf } from "react-icons/fa";
import { IpageMeta, PaginationControl } from "../PaginationControl";

const schema = Yup.object({
  classId: Yup.string().required("required"),
  kode: Yup.string().required("required"),
  kategori: Yup.string().required("required"),
  idKategori: Yup.string().required("required"),
  idSubKategori: Yup.string().required("required"),
  subKategori: Yup.string().required("required"),
  smt: Yup.string().required("required"),
});

const RaportNarasi = () => {
  const { academicYear } = globalStore();
  const { token } = Store();
  const { setKelasProps, kelasProps } = useProps();
  const [kelas, setKelas] = useState<any[]>([]);
  const [DataSiswa, setDataSiswa] = useState<any[]>([]);
  const [idClass, setClass] = useState<string>(kelasProps);
  const [komen, setKomen] = useState<string>("");
  const [kategori, setKategori] = useState<any[]>([]);
  const [subKategori, setSubKategori] = useState<any>([]);

  const [studentClass, setStudentClass] = useState<string>("");
  const [smt, setSmt] = useState<string>("1");
  const [reportId, setReportId] = useState<string>("");
  const [setting, setSetting] = useState<boolean>(false);
  const [edit, setEdit] = useState<string>("");
  const [pageMeta, setPageMeta] = useState<IpageMeta>({ page: 0, limit: 10 });
  const [filter, setFilter] = useState({
    classId: "",
    semester: "",
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

  const formik = useFormik({
    initialValues: {
      classId: kelasProps,
      kode: "",
      kategori: "",
      idKategori: "",
      idSubKategori: "",
      subKategori: "",
      smt: smt,
    },
    validationSchema: schema,
    onSubmit: (values) => {
      console.log(values);
    },
  });
  useEffect(() => {
    getStudent();
    getKategori();
  }, [filter, academicYear]);

  useEffect(() => {
    getClass();
  }, []);

  useEffect(() => {
    getSubKategori();
  }, [formik.values.idKategori]);

  const showModal = (props: string) => {
    let modalElement = document.getElementById(`${props}`) as HTMLDialogElement;
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

  const getClass = async () => {
    const response = await Task.GetAllClass(token, 0, 20, "Y");
    setKelas(response.data.data.result);
  };

  const getStudent = async () => {
    try {
      const response = await Raport.showAllStudentReport(
        token,
        filter.classId,
        filter.semester,
        filter.page,
        filter.limit,
        "Y",
        academicYear
      );

      sessionStorage.setItem("idClass", filter.classId);
      const { result, ...meta } = response.data.data;
      setDataSiswa(result);
      setPageMeta(meta);
    } catch (error) {
      console.log(error);
    }
  };

  const CreateKomenGuru = async () => {
    const data = {
      student_class_id: studentClass,
      semester: smt,
      nar_teacher_comments: komen,
    };

    await Raport.createKomentar(token, reportId, data);
    getStudent();
    closeModal("komen-guru-narasi");
    setKomen("");
  };

  const CreateKategori = async () => {
    const { classId, kategori } = formik.values;
    if (!classId) {
    }
    const data = {
      code: "kategori",
      class_id: classId,
      category: kategori,
    };
    await Raport.createKategori(token, data);
    closeModal("add-kategori");
    formik.resetForm();
    getKategori();
  };

  const CreateSubKategori = async () => {
    const { idKategori, subKategori } = formik.values;

    const data = {
      code: "sub-kategori",
      narrative_cat_id: idKategori,
      sub_category: subKategori,
    };
    await Raport.createSubKategori(token, data);
    closeModal("add-sub-kategori");
    formik.resetForm();
    getSubKategori();
  };

  const handleKomen = (
    komen: string,
    kelas: string,
    id: string,
    smt: string,
    type: string
  ) => {
    type === "guru"
      ? showModal("komen-guru-narasi")
      : showModal("komen-ortu-narasi");

    setKomen(komen ? komen : "");
    setReportId(id);
    setStudentClass(kelas);
    setSmt(smt);
  };

  const getKategori = async () => {
    try {
      const response = await Raport.getKategoriNarasi(token, idClass);
      setKategori(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  const getSubKategori = async () => {
    try {
      const id = formik.values.idKategori;
      const response = await Raport.getSubCategoriNarasi(token, id);
      setSubKategori(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const editKategori = async () => {
    const { classId, kode, kategori, idKategori } = formik.values;
    try {
      const data = {
        code: kode,
        class_id: classId,
        category: kategori,
      };
      await Raport.editKategori(token, idKategori, data);
      closeModal("add-kategori");
      formik.resetForm();
      getKategori();
      setEdit("");
    } catch (error) {
      console.log(error);
    }
  };
  const editSubKategori = async () => {
    const { idKategori, kode, subKategori, idSubKategori } = formik.values;

    try {
      const data = {
        code: kode,
        narrative_cat_id: idKategori,
        sub_category: subKategori,
      };
      await Raport.editSubKategori(token, idSubKategori, data);
      closeModal("add-sub-kategori");
      formik.resetForm();
      getSubKategori();
      setEdit("");
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = (data: any, type: string) => {
    console.log(data);

    setEdit("edit");
    formik.setFieldValue("kode", data.code);
    formik.setFieldValue("idKategori", data.narrative_cat_id ?? data.id);
    if (type === "kategori") {
      formik.setFieldValue("classId", data.class_id);
      formik.setFieldValue("kategori", data.category);
      showModal("add-kategori");
    } else {
      formik.setFieldValue("subKategori", data.sub_category);
      formik.setFieldValue("idSubKategori", data.id);
      showModal("add-sub-kategori");
    }
  };

  const deleteKategori = async (id: string) => {
    try {
      await Raport.deleteKategoriNarasi(token, id);
      getKategori();
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Your work has been saved",
        showConfirmButton: false,
        timer: 1000,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const deleteSubKategori = async (id: string) => {
    try {
      await Raport.deleteSubKategoriNarasi(token, id);
      getSubKategori();
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Your work has been saved",
        showConfirmButton: false,
        timer: 1000,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const hanldegeneratePdf = async (id: string, report_id: string) => {
    try {
      await Raport.generatePdfNarasi(token, id, formik.values.smt, report_id);
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Your work has been saved",
        showConfirmButton: false,
        timer: 1000,
      });
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
      });
    }
  };

  return (
    <div>
      <div className="w-full flex justify-between gap-2">
        <div className="join">
          <select
            className="select join-item w-32 max-w-md select-bordered"
            value={filter.semester}
            onChange={(e) => {
              handleFilter("semester", e.target.value);
              sessionStorage.setItem("smt", e.target.value);
              formik.setFieldValue("smt", e.target.value);
            }}
          >
            <option value={""} selected>
              Semester
            </option>
            <option value={"1"}>Ganjil</option>
            <option value={"2"}>Genap</option>
          </select>
          <select
            className="select join-item w-32 max-w-md select-bordered"
            value={filter.classId}
            onChange={(e) => {
              handleFilter("classId", e.target.value);
              setClass(e.target.value);
              formik.setFieldValue("classId", e.target.value);
              setKelasProps(e.target.value);
            }}
          >
            <option value={""} selected>
              pilih kelas
            </option>
            {kelas?.map((item: any, index: number) => (
              <option value={item.id} key={index}>
                {item.class_name}
              </option>
            ))}
          </select>
        </div>
        <div className="tooltip" data-tip="setting">
          <button
            className="btn btn-circle text-xl"
            data-tip="setting"
            onClick={() => setSetting(!setting)}
          >
            <FaGear />
          </button>
        </div>
      </div>

      <div className={`mt-5 ${setting ? "hidden" : ""}`}>
        <div className="overflow-x-auto">
          <table className="table table-md table-zebra">
            <thead>
              <tr className="bg-blue-300 ">
                <th>No</th>
                <th>Nama</th>
                <th>Kelas</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {DataSiswa?.map((item: any, index: number) => (
                <tr key={index}>
                  <th>{index + 1 + (pageMeta?.page ?? 0) * (pageMeta?.limit ?? 0)}</th>
                  <td>{item?.studentclass?.student.full_name}</td>
                  <td>{item?.studentclass?.class?.class_name}</td>

                  <td className="">
                    <div className="join">
                      <Link to={"/guru/rapor-siswa/narasi"}>
                        <button
                          className="btn join-item btn-ghost btn-sm text-xl text-white bg-blue-500 tooltip"
                          data-tip="Detail"
                          onClick={() => {
                            {
                              sessionStorage.setItem("idNar", item?.id),
                                sessionStorage.setItem(
                                  "idSiswa",
                                  item?.studentclass?.id
                                );
                            }
                          }}
                        >
                          <MdOutlineDocumentScanner />
                        </button>
                      </Link>
                      <button
                        className={`btn join-item btn-ghost btn-sm text-xl text-white tooltip ${
                          item.nar_teacher_comments
                            ? "bg-green-500"
                            : "bg-gray-400"
                        }`}
                        data-tip="Komentar Guru"
                        onClick={() =>
                          handleKomen(
                            item.nar_teacher_comments,
                            item.student_class_id,
                            item.id,
                            item.semester,
                            "guru"
                          )
                        }
                      >
                        <IoChatboxEllipsesOutline />
                      </button>
                      <button
                        className={`btn join-item btn-ghost btn-sm text-xl text-white bg-yellow-500 tooltip ${
                          item.nar_parent_comments ? "" : "btn-disabled"
                        }`}
                        data-tip="Komentar Ortu"
                        onClick={() =>
                          handleKomen(
                            item.nar_parent_comments,
                            item.student_class_id,
                            item.id,
                            item.semester,
                            "ortu"
                          )
                        }
                      >
                        <IoChatboxEllipsesOutline />
                      </button>
                      <button
                        className={`btn join-item btn-ghost btn-sm text-xl text-white bg-cyan-500 tooltip`}
                        data-tip="Generate PDF"
                        onClick={() =>
                          hanldegeneratePdf(item.studentclass.id, item.id)
                        }
                      >
                        <FaFilePdf />
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

      <div className={`mt-5 ${!setting ? "hidden" : ""}`}>
        <div className="w-full flex flex-col">
          <div className="divider divider-accent text-xl">Kategori</div>

          <div className="overflow-x-auto">
            <div className="w-full flex justify-end">
              <button
                className="btn bg-blue-500 text-white my-3"
                onClick={() => showModal("add-kategori")}
              >
                Tambah
              </button>
            </div>
            <table className="table table-md table-zebra">
              <thead>
                <tr className="bg-blue-300 ">
                  <th className="w-12">No</th>

                  <th>Kategori</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {kategori?.map((item: any, index: number) => (
                  <tr key={index}>
                    <td>{index + 1}</td>

                    <td>{item.category}</td>
                    <td className="flex gap-1 text-2xl">
                      <span
                        className="text-orange-500 cursor-pointer"
                        onClick={() => handleEdit(item, "kategori")}
                      >
                        <PiNotePencilBold />
                      </span>
                      <span
                        className="text-red-500 cursor-pointer"
                        onClick={() => deleteKategori(item.id)}
                      >
                        <BiTrash />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="w-full flex flex-col mt-8">
          <div className="divider divider-accent text-xl">Sub Kategori</div>

          <div className="overflow-x-auto">
            <div className="w-full flex justify-end items-center">
              <select
                className="select join-item w-32 select-bordered"
                onChange={(e) =>
                  formik.setFieldValue("idKategori", e.target.value)
                }
              >
                <option disabled selected>
                  Kategori
                </option>
                {kategori?.map((item: any, index: number) => (
                  <option value={item.id} key={index}>
                    {item?.category}
                  </option>
                ))}
              </select>
              <button
                className="btn bg-blue-500 text-white my-3"
                onClick={() => showModal("add-sub-kategori")}
              >
                Tambah
              </button>
            </div>
            <table className="table table-md table-zebra">
              <thead>
                <tr className="bg-blue-300 ">
                  <th className="w-12">No</th>

                  <th>Sub Kategori</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {subKategori?.map((item: any, index: number) => (
                  <tr key={index}>
                    <td>{index + 1}</td>

                    <td>{item.sub_category}</td>
                    <td className="flex gap-1 text-2xl">
                      <span
                        className="text-orange-500 cursor-pointer"
                        onClick={() => handleEdit(item, "Subkategori")}
                      >
                        <PiNotePencilBold />
                      </span>
                      <span
                        className="text-red-500 cursor-pointer"
                        onClick={() => deleteSubKategori(item.id)}
                      >
                        <BiTrash />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Modal id="komen-ortu-narasi" width="w-11/12 max-w-5xl">
        <div className="w-full flex justify-center flex-col items-center">
          <p className="text-xl font-bold">Komentar Orang Tua / Wali</p>
          <div className="w-full border-1 min-h-96 max-h-96 bg-gray-200 mt-5 rounded-md shadow-md p-3 overflow-auto">
            <span>{komen}</span>
          </div>
        </div>
      </Modal>
      <Modal id="komen-guru-narasi" width="w-11/12 max-w-5xl">
        <div className="w-full flex justify-center flex-col items-center">
          <p className="text-xl font-bold">Komentar Guru</p>
          <textarea
            className="textarea textarea-bordered w-full min-h-96 mt-5"
            placeholder="Komentar"
            value={komen}
            onChange={(e) => setKomen(e.target.value)}
          />

          <div className="w-full justify-end flex mt-5">
            <button
              className="btn btn-ghost bg-green-500 text-white"
              onClick={CreateKomenGuru}
            >
              Submit
            </button>
          </div>
        </div>
      </Modal>
      <Modal id="add-kategori">
        <div className="w-full flex justify-center flex-col items-center">
          <p className="text-xl font-bold">Kategori Narasi</p>
          <div className="w-full flex flex-col gap-1 mt-5">
            <label htmlFor="">Kelas</label>
            <select
              className="select  join-item w-full select-bordered"
              value={formik.values.classId}
              onChange={(e) => formik.setFieldValue("classId", e.target.value)}
            >
              <option selected>pilih kelas</option>
              {kelas?.map((item: any, index: number) => (
                <option
                  value={item.id}
                  key={index}
                >{`${item.level}-${item.class_name}`}</option>
              ))}
            </select>
          </div>
          {/* <div className="w-full flex flex-col gap-1 mt-5">
            <label htmlFor="">Kode</label>
            <input
              type="text"
              value={formik.values.kode}
              placeholder="Type here"
              onChange={(e) => formik.setFieldValue("kode", e.target.value)}
              className="input input-bordered w-full"
            />
          </div> */}
          <div className="w-full flex flex-col gap-1 mt-5">
            <label htmlFor="">Kategori</label>
            <input
              type="text"
              placeholder="Type here"
              value={formik.values.kategori}
              onChange={(e) => formik.setFieldValue("kategori", e.target.value)}
              className="input input-bordered w-full"
            />
          </div>

          <div className="w-full justify-end flex mt-5">
            <button
              className="btn btn-ghost bg-green-500 text-white w-full"
              onClick={edit === "edit" ? editKategori : CreateKategori}
            >
              Submit
            </button>
          </div>
        </div>
      </Modal>
      <Modal id="add-sub-kategori">
        <div className="w-full flex justify-center flex-col items-center">
          <p className="text-xl font-bold">Sub Kategori Narasi</p>
          <div className="w-full flex flex-col gap-1 mt-5">
            <label htmlFor="">Kelas</label>
            <select
              className="select join-item w-full select-bordered"
              value={formik.values.idKategori}
              onChange={(e) =>
                formik.setFieldValue("idKategori", e.target.value)
              }
            >
              <option selected>Kategori</option>
              {kategori?.map((item: any, index: number) => (
                <option value={item.id} key={index}>
                  {item?.category}
                </option>
              ))}
            </select>
          </div>
          {/* <div className="w-full flex flex-col gap-1 mt-5">
            <label htmlFor="">Kode</label>
            <input
              type="text"
              value={formik.values.kode}
              placeholder="Type here"
              onChange={(e) => formik.setFieldValue("kode", e.target.value)}
              className="input input-bordered w-full"
            />
          </div> */}
          <div className="w-full flex flex-col gap-1 mt-5">
            <label htmlFor="">Sub Kategori</label>
            <input
              type="text"
              placeholder="Type here"
              value={formik.values.subKategori}
              onChange={(e) =>
                formik.setFieldValue("subKategori", e.target.value)
              }
              className="input input-bordered w-full"
            />
          </div>

          <div className="w-full justify-end flex mt-5">
            <button
              className="btn btn-ghost bg-green-500 text-white w-full"
              onClick={edit === "edit" ? editSubKategori : CreateSubKategori}
            >
              Submit
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default RaportNarasi;
