import axiosConfig from "@/config/axios";
import { BaseResponse, BaseResponsePaginate } from "../base-response.type";
import { TWali } from "./wali.type";

const WaliService = {
  create: async (payload: any) => {
    const response = await axiosConfig.post<BaseResponsePaginate<TWali>>(
      "/wali",
      payload,
    );
    return response.data;
  },
  update: async (waliId: number, payload: any) => {
    const response = await axiosConfig.put<BaseResponsePaginate<TWali>>(
      `/wali/${waliId}`,
      payload,
    );
    return response.data;
  },
  get: async (params?: any) => {
    const response = await axiosConfig.get<BaseResponsePaginate<TWali>>(
      "/wali",
      {
        params,
      },
    );
    return response.data;
  },
  import: async (formData: FormData) => {
    const response = await axiosConfig.postForm<BaseResponse<TWali>>(
      `/wali/import`,
      formData,
    );
    return response.data;
  },
  getOne: async (waliId: number) => {
    const response = await axiosConfig.get<BaseResponse<TWali>>(
      `/wali/${waliId}`,
      {
        params: {
          with: "siswa",
        },
      },
    );
    return response.data;
  },
  delete: async (waliId: number) => {
    const response = await axiosConfig.delete<BaseResponse<TWali>>(
      `/wali/${waliId}`,
    );
    return response.data;
  },
  deleteMultiple: async (waliIds: number[]) => {
    const response = await axiosConfig.delete<BaseResponse<TWali>>(`/wali`, {
      data: {
        id: waliIds,
      },
    });
    return response.data;
  },
};

export default WaliService;
