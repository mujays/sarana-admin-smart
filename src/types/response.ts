export type ResponseMockupDto<T> = {
  success: boolean;
  message: string;
  code: number;
  data: T;
};

export type ResponseMockupPaginateDto<T> = {
  success: boolean;
  message: string;
  code: number;
  data: T;
  meta: {
    next_page_url: null | number;
    prev_page_url: null | number;
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
};

export type TotalOnly = {
  total: number;
};
