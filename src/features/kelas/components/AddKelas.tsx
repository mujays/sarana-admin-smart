import { useDisclosure } from "@/hooks/useDisclosure";
import KelasServices from "@/services/kelas";
import { renderClassText } from "@/stores/utils";
import errorResponse from "@/utils/error-response";
import { useQueryClient } from "@tanstack/react-query";
import { Button, Form, Input, Modal, Select, Typography } from "antd";
import { AxiosError } from "axios";
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "sonner";
import {
  createEmojiPreventionHandler,
  noEmojiRule,
} from "@/utils/emoji-prevention";

function AddKelas() {
  const modal = useDisclosure();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const paths = router.pathname.split("/");
  const type = paths[1];

  const queryClient = useQueryClient();

  const onSubmit = async (val: any) => {
    try {
      setLoading(true);
      await KelasServices.create({
        ...val,
        tingkatan_id: type == "sd" ? val?.tingkatan_id : val?.tingkatan_id + 6,
      });
      queryClient.invalidateQueries({
        queryKey: ["CLASSES"],
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
        <span className="!hidden md:!inline">Tambah Kelas</span>
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
        title={<Typography.Title level={4}>Tambah Kelas</Typography.Title>}
      >
        <Form form={form} requiredMark layout="vertical" onFinish={onSubmit}>
          <Form.Item
            label="Nama"
            name="nama"
            className="w-full mb-2"
            rules={[
              { required: true, message: "Nama harus diisi" },
              noEmojiRule,
            ]}
          >
            <Input
              placeholder="Nama Kelas"
              maxLength={255}
              onChange={createEmojiPreventionHandler()}
            />
          </Form.Item>

          <Form.Item
            label="Deskripsi"
            name="description"
            className="w-full mb-2"
            rules={[
              { required: true, message: "Deskripsi harus diisi" },
              noEmojiRule,
            ]}
          >
            <Input.TextArea
              placeholder="Tulis deskripsi..."
              maxLength={255}
              onChange={createEmojiPreventionHandler()}
            />
          </Form.Item>

          <Form.Item
            label="Kelas"
            name="tingkatan_id"
            className="mb-2"
            rules={[{ required: true, message: "Kelas harus diisi" }]}
          >
            <Select
              placeholder="Pilih Kelas"
              options={Array.from({ length: type == "sd" ? 6 : 3 }, (_, i) => ({
                value: i + 1,
                label: renderClassText(i + 1, type),
              }))}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default AddKelas;
