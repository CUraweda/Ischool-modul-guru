import { BsUpload } from "react-icons/bs";
import { TiPlus } from "react-icons/ti";

const DaftarPelatihan = () => {
  return (
    <>
      <div className="w-full flex flex-col items-center">
        <div className="my-10">
          <span className="text-4xl font-bold">Daftar Pelatihan</span>
        </div>
        <div className="w-full justify-end flex px-5 mt-10">
          <div className="flex gap-2 ">
            <button className="btn bg-green-500 text-white flex items-center btn-md">
              <span className="text-2xl"><TiPlus /></span> 
              <span className="text-xl">Tambah</span>
            </button>
          </div>
        </div>
        <div className="overflow-x-auto w-full p-5 bg-white">
          <table className="table shadow-lg">
            {/* head */}
            <thead className="bg-blue-200">
              <tr>
                <th>No</th>
                <th>Tanggal</th>
                <th>Materi Pelatihan</th>
                <th>Pemateri</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {/* row 1 */}
              <tr>
                <th>1</th>
                <td>8 maret 2024</td>
                <td>management kelas</td>
                <td>prof.ahmad</td>
                <td>Complete</td>
                <td>
                  <button className="btn bg-blue-400 text-xl font-bold text-white">
                    <BsUpload />
                  </button>
                </td>
              </tr>
              <tr>
                <th>1</th>
                <td>8 maret 2024</td>
                <td>management kelas</td>
                <td>prof.ahmad</td>
                <td>Complete</td>
                <td>
                  <button className="btn bg-blue-400 text-xl font-bold text-white">
                    <BsUpload />
                  </button>
                </td>
              </tr>
              <tr>
                <th>1</th>
                <td>8 maret 2024</td>
                <td>management kelas</td>
                <td>prof.ahmad</td>
                <td>Complete</td>
                <td>
                  <button className="btn bg-blue-400 text-xl font-bold text-white">
                    <BsUpload />
                  </button>
                </td>
              </tr>
              <tr>
                <th>1</th>
                <td>8 maret 2024</td>
                <td>management kelas</td>
                <td>prof.ahmad</td>
                <td>Complete</td>
                <td>
                  <button className="btn bg-blue-400 text-xl font-bold text-white">
                    <BsUpload />
                  </button>
                </td>
              </tr>
              <tr>
                <th>1</th>
                <td>8 maret 2024</td>
                <td>management kelas</td>
                <td>prof.ahmad</td>
                <td>Complete</td>
                <td>
                  <button className="btn bg-blue-400 text-xl font-bold text-white">
                    <BsUpload />
                  </button>
                </td>
              </tr>
              <tr>
                <th>1</th>
                <td>8 maret 2024</td>
                <td>management kelas</td>
                <td>prof.ahmad</td>
                <td>Complete</td>
                <td>
                  <button className="btn bg-blue-400 text-xl font-bold text-white">
                    <BsUpload />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default DaftarPelatihan;
