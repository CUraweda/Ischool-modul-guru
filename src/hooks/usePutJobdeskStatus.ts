import { useMutation, useQueryClient } from "@tanstack/react-query";
import { instance } from "../middleware/api-hrd";

export const putJobdeskStatus = async (status: number) => {
  const data = await instance
    .put(`/employee-jobdesk/finish/${status}`)
    .then(({ data }) => data);
  return data;
};

export const usePutJobdeskStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (status: number) => putJobdeskStatus(status),
    onSuccess: () =>
      queryClient.refetchQueries({
        queryKey: ["getAllJobdesk"],
        type: "active",
      }),
  });
};
