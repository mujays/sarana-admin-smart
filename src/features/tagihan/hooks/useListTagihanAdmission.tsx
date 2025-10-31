import { Text } from "@/components/text";
import TagihanService from "@/services/tagihan";
import { TTagihanAdmission } from "@/services/tagihan/tagihan.type";
import { formatCurrency } from "@/stores/utils";
import { useQuery } from "@tanstack/react-query";
import { TableProps, Tag, Typography } from "antd";
import EditTagihanAdmission from "../components/EditTagihanAdmission";
import { DeleteTagihanAdmission } from "../components/DeleteTagihanAdmission";
import { CompleteTagihanAdmission } from "../components/CompletTagihanAdmission";
import PaymentTagihanAdmission from "../components/PaymentTagihanAdmission";

type Props = {
  page: number;
  limit: number;
  siswaId: number;
};

function useListTagihanAdmission({ limit, page, siswaId }: Props) {
  const { data: bills, isLoading } = useQuery({
    queryKey: ["BILLS_ADMISSION", page, limit, siswaId],
    enabled: !!siswaId,
    queryFn: async () => {
      const response = await TagihanService.getAdmission({
        page_size: limit,
        page,
        siswa: siswaId,
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

  const columns: TableProps<TTagihanAdmission>["columns"] = [
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
      title: "Jumlah Pembayaran",
      dataIndex: "cicilan",
      render: (value = "", record) => (
        <Text style={{ textTransform: "uppercase" }}>{value} Kali</Text>
      ),
    },
    {
      title: "Nominal",
      dataIndex: "nominal",
      render: (value = "", record) => (
        <Text
          className="font-bold whitespace-nowrap"
          style={{ textTransform: "uppercase" }}
        >
          {formatCurrency(value)}
        </Text>
      ),
    },
    {
      title: "Uang Masuk",
      dataIndex: "pembayaran_sudah",
      render: (value = "", record) => (
        <Text
          className="!text-green-500 whitespace-nowrap"
          style={{ textTransform: "uppercase" }}
        >
          {formatCurrency(value)}
        </Text>
      ),
    },
    {
      title: "Sisa Pembayaran",
      dataIndex: "sisa_pembayaran",
      render: (value = "", record) => (
        <Text className="!text-red-400" style={{ textTransform: "uppercase" }}>
          {formatCurrency(record.nominal - record.pembayaran_sudah)}
        </Text>
      ),
    },

    {
      title: "Lunas",
      dataIndex: "status",
      render: (value = "", record) =>
        value.toLowerCase() !== "belum lunas" ? (
          <Tag color="green">Lunas</Tag>
        ) : (
          <Tag color="red">Belum Lunas</Tag>
        ),
    },
    {
      title: "Action",
      key: "",
      render: (value, record, index) => {
        return (
          <div key={record.id} className="flex gap-[8px]">
            <DeleteTagihanAdmission tagihanId={record.id} />
            <EditTagihanAdmission tagihanId={record.id} />
            {record.status.toLowerCase() !== "belum lunas" ? null : (
              <CompleteTagihanAdmission tagihan={record} />
            )}
            <PaymentTagihanAdmission tagihanId={record.id} />
          </div>
        );
      },
    },
  ];
  return { columns, bills, isLoading };
}

export default useListTagihanAdmission;
