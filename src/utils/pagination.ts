export const calcPagination = (
  count: number,
  total: number,
  currentPage: number
): number[] => {
  const half = Math.floor(count / 2);
  let start = Math.max(0, currentPage - half);
  let end = start + count;

  if (end > total) {
    end = total;
    start = Math.max(0, end - count);
  }

  return Array.from({ length: end - start }, (_, i) => start + i);
};

export const minimumPaginationPage = (
  pageCount: number,
  minimumPaginationNumber: number
) => Math.max(pageCount ?? 0, minimumPaginationNumber);

export const numberOfTable = (
  index: number,
  currentPage: number,
  pageCount: number
) => (currentPage * pageCount) + (index + 1);
