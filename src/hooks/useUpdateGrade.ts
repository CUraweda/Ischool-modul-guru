import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { instance } from "../middleware/api-hrd";
import { PayloadUpdateGrade } from "../types/jobdesk";

export const putGradePenilaian = async (payload: PayloadUpdateGrade) => {
  const { id, ...rest } = payload;
  const { data } = await instance
    .put(`/employee-jobdesk/grade/${id}`, { ...rest })
    .then((data) => data);
  return data;
};

export const usePutGradePenilaian = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  options?: UseMutationOptions<any, Error, PayloadUpdateGrade, unknown>
) => {
  return useMutation({
    mutationFn: (payload: PayloadUpdateGrade) => putGradePenilaian(payload),
    ...options,
  });
};
