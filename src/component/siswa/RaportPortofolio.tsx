import { useState, useEffect, ChangeEvent } from "react";
import { FaFilePdf } from "react-icons/fa";
import { MdCloudUpload } from "react-icons/md";
import Modal from "../modal";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { Task, Raport } from "../../midleware/api";
import { Store, useProps } from "../../store/Store";
import { CiFolderOff } from "react-icons/ci";
import Swal from "sweetalert2";
import { IpageMeta, PaginationControl } from "../PaginationControl";

const RaportPortofolio = () => {
  const { token } = Store();
  const { setSemesterProps, setKelasProps, semesterProps } = useProps();
  const [DataSiswa, setDataSiswa] = useState<any[]>([]);
  const [kelas, setKelas] = useState<any[]>([]);
  const [porto, setPorto] = useState<any[]>([]);
  const [reportId, setReportId] = useState<string>("");
  const [file, showFile] = useState<any>();
  const [fileUpload, setFile] = useState<any>(null);
  const [komen, setKomen] = useState<string>("");

  const [studentClass, setStudentClass] = useState<string>("");
  const [smt, setSmt] = useState<string>(semesterProps || "1");
  const [merge, setMerge] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

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

  const [pageMeta, setPageMeta] = useState<IpageMeta>({ page: 0, limit: 10 });
  const [filter, setFilter] = useState({
    academic: "",
    classId: "",
    semester: "1",
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

  useEffect(() => {
    getClass();
  }, []);

  useEffect(() => {
    getStudent();
  }, [filter]);

  const getClass = async () => {
    const response = await Task.GetAllClass(token, 0, 20, "Y", "N");
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
        "Y"
      );
      const { result, ...meta } = response.data.data;
      setDataSiswa(result);
      setPageMeta(meta);
    } catch (error) {
      console.log(error);
    }
  };

  const getPortoByRapotId = async (id: string) => {
    setReportId(id);
    showModal("show-portofolio");
    const response = await Raport.getPortofolioByRaport(token, id);
    const dataRest = response.data.data;
    const type = dataRest?.map((item: any) => item.type);

    if (
      type.length === 2 &&
      type.includes("Guru") &&
      type.includes("Orang Tua")
    ) {
      setMerge(true);
    } else {
      setMerge(false);
    }
    setPorto(response.data.data);
    showFile(undefined);
  };

  const showFilePortofolio = async (path: string) => {
    try {
      const response = await Task.downloadTugas(token, path);
      const blob = new Blob([response.data], { type: "application/pdf" }); //
      const blobUrl = window.URL.createObjectURL(blob);

      showFile(blobUrl);
    } catch (error) {
      console.log(error);
    }
  };

  const handleFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setFile(file || null);
  };

  const CreatePortofolio = async (type: string) => {
    const formData = new FormData();
    formData.append("student_report_id", reportId);
    formData.append("type", type);
    formData.append("file", fileUpload);

    try {
      await Raport.uploadPortofolio(token, formData);
      Swal.fire({
        position: "center",
        icon: "success",
        title: "success upload portofolio",
        showConfirmButton: false,
        timer: 1000,
      });
      getStudent();
      closeModal("upload-portofolio");
      setFile(null);
    } catch (error: any) {
      closeModal("upload-portofolio");
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.message,
      });
      console.log(error);
    }
  };

  const CreateKomenGuru = async () => {
    const data = {
      student_class_id: studentClass,
      semester: smt,
      por_teacher_comments: komen,
    };

    await Raport.createKomentar(token, reportId, data);
    getStudent();
    closeModal("komen-guru-porto");
    setKomen("");
  };

  const handleKomen = (
    komen: string,
    kelas: string,
    id: string,
    smt: string
  ) => {
    showModal("komen-guru-porto");
    setKomen(komen);
    setReportId(id);
    setStudentClass(kelas);
    setSmt(smt);
  };

  const handleMerge = async () => {
    try {
      setLoading(true);
      await Raport.mergePortofolio(token, reportId);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="w-full flex justify-between gap-2">
        <div className="join">
          <select
            value={filter.academic}
            onChange={(e) => handleFilter("academic", e.target.value)}
            className="select join-item w-32 max-w-md select-bordered"
          >
            <option selected>Tahun Pelajaran</option>
            <option>2023/2024</option>
            <option>2024/2025</option>
          </select>
          <select
            className="select join-item w-32 max-w-md select-bordered"
            value={filter.semester}
            onChange={(e) => {
              handleFilter("semester", e.target.value),
                setSemesterProps(e.target.value);
            }}
          >
            <option selected>Semester</option>
            <option value={"1"}>Ganjil</option>
            <option value={"2"}>Genap</option>
          </select>
          <select
            className="select join-item w-32 max-w-md select-bordered"
            value={filter.classId}
            onChange={(e) => {
              handleFilter("classId", e.target.value),
                setKelasProps(e.target.value);
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
        </div>
      </div>

      <div className="overflow-x-auto mt-5">
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
                <th>{index + 1}</th>
                <td>{item?.studentclass?.student.full_name}</td>
                <td>{item?.studentclass?.class?.class_name}</td>
                <td className="flex items-center">
                  <div className="join">
                    <button
                      className="btn btn-sm join-item bg-cyan-500 text-white tooltip"
                      data-tip="Upload portofolio"
                      onClick={() => {
                        showModal("upload-portofolio"), setReportId(item.id);
                      }}
                    >
                      <span className="text-2xl">
                        <MdCloudUpload />
                      </span>
                    </button>

                    <button
                      className="btn btn-sm join-item bg-yellow-500 text-white tooltip"
                      data-tip="lihat portofolio"
                      onClick={() => getPortoByRapotId(item?.id)}
                    >
                      <span className="text-xl">
                        <FaFilePdf />
                      </span>
                    </button>
                    <button
                      className={`btn join-item btn-ghost btn-sm text-xl text-white tooltip ${
                        item.por_teacher_comments
                          ? "bg-green-500"
                          : "bg-gray-400"
                      }`}
                      data-tip="Komentar Guru"
                      onClick={() =>
                        handleKomen(
                          item.por_teacher_comments,
                          item.student_class_id,
                          item.id,
                          item.semester
                        )
                      }
                    >
                      <IoChatboxEllipsesOutline />
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

      <Modal id="upload-portofolio">
        <div className="w-full flex flex-col items-center">
          <span className="text-xl font-bold">Upload Raport Portofolio</span>
          <div className="w-full mt-5 gap-2 flex flex-col">
            <button className="btn btn-sm w-1/3 bg-green-300">
              dowload template
            </button>
            <label className="mt-4 font-bold">Upload File</label>
            <input
              type="file"
              onChange={handleFile}
              className="file-input file-input-bordered w-full"
            />
          </div>

          <div className="w-full flex justify-center mt-10 gap-2">
            <button
              className="btn bg-green-500 text-white font-bold w-full"
              onClick={() => CreatePortofolio("Guru")}
            >
              Submit
            </button>
          </div>
        </div>
      </Modal>

      <Modal id="show-portofolio" width="w-11/12 max-w-5xl">
        <div className="join">
          {porto?.map((item: any, index: number) => (
            <button
              className="btn join-item bg-blue-500 text-white flex items-center"
              key={index}
              onClick={() => showFilePortofolio(item?.file_path)}
            >
              <span className="text-xl">
                <FaFilePdf />
              </span>
              {item?.type}
            </button>
          ))}
          <button
            className={`btn join-item bg-red-500 text-white flex items-center ${
              merge ? "" : "hidden"
            }`}
            onClick={handleMerge}
          >
            <span className="text-xl">
              <FaFilePdf />
            </span>
            {loading ? (
              <span className="loading loading-infinity loading-lg"></span>
            ) : (
              "Merge"
            )}
          </button>
        </div>
        <div className="w-full flex flex-col items-center justify-center min-h-svh">
          {file ? (
            <iframe className="w-full min-h-svh mt-5" src={file} />
          ) : (
            <>
              <span className="text-6xl font-bold">
                <CiFolderOff />
              </span>
              <span className="text-xl">Tidak Ada Data</span>
            </>
          )}
        </div>
      </Modal>
      <Modal id="komen-guru-porto" width="w-11/12 max-w-5xl">
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
    </div>
  );
};

export default RaportPortofolio;
