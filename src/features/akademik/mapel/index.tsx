import { ReactElement, useState } from "react";

import { Title } from "@/components/title/Title";

import { AuthenticatedLayout } from "@/layouts/AuthenticatedLayout";
import classNames from "classnames";
import Head from "next/head";
import { useRouter } from "next/router";
import { Breadcrumb } from "@/features/navigation/components/breadcrumb";
import { Input, Table } from "antd";
import { SearchIcon } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import useListMapel from "./hooks/useListMapel";
import AddMapel from "./components/AddMapel";

export default function MapelPage() {
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
  });
  const [search, setSearch] = useState("");
  const router = useRouter();

  const debounceSearch = useDebounce(search, 300);

  const { columns, mapel, isLoading } = useListMapel({
    limit: pagination.pageSize,
    page: pagination.page,
    search: debounceSearch,
  });

  return (
    <>
      <Head>
        <title>Mata Pelajaran | Smart School</title>
      </Head>

      <div className="p-5">
        <Title
          level={1}
          className={classNames("font-[600] !text-[20px] !mb-[4px]")}
        >
          Mata Pelajaran
        </Title>

        <Breadcrumb isAcademic={true} />

        <div className="p-3 space-y-3 border rounded">
          <div className="flex items-center justify-between flex-wrap gap-[8px]">
            <div className="flex gap-3">
              <Input
                placeholder="Cari mata pelajaran..."
                prefix={<SearchIcon className="h-4 w-4" />}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-64"
              />
            </div>

            <div className="flex gap-3">
              <AddMapel />
            </div>
          </div>

          <Table
            columns={columns}
            dataSource={mapel?.data || []}
            loading={isLoading}
            pagination={{
              current: pagination.page,
              pageSize: pagination.pageSize,
              total: mapel?.total || 0,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} dari ${total} mata pelajaran`,
              onChange: (page, pageSize) => {
                setPagination({ page, pageSize });
              },
            }}
            rowKey="id"
            scroll={{ x: 800 }}
          />
        </div>
      </div>
    </>
  );
}

MapelPage.withLayout = (page: ReactElement) => {
  return <AuthenticatedLayout activeLink="mapel">{page}</AuthenticatedLayout>;
};
MapelPage.isProtected = true;
