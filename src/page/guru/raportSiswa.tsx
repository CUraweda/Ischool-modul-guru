import { useState } from "react";

import RaportAngka from "../../component/siswa/RaportAngka";
import RaportNarasi from "../../component/siswa/RaportNarasi";
import RaportPortofolio from "../../component/siswa/RaportPortofolio"
// import StatusRaport from "../../component/siswa/StatusRaport";
import KomenOrtu from "../../component/siswa/KomenOrtu";
import KomenGuru from "../../component/siswa/KomenGuru";
import RaportAll from "../../component/siswa/RaportAll";

const RaportSiswa = () => {
  const [tab, setTab] = useState<string>("angka");
  return (
    <>
      <div className="w-full mt-5 p-3">
        <div role="tablist" className="tabs tabs-lifted">
          {/* <input
            type="radio"
            name="my_tabs_2"
            role="tab"
            className="tab bg-blue-300 font-bold"
            aria-label="Status"
            checked={tab == "status"}
            onClick={() => setTab("status")}
          />
          <div
            role="tabpanel"
            className="tab-content bg-base-100 border-base-300 rounded-box p-6"
          >
            <StatusRaport/>
          </div> */}
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
          <input
            type="radio"
            name="my_tabs_2"
            role="tab"
            className="tab bg-blue-300 font-bold"
            aria-label="Komentar Guru"
            checked={tab == "komen-guru"}
            onClick={() => setTab("komen-guru")}
          />
          <div
            role="tabpanel"
            className="tab-content bg-base-100 border-base-300 rounded-box p-6"
          >
            <KomenGuru />
          </div>
          <input
            type="radio"
            name="my_tabs_2"
            role="tab"
            className="tab bg-blue-300 font-bold"
            aria-label="Komentar Ortu"
            checked={tab == "komen-ortu"}
            onClick={() => setTab("komen-ortu")}
          />
          <div
            role="tabpanel"
            className="tab-content bg-base-100 border-base-300 rounded-box p-6"
          >
            <KomenOrtu />
          </div>
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
          
        </div>
      </div>
    </>
  );
};

export default RaportSiswa;
