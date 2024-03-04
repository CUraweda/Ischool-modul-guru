import React from "react";
import Layout from "../component/Layout";

const NilaiSiswa = () => {
  return (
    <div>
      <div className="flex justify-center w-full mt-5 flex-col items-center">
          <span className="text-3xl font-bold">Daftar Nilai Siswa </span>
          <span className="text-xl">kelas II</span>
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
            <select className="select select-primary w-32 max-w-xs">
              <option disabled selected>
                Filter
              </option>
              <option>Hadir</option>
              <option>Izin</option>
              <option>Alfa</option>
              <option>Sakit</option>
            </select>
          </div>
          <div className="overflow-x-auto my-5 w-full p-5 ">
            <table className="table shadow-lg">
              {/* head */}
              <thead className="bg-blue-200">
                <tr>
                  <th>No</th>
                  <th>Nama</th>
                  <th>Mapel</th>
                  <th>Nilai</th>
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
                    <button className="btn btn-primary">Detail</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
    </div>
  );
};

export default NilaiSiswa;
