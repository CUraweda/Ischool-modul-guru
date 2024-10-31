import { useState, useEffect } from "react";
import { Karyawan } from "../../midleware/api-hrd";
import Modal, { openModal, closeModal } from "../../component/modal";
import Swal from "sweetalert2";
import Icon from "../../assets/icon";
import { FiMoreHorizontal } from "react-icons/fi";
import { Store } from "../../store/Store";
import { AxiosError } from "axios";

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
  const [id, setId] = useState("");
  const [nilai, setNilai] = useState("");
  const [search, setSearch] = useState("");

  const resetNilai = () => setNilai("");
  const token = Store((state) => state.token) ?? "";

  const fetchData = async () => {
    try {
      const response = await Karyawan.DaftarPenilaian(0, 20, search, token);
      if (response.data.data.result) setFetch(response.data.data.result);
    } catch (error) {
      const message = (error as AxiosError<Error>).response?.data.message;
      console.error(message);
    }
  };

  const editNilai = async () => {
    const data = {
      grade: nilai,
    };
    try {
      await Karyawan.EditNilai(data, id, token);
      Swal.fire({
        icon: "success",
        title: "Sukses",
        text: "Penilaian berhasil diubah",
      });
      closeModal("editGrade", resetNilai);
    } catch (error) {
      const message = (error as AxiosError<Error>).response?.data.message;
      Swal.fire({
        icon: "error",
        title: "Error",
        text: message,
      });
      closeModal("editGrade", resetNilai);
    }
  };

  const tableColumn = ["Nama", "Email", "Posisi", "Nilai", "Status", "Action"];

  const handleDialog = (item: DaftarPenilaianType) => {
    setId(item.user_id);
    setNilai(item.grade);
    openModal("editGrade");
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen p-5">
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
              {tableColumn.map((column) => (
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
                <td className="flex gap-2">
                  <div className="dropdown dropdown-end">
                    <label tabIndex={0} className="btn btn-primary btn-sm">
                      <FiMoreHorizontal />
                    </label>
                    <ul
                      tabIndex={0}
                      className="menu dropdown-content w-52 rounded-box bg-base-100 p-2 shadow z-50"
                    >
                      <li className="hover:bg-gray-100 rounded-lg">
                        <a
                          style={{
                            background: "transparent",
                            color: "#222222",
                          }}
                          onClick={() => handleDialog(item)}
                        >
                          Edit Nilai
                        </a>
                      </li>
                    </ul>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal id="editGrade" onClose={resetNilai}>
        <div className="p-6">
          <h2 className="mb-4 text-xl font-bold text-gray-800">Edit Nilai</h2>
          <div className="flex flex-col gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Nilai
              </label>
              <input
                type="text"
                className="input input-bordered w-full border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
                placeholder="Masukkan nilai"
                value={nilai}
                onChange={(e) => setNilai(e.target.value)}
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <button
              className="btn"
              onClick={() => closeModal("editGrade", resetNilai)}
            >
              Tutup
            </button>
            <button className="btn btn-primary" onClick={editNilai}>
              Simpan Perubahan
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DaftarPenilaian;
