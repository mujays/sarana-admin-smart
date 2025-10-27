import { WithStyle } from "@/types/styles";

import styles from "./styles.module.css";

import { Dropdown } from "@/components/dropdown";
import {
  ChevronDownIcon,
  NotificationIcon,
  PowerIcon,
} from "@/components/icons";
import { Paragraph } from "@/components/paragraph";
import { Badge, Button, Popover } from "antd";
import classNames from "classnames";
import Cookies from "js-cookie";
import { ArrowLeftRightIcon, ChevronLeft, User, User2Icon } from "lucide-react";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import AuthService from "@/services/auth";
import Notification from "./notification";
import NotificationService from "@/services/notification";
import { UserOutlined } from "@ant-design/icons";
import { useSuperAdmin } from "@/hooks/useSuperAdmin";

export type TAuthenticatedNavbar = {
  activeLink:
    | "dashboard-keuangan"
    | "dashboard"
    | "dashboard-perpustakaan"
    | "notification"
    | "books"
    | "pengaturan"
    | "pindahan"
    | "penarikan"
    | "transaksi"
    | "jemputan"
    | "tipe"
    | "tagihan"
    | "siswa"
    | "alumni"
    | "cuti"
    | "absen"
    | "tahun-ajaran"
    | "keluarga"
    | "wali"
    | "kelas"
    | "ppdb"
    | "saldo"
    | "none";
};

/**
 * This is used on every protected page of the app. The header navbar on the very top of the page
 */
export const AuthenticatedNavbar = (props: WithStyle<TAuthenticatedNavbar>) => {
  const router = useRouter();
  const {
    isSuperAdmin,
    superAdminToken,
    superAdminEmail,
    switchToSuperAdmin,
    switchToNormalAdmin,
    logoutSuperAdmin,
  } = useSuperAdmin();

  const { data: notifications } = useQuery({
    queryKey: ["NOTIFICATIONS-NAV"],
    queryFn: async () => {
      const response = await NotificationService.get({
        page_size: 5,
        page: 1,
      });
      return response;
    },
  });

  const handleLogout = () => {
    Cookies.remove("session_kesiswaan");
    window.location.href = process.env.NEXT_PUBLIC_URL_PORTAL as string;
  };

  const { data: me, isLoading } = useQuery({
    queryKey: ["ME"],
    queryFn: async () => {
      const response = await AuthService.me();
      return response;
    },
  });

  return (
    <div className="flex justify-between p-3 bg-white border-b border-gray-300">
      <div className={styles["left-side"]}>
        <Button
          icon={<ChevronLeft />}
          onClick={() => {
            router.back();
          }}
        >
          Kembali
        </Button>
      </div>

      <div className={styles["right-side"]}>
        {!router.pathname.includes("/keuangan") ? null : isSuperAdmin ? (
          <Button
            icon={<ArrowLeftRightIcon />}
            onClick={switchToNormalAdmin}
            type="default"
          >
            Switch ke Admin Biasa
          </Button>
        ) : superAdminToken ? (
          <Button
            icon={<ArrowLeftRightIcon />}
            onClick={switchToSuperAdmin}
            type="primary"
          >
            Switch ke Super Admin
          </Button>
        ) : (
          <Button
            onClick={() => {
              router.push("/super-admin-auth?redirect=" + router.asPath);
            }}
            type="link"
            icon={<UserOutlined />}
          >
            Masuk ke Super Admin
          </Button>
        )}

        <Popover content={<Notification />} trigger="click">
          <Badge
            count={notifications?.data.filter((notif) => !notif.is_read).length}
            offset={[4, 20]}
            style={{
              minWidth: "24px",
              fontWeight: 600,
              fontSize: "12px",
              cursor: "pointer",
            }}
          >
            <NotificationIcon
              style={{
                cursor: "pointer",
              }}
            />
          </Badge>
        </Popover>

        <div className="rounded-full bg-gray-300 p-2">
          <User2Icon />
        </div>

        {/* User */}
        <Dropdown
          placement="bottomRight"
          trigger={["click"]}
          overlayClassName="!min-w-[120px] !max-w-[120px]"
          menu={{
            style: {
              borderRadius: "12px",
              padding: "0px",
              overflow: "hidden",
            },
            items: [
              // Super Admin logout option (only show if in super admin mode)
              ...(isSuperAdmin
                ? [
                    {
                      key: "super-admin-logout",
                      style: {
                        paddingTop: "8px",
                        paddingBottom: "8px",
                        borderRadius: 0,
                      },
                      label: (
                        <div
                          style={{
                            display: "flex",
                            gap: "12px",
                            alignItems: "center",
                          }}
                        >
                          <UserOutlined />
                          Keluar dari Super Admin
                        </div>
                      ),
                      onClick: () => {
                        logoutSuperAdmin();
                        router.reload();
                      },
                    },
                  ]
                : []),
              {
                key: "2",
                style: {
                  paddingTop: "8px",
                  paddingBottom: "8px",
                  borderRadius: 0,
                },
                label: (
                  <div
                    style={{
                      display: "flex",
                      gap: "12px",
                      alignItems: "center",
                    }}
                    data-test="logout-button"
                  >
                    <PowerIcon fill="currentColor" />
                    Log out
                  </div>
                ),
                danger: true,
                onClick: handleLogout,
              },
            ],
          }}
        >
          <div
            data-test="dropdown-profile"
            className={classNames(styles["user-info"])}
          >
            {/* <Avatar src="/img/Frame 34.png" /> */}

            <div className="!max-w-[256px]">
              <Paragraph
                className={classNames(styles["user-name"])}
                style={{
                  marginBottom: "4px",
                }}
                ellipsis={{ rows: 1 }}
              >
                {me?.data.name}
              </Paragraph>

              <p className={styles["user-nik"]}>{me?.data.email}</p>
            </div>

            <ChevronDownIcon />
          </div>
        </Dropdown>
        {/* end of User */}
      </div>
    </div>
  );
};
