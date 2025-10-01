import axiosConfig from "@/config/axios";
import { BaseResponse, BaseResponsePaginate } from "../base-response.type";
import { TJemputan } from "./jemputan.type";

const JemputanServices = {
  get: async (params?: any) => {
    const response = await axiosConfig.get<BaseResponsePaginate<TJemputan>>(
      "/pickup",
      {
        params,
      },
    );
    return response.data;
  },
  getOne: async (pickupId: number) => {
    const response = await axiosConfig.get<BaseResponse<TJemputan>>(
      `/pickup/${pickupId}`,
      {
        params: {
          with: "siswa",
        },
      },
    );
    return response.data;
  },
  update: async (pickupId: number, payload: any) => {
    const response = await axiosConfig.put<BaseResponse<TJemputan>>(
      `/pickup/${pickupId}`,
      payload,
    );
    return response.data;
  },
  check: async (code: string) => {
    const response = await axiosConfig.post<BaseResponse<TJemputan>>(`pickup`, {
      code,
    });
    return response.data;
  },
};

export default JemputanServices;
