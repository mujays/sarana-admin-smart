import { useDisclosure } from "@/hooks/useDisclosure";
import TahunAjaranService from "@/services/tahun-ajaran";
import errorResponse from "@/utils/error-response";
import { useQueryClient } from "@tanstack/react-query";
import { Button, Form, Modal, Select, Typography } from "antd";
import { AxiosError } from "axios";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

function AddTahunAjaran() {
  const modal = useDisclosure();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const queryClient = useQueryClient();

  const currentYear = new Date().getFullYear();
  const options = Array.from({ length: 11 }, (_, i) => {
    const startYear = currentYear - 5 + i;
    return {
      label: `${startYear}/${startYear + 1}`,
      value: `${startYear}/${startYear + 1}`,
    };
  });

  const onSubmit = async (val: any) => {
    try {
      setLoading(true);
      await TahunAjaranService.create(val);
      queryClient.invalidateQueries({
        queryKey: ["ACADEMICS"],
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
        <span className="!hidden md:!inline">Tambah Tahun Ajaran</span>
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
        title={
          <Typography.Title level={4}>Tambah Tahun Ajaran</Typography.Title>
        }
      >
        <Form form={form} requiredMark layout="vertical" onFinish={onSubmit}>
          <Form.Item
            label="Tahun Ajaran"
            name="name"
            className="w-full mb-2"
            rules={[{ required: true, message: "Tahun ajaran harus diisi" }]}
          >
            <Select
              placeholder="Pilih Tahun Ajaran"
              options={options}
              showSearch
              optionFilterProp="label"
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default AddTahunAjaran;
