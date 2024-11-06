import { format } from "date-fns";
import { FiMoreHorizontal } from "react-icons/fi";
import {
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
} from "react-icons/md";

import Icon, { IconName } from "../../assets/icon";
import NoData from "../../component/NoData";
import { priorityColor } from "../../constant/priorityColor";
import { useGetAllJobdesk } from "../../hooks/useGetAllJobdesk";
import {
  calcPagination,
  minimumPaginationPage,
  numberOfTable,
} from "../../utils/pagination";
import { usePagination } from "../../hooks/usePagination";
// import { FaCircle } from "react-icons/fa";
import { FaRegCircle } from "react-icons/fa";
import { useState } from "react";
import { Jobdesk } from "../../types/jobdesk";

const JobdeskGuruPage = () => {
  const [selectedJobdesk, setSelectedJobdesk] = useState<Jobdesk | undefined>();
  const { filter, handlePageChange, handleSearchParams } = usePagination();
  const [search, setSearch] = useState(filter.search || "");
  const { data: jobdeskList } = useGetAllJobdesk(
    filter,
    JSON.stringify(filter)
  );

  const pageCount = 6;
  const totalPages = minimumPaginationPage(
    jobdeskList?.data.totalPage ?? 0,
    pageCount
  );

  const disabledPrev = filter.page <= 0;
  const disabledNext = filter.page >= totalPages - 1;
  const activePaginationStyle = (selectedPage: number) =>
    filter.page === selectedPage ? "text-blue-400" : "";

  return (
    <div className="w-full p-5">
      <div className="w-full flex-wrap md:flex md:justify-between items-center">
        <div className="breadcrumbs text-2xl">
          <ul>
            <li>Jobdesk</li>
          </ul>
        </div>
        <label className="text-md input input-sm input-bordered flex items-center gap-2 md:w-3/12">
          <Icon name="search" />
          <input
            type="text"
            value={search}
            className="grow"
            placeholder="Search"
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && handleSearchParams(e.currentTarget.value)
            }
          />
        </label>
      </div>

      <div className="mt-3 flex-grow border-t border-gray-400 drop-shadow-sm"></div>

      <div className="flex justify-between items-center">
        <button className="text-md badge btn badge-md btn-xs my-5 h-fit rounded-badge bg-blue-100 border-blue-300 text-blue-500 drop-shadow-sm">
          Semua
          <div className="pl-5 font-light">{jobdeskList?.data.totalRows}</div>
        </button>
        <select className="select select-xs select-bordered w-24">
          <option disabled selected>
            Filter
          </option>
          {["Tinggi", "Sedang", "Rendah"].map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </div>

      <div className="card h-fit w-full overflow-x-auto bg-base-100 p-5 shadow-xl">
        <table className="text-md table">
          <thead>
            <tr className="font-bold">
              {[
                "No.",
                "Nama",
                "Judul Kegiatan (Jobdesk)",
                "Tenggat Waktu",
                "Prioritas",
                "Status",
                "",
              ].map((column, index) => (
                <th
                  className={`${[1, 2, 3].includes(index) ? "text-left" : "text-center"} text-black`}
                  key={column}
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {jobdeskList?.data.result.map((employee, index) => {
              const { name, description, due_date, priority_label } = employee;

              return (
                <tr key={index} className="hover:bg-slate-50 cursor-pointer">
                  <td className="text-center">
                    {numberOfTable(index, filter.page, pageCount)}
                  </td>
                  <td>{name}</td>
                  <td>{description}</td>
                  <td>{format(new Date(due_date), "dd/MM/yyyy")}</td>
                  <td className="text-center">
                    <PriorityBadge priority={priority_label} />
                  </td>
                  <td className="text-center">{"-"}</td>
                  <td className="text-center">
                    <Action
                      key={index}
                      onSelectedJobdesk={() => setSelectedJobdesk(employee)}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {!jobdeskList?.data.result.length && <NoData />}
        <div className="join mx-auto mt-5">
          <button
            disabled={disabledPrev}
            onClick={() => handlePageChange("prev", totalPages)}
            className="disabled:cursor-pointer join-item btn btn-sm bg-stone-50-50 outline-none border-0 shadow-none hover:bg-stone-50-100 text-[#6A6B6B99] disabled:bg-stone-200"
          >
            <MdOutlineKeyboardArrowLeft className="w-5 h-5" />
          </button>
          {calcPagination(pageCount, totalPages, filter.page).map((page) => (
            <button
              className={`join-item btn btn-sm bg-stone-50-50 outline-none border-0 shadow-none hover:bg-stone-50-100 text-[#6A6B6B99] ${activePaginationStyle(page)}`}
              key={page}
              onClick={() => handlePageChange(page, totalPages)}
            >
              {page + 1}
            </button>
          ))}
          <button
            disabled={disabledNext}
            onClick={() => handlePageChange("next", totalPages)}
            className="disabled:cursor-pointer join-item btn btn-sm bg-stone-50-50 outline-none border-0 shadow-none hover:bg-stone-50-100 text-[#6A6B6B99] disabled:bg-stone-200"
          >
            <MdOutlineKeyboardArrowRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      <ModalDetailJobdesk jobdesk={selectedJobdesk} />
      <ModalChangeStatus />
    </div>
  );
};

function PriorityBadge({
  priority,
  size = "default",
}: {
  priority?: string;
  size?: "small" | "default";
}) {
  if (!priority) return null;

  return (
    <span
      className={`${size === "small" ? "text-xs px-2 py-1 tracking-wide" : "px-5 py-2 font-semibold"} rounded-lg  text-[#6A6B6BCC]`}
      style={{
        background:
          priorityColor[priority.toLowerCase() as keyof typeof priorityColor],
      }}
    >
      {priority}
    </span>
  );
}

function Action({ onSelectedJobdesk }: { onSelectedJobdesk: () => void }) {
  const handleClickDetailJobdesk = () => {
    onSelectedJobdesk();
    const modal = document.getElementById(
      "detail_jobdesk"
    ) as HTMLDialogElement;
    modal?.showModal();
  };

  const handleClickChangeStatus = () => {
    onSelectedJobdesk();
    const modal = document.getElementById(
      "change_status_job"
    ) as HTMLDialogElement;
    modal?.showModal();
  };

  return (
    <div className="dropdown dropdown-end">
      <label tabIndex={0} role="button" className="btn btn-[#EDEAEA] btn-sm">
        <FiMoreHorizontal />
      </label>
      <ul
        tabIndex={0}
        className="dropdown-content menu w-52 rounded-box bg-base-100 p-2 shadow z-50"
      >
        {[
          {
            title: "Ubah Status",
            icon: "edit",
            handleClick: handleClickChangeStatus,
          },
          {
            title: "Detail Jobdesk",
            icon: "board",
            handleClick: handleClickDetailJobdesk,
          },
        ].map((menu, index) => {
          const { title, icon, handleClick } = menu;
          return (
            <li key={index} className="hover:bg-gray-100 rounded-lg">
              <a
                role="button"
                className="flex items-center"
                onClick={handleClick}
                style={{
                  background: "transparent",
                  color: "#222222",
                }}
              >
                <span className="text-slate-400 w-4 h-4">
                  <Icon name={icon as IconName} />
                </span>
                {title}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function ModalDetailJobdesk({ jobdesk }: { jobdesk?: Jobdesk }) {
  return (
    <dialog id="detail_jobdesk" className="modal">
      <div className="modal-box">
        <div className="flex items-center justify-between pb-3">
          <h2 className="text-lg font-bold">Detail Jobdesk</h2>
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost hover:bg-stone-50">
              ✕
            </button>
          </form>
        </div>
        <div className="border-t border-t-slate-500"></div>
        <div className="grid grid-cols-2 gap-5 mt-5">
          {[
            {
              label: "Judul Jobdesk",
              value: jobdesk?.name ?? "-",
            },
            {
              label: "Prioritas",
              value: (
                <PriorityBadge
                  priority={jobdesk?.priority_label}
                  size="small"
                />
              ),
            },
            {
              label: "Tanggal Dibuat",
              value: jobdesk?.due_date
                ? format(new Date(jobdesk.due_date), "dd/MM/yyyy")
                : "-",
            },
            {
              label: "Tenggat",
              value: jobdesk?.createdAt
                ? format(new Date(jobdesk.createdAt), "dd/MM/yyyy")
                : "-",
            },
          ].map(({ label, value }) => (
            <div key={label} className="flex flex-col gap-1">
              <h3 className="text-xs">{label}</h3>
              <p>{value}</p>
            </div>
          ))}
          <div className="col-span-2 flex flex-col gap-2">
            <h3 className="text-xs">Deskripsi Jobdesk</h3>
            <textarea
              disabled
              value={jobdesk?.description ?? "-"}
              className="textarea textarea-bordered disabled:bg-transparent disabled:text-slate-600"
              placeholder="Isi Deskripsi Jobdesk"
              rows={5}
            ></textarea>
          </div>
          <div className="w-full col-span-2 flex flex-col">
            <h3 className="text-xs">Status</h3>
            <ul className="timeline">
              {[
                { label: "Belum dikerjakan", icon: <FaRegCircle /> },
                { label: "Sedang dikerjakan", icon: <FaRegCircle /> },
                { label: "Selesai", icon: <FaRegCircle /> },
              ].map((item, index) => {
                return (
                  <li key={index} className="w-1/3 h-[72px]">
                    <hr />
                    <div className="timeline-middle">{item.icon}</div>
                    <div className="timeline-end timeline-box text-xs border-none shadow-none p-1">
                      {item.label}
                    </div>
                    <hr />
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </dialog>
  );
}

function ModalChangeStatus() {
  return (
    <dialog id="change_status_job" className="modal">
      <div className="modal-box max-w-80 p-0">
        <h2 className="text-lg text-center p-5 py-3 font-bold">Ubah Status</h2>
        <div className="border-t border-t-slate-500"></div>
        <div className="p-5 pb-6 flex flex-col gap-4">
          {[
            {
              id: "todo",
              name: "status_job",
              defaultChecked: true,
              labelText: "Belum dikerjakan",
            },
            {
              id: "onProgress",
              name: "status_job",
              defaultChecked: false,
              labelText: "Sedang dikerjakan",
              className: "radio-info",
            },
            {
              id: "done",
              name: "status_job",
              defaultChecked: false,
              labelText: "Selesai",
              className: "radio-success",
            },
          ].map(({ id, name, defaultChecked, labelText, className }) => (
            <label key={id} htmlFor={id} className="flex items-center gap-3">
              <input
                id={id}
                type="radio"
                name={name}
                className={`radio radio-sm ${className}`}
                defaultChecked={defaultChecked}
              />
              {labelText}
            </label>
          ))}
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}

export default JobdeskGuruPage;
