import React, { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Loading from "../component/Loading";
import DaftarPenilaianPage from "../page/guru/DaftarPenilaian";
import DetailRekapPenilaianPage from "../page/guru/DetailRekapPenilaian";
// import JobdeskGuruPage from "../page/guru/JobdeskGuru";
import RekapPenilaianPage from "../page/guru/RekapPenilaian";
import Test from "../page/guru/Test";
import DinasLuarPage from "../page/karyawan/DinasLuar";

const Home = lazy(() => import("../page/login"));
const Layout = lazy(() => import("../component/Layout"));
const LayoutTrainFace = lazy(() => import("../component/LayoutTrainFace"));
const Dashboard = lazy(() => import("../page/guru/Dashboard"));
const JadwalMengajar = lazy(() => import("../page/guru/jadwalMengajar"));
const JadwalDinas = lazy(() => import("../page/guru/jadwalDinas"));
const PengajuanCuti = lazy(() => import("../page/guru/pengajuanCuti"));
const AdmSiswa = lazy(() => import("../page/guru/admSiswa"));
const PresensiSiswa = lazy(() => import("../page/guru/presensiSiswa"));
const NilaiSiswa = lazy(() => import("../page/guru/nilaiSiswa"));
const BahanAjar = lazy(() => import("../page/guru/bahanAjar"));
const AgendaKegiatan = lazy(() => import("../page/guru/agendaKegiatan"));
const AdmGuru = lazy(() => import("../page/guru/admGuru"));
const PesanCs = lazy(() => import("../page/guru/pesanCs"));
const RaportSiswa = lazy(() => import("../page/guru/raportSiswa"));
const RaportNarasi = lazy(() => import("../page/guru/DetailRaportNarasi"));
const DetailTugasSswa = lazy(() => import("../page/guru/detailTugasSswa"));
const KalenderKegiatan = lazy(() => import("../page/guru/kalenderKegiatan"));
const OverviewSiswa = lazy(() => import("../page/guru/DashboardSiswa"));
const ODFYC = lazy(() => import("../page/guru/ODFYC"));
const PrestasiSiswa = lazy(() => import("../page/guru/prestasiSiswa"));
const OdfycPartisipants = lazy(() => import("../page/guru/OdfycParticipants"));
const TrainFaceGuru = lazy(() => import("../page/guru/FormTrainFaceGuru"));
const Jobdesk = lazy(() => import("../page/guru/Jobdesk"));
const Ke_Dashbaord = lazy(() => import("../page/keuangan/Dashboard"));
const Ke_DataSiswa = lazy(() => import("../page/keuangan/DataSiswa"));
const Ke_PosKeuangan = lazy(() => import("../page/keuangan/PosKeuangan"));
const Ke_JenisPembayaran = lazy(
  () => import("../page/keuangan/JenisPembayaran")
);
const Ke_DetailJenisPembayaran = lazy(
  () => import("../page/keuangan/DetailJenisPembayaran")
);
const Ke_DaftarTunggakan = lazy(
  () => import("../page/keuangan/DaftarTunggakan")
);
const Ke_Laporan = lazy(() => import("../page/keuangan/Laporan"));

// const AbsenKaryawan = lazy(() => import("../page/admin/AbsenKaryawan"));
const RekapPresensi = lazy(() => import("../page/hrd/Presensi"));
const PengajuanCutiHRD = lazy(() => import("../page/hrd/PengajuanCuti"));

const Profile = lazy(() => import("../page/profile"));

// karyawan
const DaftarCutiIzin = lazy(() => import("../page/karyawan/DaftarCutiIzin"));
const PelatihanKaryawan = lazy(() => import("../page/karyawan/pelatihan"));
const DaftarPelatihanKaryawan = lazy(
  () => import("../page/karyawan/pelatihan/Daftar")
);
const PengajuanPelatihanKaryawan = lazy(
  () => import("../page/karyawan/pelatihan/Pengajuan")
);
const RekapKehadiranKaryawan = lazy(
  () => import("../page/karyawan/RekapKehadiran")
);

const RootRoutes = () => {
  const routeData = [
    { path: "/", element: <Home />, isSuspended: true },
    { path: "/test", element: <Test />, isSuspended: false },
    {
      path: "/profile",
      element: <Profile />,
      layout: <Layout />,
      isSuspended: true,
    },
    {
      path: "/guru/dashboard",
      element: <Dashboard />,
      layout: <Layout />,
      isSuspended: true,
    },
    {
      path: "/guru/jadwal-guru",
      element: <JadwalMengajar />,
      layout: <Layout />,
      isSuspended: true,
    },
    {
      path: "/guru/train-face",
      element: <TrainFaceGuru />,
      layout: <LayoutTrainFace />,
      isSuspended: true,
    },
    {
      path: "/guru/jadwal-dinas",
      element: <JadwalDinas />,
      layout: <Layout />,
      isSuspended: true,
    },
    {
      path: "/guru/pengajuan-cuti",
      element: <PengajuanCuti />,
      layout: <Layout />,
      isSuspended: true,
    },
    {
      path: "/guru/adm-siswa",
      element: <AdmSiswa />,
      layout: <Layout />,
      isSuspended: true,
    },
    {
      path: "/guru/prestasi-siswa",
      element: <PrestasiSiswa />,
      layout: <Layout />,
      isSuspended: true,
    },
    {
      path: "/guru/presensi-siswa",
      element: <PresensiSiswa />,
      layout: <Layout />,
      isSuspended: true,
    },
    {
      path: "/guru/daftar-nilai-siswa",
      element: <NilaiSiswa />,
      layout: <Layout />,
      isSuspended: true,
    },
    {
      path: "/guru/bahan-ajar",
      element: <BahanAjar />,
      layout: <Layout />,
      isSuspended: true,
    },
    {
      path: "/guru/agenda-kegiatan",
      element: <AgendaKegiatan />,
      layout: <Layout />,
      isSuspended: true,
    },
    {
      path: "/guru/adm-guru",
      element: <AdmGuru />,
      layout: <Layout />,
      isSuspended: true,
    },
    {
      path: "/guru/kalender-kegiatan",
      element: <KalenderKegiatan />,
      layout: <Layout />,
      isSuspended: true,
    },
    {
      path: "/guru/task/siswa",
      element: <DetailTugasSswa />,
      layout: <Layout />,
      isSuspended: true,
    },
    {
      path: "/guru/rapor-siswa",
      element: <RaportSiswa />,
      layout: <Layout />,
      isSuspended: true,
    },
    {
      path: "/guru/rapor-siswa/narasi",
      element: <RaportNarasi />,
      layout: <Layout />,
      isSuspended: true,
    },
    {
      path: "/guru/cs",
      element: <PesanCs />,
      layout: <Layout />,
      isSuspended: true,
    },
    {
      path: "/guru/dashboard/siswa",
      element: <OverviewSiswa />,
      layout: <Layout />,
      isSuspended: true,
    },
    {
      path: "/guru/one-day",
      element: <ODFYC />,
      layout: <Layout />,
      isSuspended: true,
    },
    {
      path: "/guru/one-day-partisipan",
      element: <OdfycPartisipants />,
      layout: <Layout />,
      isSuspended: true,
    },
    {
      path: "/guru/daftar-penilaian",
      element: <DaftarPenilaianPage />,
      layout: <Layout />,
      isSuspended: true,
    },
    {
      path: "/guru/rekap-penilaian",
      element: <RekapPenilaianPage />,
      layout: <Layout />,
      isSuspended: true,
    },
    {
      path: "/guru/detail-rekap-penilaian",
      element: <DetailRekapPenilaianPage />,
      layout: <Layout />,
      isSuspended: true,
    },
    {
      path: "/guru/jobdesk",
      element: <Jobdesk />,
      layout: <Layout />,
      isSuspended: true,
    },
    {
      path: "/guru/dinas-luar",
      element: <DinasLuarPage />,
      layout: <Layout />,
      isSuspended: true,
    },
    {
      path: "/keuangan/",
      element: <Ke_Dashbaord />,
      layout: <Layout />,
      isSuspended: true,
    },
    {
      path: "/keuangan/data-siswa",
      element: <Ke_DataSiswa />,
      layout: <Layout />,
      isSuspended: true,
    },
    {
      path: "/keuangan/pos-pembayaran",
      element: <Ke_PosKeuangan />,
      layout: <Layout />,
      isSuspended: true,
    },
    {
      path: "/keuangan/jenis-pembayaran",
      element: <Ke_JenisPembayaran />,
      layout: <Layout />,
      isSuspended: true,
    },
    {
      path: "/keuangan/jenis-pembayaran/:id",
      element: <Ke_DetailJenisPembayaran />,
      layout: <Layout />,
      isSuspended: true,
    },
    {
      path: "/keuangan/daftar-tunggakan",
      element: <Ke_DaftarTunggakan />,
      layout: <Layout />,
      isSuspended: true,
    },
    {
      path: "/keuangan/Laporan",
      element: <Ke_Laporan />,
      layout: <Layout />,
      isSuspended: true,
    },
    {
      path: "/hrd/rekap-presensi",
      element: <RekapPresensi />,
      layout: <Layout />,
      isSuspended: true,
    },
    {
      path: "/hrd/pengajuan-cuti",
      element: <PengajuanCutiHRD />,
      layout: <Layout />,
      isSuspended: true,
    },
    {
      path: "/karyawan/daftar-cuti-izin",
      element: <DaftarCutiIzin />,
      layout: <Layout />,
      isSuspended: true,
    },
    {
      path: "/karyawan/rekap-kehadiran",
      element: <RekapKehadiranKaryawan />,
      layout: <Layout />,
      isSuspended: true,
    },
    {
      path: "/karyawan/daftar-pelatihan",
      element: <PelatihanKaryawan />,
      layout: <Layout />,
      isSuspended: true,
      children: [
        { path: "", element: <DaftarPelatihanKaryawan />, isSuspended: true },
        {
          path: "pengajuan",
          element: <PengajuanPelatihanKaryawan />,
          isSuspended: true,
        },
      ],
    },
  ];

  return (
    <BrowserRouter>
      <Routes>
        {routeData.map((route, index) => (
          <Route
            key={index}
            path={route.path}
            element={
              route.isSuspended ? (
                <Suspense fallback={<Loading />}>
                  {route.layout
                    ? React.cloneElement(route.layout, {}, route.element)
                    : route.element}
                </Suspense>
              ) : route.layout ? (
                React.cloneElement(route.layout, {}, route.element)
              ) : (
                route.element
              )
            }
          >
            {route.children &&
              route.children.map((child, cIndex) => (
                <Route
                  key={cIndex}
                  path={child.path}
                  element={
                    child.isSuspended ? (
                      <Suspense fallback={<Loading />}>
                        {child.element}
                      </Suspense>
                    ) : (
                      child.element
                    )
                  }
                />
              ))}
          </Route>
        ))}
      </Routes>
    </BrowserRouter>
  );
};

export default RootRoutes;
