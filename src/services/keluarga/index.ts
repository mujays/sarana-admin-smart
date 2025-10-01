import axiosConfig from "@/config/axios";
import { BaseResponse, BaseResponsePaginate } from "../base-response.type";
import { TKeluarga } from "./keluarga.type";

const KeluargaServices = {
  create: async (payload: any) => {
    const response = await axiosConfig.post<BaseResponsePaginate<TKeluarga>>(
      "/keluarga",
      payload,
    );
    return response.data;
  },
  update: async (keluargaId: number, payload: any) => {
    const response = await axiosConfig.put<BaseResponsePaginate<TKeluarga>>(
      `/keluarga/${keluargaId}`,
      payload,
    );
    return response.data;
  },
  get: async (params?: any) => {
    const response = await axiosConfig.get<BaseResponsePaginate<TKeluarga>>(
      "/keluarga",
      {
        params,
      },
    );
    return response.data;
  },
  getOne: async (keluargaId: number) => {
    const response = await axiosConfig.get<BaseResponse<TKeluarga>>(
      `/keluarga/${keluargaId}`,
    );
    return response.data;
  },
  delete: async (keluargaId: number) => {
    const response = await axiosConfig.delete<BaseResponse<TKeluarga>>(
      `/keluarga/${keluargaId}`,
    );
    return response.data;
  },
};

export default KeluargaServices;
