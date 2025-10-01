import { Text } from "@/components/text";
import KelasServices from "@/services/kelas";
import { TKelas } from "@/services/kelas/kelas.type";
import { useQuery } from "@tanstack/react-query";
import { Button, TableProps, Tooltip, Typography } from "antd";
import { EyeIcon } from "lucide-react";
import { useRouter } from "next/router";
import EditKelas from "../components/EditKelas";
import { DeleteKelas } from "../components/DleteKelas";
import { renderClassText } from "@/stores/utils";

type Props = {
  page: number;
  limit: number;
  search: string;
  withParam: string;
  sort: string;
};

function useListKelas({ withParam, limit, page, search, sort }: Props) {
  const router = useRouter();

  const paths = router.pathname.split("/");
  const type = paths[1];

  const { data: kelas, isLoading } = useQuery({
    queryKey: ["CLASSES", page, limit, search],
    queryFn: async () => {
      const response = await KelasServices.get({
        page_size: limit,
        page,
        search: search ? search : undefined,
        ...(withParam && { with: withParam }),
        order: "nama",
        by: "asc",
        type,
      });
      return response;
    },
    select(data) {
      return {
        ...data,
        data: data.data.map((kelas, index) => ({
          ...kelas,
          no: index + 1 + limit * page - limit,
        })),
      };
    },
  });

  const columns: TableProps<TKelas>["columns"] = [
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
      title: "Kelas",
      dataIndex: "tingkatan_id",
      render: (value, record) => (
        <Text style={{ textTransform: "uppercase" }}>
          {renderClassText(value, type)}
        </Text>
      ),
    },
    {
      title: "Action",
      key: "",
      render: (value, record, index) => {
        return (
          <div key={record.id} className="flex gap-[8px]">
            <Tooltip title="Detail">
              <Button
                onClick={() =>
                  router.push(`/${type}/kesiswaan/kelas/${record.id}`)
                }
                type="text"
                icon={<EyeIcon className="text-indigo-500" />}
              />
            </Tooltip>
            <EditKelas kelasId={record.id} />
            <DeleteKelas kelasId={record.id} />
          </div>
        );
      },
    },
  ];
  return { columns, kelas, isLoading };
}

export default useListKelas;
