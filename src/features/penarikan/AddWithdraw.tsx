import { useDisclosure } from "@/hooks/useDisclosure";
import AuthService from "@/services/auth";
import ClientService from "@/services/client";
import errorResponse from "@/utils/error-response";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Form, Input, Modal, Typography } from "antd";
import { AxiosError } from "axios";
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "sonner";
import { createEmojiPreventionHandler, noEmojiRule } from "@/utils/emoji-prevention";

function AddWithdraw({ isPending }: { isPending: boolean }) {
  const modal = useDisclosure();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const paths = router.pathname.split("/");
  const type = paths[1];

  const queryClient = useQueryClient();

  const { data: me } = useQuery({
    queryKey: ["ME"],
    queryFn: async () => {
      const response = await AuthService.me();
      return response;
    },
  });

  const { data: apps } = useQuery({
    queryKey: ["APPS"],
    queryFn: async () => {
      const response = await ClientService.getApp();
      return response;
    },
  });

  const onSubmit = async (val: any) => {
    try {
      setLoading(true);
      await ClientService.addWithdraw(
        {
          jumlah: val.jumlah,
          by: me?.data.name,
        },
        type,
      );
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

  return (
    <>
      <Button
        disabled={isPending}
        onClick={() => modal.onOpen()}
        icon={<PlusIcon />}
        type="primary"
      >
        <span className="!hidden md:!inline">Penarikan</span>
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
        title={<Typography.Title level={4}>Penarikan</Typography.Title>}
      >
        <Form form={form} requiredMark layout="vertical" onFinish={onSubmit}>
          <Form.Item
            label="Jumlah"
            name="jumlah"
            className="w-full mb-2"
            rules={[
              { required: true, message: "Jumlah harus diisi" },
              noEmojiRule,
            ]}
          >
            <Input 
              placeholder="Jumlah" 
              maxLength={255} 
              onChange={createEmojiPreventionHandler()}
            />
          </Form.Item>
        </Form>
        <p className="text-gray-500">
          Biaya penarikan sebesar{" "}
          {apps?.data?.type?.toLocaleLowerCase() === "persentage"
            ? `${apps?.data.fee_per_withdrawal * 100}%`
            : `Rp. ${apps?.data.fee_per_withdrawal}`}
        </p>
      </Modal>
    </>
  );
}

export default AddWithdraw;
