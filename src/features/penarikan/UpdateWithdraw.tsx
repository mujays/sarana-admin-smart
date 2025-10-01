import { useDisclosure } from "@/hooks/useDisclosure";
import AuthService from "@/services/auth";
import ClientService from "@/services/client";
import errorResponse from "@/utils/error-response";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Form, Input, Modal, Tooltip, Typography } from "antd";
import { AxiosError } from "axios";
import { PencilIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function UpdateWithdraw({ id }: { id: number }) {
  const modal = useDisclosure();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const queryClient = useQueryClient();

  const { data: me, isLoading } = useQuery({
    queryKey: ["ME"],
    queryFn: async () => {
      const response = await AuthService.me();
      return response;
    },
  });

  const { data: withdraw, isLoading: loadingWd } = useQuery({
    queryKey: ["wd", id, modal.isOpen],
    enabled: modal.isOpen,
    queryFn: async () => {
      const response = await ClientService.getOneWithdraw(id);
      return response;
    },
  });

  const onSubmit = async (val: any) => {
    try {
      setLoading(true);
      await ClientService.updateWithdraw(id, {
        jumlah: val.jumlah,
        by: me?.data.name,
      });
      queryClient.invalidateQueries({
        queryKey: ["WITHDRAWS"],
      });
      toast.success("Berhasil buat penarikan");
      form.resetFields();
      modal.onClose();
    } catch (error) {
      errorResponse(error as AxiosError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (withdraw) {
      form.setFieldValue("jumlah", withdraw.data.jumlah);
    }
  }, [withdraw, modal.isOpen]);

  return (
    <Tooltip title="Edit">
      <Button
        onClick={() => modal.onOpen()}
        icon={<PencilIcon className="w-4 h-4 text-orange-500" />}
        type="text"
      />

      <Modal
        loading={loadingWd}
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
        title={<Typography.Title level={4}>Ubah Penarikan</Typography.Title>}
      >
        <Form form={form} requiredMark layout="vertical" onFinish={onSubmit}>
          <Form.Item
            label="Jumlah"
            name="jumlah"
            className="w-full mb-2"
            rules={[{ required: true, message: "Jumlah harus diisi" }]}
          >
            <Input placeholder="Nama" maxLength={255} />
          </Form.Item>
        </Form>
      </Modal>
    </Tooltip>
  );
}

export default UpdateWithdraw;
