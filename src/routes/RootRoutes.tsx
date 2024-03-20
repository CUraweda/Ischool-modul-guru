import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../page/login";
import Layout from "../component/Layout";
// import GuruRoutes from "./GuruRoutes";
import Dashboard from "../page/guru/Dashboard";
import JadwalMengajar from "../page/guru/jadwalMengajar";
import JadwalDinas from "../page/guru/jadwalDinas";
import RekapKehadiran from "../page/guru/rekapKehadiran";
import PengajuanCuti from "../page/guru/pengajuanCuti";
import AdmSiswa from "../page/guru/admSiswa";
import PresensiSiswa from "../page/guru/presensiSiswa";
import NilaiSiswa from "../page/guru/nilaiSiswa";
import BahanAjar from "../page/guru/bahanAjar";
import AgendaKegiatan from "../page/guru/agendaKegiatan";
import AdmGuru from "../page/guru/admGuru";
import DaftarPelatihan from "../page/guru/daftarPelatihan";
import PesanCs from "../page/guru/pesanCs";

import KaryawanDashboard from "../page/karyawan/Dashboard"
import KaryawanRapat from "../page/karyawan/agendaKegiatan"
import KaryawanLog from "../page/karyawan/admGuru"
import KaryawanPresensi from "../page/karyawan/rekapKehadiran"
import KaryawanPelatihan from "../page/karyawan/daftarPelatihan"
import RaportSiswa from "../page/guru/raportSiswa";
import RaportNarasi from "../page/guru/RaportNarasi";

const RootRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/guru/dashboard"
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }
        />
        
        <Route
          path="/guru/jadwal-guru"
          element={
            <Layout>
              <JadwalMengajar />
            </Layout>
          }
        />
        <Route
          path="/guru/jadwal-dinas"
          element={
            <Layout>
              <JadwalDinas />
            </Layout>
          }
        />
        <Route
          path="/guru/rekap-kehadiran"
          element={
            <Layout>
              <RekapKehadiran />
            </Layout>
          }
        />
        <Route
          path="/guru/pengajuan-cuti"
          element={
            <Layout>
              <PengajuanCuti />
            </Layout>
          }
        />
        <Route
          path="/guru/adm-siswa"
          element={
            <Layout>
              <AdmSiswa />
            </Layout>
          }
        />
        <Route
          path="/guru/presensi-siswa"
          element={
            <Layout>
              <PresensiSiswa />
            </Layout>
          }
        />
        <Route
          path="/guru/daftar-nilai-siswa"
          element={
            <Layout>
              <NilaiSiswa />
            </Layout>
          }
        />
        <Route
          path="/guru/bahan-ajar"
          element={
            <Layout>
              <BahanAjar />
            </Layout>
          }
        />
        <Route
          path="/guru/agenda-kegiatan"
          element={
            <Layout>
              <AgendaKegiatan />
            </Layout>
          }
        />
        <Route
          path="/guru/adm-guru"
          element={
            <Layout>
              <AdmGuru />
            </Layout>
          }
        />
        <Route
          path="/guru/pelatihan"
          element={
            <Layout>
              <DaftarPelatihan />
            </Layout>
          }
        />
        <Route
          path="/guru/rapor-siswa"
          element={
            <Layout>
              <RaportSiswa />
            </Layout>
          }
        />
        <Route
          path="/guru/rapor-siswa/narasi"
          element={
            <Layout>
              <RaportNarasi />
            </Layout>
          }
        />
        <Route
          path="/guru/cs"
          element={
            <Layout>
              <PesanCs />
            </Layout>
          }
        />
        <Route
          path="/karyawan/dashboard"
          element={
            <Layout>
              <KaryawanDashboard />
            </Layout>
          }
        />
        <Route
          path="/karyawan/rapat"
          element={
            <Layout>
              <KaryawanRapat />
            </Layout>
          }
        />
        <Route
          path="/karyawan/loogbook-harian"
          element={
            <Layout>
              <KaryawanLog />
            </Layout>
          }
        />
        <Route
          path="/karyawan/presensi"
          element={
            <Layout>
              <KaryawanPresensi />
            </Layout>
          }
        />
        <Route
          path="/karyawan/pelatihan"
          element={
            <Layout>
              <KaryawanPelatihan />
            </Layout>
          }
        />
        <Route
          path="/karyawan/adm"
          element={
            <Layout>
            </Layout>
          }
        />
        <Route
          path="/karyawan/kpi"
          element={
            <Layout>
            </Layout>
          }
        />
        
      </Routes>
    </BrowserRouter>
  );
};

export default RootRoutes;
