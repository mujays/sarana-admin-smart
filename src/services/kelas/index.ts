import axiosConfig from "@/config/axios";
import { BaseResponse, BaseResponsePaginate } from "../base-response.type";
import { TKelas } from "./kelas.type";

const KelasServices = {
  create: async (payload: any) => {
    const response = await axiosConfig.post<BaseResponsePaginate<TKelas>>(
      "/kelas",
      payload,
    );
    return response.data;
  },
  update: async (kelasId: number, payload: any) => {
    const response = await axiosConfig.put<BaseResponsePaginate<TKelas>>(
      `/kelas/${kelasId}`,
      payload,
    );
    return response.data;
  },
  get: async (params?: any) => {
    const response = await axiosConfig.get<BaseResponsePaginate<TKelas>>(
      "/kelas",
      {
        params,
      },
    );
    return response.data;
  },
  getOne: async (kelasId: number, params?: any) => {
    const response = await axiosConfig.get<BaseResponse<TKelas>>(
      `/kelas/${kelasId}`,
      { params },
    );
    return response.data;
  },
  delete: async (kelasId: number) => {
    const response = await axiosConfig.delete<BaseResponse<TKelas>>(
      `/kelas/${kelasId}`,
    );
    return response.data;
  },
};

export default KelasServices;
