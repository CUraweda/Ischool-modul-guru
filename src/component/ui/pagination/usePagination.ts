import useSearchParams from "../../../hooks/useSearchParams";

export function usePagination(initialLimit = 10) {
  const { getPageFromParams, handleSearchParams } = useSearchParams();

  const filter = {
    page: getPageFromParams("page",1),
    limit: initialLimit,
  };

  const handlePageChange = (
    pageDirection: number | "prev" | "next",
    totalPages: number
  ) => {
    const currentPage = filter.page;
    let newPage = currentPage;

    if (typeof pageDirection === "number") {
      newPage = pageDirection;
    } else if (pageDirection === "prev" && currentPage > 1) {
      newPage = currentPage - 1;
    } else if (pageDirection === "next" && currentPage < totalPages - 1) {
      newPage = currentPage + 1;
    }

    handleSearchParams({ page: newPage });
  };

  return {
    filter,
    handlePageChange,
  };
}
