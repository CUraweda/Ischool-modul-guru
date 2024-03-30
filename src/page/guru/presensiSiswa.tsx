
const PresensiSiswa = () => {
  return (
    <>
       <div className="flex justify-center w-full mt-5 flex-col items-center">
          <span className="text-3xl font-bold">Presensi Siswa kelas II</span>
          <span className="text-xl">Senin, 4 Maret 2024</span>
          <div className="overflow-x-auto my-10 w-full p-5 bg-white">
            <table className="table shadow-lg">
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
                  <td>aldi</td>
                  <td>123123123</td>
                  <td>VIII</td>
                  <td className="flex gap-2">
                    <select className="select w-32 max-w-xs bg-green-300">
                      <option disabled selected>
                        Presensi
                      </option>
                      <option>Hadir</option>
                      <option>Izin</option>
                      <option>Alfa</option>
                      <option>Sakit</option>
                    </select>
                    <select className="select  w-32 max-w-xs bg-cyan-300">
                      <option disabled selected>
                        Transportasi
                      </option>
                      <option>Jalan Kaki</option>
                      <option>Kendaraan Umum</option>
                      <option>Antar Jemput</option>
                      <option>Sepeda</option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <th>2</th>
                  <td>anwar</td>
                  <td>324234234</td>
                  <td>VIII</td>
                  <td className="flex gap-2">
                    <select className="select w-32 max-w-xs bg-green-300">
                      <option disabled selected>
                        Presensi
                      </option>
                      <option>Hadir</option>
                      <option>Izin</option>
                      <option>Alfa</option>
                      <option>Sakit</option>
                    </select>
                    <select className="select  w-32 max-w-xs bg-cyan-300">
                      <option disabled selected>
                        Transportasi
                      </option>
                      <option>Jalan Kaki</option>
                      <option>Kendaraan Umum</option>
                      <option>Antar Jemput</option>
                      <option>Sepeda</option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <th>3</th>
                  <td>farel</td>
                  <td>34234242</td>
                  <td>VIII</td>
                  <td className="flex gap-2">
                    <select className="select w-32 max-w-xs bg-green-300">
                      <option disabled selected>
                        Presensi
                      </option>
                      <option>Hadir</option>
                      <option>Izin</option>
                      <option>Alfa</option>
                      <option>Sakit</option>
                    </select>
                    <select className="select  w-32 max-w-xs bg-cyan-300">
                      <option disabled selected>
                        Transportasi
                      </option>
                      <option>Jalan Kaki</option>
                      <option>Kendaraan Umum</option>
                      <option>Antar Jemput</option>
                      <option>Sepeda</option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <th>4</th>
                  <td>ahmad</td>
                  <td>23904824</td>
                  <td>VIII</td>
                  <td className="flex gap-2">
                    <select className="select w-32 max-w-xs bg-green-300">
                      <option disabled selected>
                        Presensi
                      </option>
                      <option>Hadir</option>
                      <option>Izin</option>
                      <option>Alfa</option>
                      <option>Sakit</option>
                    </select>
                    <select className="select  w-32 max-w-xs bg-cyan-300">
                      <option disabled selected>
                        Transportasi
                      </option>
                      <option>Jalan Kaki</option>
                      <option>Kendaraan Umum</option>
                      <option>Antar Jemput</option>
                      <option>Sepeda</option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <th>5</th>
                  <td>fani</td>
                  <td>987987</td>
                  <td>VIII</td>
                  <td className="flex gap-2">
                    <select className="select w-32 max-w-xs bg-green-300">
                      <option disabled selected>
                        Presensi
                      </option>
                      <option>Hadir</option>
                      <option>Izin</option>
                      <option>Alfa</option>
                      <option>Sakit</option>
                    </select>
                    <select className="select  w-32 max-w-xs bg-cyan-300">
                      <option disabled selected>
                        Transportasi
                      </option>
                      <option>Jalan Kaki</option>
                      <option>Kendaraan Umum</option>
                      <option>Antar Jemput</option>
                      <option>Sepeda</option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <th>6</th>
                  <td>ratih</td>
                  <td>9799879</td>
                  <td>VIII</td>
                  <td className="flex gap-2">
                    <select className="select w-32 max-w-xs bg-green-300">
                      <option disabled selected>
                        Presensi
                      </option>
                      <option>Hadir</option>
                      <option>Izin</option>
                      <option>Alfa</option>
                      <option>Sakit</option>
                    </select>
                    <select className="select  w-32 max-w-xs bg-cyan-300">
                      <option disabled selected>
                        Transportasi
                      </option>
                      <option>Jalan Kaki</option>
                      <option>Kendaraan Umum</option>
                      <option>Antar Jemput</option>
                      <option>Sepeda</option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <th>7</th>
                  <td>melina</td>
                  <td>8687676878</td>
                  <td>VIII</td>
                  <td className="flex gap-2">
                    <select className="select w-32 max-w-xs bg-green-300">
                      <option disabled selected>
                        Presensi
                      </option>
                      <option>Hadir</option>
                      <option>Izin</option>
                      <option>Alfa</option>
                      <option>Sakit</option>
                    </select>
                    <select className="select  w-32 max-w-xs bg-cyan-300">
                      <option disabled selected>
                        Transportasi
                      </option>
                      <option>Jalan Kaki</option>
                      <option>Kendaraan Umum</option>
                      <option>Antar Jemput</option>
                      <option>Sepeda</option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <th>8</th>
                  <td>jani</td>
                  <td>67579</td>
                  <td>VIII</td>
                  <td className="flex gap-2">
                    <select className="select w-32 max-w-xs bg-green-300">
                      <option disabled selected>
                        Presensi
                      </option>
                      <option>Hadir</option>
                      <option>Izin</option>
                      <option>Alfa</option>
                      <option>Sakit</option>
                    </select>
                    <select className="select  w-32 max-w-xs bg-cyan-300">
                      <option disabled selected>
                        Transportasi
                      </option>
                      <option>Jalan Kaki</option>
                      <option>Kendaraan Umum</option>
                      <option>Antar Jemput</option>
                      <option>Sepeda</option>
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
