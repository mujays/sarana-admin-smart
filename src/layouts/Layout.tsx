import { ReactNode } from "react";

import { LayoutBase } from "./LayoutBase";

type TLayout = {
  children: ReactNode;
};

export const Layout = (props: TLayout) => {
  return <LayoutBase>{props.children}</LayoutBase>;
};
