import axiosConfigFinance from "@/config/axios.finance";
import { ResponseMockupDto } from "@/types/response";
import { BaseResponse, BaseResponsePaginate } from "../base-response.type";
import {
  TTagihan,
  TTagihanAdmission,
  TTransaction,
  TTransactionAdmission,
} from "./tagihan.type";

const TagihanService = {
  sync: async (payload: any) => {
    const response = await axiosConfigFinance.patch<
      BaseResponsePaginate<TTagihan>
    >("/tagihan/bulk", payload);
    return response.data;
  },
  create: async (payload: any) => {
    const response = await axiosConfigFinance.post<
      BaseResponsePaginate<TTagihan>
    >("/tagihan", payload);
    return response.data;
  },
  createAdmission: async (payload: any) => {
    const response = await axiosConfigFinance.post<
      BaseResponsePaginate<TTagihanAdmission>
    >("/uang-pangkal", payload);
    return response.data;
  },
  update: async (typeId: number, payload: any) => {
    const response = await axiosConfigFinance.put<
      BaseResponsePaginate<TTagihan>
    >(`/tagihan/${typeId}`, payload);
    return response.data;
  },
  updateAdmission: async (typeId: number, payload: any) => {
    const response = await axiosConfigFinance.put<
      BaseResponsePaginate<TTagihanAdmission>
    >(`/uang-pangkal/${typeId}`, payload);
    return response.data;
  },
  updateLunas: async (payload: any) => {
    const response = await axiosConfigFinance.post<
      BaseResponsePaginate<TTagihanAdmission>
    >(`/uang-pangkal/bulk-auto-lunas`, payload);
    return response.data;
  },
  getTrx: async (params?: any) => {
    const response = await axiosConfigFinance.get<
      BaseResponsePaginate<TTransaction>
    >("/transaction", {
      params,
    });
    return response.data;
  },
  getOneTrx: async (id: number) => {
    const response = await axiosConfigFinance.get<BaseResponse<TTransaction>>(
      "/transaction" + `/${id}`,
    );
    return response.data;
  },
  getTrxAdmission: async (params?: any) => {
    const response = await axiosConfigFinance.get<
      BaseResponsePaginate<TTransactionAdmission>
    >("/transaction-uang-pangkal", {
      params,
    });
    return response.data;
  },
  updateStatusTrx: async (id: number, payload: { status: string }) => {
    const response = await axiosConfigFinance.patch<
      ResponseMockupDto<TTransaction[]>
    >(`/transaction/${id}`, payload);
    return response.data;
  },
  updateStatusTrxAdmission: async (id: number, payload: { status: string }) => {
    const response = await axiosConfigFinance.patch<
      ResponseMockupDto<TTransactionAdmission>
    >(`/transaction-uang-pangkal/${id}`, payload);
    return response.data;
  },
  createTrxAdmission: async (payload: any) => {
    const response = await axiosConfigFinance.post<
      ResponseMockupDto<TTransactionAdmission>
    >(`/transaction-uang-pangkal`, payload);
    return response.data;
  },
  get: async (params?: any) => {
    const response = await axiosConfigFinance.get<
      BaseResponsePaginate<TTagihan>
    >("/tagihan", {
      params,
    });
    return response.data;
  },
  generateTagihan: async ({
    idKelas,
    tahunAjaran,
    type,
  }: {
    type: "bulanan" | "semester" | "terbatas";
    idKelas: number;
    tahunAjaran: number;
  }) => {
    const response = await axiosConfigFinance.get(
      `/generate/tagihan/${type}/${idKelas}/${tahunAjaran}`,
    );
    return response.data;
  },
  generateUangPangkal: async ({
    idKelas,
    tahunAjaran,
  }: {
    idKelas: number;
    tahunAjaran: number;
  }) => {
    const response = await axiosConfigFinance.get(
      `/generate/uang-pangkal/${idKelas}/${tahunAjaran}`,
    );
    return response.data;
  },
  getAdmission: async (params?: any) => {
    const response = await axiosConfigFinance.get<
      BaseResponsePaginate<TTagihanAdmission>
    >("/uang-pangkal", {
      params,
    });
    return response.data;
  },
  getMonthly: async (siswaId: number, tahun_ajaran: number) => {
    const response = await axiosConfigFinance.get(`/siswa/${siswaId}/tagihan`, {
      params: {
        tahun_ajaran,
      },
    });
    return response.data;
  },
  getOne: async (typeId: number, params?: any) => {
    const response = await axiosConfigFinance.get<BaseResponse<TTagihan>>(
      `/tagihan/${typeId}`,
      { params },
    );
    return response.data;
  },
  getOneAdmission: async (typeId: number, params?: any) => {
    const response = await axiosConfigFinance.get<
      BaseResponse<TTagihanAdmission>
    >(`/uang-pangkal/${typeId}`, { params });
    return response.data;
  },
  delete: async (typeId: number) => {
    const response = await axiosConfigFinance.delete<BaseResponse<TTagihan>>(
      `/tagihan/${typeId}`,
    );
    return response.data;
  },
  deleteAdmission: async (typeId: number) => {
    const response = await axiosConfigFinance.delete<
      BaseResponse<TTagihanAdmission>
    >(`/uang-pangkal/${typeId}`);
    return response.data;
  },
  exportTransaction: async (params: any) => {
    const response = await axiosConfigFinance.get(`/export/transaction`, {
      params,
      responseType: "blob",
    });
    return response.data;
  },
};

export default TagihanService;
