import * as ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { BsPersonLinesFill } from "react-icons/bs";
import { FaPencilAlt, FaPlus, FaRegTrashAlt, FaSearch } from "react-icons/fa";
import { FiFileText } from "react-icons/fi";
import { MdCloudUpload } from "react-icons/md";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import * as Yup from "yup";
import {
  Kepribadian,
  KepribadianSiswa,
  Raport,
  Task,
} from "../../midleware/api";
import { globalStore, useProps } from "../../store/Store";
import Modal from "../modal";
import { IpageMeta, PaginationControl } from "../PaginationControl";
import template from "./template.xlsx";

const validationSchema = Yup.object({
  classId: Yup.string().required("required"),
  studentId: Yup.string().required("required"),
  semester: Yup.string().required("required"),
  subjectId: Yup.string().required("required"),
  nilai: Yup.string().required("required"),
  terbilang: Yup.string().required("required"),
});

const validationPersonalitySchema = Yup.object({
  id: Yup.string().optional(),
  classId: Yup.string().required("required"),
  personalityId: Yup.string().required("Kepribadiaan harus diisi"),
  grade: Yup.string().required("Nilai harus diisi"),
});

const RaportAngka = () => {
  const { academicYear } = globalStore();
  const { setSemesterProps, setKelasProps, setMapelProps } = useProps();

  const [kelas, setKelas] = useState<any[]>([]);
  const [DataSiswa, setDataSiswa] = useState<any[]>([]);
  const [mapel, setMapel] = useState<any[]>([]);
  const [dataRaport, setDataRaport] = useState<any[]>([]);
  const [idNumber, setIdNumber] = useState<string>("");
  const [idSiswa, setIdSiswa] = useState<string>("");
  const [level, setLevel] = useState<string>("");
  const [arrayMapel, setarrayMapel] = useState<any>();
  const [arrayKelas, setarrayKelas] = useState<any>();
  const [arrayNumber, setarrayNumber] = useState<any>();
  const [cekEror, setCekEror] = useState<boolean>(false);

  const [personalities, setPersonalities] = useState<any[]>([]);
  const [studentpersonalities, setStudentPersonalities] = useState<any[]>([]);
  const [studentInEditPersonality, setStudentInEditPersonality] = useState<any>(
    {}
  );

  const [search, setSearch] = useState("");
  const [pageMeta, setPageMeta] = useState<IpageMeta>({ page: 0, limit: 10 });
  const [filter, setFilter] = useState({
    semester: "",
    classId: "",
    subjectId: "",
    search: "",
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
      classId: "",
      subjectId: "",
      semester: "",
      studentId: "",
      nilai: "",
      terbilang: "",
    },
    validationSchema,
    onSubmit: (values) => {
      console.log(values);
    },
  });

  useEffect(() => {
    getStudent();
    getClass();
  }, [formik.values.classId, arrayKelas, academicYear]);

  useEffect(() => {
    getMapel();
  }, [level]);

  // useEffect(() => {
  //   getClass();
  //   getNumberRaport();
  // }, []);

  useEffect(() => {
    getNumberRaport();
  }, [filter, arrayKelas, academicYear]);

  useEffect(() => {
    getStudentPersonalities();
    getPersonalities();
  }, [studentInEditPersonality]);

  const showModal = (props: string) => {
    let modalElement = document.getElementById(`${props}`) as HTMLDialogElement;
    if (modalElement) {
      modalElement.showModal();
      getClass();
    }
  };
  const closeModal = (props: string) => {
    let modalElement = document.getElementById(props) as HTMLDialogElement;
    if (modalElement) {
      modalElement.close();
    }
  };

  const getClass = async () => {
    const response = await Task.GetAllClass(0, 20, "Y", "N", "Y");
    const kelasData = response.data.data.result;
    const kelasFilter = kelasData.filter(
      (value: any) => value.id == formik.values.classId
    );
    setLevel(kelasFilter[0]?.level);
    console.log(kelasFilter[0]?.level);

    setKelas(kelasData);
  };

  const getStudent = async () => {
    const idClass = formik.values.classId || "11";
    try {
      const response = await Raport.getAllStudentReport(
        idClass,
        null,
        academicYear
      );
      setDataSiswa(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getMapel = async () => {
    const response = await Task.GetAllMapel(0, "Y", 100);
    const mapelData = response.data.data.result;
    const mapelFilter = mapelData.filter((value: any) => value.level == level);
    setMapel(mapelFilter);
  };

  const getNumberRaport = async () => {
    const response = await Raport.showAllNumberReport(
      filter.search,
      filter.classId,
      academicYear,
      filter.semester,
      filter.subjectId,
      filter.page,
      filter.limit,
      "Y"
    );

    const { result, ...meta } = response.data.data;
    setDataRaport(result);
    setPageMeta(meta);
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

      await Raport.createNumberRaport(rest);
      closeModal("add-angka");
      getNumberRaport();
      formik.resetForm({ values: formik.initialValues });
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await Raport.deleteNumberReport(id);

      Swal.fire({
        title: "Deleted!",
        text: "Rapor angka berhasil dihapus.",
        icon: "success",
      });

      getNumberRaport();
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Error!",
        text: "There was an error deleting the file and related personalities.",
        icon: "error",
      });
    }
  };

  const getNumberId = async (id: string) => {
    const response = await Raport.getByIdNumberReport(id);
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

  const formikPersonality = useFormik({
    initialValues: {
      id: "",
      classId: "",
      personalityId: "1",
      grade: "A",
    },
    validationSchema: validationPersonalitySchema,
    onSubmit: () => {},
  });

  const getStudentPersonalities = async () => {
    const res = await KepribadianSiswa.showAll(
      studentInEditPersonality.nis,
      0,
      100
    );
    const data = res.data.data.result;

    setStudentPersonalities(
      data.filter(
        (dat: any) => dat.student_class_id == studentInEditPersonality.classId
      )
    );
  };
  const showStudentPersonalities = async (
    studentClass?: Record<string, any>
  ) => {
    setStudentPersonalities([]);
    setStudentInEditPersonality({
      name: studentClass?.student?.full_name ?? "-",
      nis: studentClass?.student?.nis ?? "-",
      academic_year: studentClass?.academic_year ?? "-",
      classId: studentClass?.id ?? "",
    });

    formikPersonality.setValues((v) => {
      return {
        ...v,
        classId: studentClass?.id,
      };
    });
    showModal("edit-kepribadian");
  };

  const handleSubmitStudentPersonality = async () => {
    const { classId, personalityId, grade, id } = formikPersonality.values;

    let res;
    if (id) {
      res = await KepribadianSiswa.update(id, {
        student_class_id: classId,
        personality_id: personalityId,
        grade,
      });
    } else {
      res = await KepribadianSiswa.add({
        student_class_id: classId,
        personality_id: personalityId,
        grade,
      });
    }

    if (res) {
      getStudentPersonalities();
    }
  };

  const handleDeleteStudentPersonality = async (id: string) => {
    const res = await KepribadianSiswa.delete(id);

    if (res.status == 200) getStudentPersonalities();
  };

  const getPersonalities = async () => {
    const res = await Kepribadian.showAll();
    const data = res.data.data.result;
    setPersonalities(data);
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

    await Raport.editNumberRaport(idNumber, rest);
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
                    terbilang: numberToWords(dataExcel[6]),
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
      prevData.map((item) => {
        if (item.id === id) {
          return field === "terbilang"
            ? { ...item, terbilang: value }
            : { ...item, nilai: value, terbilang: numberToWords(value) };
        }
        return item;
      })
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

        return Raport.createNumberRaport(rest);
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

  const getDataNumberByStudent = async (id: string) => {
    showModal("view-angka");
    setIdSiswa(id);
    const response = await Raport.getNumberReportByStudent(id, filter.semester);
    const dataRest = response.data.data;
    setarrayNumber(dataRest);
  };

  const generatePdf = async () => {
    try {
      await Raport.generateNumberReport(idSiswa, filter.semester);
      closeModal("view-angka");
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Your work has been saved",
        showConfirmButton: false,
        timer: 1000,
      });
    } catch (error) {
      closeModal("view-angka");
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
      });
    }
  };

  return (
    <div>
      <div className="w-full flex flex-wrap gap-3">
        <div className="join">
          <select
            className="select join-item w-32 max-w-md select-bordered"
            value={filter.semester}
            onChange={(e) => {
              handleFilter("semester", e.target.value),
                sessionStorage.setItem("smt", e.target.value);
              setSemesterProps(e.target.value);
            }}
          >
            <option value={""} selected>
              Semester
            </option>
            <option value={"1"}>Ganjil</option>
            <option value={"2"}>Genap</option>
          </select>
        </div>
        <div className="join me-auto">
          <select
            className="select join-item w-32 max-w-md select-bordered"
            onChange={(e) => {
              handleFilter("classId", e.target.value),
                setKelasProps(e.target.value),
                formik.setFieldValue("classId", e.target.value);
            }}
            value={filter.classId}
          >
            <option selected>pilih kelas</option>
            {kelas?.map((item: any, index: number) => (
              <option
                value={item.id}
                key={index}
              >{`${item.level}-${item.class_name}`}</option>
            ))}
          </select>
          <select
            className="select join-item w-32 max-w-md select-bordered"
            value={filter.subjectId}
            onChange={(e) => {
              handleFilter("subjectId", e.target.value),
                setMapelProps(e.target.value);
            }}
          >
            <option value={""} selected>
              Pelajaran
            </option>
            {mapel?.map((item: any, index: number) => (
              <option value={item.id} key={index}>
                {item.name}
              </option>
            ))}
          </select>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleFilter("search", search);
            }}
            className="join-item input input-bordered flex items-center gap-2"
          >
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              placeholder="Cari"
              className="grow"
            />
            <FaSearch />
          </form>
        </div>
        <div className="join">
          <button
            className="btn join-item bg-blue-500 text-white "
            onClick={() => showModal("add-angka")}
          >
            <span className="text-xl">
              <FaPlus />
            </span>
            Tambah
          </button>
          <button
            className="btn join-item bg-cyan-500 text-white "
            onClick={() => showModal("upload-angka")}
          >
            <span className="text-xl">
              <MdCloudUpload />
            </span>
            Upload
          </button>
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
                <th>
                  {index + 1 + (pageMeta?.page ?? 0) * (pageMeta?.limit ?? 0)}
                </th>

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
                      onClick={() => handleDelete(item?.id)}
                    >
                      <span className="text-xl">
                        <FaRegTrashAlt />
                      </span>
                    </button>
                    <button
                      className="btn btn-sm join-item bg-cyan-500 text-white tooltip"
                      data-tip="detail raport"
                      onClick={() =>
                        getDataNumberByStudent(
                          item?.studentreport?.studentclass?.student?.id
                        )
                      }
                    >
                      <span className="text-xl">
                        <FiFileText />
                      </span>
                    </button>
                    <button
                      className="btn btn-sm join-item bg-lime-600 text-white tooltip"
                      data-tip="edit kepribadian"
                      onClick={() => {
                        showStudentPersonalities(
                          item?.studentreport?.studentclass
                        );
                      }}
                    >
                      <span className="text-xl">
                        <BsPersonLinesFill />
                      </span>
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

      <Modal id="edit-kepribadian" width="w-11/12 max-w-4xl">
        <h3 className="text-xl mb-6">Edit Kepribadian</h3>
        <div className="mb-6 grid grid-cols-3">
          <div className="font-bold col-span-1">Nama siswa</div>
          <div className="col-span-2">: {studentInEditPersonality["name"]}</div>
          <div className="font-bold col-span-1">NIS</div>
          <div className="col-span-2">: {studentInEditPersonality["nis"]}</div>
          <div className="font-bold col-span-1">Tahun pelajaran</div>
          <div className="col-span-2">
            : {studentInEditPersonality["academic_year"]}
          </div>
        </div>
        <form
          onSubmit={formikPersonality.handleSubmit}
          className="mb-6 flex items-start gap-3"
        >
          <label className="form-control grow">
            <div className="label">
              <span className="label-text">Kepribadian</span>
            </div>
            <select
              name="personalityId"
              onChange={formikPersonality.handleChange}
              value={formikPersonality.values.personalityId}
              className="select select-bordered"
            >
              <option disabled selected>
                - Pilih -
              </option>
              {personalities.map((personality, i) => (
                <option key={i} value={personality.id}>
                  {personality.desc}
                </option>
              ))}
            </select>
            <div className="label">
              {formikPersonality.touched.personalityId &&
                formikPersonality.errors.personalityId && (
                  <div className="text-red-500 text-xs">
                    {formikPersonality.errors.personalityId}
                  </div>
                )}
            </div>
          </label>
          <label className="form-control grow">
            <div className="label">
              <span className="label-text">Nilai</span>
            </div>
            <select
              name="grade"
              onChange={formikPersonality.handleChange}
              value={formikPersonality.values.grade}
              className="select select-bordered"
            >
              <option disabled selected>
                - Pilih -
              </option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
              <option value="E">E</option>
              <option value="F">F</option>
            </select>
            <div className="label">
              {formikPersonality.touched.grade &&
                formikPersonality.errors.grade && (
                  <div className="text-red-500 text-xs">
                    {formikPersonality.errors.grade}
                  </div>
                )}
            </div>
          </label>
          <button
            onClick={() => handleSubmitStudentPersonality()}
            type="submit"
            className="btn mt-9 btn-primary"
          >
            Tambah
          </button>
        </form>
        <div className="overflow-x-auto w-full">
          <table className="table min-w-full">
            {/* head */}
            <thead>
              <tr>
                <th></th>
                <th>Kepribadian</th>
                <th>Nilai</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {studentpersonalities.map((item, i) => (
                <tr key={i}>
                  <th>{i + 1}</th>
                  <td>{item?.personality?.desc ?? "-"}</td>
                  <td>{item?.grade ?? "-"}</td>
                  <td>
                    <div className="join">
                      <button
                        className="btn btn-sm join-item bg-red-500 text-white tooltip"
                        data-tip="hapus"
                        onClick={() => handleDeleteStudentPersonality(item?.id)}
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
      </Modal>
      <Modal id="add-angka">
        <div className="w-full flex justify-center flex-col items-center">
          <span className="text-xl font-bold">Tambah Raport Angka</span>
          <div className="mt-5 flex justify-start w-full flex-col gap-3">
            <form
              onSubmit={formik.handleSubmit}
              className="flex justify-start w-full flex-col gap-3"
            >
              <div className="flex flex-col w-full">
                <label htmlFor="" className="font-bold">
                  Kelas
                </label>
                <select
                  className={`select join-item w-full select-bordered ${
                    formik.touched.classId && formik.errors.classId
                      ? "select-error"
                      : ""
                  }`}
                  name="classId"
                  value={formik.values.classId}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  <option selected>pilih kelas</option>
                  {kelas?.map((item: any, index: number) => (
                    <option
                      value={item.id}
                      key={index}
                    >{`${item.level}-${item.class_name}`}</option>
                  ))}
                </select>
                {formik.touched.classId && formik.errors.classId ? (
                  <div className="text-red-500 text-xs">
                    {formik.errors.classId}
                  </div>
                ) : null}
              </div>
              <div className="flex flex-col w-full">
                <label htmlFor="" className="font-bold">
                  Nama
                </label>
                <select
                  className={`select join-item w-full select-bordered ${
                    formik.touched.studentId && formik.errors.studentId
                      ? "select-error"
                      : ""
                  }`}
                  name="studentId"
                  value={formik.values.studentId}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  <option selected>pilih siswa</option>
                  {DataSiswa?.map((item: any, index: number) => (
                    <option value={item?.id} key={index}>
                      {item?.studentclass.student.full_name}
                    </option>
                  ))}
                </select>
                {formik.touched.studentId && formik.errors.studentId ? (
                  <div className="text-red-500 text-xs">
                    {formik.errors.studentId}
                  </div>
                ) : null}
              </div>
              <div className="flex flex-col w-full">
                <label htmlFor="" className="font-bold">
                  Semester
                </label>
                <select
                  className={`select join-item w-full select-bordered ${
                    formik.touched.semester && formik.errors.semester
                      ? "select-error"
                      : ""
                  }`}
                  name="semester"
                  value={formik.values.semester}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  <option selected>Semester</option>
                  <option value={"1"}>Semester 1</option>
                  <option value={"2"}>Semester 2</option>
                </select>
                {formik.touched.semester && formik.errors.semester ? (
                  <div className="text-red-500 text-xs">
                    {formik.errors.semester}
                  </div>
                ) : null}
              </div>
              <div className="flex flex-col w-full">
                <label htmlFor="" className="font-bold">
                  Mapel
                </label>
                <select
                  className={`select join-item w-full select-bordered ${
                    formik.touched.subjectId && formik.errors.subjectId
                      ? "select-error"
                      : ""
                  }`}
                  name="subjectId"
                  value={formik.values.subjectId}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  <option selected>Pelajaran</option>
                  {mapel?.map((item: any, index: number) => (
                    <option value={item.id} key={index}>
                      {item.name}
                    </option>
                  ))}
                </select>
                {formik.touched.subjectId && formik.errors.subjectId ? (
                  <div className="text-red-500 text-xs">
                    {formik.errors.subjectId}
                  </div>
                ) : null}
              </div>
              <div className="flex flex-col w-full">
                <label htmlFor="" className="font-bold">
                  Nilai (1-10)
                </label>
                <input
                  type="number"
                  placeholder="7.5"
                  className={`input input-bordered w-full ${
                    parseInt(formik.values.nilai) > 10 ? "input-error" : ""
                  } ${
                    formik.touched.nilai && formik.errors.nilai
                      ? "input-error"
                      : ""
                  } `}
                  name="nilai"
                  value={formik.values.nilai}
                  onBlur={formik.handleBlur}
                  onChange={(e) => {
                    formik.handleChange(e), numberToWords(e.target.value);
                  }}
                />
                <span
                  className={`text-red-500 text-xs ${
                    parseInt(formik.values.nilai) > 10 ? "" : "hidden"
                  }`}
                >
                  Nilai tidak boleh lebih dari 10
                </span>
                {formik.touched.nilai && formik.errors.nilai ? (
                  <div className="text-red-500 text-xs">
                    {formik.errors.nilai}
                  </div>
                ) : null}
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
            </form>
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
                <option selected>pilih kelas</option>
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
                <option selected>Semester</option>
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
                <option selected>Pelajaran</option>
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
                <option selected>Semester</option>
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
                <option selected>pilih kelas</option>
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
                <option selected>Pelajaran</option>
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
                disabled={!arrayKelas || !arrayMapel}
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
      <Modal id="view-angka" width="w-11/12 max-w-7xl">
        <div className="w-full flex flex-col items-center">
          <span className="text-xl font-bold">Raport Angka</span>
          <span className=" mb-5">{arrayNumber?.full_name}</span>

          <div className="w-full max-h-[800px] mt-10 overflow-auto">
            <div className="w-full flex justify-end">
              <button
                className="btn mb-4 bg-cyan-500 text-white"
                onClick={generatePdf}
              >
                Generate PDF
              </button>
            </div>
            <table className="table table-zebra table-xs shadow-lg">
              <thead className="bg-blue-400 text-white">
                <tr>
                  <th rowSpan={2}>No</th>
                  <th rowSpan={2}>Mata Pelajaran</th>
                  <th rowSpan={2}>KKM</th>
                  <th colSpan={2} className="text-center">
                    Nilai
                  </th>
                </tr>
                <tr>
                  <th>Angka</th>
                  <th>Huruf</th>
                </tr>
              </thead>
              <tbody>
                {arrayNumber?.number_reports?.map(
                  (item: any, index: number) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item?.subject_name}</td>
                      <td>{item?.threshold}</td>
                      <td>{item?.grade}</td>
                      <td>{item?.grade_text}</td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default RaportAngka;
