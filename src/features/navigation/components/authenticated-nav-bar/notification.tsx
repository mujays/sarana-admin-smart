import NotifItem from "@/features/notification/components/NotifItem";
import NotificationService from "@/services/notification";
import { useQuery } from "@tanstack/react-query";
import { Button, Spin } from "antd";
import { useRouter } from "next/router";

function Notification() {
  const router = useRouter();
  const { data: notifications, isLoading } = useQuery({
    queryKey: ["NOTIFICATIONS-NAV"],
    queryFn: async () => {
      const response = await NotificationService.get({
        page_size: 5,
        page: 1,
      });
      return response;
    },
  });

  return (
    <div className="space-y-2 max-w-[280px]">
      <div className="flex justify-between">
        <p className="font-bold">Notifikasi</p>
        {/* <Button type="link" size="small">
          Tandai sudah terbaca
        </Button> */}
      </div>
      {isLoading ? (
        <div className="flex justify-center py-4">
          <Spin />
        </div>
      ) : (
        notifications?.data.map((notif) => (
          <NotifItem notif={notif} key={notif.id} isNavbar />
        ))
      )}
      <Button
        onClick={() => router.push("/notification")}
        type="link"
        className="w-full"
        size="small"
      >
        Lihat semua notifikasi
      </Button>
    </div>
  );
}

export default Notification;
