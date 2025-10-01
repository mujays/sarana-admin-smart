import { Text } from "@/components/text";
import { useQuery } from "@tanstack/react-query";
import { TableProps, Typography } from "antd";
import { TWali } from "@/services/wali/wali.type";
import WaliService from "@/services/wali";
import EditWali from "../components/EditWali";
import { DeleteWali } from "../components/DeleteWali";

type Props = {
  page: number;
  limit: number;
  search: string;
};

function useListWali({ limit, page, search }: Props) {
  const { data: walies, isLoading } = useQuery({
    queryKey: ["WALIES", page, limit, search],
    queryFn: async () => {
      const response = await WaliService.get({
        page_size: limit,
        page,
        search,
        order: "asc",
        by: "nama",
        with: "siswa",
      });
      return response;
    },
    select(data) {
      return {
        ...data,
        data: data.data.map((wali, index) => ({
          ...wali,
          no: index + 1 + limit * page - limit,
        })),
      };
    },
  });

  const columns: TableProps<TWali>["columns"] = [
    {
      title: "No",
      dataIndex: "no",
      render: (text: string) => <Typography.Text>{text}</Typography.Text>,
      align: "center",
    },
    {
      title: "Nama",
      dataIndex: "nama",
      render: (value = "", record) => <Text>{value}</Text>,
    },
    {
      title: "Email",
      dataIndex: "email",
      render: (value = "", record) => <Text>{value}</Text>,
    },
    {
      title: "Hubungan",
      dataIndex: "hubungan",
      render: (value = "", record) => <Text>{value}</Text>,
    },
    {
      title: "Siswa",
      dataIndex: "siswa",
      render: (value = "", record) =>
        record.siswa?.length ? (
          <Text>{record.siswa?.map((item) => item.nama).join(", ")}</Text>
        ) : (
          "-"
        ),
    },
    {
      title: "Nomor Telepon",
      dataIndex: "no_hp",
      render: (value = "", record) => <Text>{value}</Text>,
    },
    {
      title: "Action",
      key: "",
      render: (value, record, index) => {
        return (
          <div key={record.id} className="flex gap-[8px]">
            <EditWali waliId={record.id} />
            <DeleteWali walidId={record.id} />
          </div>
        );
      },
    },
  ];
  return { columns, walies, isLoading };
}

export default useListWali;
