import axiosConfig from "@/config/axios";
import { BaseResponse, BaseResponsePaginate } from "../base-response.type";
import { TTahunAjaran } from "./tahun-ajaran.type";

const TahunAjaranService = {
  create: async (payload: any) => {
    const response = await axiosConfig.post<BaseResponsePaginate<TTahunAjaran>>(
      "/tahun_ajaran",
      payload,
    );
    return response.data;
  },
  update: async (tahunAjaranId: number, payload: any) => {
    const response = await axiosConfig.put<BaseResponsePaginate<TTahunAjaran>>(
      `/tahun_ajaran/${tahunAjaranId}`,
      payload,
    );
    return response.data;
  },
  get: async (params?: any) => {
    const response = await axiosConfig.get<BaseResponsePaginate<TTahunAjaran>>(
      "/tahun_ajaran",
      {
        params,
      },
    );
    return response.data;
  },
  getOne: async (tahunAjaranId: number) => {
    const response = await axiosConfig.get<BaseResponse<TTahunAjaran>>(
      `/tahun_ajaran/${tahunAjaranId}`,
    );
    return response.data;
  },
  delete: async (tahunAjaranId: number) => {
    const response = await axiosConfig.delete<BaseResponse<TTahunAjaran>>(
      `/tahun_ajaran/${tahunAjaranId}`,
    );
    return response.data;
  },
};

export default TahunAjaranService;
