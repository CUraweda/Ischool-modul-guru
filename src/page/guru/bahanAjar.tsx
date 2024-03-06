import { BsDownload } from "react-icons/bs";

const BahanAjar = () => {
  return (
    <>
      <div className="w-full flex flex-col items-center">
        <div className="w-full flex justify-center mt-10">
          <span className="text-4xl font-bold">Bahan Ajar Guru</span>
        </div>

        <div className="w-full flex justify-center mt-10 flex-col items-center">
          <div className="w-full justify-between flex px-5">
            <select className="select select-primary w-32 max-w-xs">
              <option disabled selected>
                Mapel
              </option>
              <option>IPA</option>
              <option>IPS</option>
              <option>MTK</option>
              <option>PKN</option>
            </select>
            <div className="flex gap-2">
              <button className="btn bg-green-500 text-white">
                Tambah
              </button>
            </div>
          </div>
          <div className="overflow-x-auto w-full p-5 ">
            <table className="table shadow-lg">
              {/* head */}
              <thead className="bg-blue-200">
                <tr>
                  <th>No</th>
                  <th>Nama</th>
                  <th>Mapel</th>
                  <th>Kelas</th>
                  <th>Keterangan</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {/* row 1 */}
                <tr>
                  <th>1</th>
                  <td>Cy Ganderton</td>
                  <td>Quality Control Specialist</td>
                  <td>Blue</td>
                  <td>ini keterangan</td>
                  <td>
                    <button className="btn bg-blue-400 text-xl font-bold text-white"><BsDownload/></button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default BahanAjar;
