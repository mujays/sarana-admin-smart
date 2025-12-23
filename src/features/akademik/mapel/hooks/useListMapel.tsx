import { Text } from "@/components/text";
import { useQuery } from "@tanstack/react-query";
import { TableProps, Typography, Dropdown, MenuProps, Button, Tag } from "antd";
import { TMataPelajaran } from "@/services/akademik/akademik.type";
import AkademikService from "@/services/akademik";
import { MoreVertical, Eye, Edit, Trash2 } from "lucide-react";
import DetailMapel from "../components/DetailMapel";
import EditMapel from "../components/EditMapel";
import { DeleteMapel } from "../components/DeleteMapel";

type Props = {
  page: number;
  limit: number;
  search?: string;
};

function useListMapel({ limit, page, search }: Props) {
  const { data: mapel, isLoading } = useQuery({
    queryKey: ["MAPEL", page, limit, search],
    queryFn: async () => {
      const response = await AkademikService.getMapel({
        page,
        page_size: limit,
        search,
      });
      return response;
    },
    select({ data }) {
      if (!data || !data.data || !Array.isArray(data.data)) {
        return {
          data: [],
          total: 0,
          message: data?.message || "",
        };
      }

      const mapelArray = data.data;

      const filteredData = search
        ? mapelArray.filter(
            (mapel: TMataPelajaran) =>
              mapel.nama.toLowerCase().includes(search.toLowerCase()) ||
              mapel.kode.toLowerCase().includes(search.toLowerCase()) ||
              mapel.deskripsi.toLowerCase().includes(search.toLowerCase()),
          )
        : mapelArray;

      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedData = filteredData.slice(startIndex, endIndex);

      return {
        data: paginatedData.map((mapel: TMataPelajaran, index: number) => ({
          ...mapel,
          no: startIndex + index + 1,
        })),
        total: filteredData.length,
        message: data.message,
      };
    },
  });

  const columns: TableProps<TMataPelajaran & { no: number }>["columns"] = [
    {
      title: "No",
      dataIndex: "no",
      render: (text: string) => <Typography.Text>{text}</Typography.Text>,
      align: "center",
      width: 60,
    },
    {
      title: "Kode",
      dataIndex: "kode",
      render: (value = "", record) => <Text>{value}</Text>,
      width: 120,
    },
    {
      title: "Nama Mata Pelajaran",
      dataIndex: "nama",
      render: (value = "", record) => <Text>{value}</Text>,
    },
    {
      title: "Deskripsi",
      dataIndex: "deskripsi",
      render: (value = "", record) => (
        <Text>
          {value.length > 50 ? `${value.substring(0, 50)}...` : value}
        </Text>
      ),
    },
    {
      title: "Status",
      dataIndex: "is_active",
      render: (value: boolean, record) => (
        <Tag color={value ? "green" : "red"}>
          {value ? "Aktif" : "Tidak Aktif"}
        </Tag>
      ),
      align: "center",
      width: 100,
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      width: 80,
      render: (value, record, index) => {
        const getMenuItems = (): MenuProps["items"] => [
          {
            key: "detail",
            label: "Lihat Detail",
            icon: <Eye className="w-4 h-4" />,
            onClick: () => {
              const detailButton = document.querySelector(
                `[data-mapel-id="${record.id}"]`,
              ) as HTMLButtonElement;
              if (detailButton) {
                detailButton.click();
              }
            },
          },
          {
            key: "edit",
            label: "Edit",
            icon: <Edit className="w-4 h-4" />,
            onClick: () => {
              const editButton = document.querySelector(
                `[data-edit-id="${record.id}"]`,
              ) as HTMLButtonElement;
              if (editButton) {
                editButton.click();
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
        ];

        return (
          <div className="flex items-center justify-center">
            {/* Hidden components for triggering actions */}
            <div style={{ display: "none" }}>
              <DetailMapel mapel={record} />
              <EditMapel mapelId={record.id} />
              <DeleteMapel mapelId={record.id} />
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

  return { columns, mapel, isLoading };
}

export default useListMapel;
