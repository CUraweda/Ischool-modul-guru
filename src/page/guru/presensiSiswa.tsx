import { useState, useEffect } from "react";
import { FiPlus } from "react-icons/fi";
import Modal from "../../component/modal";
import { BiPencil, BiTrash } from "react-icons/bi";
import { Task, Student } from "../../midleware/api";
import { Store } from "../../store/Store";
import Swal from "sweetalert2";
import {
  IpageMeta,
  PaginationControl,
} from "../../component/PaginationControl";
import { FaSearch } from "react-icons/fa";

const PresensiSiswa = () => {
  const { token } = Store();
  const today = new Date();
  const [date, setDate] = useState<any>(today.toISOString().substr(0, 10));
  const [kelas, setKelas] = useState<any[]>([]);
  const [siswa, setSiswa] = useState<any[]>([]);
  const [dataSiswa, setDataSiswa] = useState<any[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<any[]>([]);
  const [totalCreate, setTotalCreate] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [presensi, setPresensi] = useState<any>();
  const [transport, setTransport] = useState<any>();
  const [idPresensi, setIdPresensi] = useState<any>();
  const [idSiswa, setIdSiswa] = useState<any>();

  useEffect(() => {
    getClass();
  }, []);

  const [search, setSearch] = useState("");
  const [pageMeta, setPageMeta] = useState<IpageMeta>({ page: 0, limit: 10 });
  const [filter, setFilter] = useState({
    classId: "",
    search: "",
    semester: 1,
    attDate: today.toISOString().substr(0, 10),
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
    getPresensiData();
    setSelectedStudents([]);
  }, [filter]);

  const formattedDate = new Date(date).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

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

  const getClass = async () => {
    const response = await Task.GetAllClass(token, 0, 20, "Y");
    setKelas(response.data.data.result);
  };

  const getPresensiData = async () => {
    const newDate = new Date(filter.attDate);
    const isoDate = newDate.toISOString();
    const formattedDate = isoDate.slice(0, 10);
    const response = await Student.showAllPresensi(
      token,
      filter.search,
      filter.page,
      filter.limit,
      filter.classId,
      formattedDate,
      "Y"
    );
    const { result, ...meta } = response.data.data;
    setDataSiswa(result);
    setPageMeta(meta);
  };
  const [Tahun, setTahun] = useState<any[]>([]);

  const generateAcademicYears = () => {
    const currentYear = new Date().getFullYear();
    const startYear = currentYear;

    setTahun(
      Array.from(
        { length: 1 }, // Menghasilkan array dengan panjang 1
        (_, index) => `${startYear + index}/${startYear + index + 1}`
      )
    );
  };
  useEffect(() => generateAcademicYears(), []);
  const getStudent = async () => {
    if (!filter.classId) return;
    try {
      const response = await Student.GetStudentByClass(
        token,
        filter.classId,
        Tahun.toString()
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

  const createPresensi = async () => {
    if (selectedStudents) {
      try {
        setLoading(true);
        const dataStatus = selectedStudents
          .filter((item: any) => item.presensi === "Hadir")
          .map((item: any) => item.student.id);

        setTotalCreate(dataStatus);

        if (dataStatus.length === 0) {
          const createPromises = selectedStudents.map((item: any) => {
            const dataRest = {
              student_class_id: item.class_id,
              att_date: new Date(date).setHours(0, 0, 0, 0),
              remark: item.transportasi ? item.transportasi : "🚶‍♂️Jalan Kaki",
              status: item.presensi ? item.presensi : "Hadir",
              semester: filter.semester ? filter.semester : "1",
            };

            if (dataRest.status !== "Hadir") {
              delete dataRest.remark;
            }

            const isExist = dataSiswa.some(
              (data) =>
                data.studentclass.student.id === item.student.id &&
                new Date(data.att_date).setHours(0, 0, 0, 0) ===
                  new Date(date).setHours(0, 0, 0, 0)
            );

            return isExist ? null : create(dataRest);
          });
          await Promise.all(createPromises);
          closeModal("add-presensi");
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Data Berhasil Disimpan",
            showConfirmButton: false,
            timer: 1500,
          });
          getPresensiData();
          setSelectedStudents([]);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
  };

  const create = async (data: any) => {
    if (data.status !== "Hadir") {
      delete data.remark;
    }
    await Student.CreatePresensi(token, data);
  };

  const deletePresensi = async (id: number) => {
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
          deletePresensiApi(id);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const deletePresensiApi = async (id: number) => {
    await Student.deletePresensi(token, id);
    Swal.fire({
      title: "Deleted!",
      text: "Your file has been deleted.",
      icon: "success",
    });
    getPresensiData();
  };

  const handlePresensi = async (id: number) => {
    showModal("edit-presensi");
    const response = await Student.GetPresensiById(token, id);
    const data = response.data.data[0];
    setPresensi(data.status);
    setTransport(data.remark || "🚶‍♂️jalan kaki"); // Set default value for transport if it's null
    setIdPresensi(id);
    setIdSiswa(data.student_class_id);
  };

  const handleEditPresensi = async () => {
    try {
      console.log("Status Presensi:", presensi);
      console.log("Transportasi:", transport);

      const data: any = {
        student_class_id: idSiswa,
        status: presensi,
        att_date: new Date(date).setHours(0, 0, 0, 0),
        semester: filter.semester,
      };

      // Jika statusnya adalah "Hadir", tambahkan remark
      if (presensi === "Hadir") {
        data.remark = transport || "🚶‍♂️jalan kaki";
      } else {
        data.remark = "";
      }

      // Kirim data ke API
      const response = await Student.UpdatePresensi(token, idPresensi, data);
      console.log("Response:", response);

      // Tutup modal dan perbarui data presensi
      closeModal("edit-presensi");
      getPresensiData();
    } catch (error) {
      console.log("Error:", error);
    }
  };

  return (
    <>
      <div className="flex justify-center w-full mt-5 flex-col items-center">
        <span className="text-3xl font-bold">Presensi Siswa</span>
        <span className="text-xl">{formattedDate}</span>
        <div className="my-10 w-full p-5 bg-white rounded-md">
          <div className="join w-full flex-wrap flex-col [&>*]:w-full sm:flex-row sm:[&>*]:w-auto justify-end mb-5">
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
            <select
              className="select select-bordered w-36 join-item"
              value={filter.classId}
              onChange={(e) => handleFilter("classId", e.target.value)}
            >
              <option value={""} selected>
                Kelas
              </option>
              {kelas?.map((item: any, index: number) => (
                <option
                  value={item.id}
                  key={index}
                >{`${item.level}-${item.class_name}`}</option>
              ))}
            </select>
            <input
              type="date"
              placeholder="Type here"
              className="input input-bordered  join-item"
              value={filter.attDate}
              onChange={(e) => handleFilter("attDate", e.target.value)}
            />
            <button
              className="btn bg-green-500 text-white font-bold join-item"
              onClick={() => showModal("add-presensi")}
            >
              <span className="text-xl">
                <FiPlus />
              </span>{" "}
              Tambah
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="table">
              {/* head */}
              <thead className="bg-blue-400 text-white">
                <tr>
                  <th>No</th>
                  <th>Name</th>
                  <th>NIS</th>
                  <th>Kelas</th>
                  <th>Presensi</th>
                  <th>Transportasi</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {dataSiswa && dataSiswa.length > 0 ? (
                  dataSiswa.map((item: any, index: number) => (
                    <tr key={index}>
                      <th>{index + 1}</th>
                      <td>{item?.studentclass?.student?.full_name}</td>
                      <td>{item?.studentclass?.student?.nis}</td>
                      <td>{item?.studentclass?.student?.class}</td>
                      <td>{item?.status}</td>
                      <td>{item?.remark ? item?.remark : "-"}</td>
                      <td className="join text-white">
                        <button
                          className="btn btn-sm btn-ghost bg-orange-600 text-xl join-item"
                          onClick={() => handlePresensi(item.id)}
                        >
                          <BiPencil />
                        </button>
                        <button
                          className="btn btn-sm btn-ghost bg-red-600 text-xl join-item"
                          onClick={() => deletePresensi(item.id)}
                        >
                          <BiTrash />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center">
                      Tidak ada data
                    </td>
                  </tr>
                )}
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

      <Modal id="add-presensi" width="w-11/12 max-w-5xl">
        <div className="w-full flex justify-center flex-col items-center">
          <span className="text-xl font-bold">Tambah Presensi</span>
          <div className="w-full flex flex-col gap-2">
            <label className="mt-4 font-bold">Kelas</label>
            <select
              className="select select-bordered w-full"
              value={filter.classId}
              onChange={(e) => handleFilter("classId", e.target.value)}
            >
              <option disabled selected>
                Kelas
              </option>
              {kelas?.map((item: any, index: number) => (
                <option
                  value={item.id}
                  key={index}
                >{`${item.level}-${item.class_name}`}</option>
              ))}
            </select>
          </div>
          <div className="w-full flex flex-col gap-2">
            <label className="mt-4 font-bold">Tangal Presensi</label>
            <input
              type="date"
              placeholder="Type here"
              className="input input-bordered  join-item"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="w-full flex flex-col gap-2">
            <label className="mt-4 font-bold">Semester</label>
            <select
              className="select select-bordered w-full"
              value={filter.semester}
              onChange={(e) => handleFilter("semester", +e.target.value)}
            >
              <option disabled selected>
                Semester
              </option>
              <option value={1}>Ganjil</option>
              <option value={2}>Genap </option>
            </select>
          </div>
          <div className="w-full max-h-[400px] mt-10 overflow-auto">
            <table className="table shadow-lg">
              {/* head */}
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
                  <th>Action</th>
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
                    <td className="flex join">
                      <select
                        className={`select select-bordered w-32 max-w-xs join-item ${
                          totalCreate.some((id) => id === item.student.id)
                            ? "bg-red-400"
                            : ""
                        }`}
                        value={item.presensi}
                        onChange={(e) => {
                          item.presensi = e.target.value;
                          if (
                            selectedStudents.some(
                              (student) =>
                                student.student.id === item.student.id
                            )
                          ) {
                            setSelectedStudents(
                              selectedStudents.map((student) =>
                                student.student.id === item.student.id
                                  ? { ...student, presensi: e.target.value }
                                  : student
                              )
                            );
                          }
                        }}
                        disabled={
                          !selectedStudents.some(
                            (student) => student.student.id === item.student.id
                          )
                        }
                      >
                        <option value="Hadir">Hadir</option>
                        <option value="Izin">Izin</option>
                        <option value="Alfa">Alfa</option>
                        <option value="Sakit">Sakit</option>
                      </select>
                      <select
                        className={`select select-bordered w-32 max-w-xs join-item ${
                          totalCreate.some((id) => id === item.student.id)
                            ? "bg-red-400"
                            : ""
                        }`}
                        value={item.transportasi}
                        onChange={(e) => {
                          item.transportasi = e.target.value;
                          if (
                            selectedStudents.some(
                              (student) =>
                                student.student.id === item.student.id
                            )
                          ) {
                            setSelectedStudents(
                              selectedStudents.map((student) =>
                                student.student.id === item.student.id
                                  ? { ...student, transportasi: e.target.value }
                                  : student
                              )
                            );
                          }
                        }}
                        disabled={
                          !selectedStudents.some(
                            (student) => student.student.id === item.student.id
                          ) ||
                          item.presensi == "Alfa" ||
                          item.presensi == "Sakit" ||
                          item.presensi == "Izin"
                        }
                      >
                        <option value="🚶‍♂️jalan kaki">Jalan Kaki</option>
                        <option value="🚌kendaraan umum">Kendaraan Umum</option>
                        <option value="🚗antar jemput">Antar Jemput</option>
                        <option value="🚲sepeda">Sepeda</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="w-full flex gap-3 justify-end mt-10 items-center">
            <span
              className={`text-red-500 font-bold ${
                totalCreate.length === 0 ? "hidden" : ""
              }`}
            >
              Isi Semua Field Terpilih !
            </span>
            <div className="flex gap-2">
              <button
                className="btn btn-ghost bg-green-500 w-32 text-white"
                onClick={createPresensi}
              >
                {loading ? (
                  <span className="loading loading-infinity loading-lg"></span>
                ) : (
                  "Submit"
                )}
              </button>
              <button
                className="btn btn-ghost bg-gray-400 w-32 text-white"
                onClick={() => closeModal("add-presensi")}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </Modal>
      <Modal id="edit-presensi">
        <div className="flex justify-center w-full ">
          <span className="text-xl font-bold">Edit Presensi</span>
        </div>
        <div className="w-full flex flex-col gap-2">
          <label className="mt-4 font-bold">Tanggal Presensi</label>
          <input
            type="date"
            placeholder="Type here"
            className="input input-bordered join-item"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div className="w-full flex flex-col gap-2">
          <label className="mt-4 font-bold">Presensi</label>
          <select
            className="select select-bordered w-full join-item"
            value={presensi}
            onChange={(e) => {
              setPresensi(e.target.value);
              if (e.target.value === "Hadir") {
                setTransport(transport || "🚶‍♂️jalan kaki");
              } else {
                setTransport("");
              }
            }}
          >
            <option value="Hadir">Hadir</option>
            <option value="Izin">Izin</option>
            <option value="Alfa">Alfa</option>
            <option value="Sakit">Sakit</option>
          </select>
        </div>
        <div className="w-full flex flex-col gap-2">
          <label className="mt-4 font-bold">Semester</label>
          <select
            className="select select-bordered w-full"
            value={filter.semester}
            onChange={(e) => handleFilter("semester", +e.target.value)}
          >
            <option disabled>Semester</option>
            <option value="1">Ganjil</option>
            <option value="2">Genap</option>
          </select>
        </div>
        <div className="w-full flex flex-col gap-2">
          <label className="mt-4 font-bold">Transportasi</label>
          <select
            className="select select-bordered w-full join-item"
            value={transport}
            onChange={(e) => setTransport(e.target.value)}
            disabled={presensi !== "Hadir"}
          >
            <option value="🚶‍♂️jalan kaki">Jalan Kaki</option>
            <option value="🚌kendaraan umum">Kendaraan Umum</option>
            <option value="🚗antar jemput">Antar Jemput</option>
            <option value="🚲sepeda">Sepeda</option>
          </select>
        </div>
        <div className="mt-5 w-full">
          <button
            className="btn bg-green-500 w-full text-white"
            onClick={handleEditPresensi}
          >
            Simpan
          </button>
        </div>
      </Modal>
    </>
  );
};

export default PresensiSiswa;
