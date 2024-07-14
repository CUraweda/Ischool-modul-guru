import { FaFileExcel, FaLongArrowAltRight } from "react-icons/fa";
import Modal, { closeModal, openModal } from "../../component/modal";
import { Store } from "../../store/Store";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  Class,
  PosJenisPembayaran,
  Student,
  TagihanSiswa,
} from "../../midleware/api";
import {
  IpageMeta,
  PaginationControl,
} from "../../component/PaginationControl";
import { Input, Select } from "../../component/Input";
import { getAcademicYears } from "../../utils/common";
import { formatTime } from "../../utils/date";

const Laporan = () => {
  const { token } = Store(),
    modalFilterId = "filter-laporan";

  // filtering
  const [pageMeta, setPageMeta] = useState<IpageMeta>({ page: 0, limit: 10 });
  const [filter, setFilter] = useState({
    page: 0,
    limit: 10,
    paymentCatId: "",
    classId: "",
    studentId: "",
    startPaid: "",
    endPaid: "",
    status: "",
  });
  const [filterInForm, setFilterInForm] = useState({
    academicYear: "",
    paymentCatId: "",
    classId: "",
    studentId: "",
    startPaid: "",
    endPaid: "",
    status: "",
  });

  const applyFilterInForm = () => {
    setFilter({
      ...filter,
      ...filterInForm,
      page: 0,
    });
  };

  const resetFilterInForm = () => {
    setFilterInForm({
      academicYear: "",
      paymentCatId: "",
      classId: "",
      studentId: "",
      startPaid: "",
      endPaid: "",
      status: "",
    });
  };

  const handleFilterInForm = (key: string, value: any) => {
    setFilterInForm({
      ...filterInForm,
      [key]: value,
    });
  };

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
      handleFilterInForm("studentId", "");
    } catch {}
  };

  const [students, setStudents] = useState<any[]>([]);
  const getStudents = async () => {
    try {
      const res = await Student.GetStudentByClass(
        token,
        parseInt(filterInForm.classId),
        filterInForm.academicYear
      );
      setStudents(res.data.data.map((dat: any) => dat.student));
    } catch {}
  };

  useEffect(() => {
    if (filterInForm.classId) getStudents();
  }, [filterInForm.classId, filterInForm.academicYear]);

  const [paymentCats, setPaymentCats] = useState<any[]>([]);
  const getPaymentCats = async () => {
    try {
      const res = await PosJenisPembayaran.showAll(token, "", 0, 1000);
      setPaymentCats(res.data.data.result);
    } catch {}
  };

  useEffect(() => {
    getClasses();
    getPaymentCats();
  }, []);

  // main
  const [dataList, setDataList] = useState<any[]>([]);

  const getDataList = async () => {
    try {
      const res = await TagihanSiswa.showAllReports(
        token,
        filter.paymentCatId,
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
        text: "Gagal mengambil data laporan, silakan refresh halaman!",
      });
    }
  };

  useEffect(() => {
    getDataList();
  }, [filter]);

  const handleExport = async () => {
    try {
      const res = await TagihanSiswa.exportReports(
        token,
        filter.paymentCatId,
        filter.classId,
        filter.studentId,
        filter.startPaid,
        filter.endPaid,
        filter.status
      );
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");

      link.href = url;
      link.setAttribute("download", "Laporan Pembayaran Siswa.xlsx");
      document.body.appendChild(link);

      link.click();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Gagal mengekspor data laporan",
      });
    }
  };

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
            <button
              onClick={handleExport}
              className="btn bg-[#1d6f42] text-white"
            >
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
                        ? formatTime(dat.paidoff_at, "DD MMMM YYYY HH:mm")
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
        <form
          onSubmit={(e) => {
            e.preventDefault();
            applyFilterInForm();
            closeModal(modalFilterId);
          }}
          className="w-full flex justify-center flex-col items-center"
        >
          <span className="text-xl font-bold ">Filter</span>

          <Select
            label="Tahun ajar"
            placeholder="Semua"
            options={getAcademicYears()}
            value={filterInForm.academicYear}
            onChange={(e) => handleFilterInForm("academicYear", e.target.value)}
          />

          <Select
            label="Kelas"
            placeholder="Semua"
            keyValue="id"
            keyDisplay="class_name"
            options={classes}
            value={filterInForm.classId}
            onChange={(e) => handleFilterInForm("classId", e.target.value)}
          />

          <Select
            label="Siswa"
            placeholder="Semua"
            keyValue="id"
            keyDisplay="full_name"
            disabled={!filterInForm.classId}
            options={students}
            value={filterInForm.studentId}
            onChange={(e) => handleFilterInForm("studentId", e.target.value)}
          />

          <Select
            label="Pembayaran"
            placeholder="Semua"
            keyValue="id"
            keyDisplay="name"
            options={paymentCats}
            value={filterInForm.paymentCatId}
            onChange={(e) => handleFilterInForm("paymentCatId", e.target.value)}
          />

          <Select
            label="Status"
            placeholder="Semua"
            options={["Lunas", "Belum Lunas"]}
            value={filterInForm.status}
            onChange={(e) => handleFilterInForm("status", e.target.value)}
          />

          <div className="flex  w-full items-end gap-3">
            <div className="grow">
              <Input
                label="Tanggal bayar"
                type="date"
                value={filterInForm.startPaid}
                onChange={(e) =>
                  handleFilterInForm("startPaid", e.target.value)
                }
              />
            </div>
            <FaLongArrowAltRight className="text-neutral-500 relative top-2 self-center" />
            <div className="grow">
              <Input
                label=""
                type="date"
                value={filterInForm.endPaid}
                onChange={(e) => handleFilterInForm("endPaid", e.target.value)}
              />
            </div>
          </div>

          <div className="modal-action w-full">
            <button
              type="reset"
              onClick={resetFilterInForm}
              className="btn grow"
            >
              Atur ulang
            </button>
            <button type="submit" className="btn btn-primary grow">
              Terapkan
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default Laporan;
