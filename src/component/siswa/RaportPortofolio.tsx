import { FaFilePdf, FaRegCheckSquare, FaRegWindowClose } from "react-icons/fa";
import { MdCloudUpload } from "react-icons/md";
import Modal from "../modal";
import Pdf from "../../assets/SM7_Portofolio_ Semester 1_TA 2020-2021_Aisha Mahya Nataneila.pdf";

const RaportPortofolio = () => {
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
        <div>
          <div className="join">
            <button
              className="btn btn-sm join-item bg-green-500 text-white "
             
            >
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
              <td>Cy Ganderton</td>
              <td className="max-w-md">VII</td>
              <td className="flex items-center">
                <div className="join">
                  <button
                    className="btn btn-sm join-item bg-cyan-500 text-white tooltip"
                    data-tip="Upload portofolio"
                    onClick={() => showModal("upload-portofolio")}
                  >
                    <span className="text-2xl">
                      <MdCloudUpload />
                    </span>
                  </button>
                  
                  <button
                    className="btn btn-sm join-item bg-yellow-500 text-white tooltip"
                    data-tip="lihat portofolio"
                    onClick={() => showModal("show-portofolio")}
                  >
                    <span className="text-xl">
                      <FaFilePdf />
                    </span>
                  </button>
                  <button
                    className="btn btn-sm join-item bg-green-500 text-white tooltip"
                    data-tip="tandai selesai"
                    
                  >
                    <span className="text-xl">
                    <FaRegCheckSquare />
                    </span>
                  </button>
                </div>
              </td>
            </tr>
            <tr>
              <th>1</th>
              <td>Cy Ganderton</td>
              <td className="max-w-md">VII</td>
              <td className="flex items-center">
                <div className="join">
                  <button
                    className="btn btn-sm join-item bg-cyan-500 text-white tooltip"
                    data-tip="Upload portofolio"
                    onClick={() => showModal("upload-portofolio")}
                    disabled
                  >
                    <span className="text-2xl">
                      <MdCloudUpload />
                    </span>
                  </button>
                 
                  <button
                    className="btn btn-sm join-item bg-yellow-500 text-white tooltip"
                    data-tip="lihat portofolio"
                    onClick={() => showModal("show-portofolio")}
                  >
                    <span className="text-xl">
                      <FaFilePdf />
                    </span>
                  </button>
                  <button
                    className="btn btn-sm join-item bg-red-500 text-white tooltip"
                    data-tip="tandai belum selesai"
                    
                  >
                    <span className="text-xl">
                    <FaRegWindowClose />
                    </span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

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
              className="file-input file-input-bordered w-full"
            />
          </div>

          <div className="w-full flex justify-center mt-10 gap-2">
            <button className="btn bg-green-500 text-white font-bold w-full">
              Submit
            </button>
            {/* <button className="btn bg-green-500 text-white font-bold">Submit</button> */}
          </div>
        </div>
      </Modal>
      <Modal id="show-portofolio" width="w-11/12 max-w-5xl">
        <div className="join ">
          <button className="btn btn-sm join-item bg-blue-500 text-white">portofolio</button>
          <button className="btn btn-sm join-item bg-blue-700 text-white">merge portofolio</button>
        </div>
        <div className="w-full flex flex-col items-center min-h-svh">
          <iframe className="w-full min-h-svh mt-5" src={Pdf} />
        </div>
      </Modal>
    </div>
  );
};

export default RaportPortofolio;
