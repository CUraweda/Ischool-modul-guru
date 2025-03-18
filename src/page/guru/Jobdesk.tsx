import { useState, useEffect } from "react";
import { lazy, Suspense } from "react";
import Loading from "../../component/Loading";
import { Auth } from "../../middleware/api";

const JobdeskPersonal = lazy(
  () => import("../../component/siswa/JobdeskPersonal")
);
const JobdeskPartner = lazy(
  () => import("../../component/siswa/JobdeskPartner")
);
const JobdeskSupervisor = lazy(
  () => import("../../component/siswa/JobdeskSupervisor")
);

const Jobdesk = () => {
  const [tab, setTab] = useState<string>("personal");
  const [assesor, setAsessor] = useState<boolean>(false);
  const getMe = async () => {
    try {
      const res = await Auth.MeData();
      setAsessor(res.data.data.employee.is_asessor);
      console.log(assesor);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getMe();
  }, []);

  return (
    <>
      <div className="w-full mt-5 p-3">
        <div role="tablist" className="tabs tabs-lifted overflow-x-auto">
          <input
            type="radio"
            name="my_tabs_2"
            role="tab"
            className="tab bg-blue-300 font-bold whitespace-nowrap"
            aria-label="Personal"
            checked={tab == "personal"}
            onClick={() => setTab("personal")}
          />
          <div
            role="tabpanel"
            className="tab-content bg-base-100 border-base-300 rounded-box rounded-ss-none p-6"
          >
            <Suspense fallback={<Loading />}>
              <JobdeskPersonal />
            </Suspense>
          </div>
          <input
            type="radio"
            name="my_tabs_2"
            role="tab"
            className="tab bg-blue-300 font-bold"
            aria-label="Partner"
            checked={tab == "partner"}
            onClick={() => setTab("partner")}
          />
          <div
            role="tabpanel"
            className="tab-content bg-base-100 border-base-300 rounded-box rounded-ss-none p-6"
          >
            <Suspense fallback={<Loading />}>
              <JobdeskPartner />
            </Suspense>
          </div>

          {assesor == true && (
            <>
              <input
                type="radio"
                name="my_tabs_2"
                role="tab"
                className="tab bg-blue-300 font-bold"
                aria-label="Supervisor"
                checked={tab == "supervisor"}
                onClick={() => setTab("supervisor")}
              />
              <div
                role="tabpanel"
                className="tab-content bg-base-100 border-base-300 rounded-box rounded-ss-none p-6"
              >
                <Suspense fallback={<Loading />}>
                  <JobdeskSupervisor />
                </Suspense>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Jobdesk;
