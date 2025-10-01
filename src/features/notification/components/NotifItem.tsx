import NotificationService from "@/services/notification";
import { TNotification } from "@/services/notification/notification.type";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "antd";
import classNames from "classnames";
import { useState } from "react";
import { toast } from "sonner";

function NotifItem({
  notif,
  isNavbar = false,
}: {
  notif: TNotification;
  isNavbar: boolean;
}) {
  const [loadingRead, setLoadingRead] = useState(false);
  const queryClient = useQueryClient();

  const handleMarkAsRead = async () => {
    try {
      setLoadingRead(true);
      const res = await NotificationService.markAsRead({
        ids: [notif.id],
      });

      await queryClient.invalidateQueries({ queryKey: ["NOTIFICATIONS"] });
    } catch (error) {
      console.error(error);
      toast.error("Ada kesalahan di notifikasi");
    } finally {
      setLoadingRead(false);
    }
  };

  return (
    <div
      className={classNames(
        "flex justify-between items-center border rounded-md pt-2 cursor-pointer hover:bg-gray-100 p-2",
        notif.is_read ? "bg-white" : "bg-blue-50",
      )}
    >
      <div>
        <p className="font-semibold">{notif.title}</p>
        <p className="text-xs text-gray-500 truncate whitespace-break-spaces">
          {notif.message}
        </p>
      </div>
      {!notif.is_read && !isNavbar && (
        <Button type="link" loading={loadingRead} onClick={handleMarkAsRead}>
          Tandai Dibaca
        </Button>
      )}
    </div>
  );
}

export default NotifItem;
