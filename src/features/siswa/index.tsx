import { ChangeEvent, ReactElement, useState } from "react";

import { Title } from "@/components/title/Title";

import { AuthenticatedLayout } from "@/layouts/AuthenticatedLayout";
import Head from "next/head";
import classNames from "classnames";
import { Breadcrumb } from "../navigation/components/breadcrumb";
import { Button, Input, Select, Table } from "antd";
import useListSiswa from "./hooks/useListSiswa";
import { DownloadIcon, PlusIcon, SearchIcon } from "lucide-react";
import { useRouter } from "next/router";
import { useDebounce } from "@/hooks/useDebounce";
import { ImportOutlined } from "@ant-design/icons";
import SiswaServices from "@/services/siswa";
import { toast } from "sonner";
import errorResponse from "@/utils/error-response";
import { AxiosError } from "axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { DeleteSiswaMultiple } from "./components/DeleteSiswaMultiple";
import KelasServices from "@/services/kelas";

export default function Siswa() {
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
  });
  const [search, setSearch] = useState("");
  const [loadingExport, setLoadingExport] = useState(false);
  const [selectedIdsSiswa, setSelectedIdsSiswa] = useState<number[]>([]);
  const [loadingImport, setLoadingImport] = useState(false);
  const [isNewStudent, setIsNewStudent] = useState(false);
  const [kelasValue, setKelasValue] = useState("");
  const [sort, setSort] = useState("nama,asc");
  const queryClient = useQueryClient();

  const router = useRouter();
  const paths = router.pathname.split("/");
  const type = paths[1];

  const debounceSearch = useDebounce(search, 300);

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

  const { columns, isLoading, students } = useListSiswa({
    limit: pagination.pageSize,
    page: pagination.page,
    search: debounceSearch,
    isNewStudent,
    sort,
    kelas: kelasValue ? [kelasValue] : [],
  });

  const handleExport = async () => {
    try {
      setLoadingExport(true);
      const res = await SiswaServices.export({
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
          await SiswaServices.import(formData);
          toast.success("Import berhasil!");
          queryClient.resetQueries({ queryKey: ["STUDENTS"] });
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
        <title>Siswa | Smart School</title>
      </Head>

      <div className="p-5">
        <Title
          level={1}
          className={classNames("font-[600] !text-[20px] !mb-[4px]")}
        >
          Siswa
        </Title>

        <Breadcrumb />

        <div className="flex bg-gray-200 w-fit mb-3 rounded-lg p-1">
          <div
            onClick={() => {
              setIsNewStudent(false);
              setSelectedIdsSiswa([]);
            }}
            className={classNames(
              "cursor-pointer rounded px-3 py-1 w-[180px] text-center",
              !isNewStudent && "bg-white font-semibold",
            )}
          >
            Siswa Terdaftar
          </div>
          <div
            onClick={() => {
              setIsNewStudent(true);
              setSelectedIdsSiswa([]);
            }}
            className={classNames(
              "cursor-pointer rounded px-3 py-1 w-[180px] text-center",
              isNewStudent && "bg-white font-semibold",
            )}
          >
            Siswa Baru
          </div>
        </div>

        <div className="p-3 space-y-3 border rounded">
          <div className="flex items-end justify-between flex-wrap gap-[8px]">
            <div className="flex gap-3">
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
              {selectedIdsSiswa.length ? (
                <DeleteSiswaMultiple
                  siswaIds={selectedIdsSiswa}
                  onSuccess={() => {
                    setSelectedIdsSiswa([]);
                  }}
                />
              ) : null}
            </div>

            <div className="flex gap-3">
              {!isNewStudent && (
                <>
                  <Button
                    onClick={() => {
                      const link = document.createElement("a");
                      link.href = "/template-siswa.xlsx";
                      link.download = "template-siswa.xlsx";
                      link.click();
                    }}
                    icon={<ImportOutlined />}
                    type="primary"
                  >
                    <span className="!hidden md:!inline">
                      Download Template
                    </span>
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

                  <Button
                    icon={<DownloadIcon className="w-4 h-4" />}
                    type="primary"
                    loading={loadingExport}
                    onClick={handleExport}
                  >
                    Export
                  </Button>

                  <Button
                    onClick={() =>
                      router.push(`/${type}/kesiswaan/siswa/tambah`)
                    }
                    icon={<PlusIcon />}
                    type="primary"
                  >
                    <span className="!hidden md:!inline">Tambah Siswa</span>
                  </Button>

                  <input
                    accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                    type="file"
                    id="import"
                    className="hidden"
                    onChange={importHandle}
                  />
                </>
              )}

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
              id="siswa-table"
              columns={columns}
              rowSelection={{
                selectedRowKeys: selectedIdsSiswa,
                onChange(selectedRowKeys) {
                  setSelectedIdsSiswa(selectedRowKeys as any);
                },
              }}
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
                showSizeChanger: true,
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
                    setSort("nama,asc");
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

Siswa.withLayout = (page: ReactElement) => {
  return <AuthenticatedLayout activeLink="siswa">{page}</AuthenticatedLayout>;
};
Siswa.isProtected = true;
