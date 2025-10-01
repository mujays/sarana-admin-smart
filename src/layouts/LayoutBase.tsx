import { ReactNode } from "react";

import { WithStyle } from "@/types/styles";

type TLayout = {
  children: ReactNode;
};
export const LayoutBase = (props: WithStyle<TLayout>) => {
  return <div>{props.children}</div>;
};
