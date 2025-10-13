import { useDisclosure } from "@/hooks/useDisclosure";
import PerpusService from "@/services/perpus";
import errorResponse from "@/utils/error-response";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Form, Input, InputNumber, Modal, Typography } from "antd";
import { AxiosError } from "axios";
import { EditIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type Props = {
  bookId: number;
};

function EditBook({ bookId }: Props) {
  const modal = useDisclosure();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const queryClient = useQueryClient();

  const { data: bookDetail, isLoading: loadingDetail } = useQuery({
    queryKey: ["BOOK_DETAIL", bookId],
    queryFn: async () => {
      const response = await PerpusService.getOneBook(bookId);
      return response;
    },
    enabled: modal.isOpen,
  });

  useEffect(() => {
    if (bookDetail && bookDetail.data) {
      const book = bookDetail.data;
      form.setFieldsValue({
        isbn: book.isbn,
        judul: book.judul,
        penulis: book.penulis,
        penerbit: book.penerbit,
        tahun_terbit: book.tahun_terbit,
        stok: book.stok,
      });
    }
  }, [bookDetail, form]);

  const onSubmit = async (val: any) => {
    try {
      setLoading(true);
      await PerpusService.updateBook(bookId, val);
      queryClient.invalidateQueries({
        queryKey: ["BOOKS"],
      });
      queryClient.invalidateQueries({
        queryKey: ["BOOK_DETAIL", bookId],
      });
      toast.success("Buku berhasil diperbarui");
      modal.onClose();
    } catch (error) {
      errorResponse(error as AxiosError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => modal.onOpen()}
        icon={<EditIcon className="w-4 h-4" />}
        type="primary"
        size="small"
      >
        Edit
      </Button>
      <Modal
        open={modal.isOpen}
        maskClosable={false}
        onCancel={() => {
          modal.onClose();
          form.resetFields();
        }}
        okText="Update"
        okButtonProps={{
          onClick: form.submit,
        }}
        confirmLoading={loading}
        title={<Typography.Title level={4}>Edit Buku</Typography.Title>}
        width={600}
      >
        {loadingDetail ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <Form form={form} requiredMark layout="vertical" onFinish={onSubmit}>
            <Form.Item
              label="ISBN"
              name="isbn"
              className="w-full mb-2"
              rules={[{ required: true, message: "ISBN harus diisi" }]}
            >
              <Input placeholder="ISBN" maxLength={20} />
            </Form.Item>

            <Form.Item
              label="Judul Buku"
              name="judul"
              className="w-full mb-2"
              rules={[{ required: true, message: "Judul buku harus diisi" }]}
            >
              <Input placeholder="Judul Buku" maxLength={255} />
            </Form.Item>

            <Form.Item
              label="Penulis"
              name="penulis"
              className="w-full mb-2"
              rules={[{ required: true, message: "Penulis harus diisi" }]}
            >
              <Input placeholder="Penulis" maxLength={255} />
            </Form.Item>

            <Form.Item
              label="Penerbit"
              name="penerbit"
              className="w-full mb-2"
              rules={[{ required: true, message: "Penerbit harus diisi" }]}
            >
              <Input placeholder="Penerbit" maxLength={255} />
            </Form.Item>

            <Form.Item
              label="Tahun Terbit"
              name="tahun_terbit"
              className="w-full mb-2"
              rules={[
                { required: true, message: "Tahun terbit harus diisi" },
                {
                  type: "number",
                  min: 1900,
                  max: new Date().getFullYear() + 1,
                  message: `Tahun terbit harus antara 1900 - ${
                    new Date().getFullYear() + 1
                  }`,
                },
              ]}
            >
              <InputNumber
                placeholder="Tahun Terbit"
                className="w-full"
                min={1900}
                max={new Date().getFullYear() + 1}
              />
            </Form.Item>

            <Form.Item
              label="Stok"
              name="stok"
              className="w-full mb-2"
              rules={[
                { required: true, message: "Stok harus diisi" },
                { type: "number", min: 0, message: "Stok tidak boleh negatif" },
              ]}
            >
              <InputNumber placeholder="Stok" className="w-full" min={0} />
            </Form.Item>
          </Form>
        )}
      </Modal>
    </>
  );
}

export default EditBook;
