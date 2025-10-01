import { Title } from "@/components/title";
import { AuthenticatedLayout } from "@/layouts/AuthenticatedLayout";
import classNames from "classnames";
import Head from "next/head";
import { ReactElement, useState } from "react";
import { Breadcrumb } from "../navigation/components/breadcrumb";
import { Input, Table } from "antd";
import { useDebounce } from "@/hooks/useDebounce";
import { SearchIcon } from "lucide-react";
import useListPindahan from "./hooks/useListPindahan";

const statusData = [
  {
    name: "Pembayaran",
    value: "PENDING_PAYMENT",
  },
  {
    name: "Formulir",
    value: "PENDING_INPUT",
  },
  {
    name: "Test",
    value: "TEST",
  },
  {
    name: "Pilih Kelas",
    value: "SELECT_CLASS",
  },
  {
    name: "Daftar Ulang",
    value: "RE_REGISTER",
  },
];
export default function SiswaPindahan() {
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 20,
  });
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("PENDING_PAYMENT");

  const debounceSearch = useDebounce(search, 300);

  const { columns, isLoading, students } = useListPindahan({
    limit: pagination.pageSize,
    page: pagination.page,
    search: debounceSearch,
    status: selectedStatus,
  });

  return (
    <>
      <Head>
        <title>Siswa Pindahan | Smart School</title>
      </Head>

      <div className="p-5">
        <Title
          level={1}
          className={classNames("font-[600] !text-[20px] !mb-[4px]")}
        >
          Pendaftaran Siswa Pindahan
        </Title>

        <Breadcrumb />

        <div className="mb-3 flex justify-between">
          <Input
            placeholder="Search"
            className="!w-[280px]"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            prefix={<SearchIcon className="text-gray-300" />}
          />
        </div>

        <div className="flex bg-gray-200 w-fit mb-3 rounded-lg p-1">
          {statusData.map((status) => (
            <div
              key={status.value}
              onClick={() => {
                setSelectedStatus(status.value);
                setPagination({
                  page: 1,
                  pageSize: 20,
                });
              }}
              className={classNames(
                "cursor-pointer rounded px-3 py-1 w-[180px] text-center",
                status.value === selectedStatus && "bg-white font-semibold",
              )}
            >
              {status.name}
            </div>
          ))}
        </div>

        <div className="overflow-auto">
          <Table
            id="pindahan-table"
            columns={columns}
            rowKey={(obj) => obj.id}
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
    </>
  );
}

SiswaPindahan.withLayout = (page: ReactElement) => {
  return (
    <AuthenticatedLayout activeLink="pindahan">{page}</AuthenticatedLayout>
  );
};
SiswaPindahan.isProtected = true;
