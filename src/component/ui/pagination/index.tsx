import useSearchParams from "../../../hooks/useSearchParams";
import { calcPagination } from "../../../utils/pagination";
import { usePagination } from "./usePagination";

type Props = {
  limit: number;
  onChangeLimit: (limit: number) => void;
  onChangePage: (page: number) => void;
  totalPages: number;
  pageSize: number;
};

function Pagination({
  limit,
  totalPages,
  pageSize = 6,
  onChangeLimit,
}: Props) {
  const { handleSearchParams } = useSearchParams();
  const { filter, handlePageChange } = usePagination(limit);
  const disabledPrev = filter.page <= 1;
  const disabledNext = filter.page >= totalPages;
  const activePaginationStyle = (selectedPage: number) =>
    filter.page === selectedPage ? "text-blue-400" : "";

  return (
    <div className="flex justify-center join mt-5">
      <button
        className="btn join-item btn-sm disabled:opacity-100 disabled:bg-stone-100"
        onClick={() => handlePageChange("prev", totalPages)}
        disabled={disabledPrev}
      >
        Previous
      </button>
      <button className="btn join-item btn-sm">
        Page {filter.page} of {totalPages || 1}
      </button>
      {calcPagination(pageSize, totalPages, filter.page).map((page) => {
        const currentPage = page + 1;
        return (
          <button
            className={`join-item btn btn-sm bg-stone-50-50 outline-none border-0 shadow-none hover:bg-stone-50-100 text-[#6A6B6B99] ${activePaginationStyle(currentPage)}`}
            key={currentPage}
            onClick={() => handlePageChange(currentPage, totalPages)}
          >
            {currentPage}
          </button>
        );
      })}
      <button tabIndex={0} className="btn join-item btn-sm">
        <select
          className="select select-ghost select-sm w-full max-w-xs bg-transparent"
          style={{ border: 0, outline: 0 }}
          value={limit}
          onChange={(e) => {
            handleSearchParams({ limit: +e.target.value });
            onChangeLimit(+e.target.value);
          }}
        >
          <option disabled selected>
            Limit
          </option>
          {[10, 30, 50, 100].map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </button>

      <button
        className="btn join-item btn-sm disabled:bg-stone-100"
        onClick={() => handlePageChange("next", totalPages)}
        disabled={disabledNext}
      >
        Next
      </button>
    </div>
  );
}

export default Pagination;
