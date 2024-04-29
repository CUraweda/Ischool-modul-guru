import { MdOutlineDocumentScanner } from "react-icons/md";
import { Link } from "react-router-dom";
import Modal from "../modal";
import { FaRegCheckSquare } from "react-icons/fa";
import { IoChatboxEllipsesOutline } from "react-icons/io5";

const RaportNarasi = () => {
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
            <button className="btn btn-sm join-item bg-green-500 text-white ">
              <span className="text-xl">
                <FaRegCheckSquare />
              </span>
              Selesai Semua
            </button>
          </div>
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
            <tr>
              <th>1</th>
              <td>anwar</td>
              <td className="max-w-md">VII</td>
              <td className="">
              <div className="join">
                  <Link to={"/guru/rapor-siswa/narasi"}>
                    <button
                      className="btn join-item btn-ghost btn-sm text-xl text-white bg-blue-500 tooltip"
                      data-tip="Detail"
                    >
                      <MdOutlineDocumentScanner />
                    </button>
                  </Link>
                  <button
                    className="btn join-item btn-ghost btn-sm text-xl text-white bg-green-500 tooltip"
                    data-tip="tandai selesai"
                  >
                    <FaRegCheckSquare />
                  </button>
                  <button
                    className="btn join-item btn-ghost btn-sm text-xl text-white bg-orange-500 tooltip"
                    data-tip="Komentar Guru"
                  >
                    <IoChatboxEllipsesOutline />
                  </button>
                </div>
              </td>
            </tr>
            <tr>
              <th>2</th>
              <td>jani</td>
              <td className="max-w-md">VII</td>
              <td className="">
              <div className="join">
                  <Link to={"/guru/rapor-siswa/narasi"}>
                    <button
                      className="btn join-item btn-ghost btn-sm text-xl text-white bg-blue-500 tooltip"
                      data-tip="Detail"
                    >
                      <MdOutlineDocumentScanner />
                    </button>
                  </Link>
                  <button
                    className="btn join-item btn-ghost btn-sm text-xl text-white bg-green-500 tooltip"
                    data-tip="tandai selesai"
                  >
                    <FaRegCheckSquare />
                  </button>
                  <button
                    className="btn join-item btn-ghost btn-sm text-xl text-white bg-orange-500 tooltip"
                    data-tip="Komentar Guru"
                  >
                    <IoChatboxEllipsesOutline />
                  </button>
                </div>
              </td>
            </tr>
            <tr>
              <th>3</th>
              <td>melina</td>
              <td className="max-w-md">VII</td>
              <td className="">
              <div className="join">
                  <Link to={"/guru/rapor-siswa/narasi"}>
                    <button
                      className="btn join-item btn-ghost btn-sm text-xl text-white bg-blue-500 tooltip"
                      data-tip="Detail"
                    >
                      <MdOutlineDocumentScanner />
                    </button>
                  </Link>
                  <button
                    className="btn join-item btn-ghost btn-sm text-xl text-white bg-green-500 tooltip"
                    data-tip="tandai selesai"
                  >
                    <FaRegCheckSquare />
                  </button>
                  <button
                    className="btn join-item btn-ghost btn-sm text-xl text-white bg-orange-500 tooltip"
                    data-tip="Komentar Guru"
                  >
                    <IoChatboxEllipsesOutline />
                  </button>
                </div>
              </td>
            </tr>
            <tr>
              <th>4</th>
              <td>bayu</td>
              <td className="max-w-md">VII</td>
              <td className="">
              <div className="join">
                  <Link to={"/guru/rapor-siswa/narasi"}>
                    <button
                      className="btn join-item btn-ghost btn-sm text-xl text-white bg-blue-500 tooltip"
                      data-tip="Detail"
                    >
                      <MdOutlineDocumentScanner />
                    </button>
                  </Link>
                  <button
                    className="btn join-item btn-ghost btn-sm text-xl text-white bg-green-500 tooltip"
                    data-tip="tandai selesai"
                  >
                    <FaRegCheckSquare />
                  </button>
                  <button
                    className="btn join-item btn-ghost btn-sm text-xl text-white bg-orange-500 tooltip"
                    data-tip="Komentar Guru"
                  >
                    <IoChatboxEllipsesOutline />
                  </button>
                </div>
              </td>
            </tr>
            <tr>
              <th>5</th>
              <td>ratih</td>
              <td className="max-w-md">VII</td>
              <td className="">
              <div className="join">
                  <Link to={"/guru/rapor-siswa/narasi"}>
                    <button
                      className="btn join-item btn-ghost btn-sm text-xl text-white bg-blue-500 tooltip"
                      data-tip="Detail"
                    >
                      <MdOutlineDocumentScanner />
                    </button>
                  </Link>
                  <button
                    className="btn join-item btn-ghost btn-sm text-xl text-white bg-green-500 tooltip"
                    data-tip="tandai selesai"
                  >
                    <FaRegCheckSquare />
                  </button>
                  <button
                    className="btn join-item btn-ghost btn-sm text-xl text-white bg-orange-500 tooltip"
                    data-tip="Komentar Guru"
                  >
                    <IoChatboxEllipsesOutline />
                  </button>
                </div>
              </td>
            </tr>
            <tr>
              <th>6</th>
              <td>aldi</td>
              <td className="max-w-md">VII</td>
              <td className="">
              <div className="join">
                  <Link to={"/guru/rapor-siswa/narasi"}>
                    <button
                      className="btn join-item btn-ghost btn-sm text-xl text-white bg-blue-500 tooltip"
                      data-tip="Detail"
                    >
                      <MdOutlineDocumentScanner />
                    </button>
                  </Link>
                  <button
                    className="btn join-item btn-ghost btn-sm text-xl text-white bg-green-500 tooltip"
                    data-tip="tandai selesai"
                  >
                    <FaRegCheckSquare />
                  </button>
                  <button
                    className="btn join-item btn-ghost btn-sm text-xl text-white bg-orange-500 tooltip"
                    data-tip="Komentar Guru"
                  >
                    <IoChatboxEllipsesOutline />
                  </button>
                </div>
              </td>
            </tr>
            <tr>
              <th>7</th>
              <td>meli</td>
              <td className="max-w-md">VII</td>
              <td className="">
                <div className="join">
                  <Link to={"/guru/rapor-siswa/narasi"}>
                    <button
                      className="btn join-item btn-ghost btn-sm text-xl text-white bg-blue-500 tooltip"
                      data-tip="Detail"
                    >
                      <MdOutlineDocumentScanner />
                    </button>
                  </Link>
                  <button
                    className="btn join-item btn-ghost btn-sm text-xl text-white bg-green-500 tooltip"
                    data-tip="tandai selesai"
                  >
                    <FaRegCheckSquare />
                  </button>
                  <button
                    className="btn join-item btn-ghost btn-sm text-xl text-white bg-orange-500 tooltip"
                    data-tip="Komentar Guru"
                  >
                    <IoChatboxEllipsesOutline />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <Modal id="modal-add-angka">
        <div></div>
      </Modal>
    </div>
  );
};

export default RaportNarasi;
