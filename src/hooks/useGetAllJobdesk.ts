import { useQuery } from "@tanstack/react-query";
import { getAllJobdesk } from "../services/jobdesk";
import { ApiResponse, DataPagination, SearchParams } from "../types/common";
import { Jobdesk } from "../types/jobdesk";

export const useGetAllJobdesk = (searchParams?: SearchParams, key?: string) =>
  useQuery<ApiResponse<DataPagination<Jobdesk>>, Error>({
    queryKey: ["getAllJobdesk", key],
    queryFn: () => getAllJobdesk(searchParams),
  });
