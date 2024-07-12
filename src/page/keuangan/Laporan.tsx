import { FaFileExcel } from "react-icons/fa";
import Modal, { openModal } from "../../component/modal";
import { Store } from "../../store/Store";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { TagihanSiswa } from "../../midleware/api";
import moment from "moment";

const Laporan = () => {
  const { token } = Store(),
    modalFilterId = "filter-laporan";

  // filtering
  const [pageMeta, setPageMeta] = useState<any>({ page: 0 });
  const [filter, setFilter] = useState({
    page: 0,
    limit: 10,
    postId: "",
    classId: "",
    studentId: "",
    startDue: "",
    endDue: "",
    status: "",
  });

  const handleFilter = (key: string, value: string) => {
    const obj = {
      ...filter,
      [key]: value,
    };
    if (key != "page") obj["page"] = 0;
    setFilter(obj);
  };

  // main
  const [dataList, setDataList] = useState<any[]>([]);

  const getDataList = async () => {
    try {
      const res = await TagihanSiswa.showAllReports(
        token,
        filter.postId,
        filter.classId,
        filter.studentId,
        filter.startDue,
        filter.endDue,
        filter.status,
        filter.page,
        filter.limit
      );
      const { result, ...meta } = res.data.data;
      setDataList(result);
      setPageMeta(meta);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Gagal Mengambil data laporan, silakan refresh halaman!",
      });
    }
  };

  useEffect(() => {
    getDataList();
  }, [filter]);

  return (
    <>
      <div className="w-full flex justify-center flex-col items-center p-3">
        <span className="font-bold text-xl">LAPORAN</span>
        <div className="w-full p-3 bg-white">
          <div className="w-full flex justify-end my-3 gap-2">
            <button
              className="btn btn-primary text-white"
              onClick={() => openModal(modalFilterId)}
            >
              Filter
            </button>
            <button className="btn bg-[#1d6f42] text-white">
              <FaFileExcel size={18} />
              Export
            </button>
          </div>

          {/* data list */}
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
                {dataList.map((dat, i) => (
                  <tr key={i}>
                    <th>{i + 1}</th>
                    <td>{dat.student?.full_name ?? ""}</td>
                    <td>{dat.student?.nis ?? ""}</td>
                    <td>{dat.studentpaymentbill?.name ?? ""}</td>
                    <td>
                      <p
                        className={
                          "font-extrabold " +
                          (dat.status.toLowerCase() == "lunas"
                            ? "text-success"
                            : "") +
                          (dat.status.toLowerCase() == "belum lunas"
                            ? "text-error"
                            : "")
                        }
                      >
                        {dat.status?.toUpperCase() ?? "-"}
                      </p>
                    </td>
                    <td>
                      {dat.paidoff_at
                        ? moment(dat.paidoff_at).format("DD MMMM YYYY hh:mm")
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* pagination control  */}
          <div className="w-full justify-end flex mt-3">
            <div className="join">
              <button
                className="join-item btn"
                onClick={() =>
                  handleFilter("page", (pageMeta.page - 1).toString())
                }
                disabled={pageMeta.page == 0}
              >
                «
              </button>
              <button className="join-item btn">
                Page {pageMeta.page + 1}
              </button>
              <button
                className="join-item btn"
                onClick={() =>
                  handleFilter("page", (pageMeta.page + 1).toString())
                }
                disabled={pageMeta.page + 1 == pageMeta.totalPage}
              >
                »
              </button>
            </div>
          </div>
        </div>
      </div>

      <Modal id={modalFilterId}>
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
          <button className="btn btn-ghost bg-green-500 text-white mt-5 w-full">
            Terapkan
          </button>
        </div>
      </Modal>
    </>
  );
};

export default Laporan;
