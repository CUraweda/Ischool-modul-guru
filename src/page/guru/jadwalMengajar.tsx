import { useState } from "react";
import MyScheduler from "../../component/calendar";
import { FaPlus } from "react-icons/fa";

const jadwalMengajar = () => {
  const [View, setView] = useState<string>("hari");
  const appointments = [
    {
      title: "Bersih Kelas",
      startDate: new Date("2024-04-19 07:03:44"),
      endDate: new Date("2024-04-19 09:03:44"),
      priority: 2,
      location: "Room 3",
    },
    {
      title: "Muraja'ah",
      startDate: new Date("2024-04-19 10:03:44"),
      endDate: new Date("2024-04-19 10:30:44"),
      priority: 2,
      location: "Room 3",
    },
    {
      title: "Jumsih",
      startDate: new Date("2024-04-19 10:30:44"),
      endDate: new Date("2024-04-19 11:00:44"),
      priority: 2,
      location: "Room 3",
    },
    {
      title: "Ekskul",
      startDate: new Date("2024-04-19 13:00:44"),
      endDate: new Date("2024-04-19 15:03:44"),
      priority: 2,
      location: "Room 3",
    },
    {
      title: "Bersih Kelas",
      startDate: new Date("2024-04-20 07:03:44"),
      endDate: new Date("2024-04-20 09:54:44"),
      priority: 2,
      location: "Room 3",
    },
    {
      title: "Muraja'ah",
      startDate: new Date("2024-04-20 10:03:44"),
      endDate: new Date("2024-04-20 10:30:44"),
      priority: 2,
      location: "Room 3",
    },
    {
      title: "WWP",
      startDate: new Date("2024-04-20 10:30:44"),
      endDate: new Date("2024-04-20 12:30:44"),
      priority: 2,
      location: "Room 3",
    },
    {
      title: "Ekskul",
      startDate: new Date("2024-04-20 13:00:44"),
      endDate: new Date("2024-04-20 15:03:44"),
      priority: 2,
      location: "Room 3",
    },
  ];

  return (
    <div className="my-10 w-full flex flex-col items-center">
      <div className=" flex flex-col items-center w-full text-3xl font-bold text-center">
        <span>RENCANA PEKANAN</span>
        <span className="text-xl">Bulan Februari</span>
      </div>
      <div className="w-full p-6">
        <div className="text-right">

        <div className="join">
          <select
            className="select select-bordered w-full max-w-xs join-item"
            onChange={(e) => setView(e.target.value)}
          >[]
            <option value="hari">Hari</option>
            <option value="table">Table</option>
          </select>
          <button className="btn bg-green-500 btn-ghost text-white join-item">
            <span className="text-xl">
              <FaPlus />
            </span>
            Tambah
          </button>
        </div>
        </div>
        <div className={`w-full bg-white ${View === "table" ? "" : "hidden"}`}>
          <div className="overflow-x-auto">
            <table className="table table-zebra">
              {/* head */}
              <thead className="bg-blue-400 text-white">
                <tr>
                  <th>Pekan / Tanggal</th>
                  <th>Senin</th>
                  <th>Selasa</th>
                  <th>Rabu</th>
                  <th>Kamis</th>
                  <th>Jum'at</th>
                </tr>
              </thead>
              <tbody>
                {/* row 1 */}
                <tr>
                  <th>1 (9 - 12 April 2024)</th>
                  <td>Libur</td>
                  <td>Bersih Rapi Bersama</td>
                  <td>Muraja'ah</td>
                  <td>Muraja'ah</td>
                  <td>Muraja'ah</td>
                </tr>
                <tr>
                  <th>1 (9 - 12 April 2024)</th>
                  <td>Libur</td>
                  <td>Bersih Rapi Bersama</td>
                  <td>Muraja'ah</td>
                  <td>Muraja'ah</td>
                  <td>Jumsih</td>
                </tr>
                <tr>
                  <th>1 (9 - 12 April 2024)</th>
                  <td>Libur</td>
                  <td>Bersih Rapi Bersama</td>
                  <td>Presentasi WWP Sains</td>
                  <td>Peniaian ibadah sholat</td>
                  <td>Daily Writing</td>
                </tr>
                <tr>
                  <th>1 (9 - 12 April 2024)</th>
                  <td>Libur</td>
                  <td>Bersih Rapi Bersama</td>
                  <td>Presentasi WWP Sains</td>
                  <td>Screening math</td>
                  <td>Ekskul</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className={`w-full bg-white ${View === "hari" ? "" : "hidden"}`}>
          <MyScheduler data={appointments} />
        </div>
      </div>
    </div>
  );
};

export default jadwalMengajar;
