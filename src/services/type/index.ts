import axiosConfigFinance from "@/config/axios.finance";
import { BaseResponse, BaseResponsePaginate } from "../base-response.type";
import { TType, TTypeAdmission } from "./type.type";

const TypeServices = {
  create: async (payload: any) => {
    const response = await axiosConfigFinance.post<BaseResponsePaginate<TType>>(
      "/tagihan-type",
      payload,
    );
    return response.data;
  },
  createAdmissionType: async (payload: any) => {
    const response = await axiosConfigFinance.post<
      BaseResponsePaginate<TTypeAdmission>
    >("/tipe-uang-pangkal", payload);
    return response.data;
  },
  updateAdmissionType: async (typeId: number, payload: any) => {
    const response = await axiosConfigFinance.put<
      BaseResponsePaginate<TTypeAdmission>
    >(`/tipe-uang-pangkal/${typeId}`, payload);
    return response.data;
  },
  update: async (typeId: number, payload: any) => {
    const response = await axiosConfigFinance.put<BaseResponsePaginate<TType>>(
      `/tagihan-type/${typeId}`,
      payload,
    );
    return response.data;
  },
  get: async (params?: any) => {
    const response = await axiosConfigFinance.get<BaseResponsePaginate<TType>>(
      "/tagihan-type",
      {
        params,
      },
    );
    return response.data;
  },
  getAdmissionType: async (params?: any) => {
    const response = await axiosConfigFinance.get<
      BaseResponsePaginate<TTypeAdmission>
    >("/tipe-uang-pangkal", {
      params,
    });
    return response.data;
  },
  getOne: async (typeId: number, params?: any) => {
    const response = await axiosConfigFinance.get<BaseResponse<TType>>(
      `/tagihan-type/${typeId}`,
      { params },
    );
    return response.data;
  },
  getOneAdmissionType: async (typeId: number, params?: any) => {
    const response = await axiosConfigFinance.get<BaseResponse<TTypeAdmission>>(
      `/tipe-uang-pangkal/${typeId}`,
      { params },
    );
    return response.data;
  },
  delete: async (typeId: number) => {
    const response = await axiosConfigFinance.delete<BaseResponse<TType>>(
      `/tagihan-type/${typeId}`,
    );
    return response.data;
  },
  deleteAdmissionType: async (typeId: number) => {
    const response = await axiosConfigFinance.delete<
      BaseResponse<TTypeAdmission>
    >(`/tipe-uang-pangkal/${typeId}`);
    return response.data;
  },
};

export default TypeServices;
