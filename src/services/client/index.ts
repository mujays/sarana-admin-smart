import axiosConfigFinance from "@/config/axios.finance";
import { BaseResponse, BaseResponsePaginate } from "../base-response.type";
import { TApps, TBalance, TClient, TWithdraw } from "./client.type";

const ClientService = {
  getWithdraw: async (params: any) => {
    const response = await axiosConfigFinance.get<
      BaseResponsePaginate<TWithdraw>
    >("/withdraw", {
      params,
    });
    return response.data;
  },
  addWithdraw: async (payload: any, type: string) => {
    const response = await axiosConfigFinance.post<BaseResponse<TWithdraw>>(
      `/withdraw`,
      payload,
      {
        params: {
          type,
        },
      },
    );
    return response.data;
  },
  updateWithdraw: async (id: number, payload: any) => {
    const response = await axiosConfigFinance.put<BaseResponse<TWithdraw>>(
      `/withdraw/${id}`,
      payload,
    );
    return response.data;
  },
  getOneWithdraw: async (id: number) => {
    const response = await axiosConfigFinance.get<BaseResponse<TWithdraw>>(
      `/withdraw/${id}`,
    );
    return response.data;
  },
  deleteWithdraw: async (id: number) => {
    const response = await axiosConfigFinance.delete<BaseResponse<TWithdraw>>(
      `/withdraw/${id}`,
    );
    return response.data;
  },
  getApp: async () => {
    const response = await axiosConfigFinance.get<BaseResponse<TApps>>("/apps");
    return response.data;
  },
  getClient: async (params?: any) => {
    const response = await axiosConfigFinance.get<BaseResponse<TClient>>(
      "/client",
      { params },
    );
    return response.data;
  },
  getBalance: async (params?: any) => {
    const response = await axiosConfigFinance.get<
      BaseResponse<BaseResponse<TBalance>>
    >("/check-balance", { params });
    return response.data;
  },
  updateClient: async (payload: TClient) => {
    const response = await axiosConfigFinance.put<BaseResponse<TClient>>(
      "/client",
      payload,
    );
    return response.data;
  },
};

export default ClientService;
