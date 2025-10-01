import React from "react";
import { Typography } from "antd";
import { WithStyle } from "@/types/styles";
import { TEllipsis } from "@/types/typography";
const { Paragraph: Paragraph_ } = Typography;

export type TText = {
  children: React.ReactNode;
  ellipsis?: TEllipsis;
};

/**
 * When to use: Use this when you need block text content. Renders a p tag
 */
export const Paragraph = (props: WithStyle<TText>) => {
  return <Paragraph_ {...props} />;
};
