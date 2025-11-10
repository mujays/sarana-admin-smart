import { Title } from "@/components/title";
import { AuthenticatedLayout } from "@/layouts/AuthenticatedLayout";
import classNames from "classnames";
import Head from "next/head";
import { ReactElement, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Breadcrumb } from "../navigation/components/breadcrumb";
import { Input, Table } from "antd";
import useListPPDB from "./hooks/useListPpdb";
import { useDebounce } from "@/hooks/useDebounce";
import { SearchIcon } from "lucide-react";

const statusData = [
  {
    name: "Buku Tamu",
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
    name: "Daftar Ulang",
    value: "RE_REGISTER",
  },
];

export default function PPDBPage() {
  const router = useRouter();
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 20,
  });
  const [search, setSearch] = useState("");
  const [searchParams, setSearchParams] = useState({
    status: "PENDING_PAYMENT",
  });

  useEffect(() => {
    if (router.query.status) {
      setSearchParams((prev) => ({
        ...prev,
        status: String(router.query.status),
      }));
    }
  }, [router.query.status]);

  const debounceSearch = useDebounce(search, 300);

  const { columns, isLoading, students } = useListPPDB({
    limit: pagination.pageSize,
    page: pagination.page,
    search: debounceSearch,
    status: searchParams.status,
  });

  return (
    <>
      <Head>
        <title>PPDB | Smart School</title>
      </Head>

      <div className="p-5">
        <Title
          level={1}
          className={classNames("font-[600] !text-[20px] !mb-[4px]")}
        >
          Pendaftaran Peserta Didik Baru
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
                setSearchParams((prev) => ({ ...prev, status: status.value }));
                router.replace(
                  {
                    pathname: router.pathname,
                    query: { ...router.query, status: status.value },
                  },
                  undefined,
                  { shallow: true },
                );
                setPagination({
                  page: 1,
                  pageSize: 20,
                });
              }}
              className={classNames(
                "cursor-pointer rounded px-3 py-1 w-[180px] text-center",
                status.value === searchParams.status &&
                  "bg-white font-semibold",
              )}
            >
              {status.name}
            </div>
          ))}
        </div>
        <div className="overflow-auto">
          <Table
            id="ppdb-table"
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

PPDBPage.withLayout = (page: ReactElement) => {
  return <AuthenticatedLayout activeLink="ppdb">{page}</AuthenticatedLayout>;
};
PPDBPage.isProtected = true;
