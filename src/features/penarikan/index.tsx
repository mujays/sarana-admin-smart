import { ReactElement, useState } from "react";

import { Title } from "@/components/title/Title";

import { AuthenticatedLayout } from "@/layouts/AuthenticatedLayout";
import ClientService from "@/services/client";
import { formatCurrency } from "@/stores/utils";
import { useQuery } from "@tanstack/react-query";
import { Table } from "antd";
import classNames from "classnames";
import Head from "next/head";
import { Breadcrumb } from "../navigation/components/breadcrumb";
import AddWithdraw from "./AddWithdraw";
import useListithdraw from "./hooks/useListWithdraw";
import { useRouter } from "next/router";

export default function PenarikanPage() {
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
  });

  const router = useRouter();
  const paths = router.pathname.split("/");
  const type = paths[1];

  const { data: client } = useQuery({
    queryKey: ["CLIENT"],
    queryFn: async () => {
      const response = await ClientService.getClient({ type });
      return response;
    },
  });

  const { columns, isLoading, withdraws } = useListithdraw({
    limit: pagination.pageSize,
    page: pagination.page,
  });
  const { data: dataPending } = useQuery({
    queryKey: ["isPending", withdraws?.data],
    queryFn: async () => {
      const response = await ClientService.getWithdraw({
        status: "pending",
      });
      return response;
    },
  });

  return (
    <>
      <Head>
        <title>Penarikan | Smart School</title>
      </Head>

      <div className="p-5">
        <Title
          level={1}
          className={classNames("font-[600] !text-[20px] !mb-[4px]")}
        >
          Pengaturan
        </Title>

        <Breadcrumb />

        <div className="p-3 space-y-3 flex justify-between border rounded">
          <div className="flex gap-10">
            <div>
              <p>Saldo</p>
              <p className="font-medium text-xl">
                {formatCurrency(client?.data.saldo || 0)}
              </p>
            </div>
            <div>
              <p>Saldo yang bisa ditarik</p>
              <p className="font-medium text-xl">
                {formatCurrency(client?.data.saldo_yang_bisa_ditarik || 0)}
              </p>
            </div>
          </div>

          <AddWithdraw isPending={!!dataPending?.data.length} />
        </div>

        <div className="overflow-auto mt-4">
          <Table
            id="withdraw-table"
            columns={columns}
            rowKey={(obj) => obj.id}
            dataSource={withdraws?.data}
            loading={isLoading}
            pagination={{
              onChange: (page, pageSize) => {
                setPagination({ page, pageSize });
              },
              total: withdraws?.meta.total,
              pageSize: pagination.pageSize,
              current: pagination.page,
            }}
          />
        </div>
      </div>
    </>
  );
}

PenarikanPage.withLayout = (page: ReactElement) => {
  return (
    <AuthenticatedLayout activeLink="penarikan">{page}</AuthenticatedLayout>
  );
};
PenarikanPage.isProtected = true;
