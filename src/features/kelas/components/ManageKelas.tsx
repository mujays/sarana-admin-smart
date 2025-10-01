import { Text } from "@/components/text";
import { useDebounce } from "@/hooks/useDebounce";
import { useDisclosure } from "@/hooks/useDisclosure";
import KelasServices from "@/services/kelas";
import SiswaServices from "@/services/siswa";
import { TSiswa } from "@/services/siswa/siswa.type";
import errorResponse from "@/utils/error-response";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Input, Modal, Table, Typography } from "antd";
import { TableProps } from "antd/lib";
import { AxiosError } from "axios";
import { GraduationCap, SearchIcon } from "lucide-react";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "sonner";

function ManageKelas({ siswa, kelasId }: { siswa: TSiswa[]; kelasId: number }) {
  const modal = useDisclosure();
  const [loading, setLoading] = useState(false);
  const [selectedSiswa, setSelectedSiswa] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<TSiswa[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 50,
  });
  const { query } = useRouter();
  const router = useRouter();
  const paths = router.pathname.split("/");
  const type = paths[1];

  const [search, setSearch] = useState("");

  const debounceSearch = useDebounce(search, 300);

  const queryClient = useQueryClient();

  const { data: students, isLoading } = useQuery({
    enabled: modal.isOpen,
    queryKey: [
      "STUDENTS_KELOLA",
      pagination.page,
      pagination.pageSize,
      debounceSearch,
    ],
    queryFn: async () => {
      const response = await SiswaServices.get({
        page_size: pagination.pageSize,
        page: pagination.page,
        siswa_baru: true,
        type,
        ...(debounceSearch && { search: debounceSearch }),
      });
      return response;
    },
    select(data) {
      return {
        ...data,
        data: data.data
          .filter((siswa) => siswa.kelas?.[0]?.id !== +kelasId)
          .map((siswa, index) => ({
            ...siswa,
            no:
              index +
              1 +
              pagination.pageSize * pagination.page -
              pagination.pageSize,
            key: index,
          })),
      };
    },
  });

  const onSubmit = async () => {
    try {
      setLoading(true);
      await KelasServices.update(+(query?.kelasId as string), {
        siswa: [...selectedStudent.map((s) => s.id), ...siswa.map((s) => s.id)],
      });
      queryClient.resetQueries();
      toast.success("Siswa berhasil di input");
    } catch (error) {
      errorResponse(error as AxiosError);
    } finally {
      setLoading(false);
      modal.onClose();
    }
  };

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
  ];

  return (
    <>
      <Button
        onClick={() => modal.onOpen()}
        type="link"
        className="!border !border-primary-500 !text-primary-500"
        icon={<GraduationCap />}
      >
        Tambah Siswa
      </Button>

      <Modal
        width={1000}
        open={modal.isOpen}
        maskClosable={false}
        onCancel={() => {
          modal.onClose();
        }}
        okText="Tambah"
        okButtonProps={{
          onClick: () => {
            onSubmit();
          },
        }}
        confirmLoading={loading}
        title={<Typography.Title level={4}>Kelola Siswa</Typography.Title>}
      >
        <div className="space-y-3">
          <div className="flex justify-end">
            <Input
              style={{ width: 280 }}
              placeholder="Search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
              prefix={<SearchIcon className="text-gray-300" />}
            />
          </div>
          <div className="overflow-auto">
            <Table<TSiswa>
              id="siswa-table-kelola"
              rowSelection={{
                selectedRowKeys: selectedSiswa,
                onChange(selectedRowKeys, selectedRows, info) {
                  setSelectedSiswa(selectedRowKeys);
                  setSelectedStudent(selectedRows);
                },
              }}
              columns={columns}
              dataSource={students?.data}
              loading={isLoading}
              pagination={{
                onChange: (page, pageSize) => {
                  setPagination({ page, pageSize });
                },
                total: students?.meta.total,
                pageSize: pagination.pageSize,
                current: pagination.page,
              }}
            />
          </div>
        </div>
      </Modal>
    </>
  );
}

export default ManageKelas;
