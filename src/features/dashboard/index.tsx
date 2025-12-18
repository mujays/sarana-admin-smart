import { ReactElement } from "react";

import { Title } from "@/components/title/Title";

import { AuthenticatedLayout } from "@/layouts/AuthenticatedLayout";
import Head from "next/head";
import { Loader2Icon } from "lucide-react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import { Calendar, Spin, Table, TableProps } from "antd";
import { NotificationOutlined } from "@ant-design/icons";
import TahunAjaranService from "@/services/tahun-ajaran";
import { useQuery } from "@tanstack/react-query";
const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center h-40">
      <Loader2Icon className="animate-spin h-10 w-10" />
    </div>
  ),
});

export default function Dashboard() {
  const columns: TableProps["columns"] = [
    {
      title: "Tahun Ajaran",
      dataIndex: "tahun_ajaran",
      align: "center",
    },
    {
      title: "Laki - Laki",
      dataIndex: "male",
    },
    {
      title: "Perempuan",
      dataIndex: "female",
    },
  ];

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
    series: [countSiswa?.data[0]?.jumlah_sd, countSiswa?.data[0]?.jumlah_smp],
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

  return (
    <>
      <Head>
        <title>Dashboard | Smart School</title>
      </Head>
      <div className="p-5">
        <Title level={1}>Dashboard</Title>
        <div className="space-y-4">
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
            <div className="border w-full border-gray-200 rounded-lg p-4">
              <div>
                <p className="font-medium">Kalender Akademik</p>
              </div>
              <Calendar fullscreen={false} />
            </div>
          </div>
          <div className="flex gap-3">
            <div className="border w-full border-gray-200 space-y-2 rounded-lg p-4">
              <div>
                <p className="font-medium">Reminder</p>
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
            <div className="border w-full border-gray-200 space-y-2 rounded-lg p-4">
              <div>
                <p className="font-medium">Riwayat Alumni</p>
              </div>
              <Table columns={columns} dataSource={[]} loading={false} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

Dashboard.withLayout = (page: ReactElement) => {
  return (
    <AuthenticatedLayout activeLink="dashboard">{page}</AuthenticatedLayout>
  );
};
Dashboard.isProtected = true;
