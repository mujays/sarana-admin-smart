import { getTokenKeuangan, logoutKeuangan } from "@/libraries/auth";
import axios, { AxiosError } from "axios";

const axiosConfigFinance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_SOURCE_FINANCE}api/v1`,
  headers: {
    Accept: "application/json",
  },
});

export const axiosConfigFinanceSuperAdmin = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_SOURCE_FINANCE}api/v1`,
  headers: {
    Accept: "application/json",
  },
});

axiosConfigFinanceSuperAdmin.interceptors.request.use(
  async function (config) {
    const session = await getTokenKeuangan(true);
    if (session) {
      config.headers.Authorization = "Bearer " + session;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);

axiosConfigFinance.interceptors.request.use(
  async function (config) {
    const session = await getTokenKeuangan(false);
    if (session) {
      config.headers.Authorization = "Bearer " + session;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);

axiosConfigFinance.interceptors.response.use(
  function (res) {
    return res;
  },
  async function (error: AxiosError) {
    if (error.response) {
      if (error.response.status === 401) {
        logoutKeuangan();
        // window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

export default axiosConfigFinance;
