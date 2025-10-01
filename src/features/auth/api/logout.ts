import axiosConfig from "@/config/axios";

export const logout = () => {
  return axiosConfig.post("/logout");
};
