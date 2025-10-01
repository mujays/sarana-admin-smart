import { Text } from "@/components/text";
import SiswaServices from "@/services/siswa";
import { TSiswa } from "@/services/siswa/siswa.type";
import { useQuery } from "@tanstack/react-query";
import { TableProps, Typography } from "antd";
import moment from "moment";
import "moment/locale/id";
import { useRouter } from "next/router";

type Props = {
  page: number;
  limit: number;
  tahun: number;
  search: string;
};

function useListAlumni({ limit, page, search, tahun }: Props) {
  const router = useRouter();
  const paths = router.pathname.split("/");
  const type = paths[1];
  const { data: students, isLoading } = useQuery({
    queryKey: ["STUDENTS", page, limit, search, type, tahun],
    queryFn: async () => {
      const response = await SiswaServices.get({
        page_size: limit,
        page,
        search,
        tahun,
        is_alumni: true,
        ...(type ? { type } : {}),
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

  const columns: TableProps<TSiswa>["columns"] = [
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
      title: "NIS",
      dataIndex: "nis",
      render: (value = "", record) => (
        <Text style={{ textTransform: "uppercase" }}>{value}</Text>
      ),
    },
    {
      title: "NISN",
      dataIndex: "nisn",
      render: (value = "", record) => (
        <Text style={{ textTransform: "uppercase" }}>{value}</Text>
      ),
    },
    {
      title: "Tingkat",
      dataIndex: "type",
      render: (value = "", record) => (
        <Text style={{ textTransform: "uppercase" }}>{value}</Text>
      ),
    },
    {
      title: "Ibu Kandung",
      dataIndex: "ibu_kandung",
      render: (value = "", record) => (
        <Text style={{ textTransform: "uppercase" }}>{value}</Text>
      ),
    },
    {
      title: "Tanggal Lulus",
      dataIndex: "tanggal_keluar",
      render: (value = "", record) => (
        <Text style={{ textTransform: "uppercase" }}>
          {moment(value as any).format("LL")}
        </Text>
      ),
    },
    // {
    //   title: "Action",
    //   key: "",
    //   render: (value, record, index) => {
    //     return (
    //       <div key={record.id} className="flex gap-[8px]">
    //         <Tooltip title="Detail">
    //           <Button
    //             onClick={() => router.push(`${router.asPath}/${record.id}`)}
    //             type="text"
    //             icon={<EyeIcon className="text-indigo-500" />}
    //           />
    //         </Tooltip>
    //       </div>
    //     );
    //   },
    // },
  ];
  return { columns, students, isLoading };
}

export default useListAlumni;
