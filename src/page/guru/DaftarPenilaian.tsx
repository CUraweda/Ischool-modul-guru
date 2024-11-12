import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import Icon from "../../assets/icon";
import { Karyawan } from "../../middleware/api-hrd";

type DaftarPenilaianType = {
  user_id: string;
  full_name: string;
  email: string;
  occupation: string;
  grade: string;
  is_finish: boolean;
};

const DaftarPenilaian = () => {
  const [fetch, setFetch] = useState<DaftarPenilaianType[]>([]);
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    try {
      const response = await Karyawan.DaftarPenilaian(0, 20, search);
      if (response.data.data.result) setFetch(response.data.data.result);
    } catch (error) {
      const message = (error as AxiosError<Error>).response?.data.message;
      console.error(message);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen p-5 overflow-y-hidden">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-lg font-bold">Daftar Penilaian</h3>
        <label className="input input-sm input-bordered flex items-center gap-2 md:w-3/12">
          <input
            type="text"
            className="grow"
            placeholder="Cari"
            onKeyDown={(e) => e.key === "Enter" && fetchData()}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Icon name="search" />
        </label>
      </div>
      <div className="my-5 flex-grow border-t border-gray-400 drop-shadow-sm"></div>
      <div className="card bg-white p-4 shadow-md">
        <table className="table table-zebra w-full min-h-20">
          <thead>
            <tr>
              {["Nama", "Email", "Posisi", "Nilai", "Status"].map((column) => (
                <th key={column}>{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {fetch.map((item, index) => (
              <tr key={index}>
                <td>{item?.full_name ?? "-"}</td>
                <td>{item?.email ?? "-"}</td>
                <td className="px-4 py-2">
                  <div className="rounded-md bg-[#DBEAFF] p-2 text-center text-xs font-semibold text-gray-500">
                    {item?.occupation}
                  </div>
                </td>
                <td>{item.grade ?? "-"}</td>
                <td>{item.is_finish ? "Aktif" : "Tidak aktif"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DaftarPenilaian;
