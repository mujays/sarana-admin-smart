import CSS from "csstype";

export type WithStyle<T = unknown> = T & {
  className?: string;
  style?: CSS.Properties;
};
