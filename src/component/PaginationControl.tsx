import { getReversedNumbersByLen } from "../utils/common";

export interface IpageMeta {
  page: number;
  limit: number;
  totalRows?: number;
  totalPage?: number;
}

export const PaginationControl = ({
  meta,
  onPrevClick,
  onNextClick,
  useLimit = true,
  useTotal = true,
  useJumpPage = true,
  onJumpPageClick = () => {},
  onLimitChange = () => {},
}: {
  meta: IpageMeta;
  useLimit?: boolean;
  useTotal?: boolean;
  useJumpPage?: boolean;
  onPrevClick: () => void;
  onNextClick: () => void;
  onJumpPageClick?: (val: number) => void;
  onLimitChange?: (val: number) => void;
}) => {
  return (
    <div className="w-full items-center flex-wrap justify-end flex mt-3 gap-3">
      {useTotal && (
        <p className="text-neutral-500 me-auto text-sm">
          Total terdapat {meta.totalRows} data
        </p>
      )}
      {useLimit && (
        <div className="join">
          <select
            value={meta.limit}
            onChange={(e) => onLimitChange(parseInt(e.target.value))}
            className="select bg-base-200 join-item w-full max-w-xs"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
          <button className="join-item btn">per halaman</button>
        </div>
      )}
      <div className="join">
        <button
          className="join-item btn"
          onClick={onPrevClick}
          disabled={meta.page == 0}
        >
          «
        </button>
        <div className="dropdown dropdown-top m-0 join-item dropdown-end">
          <button tabIndex={0} className="btn rounded-none">
            Halaman {meta.page + 1}{" "}
          </button>
          {meta.totalPage &&
          typeof meta.totalPage == "number" &&
          meta.totalPage > 1 &&
          useJumpPage ? (
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-base-100 rounded-box z-[1] w-32 p-2 shadow"
            >
              {getReversedNumbersByLen(meta.totalPage).map((val, i) => (
                <li key={i}>
                  <button onClick={() => onJumpPageClick(val - 1)}>
                    Halaman {val}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            ""
          )}
        </div>
        <button
          className="join-item btn"
          onClick={onNextClick}
          disabled={meta.page + 1 == meta.totalPage}
        >
          »
        </button>
      </div>
    </div>
  );
};
