import {
  FaPencilAlt,
  FaPlus,
  FaRegCheckSquare,
  FaRegTrashAlt,
  FaRegWindowClose,
} from "react-icons/fa";
import Modal from "../modal";
import { MdCloudUpload } from "react-icons/md";

const RaportAngka = () => {
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
            <button
              className="btn btn-sm join-item bg-blue-500 text-white "
              onClick={() => showModal("add-angka")}
            >
              <span className="text-xl">
                <FaPlus />
              </span>
              Tambah
            </button>
            <button
              className="btn btn-sm join-item bg-cyan-500 text-white "
              onClick={() => showModal("upload-angka")}
            >
              <span className="text-xl">
                <MdCloudUpload />
              </span>
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
                  <button
                    className="btn btn-sm join-item bg-yellow-500 text-white tooltip"
                    data-tip="edit"
                  >
                    <span className="text-xl">
                      <FaPencilAlt />
                    </span>
                  </button>
                  <button
                    className="btn btn-sm join-item bg-red-500 text-white tooltip"
                    data-tip="hapus"
                  >
                    <span className="text-xl">
                      <FaRegTrashAlt />
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
              <td>Matematika</td>
              <td>75</td>
              <td>89</td>
              <td>Sembilan Delapan</td>
              <td>
                <div className="join">
                  <button
                    className="btn btn-sm join-item bg-yellow-500 text-white tooltip"
                    data-tip="edit"
                    disabled
                  >
                    <span className="text-xl">
                      <FaPencilAlt />
                    </span>
                  </button>
                  <button
                    className="btn btn-sm join-item bg-red-500 text-white tooltip"
                    data-tip="hapus"
                    disabled
                  >
                    <span className="text-xl">
                      <FaRegTrashAlt />
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
      <Modal id="add-angka">
        <div className="w-full flex justify-center flex-col items-center">
          <span className="text-xl font-bold">Tambah Raport Angka</span>
          <div className="mt-5 flex justify-start w-full flex-col gap-3">
            <div className="flex flex-col w-full">
              <label htmlFor="" className="font-bold">
                Nama
              </label>
              <select className="select join-item w-full select-bordered">
                <option disabled selected>
                  Siswa
                </option>
                <option>Aldi</option>
                <option>Damar</option>
                <option>beni</option>
                <option>jono</option>
              </select>
            </div>
            <div className="flex flex-col w-full">
              <label htmlFor="" className="font-bold">
                KKM
              </label>
              <input
                type="number"
                placeholder="75"
                className="input input-bordered w-full"
              />
            </div>
            <div className="flex flex-col w-full">
              <label htmlFor="" className="font-bold">
                Nilai
              </label>
              <input
                type="number"
                placeholder="75"
                className="input input-bordered w-full"
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
              />
            </div>
            <div className="flex flex-col w-full mt-10">
              <button className="btn btn-ghost bg-green-500 w-full text-white">
                Simpan
              </button>
            </div>
          </div>
        </div>
      </Modal>
      <Modal id="upload-angka">
        <div className="w-full flex flex-col items-center">
          <span className="text-xl font-bold">Upload Raport Angka</span>
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
    </div>
  );
};

export default RaportAngka;
