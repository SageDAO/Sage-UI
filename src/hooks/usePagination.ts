import { useMemo } from "react";

interface PaginationArgs {
  totalCount: number;
  pageSize: number;
  siblingCount?: number;
  currentPage: number;
}

export default function usePagination({
  totalCount,
  pageSize,
  siblingCount,
  currentPage,
}: PaginationArgs) {
  const paginationRange = useMemo(() => {}, [totalCount, pageSize, siblingCount, currentPage]);

  return paginationRange;
}
