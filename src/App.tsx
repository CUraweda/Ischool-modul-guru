import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./page/index"
import Dashboard from "./page/dashboard"
import JadwalMengajar from "./page/jadwalMengajar";
import JadwalDinas from "./page/jadwalDinas";
import RekapKehadiran from "./page/rekapKehadiran";
import PengajuanCuti from "./page/pengajuanCuti";
import AdmSiswa from "./page/admSiswa";

// Lazy load your components
// const Home = lazy(() => import("./page/index"));
// const Dashboard = lazy(() => import("./page/dashboard"));

function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard/>} />
          <Route path="/jadwal-guru" element={<JadwalMengajar />} />
          <Route path="/jadwal-dinas" element={<JadwalDinas />} />
          <Route path="/rekap-kehadiran" element={<RekapKehadiran/>} />
          <Route path="/pengajuan-cuti" element={<PengajuanCuti/>} />
          <Route path="/adm-siswa" element={<AdmSiswa/>} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;
