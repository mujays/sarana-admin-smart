import { ReactElement, useState } from "react";

import { Title } from "@/components/title/Title";

import { AuthenticatedLayout } from "@/layouts/AuthenticatedLayout";
import Head from "next/head";
import classNames from "classnames";
import { Breadcrumb } from "../navigation/components/breadcrumb";
import { Table } from "antd";
import { useRouter } from "next/router";
import { useDebounce } from "@/hooks/useDebounce";
import useListKeluarga from "./hooks/useListKeluarga";
import AddKeluarga from "./components/AddKeluarga";
import { Text } from "@/components/text";

export default function Keluarga() {
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 20,
  });
  const [search, setSearch] = useState("");

  const debounceSearch = useDebounce(search, 300);

  const { columns, isLoading, families } = useListKeluarga({
    limit: pagination.pageSize,
    page: pagination.page,
    search: debounceSearch,
  });

  const router = useRouter();
  const paths = router.pathname.split("/");
  const type = paths[1];
  return (
    <>
      <Head>
        <title>Keluarga | Smart School</title>
      </Head>

      <div className="p-5">
        <Title
          level={1}
          className={classNames("font-[600] !text-[20px] !mb-[4px]")}
        >
          Keluarga
        </Title>

        <Breadcrumb
          items={[
            {
              href: `/${type}/kesiswaan/siswa`,
              title: <Text className="!text-blue-500">Siswa</Text>,
            },
            {
              title: <Text>Keluarga</Text>,
            },
          ]}
        />

        <div className="p-3 space-y-3 border rounded">
          <div className="flex items-center justify-end flex-wrap gap-[8px]">
            <div className="flex gap-3">
              <AddKeluarga />
            </div>
          </div>

          <div className="overflow-auto ">
            <Table
              id="keluarga-table"
              columns={columns}
              rowKey={(obj) => obj.id}
              dataSource={families?.data}
              loading={isLoading}
              pagination={{
                onChange: (page, pageSize) => {
                  setPagination({ page, pageSize });
                },
                total: families?.meta.total,
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

Keluarga.withLayout = (page: ReactElement) => {
  return (
    <AuthenticatedLayout activeLink="keluarga">{page}</AuthenticatedLayout>
  );
};
Keluarga.isProtected = true;
