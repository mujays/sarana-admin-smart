import { Typography } from "antd";
import React, { ReactNode } from "react";
import { default as NextLink, LinkProps as NextLinkProps } from "next/link";

import { WithStyle } from "@/types/styles";

type TLinkNext = {
  type: "next-link";
} & Omit<NextLinkProps, "href" | "children">;

type TLinkNotNext = {
  type: "normal-link";
  target?: React.HTMLAttributeAnchorTarget;
};

type TLink = (TLinkNext | TLinkNotNext) & {
  href: string;
  children: ReactNode;
};

/**
 * When to use: Use this when you need a link. Supports next link and regular link
 */
export const Link = (props: WithStyle<TLink>) => {
  return props.type === "next-link" ? (
    <NextLink legacyBehavior prefetch={false} {...props} href={props.href}>
      <Typography.Link className={props.className}>
        {props.children}
      </Typography.Link>
    </NextLink>
  ) : (
    <Typography.Link
      href={props.href}
      target={props.target}
      className={props.className}
    >
      {props.children}
    </Typography.Link>
  );
};
