import { Text } from "@/components/text";
import KeluargaServices from "@/services/keluarga";
import { TKeluarga } from "@/services/keluarga/keluarga.type";
import { useQuery } from "@tanstack/react-query";
import { TableProps, Typography } from "antd";
import { useRouter } from "next/router";
import EditKeluarga from "../components/EditKeluarga";
import DetailKeluarga from "../components/DetailKeluarga";
import { DeleteKeluarga } from "../components/DeleteKeluarga";

type Props = {
  page: number;
  limit: number;
  search: string;
};

function useListKeluarga({ limit, page, search }: Props) {
  const router = useRouter();
  const { data: families, isLoading } = useQuery({
    queryKey: ["FAMILIES", router.query.siswaId, page, limit, search],
    enabled: !!router.query.siswaId,
    queryFn: async () => {
      const response = await KeluargaServices.get({
        page_size: limit,
        page,
        search,
        siswa: router.query.siswaId,
      });
      return response;
    },
    select(data) {
      return {
        ...data,
        data: data.data.map((keluarga, index) => ({
          ...keluarga,
          no: index + 1 + limit * page - limit,
        })),
      };
    },
  });

  const columns: TableProps<TKeluarga>["columns"] = [
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
      title: "Hubungan",
      dataIndex: "hubungan",
      render: (value = "", record) => (
        <Text style={{ textTransform: "uppercase" }}>{value}</Text>
      ),
    },
    {
      title: "Nomor Telepon",
      dataIndex: "no_hp",
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
            <EditKeluarga keluargaId={record.id} />
            <DetailKeluarga keluarga={record} />
            <DeleteKeluarga id={record.id} />
          </div>
        );
      },
    },
  ];
  return { columns, families, isLoading };
}

export default useListKeluarga;
