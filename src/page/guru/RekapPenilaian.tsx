import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Pagination from "../../component/ui/pagination";
import Search from "../../component/ui/search";
import { useGetAllEmployee } from "../../hooks/useGetAllEmployee";
import useSearchParams from "../../hooks/useSearchParams";
import { Employee } from "../../types/employee";
import { filterParams } from "../../utils/common";
import { minimumPaginationPage, numberOfTable } from "../../utils/pagination";

type FilterParams = Partial<{
  limit: number;
  page: number;
  employee_id: string;
  search: string;
}>;

const RekapPenilaianPage = () => {
  const navigate = useNavigate();

  const { getSearchParam, handleSearchParams } = useSearchParams();
  const params = {
    page: getSearchParam("search") ? undefined : +getSearchParam?.("page") || 1,
    limit: +getSearchParam("limit") || 10,
    search: getSearchParam("search"),
  };

  const [baseFilter, setBaseFilter] = useState<FilterParams>(params);

  const { data: employee } = useGetAllEmployee<FilterParams>(
    filterParams(params)
  );
  const totalPages = minimumPaginationPage(employee?.data.totalPage ?? 0, 6);

  const handleDetailClick = (employee: Employee) =>
    navigate("/guru/detail-rekap-penilaian", { state: { employee } });

  useEffect(() => {
    handleSearchParams(params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-full p-5">
      <div className="w-full flex-wrap md:flex justify-between items-center">
        <h3 className="text-lg font-bold">Rekap Penilaian</h3>
        <Search />
      </div>

      <div className="my-5 flex-grow border-t border-gray-400 drop-shadow-sm"></div>
      <div className="flex w-full justify-between">
        <button className="text-md badge btn badge-md btn-xs my-5 h-fit rounded-badge bg-[#ffffffc2] drop-shadow-sm">
          Semua
          <div className="pl-5">{employee?.data.totalRows}</div>
        </button>
        <div className="my-auto flex gap-4"></div>
      </div>
      <div>
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
              {employee?.data.result.map((employee, index) => (
                <tr key={index}>
                  <td className="text-center">
                    {numberOfTable(index, params.page ?? 0, params.limit, 1)}
                  </td>
                  <td>{employee?.full_name ?? "-"}</td>
                  <td>{employee?.email ?? "-"}</td>
                  <td>{employee?.occupation ?? "-"}</td>
                  <td className="text-center">{employee?.grade ?? "-"}</td>
                  <td className="text-center">
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleDetailClick(employee)}
                    >
                      Buka
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
            onChangeLimit={(value: number) =>
              setBaseFilter((prev) => ({ ...prev, limit: value }))
            }
            onChangePage={(value: number) =>
              setBaseFilter((prev) => ({ ...prev, page: value }))
            }
            limit={baseFilter.limit ?? 10}
            totalPages={totalPages}
            pageSize={6}
          />
        </div>
      </div>
    </div>
  );
};
export default RekapPenilaianPage;
