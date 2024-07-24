// import React from 'react'
import { FaFileExcel, FaSearch } from "react-icons/fa";
import { Store } from "../../store/Store";
import { useEffect, useState } from "react";
import { Class, TagihanSiswa } from "../../midleware/api";
import { Input, Select } from "../../component/Input";
import Swal from "sweetalert2";
import {
  IpageMeta,
  PaginationControl,
} from "../../component/PaginationControl";
import { formatTime } from "../../utils/date";

const DaftarTunggakan = () => {
  const { token } = Store();

  // FILTERING
  const [classes, setClasses] = useState<any[]>([]);
  const [search, setSearch] = useState<string>("");
  const [pageMeta, setPageMeta] = useState<IpageMeta>({ page: 0, limit: 10 });
  const [filter, setFilter] = useState({
    page: 0,
    limit: 10,
    search: "",
    classId: "",
  });

  const getClasses = async () => {
    try {
      const res = await Class.showAll(token, 0, 1000);
      setClasses(res.data.data.result);
    } catch {}
  };

  const handleFilter = (key: string, value: any) => {
    const obj = {
      ...filter,
      [key]: value,
    };
    if (key != "page") obj["page"] = 0;
    setFilter(obj);
  };

  useEffect(() => {
    getClasses();
  }, []);

  // MAIN BUSINESS
  const [dataList, setDataList] = useState<any[]>([]);

  const getDataList = async () => {
    try {
      const res = await TagihanSiswa.showAllArrears(
        token,
        filter.search,
        filter.classId,
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
        text: "Gagal Mengambil data tunggakan, silakan refresh halaman!",
      });
    }
  };

  useEffect(() => {
    getDataList();
  }, [filter]);

  const handleExport = async () => {
    try {
      const res = await TagihanSiswa.exportArrears(
        token,
        filter.search,
        filter.classId
      );
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");

      link.href = url;
      link.setAttribute("download", "Daftar Tunggakan Siswa.xlsx");
      document.body.appendChild(link);

      link.click();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Gagal mengekspor data tunggakan",
      });
    }
  };

  return (
    <>
      <div className="w-full flex justify-center flex-col items-center p-3">
        <span className="font-bold text-xl">DAFTAR TUNGGAKAN</span>
        <div className="w-full p-3 bg-white rounded-lg">
          <div className="w-full flex justify-end flex-wrap my-3 gap-2">
            {/* search  */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleFilter("search", search);
              }}
            >
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari siswa"
                slotRight={<FaSearch />}
              />
            </form>

            {/* filter class  */}
            <div>
              <Select
                placeholder="Pilih kelas"
                options={classes}
                keyValue="id"
                keyDisplay="class_name"
                onChange={(e) => handleFilter("classId", e.target.value)}
              />
            </div>

            {/* export action  */}
            <button
              onClick={handleExport}
              className="btn bg-[#1d6f42] text-white"
            >
              <FaFileExcel size={18} />
              Export
            </button>
          </div>

          {/* data list  */}
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
                  <th>Jatuh Tempo</th>
                </tr>
              </thead>
              <tbody>
                {dataList.map((dat, i) => (
                  <tr key={i}>
                    <th>{i + 1}</th>
                    <td>
                      <p className="line-clamp-2">
                        {dat.student?.full_name ?? ""}
                      </p>
                    </td>
                    <td>{dat.student?.nis ?? ""}</td>
                    <td>{dat.studentpaymentbill?.name ?? ""}</td>
                    <td>
                      <p
                        className={
                          "font-extrabold whitespace-nowrap " +
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
                    <td className="whitespace-nowrap">
                      {dat.studentpaymentbill?.due_date
                        ? formatTime(
                            dat.studentpaymentbill.due_date,
                            "DD MMMM YYYY"
                          )
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <PaginationControl
            meta={pageMeta}
            onPrevClick={() => handleFilter("page", pageMeta.page - 1)}
            onNextClick={() => handleFilter("page", pageMeta.page + 1)}
            onJumpPageClick={(val) => handleFilter("page", val)}
            onLimitChange={(val) => handleFilter("limit", val)}
          />
        </div>
      </div>
    </>
  );
};

export default DaftarTunggakan;
