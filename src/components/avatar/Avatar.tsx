import React from "react";
import { Avatar as _Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";

type TAvatar = {
  src?: string;
};
export const Avatar = (props: TAvatar) => {
  return (
    <_Avatar
      src={props.src}
      icon={!props.src ? <UserOutlined /> : undefined}
      size="large"
      shape="circle"
    />
  );
};
