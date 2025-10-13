import { TUser } from "../auth/auth.types";
import { BaseResponse, BaseResponsePaginate } from "../base-response.type";
import axiosConfigPerpus from "@/config/axios.perpus";
import { TBooks } from "./type";

const PerpusService = {
  login: async () => {
    const response = await axiosConfigPerpus.get<BaseResponse<TUser>>("/login");
    return response.data;
  },
  getBooks: async () => {
    const response = await axiosConfigPerpus.get<BaseResponsePaginate<TBooks>>(
      "/books",
    );
    return response.data;
  },
  getOneBook: async (id: number) => {
    const response = await axiosConfigPerpus.get<BaseResponse<TBooks>>(
      `/books/${id}`,
    );
    return response.data;
  },
  deleteBook: async (id: number) => {
    const response = await axiosConfigPerpus.delete<BaseResponse<string>>(
      `/books/${id}`,
    );
    return response.data;
  },
  updateBook: async (id: number, payload: any) => {
    const response = await axiosConfigPerpus.put<BaseResponse<TBooks>>(
      `/books/${id}`,
      payload,
    );
    return response.data;
  },
  createBook: async (data: any) => {
    const response = await axiosConfigPerpus.post<BaseResponse<TBooks>>(
      `/books`,
      data,
    );
    return response.data;
  },
};

export default PerpusService;
