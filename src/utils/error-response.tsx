import { AxiosError } from "axios";
import { toast } from "sonner";

const errorResponse = (error: AxiosError) => {
  const isDev = process.env.NODE_ENV === "development";
  if (error?.response?.data) {
    const message = error.response.data as any;
    toast.error(isDev ? message.message : "Server Error");
    return;
  }
  toast.error(error.message);
};

export default errorResponse;
