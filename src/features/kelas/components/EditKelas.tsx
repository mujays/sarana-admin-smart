import { useDisclosure } from "@/hooks/useDisclosure";
import KelasServices from "@/services/kelas";
import { renderClassText } from "@/stores/utils";
import errorResponse from "@/utils/error-response";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Form, Input, Modal, Select, Tooltip, Typography } from "antd";
import { AxiosError } from "axios";
import { EditIcon } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function EditKelas({ kelasId }: { kelasId: number }) {
  const modal = useDisclosure();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const paths = router.pathname.split("/");
  const type = paths[1];

  const queryClient = useQueryClient();

  const { data: kelas, isLoading } = useQuery({
    queryKey: ["CLASS", kelasId],
    enabled: modal.isOpen,
    queryFn: async () => {
      const response = await KelasServices.getOne(kelasId);
      return response;
    },
  });

  const onSubmit = async (val: any) => {
    try {
      setLoading(true);
      await KelasServices.update(kelasId, {
        ...val,
        tingkatan_id: type == "sd" ? val?.tingkatan_id : val?.tingkatan_id,
      });
      queryClient.invalidateQueries({
        queryKey: ["CLASS", kelasId],
      });
      queryClient.invalidateQueries({
        queryKey: ["CLASSES"],
      });

      toast.success("Data berhasil diubah!");
    } catch (error) {
      errorResponse(error as AxiosError);
    } finally {
      setLoading(false);
      modal.onClose();
    }
  };

  useEffect(() => {
    if (modal.isOpen && kelas) {
      form.setFieldValue("nama", kelas.data.nama);
      form.setFieldValue("tingkatan_id", kelas.data.tingkatan_id);
      form.setFieldValue("description", kelas.data.description);
    }
  }, [kelas, modal]);

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
        loading={isLoading}
        onCancel={() => {
          modal.onClose();
          form.resetFields();
        }}
        okText="Edit"
        okButtonProps={{
          onClick: form.submit,
        }}
        confirmLoading={loading}
        title={<Typography.Title level={4}>Edit Kelas</Typography.Title>}
      >
        <Form form={form} requiredMark layout="vertical" onFinish={onSubmit}>
          <Form.Item
            label="Nama"
            name="nama"
            className="w-full mb-2"
            rules={[{ required: true, message: "Nama harus diisi" }]}
          >
            <Input placeholder="Nama Kelas" maxLength={255} />
          </Form.Item>

          <Form.Item
            label="Deskripsi"
            name="description"
            className="w-full mb-2"
            rules={[{ required: true, message: "Deskripsi harus diisi" }]}
          >
            <Input.TextArea placeholder="Tulis deskripsi..." maxLength={255} />
          </Form.Item>

          <Form.Item label="Kelas" name="tingkatan_id" className="mb-2">
            <Select
              placeholder="Pilih Kelas"
              options={Array.from({ length: type == "sd" ? 6 : 3 }, (_, i) => ({
                value: type == "sd" ? i + 1 : i + 7,
                label: renderClassText(i + 1, type),
              }))}
            />
          </Form.Item>
        </Form>
      </Modal>
    </Tooltip>
  );
}

export default EditKelas;
