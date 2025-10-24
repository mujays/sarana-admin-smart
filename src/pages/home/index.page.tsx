import axiosConfig from "@/config/axios";
import axiosConfigPerpus from "@/config/axios.perpus";
import { AuthenticatedNavbar } from "@/features/navigation";
import { useDisclosure } from "@/hooks/useDisclosure";
import {
  storeToken,
  storeTokenKeuangan,
  storeTokenPerpus,
} from "@/libraries/auth";
import AuthService from "@/services/auth";
import { UserAddOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Modal, Typography } from "antd";
import {
  BanknoteIcon,
  LibraryIcon,
  SquareUserIcon,
  UserCog2Icon,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

function HomePage() {
  const [loginTo, setLoginTo] = useState<
    | "kesiswaan-sd"
    | "keuangan-sd"
    | "kesiswaan-smp"
    | "keuangan-smp"
    | "hrd"
    | "perpustakaan"
    | null
  >(null);
  const [loading, setLoading] = useState(false);

  const modal = useDisclosure();

  const { data: me, isLoading } = useQuery({
    queryKey: ["ME"],
    queryFn: async () => {
      const response = await AuthService.me();
      return response;
    },
  });

  const loginHandle = async () => {
    try {
      setLoading(true);
      if (loginTo == "keuangan-sd") {
        const res = await axiosConfig.post(
          `${process.env.NEXT_PUBLIC_API_SOURCE_FINANCE}api/v1/login`,
          {
            email: me?.data.email,
          },
        );
        storeTokenKeuangan(res.data.data.token);
        window.location.href = "/sd/keuangan";
      }
      if (loginTo == "kesiswaan-sd") {
        const res = await axiosConfig.post(
          `${process.env.NEXT_PUBLIC_API_SOURCE}api/v1/login`,
          {
            email: me?.data.email,
          },
        );
        storeToken(res.data.data.token);
        window.location.href = "/sd/kesiswaan";
      }
      if (loginTo == "keuangan-smp") {
        const res = await axiosConfig.post(
          `${process.env.NEXT_PUBLIC_API_SOURCE_FINANCE}api/v1/login`,
          {
            email: me?.data.email,
          },
        );
        storeTokenKeuangan(res.data.data.token);
        window.location.href = "/smp/keuangan";
      }
      if (loginTo == "kesiswaan-smp") {
        const res = await axiosConfig.post(
          `${process.env.NEXT_PUBLIC_API_SOURCE}api/v1/login`,
          {
            email: me?.data.email,
          },
        );
        storeToken(res.data.data.token);
        window.location.href = "/smp/kesiswaan";
      }
      if (loginTo == "perpustakaan") {
        const res = await axiosConfigPerpus.post(
          `${process.env.NEXT_PUBLIC_API_SOURCE_PERPUS}api/v1/login`,
          {
            email: me?.data.email,
          },
        );
        storeTokenPerpus(res.data.data.token);
        window.location.href = "/perpustakaan";
      }
      modal.onClose();
    } catch (error) {
      toast.error("Gagal login!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Modal
        open={modal.isOpen}
        maskClosable={false}
        onCancel={() => {
          modal.onClose();
        }}
        okText="Login"
        okButtonProps={{
          onClick: async () => {
            await loginHandle();
          },
        }}
        confirmLoading={loading}
        title={
          <Typography.Title level={4}>
            Login ke <span className="capitalize">{loginTo}</span>
          </Typography.Title>
        }
      >
        Anda akan masuk ke aplikasi{" "}
        <span className="capitalize">{loginTo}</span>?
      </Modal>
      <AuthenticatedNavbar activeLink="dashboard" />
      <div className="p-4">
        <p className="text-2xl font-medium">Dashboard Portal</p>

        <div className="flex flex-col md:flex-row gap-4 mt-4">
          <div className="bg-slate-300 w-full md:basis-8/12 flex rounded-lg overflow-hidden">
            <div className="w-[40%] bg-primary-500 p-5 flex flex-col justify-center">
              <p className="text-white text-2xl">Hello, Admin</p>
              <p className="text-gray-300 text-lg">
                Selamat datang di Smart School, Anda telah masuk ke dashboard
                admin.
              </p>
            </div>
            <div className="w-[60%]">
              <Image
                alt="banner-portal"
                src="/images/banner-portal.png"
                width={500}
                height={300}
                className="w-full h-full"
              />
            </div>
          </div>
          <div className="w-full md:basis-4/12">
            <Calendar fullscreen={false} />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div
            className="flex flex-col w-full bg-white p-4 gap-4 cursor-pointer"
            onClick={() => {
              setLoginTo("kesiswaan-sd");
              modal.onOpen();
            }}
          >
            <div className="bg-primary-500 flex justify-center items-center h-36 rounded-lg">
              <SquareUserIcon className="text-white h-16 w-16" />
            </div>
            <p className="font-semibold text-xl text-center text-primary-500">
              Kesiswaan SD
            </p>
          </div>
          <div
            className="flex flex-col w-full bg-white p-4 gap-4 cursor-pointer"
            onClick={() => {
              setLoginTo("keuangan-sd");
              modal.onOpen();
            }}
          >
            <div className="bg-primary-500 flex justify-center items-center h-36 rounded-lg">
              <BanknoteIcon className="text-white h-16 w-16" />
            </div>
            <p className="font-semibold text-xl text-center text-primary-500">
              Keuangan SD
            </p>
          </div>
          <div
            className="flex flex-col w-full bg-white p-4 gap-4 cursor-pointer"
            onClick={() => {
              setLoginTo("kesiswaan-smp");
              modal.onOpen();
            }}
          >
            <div className="bg-orange-500 flex justify-center items-center h-36 rounded-lg">
              <SquareUserIcon className="text-white h-16 w-16" />
            </div>
            <p className="font-semibold text-xl text-center text-orange-500">
              Kesiswaan SMP
            </p>
          </div>
          <div
            className="flex flex-col w-full bg-white p-4 gap-4 cursor-pointer"
            onClick={() => {
              setLoginTo("keuangan-smp");
              modal.onOpen();
            }}
          >
            <div className="bg-orange-500 flex justify-center items-center h-36 rounded-lg">
              <BanknoteIcon className="text-white h-16 w-16" />
            </div>
            <p className="font-semibold text-xl text-center text-orange-500">
              Keuangan SMP
            </p>
          </div>
          <div
            className="flex flex-col w-full bg-white p-4 gap-4 cursor-pointer"
            onClick={() => {
              setLoginTo("perpustakaan");
              modal.onOpen();
            }}
          >
            <div className="bg-orange-500 flex justify-center items-center h-36 rounded-lg">
              <LibraryIcon className="text-white h-16 w-16" />
            </div>
            <p className="font-semibold text-xl text-center text-orange-500">
              Perpustakaan
            </p>
          </div>
          <div
            className="flex flex-col w-full bg-white p-4 gap-4 cursor-pointer"
            onClick={() => {
              setLoginTo("perpustakaan");
              modal.onOpen();
            }}
          >
            <div className="bg-blue-500 flex justify-center items-center h-36 rounded-lg">
              <UserCog2Icon className="text-white h-16 w-16" />
            </div>
            <p className="font-semibold text-xl text-center text-blue-500">
              Super Admin
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
HomePage.isProtected = true;
export default HomePage;
