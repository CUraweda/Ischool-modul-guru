import { instance } from "../middleware/api-hrd";
import { SearchParams } from "../types/common";

export const getAllJobdesk = async (searchParams?: SearchParams) => {
  const data = await instance
    .get("/employee-jobdesk", {
      params: {
        limit: searchParams?.limit,
        search: searchParams?.search,
        page: searchParams?.page,
      },
    })
    .then(({ data }) => data);
  return data;
};
