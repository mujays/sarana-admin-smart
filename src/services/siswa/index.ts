import axiosConfig from "@/config/axios";
import { BaseResponse, BaseResponsePaginate } from "../base-response.type";
import { TPpdb, TSiswa } from "./siswa.type";

const SiswaServices = {
  create: async (payload: any) => {
    const response = await axiosConfig.post<BaseResponsePaginate<TSiswa>>(
      "/siswa",
      payload,
    );
    return response.data;
  },
  update: async (siswaId: number, payload: any) => {
    const response = await axiosConfig.put<BaseResponsePaginate<TSiswa>>(
      `/siswa/${siswaId}`,
      payload,
    );
    return response.data;
  },
  get: async (params?: any) => {
    const response = await axiosConfig.get<BaseResponsePaginate<TSiswa>>(
      "/siswa",
      {
        params,
      },
    );
    return response.data;
  },
  deletePPDB: async (ppdbId: number) => {
    const response = await axiosConfig.delete<BaseResponse<TPpdb>>(
      `/form-siswa/${ppdbId}`,
    );
    return response.data;
  },
  deletePindahan: async (ppdbId: number) => {
    const response = await axiosConfig.delete<BaseResponse<TPpdb>>(
      `/form-pindahan/${ppdbId}`,
    );
    return response.data;
  },
  getPPDB: async (params?: any) => {
    const response = await axiosConfig.get<BaseResponsePaginate<TPpdb>>(
      "/form-siswa",
      {
        params,
      },
    );
    return response.data;
  },
  getPPDBDetail: async (id: number, params?: any, pindahan = false) => {
    const response = await axiosConfig.get<BaseResponse<TPpdb>>(
      `/${pindahan ? "form-pindahan" : "form-siswa"}/${id}`,
      {
        params,
      },
    );
    return response.data;
  },
  getSiswaPindahan: async (params?: any) => {
    const response = await axiosConfig.get<BaseResponsePaginate<TPpdb>>(
      "/form-pindahan",
      {
        params,
      },
    );
    return response.data;
  },
  updatePPDB: async (id: number, payload?: any) => {
    const response = await axiosConfig.patch<BaseResponsePaginate<TPpdb>>(
      `/form-siswa/${id}`,
      payload,
    );
    return response.data;
  },
  updateSiswaPindahan: async (id: number, payload?: any) => {
    const response = await axiosConfig.patch<BaseResponsePaginate<TPpdb>>(
      `/form-pindahan/${id}`,
      payload,
    );
    return response.data;
  },
  getOne: async (siswaId: number, params?: any) => {
    const response = await axiosConfig.get<BaseResponse<TSiswa>>(
      `/siswa/${siswaId}`,
      { params },
    );
    return response.data;
  },
  import: async (formData: FormData) => {
    const response = await axiosConfig.postForm<BaseResponse<TSiswa>>(
      `/siswa/import`,
      formData,
    );
    return response.data;
  },
  export: async (params: any) => {
    const response = await axiosConfig.get(`/siswa/export`, {
      params,
      responseType: "blob",
    });
    return response.data;
  },
  delete: async (siswaId: number) => {
    const response = await axiosConfig.delete<BaseResponse<TSiswa>>(
      `/siswa/${siswaId}`,
    );
    return response.data;
  },
  deleteMultiple: async (siswaIds: number[]) => {
    const response = await axiosConfig.delete<BaseResponse<TSiswa>>(`/siswa`, {
      data: {
        id: siswaIds,
      },
    });
    return response.data;
  },
};

export default SiswaServices;
