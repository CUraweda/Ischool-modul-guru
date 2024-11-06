export type DataPagination<T> = {
    result: T[];
    page: number;
    limit: number;
    totalRows: number;
    totalPage: number;
  };
  
  export type ApiResponse<T> = {
    status: boolean;
    code: number;
    message: string;
    data: T;
  };

export type SearchParams = Partial<{
  limit: number;
  search: string;
  page: number;
}>;
