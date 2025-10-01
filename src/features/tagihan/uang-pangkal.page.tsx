import { Text } from "@/components/text";
import { Title } from "@/components/title";
import { AuthenticatedLayout } from "@/layouts/AuthenticatedLayout";
import SiswaServices from "@/services/siswa";
import { useQuery } from "@tanstack/react-query";
import { Table } from "antd";
import classNames from "classnames";
import Head from "next/head";
import { useRouter } from "next/router";
import { ReactElement, useState } from "react";
import { Breadcrumb } from "../navigation/components/breadcrumb";
import useListTagihanAdmission from "./hooks/useListTagihanAdmission";
import AddTagihanAdmission from "./components/AddTagihanAdmission";

function UangPangkal() {
  const router = useRouter();
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
  });

  const paths = router.pathname.split("/");

  const { siswaId } = router.query;

  const { columns, isLoading, bills } = useListTagihanAdmission({
    limit: pagination.pageSize,
    page: pagination.page,
    siswaId: +(siswaId as string),
  });

  const { data: siswa, isLoading: isLoadingDetail } = useQuery({
    queryKey: ["STUDENT", router.query?.siswaId],
    enabled: !!siswaId,
    queryFn: async () => {
      const response = await SiswaServices.getOne(+(siswaId as string), {});
      return response.data;
    },
  });

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
          <div className="p-3 space-y-3 border rounded">
            <div className="flex items-center justify-end flex-wrap gap-[8px]">
              <AddTagihanAdmission />
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

UangPangkal.withLayout = (page: ReactElement) => {
  return <AuthenticatedLayout activeLink="tagihan">{page}</AuthenticatedLayout>;
};
UangPangkal.isProtected = true;

export default UangPangkal;
