import { useState } from "react";
import useListType from "../hooks/useListType";
import AddType from "./AddType";
import { Select, Table } from "antd";
import { useQuery } from "@tanstack/react-query";
import KelasServices from "@/services/kelas";

function ViewType() {
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
  });
  const [kelasValue, setKelasValue] = useState("");

  const { columns, isLoading, types } = useListType({
    limit: pagination.pageSize,
    page: pagination.page,
    kelasId: +kelasValue,
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
      <div className="flex items-center justify-between flex-wrap gap-[8px]">
        <div className="flex gap-2 justify-between">
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
        <AddType />
      </div>

      <div className="overflow-auto">
        <Table
          id="ta-table"
          columns={columns}
          rowKey={(obj) => obj.id}
          dataSource={types?.data}
          loading={isLoading}
          pagination={{
            onChange: (page, pageSize) => {
              setPagination({ page, pageSize });
            },
            total: types?.meta.total,
            pageSize: pagination.pageSize,
            current: pagination.page,
          }}
        />
      </div>
    </>
  );
}

export default ViewType;
