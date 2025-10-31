import axios from "@/config/axios";
import axiosConfigFinance from "@/config/axios.finance";

export interface SendOTPRequest {
  email: string;
  password: string;
}
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface VerifyOTPRequest {
  admin_super_id: number;
  otp: string;
}

export interface SuperAdminAuthResponse {
  success: boolean;
  message: string;
  data?: {
    token?: string;
    admin_super_id?: number;
  };
}

export const superAdminAuthService = {
  registerSuperAdmin: async (
    data: RegisterRequest,
  ): Promise<SuperAdminAuthResponse> => {
    const response = await axiosConfigFinance.post(
      "/admin-super/register",
      data,
    );
    return response.data;
  },
  sendOTP: async (data: SendOTPRequest): Promise<SuperAdminAuthResponse> => {
    const response = await axiosConfigFinance.post("/admin-super/login", data);
    return response.data;
  },
  forgotPassword: async (data: {
    email: string;
  }): Promise<SuperAdminAuthResponse> => {
    const response = await axiosConfigFinance.post(
      "/admin-super/forgot-password",
      data,
    );
    return response.data;
  },
  resetPassword: async (data: {
    password: string;
    token: string;
    email: string;
    password_confirmation?: string;
  }): Promise<SuperAdminAuthResponse> => {
    const response = await axiosConfigFinance.post(
      "/admin-super/reset-password",
      data,
    );
    return response.data;
  },

  verifyOTP: async (
    data: VerifyOTPRequest,
  ): Promise<SuperAdminAuthResponse> => {
    const response = await axiosConfigFinance.post(
      "/admin-super/verify-otp",
      data,
    );
    return response.data;
  },

  resendOTP: async (
    data: VerifyOTPRequest,
  ): Promise<SuperAdminAuthResponse> => {
    const response = await axiosConfigFinance.post(
      "/super-admin/resend-otp",
      data,
    );
    return response.data;
  },
  editTransaction: async (id: number, payload: any) => {
    const response = await axiosConfigFinance.patch(
      `/admin-super/transaction/${id}/edit`,
      payload,
    );
    return response.data;
  },
  editUangPangkal: async (id: number, payload: any) => {
    const response = await axiosConfigFinance.patch(
      `/admin-super/uang-pangkal/${id}/edit`,
      payload,
    );
    return response.data;
  },
};
