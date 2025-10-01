import { Text } from "@/components/text";
import TypeServices from "@/services/type";
import { TTypeAdmission } from "@/services/type/type.type";
import { formatCurrency } from "@/stores/utils";
import { useQuery } from "@tanstack/react-query";
import { TableProps, Tag, Typography } from "antd";
import EditTypeAdmission from "../components/EditTypeAdmission";
import { DeleteTypeAdmission } from "../components/DeleteTypeAdmission";
import { ToggleTypeAdmission } from "../components/ToggleTypeAdmission";

type Props = {
  page: number;
  limit: number;
  kelasId: number;
  search?: string;
};

function useListTypeAdmission({ limit, page, search, kelasId }: Props) {
  const { data: types, isLoading } = useQuery({
    queryKey: ["TYPES_ADMISSION", page, limit, search, kelasId],
    queryFn: async () => {
      const response = await TypeServices.getAdmissionType({
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
        data: data.data.map((type, index) => ({
          ...type,
          no: index + 1 + limit * page - limit,
        })),
      };
    },
  });

  const columns: TableProps<TTypeAdmission>["columns"] = [
    {
      title: "No",
      dataIndex: "no",
      render: (text: string) => <Typography.Text>{text}</Typography.Text>,
      align: "center",
    },
    {
      title: "Nama",
      dataIndex: "nama",
      render: (value = "", record) => (
        <Text style={{ textTransform: "uppercase" }}>{value}</Text>
      ),
    },
    {
      title: "Kelas",
      dataIndex: "kelas",
      render: (value = "", record) => (
        <Text style={{ textTransform: "uppercase" }}>{record.kelas.nama}</Text>
      ),
    },
    {
      title: "Biaya",
      dataIndex: "nominal",
      render: (value = "", record) => (
        <Text style={{ textTransform: "uppercase" }}>
          {formatCurrency(value)}
        </Text>
      ),
    },
    {
      title: "Jumlah Pembayaran",
      dataIndex: "cicilan",
      render: (value = "", record) => (
        <Text style={{ textTransform: "uppercase" }}>{value} Kali</Text>
      ),
    },
    // {
    //   title: "Tanggal Jatuh Tempo",
    //   dataIndex: "tanggal",
    //   render: (value = "", record) => (
    //     <Text style={{ textTransform: "uppercase" }}>{value}</Text>
    //   ),
    // },
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
            <EditTypeAdmission typeId={record.id} />
            <DeleteTypeAdmission typeId={record.id} />
            <ToggleTypeAdmission typeId={record.id} data={record} />
          </div>
        );
      },
    },
  ];
  return { columns, types, isLoading };
}

export default useListTypeAdmission;
