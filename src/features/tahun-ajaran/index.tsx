import { ReactElement, useState } from "react";

import { Title } from "@/components/title/Title";

import { AuthenticatedLayout } from "@/layouts/AuthenticatedLayout";
import Head from "next/head";
import classNames from "classnames";
import { Text } from "@/components/text";
import { useDebounce } from "@/hooks/useDebounce";
import { Breadcrumb } from "../navigation/components/breadcrumb";
import { Table } from "antd";
import useListTahunAjaran from "./hooks/useListTahunAjaran";
import { DashboardIcon } from "@/components/icons";
import { ROUTE_MAP } from "../navigation/constants";
import AddTahunAjaran from "./components/AddTahunAjaran";

export default function TahunAjaranPage() {
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
  });
  const [search, setSearch] = useState("");

  const debounceSearch = useDebounce(search, 300);

  const { columns, isLoading, academics } = useListTahunAjaran({
    limit: pagination.pageSize,
    page: pagination.page,
    search: debounceSearch,
  });

  return (
    <>
      <Head>
        <title>Tahun Ajaran | Smart School</title>
      </Head>

      <div className="p-5">
        <Title
          level={1}
          className={classNames("font-[600] !text-[20px] !mb-[4px]")}
        >
          Tahun Ajaran
        </Title>

        <Breadcrumb
          items={[
            {
              title: "Tahun Ajaran",
            },
          ]}
        />

        <div className="p-3 space-y-3 border rounded">
          <div className="flex items-center justify-end flex-wrap gap-[8px]">
            <div className="flex gap-3">
              <AddTahunAjaran />
            </div>
          </div>

          <div className="overflow-auto ">
            <Table
              id="ta-table"
              columns={columns}
              rowKey={(obj) => obj.id}
              dataSource={academics?.data}
              loading={isLoading}
              pagination={{
                onChange: (page, pageSize) => {
                  setPagination({ page, pageSize });
                },
                total: academics?.meta.total,
                pageSize: pagination.pageSize,
                current: pagination.page,
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}

TahunAjaranPage.withLayout = (page: ReactElement) => {
  return (
    <AuthenticatedLayout activeLink="tahun-ajaran">{page}</AuthenticatedLayout>
  );
};
TahunAjaranPage.isProtected = true;
