import { Text } from "@/components/text";
import { Title } from "@/components/title";
import { AuthenticatedLayout } from "@/layouts/AuthenticatedLayout";
import SiswaServices from "@/services/siswa";
import TagihanService from "@/services/tagihan";
import TahunAjaranService from "@/services/tahun-ajaran";
import { formatCurrency } from "@/stores/utils";
import { useQuery } from "@tanstack/react-query";
import { Select, Table } from "antd";
import classNames from "classnames";
import { Loader2Icon } from "lucide-react";
import Head from "next/head";
import { useRouter } from "next/router";
import { ReactElement, useEffect, useMemo, useState } from "react";
import { Breadcrumb } from "../navigation/components/breadcrumb";
import AddTagihan from "./components/AddTagihan";
import useListTagihan from "./hooks/useListTagihan";

function DetailTagihanPage() {
  const router = useRouter();
  const [tahunAjaranId, setTahunAjaranId] = useState<null | number>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 12,
  });
  const paths = router.pathname.split("/");
  const { siswaId } = router.query;

  const { columns, isLoading, bills } = useListTagihan({
    limit: pagination.pageSize,
    page: pagination.page,
    siswaId: +(siswaId as string),
    tahunAjaranId: tahunAjaranId as number,
  });

  const { data: siswa, isLoading: isLoadingDetail } = useQuery({
    queryKey: ["STUDENT", router.query?.siswaId],
    enabled: !!siswaId,
    queryFn: async () => {
      const response = await SiswaServices.getOne(+(siswaId as string), {});
      return response.data;
    },
  });

  const { data: tahunAjaran } = useQuery({
    queryKey: ["ACADEMIC"],
    queryFn: async () => {
      const response = await TahunAjaranService.get({
        page_size: 1000000,
        page: 1,
      });
      return response;
    },
  });

  const { data: billMonthly, isLoading: loadingMontly } = useQuery({
    queryKey: ["BILL_MONTHLY", router.query?.siswaId, tahunAjaranId],
    enabled: !!siswa && !!tahunAjaran && !!tahunAjaranId,
    queryFn: async () => {
      const response = await TagihanService.getMonthly(
        +(siswaId as string),
        tahunAjaranId as number,
      );
      return response.data;
    },
  });

  const memoTahunAjaran = useMemo(() => {
    return tahunAjaran?.data
      .find((ta) => ta.id === tahunAjaranId)
      ?.name.split("/");
  }, [tahunAjaran, tahunAjaranId]);

  const mapping = useMemo(() => {
    if (!memoTahunAjaran?.length || !billMonthly) return {};

    const bulanKeys = Object.keys(billMonthly);

    const startIndex = bulanKeys.indexOf("Juli");
    const bulanAkademik = [
      ...bulanKeys.slice(startIndex),
      ...bulanKeys.slice(0, startIndex),
    ];

    const result: Record<
      string,
      (typeof billMonthly)[keyof typeof billMonthly]
    > = {};

    bulanAkademik.forEach((bulan, idx) => {
      const tahun = idx < 6 ? memoTahunAjaran[0] : memoTahunAjaran[1];
      result[`${bulan} ${tahun}`] = billMonthly[bulan];
    });

    return result;
  }, [tahunAjaran, billMonthly]);

  useEffect(() => {
    if (tahunAjaran) {
      setTahunAjaranId(tahunAjaran.data[0].id);
    }
  }, [tahunAjaran]);

  return (
    <>
      <Head>
        <title>Tagihan | Smart School</title>
      </Head>

      <div className="p-5">
        <Title
          level={1}
          className={classNames("font-[600] !text-[20px] !mb-[4px]")}
        >
          Tagihan {siswa?.nama || ""}
        </Title>

        <Breadcrumb
          items={[
            {
              title: <Text className="!text-blue-500">Tagihan</Text>,
              href: `/${paths[1]}/keuangan/tagihan`,
            },
            {
              title: siswa?.nama || "",
            },
          ]}
        />

        <div className="border p-4 rounded-lg space-y-3">
          <div className="flex justify-between">
            <p className="font-medium text-xl">Tagihan Bulanan</p>

            <Select
              value={tahunAjaranId}
              onChange={(val) => {
                setTahunAjaranId(val);
              }}
              placeholder="Tahun Ajaran"
              className="w-40"
              options={tahunAjaran?.data.map((ta) => ({
                label: ta.name,
                value: ta.id,
              }))}
            />
          </div>

          {loadingMontly ? (
            <div className="flex justify-center py-20">
              <Loader2Icon className="animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
              {Object.entries(mapping || {}).map(([month, value]) => (
                <div key={month} className="rounded border">
                  <div className="bg-gray-200 flex items-center justify-center h-10 font-medium">
                    {month}
                  </div>
                  <div className="flex justify-center py-3">
                    {formatCurrency(value as number)}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="p-3 space-y-3 border rounded">
            <div className="flex items-center justify-end flex-wrap gap-[8px]">
              <AddTagihan />
            </div>

            <div className="overflow-auto">
              <Table
                id="bill-table"
                columns={columns}
                dataSource={bills?.data}
                loading={isLoading}
                pagination={{
                  onChange: (page, pageSize) => {
                    setPagination({ page, pageSize });
                  },
                  total: bills?.meta.total,
                  pageSize: pagination.pageSize,
                  current: pagination.page,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

DetailTagihanPage.withLayout = (page: ReactElement) => {
  return <AuthenticatedLayout activeLink="tagihan">{page}</AuthenticatedLayout>;
};
DetailTagihanPage.isProtected = true;

export default DetailTagihanPage;
