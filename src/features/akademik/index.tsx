import { ReactElement } from "react";

import { Title } from "@/components/title/Title";

import { AuthenticatedLayout } from "@/layouts/AuthenticatedLayout";
import Head from "next/head";
import { Loader2Icon } from "lucide-react";
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center h-40">
      <Loader2Icon className="animate-spin h-10 w-10" />
    </div>
  ),
});

export default function DashboardAkademik() {
  return (
    <>
      <Head>
        <title>Dashboard Akademik | Smart School</title>
      </Head>
      <div className="p-5">
        <Title level={1}>Dashboard Akademik</Title>
      </div>
    </>
  );
}

DashboardAkademik.withLayout = (page: ReactElement) => {
  return (
    <AuthenticatedLayout activeLink="dashboard-akademik">
      {page}
    </AuthenticatedLayout>
  );
};
DashboardAkademik.isProtected = true;
