import { useState } from "react";

import RaportAngka from "../../component/siswa/RaportAngka";
import RaportNarasi from "../../component/siswa/RaportNarasi";
import RaportPortofolio from "../../component/siswa/RaportPortofolio"
import RaportAll from "../../component/siswa/RaportAll";

const RaportSiswa = () => {
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
            aria-label="Raport Siswa"
            checked={tab == "raport-siswa"}
            onClick={() => setTab("raport-siswa")}
          />
          <div
            role="tabpanel"
            className="tab-content bg-base-100 border-base-300 rounded-box p-6"
          >
            <RaportAll />
          </div>
          <input
            type="radio"
            name="my_tabs_2"
            role="tab"
            className="tab bg-blue-300 font-bold"
            aria-label="Angka"
            checked={tab == "angka"}
            onClick={() => setTab("angka")}
          />
          <div
            role="tabpanel"
            className="tab-content bg-base-100 border-base-300 rounded-box p-6"
          >
            <RaportAngka />
          </div>

          <input
            type="radio"
            name="my_tabs_2"
            role="tab"
            className="tab bg-blue-300 font-bold"
            aria-label="Narasi"
            checked={tab == "narasi"}
            onClick={() => setTab("narasi")}
          />
          <div
            role="tabpanel"
            className="tab-content bg-base-100 border-base-300 rounded-box p-6"
          >
            <RaportNarasi />
          </div>

          <input
            type="radio"
            name="my_tabs_2"
            role="tab"
            className="tab bg-blue-300 font-bold"
            aria-label="Portofolio"
            checked={tab == "portofolio"}
            onClick={() => setTab("portofolio")}
          />
          <div
            role="tabpanel"
            className="tab-content bg-base-100 border-base-300 rounded-box p-6"
          >
            <RaportPortofolio />
          </div>
         
         
          
        </div>
      </div>
    </>
  );
};

export default RaportSiswa;
