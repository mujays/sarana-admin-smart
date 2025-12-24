import { Text } from "@/components/text";
import { useQuery } from "@tanstack/react-query";
import { TableProps, Typography, Tag, Button, Space, Tooltip } from "antd";
import { TBorrow } from "@/services/perpus/type";
import PerpusService from "@/services/perpus";
import { BookOpenIcon, CalendarIcon, UserIcon } from "lucide-react";
import dayjs from "dayjs";
import "dayjs/locale/id";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);
dayjs.locale("id");

type Props = {
  page: number;
  limit: number;
  search?: string;
  status?: "borrowed" | "returned" | "overdue" | "";
};

function useListLoans({ limit, page, search, status }: Props) {
  const {
    data: loans,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["LOANS", page, limit, search, status],
    queryFn: async () => {
      const params = {
        page,
        limit,
        search,
        status,
      };
      const response = await PerpusService.getBorrows(params);
      return response;
    },
    select(data) {
      if (!data || !data.data || !Array.isArray(data.data)) {
        return {
          data: [],
          total: 0,
          message: data?.message || "",
        };
      }

      const loansArray = data.data;

      return {
        data: loansArray.map((loan: TBorrow, index: number) => ({
          ...loan,
          no: (page - 1) * limit + index + 1,
        })),
        total: (data as any).total || loansArray.length,
        message: data.message || "",
      };
    },
  });

  const getStatusTag = (loan: TBorrow) => {
    const now = dayjs();
    const dueDate = dayjs(loan.tanggal_jatuh_tempo);
    const returnDate = loan.tanggal_kembali
      ? dayjs(loan.tanggal_kembali)
      : null;

    if (returnDate) {
      if (returnDate.isAfter(dueDate)) {
        return <Tag color="orange">Dikembalikan Terlambat</Tag>;
      }
      return <Tag color="green">Dikembalikan</Tag>;
    }

    if (now.isAfter(dueDate)) {
      return <Tag color="red">Terlambat</Tag>;
    }

    return <Tag color="blue">Dipinjam</Tag>;
  };

  const handleReturn = async (loanId: number) => {
    try {
      await PerpusService.returnBorrows(loanId, {});
      refetch();
    } catch (error) {
      console.error("Error returning book:", error);
    }
  };

  const columns: TableProps<TBorrow>["columns"] = [
    {
      title: "No",
      dataIndex: "no",
      key: "no",
      width: 60,
      align: "center",
    },
    {
      title: "Peminjam",
      key: "borrower",
      width: 200,
      render: (_, record) => (
        <div className="flex items-start gap-2">
          <UserIcon className="h-4 w-4 mt-1 text-gray-500" />
          <div>
            <Text className="font-medium block">{record.borrower.name}</Text>
            <Text className="text-sm text-gray-500">
              {record.borrower.email}
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: "Buku",
      key: "book",
      width: 250,
      render: (_, record) => (
        <div className="flex items-start gap-2">
          <BookOpenIcon className="h-4 w-4 mt-1 text-blue-500" />
          <div>
            <Text className="font-medium block">{record.book.judul}</Text>
            <Text className="text-sm text-gray-500">
              {record.book.penulis} • {record.book.penerbit}
            </Text>
            <Text className="text-xs text-gray-400">
              ISBN: {record.book.isbn}
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: "Tanggal Pinjam",
      key: "tanggal_pinjam",
      width: 150,
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-4 w-4 text-gray-500" />
          <div>
            <Text className="block">
              {dayjs(record.tanggal_pinjam).format("DD MMM YYYY")}
            </Text>
            <Text className="text-sm text-gray-500">
              {dayjs(record.tanggal_pinjam).fromNow()}
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: "Jatuh Tempo",
      key: "tanggal_jatuh_tempo",
      width: 150,
      render: (_, record) => {
        const dueDate = dayjs(record.tanggal_jatuh_tempo);
        const isOverdue = dayjs().isAfter(dueDate) && !record.tanggal_kembali;

        return (
          <div className="flex items-center gap-2">
            <CalendarIcon
              className={`h-4 w-4 ${
                isOverdue ? "text-red-500" : "text-gray-500"
              }`}
            />
            <div>
              <Text
                className={`block ${
                  isOverdue ? "text-red-600 font-medium" : ""
                }`}
              >
                {dueDate.format("DD MMM YYYY")}
              </Text>
              <Text
                className={`text-sm ${
                  isOverdue ? "text-red-500" : "text-gray-500"
                }`}
              >
                {dueDate.fromNow()}
              </Text>
            </div>
          </div>
        );
      },
    },
    {
      title: "Status",
      key: "status",
      width: 160,
      align: "center",
      render: (_, record) => getStatusTag(record),
    },
    {
      title: "Denda",
      key: "denda",
      width: 100,
      align: "right",
      render: (_, record) => (
        <Text
          className={`font-medium ${
            record.denda > 0 ? "text-red-600" : "text-gray-500"
          }`}
        >
          {record.denda > 0 ? `Rp ${record.denda.toLocaleString()}` : "-"}
        </Text>
      ),
    },
    {
      title: "Aksi",
      key: "action",
      width: 120,
      align: "center",
      render: (_, record) => {
        const canReturn = !record.tanggal_kembali;

        return (
          <Space size="small">
            {canReturn && (
              <Tooltip title="Kembalikan buku">
                <Button
                  type="primary"
                  size="small"
                  onClick={() => handleReturn(record.id)}
                >
                  Kembalikan
                </Button>
              </Tooltip>
            )}
            {record.tanggal_kembali && (
              <Text className="text-sm text-green-600">
                Dikembalikan {dayjs(record.tanggal_kembali).format("DD MMM")}
              </Text>
            )}
          </Space>
        );
      },
    },
  ];

  return {
    columns,
    loans,
    isLoading,
    refetch,
  };
}

export default useListLoans;
