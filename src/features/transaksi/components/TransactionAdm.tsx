import TagihanService from "@/services/tagihan";
import errorResponse from "@/utils/error-response";
import { Table } from "antd";
import { AxiosError } from "axios";
import { useState } from "react";
import useListTransaksiAdm from "../hooks/useListTransactionAdm";

function TransactionAdm() {
  const [loadingExport, setLoadingExport] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
  });

  const { columns, isLoading, transaksi } = useListTransaksiAdm({
    limit: pagination.pageSize,
    page: pagination.page,
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
      <div className="flex justify-end">
        {/* <Button
          icon={<DownloadIcon className="w-4 h-4" />}
          type="primary"
          loading={loadingExport}
          onClick={handleExport}
        >
          Export Transaksi
        </Button> */}
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

export default TransactionAdm;
