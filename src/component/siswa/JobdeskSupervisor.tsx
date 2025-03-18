import { useEffect, useState } from "react";
import { FaPenClip } from "react-icons/fa6";
import Swal from "sweetalert2";
import { Input } from "../Input";
import Modal, { openModal, closeModal } from "../../component/modal";
import {
  IpageMeta,
  PaginationControl,
} from "../../component/PaginationControl";
import { Jobdesk } from "../../middleware/api-hrd";

const JobdeskSupervisor = () => {
  const [pageMeta, setPageMeta] = useState<IpageMeta>({ page: 0, limit: 10 });
  const [fetchData, setFetchData] = useState<any[]>([]);
  const [id, setId] = useState<number | null>(null);
  const [filter, setFilter] = useState({
    page: 0,
    limit: 10,
  });
  const [nilaiSupervisor, setNilaiSupervisor] = useState<number | undefined>();

  // Fetch data
  const Fetch = async () => {
    try {
      const response = await Jobdesk.getAllJobdesk(
        filter.limit,
        filter.page,
        "",
        "Y",
        ""
      );
      const { result, ...meta } = response.data.data;
      setFetchData(result);
      setPageMeta(meta);
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Gagal mengambil data!", "error");
    }
  };

  // Handle buka modal & isi data
  const HandleDialog = (id: number, item: any) => {
    openModal("jobdesk-supervisor");
    setId(id);
    setNilaiSupervisor(item?.assesor_grade);
  };

  // Handle Update langsung tanpa konfirmasi
  const UpdateJobdesk = async () => {
    if (id === null) return;

    const data = {
      grade: nilaiSupervisor,
      identifier: "SUPERVISOR",
    };

    try {
      await Jobdesk.UpdateJobdesk(data, id);

      // Tutup modal sebelum menampilkan SweetAlert sukses
      closeModal("jobdesk-supervisor");

      Fetch();

      // Tampilkan SweetAlert sukses
      setTimeout(() => {
        Swal.fire({
          title: "Sukses",
          text: "Data berhasil diperbarui!",
          icon: "success",
        });
      }, 300);
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Gagal memperbarui data!", "error");
    }
  };

  const handleFilter = (key: string, value: any) => {
    const obj = {
      ...filter,
      [key]: value,
    };
    if (key !== "page") obj["page"] = 0;
    setFilter(obj);
  };

  // Fetch ulang data saat filter berubah
  useEffect(() => {
    Fetch();
  }, [filter]);

  return (
    <div className="w-full">
      {/* Table Data */}
      <div className="overflow-x-auto">
        <table className="table table-zebra mt-5 min-w-full">
          {/* head */}
          <thead className="bg-blue-200">
            <tr>
              <th>No</th>
              <th>Nama</th>
              <th>Email</th>
              <th>Posisi</th>
              <th>Deskripsi</th>
              <th>Supervisor</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {fetchData.length > 0 ? (
              fetchData.map((item, index) => (
                <tr key={item.id}>
                  <th>
                    {index + 1 + (pageMeta?.page ?? 0) * (pageMeta?.limit ?? 0)}
                  </th>
                  <td>{item?.name}</td>
                  <td>{item?.employee?.email}</td>
                  <td>{item?.employee?.occupation}</td>
                  <td>{item?.description}</td>
                  <td>{item?.assesor_grade}</td>
                  <td className="flex gap-2">
                    <button
                      className="btn btn-sm btn-ghost bg-orange-600 text-xl join-item tooltip"
                      data-tip="Edit"
                      onClick={() => HandleDialog(item.id, item)}
                    >
                      <FaPenClip />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="text-center p-4">
                  Tidak ada data ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <PaginationControl
          meta={pageMeta}
          onPrevClick={() => handleFilter("page", pageMeta.page - 1)}
          onNextClick={() => handleFilter("page", pageMeta.page + 1)}
          onJumpPageClick={(val) => handleFilter("page", val)}
          onLimitChange={(val) => handleFilter("limit", val)}
        />
      </div>

      {/* Modal Update Nilai */}
      <Modal id="jobdesk-supervisor" width="w-11/12 max-w-5xl">
        <div className="w-full flex flex-col items-center">
          <p className="text-xl font-bold">Update Nilai Supervisor</p>

          <Input
            label="Nilai"
            value={nilaiSupervisor}
            onChange={(e) => setNilaiSupervisor(parseInt(e.target.value))}
            type="number"
          />

          <div className="flex gap-2 mt-4">
            <button
              className="btn btn-ghost bg-green-500 text-white"
              onClick={UpdateJobdesk}
            >
              Submit
            </button>
            <button
              className="btn btn-ghost bg-gray-500 text-white"
              onClick={() => closeModal("jobdesk-supervisor")}
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default JobdeskSupervisor;
