// import React from "react";
import { FaLock, FaLockOpen, FaRegFileAlt, FaSearch } from "react-icons/fa";

const DataSiswa = () => {
  return (
    <>
      <div className="w-full flex justify-center flex-col items-center p-3">
        <span className="font-bold text-xl">DATA SISWA</span>
        <div className="w-full p-3 bg-white">
          <div className="w-full flex justify-end my-3">
            <select className="select select-bordered w-32">
              <option>Pilih Kelas</option>
              <option>Han Solo</option>
              <option>Greedo</option>
            </select>
            <div className="join ml-3">
              <input
                type="text"
                placeholder="Cari Siswa"
                className="input input-bordered w-full max-w-xs join-item"
              />
              <button className="btn btn-ghost bg-blue-500 join-item text-white">
                <FaSearch />
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="table table-zebra">
              {/* head */}
              <thead className="bg-blue-400">
                <tr>
                  <th>No</th>
                  <th>Name</th>
                  <th>NIS</th>
                  <th>Kelas</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {/* row 1 */}
                <tr>
                  <th>1</th>
                  <td>Cy Ganderton</td>
                  <td>823</td>
                  <td>4</td>
                  <td>
                    <div className="join">
                      <button
                        className="btn btn-ghost btn-sm join-item bg-blue-500 text-white tooltip"
                        data-tip="Detail Pembayaran"
                      >
                        <FaRegFileAlt />
                      </button>
                      <button
                        className="btn btn-ghost btn-sm join-item bg-red-500 text-white tooltip"
                        data-tip="Buka Kunci Raport"
                      >
                        <FaLock />
                      </button>
                    </div>
                  </td>
                </tr>
                <tr>
                  <th>1</th>
                  <td>Cy Ganderton</td>
                  <td>823</td>
                  <td>4</td>
                  <td>
                    <div className="join">
                      <button
                        className="btn btn-ghost btn-sm join-item bg-blue-500 text-white tooltip"
                        data-tip="Detail Pembayaran"
                      >
                        <FaRegFileAlt />
                      </button>
                      <button
                        className="btn btn-ghost btn-sm join-item bg-green-500 text-white tooltip"
                        data-tip="Kunci Raport"
                      >
                        <FaLockOpen />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="w-full justify-end flex mt-3">
            <div className="join">
              <button className="join-item btn">«</button>
              <button className="join-item btn">Page 1</button>
              <button className="join-item btn">»</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DataSiswa;
