import { getTokenKeuangan, logout } from "@/libraries/auth";
import { useSuperAdminStore } from "@/stores/super-admin";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";

const axiosConfigFinanceSuperAdmin = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_SOURCE_FINANCE}api/v1`,
  headers: {
    Accept: "application/json",
  },
});

axiosConfigFinanceSuperAdmin.interceptors.request.use(
  async function (config) {
    // Check if we're in super admin mode
    const superAdminCookie = Cookies.get("session_keuangan_super_admin");
    const { isSuperAdmin } = useSuperAdminStore.getState();

    if (isSuperAdmin && superAdminCookie) {
      // Use super admin token
      config.headers.Authorization = "Bearer " + superAdminCookie;
    } else {
      // Use regular admin token
      const session = await getTokenKeuangan();
      if (session) {
        config.headers.Authorization = "Bearer " + session;
      }
    }

    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);

axiosConfigFinanceSuperAdmin.interceptors.response.use(
  function (res) {
    return res;
  },
  async function (error: AxiosError) {
    if (error.response) {
      if (error.response.status === 401) {
        // Check if we were using super admin token
        const { isSuperAdmin, clearSuperAdmin } = useSuperAdminStore.getState();

        if (isSuperAdmin) {
          // Super admin token expired, clear super admin state
          clearSuperAdmin();
          // Redirect to super admin login
          window.location.href = "/super-admin-auth";
        } else {
          // Regular admin token expired
          try {
            logout();
            // window.location.href = "/login";
          } catch (_error) {
            return Promise.reject(_error);
          }
        }
      }
    }
    return Promise.reject(error);
  },
);

export default axiosConfigFinanceSuperAdmin;
