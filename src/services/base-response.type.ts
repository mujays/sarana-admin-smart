export type BaseResponse<T> = {
  message: string;
  data: T;
};

export type BaseRequestParams = {
  limit?: number;
  page?: number;
  q?: string;
};

export type BaseResponsePaginate<T> = {
  message: string;
  data: T[];
  meta: {
    next_page_url?: null | string;
    prev_page_url?: null | string;
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
};
