import { useQuery } from "@tanstack/react-query";
import { instance } from "../middleware/api-hrd";
import { ApiResponse, DataPagination, SearchParams } from "../types/common";
import { Jobdesk } from "../types/jobdesk";
import { filterParams } from "../utils/common";

export const getAllJobdesk = async (params?: Record<string, unknown>) => {
  const data = await instance
    .get("/employee-jobdesk", {
      params: filterParams(params),
    })
    .then(({ data }) => data);
  return data;
};

export const useGetAllJobdesk = (
  params?: SearchParams & Record<string, unknown>
) => {
  return useQuery<ApiResponse<DataPagination<Jobdesk>>, Error>({
    queryKey: ["getAllJobdesk", JSON.stringify(params)],
    queryFn: () => getAllJobdesk({ ...params }),
  });
};
