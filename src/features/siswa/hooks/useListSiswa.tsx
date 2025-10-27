import { Text } from "@/components/text";
import SiswaServices from "@/services/siswa";
import { TSiswa } from "@/services/siswa/siswa.type";
import { useQuery } from "@tanstack/react-query";
import { Button, TableProps, Tooltip, Typography } from "antd";
import { EditIcon, EyeIcon, UsersIcon } from "lucide-react";
import { useRouter } from "next/router";
import { DeleteSiswa } from "../components/DeleteSiswa";

type Props = {
  page: number;
  limit: number;
  search: string;
  sort?: string;
  kelas?: string[];
  app?: "keuangan" | "kesiswaan";
  isNewStudent?: boolean;
};

function useListSiswa({
  limit,
  page,
  search,
  app = "kesiswaan",
  kelas,
  sort = "nama,asc",
  isNewStudent = false,
}: Props) {
  const router = useRouter();
  const paths = router.pathname.split("/");
  const type = paths[1];
  const { data: students, isLoading } = useQuery({
    queryKey: [
      "STUDENTS",
      page,
      limit,
      search,
      type,
      kelas,
      isNewStudent,
      sort,
    ],
    queryFn: async () => {
      const response = await SiswaServices.get({
        page_size: limit,
        page,
        search,
        order: sort.split(",")[0],
        by: sort.split(",")[1],
        ...(kelas && kelas.length ? { kelas } : {}),
        ...(isNewStudent ? { is_before: true } : {}),
        ...(type ? { type } : {}),
        with: "kelas",
        siswa_lama: !isNewStudent,
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
      sorter: true,
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
        <Text style={{ textTransform: "uppercase" }}>{value || "-"}</Text>
      ),
    },
    {
      title: "Kelas",
      dataIndex: "kelas",
      render: (value = "", record) => (
        <Text style={{ textTransform: "uppercase" }}>
          {record?.kelas?.[0]?.nama || "-"}
        </Text>
      ),
    },
    {
      title: "NISN",
      dataIndex: "nisn",
      render: (value = "", record) => (
        <Text style={{ textTransform: "uppercase" }}>{value || "-"}</Text>
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
      title: "Action",
      key: "",
      render: (value, record, index) => {
        return (
          <div key={record.id} className="flex gap-[8px]">
            {app === "keuangan" && (
              <>
                <Button
                  type="primary"
                  onClick={() => router.push(`${router.pathname}/${record.id}`)}
                >
                  Tagihan SPP
                </Button>
                <Button
                  onClick={() =>
                    router.push(`${router.pathname}/${record.id}/uang-pangkal`)
                  }
                >
                  Tagihan Lainnya
                </Button>
              </>
            )}
            {app === "kesiswaan" && (
              <>
                <Tooltip title="Detail">
                  <Button
                    onClick={() => router.push(`${router.asPath}/${record.id}`)}
                    type="text"
                    icon={<EyeIcon className="text-indigo-500" />}
                  />
                </Tooltip>
                <Tooltip title="Keluarga" placement="bottom">
                  <Button
                    icon={
                      <UsersIcon className="w-5 h-5 text-primary-500 cursor-pointer" />
                    }
                    onClick={() => {
                      router.push(
                        `/${type}/kesiswaan/siswa/${record.id}/keluarga`,
                      );
                    }}
                    type="text"
                  ></Button>
                </Tooltip>
                <Tooltip title="Edit" placement="bottom">
                  <Button
                    icon={
                      <EditIcon className="w-5 h-5 text-primary-500 cursor-pointer" />
                    }
                    onClick={() => {
                      router.push(`/${type}/kesiswaan/siswa/${record.id}/edit`);
                    }}
                    type="text"
                  ></Button>
                </Tooltip>
                <DeleteSiswa siswaId={record.id} />
              </>
            )}
          </div>
        );
      },
    },
  ];
  return { columns, students, isLoading };
}

export default useListSiswa;
