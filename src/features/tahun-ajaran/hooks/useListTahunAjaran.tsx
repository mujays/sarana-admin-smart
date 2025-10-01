import { Text } from "@/components/text";
import TahunAjaranService from "@/services/tahun-ajaran";
import { TTahunAjaran } from "@/services/tahun-ajaran/tahun-ajaran.type";
import { useQuery } from "@tanstack/react-query";
import { Button, TableProps, Tooltip, Typography } from "antd";
import { EditIcon } from "lucide-react";
import { useRouter } from "next/router";
import EditTahunAjaran from "../components/EditTahunAjaran";
import { DeleteTahunAjaran } from "../components/DeleteTahunAjaran";

type Props = {
  page: number;
  limit: number;
  search: string;
};

function useListTahunAjaran({ limit, page, search }: Props) {
  const router = useRouter();

  const { data: academics, isLoading } = useQuery({
    queryKey: ["ACADEMICS", page, limit, search],
    queryFn: async () => {
      const response = await TahunAjaranService.get({
        page_size: limit,
        page,
        search,
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

  const columns: TableProps<TTahunAjaran>["columns"] = [
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
      title: "Jumlah",
      dataIndex: "jumlah",
      render: (value = "", record) => (
        <Text style={{ textTransform: "uppercase" }}>{value}</Text>
      ),
    },
    {
      title: "Action",
      key: "",
      render: (value, record, index) => {
        return (
          <div key={record.id} className="flex gap-[8px]">
            <EditTahunAjaran tahunAjaranId={record.id} />
            <DeleteTahunAjaran tahunAjaranId={record.id} />
          </div>
        );
      },
    },
  ];
  return { columns, academics, isLoading };
}

export default useListTahunAjaran;
