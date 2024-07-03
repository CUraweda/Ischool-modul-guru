import Modal from "../../component/modal";

const Laporan = () => {
  const showModal = (props: string) => {
    let modalElement = document.getElementById(props) as HTMLDialogElement;
    if (modalElement) {
      modalElement.showModal();
    }
  };

  return (
    <>
      <div className="w-full flex justify-center flex-col items-center p-3">
        <span className="font-bold text-xl">LAPORAN</span>
        <div className="w-full p-3 bg-white">
          <div className="w-full flex justify-end my-3 gap-2">
            <button
              className="btn btn-ghost bg-green-500 text-white"
              onClick={() => showModal("filter-laporan")}
            >
              Filter
            </button>
            <button className="btn btn-ghost bg-blue-500 text-white">
              Export
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="table table-zebra">
              {/* head */}
              <thead className="bg-blue-400">
                <tr>
                  <th>No</th>
                  <th>Nama</th>
                  <th>NIS</th>
                  <th>Pembayaran</th>
                  <th>Status</th>
                  <th>Tanggal Bayar</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th>1</th>
                  <td>Aldi</td>
                  <td>2093424</td>
                  <td>Spp Juni 2024</td>
                  <td>Belum Lunas</td>
                  <td>30 Juni 2024</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="w-full justify-end flex mt-3">
            <div className="join">
              <button className="join-item btn">«</button>
              <button className="join-item btn">Page 1</button>
              <button className="join-item btn">»</button>
            </div>
          </div>
        </div>
      </div>

      <Modal id="filter-laporan">
        <div className="w-full flex justify-center flex-col items-center">
          <span className="text-xl font-bold ">Filter</span>
          <div className="w-full flex flex-col gap-2 mt-3">
            <label className="font-bold">Kelas</label>
            <select className="select select-bordered w-full">
              <option disabled selected>
                Semua Kelas
              </option>
              <option>Han Solo</option>
              <option>Greedo</option>
            </select>
          </div>
          <div className="w-full flex flex-col gap-2 mt-3">
            <label className="font-bold">Siswa</label>
            <select className="select select-bordered w-full">
              <option disabled selected>
                Semua Siswa
              </option>
              <option>Han Solo</option>
              <option>Greedo</option>
            </select>
          </div>
          <div className="w-full flex flex-col gap-2 mt-3">
            <label className="font-bold">Tanggal</label>
            <div className="w-full flex justify-center items-center gap-1">
              <input
                type="date"
                placeholder="Type here"
                className="input input-bordered w-full"
              />
              <span> - </span>
              <input
                type="date"
                placeholder="Type here"
                className="input input-bordered w-full"
              />
            </div>
          </div>
          <div className="w-full flex flex-col gap-2 mt-3">
            <label className="font-bold">Jenis Pembayaran</label>
            <select className="select select-bordered w-full">
              <option disabled selected>
                Semua Jenis Pembayaran
              </option>
              <option>Han Solo</option>
              <option>Greedo</option>
            </select>
          </div>    
          <div className="w-full flex flex-col gap-2 mt-3">
            <label className="font-bold">Status</label>
            <select className="select select-bordered w-full">
              <option disabled selected>
                Semua Status
              </option>
              <option>Lunas</option>
              <option>Menunggak</option>
            </select>
          </div>    
          <button className="btn btn-ghost bg-green-500 text-white mt-5 w-full">Terapkan</button>
        </div>
      </Modal>
    </>
  );
};

export default Laporan;
