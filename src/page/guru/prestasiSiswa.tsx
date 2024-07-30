import { useEffect, useState } from "react";
import {
  IpageMeta,
  PaginationControl,
} from "../../component/PaginationControl";
import { Input, Select } from "../../component/Input";
import { FaDownload, FaPlus, FaSearch, FaTrash } from "react-icons/fa";
import { Store } from "../../store/Store";
import { AchievementSiswa, Class } from "../../midleware/api";
import Swal from "sweetalert2";
import { formatTime } from "../../utils/date";
import { FaPencil } from "react-icons/fa6";

const PrestasiSiswa = () => {
  const { token } = Store();

  // filter
  const [search, setSearch] = useState("");
  const [pageMeta, setPageMeta] = useState<IpageMeta>({ page: 0, limit: 10 });
  const [filter, setFilter] = useState({
    classId: "",
    search: "",
    page: 0,
    limit: 0,
  });

  const handleFilter = (key: string, value: any) => {
    const obj = {
      ...filter,
      [key]: value,
    };
    if (key != "page") obj["page"] = 0;
    setFilter(obj);
  };

  const [classes, setClasses] = useState<any[]>([]);
  const getClasses = async () => {
    try {
      const res = await Class.showAll(token, 0, 0, "Y");
      setClasses(res.data.data.result);
    } catch {}
  };

  useEffect(() => {
    getClasses();
  }, []);

  // retrieve data
  const [dataList, setDataList] = useState<any[]>([]);
  const getDataList = async () => {
    try {
      const res = await AchievementSiswa.showAll(
        token,
        filter.search,
        filter.classId,
        filter.page,
        filter.limit,
        "Y"
      );

      const { result, ...meta } = res.data.data;

      setDataList(result);
      setPageMeta(meta);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Gagal Mengambil data prestasi siswa, silakan coba lain kali",
      });
    }
  };

  useEffect(() => {
    getDataList();
  }, [filter]);

  return (
    <div className="w-full flex justify-center flex-col items-center p-3">
      <span className="font-bold text-xl">PRESTASI SISWA</span>
      
      <div className="w-full p-3 bg-white rounded-lg">
        {/* filter  */}
        <div className="w-full flex flex-wrap justify-end my-3 gap-2">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleFilter("search", search);
            }}
            className="join"
          >
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari"
              slotRight={<FaSearch />}
            />
          </form>

          <div>
            <Select
              placeholder="Kelas"
              value={filter.classId}
              onChange={(e) => handleFilter("classId", e.target.value)}
              keyValue="id"
              displayBuilder={(opt) => `${opt.level}-${opt.class_name}`}
              options={classes}
            />
          </div>

          <button className="btn btn-secondary">
            <FaPlus />
            Tambah
          </button>
        </div>

        {/* table  */}
        <div className="overflow-x-auto">
          <table className="table table-zebra">
            <thead className="bg-blue-400">
              <tr>
                <th>No</th>
                <th>Siswa</th>
                <th>Deskripsi</th>
                <th>Tanggal Terbit</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {dataList.map((dat, i) => (
                <tr key={i}>
                  <th>{i + 1}</th>
                  <td>{dat.student.full_name ?? "-"}</td>
                  <td>{dat.achievement_desc ?? "-"}</td>
                  <td>
                    {dat.issued_at
                      ? formatTime(dat.issued_at, "DD MMMM YYYY")
                      : "-"}
                  </td>

                  <td>
                    <div className="join">
                      <button
                        className="btn btn-primary btn-sm join-item tooltip"
                        data-tip="Unduh sertifikat"
                      >
                        <FaDownload />
                      </button>
                      <button
                        className="btn btn-secondary btn-sm join-item  tooltip"
                        data-tip="Edit"
                      >
                        <FaPencil />
                      </button>
                      <button
                        className="btn btn-error btn-sm join-item text-white tooltip"
                        data-tip="Hapus"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* control  */}
        <PaginationControl
          meta={pageMeta}
          onPrevClick={() => handleFilter("page", pageMeta.page - 1)}
          onNextClick={() => handleFilter("page", pageMeta.page + 1)}
          onJumpPageClick={(val) => handleFilter("page", val)}
          onLimitChange={(val) => handleFilter("limit", val)}
        />
      </div>
    </div>
  );
};

export default PrestasiSiswa;
