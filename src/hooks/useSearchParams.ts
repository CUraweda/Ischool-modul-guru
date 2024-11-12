import { useLocation, useNavigate } from "react-router-dom";
import { useSearchParams as useReactRouterSearchParams } from "react-router-dom";
import { filterParams } from "../utils/common";
import queryString from "query-string";

function useSearchParams() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useReactRouterSearchParams();

  const handleSearchParams = (params: Record<string, unknown> = {}) => {
    const currentParams = Object.fromEntries(
      new URLSearchParams(location.search).entries()
    );
    const combinedParams = { ...currentParams, ...params };
    const search = queryString.stringify(filterParams(combinedParams));
    navigate(`${location.pathname}?${search}`, { replace: true });
  };

  const getPageFromParams = (paramName: string, defaultValue: number) =>
    searchParams.get(paramName) ? +searchParams.get(paramName)! : defaultValue;

  const getSearchParam = (name: string) => searchParams.get(name) ?? "";

  const getSplitSearchParam = (key: string) =>
    getSearchParam(key)?.split(",").filter(Boolean) || [];

  return {
    getPageFromParams,
    handleSearchParams,
    getSearchParam,
    getSplitSearchParam,
  };
}

export default useSearchParams;
