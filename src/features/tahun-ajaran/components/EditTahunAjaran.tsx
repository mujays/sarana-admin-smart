import { useDisclosure } from "@/hooks/useDisclosure";
import TahunAjaranService from "@/services/tahun-ajaran";
import errorResponse from "@/utils/error-response";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Form, Input, Modal, Tooltip, Typography } from "antd";
import { AxiosError } from "axios";
import { EditIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function EditTahunAjaran({ tahunAjaranId }: { tahunAjaranId: number }) {
  const modal = useDisclosure();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const queryClient = useQueryClient();

  const { data: academic, isLoading } = useQuery({
    queryKey: ["ACADEMIC", tahunAjaranId],
    enabled: modal.isOpen,
    queryFn: async () => {
      const response = await TahunAjaranService.getOne(tahunAjaranId);
      return response;
    },
  });

  const onSubmit = async (val: any) => {
    try {
      setLoading(true);
      await TahunAjaranService.update(tahunAjaranId, val);
      queryClient.invalidateQueries({
        queryKey: ["ACADEMIC", tahunAjaranId],
      });
      queryClient.invalidateQueries({
        queryKey: ["ACADEMICS"],
      });
      toast.success("Data berhasil diubah");
      form.resetFields();
    } catch (error) {
      errorResponse(error as AxiosError);
    } finally {
      setLoading(false);
      modal.onClose();
    }
  };

  useEffect(() => {
    if (academic) {
      form.setFieldValue("name", academic.data.name);
    }
  }, [academic, modal]);

  return (
    <Tooltip title="Edit">
      <Button
        icon={<EditIcon className="w-5 h-5 text-primary-500 cursor-pointer" />}
        onClick={() => {
          modal.onOpen();
        }}
        type="text"
      ></Button>
      <Modal
        open={modal.isOpen}
        maskClosable={false}
        onCancel={() => {
          modal.onClose();
          form.resetFields();
        }}
        okText="Edit"
        okButtonProps={{
          onClick: form.submit,
        }}
        loading={isLoading}
        confirmLoading={loading}
        title={<Typography.Title level={4}>Edit Tahun Ajaran</Typography.Title>}
      >
        <Form form={form} requiredMark layout="vertical" onFinish={onSubmit}>
          <Form.Item
            label="Nama"
            name="name"
            className="w-full mb-2"
            rules={[{ required: true, message: "Tahun ajaran harus diisi" }]}
          >
            <Input placeholder="2020/2021" maxLength={255} />
          </Form.Item>
        </Form>
      </Modal>
    </Tooltip>
  );
}

export default EditTahunAjaran;
