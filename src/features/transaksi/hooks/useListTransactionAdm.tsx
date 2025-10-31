import TagihanService from "@/services/tagihan";
import { TTransactionAdmission } from "@/services/tagihan/tagihan.type";
import { useQuery } from "@tanstack/react-query";
import { Image, TableProps, Tag, Typography } from "antd";
import moment from "moment";
import "moment/locale/id";
import { ConfirmPayment } from "../components/ConfirmPayment";
import { formatCurrency } from "@/stores/utils";
import { useRouter } from "next/router";
import { Invoices } from "../components/Invoices";

type Props = {
  page: number;
  limit: number;
};

function useListTransaksiAdm({ limit, page }: Props) {
  const router = useRouter();
  const paths = router.pathname.split("/");
  const type = paths[1];

  const { data: transaksi, isLoading } = useQuery({
    queryKey: ["TRX_ADM", page, limit],
    queryFn: async () => {
      const response = await TagihanService.getTrxAdmission({
        page_size: limit,
        page,
        with: "uang_pangkal.siswa.kelas",
        type,
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

  const columns: TableProps<TTransactionAdmission>["columns"] = [
    {
      title: "No",
      dataIndex: "no",
      render: (text: string) => <Typography.Text>{text}</Typography.Text>,
      align: "center",
    },
    {
      title: "Tagihan",
      dataIndex: "tagihan",
      render: (value = "", record) => <p>{record.uang_pangkal?.nama || "-"}</p>,
    },
    {
      title: "Siswa",
      dataIndex: "siswa",
      render: (value = "", record) => (
        <p>{record.uang_pangkal?.siswa?.nama || "-"}</p>
      ),
    },
    {
      title: "Kelas",
      dataIndex: "kelas",
      render: (value = "", record) => (
        <p>{record.uang_pangkal?.siswa?.kelas?.[0]?.nama || "-"}</p>
      ),
    },
    // {
    //   title: "Wali",
    //   dataIndex: "wali",
    //   render: (value = "") => <p>{value.nama || "-"}</p>,
    // },
    {
      title: "Status",
      dataIndex: "status",
      render: (value = "") =>
        value.toLowerCase() === "berhasil" ? (
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
        <p>{value ? moment(value).utcOffset(7).format("LLL") : "-"}</p>
      ),
    },
    {
      title: "Invoice",
      dataIndex: "transaksi",
      render: (value = "", record) => <Invoices transactions={record} />,
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
      title: "Konfirmasi",
      dataIndex: "bukti_pembayaran",
      render: (value, record) => {
        return record.payment_method &&
          record.payment_method?.toLowerCase() === "manual" &&
          record.status.toLocaleLowerCase() === "pending" ? (
          <div className="flex gap-2">
            <ConfirmPayment
              status="berhasil"
              transactionId={record.id}
              type="adm"
            />
            <ConfirmPayment
              status="gagal"
              transactionId={record.id}
              type="adm"
            />
          </div>
        ) : (
          <p></p>
        );
      },
    },
  ];
  return { columns, transaksi, isLoading };
}

export default useListTransaksiAdm;
