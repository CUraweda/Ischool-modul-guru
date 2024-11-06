import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../../assets/icon";
import { Jobdesk } from "../../middleware/api-hrd";

const RekapPenilaianPage = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<any[]>([]);
  const [filter, setFilter] = useState({
    limit: 10,
    page: 0,
    totalPage: 0,
    totalRows: 0,
    search: "",
    id: "",
  });

  const getAllDataJob = async () => {
    try {
      const response = await Jobdesk.getAllJobdesk(
        filter.limit,
        filter.search,
        filter.page,
        filter.id
      );
      setEmployees(response.data.data.result);
      setFilter((prev) => ({
        ...prev,
        totalRows: response.data.data.totalRows,
        totalPages: response.data.data.totalPages,
        limit: response.data.data.limit,
      }));
    } catch (error) {
      console.error(error);
    }
  };

  const handleDetailClick = (employee: any) =>
    navigate("/guru/detail-rekap-penilaian", { state: { employee } });

  useEffect(() => {
    getAllDataJob();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-full p-5">
      <div className="w-full flex-wrap md:flex justify-between items-center">
        <h3 className="text-lg font-bold">Rekap Penilaian</h3>
        <label className="h-8 text-md input input-md input-bordered flex items-center gap-2 md:w-3/12">
          <Icon name="search" />
          <input
            type="text"
            className="grow"
            placeholder="Search"
            value={filter.search}
            onKeyDown={(e) => e.key === "Enter" && getAllDataJob()}
            onChange={(e) =>
              setFilter((prev) => ({
                ...prev,
                search: e.target.value,
                page: 0,
              }))
            }
          />
        </label>
      </div>

      <div className="my-5 flex-grow border-t border-gray-400 drop-shadow-sm"></div>
      <div className="flex w-full justify-between">
        <button className="text-md badge btn badge-md btn-xs my-5 h-fit rounded-badge bg-[#ffffffc2] drop-shadow-sm">
          Semua
          <div className="pl-5">{employees.length}</div>
        </button>
        <div className="my-auto flex gap-4"></div>
      </div>
      <div className="">
        <div className="card h-fit w-full overflow-x-auto bg-base-100 p-5 shadow-xl">
          <table className="text-md table">
            <thead>
              <tr className="font-bold">
                <th className="text-center">No</th>
                <th>Nama</th>
                <th>Email</th>
                <th>Posisi</th>
                <th className="text-center">Nilai Keseluruhan</th>
                <th className="text-center">Detail</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee, index) => (
                <tr key={index}>
                  <td className="text-center">{index + 1}</td>
                  <td>{employee?.full_name ?? "-"}</td>
                  <td>{employee?.email ?? "-"}</td>
                  <td>{employee?.occupation ?? "-"}</td>
                  <td className="text-center">{employee?.grade ?? "-"}</td>
                  <td className="text-center">
                    <button
                      className="btn btn-primary"
                      onClick={() => handleDetailClick(employee)}
                    >
                      Buka
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="join m-5">
            <button
              className="btn join-item btn-sm"
              onClick={() =>
                setFilter((prev) => ({ ...prev, page: prev.page - 1 }))
              }
              disabled={filter.page === 0} // Disable jika halaman pertama
            >
              Previous
            </button>

            <button
              className="btn join-item btn-sm"
              onClick={() =>
                setFilter((prev) => ({ ...prev, page: prev.page + 1 }))
              }
              disabled={filter.page + 1 >= filter.totalPage} // Disable jika halaman terakhir
            >
              Next
            </button>

            <button className="btn join-item btn-sm">
              <div className="flex justify-between">
                <span>
                  Page {filter.page + 1} of {filter.totalPage}
                </span>
              </div>
            </button>
            <button
              className="btn join-item btn-sm"
              onClick={() => setFilter((prev) => ({ ...prev, limit: 10 }))}
            >
              10
            </button>
            <button
              className="btn join-item btn-sm"
              onClick={() => setFilter((prev) => ({ ...prev, limit: 50 }))}
            >
              50
            </button>
            <button
              className="btn join-item btn-sm"
              onClick={() => setFilter((prev) => ({ ...prev, limit: 100 }))}
            >
              100
            </button>
            <button
              className="btn join-item btn-sm"
              onClick={() => setFilter((prev) => ({ ...prev, limit: 0 }))}
            >
              All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default RekapPenilaianPage;
