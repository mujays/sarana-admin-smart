import { ReactElement, useState } from "react";

import { Title } from "@/components/title/Title";

import { AuthenticatedLayout } from "@/layouts/AuthenticatedLayout";
import Head from "next/head";
import classNames from "classnames";
import { Breadcrumb } from "../navigation/components/breadcrumb";
import { Input, Select, Table } from "antd";
import { SearchIcon } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import useListAlumni from "./hooks/useListAlumni";

const currentYear = new Date().getFullYear();
const last10Years = Array.from({ length: 10 }, (_, i) => currentYear - i);

export default function AlumniPage() {
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
  });
  const [search, setSearch] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());

  const debounceSearch = useDebounce(search, 300);

  const { columns, isLoading, students } = useListAlumni({
    limit: pagination.pageSize,
    page: pagination.page,
    search: debounceSearch,
    tahun: year,
  });

  return (
    <>
      <Head>
        <title>Alumni | Smart School</title>
      </Head>

      <div className="p-5">
        <Title
          level={1}
          className={classNames("font-[600] !text-[20px] !mb-[4px]")}
        >
          Alumni
        </Title>

        <Breadcrumb />

        <div className="p-3 space-y-3 border rounded">
          <div className="flex items-center justify-between flex-wrap gap-[8px]">
            <div className="flex gap-2">
              <Select
                value={year}
                onChange={(val) => {
                  setYear(val);
                }}
                placeholder="Tipe"
                className="w-40"
                options={last10Years.map((val) => ({
                  label: val,
                  value: val,
                }))}
              />
            </div>
            <div className="flex gap-3">
              <Input
                placeholder="Search"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPagination({ page: 1, pageSize: pagination.pageSize });
                }}
                prefix={<SearchIcon className="text-gray-300" />}
              />
            </div>
          </div>

          <div className="overflow-auto ">
            <Table
              id="alumni-table"
              columns={columns}
              rowKey={(obj) => obj.nik}
              dataSource={students?.data}
              loading={isLoading}
              pagination={{
                onChange: (page, pageSize) => {
                  setPagination({ page, pageSize });
                },
                total: students?.meta.total,
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

AlumniPage.withLayout = (page: ReactElement) => {
  return <AuthenticatedLayout activeLink="alumni">{page}</AuthenticatedLayout>;
};
AlumniPage.isProtected = true;
