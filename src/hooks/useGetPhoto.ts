import { useQuery } from "@tanstack/react-query";
import { instance } from "../middleware/api-hrd";
import { ApiResponse, DataPagination } from "../types/common";

export const getPhoto = async (path: string | null) => {
  const data = await instance
    .get(`/student-task/download?filepath=${path}`)
    .then(({ data }) => data);
  return data;
};

export const useGetPhoto = (path: string | null) =>
  useQuery<ApiResponse<DataPagination<unknown>>, Error>({
    queryKey: ["useGetPhoto"],
    queryFn: () => getPhoto(path),
  });
