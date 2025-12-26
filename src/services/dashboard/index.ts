import axiosConfig from "@/config/axios";
import { BaseResponse, BaseResponsePaginate } from "../base-response.type";
import { DashboardResponse, DashboardKeuanganResponse } from "./dashboard.type";
import axiosConfigFinance from "@/config/axios.finance";

const DashboardServices = {
  getKesiswaan: async (params?: any) => {
    const response = await axiosConfig.get<BaseResponse<DashboardResponse>>(
      "/dashboard",
      {
        params,
      },
    );
    return response.data;
  },
  getKeuangan: async () => {
    const response = await axiosConfigFinance.get<
      BaseResponse<DashboardKeuanganResponse>
    >(`/dashboard`);
    return response.data;
  },
};

export default DashboardServices;
