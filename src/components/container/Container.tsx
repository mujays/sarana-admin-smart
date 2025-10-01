import { ReactNode } from "react";
import classNames from "classnames";

import styles from "./styles.module.css";
import { WithStyle } from "@/types/styles";

type TContainer = {
  children: ReactNode;
};

/**
 * When to use: To constrain a content's width to the current breakpoint, while keeping it fluid
 */

export const Container = (props: WithStyle<TContainer>) => {
  return (
    <div
      className={classNames(styles.root, props.className)}
      style={props.style}
    >
      {props.children}
    </div>
  );
};
