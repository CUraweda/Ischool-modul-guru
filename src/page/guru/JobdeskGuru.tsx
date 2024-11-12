import { format } from "date-fns";
import { useEffect, useState } from "react";
import { FaCircle, FaRegCircle } from "react-icons/fa";
import { FiMoreHorizontal } from "react-icons/fi";
import Icon, { IconName } from "../../assets/icon";
import NoData from "../../component/NoData";
import Pagination from "../../component/ui/pagination";
import Search from "../../component/ui/search";
import {
  priorityColor,
  statusColor,
  statusConfig,
} from "../../constant/priorityColor";
import { useGetAllJobdesk } from "../../hooks/useGetAllJobdesk";
import useSearchParams from "../../hooks/useSearchParams";
import { Jobdesk } from "../../types/jobdesk";
import { filterParams } from "../../utils/common";
import { minimumPaginationPage, numberOfTable } from "../../utils/pagination";
import { usePutJobdeskStatus } from "../../hooks/usePutJobdeskStatus";

type FilterParams = Partial<{
  limit: number;
  page: number;
  employee_id: string;
  search: string;
  priority_label: string;
}>;

const JobdeskGuruPage = () => {
  const { getSearchParam, handleSearchParams } = useSearchParams();

  const params = {
    page: getSearchParam("search") ? undefined : +getSearchParam?.("page") || 1,
    limit: +getSearchParam("limit") || 10,
    search: getSearchParam("search"),
    priority_label: getSearchParam("priority_label"),
  };
  const isPageParamsExist = Boolean(params.page);

  const [baseFilter, setBaseFilter] = useState<FilterParams>(params);
  const [selectedJobdesk, setSelectedJobdesk] = useState<Jobdesk | undefined>();

  const { data: jobdeskList } = useGetAllJobdesk(
    filterParams(
      isPageParamsExist ? { ...params, page: params.page! - 1 } : params
    )
  );
  const totalPages = minimumPaginationPage(jobdeskList?.data.totalPage ?? 0, 6);

  useEffect(() => {
    handleSearchParams(params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-full p-5">
      <div className="w-full flex-wrap md:flex md:justify-between items-center">
        <div className="breadcrumbs text-2xl">
          <ul>
            <li>Jobdesk</li>
          </ul>
        </div>
        <Search />
      </div>

      <div className="mt-3 flex-grow border-t border-gray-400 drop-shadow-sm"></div>

      <div className="flex justify-between items-center">
        <button className="text-md badge btn badge-md btn-xs my-5 h-fit rounded-badge bg-blue-100 border-blue-300 text-blue-500 drop-shadow-sm">
          Semua
          <div className="pl-5 font-light">{jobdeskList?.data.totalRows}</div>
        </button>
        <select
          value={params.priority_label}
          onChange={(e) =>
            handleSearchParams({ priority_label: e.target.value })
          }
          className="select select-xs select-bordered w-24"
        >
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
              const {
                name,
                description,
                due_date,
                priority_label,
                is_finish,
                is_graded,
              } = employee;

              const currentStatus =
                is_finish && is_graded
                  ? "selesai"
                  : is_finish
                    ? "dikerjakan"
                    : "belumDikerjakan";

              return (
                <tr key={index} className="hover:bg-slate-50 cursor-pointer">
                  <td className="text-center">
                    {numberOfTable(index, params.page ?? 0, params.limit, 1)}
                  </td>
                  <td>{name}</td>
                  <td>{description}</td>
                  <td>{format(new Date(due_date), "dd/MM/yyyy")}</td>
                  <td className="text-center">
                    <PriorityBadge
                      label={priority_label}
                      background={{
                        background:
                          priorityColor[
                            priority_label?.toLowerCase() as keyof typeof priorityColor
                          ],
                      }}
                    />
                  </td>
                  <td className="text-center">
                    {
                      <PriorityBadge
                        label={statusConfig[currentStatus].label}
                        background={{
                          background:
                            statusColor[
                              statusConfig[currentStatus]
                                .colorKey as keyof typeof statusColor
                            ],
                        }}
                      />
                    }
                  </td>
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

        <Pagination
          onChangeLimit={(value: number) =>
            setBaseFilter((prev) => ({ ...prev, limit: value }))
          }
          onChangePage={(value: number) =>
            setBaseFilter((prev) => ({ ...prev, page: value }))
          }
          limit={baseFilter.limit!}
          totalPages={totalPages}
          pageSize={6}
        />
      </div>

      <ModalDetailJobdesk jobdesk={selectedJobdesk} />
      <ModalChangeStatus />
    </div>
  );
};

function PriorityBadge({
  label,
  background,
  size = "default",
}: {
  label?: string;
  background?: React.CSSProperties;
  size?: "small" | "default";
}) {
  if (!label) return <p className="text-xs text-slate-400">NOT SPECIFIED</p>;

  return (
    <span
      className={`${size === "small" ? "text-xs px-2 py-1 tracking-wide" : "px-5 py-2 font-medium text-sm"} rounded-lg text-[#6A6B6BCC]`}
      style={{ ...background }}
    >
      {label}
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
                  label={jobdesk?.priority_label}
                  background={{
                    background:
                      priorityColor[
                        jobdesk?.priority_label?.toLowerCase() as keyof typeof priorityColor
                      ],
                  }}
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
                {
                  label: "Belum dikerjakan",
                  icon: !jobdesk?.is_finish ? <FaCircle /> : <FaRegCircle />,
                },
                {
                  label: "Sedang dikerjakan",
                  icon: jobdesk?.is_finish ? <FaCircle /> : <FaRegCircle />,
                },
                {
                  label: "Selesai",
                  icon:
                    jobdesk?.is_finish && jobdesk?.is_graded ? (
                      <FaCircle />
                    ) : (
                      <FaRegCircle />
                    ),
                },
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
  const { mutate: updateStatus } = usePutJobdeskStatus();
  return (
    <dialog id="change_status_job" className="modal">
      <div className="modal-box max-w-80 p-0">
        <h2 className="text-lg text-center p-5 py-3 font-bold">Ubah Status</h2>
        <div className="border-t border-t-slate-500"></div>
        <div className="p-5 pb-6 flex flex-col gap-4">
          {[
            {
              id: "onProgress",
              name: "status_job",
              value: 1,
              defaultChecked: false,
              labelText: "Sedang dikerjakan",
              className: "radio-info",
            },
            {
              id: "done",
              name: "status_job",
              value: 2,
              defaultChecked: false,
              labelText: "Selesai",
              className: "radio-success",
            },
          ].map(({ id, name, defaultChecked, labelText, className, value }) => (
            <label key={id} htmlFor={id} className="flex items-center gap-3">
              <input
                id={id}
                onChange={(e) => updateStatus(+e.target.value)}
                type="radio"
                value={value}
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
