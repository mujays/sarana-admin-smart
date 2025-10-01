import { useDisclosure } from "@/hooks/useDisclosure";
import KelasServices from "@/services/kelas";
import TypeServices from "@/services/type";
import errorResponse from "@/utils/error-response";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Form, Input, Modal, Select, Tooltip, Typography } from "antd";
import { AxiosError } from "axios";
import { EditIcon } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function EditType({ typeId }: { typeId: number }) {
  const modal = useDisclosure();
  const [form] = Form.useForm();
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

  const { data: type, isLoading } = useQuery({
    queryKey: ["TYPE", typeId],
    enabled: modal.isOpen,
    queryFn: async () => {
      const response = await TypeServices.getOne(typeId);
      return response;
    },
  });

  const onSubmit = async (val: any) => {
    try {
      setLoading(true);
      await TypeServices.update(typeId, val);
      queryClient.invalidateQueries({
        queryKey: ["TYPES"],
      });
      queryClient.invalidateQueries({
        queryKey: ["TYPE", typeId],
      });
      toast.success("Data berhasil diperbarui");
      form.resetFields();
    } catch (error) {
      errorResponse(error as AxiosError);
    } finally {
      setLoading(false);
      modal.onClose();
    }
  };

  useEffect(() => {
    if (type) {
      form.setFieldValue("name", type.data.name);
      form.setFieldValue("biaya", type.data.biaya);
      form.setFieldValue("tanggal", type.data.tanggal);
      form.setFieldValue("code", type.data.code);
      form.setFieldValue("jenis", type.data.jenis);
      form.setFieldValue("kelas_id", type.data.kelas_id);
    }
  }, [type, modal]);

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
        loading={isLoading}
        okText="Simpan"
        okButtonProps={{
          onClick: form.submit,
        }}
        confirmLoading={loading}
        title={<Typography.Title level={4}>Edit Tipe</Typography.Title>}
      >
        <Form form={form} requiredMark layout="vertical" onFinish={onSubmit}>
          <Form.Item
            label="Nama"
            name="name"
            className="w-full mb-2"
            rules={[{ required: true, message: "Nama harus diisi" }]}
          >
            <Input placeholder="Nama" maxLength={255} />
          </Form.Item>
          <Form.Item
            label="Kode"
            name="code"
            className="w-full mb-2"
            rules={[{ required: true, message: "Kode harus diisi" }]}
          >
            <Input placeholder="Kode" maxLength={255} />
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
            <Input type="number" placeholder="0" maxLength={255} />
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
    </Tooltip>
  );
}

export default EditType;
