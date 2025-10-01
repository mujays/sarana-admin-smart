import axiosConfig from "@/config/axios";
import { BaseResponse, BaseResponsePaginate } from "../base-response.type";
import { TRiwayat } from "./riwayat.type";

const RiwayatServices = {
  create: async (payload: any) => {
    const response = await axiosConfig.post<BaseResponsePaginate<TRiwayat>>(
      "/riwayat",
      payload,
    );
    return response.data;
  },
  update: async (riwayatId: number, payload: any) => {
    const response = await axiosConfig.put<BaseResponsePaginate<TRiwayat>>(
      `/riwayat/${riwayatId}`,
      payload,
    );
    return response.data;
  },
  get: async (params?: any) => {
    const response = await axiosConfig.get<BaseResponsePaginate<TRiwayat>>(
      "/riwayat",
      {
        params,
      },
    );
    return response.data;
  },
  getOne: async (riwayatId: number) => {
    const response = await axiosConfig.get<BaseResponse<TRiwayat>>(
      `/riwayat/${riwayatId}`,
    );
    return response.data;
  },
  delete: async (riwayatId: number) => {
    const response = await axiosConfig.delete<BaseResponse<TRiwayat>>(
      `/riwayat/${riwayatId}`,
    );
    return response.data;
  },
};

export default RiwayatServices;
