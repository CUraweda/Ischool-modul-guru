import { useState } from "react";
import { RiPencilLine } from "react-icons/ri";
import Swal from "sweetalert2";
import Icon from "../../assets/icon";
import NoData from "../../component/NoData";
import Modal from "../../component/ui/modal/custom";
import { useGetAllJobdesk } from "../../hooks/useGetAllJobdesk";
import { usePutGradePenilaian } from "../../hooks/useUpdateGrade";
import { employeeStore } from "../../store/Store";
import { Identifier, UpdateGradeState } from "../../types/jobdesk";
import { modal, value } from "../../utils/common";

const DaftarPenilaian = () => {
  const [search, setSearch] = useState("");
  const [selectedTab, setSelectedTab] = useState(0);
  const { employee, isAsessor } = employeeStore();
  const [selectedData, setSelectedData] = useState<
    UpdateGradeState | undefined
  >(undefined);

  const modalName = "update_grade";

  const tabs = [
    { header: "Personal", params: { employee_id: employee?.id || "" } },
    {
      header: "Partner",
      params: { partner_assigned: "Y" },
    },
    isAsessor
      ? {
          header: "Supervisor",
          params: { asessor_assigned: "Y" },
        }
      : undefined,
  ].filter(Boolean);

  const params = { search, ...tabs[selectedTab]?.params };

  const {
    data: assesmentData,
    refetch: refetchAssesmentData,
    isPending,
  } = useGetAllJobdesk(params);

  const { mutate: updateGrade, isPending: isPendingUpdate } =
    usePutGradePenilaian({
      onSuccess: () => {
        refetchAssesmentData();
        modal.close(modalName);
        Swal.fire({
          title: "Berhasil!",
          text: "Grade berhasil diperbaharui.",
          icon: "success",
        });
      },
      onError: (e) => {
        modal.close(modalName);
        Swal.fire({
          title: "Gagal!",
          text: e.message,
          icon: "error",
        });
      },
    });

  return (
    <div className="min-h-screen p-5 overflow-y-hidden">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-lg font-bold">Daftar Penilaian</h3>
        <label className="input input-sm input-bordered flex items-center gap-2 md:w-3/12">
          <input
            type="text"
            className="grow"
            placeholder="Cari"
            onKeyDown={(e) => e.key === "Enter" && refetchAssesmentData()}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Icon name="search" />
        </label>
      </div>
      <div className="my-5 flex-grow border-t border-gray-400 drop-shadow-sm"></div>
      <div className="card bg-white p-4 shadow-md">
        <div role="tablist" className="tabs tabs-bordered mb-6 max-w-xl">
          {tabs.map((tab, index) => (
            <a
              key={tab?.header}
              role="tab"
              className={`tab ${index == selectedTab ? "tab-active" : ""}`}
              onClick={() => setSelectedTab(index)}
            >
              {tab?.header}
            </a>
          ))}
        </div>
        <table className="table w-full min-h-20">
          <thead>
            <tr>
              {[
                "No",
                "Nama",
                "Email",
                "Posisi",
                "Deskripsi",
                ["Personal", "Partner", "Supervisor"][selectedTab],
                "Aksi",
              ].map((column) => (
                <th key={column}>{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {assesmentData?.data.result?.map((item, index) => {
              const { employee } = item;

              const selectedGrade = {
                0: value(item.personal_grade),
                1: value(item.partner_grade),
                2: value(item.assesor_grade),
              };

              const grade =
                selectedGrade[selectedTab as keyof typeof selectedGrade];

              return (
                <tr key={index} className="hover:bg-slate-50 cursor-pointer">
                  <td>{index + 1}</td>
                  <td className="min-w-36">{value(employee?.full_name)}</td>
                  <td
                    className="max-w-32 truncate"
                    title={value(employee.email)}
                  >
                    {value(employee?.email)}
                  </td>
                  <td className="px-4 py-2">{value(employee?.occupation)}</td>
                  <td
                    className="max-w-44 truncate"
                    title={value(item.description)}
                  >
                    {value(item.description)}
                  </td>
                  <td className="w-20 text-center">{grade}</td>
                  <td>
                    <button
                      className="btn btn-active btn-primary btn-sm text-sm text-white flex items-center gap-1"
                      onClick={() => {
                        setSelectedData({
                          id: item.id,
                          grade,
                          identifier: tabs[
                            selectedTab
                          ]?.header.toUpperCase() as Identifier,
                        });
                        modal.open(modalName);
                      }}
                    >
                      <RiPencilLine />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {assesmentData && assesmentData.data.result?.length == 0 ? (
          <NoData />
        ) : null}
        {isPending ? (
          <span className="loading loading-ring loading-lg mx-auto"></span>
        ) : null}
      </div>

      <Modal
        onClose={() => setSelectedData(undefined)}
        name={modalName}
        title={`Update Nilai ${tabs[selectedTab]?.header}`}
      >
        <div className="mt-4 flex gap-3">
          <input
            disabled={isPendingUpdate}
            type="text"
            placeholder="Masukkan grade baru"
            onChange={(e) =>
              setSelectedData((prev) =>
                !prev ? undefined : { ...prev, grade: e.target.value }
              )
            }
            className="input input-bordered w-full"
            value={selectedData?.grade ?? ""}
          />
          <button
            type="button"
            className="btn btn-primary disabled:btn-secondary disabled:text-gray-500 text-white cursor-pointer"
            disabled={!selectedData?.grade}
            onClick={() => {
              if (selectedData?.id) {
                updateGrade({
                  id: selectedData.id,
                  grade: Number(selectedData.grade),
                  identifier: selectedData.identifier,
                });
              }
            }}
          >
            {isPendingUpdate && (
              <span className="loading loading-sm loading-spinner"></span>
            )}
            Submit
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default DaftarPenilaian;
