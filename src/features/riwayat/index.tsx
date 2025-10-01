import { ReactElement, useState } from "react";

import { Title } from "@/components/title/Title";

import { AuthenticatedLayout } from "@/layouts/AuthenticatedLayout";
import Head from "next/head";
import classNames from "classnames";
import { Breadcrumb } from "../navigation/components/breadcrumb";
import { Table } from "antd";
import { useRouter } from "next/router";
import { useDebounce } from "@/hooks/useDebounce";
import AddRiwayat from "./components/AddRiwayat";
import { Text } from "@/components/text";
import useListRiwayat from "./hooks/useListRiwayat";

export default function Riwayat() {
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
  });
  const [search, setSearch] = useState("");

  const debounceSearch = useDebounce(search, 300);

  const { columns, isLoading, riwayat } = useListRiwayat({
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
        <title>Riwayat Penyakit | Smart School</title>
      </Head>

      <div className="p-5">
        <Title
          level={1}
          className={classNames("font-[600] !text-[20px] !mb-[4px]")}
        >
          Riwayat Penyakit
        </Title>

        <Breadcrumb
          items={[
            {
              href: `/${type}/kesiswaan/siswa`,
              title: <Text className="!text-blue-500">Siswa</Text>,
            },
            {
              title: <Text>Riwayat Penyakit</Text>,
            },
          ]}
        />

        <div className="p-3 space-y-3 border rounded">
          <div className="flex items-center justify-end flex-wrap gap-[8px]">
            <div className="flex gap-3">
              <AddRiwayat />
            </div>
          </div>

          <div className="overflow-auto ">
            <Table
              id="riwayat-table"
              columns={columns}
              rowKey={(obj) => obj.id}
              dataSource={riwayat?.data}
              loading={isLoading}
              pagination={{
                onChange: (page, pageSize) => {
                  setPagination({ page, pageSize });
                },
                total: riwayat?.meta.total,
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

Riwayat.withLayout = (page: ReactElement) => {
  return (
    <AuthenticatedLayout activeLink="keluarga">{page}</AuthenticatedLayout>
  );
};
Riwayat.isProtected = true;
