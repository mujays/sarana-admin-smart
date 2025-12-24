import { useState } from "react";
import {
  Modal,
  Form,
  Select,
  InputNumber,
  Button,
  message,
  Card,
  Typography,
  Row,
  Col,
  Divider,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { BookOpenIcon, UserIcon, CalendarIcon } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import PerpusService from "@/services/perpus";
import SiswaServices from "@/services/siswa";
import { BorrowDto, TBooks } from "@/services/perpus/type";
import dayjs from "dayjs";
import { toast } from "sonner";

const { Option } = Select;
const { Text, Title } = Typography;

interface AddLoanFormData {
  borrower_id: number;
  buku_id: number;
  durasi_hari: number;
}

function AddLoan() {
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  // Get books list
  const { data: booksData, isLoading: isLoadingBooks } = useQuery({
    queryKey: ["BOOKS_FOR_LOAN"],
    queryFn: async () => {
      const response = await PerpusService.getBooks();
      return response;
    },
    enabled: visible,
  });

  // Get students list (for borrowers)
  const { data: students, isLoading: isLoadingUsers } = useQuery({
    queryKey: ["STUDENTS"],
    queryFn: async () => {
      const response = await SiswaServices.get({
        page_size: 1000000,
        page: 1,
      });
      return response;
    },
    select(data) {
      return data.data.map((siswa, index) => ({
        label: siswa.nama,
        value: `${siswa.id}-${siswa.nama}`,
      }));
    },
    enabled: visible,
  });

  // Create loan mutation
  const { mutate: createLoan, isPending: isCreating } = useMutation({
    mutationFn: async (values: AddLoanFormData) => {
      const payload: BorrowDto = {
        borrower_id: values.borrower_id,
        buku_id: values.buku_id,
        durasi_hari: values.durasi_hari,
      };
      return await PerpusService.createBorrow(payload);
    },
    onSuccess: () => {
      toast.success("Peminjaman berhasil dibuat!");
      form.resetFields();
      setVisible(false);
      queryClient.invalidateQueries({ queryKey: ["LOANS"] });
      queryClient.invalidateQueries({ queryKey: ["BOOKS"] });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Gagal membuat peminjaman!",
      );
    },
  });

  const handleSubmit = (values: AddLoanFormData) => {
    createLoan(values);
  };

  const handleCancel = () => {
    form.resetFields();
    setVisible(false);
  };

  const selectedBook = form.getFieldValue("buku_id");
  const selectedDuration = form.getFieldValue("durasi_hari");
  const book = booksData?.data?.find((b: TBooks) => b.id === selectedBook);
  const dueDate = selectedDuration
    ? dayjs().add(selectedDuration, "day")
    : null;

  const availableBooks =
    booksData?.data?.filter((book: TBooks) => book.stok > 0) || [];

  return (
    <>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => setVisible(true)}
      >
        Tambah Peminjaman
      </Button>

      <Modal
        title="Buat Peminjaman Buku"
        open={visible}
        onCancel={handleCancel}
        footer={null}
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="space-y-4"
        >
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="borrower_id"
                label="Peminjam"
                rules={[{ required: true, message: "Peminjam harus dipilih!" }]}
              >
                <Select
                  mode="multiple"
                  placeholder="Pilih Peminjam"
                  options={students}
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                name="durasi_hari"
                label="Durasi Peminjaman (Hari)"
                rules={[
                  { required: true, message: "Durasi harus diisi!" },
                  {
                    type: "number",
                    min: 1,
                    max: 30,
                    message: "Durasi 1-30 hari!",
                  },
                ]}
              >
                <InputNumber
                  placeholder="Masukkan durasi"
                  min={1}
                  max={30}
                  style={{ width: "100%" }}
                  addonAfter="hari"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="buku_id"
            label="Buku"
            rules={[{ required: true, message: "Buku harus dipilih!" }]}
          >
            <Select
              placeholder="Pilih buku yang akan dipinjam"
              loading={isLoadingBooks}
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.children as unknown as string)
                  ?.toLowerCase()
                  ?.includes(input.toLowerCase())
              }
            >
              {availableBooks.map((book: TBooks) => (
                <Option key={book.id} value={book.id}>
                  <div className="flex items-start gap-2 py-1">
                    <div className="font-medium">{book.judul}</div>
                  </div>
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* Preview Card */}
          {book && dueDate && (
            <Card size="small" className="bg-blue-50 border-blue-200">
              <Title level={5} className="!mb-2 text-blue-700">
                <CalendarIcon className="inline h-4 w-4 mr-2" />
                Ringkasan Peminjaman
              </Title>
              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Text strong className="block text-sm">
                    Buku:
                  </Text>
                  <Text className="text-sm">{book.judul}</Text>
                  <Text className="block text-xs text-gray-500">
                    {book.penulis} • ISBN: {book.isbn}
                  </Text>
                </Col>
                <Col xs={24} sm={12}>
                  <Text strong className="block text-sm">
                    Jatuh Tempo:
                  </Text>
                  <Text className="text-sm text-orange-600 font-medium">
                    {dueDate.format("DD MMMM YYYY")}
                  </Text>
                  <Text className="block text-xs text-gray-500">
                    {dueDate.fromNow()}
                  </Text>
                </Col>
              </Row>
            </Card>
          )}

          <Divider />

          <Form.Item className="mb-0 flex justify-end">
            <div className="flex gap-2">
              <Button onClick={handleCancel}>Batal</Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={isCreating}
                disabled={
                  availableBooks.length === 0 ||
                  !students ||
                  students.length === 0
                }
              >
                Buat Peminjaman
              </Button>
            </div>
          </Form.Item>
        </Form>

        {availableBooks.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            <BookOpenIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <Text>Tidak ada buku yang tersedia untuk dipinjam</Text>
          </div>
        )}

        {students && students.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            <UserIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <Text>Tidak ada siswa yang terdaftar</Text>
          </div>
        )}
      </Modal>
    </>
  );
}

export default AddLoan;
