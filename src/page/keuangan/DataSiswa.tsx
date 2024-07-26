// import React from "react";
import { useEffect, useState } from "react";
import { FaFileAlt, FaLock, FaLockOpen, FaSearch } from "react-icons/fa";
import { Class, Raport, Student, TagihanSiswa } from "../../midleware/api";
import { Store } from "../../store/Store";
import Swal from "sweetalert2";
import ilusNoData from "../../assets/ilus/no-data.svg";
import { getAcademicYears, getCurrentAcademicYear } from "../../utils/common";
import { FaMoneyBill1Wave } from "react-icons/fa6";
import Modal, { openModal } from "../../component/modal";
import {
  IpageMeta,
  PaginationControl,
} from "../../component/PaginationControl";
import { formatTime } from "../../utils/date";
import { Input, Select } from "../../component/Input";

const getReport = (arr: any[], semester: any) => {
  const filt = arr.filter((ar) => ar.semester == semester);
  return filt.length ? filt[0] : null;
};

const DataSiswa = () => {
  const { token } = Store(),
    modalDetailPembayaranId = "modal-detail-pembayaran";

  // page states
  const [classes, setClasses] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [pageMeta, setPageMeta] = useState<IpageMeta>({ page: 0, limit: 10 });
  const [filter, setFilter] = useState({
    search: "",
    classId: "",
    academicYear: getCurrentAcademicYear(),
    page: 0,
    limit: 10,
  });

  // UI states
  const [search, setSearch] = useState<string>("");

  const handleFilter = (key: string, value: any) => {
    const obj = {
      ...filter,
      [key]: value,
    };
    if (key != "page") obj["page"] = 0;
    setFilter(obj);
  };

  const getStudents = async () => {
    try {
      const res = await Student.GetStudents(
        token,
        filter.search,
        filter.classId,
        filter.academicYear,
        filter.page,
        filter.limit
      );

      const { result, ...meta } = res.data.data;

      setStudents(result);
      setPageMeta(meta);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Gagal Mengambil data siswa, silakan refresh halaman!",
      });
    }
  };

  const getClasses = async () => {
    try {
      const res = await Class.showAll(token, 0, 1000);
      setClasses(res.data.data.result);
    } catch {}
  };

  const updateReportLockStatus = async (id: string, state: boolean) => {
    try {
      await Raport.updateStudentReportAccess(token, id);
      getStudents();

      Swal.fire({
        icon: "success",
        title: "Sukses",
        text: `Sukses ${state ? "membuka kunci" : "mengunci"} rapot`,
        showConfirmButton: false,
      });
    } catch {
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: `Gagal ${state ? "membuka kunci" : "mengunci"} rapot`,
        showConfirmButton: false,
      });
    }
  };

  // entry point
  useEffect(() => {
    getStudents();
    getClasses();
  }, [filter]);

  const [studentInModal, setStudentInModal] = useState<any>(null);
  const [studentPayments, setStudentPayments] = useState<any[]>([]);
  const [loadingStudentPaymentList, setLoadingStudentPaymentList] =
    useState(false);

  const getStudentPaymentList = async () => {
    setLoadingStudentPaymentList(true);
    setStudentPayments([]);

    try {
      const res = await TagihanSiswa.showByStudentId(token, studentInModal?.id);
      setStudentPayments(res.data.data);
      openModal(modalDetailPembayaranId);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `Gagal mendapatkan detail pembayaran ${studentInModal.student.full_name}`,
        showConfirmButton: false,
      });
      setStudentInModal(null);
    } finally {
      setLoadingStudentPaymentList(false);
    }
  };

  useEffect(() => {
    if (studentInModal) getStudentPaymentList();
  }, [studentInModal]);

  return (
    <>
      <Modal
        id={modalDetailPembayaranId}
        onClose={() => setStudentInModal(null)}
        width="w-11/12 max-w-2xl"
      >
        <h3 className="text-xl font-bold mb-6">Daftar Pembayaran</h3>

        {studentPayments.length ? (
          studentPayments.map((dat, i) => (
            <>
              <div key={i} className="flex items-center justify-between">
                <div>
                  <p className="text-lg">{dat.studentpaymentbill.name}</p>
                  <p className="text-sm text-gray-500">
                    {`${dat.studentpaymentbill?.paymentpost?.name ?? "-"} • ${dat.studentpaymentbill?.paymentpost?.billing_cycle ?? "-"} • ${dat.studentpaymentbill?.academic_year ?? "-"}`}
                  </p>
                </div>
                <div>
                  <p
                    className={
                      "font-extrabold text-end " +
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
                  <p className="text-sm text-gray-500 text-end">
                    {dat.status.toLowerCase() == "lunas"
                      ? `Lunas pada ${
                          dat.paidoff_at
                            ? formatTime(dat.paidoff_at, "DD MMMM YYYY HH:mm")
                            : "-"
                        }`
                      : `Jatuh tempo pada ${
                          dat.studentpaymentbill?.due_date
                            ? formatTime(
                                dat.studentpaymentbill.due_date,
                                "DD MMMM YYYY"
                              )
                            : "-"
                        }`}
                  </p>
                </div>
              </div>
              <div className="divider my-3"></div>
            </>
          ))
        ) : (
          <div className="w-full max-w-52 mx-auto my-12">
            <img src={ilusNoData} alt="" className="max-w-32 mx-auto mb-3" />
            <h4 className="text-center text-lg">
              Siswa belum memiliki pembayaran
            </h4>
          </div>
        )}

        <form
          className="modal-action items-center justify-between"
          method="dialog"
        >
          <p className="text-xs text-gray-500 max-w-96">
            Masih ada yang belum lunas? Konfirmasi pembayaran pada laman Jenis
            Pembayaran {">"} Action Detail {">"} cari{" "}
            {`"${studentInModal?.student?.full_name ?? ""}"`}{" "}
          </p>
          <button className="btn btn-outline btn-primary">Tutup</button>
        </form>
      </Modal>

      <div className="w-full flex justify-center flex-col items-center p-3">
        <span className="font-bold text-xl">DATA SISWA</span>
        <div className="w-full p-3 bg-white rounded-lg">
          <div className="w-full gap-3 flex flex-wrap justify-end my-3">
            <div>
              <Select
                placeholder="Pilih kelas"
                value={filter.classId}
                onChange={(e) => handleFilter("classId", e.target.value)}
                options={classes}
                keyValue="id"
                keyDisplay="class_name"
              />
            </div>
            <div>
              <Select
                value={filter.academicYear}
                onChange={(e) => handleFilter("academicYear", e.target.value)}
                options={getAcademicYears()}
              />
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleFilter("search", search);
              }}
            >
              <Input
                placeholder="Cari siswa"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                slotRight={<FaSearch />}
              />
            </form>
          </div>
          <div className="overflow-x-auto">
            <table className="table table-zebra">
              {/* head */}
              <thead className="bg-blue-400">
                <tr>
                  <th>No</th>
                  <th>Name</th>
                  <th>NIS</th>
                  <th>Kelas</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {students.map((dat, i) => (
                  <tr key={i}>
                    <th>{i + 1}</th>
                    <td>{dat.student?.full_name ?? "-"}</td>
                    <td>{dat.student?.nis ?? "-"}</td>
                    <td>{dat.class?.class_name ?? "-"}</td>
                    <td>
                      <div className="join">
                        <button
                          className="btn btn-ghost btn-sm join-item bg-blue-500 text-white tooltip"
                          data-tip="Detail Pembayaran"
                          disabled={loadingStudentPaymentList}
                          onClick={() => setStudentInModal(dat)}
                        >
                          <FaMoneyBill1Wave />
                        </button>

                        <div className="dropdown dropdown-left dropdown-end">
                          <button
                            className="btn btn-ghost btn-sm join-item bg-cyan-500 text-white tooltip"
                            data-tip="Kelola Rapot"
                          >
                            <FaFileAlt />
                          </button>
                          <ul
                            tabIndex={0}
                            className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
                          >
                            {[1, 2].map((smt) => {
                              const report = getReport(dat.studentreports, smt);
                              return (
                                // <li>
                                // 	<button
                                <div className="form-control">
                                  <label
                                    onClick={() => {
                                      updateReportLockStatus(
                                        report.id,
                                        !report.student_access
                                      );
                                    }}
                                    className={
                                      "flex justify-between label !font-bold items-center " +
                                      (!report
                                        ? "text-gray-400 !cursor-not-allowed"
                                        : "")
                                    }
                                  >
                                    Semester {smt}
                                    {report ? (
                                      <div
                                        className="tooltip"
                                        data-tip={
                                          report.student_access
                                            ? "Kunci rapot"
                                            : "Buka kunci rapot"
                                        }
                                      >
                                        <button className="btn btn-square btn-sm">
                                          {report.student_access ? (
                                            <FaLockOpen className="swap-on text-success text-lg" />
                                          ) : (
                                            <FaLock className="swap-off text-error text-lg" />
                                          )}
                                        </button>
                                      </div>
                                    ) : (
                                      ""
                                    )}
                                  </label>
                                </div>
                                // 	</button>
                                // </li>
                              );
                            })}
                          </ul>
                        </div>
                      </div>
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

export default DataSiswa;
