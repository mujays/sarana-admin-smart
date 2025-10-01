import React from "react";
import { Form as _Form, FormRule, FormItemProps } from "antd";
import { WithStyle } from "@/types/styles";

type TFormItem = {
  label?: string;
  name?: string;
  rules?: FormRule[];
  children: FormItemProps["children"];
};
export const FormItem = (props: WithStyle<TFormItem>) => {
  return <_Form.Item {...props} />;
};
