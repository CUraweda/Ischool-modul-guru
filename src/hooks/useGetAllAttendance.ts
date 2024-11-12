import { useQuery } from "@tanstack/react-query";
import queryString from "query-string";
import { instance } from "../middleware/api-hrd";
import { employeeStore } from "../store/Store";
import { Attendance } from "../types/attendance";
import { ApiResponse, DataPagination } from "../types/common";

type SearchParams = Record<string, unknown>;

export const getAllEmployeeAttendance = async (params?: string) => {
  const data = await instance
    .get(`/employee-attendance?${params}`)
    .then(({ data }) => data);
  return data;
};

export const useGetAllEmployeeAttendance = (searchParams?: SearchParams) => {
  const { employee } = employeeStore();
  return useQuery<ApiResponse<DataPagination<Attendance>>, Error>({
    queryKey: ["getAllEmployeeAttendance", searchParams],
    queryFn: () =>
      getAllEmployeeAttendance(
        queryString.stringify(
          { ...searchParams, employee_id: employee.id },
          { arrayFormat: "comma" }
        )
      ),
  });
};
