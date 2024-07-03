// import React from "react";
import { FaRegFileAlt,  FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { FaPencil } from "react-icons/fa6";

const JenisPembayaran = () => {
  const navigate = useNavigate();

  const handleDetail = () => {
    navigate("/keuangan/jenis-pembayaran/detail");
  };

  return (
    <>
      <div className="w-full flex justify-center flex-col items-center p-3">
        <span className="font-bold text-xl">JENIS PEMBAYARAN</span>
        <div className="w-full p-3 bg-white">
          <div className="w-full flex justify-end my-3 gap-2">
            <select className="select select-bordered w-32">
              <option>Filter</option>
              <option>Han Solo</option>
              <option>Greedo</option>
            </select>
            <button className="btn btn-ghost bg-blue-500 text-white">
              Tambah
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="table table-zebra">
              {/* head */}
              <thead className="bg-blue-400">
                <tr>
                  <th>No</th>
                  <th>Keterangan</th>
                  <th>POS</th>
                  <th>Jatuh Tempo</th>
                  <th>Total</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th>1</th>
                  <td>Spp Juni 2024</td>
                  <td>SPP</td>
                  <td>30 Juni 2024</td>
                  <td>Rp. 150.000</td>

                  <td>
                    <div className="join">
                      <button
                        className="btn btn-ghost btn-sm join-item bg-blue-500 text-white tooltip"
                        data-tip="Detail"
                        onClick={handleDetail}
                      >
                        <FaRegFileAlt />
                      </button>
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

export default JenisPembayaran;
