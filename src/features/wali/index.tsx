import { ChangeEvent, ReactElement, useState } from "react";

import { Title } from "@/components/title/Title";

import { AuthenticatedLayout } from "@/layouts/AuthenticatedLayout";
import Head from "next/head";
import classNames from "classnames";
import { Breadcrumb } from "../navigation/components/breadcrumb";
import { Button, Input, Table } from "antd";
import { useDebounce } from "@/hooks/useDebounce";
import AddWali from "./components/AddWali";
import useListWali from "./hooks/useListWali";
import { ImportOutlined } from "@ant-design/icons";
import WaliService from "@/services/wali";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import errorResponse from "@/utils/error-response";
import { AxiosError } from "axios";
import { DeleteWaliMultiple } from "./components/DeleteWaliMultiple";
import { SearchIcon } from "lucide-react";

export default function Wali() {
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
  });
  const [search, setSearch] = useState("");
  const [loadingImport, setLoadingImport] = useState(false);
  const [selectedIdsWali, setSelectedIdsWali] = useState<number[]>([]);

  const debounceSearch = useDebounce(search, 300);

  const { columns, isLoading, walies } = useListWali({
    limit: pagination.pageSize,
    page: pagination.page,
    search: debounceSearch,
  });

  const queryClient = useQueryClient();

  const importHandle = async (e: ChangeEvent<HTMLInputElement>) => {
    try {
      setLoadingImport(true);

      const files = e?.target.files;

      if (files && files.length > 0) {
        const file = files[0];
        const validTypes = [
          "text/csv",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "application/vnd.ms-excel",
        ];
        if (validTypes.includes(file.type)) {
          const formData = new FormData();
          formData.append("file", file);
          await WaliService.import(formData);
          toast.success("Import berhasil!");
          queryClient.resetQueries({ queryKey: ["WALIES"] });
        } else {
          toast.error("Format file tidak valid!");
        }
      }
    } catch (error) {
      errorResponse(error as AxiosError);
    } finally {
      setLoadingImport(false);
    }
  };

  return (
    <>
      <Head>
        <title>Wali Murid | Smart School</title>
      </Head>

      <div className="p-5">
        <Title
          level={1}
          className={classNames("font-[600] !text-[20px] !mb-[4px]")}
        >
          Wali Murid
        </Title>

        <Breadcrumb />

        <div className="p-3 space-y-3 border rounded">
          <div className="flex items-center justify-end flex-wrap gap-[8px]">
            <div className="flex gap-3">
              <AddWali />

              {selectedIdsWali.length ? (
                <DeleteWaliMultiple
                  waliIds={selectedIdsWali}
                  onSuccess={() => {
                    setSelectedIdsWali([]);
                  }}
                />
              ) : null}

              <Button
                onClick={() => {
                  const link = document.createElement("a");
                  link.href = "/template-wali.xlsx";
                  link.download = "template-wali.xlsx";
                  link.click();
                }}
                icon={<ImportOutlined />}
                type="primary"
              >
                <span className="!hidden md:!inline">Download Template</span>
              </Button>

              <Button
                onClick={() => {
                  document.getElementById("import")?.click();
                }}
                icon={<ImportOutlined />}
                type="primary"
                loading={loadingImport}
              >
                <span className="!hidden md:!inline">Import</span>
              </Button>

              <input
                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                type="file"
                id="import"
                className="hidden"
                onChange={importHandle}
              />
              <Input
                placeholder="Search"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
                prefix={<SearchIcon className="text-gray-300" />}
              />
            </div>
          </div>

          <div className="overflow-auto ">
            <Table
              id="wali-table"
              columns={columns}
              rowSelection={{
                selectedRowKeys: selectedIdsWali,
                onChange(selectedRowKeys) {
                  setSelectedIdsWali(selectedRowKeys as any);
                },
              }}
              rowKey={(obj) => obj.id}
              dataSource={walies?.data}
              loading={isLoading}
              pagination={{
                onChange: (page, pageSize) => {
                  setPagination({ page, pageSize });
                },
                total: walies?.meta.total,
                pageSize: pagination.pageSize,
                current: pagination.page,
                position: ["topRight", "bottomRight"],
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}

Wali.withLayout = (page: ReactElement) => {
  return <AuthenticatedLayout activeLink="wali">{page}</AuthenticatedLayout>;
};
Wali.isProtected = true;
