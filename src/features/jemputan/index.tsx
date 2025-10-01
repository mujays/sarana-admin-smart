import { ReactElement, useState } from "react";

import { Title } from "@/components/title/Title";

import { AuthenticatedLayout } from "@/layouts/AuthenticatedLayout";
import { DatePicker, Select, Table } from "antd";
import classNames from "classnames";
import Head from "next/head";
import { Breadcrumb } from "../navigation/components/breadcrumb";
import useListJemputan from "./hooks/useListJemputan";
import RoomScan from "./room-scan";
import { useQuery } from "@tanstack/react-query";
import KelasServices from "@/services/kelas";
import dayjs from "dayjs";
import { useRouter } from "next/router";

export default function JemputanPage() {
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
  });

  const [filterClass, setFilterClass] = useState<number | null>();
  const router = useRouter();
  const today = dayjs();
  const start = router.query.start
    ? dayjs(router.query.start as string)
    : today;
  const end = router.query.end ? dayjs(router.query.end as string) : today;

  const { columns, isLoading, jemputan } = useListJemputan({
    limit: pagination.pageSize,
    page: pagination.page,
    filterClass: filterClass as number,
    from: dayjs(start).format("YYYY-MM-DD"),
    to: dayjs(end).format("YYYY-MM-DD"),
  });

  const { data: kelas } = useQuery({
    queryKey: ["CLASSES"],
    queryFn: async () => {
      const response = await KelasServices.get({
        select: true,
        page: 1,
        with: "siswa",
      });
      return response;
    },
  });

  return (
    <>
      <Head>
        <title>Jemputan | Smart School</title>
      </Head>

      <div className="p-5">
        <Title
          level={1}
          className={classNames("font-[600] !text-[20px] !mb-[4px]")}
        >
          Jemputan
        </Title>

        <Breadcrumb />

        <div className="p-3 space-y-3 border rounded">
          <div className="flex gap-3 items-end">
            <div>
              <p className="mb-2">Kelas</p>
              <Select
                className="w-[280px]"
                placeholder="Pilih Kelas"
                options={kelas?.data.map((k) => ({
                  label: k.nama,
                  value: k.id,
                }))}
                onChange={(val) => {
                  setFilterClass(val);
                }}
                allowClear
                onClear={() => {
                  setFilterClass(null);
                }}
              />
            </div>
            <div>
              <p className="mb-2">Tanggal</p>
              <DatePicker.RangePicker
                value={
                  start && end ? ([dayjs(start), dayjs(end)] as any) : null
                }
                onChange={(val: any) => {
                  const params = new URLSearchParams(
                    router.query as Record<string, string>,
                  );

                  if (val) {
                    params.set("start", val[0].toISOString());
                    params.set("end", val[1].toISOString());
                  } else {
                    params.delete("start");
                    params.delete("end");
                  }

                  router.replace({
                    pathname: router.pathname,
                    query: Object.fromEntries(params),
                  });
                }}
                allowClear={true}
                format="DD/MM/YYYY"
                className="w-[280px]"
              />
            </div>
            <RoomScan />
          </div>
          <div className="overflow-auto ">
            <Table
              id="jemputan-table"
              columns={columns}
              rowKey={(obj) => obj.id}
              dataSource={jemputan?.data}
              loading={isLoading}
              pagination={{
                onChange: (page, pageSize) => {
                  setPagination({ page, pageSize });
                },
                total: jemputan?.meta.total,
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

JemputanPage.withLayout = (page: ReactElement) => {
  return (
    <AuthenticatedLayout activeLink="jemputan">{page}</AuthenticatedLayout>
  );
};
JemputanPage.isProtected = true;
