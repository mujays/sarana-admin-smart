import { ReactElement, useState } from "react";

import { Title } from "@/components/title/Title";

import { AuthenticatedLayout } from "@/layouts/AuthenticatedLayout";
import Head from "next/head";
import classNames from "classnames";
import { useDebounce } from "@/hooks/useDebounce";
import useListKelas from "./hooks/useListKelas";
import { Breadcrumb } from "../navigation/components/breadcrumb";
import { Table } from "antd";
import AddKelas from "./components/AddKelas";

export default function Kelas() {
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 20,
  });
  const [search, setSearch] = useState("");

  const debounceSearch = useDebounce(search, 300);
  const [sort, setSort] = useState("name,asc");

  const { columns, isLoading, kelas } = useListKelas({
    limit: pagination.pageSize,
    page: pagination.page,
    search: debounceSearch,
    withParam: "",
    sort: sort,
  });

  return (
    <>
      <Head>
        <title>Kelas | Smart School</title>
      </Head>

      <div className="p-5">
        <Title
          level={1}
          className={classNames("font-[600] !text-[20px] !mb-[4px]")}
        >
          Kelas
        </Title>

        <Breadcrumb />

        <div className="p-3 space-y-3 border rounded">
          <div className="flex items-center justify-end flex-wrap gap-[8px]">
            <div className="flex gap-3">
              <AddKelas />
            </div>
          </div>

          <div className="overflow-auto ">
            <Table
              id="kelas-table"
              columns={columns}
              rowKey={(obj) => obj.id}
              dataSource={kelas?.data}
              loading={isLoading}
              pagination={{
                onChange: (page, pageSize) => {
                  setPagination({ page, pageSize });
                },
                total: kelas?.meta.total,
                pageSize: pagination.pageSize,
                current: pagination.page,
              }}
              onChange={(pagination, filters, sorter, extra) => {
                if (!Array.isArray(sorter)) {
                  if (sorter.column) {
                    let dataIndex = sorter.column.dataIndex as string;
                    const sort = `${
                      sorter.order === "ascend"
                        ? `${dataIndex},asc`
                        : `${dataIndex},desc`
                    }`;
                    setSort(sort);
                  } else {
                    setSort("name,asc");
                  }
                }
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}

Kelas.withLayout = (page: ReactElement) => {
  return <AuthenticatedLayout activeLink="kelas">{page}</AuthenticatedLayout>;
};
Kelas.isProtected = true;
