import axiosConfig from "@/config/axios";
import axiosConfigFinance from "@/config/axios.finance";
import { BaseResponse } from "../base-response.type";
import { TUser } from "./auth.types";

const AuthService = {
  me: async () => {
    const response = await axiosConfig.get<BaseResponse<TUser>>("/auth");
    return response.data;
  },
  healthCheck: async () => {
    const response = await axiosConfig.get<{ status: string }>("/health");
    return response.data;
  },
  healthCheckKeuangan: async () => {
    const response = await axiosConfigFinance.get<{ status: string }>(
      "/health",
    );
    return response.data;
  },
};

export default AuthService;
