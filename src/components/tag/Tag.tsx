import React from "react";
import { Tag as _Tag } from "antd";
import { WithStyle } from "@/types/styles";
import classNames from "classnames";

import styles from "./style.module.css";

type TTagType = "dark" | "light" | "default";
export type TTag = {
  children: string;
  type?: TTagType;
  onClick?: () => void;
};

/**
 * When to use: Use this when you need to categorize or markup
 */
export const Tag = ({ type = "default", ...restOfProps }: WithStyle<TTag>) => {
  return (
    <_Tag
      {...restOfProps}
      className={classNames(
        {
          [styles.dark]: type === "dark",
          [styles.light]: type === "light",
        },
        styles.root,
        restOfProps.className,
      )}
    />
  );
};
