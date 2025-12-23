import { useDisclosure } from "@/hooks/useDisclosure";
import AkademikService from "@/services/akademik";
import { MataPelajaranDto } from "@/services/akademik/akademik.type";
import errorResponse from "@/utils/error-response";
import { useQueryClient } from "@tanstack/react-query";
import { Button, Form, Input, Modal, Typography, Switch } from "antd";
import { AxiosError } from "axios";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

function AddMapel() {
  const modal = useDisclosure();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const queryClient = useQueryClient();

  const onSubmit = async (val: MataPelajaranDto) => {
    try {
      setLoading(true);
      await AkademikService.createMapel(val);
      queryClient.invalidateQueries({
        queryKey: ["MAPEL"],
      });
      toast.success("Mata pelajaran berhasil ditambahkan");
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
      <Button
        type="primary"
        icon={<PlusIcon className="h-4 w-4" />}
        onClick={() => modal.onOpen()}
      >
        Tambah Mata Pelajaran
      </Button>

      <Modal
        title={
          <Typography.Title className="font-normal" level={4}>
            Tambah Mata Pelajaran
          </Typography.Title>
        }
        open={modal.isOpen}
        onCancel={() => {
          modal.onClose();
          form.resetFields();
        }}
        footer={null}
        maskClosable={false}
      >
        <Form form={form} layout="vertical" onFinish={onSubmit}>
          <Form.Item
            label="Kode Mata Pelajaran"
            name="kode"
            rules={[
              { required: true, message: "Kode mata pelajaran wajib diisi" },
            ]}
          >
            <Input placeholder="Masukkan kode mata pelajaran" />
          </Form.Item>

          <Form.Item
            label="Nama Mata Pelajaran"
            name="nama"
            rules={[
              { required: true, message: "Nama mata pelajaran wajib diisi" },
            ]}
          >
            <Input placeholder="Masukkan nama mata pelajaran" />
          </Form.Item>

          <Form.Item
            label="Deskripsi"
            name="deskripsi"
            rules={[{ required: true, message: "Deskripsi wajib diisi" }]}
          >
            <Input.TextArea
              rows={4}
              placeholder="Masukkan deskripsi mata pelajaran"
            />
          </Form.Item>

          <Form.Item
            label="Status Aktif"
            name="is_active"
            valuePropName="checked"
            initialValue={true}
          >
            <Switch checkedChildren="Aktif" unCheckedChildren="Tidak Aktif" />
          </Form.Item>

          <div className="flex justify-end gap-2">
            <Button
              onClick={() => {
                modal.onClose();
                form.resetFields();
              }}
            >
              Batal
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              Simpan
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
}

export default AddMapel;
