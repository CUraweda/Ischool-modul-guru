import { FaPlus } from "react-icons/fa";
import KalenderPekanan from "../../component/CalendarPekanan";
import Modal from "../../component/modal";

const jadwalMengajar = () => {
  const showModal = (props: string) => {
    let modalElement = document.getElementById(`${props}`) as HTMLDialogElement;
    if (modalElement) {
      modalElement.showModal();
    }
  };
  return (
    <div className="my-10 w-full flex flex-col items-center">
      <div className=" flex flex-col items-center w-full text-3xl font-bold text-center">
        <span>RENCANA PEKANAN</span>
        <span className="text-xl">Bulan Februari</span>
      </div>
      <div className="w-full p-6">
        <div className="text-right">
          <div className="join">
            <select className="select select-bordered w-full join-item">
              <option disabled selected>
                Pilih Kelas
              </option>
              <option>Han Solo</option>
              <option>Greedo</option>
            </select>
            <button
              className="btn bg-green-500 btn-ghost text-white join-item"
              onClick={() => showModal("add-rencana")}
            >
              <span className="text-xl">
                <FaPlus />
              </span>
              Tambah
            </button>
          </div>
        </div>

        <div className={`w-full bg-white mt-5`}>
          <KalenderPekanan />
        </div>
      </div>

      <Modal id="add-rencana">
        <div className="w-full flex flex-col items-center">
          <span className="text-xl font-bold">Tambah Rencana Pekanan</span>
          <div className="flex w-full mt-5 flex-col">
            <div className="w-full flex flex-col gap-2">
              <label className="mt-4 w-full font-bold">Tahun Pelajaran</label>
              <select className="select select-bordered w-full">
                <option disabled selected>
                  Pilih Kelas
                </option>
                <option>Han Solo</option>
                <option>Greedo</option>
              </select>
            </div>
            <div className="w-full flex flex-col gap-2">
              <label className="mt-4 w-full font-bold">Kelas</label>
              <select className="select select-bordered w-full">
                <option disabled selected>
                  Pilih Kelas
                </option>
                <option>Han Solo</option>
                <option>Greedo</option>
              </select>
            </div>
            <div className="w-full flex flex-col gap-2">
              <label className="mt-4 w-full font-bold">
                Detail Rencana Pekanan
              </label>
              <textarea
                className="textarea textarea-bordered bg-white shadow-md scrollbar-hide"
                placeholder="Agenda"
                // onChange={(e) => formik.setFieldValue("agenda", e.target.value)}
              ></textarea>
            </div>
          </div>
          <div className="w-full">
            <div className="w-full flex flex-col gap-2">
              <label className="mt-4 font-bold">Tanggal</label>
              <div className="flex gap-2 justify-center items-center">
                <input
                  type="datetime-local"
                  className="input input-bordered bg-white shadow-md"
                  // onChange={(e) =>
                  //   formik.setFieldValue("start_date", e.target.value)
                  // }
                />
                <span>-</span>
                <input
                  type="datetime-local"
                  className="input input-bordered bg-white shadow-md"
                  // onChange={(e) =>
                  //   formik.setFieldValue("end_date", e.target.value)
                  // }
                />
              </div>
            </div>
          </div>

          <div className="w-full flex justify-center mt-10 gap-2">
            <button
              className={`btn btn-ghost bg-green-500 text-white font-bold w-full `}
              // onClik={createAgenda}
            >
              Simpan
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default jadwalMengajar;
