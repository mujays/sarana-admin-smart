import { Text } from "@/components/text";
import ClientService from "@/services/client";
import { TWithdraw } from "@/services/client/client.type";
import { formatCurrency } from "@/stores/utils";
import { useQuery } from "@tanstack/react-query";
import { TableProps, Tag, Typography } from "antd";
import moment from "moment";
import "moment/locale/id";
import { useRouter } from "next/router";
import { DeleteWithdraw } from "../DeleteWithdraw";
import UpdateWithdraw from "../UpdateWithdraw";

type Props = {
  page: number;
  limit: number;
};

function useListithdraw({ limit, page }: Props) {
  const router = useRouter();
  const paths = router.pathname.split("/");
  const type = paths[1];

  const { data: withdraws, isLoading } = useQuery({
    queryKey: ["WITHDRAWS", page, limit],
    queryFn: async () => {
      const response = await ClientService.getWithdraw({
        page_size: limit,
        page,
        type,
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

  const columns: TableProps<TWithdraw>["columns"] = [
    {
      title: "No",
      dataIndex: "no",
      render: (text: string) => <Typography.Text>{text}</Typography.Text>,
      align: "center",
    },
    {
      title: "Nama",
      dataIndex: "by",
      render: (value = "", record) => (
        <Text style={{ textTransform: "uppercase" }}>{value}</Text>
      ),
    },
    {
      title: "Jumlah",
      dataIndex: "jumlah",
      render: (value = "", record) => <Text>{formatCurrency(value)}</Text>,
    },
    {
      title: "Biaya Penarikan",
      dataIndex: "biaya_penarikan",
      render: (value = "", record) => <Text>{formatCurrency(value)}</Text>,
    },
    {
      title: "Waktu Transfer",
      dataIndex: "transfer_at",
      render: (value = "", record) => (
        <Text style={{ textTransform: "uppercase" }}>
          {value ? moment(value).format("LLLL") : "-"}
        </Text>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (value = "", record) =>
        record.status === "pending" ? (
          <Tag color="orange">Pending</Tag>
        ) : (
          <Tag color="green">Berhasil</Tag>
        ),
    },
    {
      title: "Tanggal Penarikan",
      dataIndex: "created_at",
      render: (value = "", record) => (
        <Text style={{ textTransform: "uppercase" }}>
          {value ? moment(value).format("LLLL") : "-"}
        </Text>
      ),
    },
    {
      title: "Action",
      key: "",
      render: (value, record, index) => {
        return (
          <div key={record.id} className="flex gap-[8px]">
            {record.status === "pending" && (
              <>
                <UpdateWithdraw id={record.id} />
                <DeleteWithdraw id={record.id} />
              </>
            )}
          </div>
        );
      },
    },
  ];
  return { columns, withdraws, isLoading };
}

export default useListithdraw;
