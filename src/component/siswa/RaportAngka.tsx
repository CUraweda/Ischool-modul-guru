import { useState, useEffect, ChangeEvent } from "react";
import {
  FaPencilAlt,
  FaPlus,
  FaRegCheckSquare,
  FaRegTrashAlt,
  FaRegWindowClose,
} from "react-icons/fa";
import Modal from "../modal";
import { MdCloudUpload } from "react-icons/md";
import { useStore } from "../../store/Store";
import { Task, Student, Raport } from "../../controller/api";
import { useFormik } from "formik";
import * as Yup from "yup";

const schema = Yup.object({
  classId: Yup.string().required("required"),
  studentId: Yup.string().required("required"),
  semester: Yup.string().required("required"),
  subjectId: Yup.string().required("required"),
  nilai: Yup.string().required("required"),
  terbilang: Yup.string().required("required"),
});

const RaportAngka = () => {
  const { token } = useStore();
  const [kelas, setKelas] = useState<any[]>([]);
  const [DataSiswa, setDataSiswa] = useState<any[]>([]);
  const [mapel, setMapel] = useState<any[]>([]);

  const formik = useFormik({
    initialValues: {
      classId: "",
      subjectId: "",
      semester: "",
      studentId: "",
      nilai: "",
      terbilang: "",
    },
    validationSchema: schema,
    onSubmit: (values) => {
      console.log(values);
    },
  });

  useEffect(() => {
    getStudent();
  }, [formik.values.classId]);

  const showModal = (props: string) => {
    let modalElement = document.getElementById(`${props}`) as HTMLDialogElement;
    if (modalElement) {
      modalElement.showModal();
      getClass();
      getMapel();
    }
  };

  const getClass = async () => {
    const response = await Task.GetAllClass(token, 0, 20);
    setKelas(response.data.data.result);
  };

  const getStudent = async () => {
    const idClass = parseInt(formik.values.classId);
    const response = await Student.GetStudentByClass(
      token,
      idClass,
      "2023/2024"
    );
    setDataSiswa(response.data.data);
  };

  const getMapel = async () => {
    const response = await Task.GetAllMapel(token, 0, 20);
    setMapel(response.data.data.result);
  };

  const handleCreateNumber = async () => {
    const {classId, subjectId, studentId, nilai, semester, terbilang} = formik.values

    try {
      const rest = {
        student_class_id : classId ,
        semester,
        subject_id : subjectId,
        grade: nilai,
        grade_text : terbilang
      }
      const response = await Raport.createNumberRaport(token, rest )

      console.log(response);
      
    } catch (error) {
      console.log(error);
      
      
    }
    // console.log(classId, subjectId, studentId, nilai, semester, terbilang);
    
  }

  return (
    <div>
      <div className="w-full flex justify-between gap-2">
        <div className="join">
          <select className="select select-sm join-item w-32 max-w-md select-bordered">
            <option disabled selected>
              Tahun Pelajaran
            </option>
            <option>2023/2024</option>
            <option>2024/2025</option>
          </select>
          <select className="select select-sm join-item w-32 max-w-md select-bordered">
            <option disabled selected>
              Semester
            </option>
            <option>Ganjil</option>
            <option>Genap</option>
          </select>
          <select className="select select-sm join-item w-32 max-w-md select-bordered">
            <option disabled selected>
              Kelas
            </option>
            <option>VII</option>
            <option>VIII</option>
            <option>IX</option>
          </select>
          <select className="select select-sm join-item w-32 max-w-xs select-bordered">
            <option disabled selected>
              Siswa
            </option>
            <option>Aldi</option>
            <option>Damar</option>
            <option>beni</option>
            <option>jono</option>
          </select>
        </div>
        <div>
          <div className="join">
            {/* <button className="btn btn-sm join-item bg-green-500 text-white ">
              <span className="text-xl">
                <FaRegCheckSquare />
              </span>
              Selesai Semua
            </button> */}
            <button
              className="btn btn-sm join-item bg-blue-500 text-white "
              onClick={() => showModal("add-angka")}
            >
              <span className="text-xl">
                <FaPlus />
              </span>
              Tambah
            </button>
            <button
              className="btn btn-sm join-item bg-cyan-500 text-white "
              onClick={() => showModal("upload-angka")}
            >
              <span className="text-xl">
                <MdCloudUpload />
              </span>
              Upload
            </button>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto mt-5">
        <table className="table table-md">
          <thead>
            <tr className="bg-blue-300">
              <th></th>
              <th>Nama</th>
              <th>Mapel</th>
              <th>KKM</th>
              <th>Nilai</th>
              <th>Huruf</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>1</th>
              <td>jani</td>
              <td>Matematika</td>
              <td>75</td>
              <td>89</td>
              <td>Sembilan Delapan</td>
              <td>
                <div className="join">
                  <button
                    className="btn btn-sm join-item bg-yellow-500 text-white tooltip"
                    data-tip="edit"
                  >
                    <span className="text-xl">
                      <FaPencilAlt />
                    </span>
                  </button>
                  <button
                    className="btn btn-sm join-item bg-red-500 text-white tooltip"
                    data-tip="hapus"
                  >
                    <span className="text-xl">
                      <FaRegTrashAlt />
                    </span>
                  </button>
                  <button
                    className="btn btn-sm join-item bg-green-500 text-white tooltip"
                    data-tip="tandai selesai"
                  >
                    <span className="text-xl">
                      <FaRegCheckSquare />
                    </span>
                  </button>
                </div>
              </td>
            </tr>
            <tr>
              <th>2</th>
              <td>melina</td>
              <td>Matematika</td>
              <td>75</td>
              <td>89</td>
              <td>Sembilan Delapan</td>
              <td>
                <div className="join">
                  <button
                    className="btn btn-sm join-item bg-yellow-500 text-white tooltip"
                    data-tip="edit"
                    disabled
                  >
                    <span className="text-xl">
                      <FaPencilAlt />
                    </span>
                  </button>
                  <button
                    className="btn btn-sm join-item bg-red-500 text-white tooltip"
                    data-tip="hapus"
                    disabled
                  >
                    <span className="text-xl">
                      <FaRegTrashAlt />
                    </span>
                  </button>
                  <button
                    className="btn btn-sm join-item bg-red-500 text-white tooltip"
                    data-tip="tandai belum selesai"
                  >
                    <span className="text-xl">
                      <FaRegWindowClose />
                    </span>
                  </button>
                </div>
              </td>
            </tr>
            <tr>
              <th>3</th>
              <td>raza</td>
              <td>Matematika</td>
              <td>75</td>
              <td>89</td>
              <td>Sembilan Delapan</td>
              <td>
                <div className="join">
                  <button
                    className="btn btn-sm join-item bg-yellow-500 text-white tooltip"
                    data-tip="edit"
                    disabled
                  >
                    <span className="text-xl">
                      <FaPencilAlt />
                    </span>
                  </button>
                  <button
                    className="btn btn-sm join-item bg-red-500 text-white tooltip"
                    data-tip="hapus"
                    disabled
                  >
                    <span className="text-xl">
                      <FaRegTrashAlt />
                    </span>
                  </button>
                  <button
                    className="btn btn-sm join-item bg-red-500 text-white tooltip"
                    data-tip="tandai belum selesai"
                  >
                    <span className="text-xl">
                      <FaRegWindowClose />
                    </span>
                  </button>
                </div>
              </td>
            </tr>
            <tr>
              <th>4</th>
              <td>anwar</td>
              <td>Matematika</td>
              <td>75</td>
              <td>89</td>
              <td>Sembilan Delapan</td>
              <td>
                <div className="join">
                  <button
                    className="btn btn-sm join-item bg-yellow-500 text-white tooltip"
                    data-tip="edit"
                    disabled
                  >
                    <span className="text-xl">
                      <FaPencilAlt />
                    </span>
                  </button>
                  <button
                    className="btn btn-sm join-item bg-red-500 text-white tooltip"
                    data-tip="hapus"
                    disabled
                  >
                    <span className="text-xl">
                      <FaRegTrashAlt />
                    </span>
                  </button>
                  <button
                    className="btn btn-sm join-item bg-red-500 text-white tooltip"
                    data-tip="tandai belum selesai"
                  >
                    <span className="text-xl">
                      <FaRegWindowClose />
                    </span>
                  </button>
                </div>
              </td>
            </tr>
            <tr>
              <th>5</th>
              <td>melina</td>
              <td>Matematika</td>
              <td>75</td>
              <td>89</td>
              <td>Sembilan Delapan</td>
              <td>
                <div className="join">
                  <button
                    className="btn btn-sm join-item bg-yellow-500 text-white tooltip"
                    data-tip="edit"
                    disabled
                  >
                    <span className="text-xl">
                      <FaPencilAlt />
                    </span>
                  </button>
                  <button
                    className="btn btn-sm join-item bg-red-500 text-white tooltip"
                    data-tip="hapus"
                    disabled
                  >
                    <span className="text-xl">
                      <FaRegTrashAlt />
                    </span>
                  </button>
                  <button
                    className="btn btn-sm join-item bg-red-500 text-white tooltip"
                    data-tip="tandai belum selesai"
                  >
                    <span className="text-xl">
                      <FaRegWindowClose />
                    </span>
                  </button>
                </div>
              </td>
            </tr>
            <tr>
              <th>6</th>
              <td>bayu</td>
              <td>Matematika</td>
              <td>75</td>
              <td>89</td>
              <td>Sembilan Delapan</td>
              <td>
                <div className="join">
                  <button
                    className="btn btn-sm join-item bg-yellow-500 text-white tooltip"
                    data-tip="edit"
                    disabled
                  >
                    <span className="text-xl">
                      <FaPencilAlt />
                    </span>
                  </button>
                  <button
                    className="btn btn-sm join-item bg-red-500 text-white tooltip"
                    data-tip="hapus"
                    disabled
                  >
                    <span className="text-xl">
                      <FaRegTrashAlt />
                    </span>
                  </button>
                  <button
                    className="btn btn-sm join-item bg-red-500 text-white tooltip"
                    data-tip="tandai belum selesai"
                  >
                    <span className="text-xl">
                      <FaRegWindowClose />
                    </span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <Modal id="add-angka">
        <div className="w-full flex justify-center flex-col items-center">
          <span className="text-xl font-bold">Tambah Raport Angka</span>
          <div className="mt-5 flex justify-start w-full flex-col gap-3">
            <div className="flex flex-col w-full">
              <label htmlFor="" className="font-bold">
                Kelas
              </label>
              <select
                className="select join-item w-full select-bordered"
                onChange={(e) =>
                  formik.setFieldValue("classId", e.target.value)
                }
              >
                <option disabled selected>
                  pilih kelas
                </option>
                {kelas?.map((item: any, index: number) => (
                  <option
                    value={item.id}
                    key={index}
                  >{`${item.level}-${item.class_name}`}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col w-full">
              <label htmlFor="" className="font-bold">
                Nama
              </label>
              <select
                className="select join-item w-full select-bordered"
                onChange={(e) =>
                  formik.setFieldValue("studentId", e.target.value)
                }
              >
                <option disabled selected>
                  Siswa
                </option>
                {DataSiswa?.map((item: any, index: number) => (
                  <option value={item?.id} key={index}>
                    {item?.student?.full_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col w-full">
              <label htmlFor="" className="font-bold">
                Semester
              </label>
              <select
                className="select join-item w-full select-bordered"
                onChange={(e) =>
                  formik.setFieldValue("semester", e.target.value)
                }
              >
                <option disabled selected>
                  Semester
                </option>
                <option value={"1"}>Semester 1</option>
                <option value={"2"}>Semester 2</option>
              </select>
            </div>
            <div className="flex flex-col w-full">
              <label htmlFor="" className="font-bold">
                Mapel
              </label>
              <select className="select join-item w-full select-bordered"
               onChange={(e) =>
                formik.setFieldValue("subjectId", e.target.value)
              }
              >
                <option disabled selected>
                  Pelajaran
                </option>
                {mapel?.map((item: any, index: number) => (
                  <option value={item.id} key={index}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col w-full">
              <label htmlFor="" className="font-bold">
                Nilai
              </label>
              <input
                type="number"
                placeholder="75"
                className="input input-bordered w-full"
                onChange={(e) => formik.setFieldValue("nilai", e.target.value)}
              />
            </div>
            <div className="flex flex-col w-full">
              <label htmlFor="" className="font-bold">
                Terbilang
              </label>
              <input
                type="text"
                placeholder="tujuh puluh lima"
                className="input input-bordered w-full"
                onChange={(e) => formik.setFieldValue("terbilang", e.target.value)}
              />
            </div>
            <div className="flex flex-col w-full mt-10">
              <button className="btn btn-ghost bg-green-500 w-full text-white" onClick={handleCreateNumber}>
                Simpan
              </button>
            </div>
          </div>
        </div>
      </Modal>
      <Modal id="upload-angka">
        <div className="w-full flex flex-col items-center">
          <span className="text-xl font-bold">Upload Raport Angka</span>
          <div className="w-full mt-5 gap-2 flex flex-col">
            <button className="btn btn-sm w-1/3 bg-green-300">
              dowload template
            </button>
            <label className="mt-4 font-bold">Upload File</label>
            <input
              type="file"
              className="file-input file-input-bordered w-full"
            />
          </div>

          <div className="w-full flex justify-center mt-10 gap-2">
            <button className="btn bg-green-500 text-white font-bold w-full">
              Submit
            </button>
            {/* <button className="btn bg-green-500 text-white font-bold">Submit</button> */}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default RaportAngka;
