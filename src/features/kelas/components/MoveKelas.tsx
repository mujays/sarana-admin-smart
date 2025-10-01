import { useDisclosure } from "@/hooks/useDisclosure";
import KelasServices from "@/services/kelas";
import errorResponse from "@/utils/error-response";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Form, Modal, Select, Typography } from "antd";
import { AxiosError } from "axios";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "sonner";

function MoveKelas({
  siswaIds,
  siswaNotRemoved,
  clear,
}: {
  siswaIds: number[];
  clear: () => void;
  siswaNotRemoved: number[];
}) {
  const modal = useDisclosure();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const router = useRouter();
  const paths = router.pathname.split("/");
  const type = paths[1];

  const { query, back } = useRouter();
  const kelasId: string = query.kelasId as string;

  const queryClient = useQueryClient();

  const { data: kelas, isLoading } = useQuery({
    queryKey: ["CLASSES"],
    enabled: modal.isOpen,
    queryFn: async () => {
      const response = await KelasServices.get({
        select: true,
        page: 1,
        type,
        with: "siswa",
      });
      return response;
    },
  });

  const onSubmit = async (val: any) => {
    try {
      setLoading(true);
      await KelasServices.update(val.kelas_id, {
        siswa: [
          ...siswaIds,
          ...(kelas?.data
            .find((k) => k.id === val.kelas_id)
            ?.siswa.map((s) => s.id) as any),
        ],
      });
      await KelasServices.update(+kelasId, {
        siswa: siswaNotRemoved,
      });
      toast.success("Siswa berhasil dipindahkan!");
      clear();
      form.resetFields();
      queryClient.resetQueries();
    } catch (error) {
      errorResponse(error as AxiosError);
    } finally {
      setLoading(false);
      modal.onClose();
    }
  };

  return (
    <>
      <Button
        onClick={() => modal.onOpen()}
        type="link"
        className="!border !border-primary-500 !text-primary-500"
      >
        Pindahkan Siswa
      </Button>

      <Modal
        open={modal.isOpen}
        maskClosable={false}
        onCancel={() => {
          modal.onClose();
        }}
        okText="Tambah"
        okButtonProps={{
          onClick: () => {
            form.submit();
          },
        }}
        confirmLoading={loading}
        title={<Typography.Title level={4}>Kelola Siswa</Typography.Title>}
      >
        <div className="space-y-3">
          <Form form={form} requiredMark layout="vertical" onFinish={onSubmit}>
            <Form.Item
              label="Kelas"
              name="kelas_id"
              className="mb-2"
              rules={[{ required: true, message: "Kelas harus dipilih" }]}
            >
              <Select
                placeholder="Pilih Kelas"
                options={kelas?.data
                  .filter((k) => k.id !== +kelasId)
                  .map((k) => ({
                    label: k.nama,
                    value: k.id,
                  }))}
              />
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </>
  );
}

export default MoveKelas;
