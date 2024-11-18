import { useQuery } from "@tanstack/react-query";
import { instance } from "../middleware/api-hrd";
import { ApiResponse, DataPagination } from "../types/common";
import { Division } from "../types/division";

export const getDivision = async () => {
  const data = await instance.get("/division").then(({ data }) => data);
  return data;
};

export const useGetDivision = () =>
  useQuery<ApiResponse<DataPagination<Division>>, Error>({
    queryKey: ["getDivision"],
    queryFn: getDivision,
  });
