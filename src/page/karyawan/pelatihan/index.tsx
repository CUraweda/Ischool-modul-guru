import { Link, Outlet, useLocation } from "react-router-dom";

const PelatihanKaryawan = () => {
  const location = useLocation();

  return (
    <>
      <div className="w-full p-3">
        <p className="font-bold text-xl mb-6">DAFTAR PELATIHAN</p>
        <div role="tablist" className="tabs tabs-lifted justify-start">
          <Link
            to={""}
            role="tab"
            className={
              "tab bg-blue-300 font-bold " +
              (location.pathname.endsWith("daftar-pelatihan") ||
              location.pathname.endsWith("daftar-pelatihan/")
                ? "tab-active"
                : "")
            }
          >
            Daftar
          </Link>
          <Link
            to={"pengajuan"}
            role="tab"
            className={
              "tab bg-blue-300 font-bold " +
              (location.pathname.endsWith("pengajuan") ? "tab-active" : "")
            }
          >
            Pengajuan
          </Link>
        </div>
        <div className="w-full p-3 bg-white rounded-b-lg rounded-se-lg">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default PelatihanKaryawan;
