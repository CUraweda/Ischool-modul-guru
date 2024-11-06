import { useSearchParams } from "react-router-dom";

export function usePagination(initialLimit = 10) {
  const [searchParams, setSearchParams] = useSearchParams();

  const getPageFromParams = (paramName: string, defaultValue: number) =>
    searchParams.get(paramName) ? +searchParams.get(paramName)! : defaultValue;

  const updateSearchParams = (newPage: number) => {
    setSearchParams(
      new URLSearchParams({
        ...Object.fromEntries(searchParams),
        page: newPage.toString(),
      })
    );
  };

  const filter = {
    search: searchParams.get("search") ?? "",
    page: getPageFromParams("page", 0),
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
    } else if (pageDirection === "prev" && currentPage > 0) {
      newPage = currentPage - 1;
    } else if (pageDirection === "next" && currentPage < totalPages - 1) {
      newPage = currentPage + 1;
    }

    updateSearchParams(newPage);
  };

  const handleSearchParams = (value: string) => {
    setSearchParams(
      new URLSearchParams({
        search: value,
      })
    );
  };

  return { filter, handlePageChange, handleSearchParams };
}
