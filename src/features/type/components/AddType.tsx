import { useDisclosure } from "@/hooks/useDisclosure";
import KelasServices from "@/services/kelas";
import TypeServices from "@/services/type";
import errorResponse from "@/utils/error-response";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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

function AddType() {
  const modal = useDisclosure();
  const [form] = Form.useForm();
  const jenis = Form.useWatch("jenis", form);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const paths = router.pathname.split("/");
  const typeSchool = paths[1];

  const queryClient = useQueryClient();

  const { data: kelas } = useQuery({
    queryKey: ["CLASSES"],
    queryFn: async () => {
      const response = await KelasServices.get({
        select: true,
        page: 1,
        type: typeSchool,
      });
      return response;
    },
  });

  const onSubmit = async (val: any) => {
    try {
      setLoading(true);
      await TypeServices.create(val);
      queryClient.invalidateQueries({
        queryKey: ["TYPES"],
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
        <span className="!hidden md:!inline">Tambah Tipe</span>
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
        title={<Typography.Title level={4}>Tambah Tipe</Typography.Title>}
      >
        <Form form={form} requiredMark layout="vertical" onFinish={onSubmit}>
          <Form.Item
            label="Nama"
            name="name"
            className="w-full mb-2"
            rules={[
              { required: true, message: "Nama harus diisi" },
              noEmojiRule,
            ]}
          >
            <Input
              placeholder="Nama"
              maxLength={255}
              onChange={createEmojiPreventionHandler()}
            />
          </Form.Item>
          <Form.Item
            label="Kode"
            name="code"
            className="w-full mb-2"
            rules={[
              { required: true, message: "Kode harus diisi" },
              noEmojiRule,
            ]}
          >
            <Input
              placeholder="Kode"
              maxLength={255}
              onChange={createEmojiPreventionHandler()}
            />
          </Form.Item>
          <Form.Item
            className="mb-2"
            label="Jenis"
            name="jenis"
            rules={[{ required: true, message: "Jenis harus diisi" }]}
          >
            <Select
              placeholder="Pilih Jenis"
              options={[
                {
                  label: "Semester",
                  value: "semester",
                },
                {
                  label: "Bulanan",
                  value: "bulanan",
                },
                {
                  label: "Terbatas",
                  value: "terbatas",
                },
              ]}
            />
          </Form.Item>

          <Form.Item
            label="Kelas"
            name="kelas_id"
            className="mb-2"
            rules={[{ required: true, message: "Kelas harus dipilih" }]}
          >
            <Select
              placeholder="Pilih Kelas"
              options={kelas?.data.map((k) => ({
                label: k.nama,
                value: k.id,
              }))}
            />
          </Form.Item>
          <Form.Item
            label="Tanggal Jatuh Tempo"
            name="tanggal"
            className="w-full mb-2"
            rules={[
              { required: true, message: "Tanggal Jatuh Tempo harus diisi" },
            ]}
          >
            <Input min={0} max={31} type="number" placeholder="0" />
          </Form.Item>

          <Form.Item
            label="Biaya"
            name="biaya"
            className="mb-2 w-full"
            rules={[{ required: true, message: "Biaya harus diisi" }]}
          >
            <Input prefix="Rp. " placeholder="Biaya" maxLength={255} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default AddType;
