import { Pagination as _Pagination } from "antd";
import React from "react";

import { WithStyle } from "@/types/styles";
import Link from "next/link";

type TPagination = {
  total: number;
  onChange?: (page: number) => void;
  defaultPageSize?: number;
  current?: number;
};

/**
 * When to use: When need to divide a long list to several pages in client side data fetching
 */
export const PaginationCSR = ({
  onChange,
  ...restOfProps
}: WithStyle<TPagination>) => {
  return (
    <_Pagination
      hideOnSinglePage
      showSizeChanger={false}
      onChange={(page) => {
        if (onChange) {
          onChange(page);
        }
      }}
      {...restOfProps}
    />
  );
};
