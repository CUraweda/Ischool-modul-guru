// import React from "react";
import { FaSearch, FaTrash } from "react-icons/fa";
import { MdInsertPhoto } from "react-icons/md";

const DetailJenisPembayaran = () => {
  return (
    <>
      <div className="w-full flex justify-center flex-col items-center p-3">
        <div className="w-full p-3 bg-white">
          <div className="breadcrumbs text-sm">
            <ul>
              <li>
                <a>Home</a>
              </li>
              <li>
                <a>Pembayaran</a>
              </li>
              <li>Jenis Pembayaran</li>
              <li>Detail Jenis Pembayaran</li>
            </ul>
          </div>
          <div className="w-full flex justify-end my-3 gap-2">
            <div className="join">
              <input
                type="text"
                placeholder="Cari Siswa"
                className="input input-bordered w-full max-w-xs join-item"
              />

              <button className="btn btn-ghost bg-blue-500 join-item text-white">
                <FaSearch />
              </button>
            </div>
            <select className="select select-bordered w-32">
              <option>Pilih Kelas</option>
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
                  <th>Nama</th>
                  <th>NIS</th>
                  <th>Pembayaran</th>
                  <th>Status</th>
                  <th>Bukti Bayar</th>
                  <th>Tanggal Bayar</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th>1</th>
                  <td>Aldi</td>
                  <td>2093424</td>
                  <td>Spp Juni 2024</td>
                  <td>Lunas</td>
                  <td>
                    <button className="btn btn-ghost btn-sm text-2xl ">
                      <MdInsertPhoto />
                    </button>
                  </td>
                  <td>29 Juni 2024</td>

                  <td>
                    <div className="join">
                     
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
                  <th>2</th>
                  <td>Aldi</td>
                  <td>2093424</td>
                  <td>Spp Juni 2024</td>
                  <td>Belum Lunas</td>
                  <td>
                    <button className="btn btn-ghost btn-sm text-2xl btn-disabled">
                      <MdInsertPhoto />
                    </button>
                  </td>
                  <td>-</td>

                  <td>
                    <div className="join">
                     
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

export default DetailJenisPembayaran;
