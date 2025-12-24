import { ReactElement, useState } from "react";

import { Title } from "@/components/title/Title";

import { AuthenticatedLayout } from "@/layouts/AuthenticatedLayout";
import classNames from "classnames";
import Head from "next/head";
import { useRouter } from "next/router";
import { Breadcrumb } from "@/features/navigation/components/breadcrumb";
import { Input, Table, Select, Button, Space } from "antd";
import { SearchIcon, X } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import useListLoans from "./hooks/useListLoans";
import AddLoan from "./components/AddLoan";

const { Option } = Select;

export default function LoansPage() {
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
  });
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<
    "borrowed" | "returned" | "overdue" | ""
  >("");
  const router = useRouter();

  const debounceSearch = useDebounce(search, 300);

  const { columns, loans, isLoading } = useListLoans({
    limit: pagination.pageSize,
    page: pagination.page,
    search: debounceSearch,
    status,
  });

  const clearFilters = () => {
    setSearch("");
    setStatus("");
    setPagination({ page: 1, pageSize: 10 });
  };

  const hasActiveFilters = search || status;

  return (
    <>
      <Head>
        <title>Peminjaman Buku | Smart School</title>
      </Head>

      <div className="p-5">
        <Title
          level={1}
          className={classNames("font-[600] !text-[20px] !mb-[4px]")}
        >
          Peminjaman Buku
        </Title>

        <Breadcrumb isAcademic={false} />

        <div className="p-3 space-y-3 border rounded">
          <div className="flex items-center justify-between flex-wrap gap-[8px]">
            <div className="flex gap-3 items-end">
              {/* <div>
                <p className="pb-1 font-medium text-sm">Status</p>
                <Select
                  value={status}
                  onChange={setStatus}
                  placeholder="Semua Status"
                  className="w-40"
                >
                  <Option value="">Semua Status</Option>
                  <Option value="borrowed">Dipinjam</Option>
                  <Option value="returned">Dikembalikan</Option>
                  <Option value="overdue">Terlambat</Option>
                </Select>
              </div> */}

              <div>
                <p className="pb-1 font-medium text-sm">Pencarian</p>
                <Input
                  placeholder="Cari peminjam atau buku..."
                  prefix={<SearchIcon className="h-4 w-4" />}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-64"
                />
              </div>

              {hasActiveFilters && (
                <Button
                  onClick={clearFilters}
                  icon={<X size={16} />}
                  type="default"
                  title="Clear all filters"
                >
                  Clear
                </Button>
              )}
            </div>

            <div className="flex gap-3">
              <AddLoan />
            </div>
          </div>

          <Table
            columns={columns}
            dataSource={loans?.data || []}
            loading={isLoading}
            pagination={{
              current: pagination.page,
              pageSize: pagination.pageSize,
              total: loans?.total || 0,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} dari ${total} peminjaman`,
              onChange: (page, pageSize) => {
                setPagination({ page, pageSize });
              },
            }}
            rowKey="id"
            scroll={{ x: 1200 }}
          />
        </div>
      </div>
    </>
  );
}

LoansPage.withLayout = (page: ReactElement) => {
  return <AuthenticatedLayout activeLink="books">{page}</AuthenticatedLayout>;
};
LoansPage.isProtected = true;
