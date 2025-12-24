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
import {
  Card,
  Row,
  Col,
  Statistic,
  Progress,
  Tag,
  Table,
  TableProps,
} from "antd";
import {
  DollarOutlined,
  BankOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
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
  const dataFix = {
    pemasukan: {
      total: 0,
      target: 7185360000,
      percentage: 0,
      formatted: "Rp. 0",
    },
    saldo: {
      balance: 0,
      formatted: "Rp. 0",
    },
    jumlah_siswa: {
      total: 293,
      aktif: 274,
      non_aktif: 19,
    },
    riwayat_transaksi: {
      tagihan: {
        lunas: 1592,
        belum_lunas: 1695,
        melampaui_tempo: 100,
        belum_melampaui_tempo: 1595,
      },
      transaksi_pending: 181,
      uang_pangkal: {
        lunas: 261,
        diangsur: 0,
        belum_lunas: 93,
      },
      summary: [
        {
          label: "Lunas",
          value: 1592,
          color: "#10B981",
        },
        {
          label: "Diangsur",
          value: 0,
          color: "#F59E0B",
        },
        {
          label: "Belum & sudah melampaui tempo pembayaran",
          value: 100,
          color: "#EF4444",
        },
        {
          label: "Transaksi dalam proses",
          value: 181,
          color: "#3B82F6",
        },
      ],
    },
    jalur_tempo_tagihan: [
      {
        label: "Terlambat",
        value: 100,
        color: "#EF4444",
      },
      {
        label: "Jatuh tempo minggu ini",
        value: 0,
        color: "#F59E0B",
      },
      {
        label: "Jatuh tempo bulan ini",
        value: 257,
        color: "#3B82F6",
      },
      {
        label: "Jatuh tempo mendatang",
        value: 1338,
        color: "#10B981",
      },
    ],
    tagihan_chart: [
      {
        bulan: "Januari",
        bulan_number: 1,
        total_tagihan: 0,
        tagihan_lunas: 0,
        pembayaran: 0,
      },
      {
        bulan: "Februari",
        bulan_number: 2,
        total_tagihan: 0,
        tagihan_lunas: 0,
        pembayaran: 0,
      },
      {
        bulan: "Maret",
        bulan_number: 3,
        total_tagihan: 0,
        tagihan_lunas: 0,
        pembayaran: 0,
      },
      {
        bulan: "April",
        bulan_number: 4,
        total_tagihan: 0,
        tagihan_lunas: 0,
        pembayaran: 0,
      },
      {
        bulan: "Mei",
        bulan_number: 5,
        total_tagihan: 0,
        tagihan_lunas: 0,
        pembayaran: 0,
      },
      {
        bulan: "Juni",
        bulan_number: 6,
        total_tagihan: 0,
        tagihan_lunas: 0,
        pembayaran: 0,
      },
      {
        bulan: "Juli",
        bulan_number: 7,
        total_tagihan: 0,
        tagihan_lunas: 0,
        pembayaran: 0,
      },
      {
        bulan: "Agustus",
        bulan_number: 8,
        total_tagihan: 586800000,
        tagihan_lunas: 306900000,
        pembayaran: 0,
      },
      {
        bulan: "September",
        bulan_number: 9,
        total_tagihan: 5065650000,
        tagihan_lunas: 2433425000,
        pembayaran: 0,
      },
      {
        bulan: "Oktober",
        bulan_number: 10,
        total_tagihan: 41250000,
        tagihan_lunas: 20600000,
        pembayaran: 0,
      },
      {
        bulan: "November",
        bulan_number: 11,
        total_tagihan: 0,
        tagihan_lunas: 0,
        pembayaran: 0,
      },
      {
        bulan: "Desember",
        bulan_number: 12,
        total_tagihan: 0,
        tagihan_lunas: 0,
        pembayaran: 0,
      },
    ],
    uang_pangkal_summary: {
      total_kewajiban: 1491660000,
      total_terbayar: 1440973751,
      sisa_tagihan: 50686249,
      percentage: 96.6,
      formatted: {
        total_kewajiban: "Rp. 1.491.660.000",
        total_terbayar: "Rp. 1.440.973.751",
        sisa_tagihan: "Rp. 50.686.249",
      },
    },
  };

  // Chart configurations
  const summaryChart = {
    series: dataFix.riwayat_transaksi.summary.map((item) => item.value),
    options: {
      chart: { type: "donut" as const },
      labels: dataFix.riwayat_transaksi.summary.map((item) => item.label),
      colors: dataFix.riwayat_transaksi.summary.map((item) => item.color),
      legend: { position: "bottom" as const },
      plotOptions: {
        pie: { donut: { size: "65%" } },
      },
    },
  };

  const tempoChart = {
    series: dataFix.jalur_tempo_tagihan.map((item) => item.value),
    options: {
      chart: { type: "pie" as const },
      labels: dataFix.jalur_tempo_tagihan.map((item) => item.label),
      colors: dataFix.jalur_tempo_tagihan.map((item) => item.color),
      legend: { position: "bottom" as const },
    },
  };

  // Filter active months for line chart
  const activeMonths = dataFix.tagihan_chart.filter(
    (month) => month.total_tagihan > 0,
  );
  const monthlyChart = {
    series: [
      {
        name: "Total Tagihan",
        data: activeMonths.map((month) => month.total_tagihan),
      },
      {
        name: "Tagihan Lunas",
        data: activeMonths.map((month) => month.tagihan_lunas),
      },
    ],
    options: {
      chart: { type: "line" as const },
      stroke: { curve: "smooth" as const },
      xaxis: { categories: activeMonths.map((month) => month.bulan) },
      colors: ["#3B82F6", "#10B981"],
      legend: { position: "top" as const },
    },
  };

  const siswaChart = {
    series: [dataFix.jumlah_siswa.aktif, dataFix.jumlah_siswa.non_aktif],
    options: {
      chart: { type: "pie" as const },
      labels: ["Aktif", "Non Aktif"],
      colors: ["#10B981", "#EF4444"],
      legend: { position: "bottom" as const },
    },
  };

  // Table columns for monthly data
  const monthlyColumns: TableProps["columns"] = [
    { title: "Bulan", dataIndex: "bulan", key: "bulan" },
    {
      title: "Total Tagihan",
      dataIndex: "total_tagihan",
      key: "total_tagihan",
      render: (value: number) =>
        new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
        }).format(value),
    },
    {
      title: "Tagihan Lunas",
      dataIndex: "tagihan_lunas",
      key: "tagihan_lunas",
      render: (value: number) =>
        new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
        }).format(value),
    },
  ];

  return (
    <>
      <Head>
        <title>Dashboard Keuangan | Smart School</title>
      </Head>
      <div className="p-5">
        <Title level={1}>Dashboard Keuangan</Title>

        {/* Main Statistics */}
        <Row gutter={[16, 16]} className="mb-6">
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Pemasukan"
                value={dataFix.pemasukan.formatted}
                prefix={<DollarOutlined />}
                valueStyle={{ color: "#3f8600" }}
              />
              <Progress
                percent={dataFix.pemasukan.percentage}
                format={() => `${dataFix.pemasukan.percentage}% dari target`}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Saldo"
                value={dataFix.saldo.formatted}
                prefix={<BankOutlined />}
                valueStyle={{ color: "#1890ff" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Total Siswa"
                value={dataFix.jumlah_siswa.total}
                prefix={<TeamOutlined />}
                valueStyle={{ color: "#722ed1" }}
              />
              <div className="text-sm text-gray-500 mt-2">
                Aktif: {dataFix.jumlah_siswa.aktif} | Non-aktif:{" "}
                {dataFix.jumlah_siswa.non_aktif}
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Transaksi Pending"
                value={dataFix.riwayat_transaksi.transaksi_pending}
                prefix={<ClockCircleOutlined />}
                valueStyle={{ color: "#cf1322" }}
              />
            </Card>
          </Col>
        </Row>

        {/* Charts Row */}
        <Row gutter={[16, 16]} className="mb-6">
          <Col xs={24} lg={8}>
            <Card title="Ringkasan Transaksi" className="h-full">
              <Chart
                options={summaryChart.options as ApexOptions}
                series={summaryChart.series}
                type="donut"
                height={300}
              />
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Card title="Jatuh Tempo Tagihan" className="h-full">
              <Chart
                options={tempoChart.options as ApexOptions}
                series={tempoChart.series}
                type="pie"
                height={300}
              />
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Card title="Status Siswa" className="h-full">
              <div className="text-center mb-4">
                <div className="text-2xl font-bold">
                  {dataFix.jumlah_siswa.total}
                </div>
                <div className="text-gray-500">Total Siswa</div>
              </div>
              <Chart
                options={siswaChart.options as ApexOptions}
                series={siswaChart.series}
                type="pie"
                height={200}
              />
            </Card>
          </Col>
        </Row>

        {/* Monthly Billing Trend */}
        <Row gutter={[16, 16]} className="mb-6">
          <Col xs={24}>
            <Card title="Tren Tagihan Bulanan">
              <Chart
                options={monthlyChart.options as ApexOptions}
                series={monthlyChart.series}
                type="line"
                height={400}
              />
            </Card>
          </Col>
        </Row>

        {/* Detailed Statistics */}
        <Row gutter={[16, 16]} className="mb-6">
          <Col xs={24} lg={12}>
            <Card title="Detail Tagihan">
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12}>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <CheckCircleOutlined className="text-2xl text-green-600 mb-2" />
                    <div className="text-2xl font-bold text-green-600">
                      {dataFix.riwayat_transaksi.tagihan.lunas}
                    </div>
                    <div className="text-gray-600">Tagihan Lunas</div>
                  </div>
                </Col>
                <Col xs={24} sm={12}>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <ExclamationCircleOutlined className="text-2xl text-red-600 mb-2" />
                    <div className="text-2xl font-bold text-red-600">
                      {dataFix.riwayat_transaksi.tagihan.belum_lunas}
                    </div>
                    <div className="text-gray-600">Belum Lunas</div>
                  </div>
                </Col>
                <Col xs={24} sm={12}>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <ClockCircleOutlined className="text-2xl text-yellow-600 mb-2" />
                    <div className="text-2xl font-bold text-yellow-600">
                      {dataFix.riwayat_transaksi.tagihan.melampaui_tempo}
                    </div>
                    <div className="text-gray-600">Melampaui Tempo</div>
                  </div>
                </Col>
                <Col xs={24} sm={12}>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <FileTextOutlined className="text-2xl text-blue-600 mb-2" />
                    <div className="text-2xl font-bold text-blue-600">
                      {dataFix.riwayat_transaksi.tagihan.belum_melampaui_tempo}
                    </div>
                    <div className="text-gray-600">Belum Melampaui Tempo</div>
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card title="Uang Pangkal">
              <div className="mb-4">
                <Progress
                  percent={dataFix.uang_pangkal_summary.percentage}
                  strokeColor={{
                    from: "#108ee9",
                    to: "#87d068",
                  }}
                  format={(percent) => `${percent}% Terbayar`}
                />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Total Kewajiban:</span>
                  <span className="font-semibold">
                    {dataFix.uang_pangkal_summary.formatted.total_kewajiban}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Total Terbayar:</span>
                  <span className="font-semibold text-green-600">
                    {dataFix.uang_pangkal_summary.formatted.total_terbayar}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Sisa Tagihan:</span>
                  <span className="font-semibold text-red-600">
                    {dataFix.uang_pangkal_summary.formatted.sisa_tagihan}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t">
                <Row gutter={[8, 8]}>
                  <Col xs={24} sm={8}>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">
                        {dataFix.riwayat_transaksi.uang_pangkal.lunas}
                      </div>
                      <div className="text-xs text-gray-600">Lunas</div>
                    </div>
                  </Col>
                  <Col xs={24} sm={8}>
                    <div className="text-center">
                      <div className="text-lg font-bold text-yellow-600">
                        {dataFix.riwayat_transaksi.uang_pangkal.diangsur}
                      </div>
                      <div className="text-xs text-gray-600">Diangsur</div>
                    </div>
                  </Col>
                  <Col xs={24} sm={8}>
                    <div className="text-center">
                      <div className="text-lg font-bold text-red-600">
                        {dataFix.riwayat_transaksi.uang_pangkal.belum_lunas}
                      </div>
                      <div className="text-xs text-gray-600">Belum Lunas</div>
                    </div>
                  </Col>
                </Row>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Monthly Table */}
        <Row gutter={[16, 16]}>
          <Col xs={24}>
            <Card title="Detail Tagihan Bulanan">
              <Table
                columns={monthlyColumns}
                dataSource={dataFix.tagihan_chart}
                rowKey="bulan_number"
                pagination={false}
                scroll={{ x: 800 }}
              />
            </Card>
          </Col>
        </Row>
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
