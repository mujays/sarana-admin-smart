import { useEffect, useState } from "react";

import { Button } from "@/components/button";
import { ChevronDownIcon, DashboardIcon } from "@/components/icons";
import { ConfigProvider, Layout, Menu } from "antd";
import classNames from "classnames";
import {
  Banknote,
  BanknoteIcon,
  BookMarkedIcon,
  BusIcon,
  CalendarFoldIcon,
  CalendarRangeIcon,
  CoinsIcon,
  FileTextIcon,
  GraduationCap,
  HandCoinsIcon,
  SchoolIcon,
  ScrollTextIcon,
  Settings2Icon,
  SettingsIcon,
  User2Icon,
  UserCheckIcon,
  Users2Icon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ROUTE_MAP } from "../../constants";
import Image from "next/image";
import { ArrowDownOutlined, HomeFilled } from "@ant-design/icons";

const menuItemStyle = {
  paddingLeft: "12px",
  paddingRight: "12px",
  paddingTop: "8px",
  paddingBottom: "8px",
  borderRadius: "4px",
  height: "48px",
  minWidth: "48px",
  left: "-4px",
  display: "flex",
};

/**
 * This Sidebar is based on Ant Design <Sider> component, this component should be used inside the Layout component from Ant Design.
 * @returns
 */
