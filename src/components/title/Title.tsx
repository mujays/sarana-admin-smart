import React from "react";
import { Typography } from "antd";
import { WithStyle } from "@/types/styles";
import { TEllipsis } from "@/types/typography";
const { Title: Title_ } = Typography;

export type TTitle = {
  children: React.ReactNode;
  level: 1 | 2 | 3 | 4 | 5;
  ellipsis?: TEllipsis;
};

/**
 * When to use: Use this when you need text for headings. Renders h[X] tag. The X depends on level prop
 */
export const Title = (props: WithStyle<TTitle>) => {
  return <Title_ style={{ width: "100%", ...props.style }} {...props} />;
};
