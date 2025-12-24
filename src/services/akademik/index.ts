import axiosConfigAkademik from "@/config/axios.akademik";
import { BaseResponse, BaseResponsePaginate } from "../base-response.type";
import {
  MataPelajaranDto,
  RaportDto,
  SemesterDto,
  TMataPelajaran,
  TRaport,
  TSemester,
} from "./akademik.type";

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
  getSemester: async (params?: any) => {
    const response = await axiosConfigAkademik.get<
      BaseResponsePaginate<TSemester>
    >("/semester", {
      params,
    });
    return response.data;
  },
  createSemester: async (body: SemesterDto) => {
    const response = await axiosConfigAkademik.post<
      BaseResponse<TMataPelajaran>
    >("/semester", body);
    return response.data;
  },
  updateSemester: async (id: number, body: SemesterDto) => {
    const response = await axiosConfigAkademik.put<BaseResponse<TSemester>>(
      `/semester/${id}`,
      body,
    );
    return response.data;
  },
  getOneSemester: async (id: number) => {
    const response = await axiosConfigAkademik.get<BaseResponse<TSemester>>(
      `/semester/${id}`,
    );
    return response.data;
  },
  deleteSemester: async (id: number) => {
    const response = await axiosConfigAkademik.delete<BaseResponse<TSemester>>(
      `/semester/${id}`,
    );
    return response.data;
  },
  getRaport: async (siswaId: number, semesterId: number, params?: any) => {
    const response = await axiosConfigAkademik.get<
      BaseResponsePaginate<TRaport>
    >(`/nilai-raport/siswa/${siswaId}/semester/${semesterId}`, {
      params,
    });
    return response.data;
  },
  createRaport: async (body: RaportDto) => {
    const response = await axiosConfigAkademik.post<BaseResponse<TRaport>>(
      "/nilai-raport/bulk",
      body,
    );
    return response.data;
  },
  updateRaport: async (
    id: number,
    body: { catatan: string; nilai_angka: number },
  ) => {
    const response = await axiosConfigAkademik.put<BaseResponse<TRaport>>(
      `/nilai-raport/${id}`,
      body,
    );
    return response.data;
  },
  deleteRaport: async (id: number) => {
    const response = await axiosConfigAkademik.delete<BaseResponse<TRaport>>(
      `/nilai-raport/${id}`,
    );
    return response.data;
  },
};

export default AkademikService;
