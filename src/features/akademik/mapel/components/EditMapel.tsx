import { useDisclosure } from "@/hooks/useDisclosure";
import AkademikService from "@/services/akademik";
import {
  MataPelajaranDto,
  TMataPelajaran,
} from "@/services/akademik/akademik.type";
import errorResponse from "@/utils/error-response";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Form, Input, Modal, Typography, Switch } from "antd";
import { AxiosError } from "axios";
import { EditIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function EditMapel({ mapelId }: { mapelId: number }) {
  const modal = useDisclosure();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const queryClient = useQueryClient();

  const { data: mapel, isLoading: isLoadingMapel } = useQuery({
    queryKey: ["MAPEL_DETAIL", mapelId],
    queryFn: async () => {
      const response = await AkademikService.getOneMapel(mapelId);
      return response;
    },
    enabled: modal.isOpen,
  });

  useEffect(() => {
    if (mapel?.data && modal.isOpen) {
      form.setFieldsValue({
        kode: mapel.data.kode,
        nama: mapel.data.nama,
        deskripsi: mapel.data.deskripsi,
        is_active: mapel.data.is_active,
      });
    }
  }, [mapel, modal.isOpen, form]);

  const onSubmit = async (val: MataPelajaranDto) => {
    try {
      setLoading(true);
      await AkademikService.updateMapel(mapelId, val);
      queryClient.invalidateQueries({
        queryKey: ["MAPEL"],
      });
      queryClient.invalidateQueries({
        queryKey: ["MAPEL_DETAIL", mapelId],
      });
      toast.success("Mata pelajaran berhasil diperbarui");
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
        data-edit-id={mapelId}
        type="text"
        icon={<EditIcon className="h-4 w-4" />}
        onClick={() => modal.onOpen()}
        className="text-blue-600 hover:text-blue-800"
      />

      <Modal
        title={
          <Typography.Title className="font-normal" level={4}>
            Edit Mata Pelajaran
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
            className="!mb-2"
            rules={[
              { required: true, message: "Kode mata pelajaran wajib diisi" },
            ]}
          >
            <Input placeholder="Masukkan kode mata pelajaran" />
          </Form.Item>

          <Form.Item
            label="Nama Mata Pelajaran"
            name="nama"
            className="!mb-2"
            rules={[
              { required: true, message: "Nama mata pelajaran wajib diisi" },
            ]}
          >
            <Input placeholder="Masukkan nama mata pelajaran" />
          </Form.Item>

          <Form.Item
            label="Deskripsi"
            name="deskripsi"
            className="!mb-2"
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
            className="!mb-2"
            valuePropName="checked"
          >
            <Switch className="!mb-2" />
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
            <Button
              type="primary"
              htmlType="submit"
              loading={loading || isLoadingMapel}
            >
              Perbarui
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
}

export default EditMapel;
