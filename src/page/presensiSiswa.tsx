import React from "react";
import Layout from "../component/Layout";

const PresensiSiswa = () => {
  return (
    <>
       <div className="flex justify-center w-full mt-5 flex-col items-center">
          <span className="text-3xl font-bold">Presensi Siswa kelas II</span>
          <span className="text-xl">Senin, 4 Maret 2024</span>
          <div className="overflow-x-auto my-10 w-full p-5 ">
            <table className="table shadow-lg">
              {/* head */}
              <thead className="bg-blue-200">
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
                  <td>Quality Control Specialist</td>
                  <td>Blue</td>
                  <td>
                    <select className="select select-primary w-32 max-w-xs">
                      <option disabled selected>
                        Presensi
                      </option>
                      <option>Hadir</option>
                      <option>Izin</option>
                      <option>Alfa</option>
                      <option>Sakit</option>
                    </select>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
    </>
  );
};

export default PresensiSiswa;
