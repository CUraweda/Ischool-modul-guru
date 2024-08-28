import { useState, useEffect } from "react";
import Modal from "../modal";
import { FaCodeMerge } from "react-icons/fa6";
import { FaFilePdf } from "react-icons/fa";
import { Task, Student, Raport, KepribadianSiswa } from "../../midleware/api";
import { globalStore, Store, useProps } from "../../store/Store";
import Swal from "sweetalert2";
import { IpageMeta, PaginationControl } from "../PaginationControl";
import { Input, Select } from "../Input";

const RaportAll = () => {
  const { academicYear } = globalStore();
  const { token } = Store();
  const { setKelasProps } = useProps();
  const [Class, setClass] = useState<any[]>([]);
  const [siswa, setSiswa] = useState<any[]>([]);
  // const [rapot, setRapot] = useState<any[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<any[]>([]);
  const [selectedReports, setSelectedReports] = useState<any[]>([]);
  const [dataRaport, setDataRaport] = useState<any>([]);
  const [selectedNIS, setSelectedNIS] = useState<string | null>(null);

  const showModal = (props: string) => {
    let modalElement = document.getElementById(`${props}`) as HTMLDialogElement;
    if (modalElement) {
      getClass();
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

  useEffect(() => {
    getStudent();
    getDataRaport();
  }, [filter, academicYear]);

  useEffect(() => {
    getDataRaport();
    getClass();
  }, []);

  const getClass = async () => {
    const response = await Task.GetAllClass(token, 0, 20, "Y", "N", "Y");
    setClass(response.data.data.result);
  };

  const getStudent = async () => {
    if (!filter.classId) return;

    try {
      const response = await Student.GetStudentByClass(
        token,
        filter.classId,
        academicYear
      );
      setSiswa(response.data.data);
    } catch (error) {
      closeModal("add-presensi");
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Gagal Mengambil data siswa, silakan refresh halaman !",
      });
    }
  };

  const getDataRaport = async () => {
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
      const { result, ...meta } = response.data.data;
      setDataRaport(result);
      setPageMeta(meta);
    } catch (error) {
      console.log(error);
    }
  };

  const createRaport = async () => {
    if (selectedStudents) {
      const createPromise = selectedStudents.map((item: any) => {
        const dataRest = {
          student_class_id: item.id,
          semester: filter.semester,
        };
        return create(dataRest);
      });
      await Promise.all(createPromise);
      closeModal("add-raport-siswa");
    }
  };
  const create = async (data: any) => {
    await Raport.createStudentRaport(token, data);
    getDataRaport();
  };

  const confirmDelete = async (nis: any) => {
    try {
      const result = await Swal.fire({
        title: "Apakah anda yakin?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Ya!",
        cancelButtonText: "Tidak",
      });

      if (result.isConfirmed) {
        await deleteRaport();
        setSelectedReports([]);
        const relatedPersonalities = await KepribadianSiswa.showAll(token, nis);
        const data = relatedPersonalities.data.data.result;

        for (const personality of data) {
          await KepribadianSiswa.delete(token, personality.id);
        }
        Swal.fire({
          title: "Data raport sukses terhapus!",
          icon: "success",
          showCancelButton: false,
          confirmButtonColor: "#3085d6",
          confirmButtonText: "Ok!",
        });
      }
    } catch (error) {
      console.error("Terjadi kesalahan saat konfirmasi penghapusan:", error);
    }
  };

  const deleteRaport = async () => {
    if (selectedReports) {
      const createPromise = selectedReports.map((item: any) => {
        return hapus(item.id);
      });
      await Promise.all(createPromise);
    }
  };

  const hapus = async (id: any) => {
    await Raport.deleteStudentRaport(token, id);
    getDataRaport();
  };

  const downloadTugas = async (path: string) => {
    try {
      const response = await Task.downloadTugas(token, path);
      const urlParts = path.split("/");
      const fileName = urlParts.pop() || "";
      const blobUrl = window.URL.createObjectURL(response.data);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.setAttribute("download", fileName);
      link.style.display = "none";

      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.log(error);
    }
  };

  const downloadRaportMerge = async (id: any) => {
    try {
      await Raport.downloadMergeRaport(token, id);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Gagal melakukan merge, Silahkan refresh halaman !",
      });
      console.error(error);
    }
  };

  return (
    <div>
      <div className="w-full flex justify-between gap-2">
        <div className="join gap-2">
          <select
            className="select select-bordered w-full"
            value={filter.classId}
            onChange={(e) => {
              handleFilter("classId", e.target.value),
                setKelasProps(e.target.value);
            }}
          >
            <option selected>Kelas</option>
            {Class?.map((item: any, index: number) => (
              <option
                value={item.id}
                key={index}
              >{`${item.level}-${item.class_name}`}</option>
            ))}
          </select>
          <select
            className="select select-bordered w-full"
            value={filter.semester}
            onChange={(e) => handleFilter("semester", e.target.value)}
          >
            <option selected>Semester</option>
            <option value={1}>Ganjil</option>
            <option value={2}>Genap</option>
          </select>
        </div>
        <div className="flex justify-end gap-2">
          <button
            className="btn btn-ghost bg-green-500 text-white"
            onClick={() => showModal("add-raport-siswa")}
          >
            Tambah
          </button>
          <button
            className="btn btn-ghost bg-red-600 text-white"
            onClick={() => confirmDelete(selectedNIS)}
          >
            Hapus
          </button>
        </div>
      </div>
      {/* <div className="mt-5">
      <h2>Selected Reports (JSON)</h2>
      <pre>{JSON.stringify(selectedReports.map(item => item.id), null, 2)}</pre>
    </div> */}
      <div className="overflow-x-auto mt-5">
        <table className="table table-md">
          <thead>
            <tr className="bg-blue-300">
              <th>
                <input
                  type="checkbox"
                  className="checkbox"
                  onChange={(e) => {
                    if (e.target.checked) {
                      // Set all reports to selected
                      setSelectedReports(dataRaport); // Menggunakan dataRaport yang merupakan daftar semua item di tabel
                    } else {
                      // Deselect all reports
                      setSelectedReports([]);
                    }
                  }}
                />
              </th>

              <th>No</th>
              <th>Nama Siswa</th>
              <th>Semester</th>
              <th>Rapot Angka</th>
              <th>Rapot Narasi</th>
              <th>Raport Portofolio</th>
              <th>Raport Siswa</th>
              <th>Aksi</th>
              {/* <th>Action</th> */}
            </tr>
          </thead>
          <tbody>
            {dataRaport?.map((item: any, index: number) => (
              <tr
                key={index}
                onClick={() => setSelectedNIS(item?.studentclass?.student?.nis)}
              >
                <th>
                  <input
                    checked={selectedReports.some(
                      (report) => report.id === item.id
                    )}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedReports([...selectedReports, item]);
                      } else {
                        setSelectedReports(
                          selectedReports.filter(
                            (report) => report.id !== item.id
                          )
                        );
                      }
                    }}
                    type="checkbox"
                    className="form-checkbox h-5 w-5 text-blue-600"
                  />
                </th>
                <th>
                  {index + 1 + (pageMeta?.page ?? 0) * (pageMeta?.limit ?? 0)}
                </th>
                <td>{item?.studentclass.student.full_name}</td>
                <td>{item?.semester == 1 ? "Ganjil" : "Genap"}</td>
                <td>
                  <button
                    className={`btn btn-sm join-item bg-green-500 text-white tooltip ${
                      !item?.number_path ? "btn-disabled" : ""
                    }`}
                    data-tip="Download Rapor Angka"
                    onClick={() => downloadTugas(item?.number_path)}
                  >
                    <span className="text-xl">
                      <FaFilePdf />
                    </span>
                  </button>
                </td>
                <td>
                  <button
                    className={`btn btn-sm join-item bg-green-500 text-white tooltip ${
                      !item?.narrative_path ? "btn-disabled" : ""
                    }`}
                    data-tip="Download Rapor Narasi"
                    onClick={() => downloadTugas(item?.narrative_path)}
                  >
                    <span className="text-xl">
                      <FaFilePdf />
                    </span>
                  </button>
                </td>
                <td>
                  <button
                    className={`btn btn-sm join-item bg-green-500 text-white tooltip ${
                      !item?.portofolio_path ? "btn-disabled" : ""
                    }`}
                    data-tip="Download Rapor Portofolio"
                    onClick={() => downloadTugas(item?.portofolio_path)}
                  >
                    <span className="text-xl">
                      <FaFilePdf />
                    </span>
                  </button>
                </td>

                <td>
                  <button
                    className={`btn btn-sm join-item bg-green-500 text-white tooltip ${
                      !item?.merged_path ? "btn-disabled" : ""
                    }`}
                    data-tip="Download Rapor Siswa"
                    onClick={() => downloadTugas(item?.merged_path)}
                  >
                    <span className="text-xl">
                      <FaFilePdf />
                    </span>
                  </button>
                </td>
                <td className="flex items-center justify-between">
                  <button
                    className={`btn btn-sm join-item bg-orange-500 text-white tooltip ${
                      !item?.number_path ||
                      !item?.narrative_path ||
                      !item?.portofolio_path
                        ? "btn-disabled"
                        : ""
                    }`}
                    onClick={() => downloadRaportMerge(item?.id)}
                  >
                    <span className="text-xl">
                      <FaCodeMerge />
                    </span>
                  </button>

                  {/* <button
                    className={`btn btn-sm join-item bg-red-600 text-white tooltip`}
                    onClick={() => downloadRaportMerge(item?.id)}
                  >
                    <span className="text-xl">
                      <FaRegTrashAlt />
                    </span>
                  </button> */}
                </td>
                {/* <td>
                  <button
                    className={`btn btn-sm join-item bg-green-500 text-white tooltip ${
                      !item?.number_path && !item?.narrative_path && !item?.portofolio_path ? "btn-disabled" : ""
                    }`}
                    data-tip="Download Rapor Siswa"
                    onClick={() => downloadTugas(item?.merged_path)}
                  >
                    <span className="text-xl">
                      <FaFilePdf />
                    </span>
                  </button>
                </td> */}
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

      <Modal id="add-raport-siswa" width="w-11/12 max-w-5xl">
        <div className="w-full flex flex-col items-center">
          <p className="text-xl font-bold">Tambah Raport Siswa</p>

          <Input label="Tahun pelajaran" value={academicYear} disabled />

          <Select
            label="Kelas"
            keyValue="id"
            displayBuilder={(opt) => `${opt.level}-${opt.class_name}`}
            options={Class}
            value={filter.classId}
            onChange={(e) => handleFilter("classId", e.target.value)}
          />

          <Select
            label="Semester"
            options={[1, 2]}
            value={filter.semester}
            onChange={(e) => handleFilter("semester", e.target.value)}
          />

          <div className="w-full max-h-[400px] mt-10 overflow-auto">
            <table className="table shadow-lg">
              <thead className="bg-blue-400 text-white">
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      className="checkbox"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedStudents(siswa);
                        } else {
                          setSelectedStudents([]);
                        }
                      }}
                    />
                  </th>
                  <th>Name</th>
                  <th>NIS</th>
                  <th>Kelas</th>
                </tr>
              </thead>
              <tbody>
                {siswa?.map((item: any, index: number) => (
                  <tr key={index} className={``}>
                    <th>
                      <input
                        type="checkbox"
                        checked={selectedStudents.some(
                          (student) => student.student.id === item.student.id
                        )}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedStudents([...selectedStudents, item]);
                          } else {
                            setSelectedStudents(
                              selectedStudents.filter(
                                (student) =>
                                  student.student.id !== item.student.id
                              )
                            );
                          }
                        }}
                        className="checkbox"
                      />
                    </th>
                    <td>{item?.student?.full_name}</td>
                    <td>{item?.student?.nis}</td>
                    <td>{item?.student?.class}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="w-full flex gap-3 mt-5 justify-end">
            <button
              className="btn btn-ghost bg-green-500 text-white"
              onClick={createRaport}
            >
              Submit
            </button>
            <button
              className="btn btn-ghost bg-gray-500 text-white"
              onClick={() => closeModal("add-raport-siswa")}
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default RaportAll;
