// import React from "react";
import { FaTrash } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";

const PosKeuangan = () => {
  return (
    <>
      <div className="w-full flex justify-center flex-col items-center p-3">
        <span className="font-bold text-xl">POS PEMBAYARAN SISWA</span>
        <div className="w-full p-3 bg-white">
          <div className="w-full flex justify-end my-3 gap-3">
          
            <button className="btn btn-ghost bg-blue-500 text-white">Tambah</button>
           
          </div>
          <div className="overflow-x-auto">
            <table className="table table-zebra">
              {/* head */}
              <thead className="bg-blue-400">
                <tr>
                  <th>No</th>
                  <th>Keterangan</th>
                  <th>Kategori Pembayaran</th>
                  {/* <th>Level</th> */}
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {/* row 1 */}
                <tr>
                  <th>1</th>
                  <td>SPP</td>
                  <td>Bulanan</td>
                  {/* <td>TK, SD, SM</td> */}
                  <td>
                    <div className="join">
                      <button
                        className="btn btn-ghost btn-sm join-item bg-orange-500 text-white tooltip"
                        data-tip="Edit"
                      >
                        <FaPencil />
                      </button>
                      <button
                        className="btn btn-ghost btn-sm join-item bg-red-500 text-white tooltip"
                        data-tip="Hapus"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
                <tr>
                  <th>1</th>
                  <td>Pembayaran Buku</td>
                  <td>Non Bulanan</td>
                  {/* <td>SM</td> */}
                  <td>
                    <div className="join">
                      <button
                        className="btn btn-ghost btn-sm join-item bg-orange-500 text-white tooltip"
                        data-tip="Edit"
                      >
                        <FaPencil />
                      </button>
                      <button
                        className="btn btn-ghost btn-sm join-item bg-red-500 text-white tooltip"
                        data-tip="Hapus"
                      >
                        <FaTrash />
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

export default PosKeuangan;
