import { useMutation, useQueryClient } from "@tanstack/react-query";
import { instance } from "../middleware/api-hrd";

export const deleteJobdesk = async (id: number) => {
  const data = await instance
    .delete(`employee-jobdesk/delete/${id}`)
    .then(({ data }) => data);
  return data;
};

export const useDeleteJobdesk = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteJobdesk(id),
    onSuccess: () =>
      queryClient.refetchQueries({
        queryKey: ["getAllJobdesk"],
        type: "active",
      }),
  });
};
