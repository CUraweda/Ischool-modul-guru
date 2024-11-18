import { useEffect, useState } from "react";
import { FaFileExport } from "react-icons/fa6";
import { GrStatusUnknown } from "react-icons/gr";
import { MdPeopleAlt } from "react-icons/md";
import { TbFaceId } from "react-icons/tb";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import DetailCard from "../../component/DetailCard";
import NoData from "../../component/NoData";
import Pagination from "../../component/ui/pagination";
import Search from "../../component/ui/search";
import {
  attendanceStatus,
  listType,
  worktimeType,
} from "../../constant/attendanceType";
import { useGetAllEmployeeAttendance } from "../../hooks/useGetAllAttendance";
import { useGetAllEmployee } from "../../hooks/useGetAllEmployee";
import { useGetDivision } from "../../hooks/useGetDivision";
import useSearchParams from "../../hooks/useSearchParams";
import { Attendance } from "../../types/attendance";
import {
  capitalize,
  filterParams,
  formattedDate,
  formattedTime,
} from "../../utils/common";
import { minimumPaginationPage, numberOfTable } from "../../utils/pagination";

type BaseFilter = {
  type: string[];
  status: string[];
  division_id: string[];
  date: string;
  limit: number;
  page: number;
  search: string;
};

const DinasLuarPage = () => {
  const { getSearchParam, getSplitSearchParam, handleSearchParams } =
    useSearchParams();

  const params = {
    type: getSplitSearchParam("type"),
    status: getSplitSearchParam("status"),
    division_id: getSplitSearchParam("division_id"),
    date: getSearchParam("date"),
    page: +getSearchParam("page") || 1,
    limit: +getSearchParam("limit") || 10,
    search: getSearchParam("search"),
  };

  const [baseFilter, setBaseFilter] = useState<BaseFilter>(params);
  const [selectedItem, setSelectedItem] = useState<Attendance | undefined>();
  const [selectedItemEmployee, setSelectedItemEmployee] = useState<string[]>(
    []
  );

  const {
    data: dataEmployee,
    error: errorGetEmployee,
    refetch: refetchEmployee,
  } = useGetAllEmployee<{ limit: number }>({
    limit: 10,
  });
  if (errorGetEmployee) {
    Swal.fire({
      title: "Silahkan coba lagi",
      icon: "error",
      text: "Data yang dicari tidak ditemukan",
    });
  }

  const { data: listDivision, error: errorGetDivision } = useGetDivision();
  if (errorGetDivision) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Something went wrong!",
    });
  }

  const { data: employeeAttendance } = useGetAllEmployeeAttendance(
    filterParams({
      ...baseFilter,
      search: getSearchParam("search"),
      page: params.page! - 1,
    })
  );

  const updateBaseFilter = (category: keyof BaseFilter, value: string) => {
    if (["date", "limit", "page"].includes(category)) {
      setBaseFilter((prev) => ({ ...prev, [category]: value }));
    } else if (["type", "status", "division_id"].includes(category)) {
      const values = [...(baseFilter[category] as Array<string>), value];
      setBaseFilter((prev) => {
        const currentValues = Array.isArray(prev[category])
          ? prev[category]
          : [];
        return {
          ...prev,
          [category]: currentValues.includes(value)
            ? currentValues.filter((item) => item !== value)
            : values,
        };
      });
    }
  };

  const handleCheckType = (value: string, category: keyof BaseFilter) =>
    updateBaseFilter(category.toLowerCase() as keyof BaseFilter, value);

  const handleCheckDivision = (id: number) =>
    updateBaseFilter("division_id", id.toString());

  const handleCheckboxChange = (employeeName: string) => {
    setSelectedItemEmployee((prevSelected) =>
      prevSelected.includes(employeeName)
        ? prevSelected.filter((name) => name !== employeeName)
        : [...prevSelected, employeeName]
    );
  };

  const totalPages = minimumPaginationPage(
    employeeAttendance?.data.totalPage ?? 0,
    6
  );

  const handleOpenDetailModal = (item: Attendance) => setSelectedItem(item);
  const handleDetailClose = () => setSelectedItem(undefined);

  const exportToXLSX = () => {
    const formattedData = employeeAttendance?.data.result?.map(
      (item, index) => ({
        no: index + 1,
        id: item.id,
        Nama: item.employee.full_name,
        Divisi: item.employee.division.name,
        uid: item.uid,
        Deskripsi: item.description,
        status: item.status,
        Pukul: formattedTime(item.createdAt),
        Tanggal: formattedDate(item.createdAt),
      })
    );
    const worksheet = XLSX.utils.json_to_sheet(formattedData || []);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Rekap Data Dinas Luar");
    XLSX.writeFile(workbook, "Data_Dinas_Luar.xlsx");
  };

  useEffect(() => {
    handleSearchParams(params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="h-screen w-full p-5">
      <div className="w-full flex-wrap justify-between items-center md:flex">
        <h3 className="text-lg font-bold">Dinas Luar</h3>
        <Search />
      </div>
      <div className="my-5 flex-grow border-t border-gray-400 drop-shadow-sm"></div>
      <div className="flex w-full justify-between">
        <div className="m-2 flex flex-wrap-reverse gap-4">
          <button className="text-md badge btn badge-md btn-xs h-fit rounded-badge bg-[#ffffffc2] drop-shadow-sm">
            Semua
            <div className="pl-5">{employeeAttendance?.data.totalRows}</div>
          </button>
        </div>
        <div className="m-2 flex flex-wrap-reverse gap-4">
          <button
            className="text-md btn badge-success badge-md btn-xs h-fit rounded-badge text-white drop-shadow-sm"
            onClick={exportToXLSX}
          >
            <FaFileExport />
            <div className="pl-1">{employeeAttendance?.data.totalRows}</div>
            Export
          </button>
          <div className="dropdown shrink-0">
            <div
              onClick={() => refetchEmployee()}
              tabIndex={0}
              role="button"
              className="text-md btn badge-info badge-md btn-xs h-fit rounded-badge text-white drop-shadow-sm"
            >
              <MdPeopleAlt /> Karyawan
            </div>
            <ul
              tabIndex={0}
              className="menu dropdown-content z-[1] mt-2 w-52 overflow-y-scroll rounded-box bg-base-100 p-4 shadow"
            >
              <div className="checkbox-group space-y-1">
                {dataEmployee?.data.result.map((employee) => (
                  <label
                    key={employee?.id}
                    className="flex items-center space-x-2"
                  >
                    <input
                      type="checkbox"
                      checked={selectedItemEmployee.includes(
                        employee.full_name
                      )}
                      onChange={() => handleCheckboxChange(employee.full_name)}
                    />
                    <span>{employee.full_name}</span>
                  </label>
                ))}
              </div>
            </ul>
          </div>

          <div className="my-auto flex gap-4">
            <div className="dropdown">
              <div
                tabIndex={0}
                role="button"
                className="text-md btn badge-warning badge-md btn-xs flex h-fit truncate rounded-badge text-white drop-shadow-sm"
              >
                <GrStatusUnknown /> Tipe, Status dan Divisi
              </div>
              <ul
                tabIndex={0}
                className="menu dropdown-content z-[1] mt-2 w-52 rounded-box bg-base-100 p-4 shadow"
              >
                <h4 className="mt-2 font-medium mb-1">Tipe</h4>
                <div className="checkbox-group space-y-1">
                  {listType
                    .filter((item) => item.category === "Type")
                    .map((item) => (
                      <label
                        key={item.id}
                        className="flex items-center space-x-2"
                      >
                        <input
                          type="checkbox"
                          checked={baseFilter.type.includes(item.value)}
                          onChange={() => handleCheckType(item.value, "type")}
                        />
                        <span>{item.value}</span>
                      </label>
                    ))}
                </div>
                <h4 className="mt-2 font-medium mb-1">Status</h4>
                <div className="checkbox-group space-y-1">
                  {listType
                    .filter((item) => item.category === "Status")
                    .map((item) => (
                      <label
                        key={item.id}
                        className="flex items-center space-x-2"
                      >
                        <input
                          type="checkbox"
                          checked={baseFilter.status.includes(item.value)}
                          onChange={() => handleCheckType(item.value, "status")}
                        />
                        <span>{item.value}</span>
                      </label>
                    ))}
                </div>
                <h4 className="mt-2 font-medium mb-1">Divisi</h4>
                <div className="checkbox-group space-y-1">
                  {listDivision?.data.result?.map((item) => (
                    <label
                      key={item.id}
                      className="flex items-center space-x-2"
                    >
                      <input
                        type="checkbox"
                        checked={baseFilter.division_id.includes(
                          item.id.toString()
                        )}
                        onChange={() => handleCheckDivision(item.id)}
                      />
                      <span>{item.name}</span>
                    </label>
                  ))}
                </div>
              </ul>
            </div>
          </div>
          <input
            type="date"
            className="input input-xs input-bordered rounded-full outline-none"
            value={baseFilter.date}
            onChange={(e) => updateBaseFilter("date", e.target.value)}
          />
        </div>
      </div>
      <div className="card h-fit w-full overflow-x-auto bg-base-100 p-5 shadow-xl">
        <table className="text-md table min-h-20">
          <thead>
            <tr className="text-center font-bold">
              {[
                "No",
                "Divisi",
                "Nama",
                "Tanggal",
                "Jam",
                "Tipe",
                "Status",
                "Keterangan",
                "Bukti Dinas",
              ].map((item) => (
                <th key={item} className={item == "Nama" ? "text-left" : ""}>
                  {item}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {employeeAttendance?.data.result.map((item, index) => (
              <tr className="hover" key={item.id}>
                {[
                  {
                    value: numberOfTable(
                      index,
                      params.page ?? 0,
                      params.limit,
                      1
                    ),
                  },
                  {
                    value: item.employee.division.name,
                    className: "text-left",
                  },
                  {
                    value: item.employee.full_name,
                  },
                  {
                    value: formattedDate(item.createdAt),
                  },
                  {
                    value: formattedTime(item.createdAt),
                  },
                  {
                    value: (
                      <div
                        className={`text-md badge badge-md h-fit rounded-md px-3 ${
                          worktimeType[
                            item.worktime.type.toLocaleLowerCase() as keyof typeof worktimeType
                          ]
                        }`}
                      >
                        {capitalize(item.worktime.type)}
                      </div>
                    ),
                  },
                  {
                    value: item.status,
                  },
                  {
                    value: (
                      <div
                        className={`text-md badge badge-md truncate rounded-md px-3 border-none ${attendanceStatus[item.status as keyof typeof attendanceStatus]}`}
                      >
                        {item.status}
                      </div>
                    ),
                  },
                  {
                    value: (
                      <button
                        className="btn btn-ghost"
                        onClick={() => handleOpenDetailModal(item)}
                      >
                        <TbFaceId className="text-xl" />
                      </button>
                    ),
                  },
                ].map(({ value, className }, index) => (
                  <td key={`${index}-row`} className={className}>
                    {value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {!employeeAttendance?.data.result.length && <NoData />}
      </div>

      <Pagination
        onChangeLimit={(value: number) =>
          setBaseFilter((prev) => ({ ...prev, limit: value }))
        }
        onChangePage={(value: number) =>
          setBaseFilter((prev) => ({ ...prev, page: value }))
        }
        limit={baseFilter.limit!}
        totalPages={totalPages}
        pageSize={6}
      />

      {selectedItem && (
        <DetailCard
          key={+new Date()}
          dataProps={selectedItem}
          onClose={handleDetailClose}
        />
      )}
    </div>
  );
};

export default DinasLuarPage;
