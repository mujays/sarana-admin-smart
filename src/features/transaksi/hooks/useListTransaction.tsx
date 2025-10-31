import TagihanService from "@/services/tagihan";
import { TTransaction } from "@/services/tagihan/tagihan.type";
import { useQuery } from "@tanstack/react-query";
import { Button, Image, TableProps, Tag, Typography } from "antd";
import moment from "moment";
import "moment/locale/id";
import { ConfirmPayment } from "../components/ConfirmPayment";
import { formatCurrency } from "@/stores/utils";
import { useRouter } from "next/router";
import { Invoices } from "../components/Invoices";
import EditTransaction from "../components/EditTransaction";
import { useSuperAdmin } from "@/hooks/useSuperAdmin";

type Props = {
  page: number;
  limit: number;
  search: string;
};

function useListTransaksi({ limit, page, search }: Props) {
  const router = useRouter();
  const paths = router.pathname.split("/");
  const type = paths[1];

  const { isSuperAdmin } = useSuperAdmin();

  const { data: transaksi, isLoading } = useQuery({
    queryKey: ["TRX", page, limit, search],
    queryFn: async () => {
      const response = await TagihanService.getTrx({
        page_size: limit,
        page,
        with: "tagihan.siswa.kelas,wali",
        type,
        search,
      });
      return response;
    },
    select(data) {
      return {
        ...data,
        data: data.data.map((siswa, index) => ({
          ...siswa,
          no: index + 1 + limit * page - limit,
        })),
      };
    },
  });

  const columns: TableProps<TTransaction>["columns"] = [
    {
      title: "No",
      dataIndex: "no",
      render: (text: string) => <Typography.Text>{text}</Typography.Text>,
      align: "center",
    },
    {
      title: "Tagihan",
      dataIndex: "tagihan",
      render: (value = "") => <p>{value?.tagihan || "-"}</p>,
    },
    {
      title: "Wali",
      dataIndex: "wali",
      render: (value = "") => <p>{value.nama || "-"}</p>,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (value = "") =>
        value.toLowerCase() === "berhasil" ||
        value.toLowerCase() === "completed" ? (
          <Tag color="green" className="capitalize">
            {value}
          </Tag>
        ) : value.toLowerCase() === "pending" ? (
          <Tag color="orange" className="capitalize">
            {value}
          </Tag>
        ) : (
          <Tag color="red" className="capitalize">
            {value}
          </Tag>
        ),
    },
    {
      title: "Harga",
      dataIndex: "buyer_payment",
      render: (value = "") => <p>{formatCurrency(value) || "-"}</p>,
    },
    {
      title: "Metode Pembayaran",
      dataIndex: "payment_method",
      render: (value = "") => <p>{value || "-"}</p>,
    },
    {
      title: "Tanggal Dibayarkan",
      dataIndex: "payment_at",
      render: (value = "") => (
        <p>{value ? moment(value).format("LLL") : "-"}</p>
      ),
    },
    {
      title: "Bukti Pembayaran",
      dataIndex: "bukti_pembayaran",
      render: (value = "") =>
        value ? (
          <Image
            src={value}
            className="!w-20 !h-20 object-cover"
            alt="bukti transfer"
          />
        ) : (
          "-"
        ),
    },
    {
      title: "Download Bukti",
      dataIndex: "bukti_pembayaran",
      render: (value = "", record) =>
        value ? (
          <Button
            onClick={() => {
              const link = document.createElement("a");
              link.href = value;
              link.target = "_blank";
              link.download = `${record.tagihan}-${record.wali}.png`;
              link.click();
            }}
          >
            Download
          </Button>
        ) : (
          "-"
        ),
    },
    {
      title: "Invoice",
      dataIndex: "transaksi",
      render: (value = "", record) => <Invoices transactions={record} />,
    },
    {
      title: "Konfirmasi",
      dataIndex: "bukti_pembayaran",
      render: (value, record) => {
        return record.payment_method &&
          record.payment_method?.toLowerCase() === "manual" &&
          record.status === "pending" ? (
          <div className="flex gap-2">
            <ConfirmPayment status="berhasil" transactionId={record.id} />
            <ConfirmPayment status="gagal" transactionId={record.id} />
          </div>
        ) : (
          <p></p>
        );
      },
    },
    !isSuperAdmin
      ? {}
      : {
          title: "Action",
          key: "",
          render: (value, record, index) => {
            return (
              <div key={record.id} className="flex gap-[8px]">
                <EditTransaction transactionId={record.id} />
              </div>
            );
          },
        },
  ];
  return { columns, transaksi, isLoading };
}

export default useListTransaksi;
