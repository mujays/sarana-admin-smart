import axiosConfig from "@/config/axios";
import { BaseResponse } from "../base-response.type";
import { TUser } from "./auth.types";

const AuthService = {
  me: async () => {
    const response = await axiosConfig.get<BaseResponse<TUser>>("/auth");
    return response.data;
  },
};

export default AuthService;
