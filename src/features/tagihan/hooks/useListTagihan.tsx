import { Text } from "@/components/text";
import TagihanService from "@/services/tagihan";
import { TTagihan } from "@/services/tagihan/tagihan.type";
import { formatCurrency } from "@/stores/utils";
import { useQuery } from "@tanstack/react-query";
import { TableProps, Tag, Typography } from "antd";
import { useRouter } from "next/router";
import { DeleteTagihan } from "../components/DeleteTegihan";
import EditTagihan from "../components/EditTagihan";
import { CompleteTagihan } from "../components/CompleteTagihan";

type Props = {
  page: number;
  limit: number;
  siswaId: number;
  tahunAjaranId?: number;
  hideColumn?: boolean;
};

function useListTagihan({
  limit,
  page,
  siswaId,
  tahunAjaranId,
  hideColumn = false,
}: Props) {
  const router = useRouter();

  const { data: bills, isLoading } = useQuery({
    queryKey: ["BILLS", page, limit, tahunAjaranId, siswaId],
    enabled: !!siswaId,
    queryFn: async () => {
      const response = await TagihanService.get({
        page_size: limit,
        page,
        siswa: siswaId,
        tahun_ajaran: tahunAjaranId,
      });
      return response;
    },
    select(data) {
      return {
        ...data,
        data: data.data.map((bill, index) => ({
          ...bill,
          no: index + 1 + limit * page - limit,
        })),
      };
    },
  });

  const columns: TableProps<TTagihan>["columns"] = [
    {
      title: "No",
      dataIndex: "no",
      render: (text: string) => <Typography.Text>{text}</Typography.Text>,
      align: "center",
    },
    {
      title: "Nama",
      dataIndex: "tagihan",
      render: (value = "", record) => (
        <Text style={{ textTransform: "uppercase" }}>{value || "SPP"}</Text>
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
      title: "Jatuh Tempo",
      dataIndex: "jatuh_tempo",
      render: (value = "", record) => (
        <Text style={{ textTransform: "uppercase" }}>
          {new Date(value).getDate()} {record.bulan}
        </Text>
      ),
    },
    {
      title: "Lunas",
      dataIndex: "is_lunas",
      render: (value = "", record) =>
        value ? (
          <Tag color="green">Lunas</Tag>
        ) : (
          <Tag color="red">Belum Lunas</Tag>
        ),
    },
    hideColumn
      ? {}
      : {
          title: "Action",
          key: "",
          render: (value, record, index) => {
            return (
              <div key={record.id} className="flex gap-[8px]">
                <DeleteTagihan tagihanId={record.id} />
                <EditTagihan tagihanId={record.id} />
                {record.is_lunas ? null : <CompleteTagihan tagihan={record} />}
              </div>
            );
          },
        },
  ];
  return { columns, bills, isLoading };
}

export default useListTagihan;
