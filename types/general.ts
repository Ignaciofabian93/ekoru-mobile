export type PageInfo = {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string;
  endCursor: string;
  totalCount: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
};
