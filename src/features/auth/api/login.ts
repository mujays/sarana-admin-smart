import axiosConfig from "@/config/axios";
import { TLoginRequest, TLoginResponse } from "@/services/auth/auth.types";

export const login = (props: TLoginRequest) => {
  return axiosConfig.post<TLoginResponse>("/login", {
    email: props.email,
    password: props.password,
  });
};
