import axiosConfig from "@/config/axios";
import { BaseResponsePaginate } from "../base-response.type";
import { TNotification } from "./notification.type";

const NotificationService = {
  markAsRead: async (payload: any) => {
    const response = await axiosConfig.patch<
      BaseResponsePaginate<TNotification>
    >("/notification", payload);
    return response.data;
  },

  get: async (params?: any) => {
    const response = await axiosConfig.get<BaseResponsePaginate<TNotification>>(
      "/notification",
      {
        params,
      },
    );
    return response.data;
  },
};

export default NotificationService;
