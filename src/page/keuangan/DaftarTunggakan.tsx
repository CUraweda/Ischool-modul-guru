// import React from 'react'
import { FaSearch } from 'react-icons/fa'

const DaftarTunggakan = () => {
  return (
    <>
         <div className="w-full flex justify-center flex-col items-center p-3">
         <span className="font-bold text-xl">DAFTAR TUNGGAKAN</span>
        <div className="w-full p-3 bg-white">
         
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
            <select className="select select-bordered w-32">
              <option>Pilih Siswa</option>
              <option>Han Solo</option>
              <option>Greedo</option>
            </select>
            <button className="btn btn-ghost bg-blue-500 text-white">
              Export
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
                  <th>Jatuh Tempo</th>
                 
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th>1</th>
                  <td>Aldi</td>
                  <td>2093424</td>
                  <td>Spp Juni 2024</td>
                  <td>Belum Lunas</td>
                  <td>30 Juni 2024</td>

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
  )
}

export default DaftarTunggakan