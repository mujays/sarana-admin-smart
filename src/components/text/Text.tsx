import React from "react";
import { Typography } from "antd";
import { WithStyle } from "@/types/styles";
const { Text: Text_ } = Typography;

export type TText = {
  children: React.ReactNode;
  ellipsis?: boolean;
};

/**
 * When to use: Use this when you need inline text content. Renders a span tag
 */
export const Text = (props: WithStyle<TText>) => {
  return <Text_ style={{ width: "100%", ...props.style }} {...props} />;
};
