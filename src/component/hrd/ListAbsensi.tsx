import React, { useEffect, useState } from "react";
import { TbTextSize } from "react-icons/tb";
// import Select from "react-select";

interface AbsensiData {
  id: number;
  data: {
    nama: string;
    status: string;
    divisi: string;
    tanggal: string;
    pukul: string;
    tipe: string;
    keterangan: string;
  };
}

type AbsensiList = AbsensiData[];

interface ListAbsensiProps {
  data: AbsensiList;
  searchQuery: string;
}

const ListAbsensi: React.FC<ListAbsensiProps> = ({ data, searchQuery }) => {
  const [filterDate, setFilterDate] = useState<string>("");
  const [selectedFilters, setSelectedFilters] = useState<any[]>([]);
  const filteredData = data.filter(
    (item) =>
      (item.data.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.data.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.data.divisi.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (filterDate === "" || item.data.tanggal === filterDate) &&
      (selectedFilters.length === 0 ||
        selectedFilters.some(
          (filter) =>
            item.data.status === filter.value || item.data.tipe === filter.value
        ))
  );

  const [currentDate, setCurrentDate] = useState<string>("");
  const [currentClock, setClock] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 7;

  useEffect(() => {
    const updateDateTime = () => {
      const date = new Date();
      const formattedDate = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      const formattedClock = date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

      setCurrentDate(formattedDate);
      setClock(formattedClock);
    };

    updateDateTime();
    const intervalId = setInterval(updateDateTime, 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterDate, selectedFilters]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredData.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  const filterOptions = [
    { value: "Masuk", label: "Masuk" },
    { value: "Keluar", label: "Keluar" },
    { value: "Tepat Waktu", label: "Tepat Waktu" },
    { value: "Terlambat", label: "Terlambat" },
  ];

  const handleFilterChange = (selectedOptions: any) => {
    setSelectedFilters(selectedOptions || []);
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const customStyles = {
    control: (provided: any) => ({
      ...provided,
      borderRadius: "9999px",
      height: "1rem",
      borderColor: "#d1d5db",
      fontSize: "0.875rem",
      "&:hover": {
        borderColor: "#9ca3af",
      },
    }),
    multiValue: (provided: any) => ({
      ...provided,
      backgroundColor: "#e5e7eb",
      borderRadius: "9999px",
    }),
    multiValueLabel: (provided: any) => ({
      ...provided,
      color: "#1f2937",
    }),
    multiValueRemove: (provided: any) => ({
      ...provided,
      color: "#6b7280",
      "&:hover": {
        backgroundColor: "#d1d5db",
        color: "#1f2937",
      },
    }),
  };
  return (
    <div className="w-full">
      <div className="flex-grow border-t border-gray-400 drop-shadow-sm my-5"></div>
      <div className="flex w-full justify-between">
        <div className="badge badge-md rounded-badge h-fit my-5 drop-shadow-sm bg-[#ffffffc2] text-md">
          Semua
          <div className="pl-5">{filteredData.length}</div>
        </div>
        <div className="my-auto flex gap-4">
          <label className="input input-bordered input-sm text-md  rounded-full flex items-center gap-2 w-fit my-auto">
            <input
              type="date"
              className="grow"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              placeholder="Search"
            />
          </label>
          {/* <Select
            isMulti
            options={filterOptions}
            className="basic-multi-select"
            classNamePrefix="select"
            styles={customStyles}
            onChange={handleFilterChange}
          /> */}
        </div>
      </div>
      <div className="overflow-x-auto card h-fit min-h-[55vh] w-full bg-base-100 shadow-xl p-5">
        <table className="table text-md">
          <thead>
            <tr>
              <th>No</th>
              <th>Tanggal</th>
              <th>Pukul</th>
              <th>Nama</th>
              <th>Divisi</th>
              <th>Status</th>
              <th>Keterangan</th>
              <th>Tipe</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item, index) => (
              <tr className="hover" key={item.id}>
                <td>{indexOfFirstItem + index + 1}</td>
                <td>{item.data.tanggal}</td>
                <td>{currentClock}</td>
                <td>{item.data.nama}</td>
                <td>{item.data.divisi}</td>
                <td>
                  <div
                    className={`badge badge-md rounded-md px-3 h-fit drop-shadow-sm text-md my-2 ${
                      item.data.status === "Tepat Waktu"
                        ? "text-[#3d6b2e] bg-[#8ef96ac2]"
                        : item.data.status === "Terlambat"
                          ? "text-[#6b2e2e] bg-[#f96a6a]"
                          : ""
                    }`}
                  >
                    {item.data.status}
                  </div>
                </td>
                <td>{item.data.keterangan}</td>
                <td>
                  <div
                    className={`badge badge-md rounded-md px-3 h-fit drop-shadow-sm text-md ${
                      item.data.tipe === "Masuk"
                        ? "text-[#3d6b2e] bg-[#8ef96ac2]"
                        : item.data.tipe === "Keluar"
                          ? "text-[#6b2e2e] bg-[#f96a6a]"
                          : ""
                    }`}
                  >
                    {item.data.tipe}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center items-center h-fit">
        <div className="join text-sm w-full max-w-fit my-8 mx-auto">
          {pageNumbers.map((number) => (
            <button
              key={number}
              onClick={() => handlePageChange(number)}
              className={`join-item btn ${
                currentPage === number ? "btn-active" : ""
              }`}
            >
              {number}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ListAbsensi;
