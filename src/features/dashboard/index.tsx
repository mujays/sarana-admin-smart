import { ReactElement } from "react";

import { Title } from "@/components/title/Title";

import { AuthenticatedLayout } from "@/layouts/AuthenticatedLayout";
import Head from "next/head";
import { Loader2Icon } from "lucide-react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import {
  Calendar,
  Table,
  TableProps,
  Card,
  Row,
  Col,
  Statistic,
  Progress,
  Tag,
  Spin,
} from "antd";
import {
  UserOutlined,
  BookOutlined,
  TeamOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { useQuery } from "@tanstack/react-query";
import DashboardServices from "@/services/dashboard";

const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center h-40">
      <Loader2Icon className="animate-spin h-10 w-10" />
    </div>
  ),
});

export default function Dashboard() {
  const { data: dataDashboard, isLoading } = useQuery({
    queryKey: ["DASHBOARD_STATS"],
    queryFn: async () => {
      const res = await DashboardServices.getKesiswaan();
      return res.data;
    },
  });

  // Show loading state
  if (isLoading) {
    return (
      <>
        <Head>
          <title>Dashboard | Smart School</title>
        </Head>
        <div className="p-5">
          <Title level={1}>Dashboard</Title>
          <div className="flex justify-center items-center h-96">
            <Spin size="large" tip="Memuat data dashboard..." />
          </div>
        </div>
      </>
    );
  }

  // Use dataDashboard if available, otherwise fallback to default structure
  const dashboardData = dataDashboard || {
    jumlah_siswa: {
      total: 0,
      laki_laki: 0,
      perempuan: 0,
      chart: [],
    },
    kalender_akademik: {
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      month_name: new Date().toLocaleDateString("id-ID", { month: "long" }),
      tahun_ajaran: `${new Date().getFullYear()}/${
        new Date().getFullYear() + 1
      }`,
      days_in_month: 31,
      first_day_of_week: 1,
    },
    keterangan: {
      form_siswa: { pending: 0, approved: 0, total: 0 },
      form_pindahan: { pending: 0, approved: 0, total: 0 },
      items: [],
    },
    recap_alumni: { total: 0, by_year: [] },
    recap_kelas: [],
    recap_wali: { total: 0, with_siswa: 0, without_siswa: 0 },
  };

  // Chart configurations
  const genderChart = {
    series: dashboardData.jumlah_siswa.chart.map((item) => item.value),
    options: {
      chart: {
        type: "donut" as const,
      },
      labels: ["Laki-Laki", "Perempuan"],
      colors: ["#3B82F6", "#EC4899"],
      legend: {
        position: "bottom" as const,
      },
      plotOptions: {
        pie: {
          donut: {
            size: "65%",
          },
        },
      },
    },
  };

  // Class distribution chart
  const kelasData = dashboardData.recap_kelas.filter(
    (kelas) => kelas.jumlah_siswa > 0,
  );
  const kelasChart = {
    series: [
      {
        name: "Jumlah Siswa",
        data: kelasData.map((kelas) => kelas.jumlah_siswa),
      },
    ],
    options: {
      chart: {
        type: "bar" as const,
        horizontal: true,
      },
      xaxis: {
        categories: kelasData.map((kelas) => kelas.nama),
      },
      colors: ["#10B981"],
      plotOptions: {
        bar: {
          borderRadius: 4,
        },
      },
    },
  };

  // Form status chart
  const formChart = {
    series: [
      dashboardData.keterangan.form_siswa.pending,
      dashboardData.keterangan.form_pindahan.pending,
    ],
    options: {
      chart: {
        type: "pie" as const,
      },
      labels: ["Pendaftaran Siswa Baru", "Pendaftaran Siswa Pindahan"],
      colors: ["#3B82F6", "#10B981"],
      legend: {
        position: "bottom" as const,
      },
    },
  };

  // Table columns for class recap
  const kelasColumns: TableProps["columns"] = [
    {
      title: "Kelas",
      dataIndex: "nama",
      key: "nama",
      align: "center",
    },
    {
      title: "Jumlah Siswa",
      dataIndex: "jumlah_siswa",
      key: "jumlah_siswa",
      align: "center",
      render: (value: number) => (
        <Tag color={value > 0 ? "green" : "red"}>{value}</Tag>
      ),
    },
  ];

  return (
    <>
      <Head>
        <title>Dashboard | Smart School</title>
      </Head>
      <div className="p-5">
        <Title level={1}>Dashboard</Title>

        {/* Statistics Cards */}
        <Row gutter={[16, 16]} className="mb-6">
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Total Siswa"
                value={dashboardData.jumlah_siswa.total}
                prefix={<UserOutlined />}
                valueStyle={{ color: "#3f8600" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Total Wali"
                value={dashboardData.recap_wali.total}
                prefix={<TeamOutlined />}
                valueStyle={{ color: "#1890ff" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Form Pending"
                value={
                  dashboardData.keterangan.form_siswa.pending +
                  dashboardData.keterangan.form_pindahan.pending
                }
                prefix={<BookOutlined />}
                valueStyle={{ color: "#cf1322" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Tahun Ajaran"
                value={dashboardData.kalender_akademik.tahun_ajaran}
                prefix={<CalendarOutlined />}
                valueStyle={{ color: "#722ed1" }}
              />
            </Card>
          </Col>
        </Row>

        {/* Main Charts Row */}
        <Row gutter={[16, 16]} className="mb-6">
          <Col xs={24} lg={8}>
            <Card title="Distribusi Gender Siswa" className="h-full">
              <div className="text-center mb-4">
                <div className="text-2xl font-bold">
                  {dashboardData.jumlah_siswa.total}
                </div>
                <div className="text-gray-500">Total Siswa</div>
              </div>
              <Chart
                options={genderChart.options as ApexOptions}
                series={genderChart.series}
                type="donut"
                height={300}
              />
              <div className="mt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Laki-Laki:</span>
                  <span className="font-semibold">
                    {dashboardData.jumlah_siswa.laki_laki}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Perempuan:</span>
                  <span className="font-semibold">
                    {dashboardData.jumlah_siswa.perempuan}
                  </span>
                </div>
              </div>
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Card title="Status Pendaftaran" className="h-full">
              <Chart
                options={formChart.options as ApexOptions}
                series={formChart.series}
                type="pie"
                height={300}
              />
              <div className="mt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Siswa Baru:</span>
                  <Tag color="blue">
                    {dashboardData.keterangan.form_siswa.pending} pending
                  </Tag>
                </div>
                <div className="flex justify-between">
                  <span>Siswa Pindahan:</span>
                  <Tag color="green">
                    {dashboardData.keterangan.form_pindahan.pending} pending
                  </Tag>
                </div>
              </div>
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Card
              title={`Kalender Akademik - ${dashboardData.kalender_akademik.month_name} ${dashboardData.kalender_akademik.year}`}
              className="h-full"
            >
              <div className="text-center mb-4">
                <div className="text-lg font-semibold">Tahun Ajaran</div>
                <div className="text-2xl font-bold text-blue-600">
                  {dashboardData.kalender_akademik.tahun_ajaran}
                </div>
              </div>
              <Calendar
                fullscreen={false}
                value={dayjs(
                  `${dashboardData.kalender_akademik.year}-${dashboardData.kalender_akademik.month}-01`,
                )}
              />
            </Card>
          </Col>
        </Row>

        {/* Bottom Row */}
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={16}>
            <Card title="Distribusi Siswa per Kelas" className="h-full">
              <Chart
                options={kelasChart.options as ApexOptions}
                series={kelasChart.series}
                type="bar"
                height={400}
              />
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Card title="Rekap Kelas" className="h-full">
              <div className="mb-4">
                <div className="text-center">
                  <div className="text-lg font-semibold">Total Kelas Aktif</div>
                  <div className="text-3xl font-bold text-green-600">
                    {
                      dashboardData.recap_kelas.filter(
                        (k) => k.jumlah_siswa > 0,
                      ).length
                    }
                  </div>
                </div>
              </div>
              <Table
                columns={kelasColumns}
                dataSource={dashboardData.recap_kelas}
                rowKey="id"
                pagination={false}
                size="small"
                scroll={{ y: 300 }}
              />
            </Card>
          </Col>
        </Row>

        {/* Wali Statistics */}
        <Row gutter={[16, 16]} className="mt-6">
          <Col xs={24}>
            <Card title="Statistik Wali Murid">
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={8}>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {dashboardData.recap_wali.total}
                    </div>
                    <div className="text-gray-600">Total Wali</div>
                  </div>
                </Col>
                <Col xs={24} sm={8}>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {dashboardData.recap_wali.with_siswa}
                    </div>
                    <div className="text-gray-600">Wali dengan Siswa</div>
                  </div>
                </Col>
                <Col xs={24} sm={8}>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">
                      {dashboardData.recap_wali.without_siswa}
                    </div>
                    <div className="text-gray-600">Wali tanpa Siswa</div>
                  </div>
                </Col>
              </Row>
              <div className="mt-4">
                <Progress
                  percent={Math.round(
                    (dashboardData.recap_wali.with_siswa /
                      dashboardData.recap_wali.total) *
                      100,
                  )}
                  status="active"
                  strokeColor={{
                    from: "#108ee9",
                    to: "#87d068",
                  }}
                  format={(percent) => `${percent}% Wali Aktif`}
                />
              </div>
            </Card>
          </Col>
        </Row>

        {/* Alumni Section */}
        {dashboardData.recap_alumni.total === 0 && (
          <Row gutter={[16, 16]} className="mt-6">
            <Col xs={24}>
              <Card title="Data Alumni">
                <div className="text-center py-8 text-gray-500">
                  <BookOutlined className="text-4xl mb-4" />
                  <div>Belum ada data alumni yang tersedia</div>
                </div>
              </Card>
            </Col>
          </Row>
        )}
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
