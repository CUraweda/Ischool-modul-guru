
import Modal from "../modal";
import Pdf from "../../assets/SM7_Portofolio_ Semester 1_TA 2020-2021_Aisha Mahya Nataneila.pdf";
import { FaFilePdf } from "react-icons/fa";

const KomenOrtu = () => {
  const showModal = (props: string) => {
    let modalElement = document.getElementById(`${props}`) as HTMLDialogElement;
    if (modalElement) {
      modalElement.showModal();
    }
  };
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
      </div>
      <div className="overflow-x-auto mt-5">
        <table className="table table-md">
          <thead>
            <tr className="bg-blue-300">
              <th>No</th>
              <th>Nama Siswa</th>
              <th>Orang Tua</th>
              <th>Komentar</th>
              <th>Raport Siswa</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>1</th>
              <td>anisa</td>
              <td>Ummu anisa</td>
              <td className="max-w-md">
                Mampu melafadzkan ta’awudz dan basmallah dengan 3M (Mangap,
                meringis, monyong) dan mampu mengikuti intonasi nada bacaan yang
                di contohkan pembimbing
              </td>
              <td>
                <button
                  className="btn btn-sm join-item bg-green-500 text-white tooltip"
                  data-tip="lihat portofolio"
                  onClick={() => showModal("show-ortu")}
                >
                  <span className="text-xl">
                  <FaFilePdf />
                  </span>
                </button>
              </td>
            </tr>
            <tr>
              <th>2</th>
              <td>anwar</td>
              <td>Ummu anwar</td>
              <td className="max-w-md">
                Mampu melafadzkan ta’awudz dan basmallah dengan 3M (Mangap,
                meringis, monyong) dan mampu mengikuti intonasi nada bacaan yang
                di contohkan pembimbing
              </td>
              <td>
                <button
                  className="btn btn-sm join-item bg-green-500 text-white tooltip"
                  data-tip="lihat portofolio"
                  onClick={() => showModal("show-ortu")}
                >
                  <span className="text-xl">
                  <FaFilePdf />
                  </span>
                </button>
              </td>
            </tr>
            <tr>
              <th>3</th>
              <td>farel</td>
              <td>Ummu farel</td>
              <td className="max-w-md">
                Mampu melafadzkan ta’awudz dan basmallah dengan 3M (Mangap,
                meringis, monyong) dan mampu mengikuti intonasi nada bacaan yang
                di contohkan pembimbing
              </td>
              <td>
                <button
                  className="btn btn-sm join-item bg-green-500 text-white tooltip"
                  data-tip="lihat portofolio"
                  onClick={() => showModal("show-ortu")}
                >
                  <span className="text-xl">
                  <FaFilePdf />
                  </span>
                </button>
              </td>
            </tr>
            <tr>
              <th>4</th>
              <td>melina</td>
              <td>Ummu melina</td>
              <td className="max-w-md">
                Mampu melafadzkan ta’awudz dan basmallah dengan 3M (Mangap,
                meringis, monyong) dan mampu mengikuti intonasi nada bacaan yang
                di contohkan pembimbing
              </td>
              <td>
                <button
                  className="btn btn-sm join-item bg-green-500 text-white tooltip"
                  data-tip="lihat portofolio"
                  onClick={() => showModal("show-ortu")}
                >
                  <span className="text-xl">
                  <FaFilePdf />
                  </span>
                </button>
              </td>
            </tr>
            <tr>
              <th>5</th>
              <td>bayu</td>
              <td>Ummu bayu</td>
              <td className="max-w-md">
                Mampu melafadzkan ta’awudz dan basmallah dengan 3M (Mangap,
                meringis, monyong) dan mampu mengikuti intonasi nada bacaan yang
                di contohkan pembimbing
              </td>
              <td>
                <button
                  className="btn btn-sm join-item bg-green-500 text-white tooltip"
                  data-tip="lihat portofolio"
                  onClick={() => showModal("show-ortu")}
                >
                  <span className="text-xl">
                  <FaFilePdf />
                  </span>
                </button>
              </td>
            </tr>
            <tr>
              <th>6</th>
              <td>aldi</td>
              <td>Ummu aldi</td>
              <td className="max-w-md">
                Mampu melafadzkan ta’awudz dan basmallah dengan 3M (Mangap,
                meringis, monyong) dan mampu mengikuti intonasi nada bacaan yang
                di contohkan pembimbing
              </td>
              <td>
                <button
                  className="btn btn-sm join-item bg-green-500 text-white tooltip"
                  data-tip="lihat portofolio"
                  onClick={() => showModal("show-ortu")}
                >
                  <span className="text-xl">
                  <FaFilePdf />
                  </span>
                </button>
              </td>
            </tr>
            <tr>
              <th>7</th>
              <td>ratih</td>
              <td>Ummu ratih</td>
              <td className="max-w-md">
                Mampu melafadzkan ta’awudz dan basmallah dengan 3M (Mangap,
                meringis, monyong) dan mampu mengikuti intonasi nada bacaan yang
                di contohkan pembimbing
              </td>
              <td>
                <button
                  className="btn btn-sm join-item bg-green-500 text-white tooltip"
                  data-tip="lihat portofolio"
                  onClick={() => showModal("show-ortu")}
                >
                  <span className="text-xl">
                  <FaFilePdf />
                  </span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <Modal id="show-ortu" width="w-11/12 max-w-5xl">
        <div className="w-full flex flex-col items-center min-h-svh">
          <iframe className="w-full min-h-svh mt-5" src={Pdf} />
        </div>
      </Modal>
    </div>
  );
};

export default KomenOrtu;
