import { Text } from "@/components/text";
import { DeleteType } from "@/features/type/components/DeleteType";
import TypeServices from "@/services/type";
import { TType } from "@/services/type/type.type";
import { formatCurrency } from "@/stores/utils";
import { useQuery } from "@tanstack/react-query";
import { TableProps, Tag, Typography } from "antd";
import EditType from "../components/EditType";
import { ToggleType } from "../components/ToggleType";

type Props = {
  page: number;
  limit: number;
  kelasId?: number;
  search?: string;
};

function useListType({ limit, page, search, kelasId }: Props) {
  const { data: types, isLoading } = useQuery({
    queryKey: ["TYPES", page, limit, search, kelasId],
    queryFn: async () => {
      const response = await TypeServices.get({
        page_size: limit,
        page,
        search,
        with: "kelas",
        ...(kelasId ? { kelas: kelasId } : {}),
      });
      return response;
    },
    select(data) {
      return {
        ...data,
        data: data.data.map((academic, index) => ({
          ...academic,
          no: index + 1 + limit * page - limit,
        })),
      };
    },
  });

  const columns: TableProps<TType>["columns"] = [
    {
      title: "No",
      dataIndex: "no",
      render: (text: string) => <Typography.Text>{text}</Typography.Text>,
      align: "center",
    },
    {
      title: "Nama",
      dataIndex: "name",
      render: (value = "", record) => (
        <Text style={{ textTransform: "uppercase" }}>{value}</Text>
      ),
    },
    {
      title: "Kode",
      dataIndex: "code",
      render: (value = "", record) => (
        <Text style={{ textTransform: "uppercase" }}>{value}</Text>
      ),
    },
    {
      title: "Jenis",
      dataIndex: "jenis",
      render: (value = "", record) => (
        <Text style={{ textTransform: "uppercase" }}>{value}</Text>
      ),
    },
    {
      title: "Biaya",
      dataIndex: "biaya",
      render: (value = "", record) => (
        <Text style={{ textTransform: "uppercase" }}>
          {formatCurrency(value)}
        </Text>
      ),
    },
    {
      title: "Tanggal Jatuh Tempo",
      dataIndex: "tanggal",
      render: (value = "", record) => (
        <Text style={{ textTransform: "uppercase" }}>{value}</Text>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (value = "", record) =>
        value === "active" ? (
          <Tag color="green">Aktif</Tag>
        ) : (
          <Tag color="red">Tidak Aktif</Tag>
        ),
    },
    {
      title: "Action",
      key: "",
      render: (value, record, index) => {
        return (
          <div key={record.id} className="flex gap-[8px]">
            <EditType typeId={record.id} />
            <DeleteType typeId={record.id} />
            <ToggleType typeId={record.id} data={record} />
          </div>
        );
      },
    },
  ];
  return { columns, types, isLoading };
}

export default useListType;
