import { Button as _Button, ButtonProps } from "antd";
import { WithStyle } from "@/types/styles";
import classNames from "classnames";
import styles from "./styles.module.css";

type TButton = {} & ButtonProps;
export const Button = (props: WithStyle<TButton>) => {
  return (
    <_Button
      type="default"
      className={classNames(props.className, {
        [styles.link]: props.type === "link",
      })}
      {...props}
    />
  );
};