export const Sidebar = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const router = useRouter();
  const paths = router.pathname.split("/");
  let selectedMenuKey = paths.at(-1) ?? "";
  if (router.pathname.endsWith("/model-unit/setup"))
    selectedMenuKey = "model-unit";

  let subMenuKey = "";
  if (paths.length > 2) {
    subMenuKey = paths.at(1) ?? "";
  }
  const [openedSubMenu, setOpenedSubMenu] = useState<string>(subMenuKey);

  useEffect(() => {
    setOpenedSubMenu(subMenuKey);
  }, [subMenuKey, isSidebarCollapsed]);

  useEffect(() => {
    if (window.innerWidth < 720) {
      setIsSidebarCollapsed(true);
    }
  }, []);

  return (
    <Layout.Sider
      collapsible
      trigger={null}
      collapsed={isSidebarCollapsed}
      theme="light"
      collapsedWidth={72}
      width={288}
      style={{
        paddingTop: "8px",
        paddingLeft: "12px",
        paddingRight: "4px",
        backgroundColor: "#0D69B2",
        maxWidth: "288px",
        minWidth: "288px",
        position: "relative",
      }}
    >
      {!isSidebarCollapsed && (
        <div className="flex justify-center p-3">
          <Image
            src={
              paths[1] === "sd"
                ? "/images/logo-sd-white.svg"
                : "/images/logo-smp-white.png"
            }
            alt="Logo"
            width={500}
            height={300}
            sizes="1000px"
          />
        </div>
      )}
      <Button
        size="middle"
        shape="circle"
        onClick={() => setIsSidebarCollapsed((prev) => !prev)}
        style={{
          border: "none",
          backgroundColor: "#DBDBDB",
          alignSelf: "flex-end",
          position: "absolute",
          right: "-16px",
        }}
        // className="!hidden md:block"
        icon={
          <ArrowDownOutlined
            className={classNames(
              "transition-transform",
              isSidebarCollapsed ? "rotate-[270deg]" : "rotate-[90deg]",
            )}
          />
        }
      />

      <ConfigProvider
        theme={{
          components: {
            Menu: {
              // TODO: Find a way to solve these hardcoded color with css variables
              itemHoverBg: "#298FE1",
              itemSelectedBg: "#298FE1",
              itemSelectedColor: "#FFFFFF",
              itemActiveBg: "#5f5ad5",
              itemColor: "#FFFFFF",
              itemHoverColor: "#FFFFFF",
              subMenuItemBorderRadius: 4,
              itemBorderRadius: 4,
            },
          },
        }}
      >
        <Menu
          mode="inline"
          selectedKeys={[selectedMenuKey]}
          openKeys={[openedSubMenu]}
          onOpenChange={(keys) => {
            setOpenedSubMenu(keys.at(-1) as string);
          }}
          style={{
            backgroundColor: "#0D69B2",
            border: "none",
            marginTop: "28px",
          }}
          expandIcon={(props) => {
            return (
              <ChevronDownIcon
                fill={
                  props.isSubMenu && props.isOpen
                    ? "var(--black)"
                    : "currentColor"
                }
                className={classNames(
                  "transition-transform",
                  { "rotate-[-180deg]": props.isSubMenu && props.isOpen },
                  { "rotate-[-90deg]": props.isSubMenu && !props.isOpen },
                )}
              />
            );
          }}
          items={[
            ...(router?.asPath.includes("/kesiswaan")
              ? ([
                  {
                    key: "kesiswaan",
                    icon: <DashboardIcon fill={"#FFFFFF"} />,
                    label: (
                      <Link href={`/${paths[1]}/kesiswaan`} passHref>
                        {ROUTE_MAP["dashboard"]}
                      </Link>
                    ),
                    style: menuItemStyle,
                  },
                  {
                    key: "ppdb",
                    icon: <FileTextIcon className="text-white" />,
                    label: (
                      <Link href={`/${paths[1]}/kesiswaan/ppdb`} passHref>
                        {ROUTE_MAP["ppdb"]}
                      </Link>
                    ),
                    style: menuItemStyle,
                  },
                  {
                    key: "siswa-pindahan",
                    icon: <UserCheckIcon className="text-white" />,
                    label: (
                      <Link
                        href={`/${paths[1]}/kesiswaan/siswa-pindahan`}
                        passHref
                      >
                        {ROUTE_MAP["pindahan"]}
                      </Link>
                    ),
                    style: menuItemStyle,
                  },
                  {
                    key: "siswa",
                    icon: <Users2Icon className="text-white" />,
                    label: (
                      <Link href={`/${paths[1]}/kesiswaan/siswa`} passHref>
                        {ROUTE_MAP["siswa"]}
                      </Link>
                    ),
                    style: menuItemStyle,
                  },
                  {
                    key: "alumni",
                    icon: <GraduationCap className="text-white" />,
                    label: (
                      <Link href={`/${paths[1]}/kesiswaan/alumni`} passHref>
                        {ROUTE_MAP["alumni"]}
                      </Link>
                    ),
                    style: menuItemStyle,
                  },
                  {
                    key: "wali",
                    icon: <User2Icon className="text-white" />,
                    label: (
                      <Link href={`/${paths[1]}/kesiswaan/wali`} passHref>
                        {ROUTE_MAP["wali"]}
                      </Link>
                    ),
                    style: menuItemStyle,
                  },
                  {
                    key: "kelas",
                    icon: <SchoolIcon className="text-white" />,
                    label: (
                      <Link href={`/${paths[1]}/kesiswaan/kelas`} passHref>
                        {ROUTE_MAP["kelas"]}
                      </Link>
                    ),
                    style: menuItemStyle,
                  },
                  {
                    key: "tahun-ajaran",
                    icon: <CalendarRangeIcon className="text-white" />,
                    label: (
                      <Link
                        href={`/${paths[1]}/kesiswaan/tahun-ajaran`}
                        passHref
                      >
                        {ROUTE_MAP["tahunAjaran"]}
                      </Link>
                    ),
                    style: menuItemStyle,
                  },
                  {
                    key: "pickup",
                    icon: <BusIcon className="text-white" />,
                    label: (
                      <Link href={`/${paths[1]}/kesiswaan/jemputan`} passHref>
                        {ROUTE_MAP["jemputan"]}
                      </Link>
                    ),
                    style: menuItemStyle,
                  },
                ] as any)
              : []),
            ...(router?.asPath.includes("/keuangan")
              ? ([
                  {
                    key: "keuangan",
                    icon: <DashboardIcon fill={"#FFFFFF"} />,
                    label: (
                      <Link href={`/${paths[1]}/keuangan`} passHref>
                        {ROUTE_MAP["dashboard"]}
                      </Link>
                    ),
                    style: menuItemStyle,
                  },
                  {
                    key: "tipe",
                    icon: <SettingsIcon className="text-white" />,
                    label: (
                      <Link href={`/${paths[1]}/keuangan/tipe`} passHref>
                        {ROUTE_MAP["type"]}
                      </Link>
                    ),
                    style: menuItemStyle,
                  },
                  {
                    key: "tagihan",
                    icon: <BanknoteIcon className="text-white" />,
                    label: (
                      <Link href={`/${paths[1]}/keuangan/tagihan`} passHref>
                        {ROUTE_MAP["tagihan"]}
                      </Link>
                    ),
                    style: menuItemStyle,
                  },
                  {
                    key: "transaksi",
                    icon: <CoinsIcon className="text-white" />,
                    label: (
                      <Link href={`/${paths[1]}/keuangan/transaksi`} passHref>
                        {ROUTE_MAP["transaksi"]}
                      </Link>
                    ),
                    style: menuItemStyle,
                  },
                  {
                    key: "penarikan",
                    icon: <HandCoinsIcon className="text-white" />,
                    label: (
                      <Link href={`/${paths[1]}/keuangan/penarikan`} passHref>
                        {ROUTE_MAP["penarikan"]}
                      </Link>
                    ),
                    style: menuItemStyle,
                  },
                  {
                    key: "saldo",
                    icon: <Banknote className="text-white" />,
                    label: (
                      <Link href={`/${paths[1]}/keuangan/saldo`} passHref>
                        {ROUTE_MAP["saldo"]}
                      </Link>
                    ),
                    style: menuItemStyle,
                  },
                  {
                    key: "pengaturan",
                    icon: <Settings2Icon className="text-white" />,
                    label: (
                      <Link href={`/${paths[1]}/keuangan/pengaturan`} passHref>
                        {ROUTE_MAP["pengaturan"]}
                      </Link>
                    ),
                    style: menuItemStyle,
                  },
                ] as any)
              : []),
            ...(router?.asPath.includes("/perpustakaan")
              ? ([
                  {
                    key: "dashboard-perpustakaan",
                    icon: <DashboardIcon fill={"#FFFFFF"} />,
                    label: (
                      <Link href={`/perpustakaan`} passHref>
                        {ROUTE_MAP["dashboard"]}
                      </Link>
                    ),
                    style: menuItemStyle,
                  },
                  {
                    key: "books",
                    icon: <BookMarkedIcon />,
                    label: (
                      <Link href={`/perpustakaan/buku`} passHref>
                        {ROUTE_MAP["buku"]}
                      </Link>
                    ),
                    style: menuItemStyle,
                  },
                ] as any)
              : []),
            ...(router?.asPath.includes("/akademik")
              ? ([
                  {
                    key: "dashboard-akademik",
                    icon: <DashboardIcon fill={"#FFFFFF"} />,
                    label: (
                      <Link href={`/akademik`} passHref>
                        {ROUTE_MAP["dashboard"]}
                      </Link>
                    ),
                    style: menuItemStyle,
                  },
                  {
                    key: "mata-pelajaran",
                    icon: <BookMarkedIcon />,
                    label: (
                      <Link href={`/akademik/mata-pelajaran`} passHref>
                        {ROUTE_MAP["mapel"]}
                      </Link>
                    ),
                    style: menuItemStyle,
                  },
                  {
                    key: "semester",
                    icon: <CalendarFoldIcon />,
                    label: (
                      <Link href={`/akademik/semester`} passHref>
                        {ROUTE_MAP["semester"]}
                      </Link>
                    ),
                    style: menuItemStyle,
                  },
                  {
                    key: "raport",
                    icon: <ScrollTextIcon />,
                    label: (
                      <Link href={`/akademik/raport`} passHref>
                        {ROUTE_MAP["raport"]}
                      </Link>
                    ),
                    style: menuItemStyle,
                  },
                ] as any)
              : []),
          ]}
        />
        <div className="flex justify-center p-3">
          <Button icon={<HomeFilled />} onClick={() => router.push("/")}>
            Kembali Ke Home
          </Button>
        </div>
      </ConfigProvider>
    </Layout.Sider>
  );
};
