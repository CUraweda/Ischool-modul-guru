import { useEffect, useState } from "react";
import { FaFileExcel, FaLongArrowAltRight } from "react-icons/fa";
import Swal from "sweetalert2";
import { Input, Select } from "../../component/Input";
import Modal, { closeModal, openModal } from "../../component/modal";
import {
  IpageMeta,
  PaginationControl,
} from "../../component/PaginationControl";
import {
  Class,
  PosJenisPembayaran,
  PosPembayaran,
  Student,
  TagihanSiswa,
} from "../../middleware/api";
import { getAcademicYears, moneyFormat, toRupiah } from "../../utils/common";
import { formatTime } from "../../utils/date";

const Laporan = () => {
  const modalFilterId = "filter-laporan";

  // filtering
  const [pageMeta, setPageMeta] = useState<IpageMeta>({ page: 0, limit: 10 });
  const [postPayments, setPostPayments] = useState<any[]>([]);
  const [grandTotals, setGrandTotals] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [paymentCats, setPaymentCats] = useState<any[]>([]);
  const [dataList, setDataList] = useState<any[]>([]);

  
  const [filter, setFilter] = useState({
    page: 0,
    limit: 10,
    paymentCatId: "",
    classId: "",
    studentId: "",
    startPaid: "",
    endPaid: "",
    status: "",
    nisPrefix: "",
    pos: "",
  });

  const [filterInForm, setFilterInForm] = useState({
    academicYear: "",
    paymentCatId: "",
    classId: "",
    studentId: "",
    startPaid: "",
    endPaid: "",
    status: "",
    nisPrefix: "",
    pos: "",
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
      nisPrefix: "",
      pos: "",
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

  const getClasses = async () => {
    try {
      const res = await Class.showAll(0, 1000);
      setClasses(res.data.data.result);
      handleFilterInForm("studentId", "");
    } catch {}
  };

  const getPostPayments = async () => {
    try {
      const res = await PosPembayaran.showAll("", 0, 1000);
      if (res.data?.data?.result) setPostPayments(res.data.data.result);
    } catch {}
  };

  const getStudents = async () => {
    try {
      const res = await Student.GetStudentByClass(
        filterInForm.classId,
        filterInForm.academicYear
      );
      setStudents(res.data.data.map((dat: any) => dat.student));
     
    } catch {}
  };

  const getPaymentCats = async () => {
    try {
      const res = await PosJenisPembayaran.showAll("", filterInForm.pos, "", 0, 1000);
      setPaymentCats(res.data.data.result);
     
    } catch {}
  };

  const getDataList = async () => {
    try {
      const res = await TagihanSiswa.showAllReports(
        filter.paymentCatId,
        filter.classId,
        filter.studentId,
        filter.startPaid,
        filter.endPaid,
        filter.status,
        filter.nisPrefix,
        filter.page,
        filter.limit,
        filter.pos
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

  const getGrandTotals = async () => {
    try {
      const res = await TagihanSiswa.grandTotalByStatus({
        payment_category_id: filter.paymentCatId,
        class_id: filter.classId,
        student_id: filter.studentId,
        start_paid: filter.startPaid,
        end_paid: filter.endPaid,
        status: filter.status,
        nis_prefix: filter.nisPrefix,
        pos: filter.pos,
      });
      setGrandTotals(res.data.data ?? []);
    } catch {}
  };

  const handleExport = async () => {
    try {
      const res = await TagihanSiswa.exportReports(
        filter.paymentCatId,
        filter.classId,
        filter.studentId,
        filter.startPaid,
        filter.endPaid,
        filter.status,
        filter.nisPrefix,
        filter.pos
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


  useEffect(() => {
    if (filterInForm.classId) getStudents();
    if (filterInForm.pos) {
      getPaymentCats();
    }
  }, [filterInForm.classId, filterInForm.academicYear, filterInForm.pos]);

  useEffect(() => {
    getDataList();
    getGrandTotals();
  }, [filter]);


  useEffect(() => {
    getClasses();

    getPostPayments();
  }, []);

  return (
    <>
      <div className="w-full flex justify-center flex-col items-center p-3">
        <span className="font-bold text-xl">LAPORAN</span>
        <div className="flex mb-3 gap-2 w-full">
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

        {grandTotals.length > 0 && (
          <div className="flex mb-3 flex-wrap gap-2 w-full">
            {grandTotals.map((gt, i) => (
              <div key={i} className="stat w-fit bg-base-100 rounded-lg border">
                <div className="stat-title">{gt.status ?? "-"}</div>
                <div className="stat-value overflow-hidden text-ellipsis">
                  {moneyFormat(gt.total ?? 0)}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="w-full p-3 bg-white rounded-lg">
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
                  <th>Total</th>
                  <th>Tanggal Bayar</th>
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
                    <td>{toRupiah(dat.studentpaymentbill?.total ?? 0)}</td>
                    <td className="whitespace-nowrap">
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

          <Input
            label="Angkatan"
            placeholder="ex: 1617, 2324"
            maxLength={4}
            hint="Dicocokan berdasarkan awalan NIS, panjang minimal 4 karakter"
            value={filterInForm.nisPrefix}
            onChange={(e) => handleFilterInForm("nisPrefix", e.target.value)}
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
            label="POS Pembayaran"
            placeholder="Semua"
            keyValue="id"
            keyDisplay="name"
            options={postPayments}
            value={filterInForm.pos}
            onChange={(e) => handleFilterInForm("pos", e.target.value)}
          />

          <Select
            label="Pembayaran"
            placeholder="Semua"
            keyValue="id"
            keyDisplay="name"
            disabled={!filterInForm.pos}
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
