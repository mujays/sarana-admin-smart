import { Text } from "@/components/text";
import SiswaServices from "@/services/siswa";
import { TPpdb } from "@/services/siswa/siswa.type";
import { useQuery } from "@tanstack/react-query";
import { Button, TableProps, Tag, Tooltip, Typography } from "antd";
import { AcceptStudent } from "../components/accept-student";
import { CompletedStudent } from "../components/completed-student";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/router";
import { SelectClass } from "../components/select-class";
import DetailPPDB from "../components/detail-ppdb";
import moment from "moment";

type Props = {
  page: number;
  limit: number;
  search: string;
  status: string;
};

function useListPindahan({ limit, page, search, status }: Props) {
  const router = useRouter();
  const paths = router.pathname.split("/");
  const type = paths[1];

  const { data: students, isLoading } = useQuery({
    queryKey: ["PPDBS_PINDAHAN", page, limit, search, status],
    queryFn: async () => {
      const response = await SiswaServices.getSiswaPindahan({
        page_size: limit,
        page,
        search,
        type,
        status,
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

  const columns: TableProps<TPpdb>["columns"] = [
    {
      title: "No",
      dataIndex: "no",
      render: (text: string) => <Typography.Text>{text}</Typography.Text>,
      align: "center",
    },
    {
      title: "Nama Siswa",
      dataIndex: "nama_siswa",
      render: (value = "", record) => (
        <Text style={{ textTransform: "uppercase" }}>{value}</Text>
      ),
    },
    {
      title: "Telepon",
      dataIndex: "no_hp_orang_tua",
      render: (value = "", record) => (
        <Text style={{ textTransform: "uppercase" }}>{value}</Text>
      ),
    },
    {
      title: "Kelas Tujuan",
      dataIndex: "tingkatan_id",
      render: (value = "", record) => (
        <Text style={{ textTransform: "uppercase" }}>Kelas {value}</Text>
      ),
    },
    {
      title: "Tahap Seleksi",
      dataIndex: "status",
      render: (value = "", record) => {
        if (record.status === "PENDING_PAYMENT") {
          return <Tag color="yellow">Pembayaran</Tag>;
        }
        if (record.status === "PENDING_INPUT") {
          return <Tag color="orange">Formulir</Tag>;
        }
        if (record.status === "TEST") {
          return <Tag color="blue">Tes</Tag>;
        }
        if (record.status === "RE_REGISTER") {
          return <Tag color="success">Daftar Ulang</Tag>;
        }
      },
    },
    {
      title: "Nama Wali",
      dataIndex: "nama_orang_tua",
      render: (value = "", record) => (
        <Text style={{ textTransform: "uppercase" }}>{value}</Text>
      ),
    },
    {
      title: "Tanggal Daftar",
      dataIndex: "created_at",
      render: (value = "", record) => (
        <Text style={{ textTransform: "uppercase" }}>
          {moment(record.created_at).format("LLLL")}
        </Text>
      ),
    },
    {
      title: "Detail",
      key: "",
      render: (value, record, index) => {
        return (
          <div key={record.id} className="flex gap-[8px]">
            <DetailPPDB ppdb={record} />
          </div>
        );
      },
    },
    {
      title: "Action",
      key: "",
      render: (value, record, index) => {
        if (record.status === "PENDING_PAYMENT") {
          return <AcceptStudent ppdbId={record.id} />;
        }
        if (record.status === "PENDING_INPUT") {
          return (
            <Tooltip title="Salin Link Formulir">
              <Button
                icon={
                  <Copy className="w-5 h-5 text-green-500 cursor-pointer" />
                }
                onClick={async () => {
                  await navigator.clipboard.writeText(
                    `https://smart.sch.id/formulir-siswa?token=${record.token}`,
                  );
                  toast.info("Link berhasil di salin");
                }}
                type="text"
              ></Button>
            </Tooltip>
          );
        }
        if (record.status === "TEST") {
          return (
            <div className="flex gap-2">
              <CompletedStudent ppdb={record} />
              <Button
                className="px-3 border"
                type="primary"
                onClick={() => router.push(`${router.pathname}/${record.id}`)}
              >
                Profil Siswa
              </Button>
            </div>
          );
        }

        if (record.status === "SELECT_CLASS") {
          return <SelectClass ppdb={record} />;
        }
        if (record.status === "RE_REGISTER") {
          return (
            <div className="flex gap-2">
              <Tooltip title="Salin Link Formulir">
                <Button
                  icon={
                    <Copy className="w-5 h-5 text-green-500 cursor-pointer" />
                  }
                  onClick={async () => {
                    await navigator.clipboard.writeText(
                      `https://smart.sch.id/daftar-ulang?token=${record.token}`,
                    );
                    toast.info("Link berhasil di salin");
                  }}
                  type="text"
                ></Button>
              </Tooltip>
              <Button
                className="px-3 border"
                type="primary"
                onClick={() => router.push(`${router.pathname}/${record.id}`)}
              >
                Profil Siswa
              </Button>
            </div>
          );
        }
        return null;
      },
    },
  ];
  return { columns, students, isLoading };
}

export default useListPindahan;
