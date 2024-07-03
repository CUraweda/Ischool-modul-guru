import { useState } from "react";
import { lazy, Suspense } from "react";
import Loading from "../../component/Loading";

const RaportAngka = lazy(() => import("../../component/siswa/RaportAngka"));
const RaportNarasi = lazy(() => import("../../component/siswa/RaportNarasi"));
const RaportPortofolio = lazy(
  () => import("../../component/siswa/RaportPortofolio")
);
const RaportAll = lazy(() => import("../../component/siswa/RaportAll"));

// import RaportAngka from "../../component/siswa/RaportAngka";
// import RaportNarasi from "../../component/siswa/RaportNarasi";
// import RaportPortofolio from "../../component/siswa/RaportPortofolio"
// import RaportAll from "../../component/siswa/RaportAll";

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
            <Suspense fallback={<Loading />}>
              <RaportAll />
            </Suspense>
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
            <Suspense fallback={<Loading />}>
              <RaportAngka />
            </Suspense>
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
            <Suspense fallback={<Loading />}>
              <RaportNarasi />
            </Suspense>
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
            <Suspense fallback={<Loading />}>
              <RaportPortofolio />
            </Suspense>
          </div>
        </div>
      </div>
    </>
  );
};

export default RaportSiswa;
