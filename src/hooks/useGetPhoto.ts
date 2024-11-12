import { useQuery } from "@tanstack/react-query";
import { instance } from "../middleware/api-hrd";
import { ApiResponse, DataPagination } from "../types/common";
import { Division } from "../types/division";

export const getPhoto = async (path: string | null) => {
  const data = await instance
    .get(`/student-task/download?filepath=${path}`)
    .then(({ data }) => data);
  return data;
};

export const useGetPhoto = (path: string | null) =>
  useQuery<ApiResponse<DataPagination<Division>>, Error>({
    queryKey: ["useGetPhoto"],
    queryFn: () => getPhoto(path),
  });
