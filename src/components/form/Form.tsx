import React, { ReactNode } from "react";
import { FormInstance, Form as _Form, FormProps as _TForm } from "antd";
import { FormItem } from "./FormItem";
import { WithStyle } from "@/types/styles";

export type TFormInstance = FormInstance;
export type TForm = {
  onFinish?: (values: any) => void;
  children: ReactNode;
  initialValues?: _TForm["initialValues"];
  form?: TFormInstance;
};
export const Form = (props: WithStyle<TForm>) => {
  return <_Form layout="vertical" requiredMark="optional" {...props} />;
};

Form.Item = FormItem;
Form.useForm = _Form.useForm;
