
import Modal from "../modal";
import Pdf from "../../assets/SM7_Portofolio_ Semester 1_TA 2020-2021_Aisha Mahya Nataneila.pdf";
import { FaFilePdf } from "react-icons/fa";

const RaportAll = () => {
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
              <th>Kelas</th>
              <th>Nis</th>
              <th>Raport Siswa</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>1</th>
              <td>anisa</td>
              <td>9</td>
              <td className="max-w-md">
                123123
              </td>
              <td>
                <button
                  className="btn btn-sm join-item bg-green-500 text-white tooltip"
                  data-tip="Download Rapor"
                  
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
     
    </div>
  );
};

export default RaportAll;
