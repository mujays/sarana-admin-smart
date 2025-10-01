import { Text } from "@/components/text";
import { useQuery } from "@tanstack/react-query";
import { Button, TableProps, Tooltip, Typography } from "antd";
import { useRouter } from "next/router";
import EditKeluarga from "../components/EditRiwayat";
import RiwayatServices from "@/services/riwayat";
import { TRiwayat } from "@/services/riwayat/riwayat.type";

type Props = {
  page: number;
  limit: number;
  search: string;
};

function useListRiwayat({ limit, page, search }: Props) {
  const router = useRouter();
  const { data: riwayat, isLoading } = useQuery({
    queryKey: ["RIWAYAT", router.query.siswaId, page, limit, search],
    enabled: !!router.query.siswaId,
    queryFn: async () => {
      const response = await RiwayatServices.get({
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

  const columns: TableProps<TRiwayat>["columns"] = [
    {
      title: "No",
      dataIndex: "no",
      render: (text: string) => <Typography.Text>{text}</Typography.Text>,
      align: "center",
    },
    {
      title: "Jenis Penyakit",
      dataIndex: "jenis_penyakit",
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
            <EditKeluarga riwayatId={record.id} />
            {/* <DeleteSiswa siswaId={record.id} /> */}
          </div>
        );
      },
    },
  ];
  return { columns, riwayat, isLoading };
}

export default useListRiwayat;
