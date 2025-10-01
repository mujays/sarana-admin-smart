import { useDisclosure } from "@/hooks/useDisclosure";
import RiwayatServices from "@/services/riwayat";
import errorResponse from "@/utils/error-response";
import { useQueryClient } from "@tanstack/react-query";
import { Button, Form, Input, Modal, Typography } from "antd";
import { AxiosError } from "axios";
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "sonner";

function AddRiwayat() {
  const modal = useDisclosure();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const queryClient = useQueryClient();

  const onSubmit = async (val: any) => {
    try {
      setLoading(true);
      await RiwayatServices.create({
        ...val,
        siswa_id: router.query.siswaId,
      });
      queryClient.invalidateQueries({
        queryKey: ["RIWAYAT", router.query.siswaId],
      });
      toast.success("Riwayat berhasil dibuat");
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
        <span className="!hidden md:!inline">Tambah Riwayat</span>
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
        title={<Typography.Title level={4}>Tambah Riwayat</Typography.Title>}
      >
        <Form form={form} requiredMark layout="vertical" onFinish={onSubmit}>
          <div className="flex gap-2">
            <Form.Item
              label="Jenis Penyakit"
              name="jenis_penyakit"
              className="w-full mb-2"
              rules={[
                { required: true, message: "Jenis Penyakit harus diisi" },
              ]}
            >
              <Input placeholder="Jenis Penyakit" maxLength={255} />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </>
  );
}

export default AddRiwayat;
