import React from "react";
import { Spin as _Spin } from "antd";

type TSpin = {
  size?: "small" | "default" | "large";
  delay?: number;
};
export const Spin = ({ size = "default", ...restOfProps }: TSpin) => {
  return <_Spin size={size} {...restOfProps} />;
};
