import { useQuery } from "@tanstack/react-query";
import { ApiResponse, DataPagination, SearchParams } from "../types/common";
import { Jobdesk } from "../types/jobdesk";
import { instance } from "../middleware/api-hrd";
import { filterParams } from "../utils/common";
import { employeeStore } from "../store/Store";

export const getAllJobdesk = async (
  params?: SearchParams & { employee_id: number }
) => {
  const data = await instance
    .get("/employee-jobdesk", {
      params: filterParams(params),
    })
    .then(({ data }) => data);
  return data;
};

export const useGetAllJobdesk = (searchParams?: SearchParams) => {
  const { employee } = employeeStore();
  return useQuery<ApiResponse<DataPagination<Jobdesk>>, Error>({
    queryKey: ["getAllJobdesk", searchParams],
    queryFn: () => getAllJobdesk({ ...searchParams, employee_id: employee.id }),
  });
};
