import { useState, useEffect, ChangeEvent } from "react";
import {
  FaCheckCircle,
  FaPencilAlt,
  FaPlus,
  FaRegTrashAlt,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import Modal from "../../component/modal";
import { Raport } from "../../middleware/api";
import Swal from "sweetalert2";
import { BiTrash } from "react-icons/bi";
import { AiFillCloseCircle } from "react-icons/ai";
import { globalStore } from "../../store/Store";

const RaportNarasi = () => {
  const { academicYear } = globalStore();
  const [kategori, setKategori] = useState<any[]>([]);

  const [selectKategori, setSelectKategori] = useState<any>();
  const [data, setData] = useState<any>();
  const [dataSiswa, setDataSiswa] = useState<any>();
  const [trigerKet, settrigerKet] = useState<boolean>(false);
  const [deskripsi, setDeskripsi] = useState<any>([]);
  const [subKategori, setSubKategori] = useState<any>([]);
  const [selectDeskripsi, setSelectDeskripsi] = useState<any>([]);
  const [newDescripsi, setNewDeskripsi] = useState<string>("");
  const [idSubKategori, setIdSubKategori] = useState<string>("");
  const [komentar, setKomentar] = useState<string>("");
  const [idKomentar, setIdKomentar] = useState<string>("");
  const [trigerKomen, setTrigerKomen] = useState<boolean>(false);

  const [dataRaport, setDataRaport] = useState<any>([]);
  const [EditdataRaport, setEditDataRaport] = useState<any>();
  const [idSiswa, setIdSiswa] = useState(sessionStorage.getItem("idSiswa"));
  const [idNarasi, setNarasi] = useState(sessionStorage.getItem("idNar"));

  const idClass = sessionStorage.getItem("idClass");
  const smt = sessionStorage.getItem("smt");

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

  useEffect(() => {
    getKategori();
    getDataNarasi();
    getKomentarKategori();
  }, [selectKategori]);

  useEffect(() => {
    getStudent();
  }, [idClass]);

  const getKategori = async () => {
    try {
      const idClass = sessionStorage.getItem("idClass");
      const response = await Raport.getKategoriNarasi(idClass);
      setKategori(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getKomentarKategori = async (id?: string) => {
    try {
      const idRaport = id ? id : idNarasi;
      const response = await Raport.getKomentarNarasiSiswa(idRaport);
      sessionStorage.setItem("idNar", idRaport ?? "");
      const dataKomen = response.data?.data;
      const idKategori = selectKategori?.id;
      const filterKomenByKategori = dataKomen?.filter(
        (item: any) => item.narrative_cat_id === idKategori
      );
      const komentar = filterKomenByKategori[0]?.comments;
      setKomentar(komentar ? komentar : "");
      setIdKomentar(
        filterKomenByKategori[0]?.id ? filterKomenByKategori[0]?.id : ""
      );
      setTrigerKomen(filterKomenByKategori[0]?.id ? true : false);
    } catch (error) {
      console.log(error);
    }
  };

  const getDeskripsi = async () => {
    try {
      if (!subKategori) {
        closeModal("tambah-keterangan");
        closeModal("tambah-narasi");
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "pilih Sub kategori terlebih dahulu!",
        });
        return;
      } else {
        // const id = selectKategori?.id;
        const response = await Raport.getDeskripsiNarasi(idSubKategori);
        // console.log(response);
        setDeskripsi(response.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getStudent = async () => {
    try {
      const response = await Raport.showAllStudentReport(
        idClass ?? "",
        smt ?? 1,
        0,
        100,
        "Y",
        academicYear
      );

      const { result } = response.data.data;

      const dataSiswaa = result?.map((item: any) => item);
      const siswa = dataSiswaa.map((item: any) => item);

      setDataSiswa(siswa);
    } catch (error) {
      console.log(error);
    }
  };

  const getDataNarasi = async (id?: string) => {
    const smt = sessionStorage.getItem("smt");
    const siswaId = id ? id : idSiswa;

    const response = await Raport.getDataNarasiSiswa(siswaId, smt);

    sessionStorage.setItem("idSiswa", idSiswa ?? "");

    if (selectKategori) {
      const idKategori = selectKategori.id;
      const dataRaportSiswa = response.data.data.narrative_categories;
      const filteredData = dataRaportSiswa.filter(
        (item: any) => item.id === idKategori
      );

      setDataRaport(filteredData[0]);
    }

    setData(response.data.data);
  };

  const getSubKategori = async () => {
    setIdSubKategori("");
    try {
      if (!selectKategori) {
        closeModal("tambah-keterangan");
        closeModal("tambah-narasi");
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "pilih Sub kategori terlebih dahulu!",
        });
        return;
      } else {
        const id = selectKategori?.id;
        const response = await Raport.getSubCategoriNarasi(id);
        // console.log(response.data.data);
        setSubKategori(response.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const deleteNarasi = async (id: string) => {
    try {
      await Raport.deleteNarasi(id);
      getKategori();
      getDataNarasi();
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
  const createDeskripsi = async () => {
    try {
      const data = {
        narrative_sub_cat_id: idSubKategori,
        desc: newDescripsi,
      };
      await Raport.createDeskripsi(data);
      settrigerKet(false);
      setNewDeskripsi("");
      getDeskripsi();
    } catch (error) {
      console.log(error);
    }
  };

  const createKomentar = async () => {
    try {
      const idKategori = selectKategori.id;
      const idRaport = sessionStorage.getItem("idNar");
      const data = {
        student_report_id: idRaport,
        narrative_cat_id: idKategori,
        comments: komentar,
      };
      if (!komentar) {
        await Raport.deleteKomentarNarasi(idKomentar);
      } else if (idKomentar) {
        await Raport.updateKomentarKategori(idKomentar, data);
      } else {
        await Raport.createKomentarKategori(data);
      }

      Swal.fire({
        position: "center",
        icon: "success",
        title: "Your work has been saved",
        showConfirmButton: false,
        timer: 1000,
      });
      getKomentarKategori();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteDeskripsi = async (id: string) => {
    try {
      await Raport.deleteDeskripsiNarasi(id);

      getDeskripsi();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
      });
      closeModal("tambah-keterangan");
      closeModal("tambah-narasi");
      console.log(error);
    }
  };

  const createNarasiReport = async () => {
    try {
      const idRaport = sessionStorage.getItem("idNar");
      const smt = sessionStorage.getItem("smt");

      if (selectDeskripsi) {
        for (const item of selectDeskripsi) {
          const dataRest = {
            semester: smt ? smt : 1,
            narrative_desc_id: item.id,
            grade: item.nilai ? item.nilai : 1,
            student_report_id: idRaport,
          };
          console.log("dataRest", dataRest);

          try {
            const response = await Raport.createRapotNarasi(dataRest);
            console.log("Success:", response);
          } catch (err) {
            console.error("Error submitting dataRest:", dataRest, err);
            // optional: break atau continue jika terjadi error
            break; // stop jika ada error
          }
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setSelectDeskripsi([]);
      setSubKategori([]);
      closeModal("tambah-narasi");
      getDataNarasi();
    }
  };

  const handleCheckboxChange = (
    e: ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.checked ? Number(e.target.value) : null;
    setSelectDeskripsi((prevState: any) => {
      const newState = [...prevState];
      newState[index].nilai = value;
      return newState;
    });
  };

  const handleEditCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.checked ? Number(e.target.value) : null;
    setEditDataRaport((prevState: any) => {
      const newState = { ...prevState };
      newState.grade = value;

      return newState;
    });
  };

  const handleEditReport = async () => {
    try {
      const idRaportNarasi = EditdataRaport.id;
      const idRaport = sessionStorage.getItem("idNar") || "0";
      const smt = sessionStorage.getItem("smt");

      if (EditdataRaport) {
        const dataRest = {
          semester: smt ? smt : 1,
          narrative_desc_id: EditdataRaport.desc_id,
          grade: EditdataRaport.grade ? EditdataRaport.grade : 1,
          student_report_id: parseInt(idRaport),
        };
        await Raport.editReportNarasi(idRaportNarasi, dataRest);
      }
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Your work has been saved",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
      });
      console.log(error);
    } finally {
      setSelectDeskripsi([]);
      setSubKategori([]);
      closeModal("edit-narasi");
      getDataNarasi();
    }
  };

  const handleClik = (id: any) => {
    const parts = id.split(",");
    const [a, b] = parts;

    setIdSiswa(b);
    getDataNarasi(b);
    getKomentarKategori(a);
    setNarasi(a)
  };

  return (
    <>
      <div className="p-5">
        <div className="text-sm breadcrumbs">
          <ul>
            <li>
              <Link to={"/guru/rapor-siswa"}>
                <a>Siswa</a>
              </Link>
            </li>
            <li>
              <Link to={"/guru/rapor-siswa"}>
                <a>Raport Siswa</a>
              </Link>
            </li>
            <li>Narasi</li>
          </ul>
        </div>
        <div className="w-full mt-10 ">
          <div className="flex items-center w-full justify-start gap-3 mb-5 pr-10">
            <div className="join">
              <select
                className="select w-32 max-w-md select-bordered join-item"
                onChange={(e) => {
                  handleClik(e.target.value);
                }}
              >
                <option selected value={""}>
                  Siswa
                </option>
                {dataSiswa?.map((item: any, index: number) => (
                  <option key={index} value={[item.id, item?.studentclass?.id]}>
                    {item?.studentclass?.student.full_name}
                  </option>
                ))}
              </select>
              <select
                className="select w-32 max-w-md select-bordered join-item"
                onChange={(e) => setSelectKategori(JSON.parse(e.target.value))}
              >
                <option selected value={""}>
                  Kategori
                </option>
                {kategori?.map((item: any, index: number) => (
                  <option value={JSON.stringify(item)} key={index}>
                    {item?.category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="font-bold">
            <div className="flex gap-2 w-1/2">
              <div className="w-1/4">Nama</div>
              <div className="w-3/5">: {data?.full_name}</div>
            </div>
            <div className="flex gap-2 w-1/2">
              <div className="w-1/4">Kelas</div>
              <div className="w-3/5">: {data?.class_name}</div>
            </div>
            <div className="flex gap-2 w-1/2">
              <div className="w-1/4">Kategori Narasi</div>
              <div className="w-3/5">: {selectKategori?.category}</div>
            </div>
          </div>

          <div className="max-h-[600px] overflow-auto  pb-10 ">
            <div
              className={`${
                dataRaport?.narrative_sub_categories?.length === 0 ||
                !selectKategori
                  ? ""
                  : "hidden"
              } w-full p-2 mt-5 rounded-md shadow-lg bg-white h-42 flex flex-col justify-center items-center`}
            >
              <img
                src="https://t4.ftcdn.net/jpg/04/75/01/23/360_F_475012363_aNqXx8CrsoTfJP5KCf1rERd6G50K0hXw.jpg"
                alt="no-data"
              />
              <button
                className="btn btn-sm join-item bg-blue-500 text-white"
                onClick={() => {
                  showModal("tambah-narasi"), getSubKategori();
                }}
              >
                <span className="text-xl">
                  <FaPlus />
                </span>
                Tambah
              </button>
            </div>
            <div
              className={`${
                dataRaport?.narrative_sub_categories?.length === 0
                  ? "hidden"
                  : ""
              }`}
            >
              {dataRaport?.narrative_sub_categories?.map(
                (item: any, index: number) => (
                  <div
                    key={index}
                    className={` w-full p-2 mt-5 rounded-md shadow-lg bg-white`}
                  >
                    <div className="sticky top-0 bg-white z-10 py-3">
                      <div className="divider divider-success text-2xl font-bold">
                        {item?.sub_category}
                      </div>
                      <div className="text-right">
                        <button
                          className="btn btn-sm join-item bg-blue-500 text-white"
                          onClick={() => {
                            showModal("tambah-narasi"), getSubKategori();
                          }}
                        >
                          <span className="text-xl">
                            <FaPlus />
                          </span>
                          Tambah
                        </button>
                      </div>
                    </div>
                    <div className="overflow-x-auto mt-5">
                      <table className="table table-md table-zebra-zebra">
                        <thead className="text-white">
                          <tr className="bg-blue-300 ">
                            <th rowSpan={2} className="w-10">
                              No
                            </th>
                            <th rowSpan={2}>Keterangan</th>
                            <th className="text-center" colSpan={3}>
                              Nilai
                            </th>
                            {/* <th className="text-center"></th> */}

                            <th rowSpan={2} className="text-center">
                              Action
                            </th>
                          </tr>
                          <tr className="bg-blue-300 ">
                            <th className="text-center max-w-10">
                              <div className=" flex flex-wrap whitespace-normal text-center justify-center">
                                Membutuhkan Banyak Latihan
                              </div>
                            </th>
                            <th className="text-center max-w-10">
                              <div className="flex flex-wrap whitespace-normal text-center justify-center">
                                Berkembang
                              </div>
                            </th>
                            <th className="text-center max-w-10">
                              <div className="flex flex-wrap whitespace-normal text-center justify-center">
                                Mandiri
                              </div>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {item?.narrative_reports?.map(
                            (nilai: any, index: number) => (
                              <tr key={index}>
                                <th>{index + 1}</th>
                                <td className="max-w-96">{nilai.desc}</td>
                                <td className="">
                                  <div className="flex justify-center ">
                                    <div
                                      className={`w-5 h-5 ${
                                        nilai.grade === 1
                                          ? "bg-blue-800"
                                          : "bg-blue-200"
                                      } rounded-full`}
                                    />
                                  </div>
                                </td>
                                <td>
                                  <div className="flex justify-center ">
                                    <div
                                      className={`w-5 h-5 ${
                                        nilai.grade === 2
                                          ? "bg-blue-800"
                                          : "bg-blue-200"
                                      } rounded-full`}
                                    />
                                  </div>
                                </td>
                                <td>
                                  <div className="flex justify-center ">
                                    <div
                                      className={`w-5 h-5 ${
                                        nilai.grade === 3
                                          ? "bg-blue-800"
                                          : "bg-blue-200"
                                      } rounded-full`}
                                    />
                                  </div>
                                </td>
                                <td>
                                  <div className="join w-full flex justify-center">
                                    <button
                                      className="btn btn-sm join-item bg-yellow-500 text-white tooltip"
                                      data-tip="edit"
                                      onClick={() => {
                                        showModal("edit-narasi"),
                                          setEditDataRaport(nilai);
                                      }}
                                    >
                                      <span className="text-xl">
                                        <FaPencilAlt />
                                      </span>
                                    </button>
                                    <button
                                      className="btn btn-sm join-item bg-red-500 text-white tooltip"
                                      data-tip="hapus"
                                      onClick={() => {
                                        showModal("delete narasi"),
                                          deleteNarasi(nilai.id);
                                      }}
                                    >
                                      <span className="text-xl">
                                        <FaRegTrashAlt />
                                      </span>
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )
              )}
            </div>

            <div className={`flex gap-3 mt-5 ${idKomentar ? "hidden" : ""}`}>
              <span className="label-text text-md">Tambahkan Komentar ?</span>
              <input
                type="checkbox"
                className="checkbox"
                onChange={() => setTrigerKomen(!trigerKomen)}
              />
            </div>

            <div
              className={`w-full flex flex-col items-end mt-4 p-3 shadow-md rounded-md bg-white ${
                trigerKomen ? "" : "hidden"
              }`}
            >
              <textarea
                className="textarea textarea-bordered h-24 w-full"
                placeholder="Komentar Guru"
                value={komentar}
                onChange={(e) => setKomentar(e.target.value)}
              ></textarea>
              <button
                className="w-32 btn bg-green-500 mt-2 text-white"
                onClick={createKomentar}
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      </div>

      <Modal id="edit-narasi">
        <div className="w-full flex flex-col items-center">
          <span className="text-xl font-bold">Edit Raport Narasi</span>
          <div className="w-full mt-5 gap-2 flex flex-col">
            <div className="flex flex-col gap-2">
              <span className="font-bold">Keterangan</span>
              <span>{EditdataRaport?.desc}</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-bold">Grade</span>
              <div className="flex-row w-full justify-between">
                <div className="flex items-center gap-1 my-2">
                  <input
                    type="radio"
                    name={`item-1`}
                    className="checkbox"
                    value={1}
                    checked={EditdataRaport?.grade === 1 ? true : false}
                    onChange={handleEditCheckboxChange}
                  />
                  <label htmlFor="">Membutuhkan Banyak Latihan</label>
                </div>
                <div className="flex items-center gap-1 my-2">
                  <input
                    type="radio"
                    name={`item-1`}
                    className="checkbox"
                    value={2}
                    checked={EditdataRaport?.grade === 2 ? true : false}
                    onChange={handleEditCheckboxChange}
                  />
                  <label htmlFor="">Berkembang</label>
                </div>
                <div className="flex items-center gap-1 my-2">
                  <input
                    type="radio"
                    name={`item-1`}
                    className="checkbox"
                    value={3}
                    checked={EditdataRaport?.grade === 3 ? true : false}
                    onChange={handleEditCheckboxChange}
                  />
                  <label htmlFor="">Mandiri</label>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full flex justify-center mt-10 gap-2">
            <button
              className="btn bg-green-500 text-white font-bold w-full"
              onClick={handleEditReport}
            >
              Submit
            </button>
          </div>
        </div>
      </Modal>
      <Modal id="tambah-keterangan" width="w-full max-w-3xl">
        <div className="w-full flex flex-col items-center">
          <span className="text-xl font-bold">Deskripsi Narasi</span>
          <div className="mt-10 flex justify-end w-full ">
            <button
              className="btn bg-blue-500 text-white"
              onClick={() => {
                settrigerKet(true), getDeskripsi();
              }}
            >
              Tambah
            </button>
          </div>
          <div className="w-full max-h-[600px] mt-1 overflow-auto">
            <table className="table shadow-lg">
              <thead className="bg-blue-400 text-white">
                <tr>
                  <td className="w-12">
                    <input
                      type="checkbox"
                      className="checkbox"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectDeskripsi(deskripsi);
                        } else {
                          setSelectDeskripsi([]);
                        }
                      }}
                    />
                  </td>
                  <td>Deskripsi</td>
                  <td>Action</td>
                </tr>
              </thead>
              <tbody>
                <tr className={`${trigerKet ? "" : "hidden"}`}>
                  <td></td>
                  <td className="flex justify-start items-center gap-3">
                    <textarea
                      className="textarea textarea-bordered w-full h-3"
                      placeholder="Keterangan"
                      value={newDescripsi}
                      onChange={(e) => setNewDeskripsi(e.target.value)}
                    />
                  </td>
                  <td>
                    <div className="flex text-2xl gap-1">
                      <span
                        className="text-green-500 cursor-pointer"
                        onClick={createDeskripsi}
                      >
                        <FaCheckCircle />
                      </span>
                      <span
                        className="text-red-500 cursor-pointer"
                        onClick={() => settrigerKet(false)}
                      >
                        <AiFillCloseCircle />
                      </span>
                    </div>
                  </td>
                </tr>
                {deskripsi?.map((item: any, index: number) => (
                  <tr key={index}>
                    <td>
                      <input
                        type="checkbox"
                        className="checkbox"
                        checked={selectDeskripsi.some(
                          (desc: any) => desc.id === item.id
                        )}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectDeskripsi([...selectDeskripsi, item]);
                          } else {
                            setSelectDeskripsi(
                              selectDeskripsi.filter(
                                (desc: any) => desc.id !== item.id
                              )
                            );
                          }
                        }}
                      />
                    </td>
                    <td>{item?.desc}</td>
                    <td className="flex gap-1 text-2xl">
                      <span
                        className="text-red-500 cursor-pointer"
                        onClick={() => handleDeleteDeskripsi(item.id)}
                      >
                        <BiTrash />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="w-full flex justify-end mt-10 gap-2">
            <button
              className="btn bg-green-500 text-white font-bold w-32"
              onClick={() => closeModal("tambah-keterangan")}
            >
              Submit
            </button>
            {/* <button className="btn bg-green-500 text-white font-bold">Submit</button> */}
          </div>
        </div>
      </Modal>

      <Modal id="tambah-narasi" width="w-full max-w-7xl">
        <div className="w-full flex flex-col items-center">
          <span className="text-xl font-bold">
            Raport Narasi {data?.full_name} - {data?.class_name}
          </span>

          <div className="w-full gap-2 flex justify-end mt-5">
            <div>
              <select
                className="select join-item w-32 select-bordered"
                onChange={(e) => setIdSubKategori(e.target.value)}
              >
                <option selected value="">
                  Sub Kategori
                </option>
                {subKategori?.map((item: any, index: number) => (
                  <option value={item.id} key={index}>
                    {item?.sub_category}
                  </option>
                ))}
              </select>
            </div>
            <div className="">
              <button
                className={`btn bg-green-500 text-white ${
                  idSubKategori ? "" : "btn-disabled"
                }`}
                onClick={() => {
                  showModal("tambah-keterangan"), getDeskripsi();
                }}
              >
                Tambah
              </button>
            </div>
          </div>
          <div className="w-full max-h-[400px] mt-10 overflow-auto">
            <table className="table shadow-lg">
              <thead className="bg-blue-400 text-white">
                <tr>
                  <th rowSpan={2}>No</th>
                  <th rowSpan={2}>Deskripsi</th>
                  <th colSpan={3} className="text-center">
                    Nilai
                  </th>
                </tr>
                <tr>
                  <th className="text-center">Membutuhkan Banyak Latihan</th>
                  <th className="text-center">Berkembang</th>
                  <th className="text-center">Mandiri</th>
                </tr>
              </thead>
              <tbody>
                {selectDeskripsi?.map((item: any, index: number) => (
                  <tr>
                    <td>{index + 1}</td>
                    <td>{item?.desc}</td>
                    <td className="text-center">
                      <input
                        type="radio"
                        name={`item-${index}`}
                        className="checkbox"
                        value={1}
                        checked={item?.nilai ? item.nilai === 1 : false}
                        onChange={(e) => handleCheckboxChange(e, index)}
                      />
                    </td>
                    <td className="text-center">
                      <input
                        type="radio"
                        name={`item-${index}`}
                        className="checkbox"
                        value={2}
                        checked={item?.nilai ? item.nilai === 2 : false}
                        onChange={(e) => handleCheckboxChange(e, index)}
                      />
                    </td>
                    <td className="text-center">
                      <input
                        type="radio"
                        name={`item-${index}`}
                        className="checkbox"
                        value={3}
                        checked={item?.nilai ? item.nilai === 3 : false}
                        onChange={(e) => handleCheckboxChange(e, index)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="w-full flex justify-end mt-10 gap-2">
            <button
              className="btn bg-green-500 text-white font-bold w-32"
              onClick={createNarasiReport}
            >
              Submit
            </button>
            {/* <button className="btn bg-green-500 text-white font-bold">Submit</button> */}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default RaportNarasi;
