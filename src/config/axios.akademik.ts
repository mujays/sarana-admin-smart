import { getTokenAkademik, logout } from "@/libraries/auth";
import axios, { AxiosError } from "axios";

const axiosConfigAkademik = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_SOURCE_AKADEMIK}api/v1`,
  headers: {
    Accept: "application/json",
  },
});

axiosConfigAkademik.interceptors.request.use(
  async function (config) {
    const session = await getTokenAkademik();
    if (session) {
      config.headers.Authorization = "Bearer " + session;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);

axiosConfigAkademik.interceptors.response.use(
  function (res) {
    return res;
  },
  async function (error: AxiosError) {
    if (error.response) {
      if (error.response.status === 401) {
        // * Unauthorized
        try {
          logout();
          // window.location.href = "/login";
        } catch (_error) {
          return Promise.reject(_error);
        }
      }
    }
    return Promise.reject(error);
  },
);

export default axiosConfigAkademik;
