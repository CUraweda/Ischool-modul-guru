import { useState } from "react";
import PengumumanSiswa from "./pengumumanSiswa";
import OverviewSiswa from "./OverviewSiswa";

const DashboardSiswa = () => {
    const [tab, setTab] = useState<string>("raport-siswa");

  return (
    <>
       <div className="w-full mt-5 p-3">
        <div role="tablist" className="tabs tabs-lifted">
          
          <input
            type="radio"
            name="my_tabs_2"
            role="tab"
            className="tab bg-blue-300 font-bold"
            aria-label="Pengumuman"
            checked={tab == "raport-siswa"}
            onClick={() => setTab("raport-siswa")}
          />
          <div
            role="tabpanel"
            className="tab-content bg-base-100 border-base-300 rounded-box p-6"
          >
           <PengumumanSiswa/>
          </div>
          <input
            type="radio"
            name="my_tabs_2"
            role="tab"
            className="tab bg-blue-300 font-bold"
            aria-label="Overview"
            checked={tab == "angka"}
            onClick={() => setTab("angka")}
          />
          <div
            role="tabpanel"
            className="tab-content bg-base-100 border-base-300 rounded-box p-6"
          >
          <OverviewSiswa/>
          </div>

          
        </div>
      </div>
    </>
  );
};

export default DashboardSiswa;
