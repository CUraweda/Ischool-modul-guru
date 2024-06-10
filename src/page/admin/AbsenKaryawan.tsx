import { useState } from "react";
import { FaPencilAlt } from "react-icons/fa";
import MapWithPinAndRadius from "../../component/MapWithPinAndRadius";

const AbsenKaryawan = () => {
  const [radius, setRadius] = useState<number>(1);



  return (
    <>
      <div className="w-full flex flex-col justify-start p-3">
        <div className="w-full bg-white p-2 rounded-md">
          <span className="font-bold">Setting Absensi Karyawan</span>
          <div className="w-full flex flex-wrap">
            <div className="w-full sm:w-1/2 p-2">
              <div className="overflow-x-auto w-full bg-gray-200 p-2 rounded-md">
                <span className="font-bold">Jam Kerja</span>
                <table className="table">
                  {/* head */}
                  <thead className="bg-blue-400">
                    <tr>
                      <th>Hari</th>
                      <th>Jam Masuk</th>
                      <th>Jam Pulang</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Senin</td>
                      <td>07.00 - 08.00</td>
                      <td>07.00 - 08.00</td>
                      <td>
                        <span>
                          <FaPencilAlt />
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>Selasa</td>
                      <td>07.00 - 08.00</td>
                      <td>07.00 - 08.00</td>
                      <td>
                        <span>
                          <FaPencilAlt />
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>Rabu</td>
                      <td>07.00 - 08.00</td>
                      <td>07.00 - 08.00</td>
                      <td>
                        <span>
                          <FaPencilAlt />
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>Kamis</td>
                      <td>07.00 - 08.00</td>
                      <td>07.00 - 08.00</td>
                      <td>
                        <span>
                          <FaPencilAlt />
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>Jum'at</td>
                      <td>07.00 - 08.00</td>
                      <td>07.00 - 08.00</td>
                      <td>
                        <span>
                          <FaPencilAlt />
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>Sabtu</td>
                      <td>07.00 - 08.00</td>
                      <td>07.00 - 08.00</td>
                      <td>
                        <span>
                          <FaPencilAlt />
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>Minggu</td>
                      <td>07.00 - 08.00</td>
                      <td>07.00 - 08.00</td>
                      <td>
                        <span>
                          <FaPencilAlt />
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="w-full sm:w-1/2 p-2">
              <div className="w-full bg-gray-200 p-2 rounded-md">
                <div className="">
                  <span className="font-bold my-4">Lokasi Absen</span>
                </div>
                    <MapWithPinAndRadius defaultRadius={radius ? radius : 1} />
                <div className="w-full justify-end items-end flex flex-col my-4">
                  <div className="flex gap-2">
                   
                    <input
                      type="number"
                      placeholder="Radius"
                      className="input input-bordered w-32"
                      onChange={(e) => {
                        setRadius(parseInt(e.target.value));
                      }}
                    />
                    <button className="btn bg-green-500">Simpan</button>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
        <div className="w-full bg-white p-2 rounded-md mt-4">
          <span className="font-bold">Jenis Cuti</span>
          <div className="w-full flex flex-wrap">
            <div className="w-full sm:w-1/2 p-2">
              <div className="overflow-x-auto w-full bg-gray-200 p-2 rounded-md">
                <span className="font-bold">Cuti Karyawan</span>
                <table className="table">
                  {/* head */}
                  <thead className="bg-blue-400">
                    <tr>
                      <th>No</th>
                      <th>Keterangan</th>
                      {/* <th>Jam Pulang</th> */}
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Senin</td>
                      <td>07.00 - 08.00</td>
                      {/* <td>07.00 - 08.00</td> */}
                      <td>
                        <span>
                          <FaPencilAlt />
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="w-full sm:w-1/2 p-2">
              <div className="w-full flex flex-wrap">
                <div className="overflow-x-auto w-full bg-gray-200 p-2 rounded-md">
                  <span className="font-bold">Cuti Guru</span>
                  <table className="table">
                    {/* head */}
                    <thead className="bg-blue-400">
                      <tr>
                        <th>No</th>
                        <th>Keterangan</th>
                        {/* <th>Jam Pulang</th> */}
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Senin</td>
                        <td>07.00 - 08.00</td>
                        {/* <td>07.00 - 08.00</td> */}
                        <td>
                          <span>
                            <FaPencilAlt />
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

     
    </>
  );
};

export default AbsenKaryawan;
