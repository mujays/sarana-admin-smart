import { ReactElement } from "react";

import { Title } from "@/components/title/Title";

import { AuthenticatedLayout } from "@/layouts/AuthenticatedLayout";
import Head from "next/head";
import { Skeleton } from "antd";
import { useQuery } from "@tanstack/react-query";
import NotificationService from "@/services/notification";
import NotifItem from "./components/NotifItem";

export default function Notification() {
  const { data: notifications, isLoading } = useQuery({
    queryKey: ["NOTIFICATIONS"],
    queryFn: async () => {
      const response = await NotificationService.get({});
      return response;
    },
  });

  return (
    <>
      <Head>
        <title>Notifikasi | Smart School</title>
      </Head>
      <div className="p-5">
        <Title level={2}>Notifikasi</Title>
        <div className="space-y-4">
          {isLoading ? (
            <Skeleton />
          ) : (
            <div className="space-y-2">
              {notifications?.data.map((notif) => (
                <NotifItem notif={notif} key={notif.id} isNavbar={false} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

Notification.withLayout = (page: ReactElement) => {
  return (
    <AuthenticatedLayout activeLink="notification">{page}</AuthenticatedLayout>
  );
};
Notification.isProtected = true;
