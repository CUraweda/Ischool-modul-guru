import { useState } from "react";
import Icon from "../../../assets/icon";
import useSearchParams from "../../../hooks/useSearchParams";

function Search() {
  const { getSearchParam } = useSearchParams();
  const [search, setSearch] = useState(getSearchParam("search"));
  const { handleSearchParams } = useSearchParams();

  return (
    <label className="h-8 text-md input input-md input-bordered flex items-center gap-2 md:w-3/12">
      <Icon name="search" />
      <input
        type="text"
        className="grow"
        placeholder="Search"
        value={search}
        onKeyDown={(e) =>
          e.key === "Enter" &&
          handleSearchParams({ search: e.currentTarget.value })
        }
        onChange={(e) => setSearch(e.target.value)}
      />
    </label>
  );
}

export default Search;
