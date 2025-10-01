import TagihanService from "@/services/tagihan";
import errorResponse from "@/utils/error-response";
import { Button, Input, Table } from "antd";
import { AxiosError } from "axios";
import { DownloadIcon, SearchIcon } from "lucide-react";
import useListTransaksi from "../hooks/useListTransaction";
import { useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";

function TransactionTagihan() {
  const [loadingExport, setLoadingExport] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
  });
  const [search, setSearch] = useState("");

  const debounceSearch = useDebounce(search, 300);

  const { columns, isLoading, transaksi } = useListTransaksi({
    limit: pagination.pageSize,
    page: pagination.page,
    search: debounceSearch,
  });

  const handleExport = async () => {
    try {
      setLoadingExport(true);
      const res = await TagihanService.exportTransaction({
        // from: dayjs(dateRange[0]).format("YYYY-MM-DD"),
        // to: dayjs(dateRange[1]).format("YYYY-MM-DD"),
      });

      const blob = new Blob([res], { type: "'text/csv'" });

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");

      a.setAttribute("href", url);
      a.setAttribute("download", `transaction.xlsx`);

      a.click();
    } catch (error) {
      errorResponse(error as AxiosError);
    } finally {
      setLoadingExport(false);
    }
  };

  return (
    <>
      <div className="flex justify-end gap-3">
        <Input
          placeholder="Search"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
          prefix={<SearchIcon className="text-gray-300" />}
        />
        <Button
          icon={<DownloadIcon className="w-4 h-4" />}
          type="primary"
          loading={loadingExport}
          onClick={handleExport}
        >
          Export Transaksi
        </Button>
      </div>
      <div className="overflow-auto ">
        <Table
          id="transaksi-table"
          columns={columns}
          rowKey={(obj) => obj.id}
          dataSource={transaksi?.data}
          loading={isLoading}
          pagination={{
            onChange: (page, pageSize) => {
              setPagination({ page, pageSize });
            },
            total: transaksi?.meta.total,
            pageSize: pagination.pageSize,
            current: pagination.page,
          }}
        />
      </div>
    </>
  );
}

export default TransactionTagihan;
