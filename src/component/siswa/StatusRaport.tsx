import { FaRegCheckSquare, FaRegWindowClose } from "react-icons/fa";
const StatusRaport = () => {
  return (
    <div>
      <div className="w-full flex justify-between gap-2">
        <div className="join">
          <select className="select select-sm join-item w-32 max-w-md select-bordered">
            <option disabled selected>
              Tahun Pelajaran
            </option>
            <option>2023/2024</option>
            <option>2024/2025</option>
          </select>
          <select className="select select-sm join-item w-32 max-w-md select-bordered">
            <option disabled selected>
              Semester
            </option>
            <option>Ganjil</option>
            <option>Genap</option>
          </select>
          <select className="select select-sm join-item w-32 max-w-md select-bordered">
            <option disabled selected>
              Kelas
            </option>
            <option>VII</option>
            <option>VIII</option>
            <option>IX</option>
          </select>
          <select className="select select-sm join-item w-32 max-w-xs select-bordered">
            <option disabled selected>
              Siswa
            </option>
            <option>Aldi</option>
            <option>Damar</option>
            <option>beni</option>
            <option>jono</option>
          </select>
        </div>
      </div>
      <div className="overflow-x-auto mt-5">
        <table className="table table-md">
          <thead>
            <tr className="bg-blue-300">
              <th>No</th>
              <th>Nama Siswa</th>
              <th>Angka</th>
              <th>Narasi</th>
              <th>Portofolio</th>
              <th>Persentase</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>1</th>
              <td>anisa</td>
              <td>
                <span
                  className="text-green-500 text-xl tooltip"
                  data-tip="sudah terisi"
                >
                  <FaRegCheckSquare />
                </span>
              </td>
              <td>
                <span
                  className="text-red-500 text-xl tooltip"
                  data-tip="belum terisi"
                >
                  <FaRegWindowClose />
                </span>
              </td>
              <td>
                <span
                  className="text-green-500 text-xl tooltip"
                  data-tip="sudah terisi"
                >
                  <FaRegCheckSquare />
                </span>
              </td>

              <td className="flex items-start flex-col justify-center">
                <p>20%</p>
                <progress
                  className="progress progress-accent"
                  value="20"
                  max="100"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StatusRaport;
