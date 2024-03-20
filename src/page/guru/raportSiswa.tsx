import { useState } from "react";
import { FaFilePdf, FaPencilAlt, FaRegTrashAlt } from "react-icons/fa";
import { IoMdEye } from "react-icons/io";
import { MdCloudUpload, MdOutlineDocumentScanner } from "react-icons/md";
import { Link } from "react-router-dom";

const RaportSiswa = () => {
  const [tab, setTab] = useState<string>("angka");
  return (
    <>
      <div className="w-full mt-5 p-3">
        <div role="tablist" className="tabs tabs-lifted">
          <input
            type="radio"
            name="my_tabs_2"
            role="tab"
            className="tab bg-blue-300 font-bold"
            aria-label="Angka"
            checked={tab == "angka"}
            onClick={() => setTab("angka")}
          />
          <div
            role="tabpanel"
            className="tab-content bg-base-100 border-base-300 rounded-box p-6"
          >
            <div className="w-full flex justify-between gap-2">
              <div className="join">
                <select className="select join-item w-32 max-w-md select-bordered">
                  <option disabled selected>
                    Tahun Pelajaran
                  </option>
                  <option>2023/2024</option>
                  <option>2024/2025</option>
                </select>
                <select className="select join-item w-32 max-w-md select-bordered">
                  <option disabled selected>
                    Semester
                  </option>
                  <option>Ganjil</option>
                  <option>Genap</option>
                </select>
                <select className="select join-item w-32 max-w-xs select-bordered">
                  <option disabled selected>
                    Mapel
                  </option>
                  <option>MTK</option>
                  <option>BINDO</option>
                  <option>BING</option>
                  <option>IPA</option>
                </select>
              </div>
              <div>
                <div className="join">
                  <button className="btn join-item bg-blue-500 text-white">
                    Tambah
                  </button>
                  <button className="btn join-item bg-green-500 text-white">
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
                    <td>Cy Ganderton</td>
                    <td>Matematika</td>
                    <td>75</td>
                    <td>89</td>
                    <td>Sembilan Delapan</td>
                    <td>
                      <div className="join">
                        <button className="btn btn-sm join-item bg-yellow-500 text-white tooltip" data-tip="edit">
                          <span className="text-xl">
                            <FaPencilAlt />
                          </span>
                        </button>
                        <button className="btn btn-sm join-item bg-red-500 text-white tooltip" data-tip="hapus">
                          <span className="text-xl">
                            <FaRegTrashAlt />
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <input
            type="radio"
            name="my_tabs_2"
            role="tab"
            className="tab bg-blue-300 font-bold"
            aria-label="Narasi"
            checked={tab == "narasi"}
            onClick={() => setTab("narasi")}
          />
          <div
            role="tabpanel"
            className="tab-content bg-base-100 border-base-300 rounded-box p-6"
          >
            <div className="w-full flex justify-between gap-2">
              <div className="join">
                <select className="select join-item w-32 max-w-md select-bordered">
                  <option disabled selected>
                    Tahun Pelajaran
                  </option>
                  <option>2023/2024</option>
                  <option>2024/2025</option>
                </select>
                <select className="select join-item w-32 max-w-md select-bordered">
                  <option disabled selected>
                    Semester
                  </option>
                  <option>Ganjil</option>
                  <option>Genap</option>
                </select>
                <select className="select join-item w-32 max-w-md select-bordered">
                  <option disabled selected>
                    Kelas
                  </option>
                  <option>VII</option>
                  <option>VIII</option>
                  <option>IX</option>
                </select>
              </div>
            </div>
            <div className="overflow-x-auto mt-5">
              <table className="table table-md">
                <thead>
                  <tr className="bg-blue-300 ">
                    <th>No</th>
                    <th>Nama</th>
                    <th>Kelas</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th>1</th>
                    <td>Cy Ganderton</td>
                    <td className="max-w-md">VII</td>
                    <td className="">
                      <Link to={"/guru/rapor-siswa/narasi"}>
                        <button className="btn btn-ghost text-2xl text-white bg-green-500">
                          <MdOutlineDocumentScanner />
                        </button>
                      </Link>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <input
            type="radio"
            name="my_tabs_2"
            role="tab"
            className="tab bg-blue-300 font-bold"
            aria-label="Portofolio"
            checked={tab == "portofolio"}
            onClick={() => setTab("portofolio")}
          />
          <div
            role="tabpanel"
            className="tab-content bg-base-100 border-base-300 rounded-box p-6"
          >
            <div className="w-full flex justify-between gap-2">
              <div className="join">
                <select className="select join-item w-32 max-w-md select-bordered">
                  <option disabled selected>
                    Tahun Pelajaran
                  </option>
                  <option>2023/2024</option>
                  <option>2024/2025</option>
                </select>
                <select className="select join-item w-32 max-w-md select-bordered">
                  <option disabled selected>
                    Semester
                  </option>
                  <option>Ganjil</option>
                  <option>Genap</option>
                </select>
                <select className="select join-item w-32 max-w-md select-bordered">
                  <option disabled selected>
                    Kelas
                  </option>
                  <option>VII</option>
                  <option>VIII</option>
                  <option>IX</option>
                </select>
              </div>
            </div>
            <div className="overflow-x-auto mt-5">
              <table className="table table-md">
                <thead>
                  <tr className="bg-blue-300 ">
                    <th>No</th>
                    <th>Nama</th>
                    <th>Kelas</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th>1</th>
                    <td>Cy Ganderton</td>
                    <td className="max-w-md">VII</td>
                    <td className="flex items-center">
                      <div className="join">
                        <button
                          className="btn btn-sm join-item bg-green-500 text-white tooltip"
                          data-tip="Upload portofolio"
                        >
                          <span className="text-2xl">
                            <MdCloudUpload />
                          </span>
                        </button>
                        <button
                          className="btn btn-sm join-item bg-orange-500 text-white tooltip"
                          data-tip="lihat portofolio"
                        >
                          <span className="text-2xl">
                            <IoMdEye />
                          </span>
                        </button>
                        <button
                          className="btn btn-sm join-item bg-yellow-500 text-white tooltip"
                          data-tip="lihat merge portofolio"
                        >
                          <span className="text-xl">
                            <FaFilePdf />
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <input
            type="radio"
            name="my_tabs_2"
            role="tab"
            className="tab bg-blue-300 font-bold"
            aria-label="Komentar Ortu"
            checked={tab == "komen"}
            onClick={() => setTab("komen")}
          />
          <div
            role="tabpanel"
            className="tab-content bg-base-100 border-base-300 rounded-box p-6"
          >
            <div className="w-full flex justify-between gap-2">
              <div className="join">
                <select className="select join-item w-32 max-w-md select-bordered">
                  <option disabled selected>
                    Tahun Pelajaran
                  </option>
                  <option>2023/2024</option>
                  <option>2024/2025</option>
                </select>
                <select className="select join-item w-32 max-w-md select-bordered">
                  <option disabled selected>
                    Semester
                  </option>
                  <option>Ganjil</option>
                  <option>Genap</option>
                </select>
              </div>
            </div>
            <div className="overflow-x-auto mt-5">
              <table className="table table-md">
                <thead>
                  <tr className="bg-blue-300 text-center">
                    <th>No</th>
                    <th>Nama Siswa</th>
                    <th>Orang Tua</th>
                    <th>Komentar</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th>1</th>
                    <td>anisa</td>
                    <td>Ummu anisa</td>
                    <td className="max-w-md">
                      Mampu melafadzkan ta’awudz dan basmallah dengan 3M
                      (Mangap, meringis, monyong) dan mampu mengikuti intonasi
                      nada bacaan yang di contohkan pembimbing
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RaportSiswa;
