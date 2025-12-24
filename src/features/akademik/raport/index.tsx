import { ReactElement, useMemo } from "react";

import { Title } from "@/components/title/Title";

import { AuthenticatedLayout } from "@/layouts/AuthenticatedLayout";
import Head from "next/head";
import classNames from "classnames";
import { useDebounce } from "@/hooks/useDebounce";
import { Input, Select, Table, Button } from "antd";
import { SearchIcon, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import KelasServices from "@/services/kelas";
import { useRouter } from "next/router";
import useListSiswa from "@/features/siswa/hooks/useListSiswa";
import { Breadcrumb } from "@/features/navigation/components/breadcrumb";

export default function TagihanPage() {
  const router = useRouter();

  // Get parameters from URL search params
  const searchParams = useMemo(() => {
    const query = router.query;
    return {
      search: (query.search as string) || "",
      kelas: (query.kelas as string) || "",
      page: parseInt((query.page as string) || "1"),
      pageSize: parseInt((query.pageSize as string) || "10"),
    };
  }, [router.query]);

  const debounceSearch = useDebounce(searchParams.search, 300);

  // Function to update URL parameters
  // Function to update URL parameters
  const updateSearchParams = (newParams: Partial<typeof searchParams>) => {
    const updatedParams = { ...searchParams, ...newParams };

    // Remove empty/default parameters to keep URL clean
    const queryParams = Object.entries(updatedParams).reduce(
      (acc, [key, value]) => {
        // Only add non-default values to URL
        if (key === "search" && value !== "") {
          acc[key] = value.toString();
        } else if (key === "kelas" && value !== "") {
          acc[key] = value.toString();
        } else if (key === "page" && value !== 1) {
          acc[key] = value.toString();
        } else if (key === "pageSize" && value !== 10) {
          acc[key] = value.toString();
        }
        return acc;
      },
      {} as Record<string, string>,
    );

    router.push(
      {
        pathname: router.pathname,
        query: queryParams,
      },
      undefined,
      { shallow: true },
    );
  };

  // Function to clear all filters
  const clearFilters = () => {
    router.push(
      {
        pathname: router.pathname,
        query: {},
      },
      undefined,
      { shallow: true },
    );
  };

  const { columns, isLoading, students } = useListSiswa({
    limit: searchParams.pageSize,
    page: searchParams.page,
    search: debounceSearch,
    kelas: searchParams.kelas ? [searchParams.kelas] : [],
    app: "akademik",
    isNewStudent: false,
    overrideType: "sd",
  });

  const { data: kelas } = useQuery({
    queryKey: ["CLASSES", searchParams.kelas],
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
        <title>Raport | Smart School</title>
      </Head>

      <div className="p-5">
        <Title
          level={1}
          className={classNames("font-[600] !text-[20px] !mb-[4px]")}
        >
          Raport Siswa
        </Title>

        <Breadcrumb
          items={[
            {
              title: "Raport",
            },
          ]}
        />

        <div className="p-3 space-y-3 border rounded">
          <div className="flex items-end justify-between flex-wrap gap-[8px]">
            <div className="flex gap-2 items-end">
              <div>
                <p className="pb-1 font-medium">Kelas</p>
                <Select
                  value={kelasOptions.find(
                    (k) => k.value === +searchParams.kelas,
                  )}
                  onChange={(val) => {
                    updateSearchParams({
                      kelas: `${val}`,
                      page: 1,
                    });
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

              {/* Clear Filters Button - only show if there are active filters */}
              {(searchParams.search ||
                searchParams.kelas ||
                searchParams.page !== 1) && (
                <Button
                  onClick={clearFilters}
                  icon={<X size={16} />}
                  type="default"
                  size="middle"
                  title="Clear all filters"
                >
                  Clear Filters
                </Button>
              )}
            </div>
            <div className="flex gap-3">
              <Input
                placeholder="Search"
                value={searchParams.search}
                onChange={(e) => {
                  updateSearchParams({
                    search: e.target.value,
                    page: 1, // Reset to page 1 when search changes
                  });
                }}
                prefix={<SearchIcon className="text-gray-300" />}
              />
            </div>
          </div>

          <div className="overflow-auto ">
            <Table
              id="raport-table"
              columns={columns}
              rowKey={(obj) => obj.nik}
              dataSource={students?.data}
              loading={isLoading}
              pagination={{
                onChange: (page, pageSize) => {
                  updateSearchParams({ page, pageSize });
                },
                total: students?.meta.total,
                pageSize: searchParams.pageSize,
                current: searchParams.page,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} of ${total} items`,
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
