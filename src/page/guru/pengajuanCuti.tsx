import { useState } from "react";
import { FiPlus } from "react-icons/fi";
import Modal from "../../component/modal";
import { addDays, format } from "date-fns";
import { DateRange, DayPicker } from "react-day-picker";
import 'react-day-picker/dist/style.css';

const pastMonth = new Date();

const pengajuanCuti = () => {
  const showModalAdd = () => {
    let modalElement = document.getElementById("add-cuti") as HTMLDialogElement;
    if (modalElement) {
      modalElement.showModal();
    }
  };
  const defaultSelected: DateRange = {
    from: pastMonth,
    to: addDays(pastMonth, 1),
  };
  const [range, setRange] = useState<DateRange | undefined>(defaultSelected);

  let footer = <p>Please pick the first day.</p>;
  if (range?.from) {
    if (!range.to) {
      footer = <p>{format(range.from, "PPP")}</p>;
    } else if (range.to) {
      footer = (
        <p>
          {format(range.from, "PPP")}–{format(range.to, "PPP")}
        </p>
      );
    }
  }

  return (
    <>
      <div className="w-full flex flex-col items-center">
        <div className="flex justify-between w-full flex-wrap">
          <div className="p-3 sm:w-1/4 w-full">
            <div className="bg-green-100 shadow-md w-full rounded-md p-3 flex flex-col items-center">
              <span className="text-xl font-bold">
                Jumlah Cuti Tahun Berjalan
              </span>
              <div className="flex justify-center w-full">
                <div className="w-full my-4 flex justify-center items-center">
                  <span className="text-8xl md:text-8xl font-bold">12</span>
                  <span className="text-xl font-bold">Hari</span>
                </div>
              </div>
            </div>
          </div>
          <div className="p-3 sm:w-1/4 w-full">
            <div className="bg-blue-100 shadow-md w-full rounded-md p-3 flex flex-col items-center">
              <span className="text-xl font-bold">
                Jumlah Cuti Tahun Berjalan
              </span>
              <div className="flex justify-center w-full">
                <div className="w-full my-4 flex justify-center items-center">
                  <span className="text-8xl md:text-8xl font-bold">12</span>
                  <span className="text-xl font-bold">Hari</span>
                </div>
              </div>
            </div>
          </div>
          <div className="p-3 sm:w-1/4 w-full">
            <div className="bg-red-100 shadow-md w-full rounded-md p-3 flex flex-col items-center">
              <span className="text-xl font-bold">
                Jumlah Cuti Tahun Berjalan
              </span>
              <div className="flex justify-center w-full">
                <div className="w-full my-4 flex justify-center items-center">
                  <span className="text-8xl md:text-8xl font-bold">12</span>
                  <span className="text-xl font-bold">Hari</span>
                </div>
              </div>
            </div>
          </div>
          <div className="p-3 sm:w-1/4 w-full">
            <div className="bg-yellow-100 shadow-md w-full rounded-md p-3 flex flex-col items-center">
              <span className="text-xl font-bold">
                Jumlah Cuti Tahun Berjalan
              </span>
              <div className="flex justify-center w-full">
                <div className="w-full my-4 flex justify-center items-center">
                  <span className="text-8xl md:text-8xl font-bold">12</span>
                  <span className="text-xl font-bold">Hari</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto w-full flex flex-col p-5 my-10 justify-center">
          <div className="w-full justify-end bg-red flex">
            <button
              className="btn bg-green-500 text-white font-bold"
              onClick={showModalAdd}
            >
              <span className="text-xl">
                <FiPlus />
              </span>{" "}
              Add
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="table table-zebra shadow-md mt-5">
              {/* head */}
              <thead className="bg-blue-200">
                <tr>
                  <th>No</th>
                  <th>Name</th>
                  <th>Tanggal Mulai</th>
                  <th>Tanggal Selesai</th>
                  <th>Durasi</th>
                  <th>Keterangan</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th>1</th>
                  <td>Cy Ganderton</td>
                  <td>Quality Control Specialist</td>
                  <td>Blue</td>
                  <td>Blue</td>
                  <td>Blue</td>
                  <td>Blue</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Modal id="add-cuti">
        <div className="w-full flex flex-col items-center">
          <span className="text-xl font-bold">Form Pengajuan Cuti / Izin</span>
          <div className="flex w-full mt-5">
            <table className="sm:w-1/2 w-full">
              <tr>
                <td className="font-bold">Nama</td>
                <td>: nama kamu</td>
              </tr>
              <tr>
                <td className="font-bold">Jabatan</td>
                <td>: admin</td>
              </tr>
            </table>
          </div>
          <div className="w-full">
            <div className="w-full flex flex-col gap-2">
              <label className="mt-4 font-bold">Jenis</label>
              <select className="select select-bordered bg-white shadow-md">
                <option disabled selected>
                  Pick one
                </option>
                <option>Cuti Tahunan</option>
                <option>Cuti Besar</option>
                <option>Cuti Sakit</option>
              </select>
              <label className="mt-4 w-full font-bold">Tanggal Cuti </label>
              <div className="w-full flex justify-center">
                <div className="shadow-md">
                  <DayPicker
                    id="test"
                    mode="range"
                    defaultMonth={pastMonth}
                    selected={range}
                    footer={footer}
                    onSelect={setRange}
                  />
                </div>
              </div>
            </div>
            <div className="w-full flex flex-col gap-2">
              <label className="mt-4 w-full font-bold">Keterangan</label>
              <textarea
                className="textarea textarea-bordered bg-white shadow-md scrollbar-hide"
                placeholder="Bio"
              ></textarea>
            </div>
          </div>

          <div className="w-full flex justify-center mt-10 gap-2">
            <button className="btn bg-green-500 text-white font-bold w-full">
              Submit
            </button>
            {/* <button className="btn bg-green-500 text-white font-bold">Submit</button> */}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default pengajuanCuti;
