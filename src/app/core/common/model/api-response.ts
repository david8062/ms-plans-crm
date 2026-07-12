export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
  timestamp: string;
}

export interface ListResponse<T> {
  status: number;
  message: string;
  data: T[];
  timestamp: string;
}

export interface PagedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
  timestamp: string;
}

export interface ApiError {
  status: number;
  code?: string;
  message: string;
  timestamp: string;
}
