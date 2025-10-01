import { ReactElement, useState } from "react";

import { Title } from "@/components/title/Title";

import { AuthenticatedLayout } from "@/layouts/AuthenticatedLayout";
import Head from "next/head";
import classNames from "classnames";
import { useDebounce } from "@/hooks/useDebounce";
import { Breadcrumb } from "../navigation/components/breadcrumb";
import { Input, Select, Table } from "antd";
import useListSiswa from "../siswa/hooks/useListSiswa";
import { SearchIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import KelasServices from "@/services/kelas";
import GenerateTagihan from "./components/GenerateTagihan";

export default function TagihanPage() {
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
  });
  const [search, setSearch] = useState("");
  const [kelasValue, setKelasValue] = useState("");

  const debounceSearch = useDebounce(search, 300);

  const { columns, isLoading, students } = useListSiswa({
    limit: pagination.pageSize,
    page: pagination.page,
    search: debounceSearch,
    kelas: kelasValue ? [kelasValue] : [],
    app: "keuangan",
    isNewStudent: false,
  });

  const { data: kelas } = useQuery({
    queryKey: ["CLASSES", kelasValue],
    queryFn: async () => {
      const response = await KelasServices.get({
        select: true,
        page: 1,
      });
      return response;
    },
  });

  const kelasOptions =
    kelas?.data.map((k) => ({
      label: k?.nama,
      value: k?.id,
    })) || [];

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
          Tagihan Siswa
        </Title>

        <Breadcrumb
          items={[
            {
              title: "Tagihan",
            },
          ]}
        />

        <div className="p-3 space-y-3 border rounded">
          <div className="flex items-end justify-between flex-wrap gap-[8px]">
            <div className="flex gap-2">
              <div>
                <p className="pb-1 font-medium">Kelas</p>
                <Select
                  value={kelasValue}
                  onChange={(val) => {
                    setKelasValue(val);
                  }}
                  placeholder="Kelas"
                  className="w-40"
                  options={[
                    {
                      label: "All",
                      value: "",
                    },
                    ...(kelasOptions as any),
                  ]}
                />
              </div>
            </div>
            <div className="flex gap-3">
              <Input
                placeholder="Search"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
                prefix={<SearchIcon className="text-gray-300" />}
              />

              <GenerateTagihan />
            </div>
          </div>

          <div className="overflow-auto ">
            <Table
              id="tagihan-table"
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

TagihanPage.withLayout = (page: ReactElement) => {
  return <AuthenticatedLayout activeLink="tipe">{page}</AuthenticatedLayout>;
};
TagihanPage.isProtected = true;
