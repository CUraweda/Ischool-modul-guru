import { useState } from "react";
import { RiDeleteBin7Line, RiPencilLine } from "react-icons/ri";
import Icon from "../../assets/icon";
import NoData from "../../component/NoData";
import ConfirmModal from "../../component/ui/modal/confirmation";
import Modal from "../../component/ui/modal/custom";
import Tab from "../../component/ui/tab/tab";
import { useDeleteJobdesk } from "../../hooks/useDeleteJobdesk";
import { useGetAllJobdesk } from "../../hooks/useGetAllJobdesk";
import { Jobdesk } from "../../types/jobdesk";
import { modal, value } from "../../utils/common";

const DaftarPenilaian = () => {
  const [search, setSearch] = useState("");

  const {
    data: assesmentData,
    refetch: refetchAssesmentData,
    isPending,
  } = useGetAllJobdesk({ search });

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
        <table className="table w-full min-h-20">
          <thead>
            <tr>
              {[
                "No",
                "Nama",
                "Email",
                "Posisi",
                "Deskripsi",
                "Personal",
                "Partner",
                "Supervisor",
                "Aksi",
              ].map((column) => (
                <th key={column}>{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {assesmentData?.data.result?.map((item, index) => {
              const { employee } = item;
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
                  <td className="w-20 text-center">
                    {value(item.personal_grade)}
                  </td>
                  <td className="w-20 text-center">
                    {value(item.partner_grade)}
                  </td>
                  <td className="w-20 text-center">
                    {value(item.assesor_grade)}
                  </td>
                  <td className="flex gap-2">
                    <Update jobdesk={item} />
                    <Delete id={item.id} />
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
    </div>
  );
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function Update({ jobdesk }: { jobdesk: Jobdesk }) {
  const { employee } = jobdesk;
  const modalName = "perbaharui_modal";
  const isAssesor = employee.is_asessor;

  const tabs = {
    "Nilai Personal": (
      <div className="flex flex-col items-end gap-4">
        <label className="form-control w-full">
          <div className="label">
            <span className="label-text">Grade personal baru</span>
            <span className="label-text-alt">
              Grade saat ini {jobdesk.personal_grade}
            </span>
          </div>
          <input
            type="text"
            placeholder="Masukkan grade personal baru"
            className="input input-bordered w-full"
          />
        </label>
        <button className="btn btn-primary text-white">Perbaharui</button>
      </div>
    ),
    "Nilai Partner": (
      <div className="flex flex-col items-end gap-4">
        <label className="form-control w-full">
          <div className="label">
            <span className="label-text">Grade partner baru</span>
            <span className="label-text-alt">
              Grade saat ini {jobdesk.partner_grade}
            </span>
          </div>
          <input
            type="text"
            placeholder="Masukkan grade partner baru"
            className="input input-bordered w-full"
          />
        </label>
        <button className="btn btn-primary text-white">Perbaharui</button>
      </div>
    ),
    "Nilai Supervisor": isAssesor ? (
      <div className="flex flex-col items-end gap-4">
        <label className="form-control w-full">
          <div className="label">
            <span className="label-text">Grade supervisor baru</span>
            <span className="label-text-alt">
              Grade saat ini {jobdesk.assesor_grade}
            </span>
          </div>
          <input
            type="text"
            placeholder="Masukkan grade supervisor baru"
            className="input input-bordered w-full"
          />
        </label>
        <button className="btn btn-primary text-white">Perbaharui</button>
      </div>
    ) : undefined,
  };

  return (
    <>
      <button
        className="btn btn-active btn-primary btn-sm text-sm text-white flex items-center gap-1"
        onClick={() => modal.open(modalName)}
      >
        <RiPencilLine />
      </button>
      <Modal name={modalName} title="Perbaharui penilaian">
        <Tab tabs={tabs} />
      </Modal>
    </>
  );
}

function Delete({ id }: { id: number }) {
  const modalName = "confirm_modal";
  const { mutate: deleteJob, isError } = useDeleteJobdesk();

  const handleConfirm = (id: number) => {
    if (!isError) {
      deleteJob(id);
      modal.close(modalName);
    }
  };

  return (
    <>
      <button
        className="btn btn-active btn-error text-white btn-sm text-sm flex items-center gap-1"
        onClick={() => modal.open(modalName)}
      >
        <RiDeleteBin7Line />
      </button>
      <ConfirmModal
        title="Konfirmasi Penghapusan"
        message="Apakah anda yakin ingin menghapus data?"
        onConfirm={() => handleConfirm(id)}
      />
    </>
  );
}

export default DaftarPenilaian;
