import { Text } from "@/components/text";
import { useQuery } from "@tanstack/react-query";
import { TableProps, Typography } from "antd";
import { TBooks } from "@/services/perpus/type";
import PerpusService from "@/services/perpus";
import EditBook from "../components/EditBook";
import { DeleteBook } from "../components/DeleteBook";

type Props = {
  page: number;
  limit: number;
  search?: string;
};

function useListBooks({ limit, page, search }: Props) {
  const { data: books, isLoading } = useQuery({
    queryKey: ["BOOKS", page, limit, search],
    queryFn: async () => {
      const response = await PerpusService.getBooks();
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

      const booksArray = data.data;
      const filteredData = search
        ? booksArray.filter(
            (book: TBooks) =>
              book.judul.toLowerCase().includes(search.toLowerCase()) ||
              book.penulis.toLowerCase().includes(search.toLowerCase()) ||
              book.penerbit.toLowerCase().includes(search.toLowerCase()) ||
              book.isbn.toLowerCase().includes(search.toLowerCase()),
          )
        : booksArray;

      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedData = filteredData.slice(startIndex, endIndex);

      return {
        data: paginatedData.map((book: TBooks, index: number) => ({
          ...book,
          no: startIndex + index + 1,
        })),
        total: filteredData.length,
        message: data.message,
      };
    },
  });

  const columns: TableProps<TBooks & { no: number }>["columns"] = [
    {
      title: "No",
      dataIndex: "no",
      render: (text: string) => <Typography.Text>{text}</Typography.Text>,
      align: "center",
      width: 60,
    },
    {
      title: "ISBN",
      dataIndex: "isbn",
      render: (value = "", record) => <Text>{value}</Text>,
      width: 120,
    },
    {
      title: "Judul",
      dataIndex: "judul",
      render: (value = "", record) => <Text>{value}</Text>,
    },
    {
      title: "Penulis",
      dataIndex: "penulis",
      render: (value = "", record) => <Text>{value}</Text>,
    },
    {
      title: "Penerbit",
      dataIndex: "penerbit",
      render: (value = "", record) => <Text>{value}</Text>,
    },
    {
      title: "Tahun Terbit",
      dataIndex: "tahun_terbit",
      render: (value = "", record) => <Text>{value}</Text>,
      align: "center",
      width: 100,
    },
    {
      title: "Stok",
      dataIndex: "stok",
      render: (value = "", record) => <Text>{value}</Text>,
      align: "center",
      width: 80,
    },
    {
      title: "Action",
      key: "action",
      render: (value, record, index) => {
        return (
          <div key={record.id} className="flex gap-[8px]">
            <EditBook bookId={record.id} />
            <DeleteBook bookId={record.id} />
          </div>
        );
      },
      width: 120,
      align: "center",
    },
  ];

  return { columns, books, isLoading };
}

export default useListBooks;
