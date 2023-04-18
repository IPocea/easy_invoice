export interface IEditDeleteResponse {
  message: string;
}

export interface ITableFilters {
  pageIndex?: string;
  pageSize?: string;
  sortBy?: string;
  searchValue?: string;
  sortDirection?: string;
}