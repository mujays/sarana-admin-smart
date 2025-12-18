import { Text } from "@/components/text";
import SiswaServices from "@/services/siswa";
import { TPpdb } from "@/services/siswa/siswa.type";
import { useQuery } from "@tanstack/react-query";
import {
  Button,
  TableProps,
  Tag,
  Tooltip,
  Typography,
  Dropdown,
  MenuProps,
} from "antd";
import { AcceptStudent } from "../components/accept-student";
import { CompletedStudent } from "../components/completed-student";
import {
  Copy,
  MoreVertical,
  Eye,
  UserCheck,
  Users,
  BookOpen,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/router";
import { SelectClass } from "../components/select-class";
import DetailPPDB from "../components/detail-ppdb";
import { DeletePindahan } from "../components/delete-pindahan";
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
      title: "Action",
      key: "action",
      align: "center",
      render: (value, record, index) => {
        const getMenuItems = (): MenuProps["items"] => {
          const items: MenuProps["items"] = [
            {
              key: "detail",
              label: "Lihat Detail",
              icon: <Eye className="w-4 h-4" />,
              onClick: () => {
                const detailButton = document.querySelector(
                  `[data-ppdb-id="${record.id}"]`,
                ) as HTMLButtonElement;
                if (detailButton) {
                  detailButton.click();
                }
              },
            },
          ];

          if (record.status === "PENDING_PAYMENT") {
            items.push(
              {
                key: "accept",
                label: "Konfirmasi Pembayaran",
                icon: <UserCheck className="w-4 h-4" />,
                onClick: () => {
                  const acceptButton = document.querySelector(
                    `[data-accept-id="${record.id}"]`,
                  ) as HTMLButtonElement;
                  if (acceptButton) {
                    acceptButton.click();
                  }
                },
              },
              {
                key: "delete",
                label: "Hapus",
                icon: <Trash2 className="w-4 h-4" />,
                danger: true,
                onClick: () => {
                  const deleteButton = document.querySelector(
                    `[data-delete-id="${record.id}"]`,
                  ) as HTMLButtonElement;
                  if (deleteButton) {
                    deleteButton.click();
                  }
                },
              },
            );
          }

          if (record.status === "PENDING_INPUT") {
            items.push({
              key: "copy-form",
              label: "Salin Link Formulir",
              icon: <Copy className="w-4 h-4" />,
              onClick: async () => {
                await navigator.clipboard.writeText(
                  `https://smart.sch.id/formulir-siswa?token=${record.token}`,
                );
                toast.info("Link berhasil di salin");
              },
            });
          }

          if (record.status === "TEST") {
            items.push(
              {
                key: "complete",
                label: "Luluskan Tes",
                icon: <UserCheck className="w-4 h-4" />,
                onClick: () => {
                  const completeButton = document.querySelector(
                    `[data-complete-id="${record.id}"]`,
                  ) as HTMLButtonElement;
                  if (completeButton) {
                    completeButton.click();
                  }
                },
              },
              {
                key: "profile",
                label: "Profil Siswa",
                icon: <Users className="w-4 h-4" />,
                onClick: () => router.push(`${router.pathname}/${record.id}`),
              },
            );
          }

          if (record.status === "SELECT_CLASS") {
            items.push({
              key: "select-class",
              label: "Pilih Kelas",
              icon: <BookOpen className="w-4 h-4" />,
              onClick: () => {
                const selectButton = document.querySelector(
                  `[data-select-id="${record.id}"]`,
                ) as HTMLButtonElement;
                if (selectButton) {
                  selectButton.click();
                }
              },
            });
          }

          if (record.status === "RE_REGISTER") {
            items.push(
              {
                key: "copy-reregister",
                label: "Salin Link Daftar Ulang",
                icon: <Copy className="w-4 h-4" />,
                onClick: async () => {
                  await navigator.clipboard.writeText(
                    `https://smart.sch.id/daftar-ulang?token=${record.token}`,
                  );
                  toast.info("Link berhasil di salin");
                },
              },
              {
                key: "profile",
                label: "Profil Siswa",
                icon: <Users className="w-4 h-4" />,
                onClick: () => router.push(`${router.pathname}/${record.id}`),
              },
            );
          }

          return items;
        };

        return (
          <div className="flex items-center justify-center">
            {/* Hidden components for triggering actions */}
            <div style={{ display: "none" }}>
              <DetailPPDB ppdb={record} />
              {record.status === "PENDING_PAYMENT" && (
                <>
                  <AcceptStudent ppdbId={record.id} />
                  <DeletePindahan ppdbId={record.id} />
                </>
              )}
              {record.status === "TEST" && <CompletedStudent ppdb={record} />}
              {record.status === "SELECT_CLASS" && (
                <SelectClass ppdb={record} />
              )}
            </div>

            <Dropdown
              menu={{ items: getMenuItems() }}
              placement="bottomRight"
              trigger={["click"]}
            >
              <Button
                type="text"
                icon={<MoreVertical className="w-4 h-4" />}
                className="border-none shadow-none"
              />
            </Dropdown>
          </div>
        );
      },
    },
  ];
  return { columns, students, isLoading };
}

export default useListPindahan;
