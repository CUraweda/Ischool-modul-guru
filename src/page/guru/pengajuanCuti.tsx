import { ChangeEvent, useState } from 'react';
import { FiPlus } from "react-icons/fi";
import Modal from "../../component/modal";

import DatePicker from "../../component/datePicker";

const PengajuanCuti = () => {
  const [showInput, setShowInput] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    if (event.target.value === 'lainnya') {
      setShowInput(true);
    } else {
      setShowInput(false);
    }
  };

  const showModalAdd = () => {
    const modalElement = document.getElementById("add-cuti") as HTMLDialogElement;
    if (modalElement) {
      modalElement.showModal();
    }
  };

  return (
    <>
      <div className="w-full flex flex-col items-center">
       
        <div className="overflow-x-auto w-full flex flex-col p-5 my-10 justify-center">
          <span className='text-center text-2xl font-bold'>PENGAJUAN CUTI</span>
          <div className="w-full justify-end bg-red flex">
            <button
              className="btn bg-green-500 text-white font-bold"
              onClick={showModalAdd}
            >
              <span className="text-xl">
                <FiPlus />
              </span>
              Add
            </button>
          </div>
          <div className="overflow-x-auto bg-white p-3 mt-3">
            <table className="table table-zebra shadow-md mt-5">
              {/* head */}
              <thead className="bg-blue-400 text-white">
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
                  <td>3 maret 2023</td>
                  <td>5 maret 2023</td>
                  <td>3 hari</td>
                  <td>cuti sakit</td>
                  <td>done</td>
                </tr>
                <tr>
                  <th>2</th>
                  <td>Cy Ganderton</td>
                  <td>5 maret 2023</td>
                  <td>6 maret 2023</td>
                  <td>2 hari</td>
                  <td>lainnya</td>
                  <td>done</td>
                </tr>
                <tr>
                  <th>3</th>
                  <td>Cy Ganderton</td>
                  <td>8 maret 2023</td>
                  <td>11 maret 2023</td>
                  <td>3 hari</td>
                  <td>cuti sakit</td>
                  <td>done</td>
                </tr>
                <tr>
                  <th>4</th>
                  <td>Cy Ganderton</td>
                  <td>15 maret 2023</td>
                  <td>20 maret 2023</td>
                  <td>5 hari</td>
                  <td>cuti lainnya</td>
                  <td>done</td>
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
              <select className="select select-bordered bg-white " onChange={handleChange}>
                <option disabled selected>
                  Pick one
                </option>
                <option value='tahunan'>Cuti Tahunan</option>
                <option value='besar'>Cuti Besar</option>
                <option value='sakit'>Cuti Sakit</option>
                <option value='lainnya'>Lainnya</option>
              </select>
             {showInput && <input type="text" placeholder="Lainnya" className="input input-bordered w-full" />}
              <label className="mt-4 w-full font-bold">Tanggal Cuti </label>
              <div className="w-full flex justify-start">
                  <DatePicker/>
                
              </div>
            </div>
            <div className="w-full flex flex-col gap-2">
              <label className="mt-4 w-full font-bold">Keterangan</label>
              <textarea
                className="textarea textarea-bordered bg-white  scrollbar-hide"
                placeholder="Bio"
              ></textarea>
            </div>
          </div>

          <div className="w-full flex justify-center mt-10 gap-2">
            <button className="btn bg-green-500 text-white font-bold w-full">
              Submit
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default PengajuanCuti;
