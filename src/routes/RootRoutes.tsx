import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Loading from "../component/Loading";
import Test from "../page/guru/Test";

const Home = lazy(() => import("../page/login"));
const Layout = lazy(() => import("../component/Layout"));
const Dashboard = lazy(() => import("../page/guru/Dashboard"));
const JadwalMengajar = lazy(() => import("../page/guru/jadwalMengajar"));
const JadwalDinas = lazy(() => import("../page/guru/jadwalDinas"));
const RekapKehadiran = lazy(() => import("../page/guru/rekapKehadiran"));
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

const AbsenKaryawan = lazy(() => import("../page/admin/AbsenKaryawan"));
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

const RootRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Suspense fallback={<Loading />}>
              <Home />
            </Suspense>
          }
        />
        <Route path="/test" element={<Test />} />
        <Route
          path="/profile"
          element={
            <Suspense fallback={<Loading />}>
              <Layout>
                <Profile />
              </Layout>
            </Suspense>
          }
        />
        <Route
          path="/guru/dashboard"
          element={
            <Suspense fallback={<Loading />}>
              <Layout>
                <Dashboard />
              </Layout>
            </Suspense>
          }
        />

        <Route
          path="/guru/jadwal-guru"
          element={
            <Suspense fallback={<Loading />}>
              <Layout>
                <JadwalMengajar />
              </Layout>
            </Suspense>
          }
        />
        <Route
          path="/guru/jadwal-dinas"
          element={
            <Suspense fallback={<Loading />}>
              <Layout>
                <JadwalDinas />
              </Layout>
            </Suspense>
          }
        />
        <Route
          path="/guru/rekap-kehadiran"
          element={
            <Suspense fallback={<Loading />}>
              <Layout>
                <RekapKehadiran />
              </Layout>
            </Suspense>
          }
        />
        <Route
          path="/guru/pengajuan-cuti"
          element={
            <Suspense fallback={<Loading />}>
              <Layout>
                <PengajuanCuti />
              </Layout>
            </Suspense>
          }
        />
        <Route
          path="/guru/adm-siswa"
          element={
            <Suspense fallback={<Loading />}>
              <Layout>
                <AdmSiswa />
              </Layout>
            </Suspense>
          }
        />
        <Route
          path="/guru/prestasi-siswa"
          element={
            <Suspense fallback={<Loading />}>
              <Layout>
                <PrestasiSiswa />
              </Layout>
            </Suspense>
          }
        />
        <Route
          path="/guru/presensi-siswa"
          element={
            <Suspense fallback={<Loading />}>
              <Layout>
                <PresensiSiswa />
              </Layout>
            </Suspense>
          }
        />
        <Route
          path="/guru/daftar-nilai-siswa"
          element={
            <Suspense fallback={<Loading />}>
              <Layout>
                <NilaiSiswa />
              </Layout>
            </Suspense>
          }
        />
        <Route
          path="/guru/bahan-ajar"
          element={
            <Suspense fallback={<Loading />}>
              <Layout>
                <BahanAjar />
              </Layout>
            </Suspense>
          }
        />
        <Route
          path="/guru/agenda-kegiatan"
          element={
            <Suspense fallback={<Loading />}>
              <Layout>
                <AgendaKegiatan />
              </Layout>
            </Suspense>
          }
        />
        <Route
          path="/guru/adm-guru"
          element={
            <Suspense fallback={<Loading />}>
              <Layout>
                <AdmGuru />
              </Layout>
            </Suspense>
          }
        />
        <Route
          path="/guru/kalender-kegiatan"
          element={
            <Suspense fallback={<Loading />}>
              <Layout>
                <KalenderKegiatan />
              </Layout>
            </Suspense>
          }
        />
        <Route
          path="/guru/task/siswa"
          element={
            <Suspense fallback={<Loading />}>
              <Layout>
                <DetailTugasSswa />
              </Layout>
            </Suspense>
          }
        />
        <Route
          path="/guru/rapor-siswa"
          element={
            <Suspense fallback={<Loading />}>
              <Layout>
                <RaportSiswa />
              </Layout>
            </Suspense>
          }
        />
        <Route
          path="/guru/rapor-siswa/narasi"
          element={
            <Suspense fallback={<Loading />}>
              <Layout>
                <RaportNarasi />
              </Layout>
            </Suspense>
          }
        />
        <Route
          path="/guru/cs"
          element={
            <Suspense fallback={<Loading />}>
              <Layout>
                <PesanCs />
              </Layout>
            </Suspense>
          }
        />
        <Route
          path="/guru/dashboard/siswa"
          element={
            <Suspense fallback={<Loading />}>
              <Layout>
                <OverviewSiswa />
              </Layout>
            </Suspense>
          }
        />
        <Route
          path="/guru/one-day"
          element={
            <Suspense fallback={<Loading />}>
              <Layout>
                <ODFYC />
              </Layout>
            </Suspense>
          }
        />
        <Route
          path="/guru/one-day-partisipan"
          element={
            <Suspense fallback={<Loading />}>
              <Layout>
                <OdfycPartisipants />
              </Layout>
            </Suspense>
          }
        />
        <Route
          path="/admin/absen-karyawan"
          element={
            <Suspense fallback={<Loading />}>
              <Layout>
                <AbsenKaryawan />
              </Layout>
            </Suspense>
          }
        />
        <Route
          path="/keuangan/"
          element={
            <Suspense fallback={<Loading />}>
              <Layout>
                <Ke_Dashbaord />
              </Layout>
            </Suspense>
          }
        />
        <Route
          path="/keuangan/data-siswa"
          element={
            <Suspense fallback={<Loading />}>
              <Layout>
                <Ke_DataSiswa />
              </Layout>
            </Suspense>
          }
        />
        <Route
          path="/keuangan/pos-pembayaran"
          element={
            <Suspense fallback={<Loading />}>
              <Layout>
                <Ke_PosKeuangan />
              </Layout>
            </Suspense>
          }
        />
        <Route
          path="/keuangan/jenis-pembayaran"
          element={
            <Suspense fallback={<Loading />}>
              <Layout>
                <Ke_JenisPembayaran />
              </Layout>
            </Suspense>
          }
        />
        <Route
          path="/keuangan/jenis-pembayaran/:id"
          element={
            <Suspense fallback={<Loading />}>
              <Layout>
                <Ke_DetailJenisPembayaran />
              </Layout>
            </Suspense>
          }
        />
        <Route
          path="/keuangan/daftar-tunggakan"
          element={
            <Suspense fallback={<Loading />}>
              <Layout>
                <Ke_DaftarTunggakan />
              </Layout>
            </Suspense>
          }
        />
        <Route
          path="/keuangan/Laporan"
          element={
            <Suspense fallback={<Loading />}>
              <Layout>
                <Ke_Laporan />
              </Layout>
            </Suspense>
          }
        />
        <Route
          path="/hrd/rekap-presensi"
          element={
            <Suspense fallback={<Loading />}>
              <Layout>
                <RekapPresensi />
              </Layout>
            </Suspense>
          }
        />
        <Route
          path="/hrd/pengajuan-cuti"
          element={
            <Suspense fallback={<Loading />}>
              <Layout>
                <PengajuanCutiHRD />
              </Layout>
            </Suspense>
          }
        />

        {/* karyawan */}
        <Route
          path="/karyawan/daftar-cuti-izin"
          element={
            <Suspense fallback={<Loading />}>
              <Layout>
                <DaftarCutiIzin />
              </Layout>
            </Suspense>
          }
        />
        <Route
          path="/karyawan/daftar-pelatihan"
          element={
            <Suspense fallback={<Loading />}>
              <Layout>
                <PelatihanKaryawan />
              </Layout>
            </Suspense>
          }
        >
          <Route
            path=""
            element={
              <Suspense fallback={<Loading />}>
                <DaftarPelatihanKaryawan />
              </Suspense>
            }
          />
          <Route
            path="pengajuan"
            element={
              <Suspense fallback={<Loading />}>
                <PengajuanPelatihanKaryawan />
              </Suspense>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default RootRoutes;
