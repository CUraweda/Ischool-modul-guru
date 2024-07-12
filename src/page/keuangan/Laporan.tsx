import { FaFileExcel, FaLongArrowAltRight } from "react-icons/fa";
import Modal, { openModal } from "../../component/modal";
import { Store } from "../../store/Store";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  Class,
  PosJenisPembayaran,
  Student,
  TagihanSiswa,
} from "../../midleware/api";
import moment from "moment";
import {
  IpageMeta,
  PaginationControl,
} from "../../component/PaginationControl";
import { Input, Select } from "../../component/Input";
import { getAcademicYears } from "../../utils/common";

const Laporan = () => {
  const { token } = Store(),
    modalFilterId = "filter-laporan";

  // filtering
  const [pageMeta, setPageMeta] = useState<IpageMeta>({ page: 0, limit: 10 });
  const [filter, setFilter] = useState({
    page: 0,
    limit: 10,
    academicYear: "",
    postId: "",
    classId: "",
    studentId: "",
    startPaid: "",
    endPaid: "",
    status: "",
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
      const res = await Class.showAll(token, 0, 1000);
      setClasses(res.data.data.result);
      handleFilter("studentId", "");
    } catch {}
  };

  const [students, setStudents] = useState<any[]>([]);
  const getStudents = async () => {
    try {
      const res = await Student.GetStudentByClass(
        token,
        parseInt(filter.classId),
        filter.academicYear
      );
      setStudents(res.data.data.map((dat: any) => dat.student));
    } catch {}
  };

  useEffect(() => {
    if (filter.classId) getStudents();
  }, [filter.classId, filter.academicYear]);

  const [paymentTypes, setPaymentTypes] = useState<any[]>([]);
  const getPaymentTypes = async () => {
    try {
      const res = await PosJenisPembayaran.showAll(token, "", 0, 1000);
      setPaymentTypes(res.data.data.result);
    } catch {}
  };

  useEffect(() => {
    getClasses();
    getPaymentTypes();
  }, []);

  // main
  const [dataList, setDataList] = useState<any[]>([]);

  const getDataList = async () => {
    try {
      const res = await TagihanSiswa.showAllReports(
        token,
        filter.postId,
        filter.classId,
        filter.studentId,
        filter.startPaid,
        filter.endPaid,
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
  }, []);

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
          <PaginationControl
            meta={pageMeta}
            onPrevClick={() => handleFilter("page", pageMeta.page - 1)}
            onNextClick={() => handleFilter("page", pageMeta.page + 1)}
            onJumpPageClick={(val) => handleFilter("page", val)}
            onLimitChange={(val) => handleFilter("limit", val)}
          />
        </div>
      </div>

      <Modal id={modalFilterId}>
        <div className="w-full flex justify-center flex-col items-center">
          <span className="text-xl font-bold ">Filter</span>

          <Select
            label="Tahun ajar"
            placeholder="Semua"
            options={getAcademicYears()}
            value={filter.academicYear}
            onChange={(e) => handleFilter("academicYear", e.target.value)}
          />

          <Select
            label="Kelas"
            placeholder="Semua"
            keyValue="id"
            keyDisplay="class_name"
            options={classes}
            value={filter.classId}
            onChange={(e) => handleFilter("classId", e.target.value)}
          />

          <Select
            label="Siswa"
            placeholder="Semua"
            keyValue="id"
            keyDisplay="full_name"
            disabled={!filter.classId}
            options={students}
            value={filter.studentId}
            onChange={(e) => handleFilter("studentId", e.target.value)}
          />

          <Select
            label="Pembayaran"
            placeholder="Semua"
            keyValue="id"
            keyDisplay="name"
            options={paymentTypes}
            value={filter.postId}
            onChange={(e) => handleFilter("postId", e.target.value)}
          />

          <Select
            label="Status"
            placeholder="Semua"
            options={["Lunas", "Belum Lunas"]}
            value={filter.status}
            onChange={(e) => handleFilter("status", e.target.value)}
          />

          <div className="flex  w-full items-end gap-3">
            <div className="grow">
              <Input
                label="Tanggal bayar"
                type="date"
                value={filter.startPaid}
                onChange={(e) => handleFilter("startPaid", e.target.value)}
              />
            </div>
            <FaLongArrowAltRight className="text-neutral-500 relative top-2 self-center" />
            <div className="grow">
              <Input
                label=""
                type="date"
                value={filter.endPaid}
                onChange={(e) => handleFilter("endPaid", e.target.value)}
              />
            </div>
          </div>

          <button className="btn btn-primary text-white w-full">
            Terapkan
          </button>
        </div>
      </Modal>
    </>
  );
};

export default Laporan;
