import { useQuery } from "@tanstack/react-query";
import { instance } from "../middleware/api-hrd";
import { ApiResponse, DataPagination } from "../types/common";
import { Employee } from "../types/employee";
import { filterParams } from "../utils/common";

export const getAllEmployee = async <T>(params?: T) => {
  const data = await instance
    .get("/employee", {
      params: filterParams(params as Record<string, unknown>),
    })
    .then(({ data }) => data);
  return data;
};

export const useGetAllEmployee = <T>(searchParams?: T) => {
  return useQuery<ApiResponse<DataPagination<Employee>>, Error>({
    queryKey: ["getAllEmployee", searchParams],
    queryFn: () =>
      getAllEmployee({
        ...searchParams,
        sort_name: 1
      }),
  });
};
