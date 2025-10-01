import JemputanServices from "@/services/jemputan";
import { TJemputan } from "@/services/jemputan/jemputan.type";
import { useQuery } from "@tanstack/react-query";
import { TableProps, Tag, Typography } from "antd";
import moment from "moment-timezone";
import "moment/locale/id";

type Props = {
  page: number;
  limit: number;
  filterClass: number;
  from: string;
  to: string;
};

function useListJemputan({ limit, page, filterClass, from, to }: Props) {
  const { data: jemputan, isLoading } = useQuery({
    queryKey: ["PICKUP", page, limit, filterClass, from, to],
    queryFn: async () => {
      const response = await JemputanServices.get({
        page_size: limit,
        page,
        with: "siswa.kelas",
        is_status: 0,
        from,
        to,
        ...(filterClass && { kelas: filterClass }),
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

  const columns: TableProps<TJemputan>["columns"] = [
    {
      title: "No",
      dataIndex: "no",
      render: (text: string) => <Typography.Text>{text}</Typography.Text>,
      align: "center",
    },
    {
      title: "Siswa",
      dataIndex: "siswa",
      render: (value, record) => (
        <p style={{ textTransform: "uppercase" }}>{record.siswa.nama}</p>
      ),
    },
    {
      title: "Waktu Jemput",
      dataIndex: "time_pickup",
      render: (value = "") => (
        <p style={{ textTransform: "uppercase" }}>
          {value
            ? moment(value, "HH:mm:ss").add(7, "hours").format("HH:mm")
            : "-"}
        </p>
      ),
    },
    {
      title: "Nama Penjemput",
      dataIndex: "name",
      render: (value = "") => (
        <p style={{ textTransform: "uppercase" }}>{value || "-"}</p>
      ),
    },
    {
      title: "Kode",
      dataIndex: "code",
      render: (value = "") => (
        <p style={{ textTransform: "uppercase" }}>{value || "-"}</p>
      ),
    },
    {
      title: "Nomor Plat",
      dataIndex: "phone",
      render: (value = "") => (
        <p style={{ textTransform: "uppercase" }}>{value || "-"}</p>
      ),
    },
    {
      title: "Tanggal",
      dataIndex: "date_pickup",
      render: (value = "") => (
        <p style={{ textTransform: "uppercase" }}>
          {value ? moment(value).format("LL") : "-"}
        </p>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (value: boolean) =>
        value ? <Tag color="green">Selesai</Tag> : <Tag color="red">Belum</Tag>,
    },
  ];
  return { columns, jemputan, isLoading };
}

export default useListJemputan;
