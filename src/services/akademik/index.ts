import axiosConfigAkademik from "@/config/axios.akademik";
import { BaseResponse, BaseResponsePaginate } from "../base-response.type";
import { MataPelajaranDto, TMataPelajaran } from "./akademik.type";

const AkademikService = {
  getMapel: async (params?: any) => {
    const response = await axiosConfigAkademik.get<{
      data: BaseResponsePaginate<TMataPelajaran>;
      message: string;
    }>("/mata-pelajaran", {
      params,
    });
    return response.data;
  },
  createMapel: async (body: MataPelajaranDto) => {
    const response = await axiosConfigAkademik.post<
      BaseResponse<TMataPelajaran>
    >("/mata-pelajaran", body);
    return response.data;
  },
  updateMapel: async (id: number, body: MataPelajaranDto) => {
    const response = await axiosConfigAkademik.put<
      BaseResponse<TMataPelajaran>
    >(`/mata-pelajaran/${id}`, body);
    return response.data;
  },
  getOneMapel: async (id: number) => {
    const response = await axiosConfigAkademik.get<
      BaseResponse<TMataPelajaran>
    >(`/mata-pelajaran/${id}`);
    return response.data;
  },
  deleteMapel: async (id: number) => {
    const response = await axiosConfigAkademik.delete<
      BaseResponse<TMataPelajaran>
    >(`/mata-pelajaran/${id}`);
    return response.data;
  },
};

export default AkademikService;
