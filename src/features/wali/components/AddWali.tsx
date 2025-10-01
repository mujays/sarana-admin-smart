import { useDisclosure } from "@/hooks/useDisclosure";
import SiswaServices from "@/services/siswa";
import WaliService from "@/services/wali";
import errorResponse from "@/utils/error-response";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Form, Input, Modal, Select, Typography } from "antd";
import { AxiosError } from "axios";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

function AddWali() {
  const modal = useDisclosure();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const queryClient = useQueryClient();

  const { data: students, isLoading } = useQuery({
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
        value: siswa.id,
      }));
    },
  });

  const onSubmit = async (val: any) => {
    try {
      setLoading(true);
      await WaliService.create(val);
      queryClient.invalidateQueries({
        queryKey: ["WALIES"],
      });
      toast.success("Data berhasil dibuat");
      form.resetFields();
    } catch (error) {
      errorResponse(error as AxiosError);
    } finally {
      setLoading(false);
      modal.onClose();
    }
  };

  return (
    <>
      <Button onClick={() => modal.onOpen()} icon={<PlusIcon />} type="primary">
        <span className="!hidden md:!inline">Tambah</span>
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
        title={<Typography.Title level={4}>Tambah Wali Murid</Typography.Title>}
      >
        <Form form={form} requiredMark layout="vertical" onFinish={onSubmit}>
          <Form.Item
            label="Nama"
            name="nama"
            className="w-full mb-2"
            rules={[{ required: true, message: "Nama harus diisi" }]}
          >
            <Input placeholder="Nama" maxLength={255} />
          </Form.Item>
          <div className="flex gap-2">
            <Form.Item
              label="Email"
              name="email"
              className="w-full mb-2"
              rules={[{ required: true, message: "Email harus diisi" }]}
            >
              <Input placeholder="Email" maxLength={255} />
            </Form.Item>
            <Form.Item
              label="Password"
              name="password"
              className="w-full mb-2"
              rules={[{ required: true, message: "Password harus diisi" }]}
            >
              <Input.Password placeholder="Password" maxLength={255} />
            </Form.Item>
          </div>
          <Form.Item
            label="Hubungan"
            name="hubungan"
            className="w-full mb-2"
            rules={[{ required: true, message: "Hubungan harus diisi" }]}
          >
            <Input placeholder="Hubungan" maxLength={255} />
          </Form.Item>

          <div className="flex gap-2">
            <Form.Item
              label="Pekerjaan"
              name="pekerjaan"
              className="mb-2 w-full"
              rules={[{ required: true, message: "Pekerjaan harus diisi" }]}
            >
              <Input placeholder="Pekerjaan" maxLength={255} />
            </Form.Item>
            <Form.Item
              label="Gaji"
              name="gaji"
              className="mb-2 w-full"
              rules={[{ required: true, message: "Gaji harus diisi" }]}
            >
              <Input prefix="Rp. " placeholder="Gaji" maxLength={255} />
            </Form.Item>
          </div>

          <Form.Item
            label="Nomor Telepon"
            name="no_hp"
            className="mb-2"
            rules={[{ required: true, message: "Nomor Telepon harus diisi" }]}
          >
            <Input placeholder="Nomor Telepon" maxLength={255} />
          </Form.Item>

          <Form.Item label="Siswa" name="siswa" className="mb-2">
            <Select
              mode="multiple"
              placeholder="Pilih Siswa"
              options={students}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default AddWali;
