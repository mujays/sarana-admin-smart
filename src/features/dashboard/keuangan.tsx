import { ReactElement } from "react";

import { Title } from "@/components/title/Title";

import { AuthenticatedLayout } from "@/layouts/AuthenticatedLayout";
import Head from "next/head";
import {
  ArrowBigDown,
  BanknoteIcon,
  HistoryIcon,
  Loader2Icon,
  MessageCircleReply,
} from "lucide-react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import { Skeleton, Spin } from "antd";
import { NotificationOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import TagihanService from "@/services/tagihan";
import TahunAjaranService from "@/services/tahun-ajaran";
import ClientService from "@/services/client";
import { useRouter } from "next/router";
import { formatCurrency } from "@/stores/utils";
const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center h-40">
      <Loader2Icon className="animate-spin h-10 w-10" />
    </div>
  ),
});

export default function DashboardKeuangan() {
  const router = useRouter();
  const paths = router.pathname.split("/");
  const type = paths[1];
  const { data: paidBills, isLoading: isLoadingBillsPaid } = useQuery({
    queryKey: ["BILLS_CHART_PAID"],
    queryFn: async () => {
      const response = await TagihanService.get({
        lunas: true,
        chart: true,
      });
      return response;
    },
  });
  const { data: noPaidBills, isLoading: isLoadingBillsNoPaid } = useQuery({
    queryKey: ["BILLS_CHART_NO_PAID"],
    queryFn: async () => {
      const response = await TagihanService.get({
        lunas: false,
        chart: true,
      });
      return response;
    },
  });

  const { data: client, isLoading: isLoadingClient } = useQuery({
    queryKey: ["CLIENT"],
    queryFn: async () => {
      const response = await ClientService.getClient({ type });
      return response;
    },
  });

  const { data: countSiswa, isLoading: isLoadingCountSiswa } = useQuery({
    queryKey: ["COUNT_SISWA"],
    queryFn: async () => {
      const response = await TahunAjaranService.get({
        page_size: 1,
      });
      return response;
    },
  });

  const pieSiswa = {
    series: [countSiswa?.data[0].jumlah_sd, countSiswa?.data[0].jumlah_smp],
    options: {
      chart: {
        type: "pie",
      },
      labels: ["SD", "SMP"],
      colors: ["#6597fc", "#fc6d65"],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    },
  };

  const chartTagihan = {
    series: [
      {
        name: "Lunas",
        data: paidBills?.data.map((d) => d.total),
      },
      {
        name: "Belum Lunas",
        data: noPaidBills?.data.map((d) => d.total),
      },
    ],
    options: {
      chart: {
        height: 350,
        type: "line",
        dropShadow: {
          enabled: true,
          color: "#000",
          top: 18,
          left: 7,
          blur: 10,
          opacity: 0.2,
        },
        zoom: {
          enabled: false,
        },
        toolbar: {
          show: false,
        },
      },
      colors: ["#e6ad10", "#10c2e6"],
      dataLabels: {
        enabled: true,
      },
      stroke: {
        curve: "smooth",
      },
      title: {
        text: "Tagihan",
        align: "left",
      },
      grid: {
        borderColor: "#e7e7e7",
        row: {
          colors: ["#f3f3f3", "transparent"],
          opacity: 0.5,
        },
      },
      markers: {
        size: 1,
      },
      xaxis: {
        categories: paidBills?.data.map((d) => d.bulan),
        title: {
          text: "Tahun",
        },
      },
      yaxis: {
        min: 1,
      },
      legend: {
        position: "top",
        horizontalAlign: "right",
        floating: true,
        offsetY: -25,
        offsetX: -5,
      },
    },
  };

  return (
    <>
      <Head>
        <title>Dashboard | Smart School</title>
      </Head>
      <div className="p-5">
        <Title level={1}>Dashboard</Title>
        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="border min-w-[280px] border-gray-200 space-y-2 rounded-lg p-4">
              <div className="flex justify-between">
                <div className="flex items-center gap-1">
                  <ArrowBigDown />
                  <p className="font-semibold text-lg">Pemasukan</p>
                </div>
              </div>
              <div className="flex gap-2 items-center">
                <p className="text-xl">Rp. 10.000.000</p>
                <p className="bg-red-100 text-red-500 px-1 rounded">-31%</p>
              </div>
            </div>
            <div className="border min-w-[280px] border-gray-200 space-y-2 rounded-lg p-4">
              <div className="flex justify-between">
                <div className="flex items-center gap-1">
                  <BanknoteIcon />
                  <p className="font-semibold text-lg">Saldo</p>
                </div>
              </div>
              {isLoadingClient ? (
                <Spin />
              ) : (
                <div className="">
                  <p className="text-xl">
                    {formatCurrency(client?.data.saldo as number)}
                  </p>
                  <p className="text-green-500">
                    (
                    {formatCurrency(
                      client?.data.saldo_yang_bisa_ditarik as number,
                    )}
                    )
                  </p>
                </div>
              )}
            </div>
            <div className="border w-full border-gray-200 space-y-2 rounded-lg p-4">
              <div className="flex justify-between">
                <div className="flex items-center gap-1">
                  <HistoryIcon />
                  <p className="font-semibold text-lg">Riwayat Transaksi</p>
                </div>
                <MessageCircleReply className="scale-x-[-1] text-gray-500" />
              </div>
              <div>
                <div className="border p-2 rounded-xl flex gap-1 items-start">
                  <NotificationOutlined className="w-5 h-5" />
                  <div>Murid A berhasil melunasi pembayaran SPP</div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="border w-full border-gray-200 space-y-5 rounded-lg p-4">
              <div className="flex justify-between">
                <p className="font-medium">Jumlah Siswa</p>
                <p className="text-xl font-medium">
                  {(countSiswa?.data[0]?.jumlah_sd as number) +
                    (countSiswa?.data[0]?.jumlah_smp as number)}
                </p>
              </div>
              {isLoadingCountSiswa ? (
                <Spin />
              ) : (
                <Chart
                  options={pieSiswa.options as ApexOptions}
                  series={pieSiswa.series as any}
                  type="pie"
                  width={"100%"}
                  height={350}
                />
              )}
            </div>
            <div className="border w-full border-gray-200 space-y-2 rounded-lg p-4">
              <div>
                <p className="font-medium">Jatuh Tempo Tagihan</p>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="border p-2 rounded-xl flex gap-2 items-start">
                    <NotificationOutlined className="w-5 h-5" />
                    <div>
                      Calon Wali B sudah mengajukan pendaftaran siswa pindahan
                    </div>
                  </div>
                  <div className="ml-3 flex">
                    <div className="rounded-b-lg w-14 text-center py-[2px] text-xs cursor-pointer hover:bg-green-600 bg-green-500 text-white">
                      Lihat
                    </div>
                    <div className="rounded-b-lg w-16 text-center py-[2px] text-xs cursor-pointer hover:bg-red-600 bg-red-500 text-white">
                      Abaikan
                    </div>
                  </div>
                </div>
                <div>
                  <div className="border p-2 rounded-xl flex gap-2 items-start">
                    <NotificationOutlined className="w-5 h-5" />
                    <div>
                      Calon Wali B sudah mengajukan pendaftaran siswa pindahan
                    </div>
                  </div>
                  <div className="ml-3 flex">
                    <div className="rounded-b-lg w-14 text-center py-[2px] text-xs cursor-pointer hover:bg-green-600 bg-green-500 text-white">
                      Lihat
                    </div>
                    <div className="rounded-b-lg w-16 text-center py-[2px] text-xs cursor-pointer hover:bg-red-600 bg-red-500 text-white">
                      Abaikan
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {isLoadingBillsNoPaid || isLoadingBillsPaid ? (
            <Skeleton />
          ) : (
            <Chart
              options={chartTagihan.options as ApexOptions}
              series={chartTagihan.series as any}
              width={"100%"}
              type="line"
              height={350}
            />
          )}
        </div>
      </div>
    </>
  );
}

DashboardKeuangan.withLayout = (page: ReactElement) => {
  return (
    <AuthenticatedLayout activeLink="dashboard">{page}</AuthenticatedLayout>
  );
};
DashboardKeuangan.isProtected = true;
