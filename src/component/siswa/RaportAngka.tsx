import { useState, useEffect } from "react";
import { FaPencilAlt, FaPlus, FaRegTrashAlt } from "react-icons/fa";
import Modal from "../modal";
import { MdCloudUpload } from "react-icons/md";
import { useStore } from "../../store/Store";
import { Task, Raport } from "../../controller/api";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import template from "./template.xlsx";
import * as ExcelJS from "exceljs";

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
  const [dataRaport, setDataRaport] = useState<any[]>([]);
  const [idNumber, setIdNumber] = useState<string>("");
  const [tahun, setTahun] = useState<string>("");
  const [semester, setSemester] = useState<string>("");
  const [kelasId, setKelasId] = useState<string>("");
  const [mapelId, setMapelId] = useState<string>("");
  const [arrayMapel, setarrayMapel] = useState<any>();
  const [arrayKelas, setarrayKelas] = useState<any>();
  const [cekEror, setCekEror] = useState<boolean>(false);

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
  }, [formik.values.classId, arrayKelas]);

  useEffect(() => {
    getMapel();
    getClass();
  }, []);

  useEffect(() => {
    getNumberRaport();
  }, [tahun, semester, kelasId, mapelId, arrayKelas]);

  const showModal = (props: string) => {
    let modalElement = document.getElementById(`${props}`) as HTMLDialogElement;
    if (modalElement) {
      modalElement.showModal();
      getClass();
      getMapel();
    }
  };
  const closeModal = (props: string) => {
    let modalElement = document.getElementById(props) as HTMLDialogElement;
    if (modalElement) {
      modalElement.close();
    }
  };

  const getClass = async () => {
    const response = await Task.GetAllClass(token, 0, 20);
    setKelas(response.data.data.result);
  };

  const getStudent = async () => {
    const idClass = formik.values.classId;
    try {
      const response = await Raport.getAllStudentReport(token, idClass);
      setDataSiswa(response.data.data);
      console.log(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getMapel = async () => {
    const response = await Task.GetAllMapel(token, 0, 20);
    setMapel(response.data.data.result);
  };

  const getNumberRaport = async () => {
    const data = {
      tahun,
      semester,
      class: kelasId,
    };
    const response = await Raport.getAllNumberReport(token, data);
    const dataRest = response.data.data;
    const filteredData = dataRest.filter(
      (item: any) => item.subject_id == mapelId
    );
    setDataRaport(filteredData);
  };

  const numberToWords = (number: string): string => {
    const units: string[] = [
      "nol",
      "satu",
      "dua",
      "tiga",
      "empat",
      "lima",
      "enam",
      "tujuh",
      "delapan",
      "sembilan",
    ];
    const str: string = number.toString();
    let word: string = "";
    for (let i = 0; i < str.length; i++) {
      if (str[i] === ".") {
        word += "koma ";
      } else {
        word += units[parseInt(str[i])] + " ";
      }
    }
    formik.setFieldValue("terbilang", word.trim());
    return word.trim();
  };

  const handleCreateNumber = async () => {
    const { subjectId, nilai, semester, terbilang, studentId } = formik.values;

    try {
      const rest = {
        student_report_id: studentId,
        semester,
        subject_id: parseInt(subjectId),
        grade: nilai,
        grade_text: terbilang,
      };

      await Raport.createNumberRaport(token, rest);
      closeModal("add-angka");
      getNumberRaport();
      formik.resetForm({ values: formik.initialValues });
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await Raport.deleteNumberReport(token, id);
      Swal.fire({
        title: "Deleted!",
        text: "Your file has been deleted.",
        icon: "success",
      });
      getNumberRaport();
    } catch (error) {
      console.log(error);
    }
  };

  const trigerDelete = async (id: string) => {
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
        handleDelete(id);
      }
    });
  };

  const getNumberId = async (id: string) => {
    const response = await Raport.getByIdNumberReport(token, id);
    const data = response.data.data[0];
    setIdNumber(id);
    formik.setFieldValue("classId", data.studentreport.student_class_id);
    formik.setFieldValue("semester", data.studentreport.semester);
    formik.setFieldValue("subjectId", data.subject_id);
    formik.setFieldValue("nilai", data.grade);
    formik.setFieldValue("terbilang", data.grade_text);
    formik.setFieldValue("studentId", data.student_report_id);

    showModal("edit-angka");
  };

  const handleEdit = async () => {
    const { subjectId, nilai, semester, terbilang, studentId } = formik.values;

    const rest = {
      student_report_id: parseInt(studentId),
      semester,
      subject_id: subjectId,
      grade: nilai,
      grade_text: terbilang,
    };

    await Raport.editNumberRaport(token, idNumber, rest);
    getNumberRaport();
    closeModal("edit-angka");
  };

  const exportToCSV = async () => {
    try {
      const response = await fetch(template);
      const data = await response.arrayBuffer();

      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(data); // load existing workbook
      const worksheet = workbook.getWorksheet(1); // get first worksheet

      if (!worksheet) {
        throw new Error("Worksheet not found");
      }

      let dataPool: any = [];
      DataSiswa.map((item, index) => {
        const rest = {
          no: index + 1,
          idReport: item.id,
          idSiswa: item.studentclass.student.id,
          namaSiswa: item.studentclass.student.full_name,
          idMapel: arrayMapel?.id,
          mapel: arrayMapel?.name,
        };
        dataPool.push(rest);
      });

      for (let i = 0; i < dataPool.length; i++) {
        const rowNumber = i + 2;
        worksheet.getRow(rowNumber).values = [
          dataPool[i].no,
          dataPool[i].idReport,
          dataPool[i].idSiswa,
          dataPool[i].namaSiswa,
          dataPool[i].idMapel,
          dataPool[i].mapel,
        ];
      }

      const fileName = `${arrayMapel?.name}-${arrayKelas?.class_name}.xlsx`;
      const buffer = await workbook.xlsx.writeBuffer();
      saveAs(new Blob([buffer]), fileName);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files![0];
    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target!.result;
      const workbook = XLSX.read(bstr, { type: "binary" });
      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];
      const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any;
      const mapel = data[1][4];
      const namaMapel = data[1][5];

      data.map((dataExcel: any) => {
        if (dataExcel[0] == " ") {
          return;
        } else if (mapel != arrayMapel?.id) {
          closeModal("upload-angka");
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: `Silakan pilih pelajaran ${namaMapel} terlebih dahulu!`,
          });
          return;
        } else if (parseInt(dataExcel[6])) {
          setDataSiswa((prevData) =>
            prevData.map((item) =>
              item.id == dataExcel[1]
                ? {
                    ...item,
                    nilai: dataExcel[6]
                      ? dataExcel[6] > 10
                        ? 10
                        : dataExcel[6]
                      : 0,
                    terbilang: dataExcel[7]
                      ? dataExcel[6] > 10
                        ? "sepuluh"
                        : dataExcel[7]
                      : "nol",
                  }
                : item
            )
          );
        }
      });
    };
    reader.readAsBinaryString(file);
    setCekEror(true);
  };

  const handleInputChange = (id: string, field: string, value: string) => {
    setDataSiswa((prevData) =>
      prevData.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const handleCreateNumberUpload = async () => {
    await Promise.all(
      DataSiswa.map(async (item: any) => {
        const rest = {
          student_report_id: item.id,
          semester: formik.values.semester ? formik.values.semester : 1,
          subject_id: parseInt(arrayMapel?.id),
          grade: item?.nilai ? item.nilai : 0,
          grade_text: item?.terbilang ? item.terbilang : "nol",
        };

        return Raport.createNumberRaport(token, rest);
      })
    );
    closeModal("upload-angka");
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Your work has been saved",
      showConfirmButton: false,
      timer: 1500,
    });
    getNumberRaport();
  };

  return (
    <div>
      <div className="w-full flex justify-between gap-2">
        <div className="join">
          <select
            className="select select-sm join-item w-32 max-w-md select-bordered"
            onChange={(e) => setTahun(e.target.value)}
          >
            <option disabled selected>
              Tahun Pelajaran
            </option>
            <option value={"2023/2024"}>2023/2024</option>
            <option value={"2024/2025"}>2024/2025</option>
          </select>
          <select
            className="select select-sm join-item w-32 max-w-md select-bordered"
            onChange={(e) => setSemester(e.target.value)}
          >
            <option disabled selected>
              Semester
            </option>
            <option value={"1"}>Ganjil</option>
            <option value={"2"}>Genap</option>
          </select>
          <select
            className="select select-sm join-item w-32 max-w-md select-bordered"
            onChange={(e) => setKelasId(e.target.value)}
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
          <select
            className="select select-sm join-item w-32 max-w-md select-bordered"
            onChange={(e) => setMapelId(e.target.value)}
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
              {/* <th>KKM</th> */}
              <th>Nilai</th>
              <th>Huruf</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {dataRaport?.map((item: any, index: number) => (
              <tr>
                <th>{index + 1}</th>

                <td>{item?.studentreport?.studentclass?.student?.full_name}</td>
                <td>{item?.subject?.name}</td>
                {/* <td>75</td> */}
                <td>{item?.grade}</td>
                <td>{item?.grade_text}</td>
                <td>
                  <div className="join">
                    <button
                      className="btn btn-sm join-item bg-yellow-500 text-white tooltip"
                      data-tip="edit"
                      onClick={() => getNumberId(item?.id)}
                    >
                      <span className="text-xl">
                        <FaPencilAlt />
                      </span>
                    </button>
                    <button
                      className="btn btn-sm join-item bg-red-500 text-white tooltip"
                      data-tip="hapus"
                      onClick={() => trigerDelete(item?.id)}
                    >
                      <span className="text-xl">
                        <FaRegTrashAlt />
                      </span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
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
                value={formik.values.classId}
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
                value={formik.values.studentId}
                onChange={(e) =>
                  formik.setFieldValue("studentId", e.target.value)
                }
              >
                <option disabled selected>
                  Siswa
                </option>
                {DataSiswa?.map((item: any, index: number) => (
                  <option value={item?.id} key={index}>
                    {item?.studentclass.student.full_name}
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
                value={formik.values.semester}
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
              <select
                className="select join-item w-full select-bordered"
                value={formik.values.subjectId}
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
                Nilai (1-10)
              </label>
              <input
                type="number"
                placeholder="7.5"
                className={`input input-bordered w-full ${
                  parseInt(formik.values.nilai) > 10 ? "bg-red-300" : ""
                }`}
                value={formik.values.nilai}
                onChange={(e) => {
                  formik.setFieldValue("nilai", e.target.value),
                    numberToWords(e.target.value);
                }}
              />
              <span
                className={`text-red-500 text-xs ${
                  parseInt(formik.values.nilai) > 10 ? "" : "hidden"
                }`}
              >
                Nilai tidak boleh lebih dari 10
              </span>
            </div>
            <div className="flex flex-col w-full">
              <label htmlFor="" className="font-bold">
                Terbilang
              </label>
              <input
                type="text"
                placeholder="tujuh koma lima"
                className="input input-bordered w-full"
                value={formik.values.terbilang}
                onChange={(e) =>
                  formik.setFieldValue("terbilang", e.target.value)
                }
              />
            </div>
            <div className="flex flex-col w-full mt-10">
              <button
                className="btn btn-ghost bg-green-500 w-full text-white"
                onClick={handleCreateNumber}
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      </Modal>
      <Modal id="edit-angka">
        <div className="w-full flex justify-center flex-col items-center">
          <span className="text-xl font-bold">Edit Raport Angka</span>
          <div className="mt-5 flex justify-start w-full flex-col gap-3">
            <div className="flex flex-col w-full">
              <label htmlFor="" className="font-bold">
                Kelas
              </label>
              <select
                className="select join-item w-full select-bordered"
                value={formik.values.classId}
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
                Semester
              </label>
              <select
                className="select join-item w-full select-bordered"
                value={formik.values.semester}
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
              <select
                className="select join-item w-full select-bordered"
                value={formik.values.subjectId}
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
                Nilai (1-10)
              </label>
              <input
                type="number"
                placeholder="75"
                className="input input-bordered w-full"
                value={formik.values.nilai}
                onChange={(e) => {
                  formik.setFieldValue("nilai", e.target.value),
                    numberToWords(e.target.value);
                }}
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
                value={formik.values.terbilang}
                onChange={(e) =>
                  formik.setFieldValue("terbilang", e.target.value)
                }
              />
            </div>
            <div className="flex flex-col w-full mt-10">
              <button
                className="btn btn-ghost bg-green-500 w-full text-white"
                onClick={handleEdit}
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      </Modal>
      <Modal id="upload-angka" width="w-11/12 max-w-7xl">
        <div className="w-full flex flex-col items-center">
          <span className="text-xl font-bold mb-5">Upload Raport Angka</span>
          <div
            className={`w-full mt-5 gap-2  flex-col ${
              !arrayKelas || !arrayMapel ? "hidden" : "flex"
            }`}
          >
            <button
              className={`btn btn-sm w-1/3 bg-green-300 ${
                !arrayKelas || !arrayMapel ? "btn-disabled" : ""
              }`}
              onClick={() => exportToCSV()}
            >
              dowload template
            </button>
          </div>
          <div className="flex justify-end w-full mt-5">
            <div className="join flex">
              <select
                className="select join-item w-full select-bordered"
                value={formik.values.semester}
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
              <select
                className="select join-item w-32 select-bordered"
                value={arrayKelas?.id}
                onChange={(e) => {
                  const selectedKelas = kelas.find(
                    (item) => item.id == e.target.value
                  );

                  formik.setFieldValue("classId", e.target.value);

                  setarrayKelas(selectedKelas);
                }}
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
              <select
                className="select join-item w-32 select-bordered"
                value={arrayMapel?.id}
                onChange={(e) => {
                  const selectedMapel = mapel.find(
                    (item) => item.id == e.target.value
                  );
                  setarrayMapel(selectedMapel);
                }}
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

            <div className="ml-3">
              <input
                type="file"
                className="file-input file-input-bordered"
                onChange={handleFileUpload}
              />
            </div>
          </div>

          <div className="w-full max-h-[400px] mt-10 overflow-auto">
            <table className="table shadow-lg">
              <thead className="bg-blue-400 text-white">
                <tr>
                  <th>No</th>
                  <th>Name</th>
                  <th>NIS</th>
                  <th>Mapel</th>
                  <th>Nilai</th>
                  <th>Terbilang</th>
                </tr>
              </thead>
              <tbody>
                {DataSiswa?.map((item: any, index: number) => (
                  <tr key={index}>
                    <th>{index + 1}</th>
                    <td>{item?.studentclass.student.full_name}</td>
                    <td>{item?.studentclass.student.nis}</td>
                    <td>{arrayMapel?.name}</td>
                    <td>
                      <input
                        type="number"
                        placeholder="0"
                        className={`input input-bordered w-16 ${
                          cekEror ? (item.nilai ? "" : "bg-red-400") : ""
                        }`}
                        value={item.nilai || ""}
                        onChange={(e) =>
                          handleInputChange(item.id, "nilai", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        placeholder="nol"
                        className={`input input-bordered w-full ${
                          cekEror ? (item.terbilang ? "" : "bg-red-400") : ""
                        }`}
                        value={item.terbilang || ""}
                        onChange={(e) =>
                          handleInputChange(
                            item.id,
                            "terbilang",
                            e.target.value
                          )
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="w-full flex justify-end mt-10 gap-2">
            <button
              className={`btn bg-green-500 text-white font-bold w-32`}
              onClick={handleCreateNumberUpload}
            >
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
