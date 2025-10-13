import { useDisclosure } from "@/hooks/useDisclosure";
import PerpusService from "@/services/perpus";
import errorResponse from "@/utils/error-response";
import { useQueryClient } from "@tanstack/react-query";
import { Button, Form, Input, InputNumber, Modal, Typography } from "antd";
import { AxiosError } from "axios";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

function AddBook() {
  const modal = useDisclosure();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const queryClient = useQueryClient();

  const onSubmit = async (val: any) => {
    try {
      setLoading(true);
      await PerpusService.createBook(val);
      queryClient.invalidateQueries({
        queryKey: ["BOOKS"],
      });
      toast.success("Buku berhasil ditambahkan");
      form.resetFields();
      modal.onClose();
    } catch (error) {
      errorResponse(error as AxiosError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button onClick={() => modal.onOpen()} icon={<PlusIcon />} type="primary">
        <span className="!hidden md:!inline">Tambah Buku</span>
      </Button>
      <Modal
        open={modal.isOpen}
        maskClosable={false}
        onCancel={() => {
          modal.onClose();
          form.resetFields();
        }}
        okText="Tambah"
        okButtonProps={{
          onClick: form.submit,
        }}
        confirmLoading={loading}
        title={<Typography.Title level={4}>Tambah Buku</Typography.Title>}
        width={600}
      >
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
            initialValue={1}
          >
            <InputNumber placeholder="Stok" className="w-full" min={0} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default AddBook;
