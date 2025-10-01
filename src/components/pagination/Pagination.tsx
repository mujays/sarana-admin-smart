import { Pagination as _Pagination } from "antd";
import React from "react";

import { WithStyle } from "@/types/styles";
import Link from "next/link";

type TPagination = {
  total: number;
  linkPrefix: string;
  defaultPageSize?: number;
  defaultCurrent?: number;
};

/**
 * When to use: When need to divide a long list to several pages in server side data fetching
 */
export const Pagination = (props: WithStyle<TPagination>) => {
  return (
    <_Pagination
      hideOnSinglePage
      showSizeChanger={false}
      itemRender={(page, type, el) => {
        if (type === "page") {
          return <Link href={`${props.linkPrefix}/${page}`}>{page}</Link>;
        } else {
          return el;
        }
      }}
      {...props}
    />
  );
};
