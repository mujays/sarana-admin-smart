import CurrencyInput from "@/components/currency-input";
import { useDisclosure } from "@/hooks/useDisclosure";
import { superAdminAuthService } from "@/services/auth/super-admin-auth.service";
import TagihanService from "@/services/tagihan";
import errorResponse from "@/utils/error-response";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Tooltip,
  Typography,
} from "antd";
import { AxiosError } from "axios";
import { EditIcon } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function EditTransaction({ transactionId }: { transactionId: number }) {
  const modal = useDisclosure();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const queryClient = useQueryClient();

  const { data: transaction, isLoading } = useQuery({
    queryKey: ["TRANSACTION", transactionId],
    enabled: modal.isOpen,
    queryFn: async () => {
      const response = await TagihanService.getOneTrx(transactionId);
      return response;
    },
  });

  const onSubmit = async (val: any) => {
    try {
      setLoading(true);
      await superAdminAuthService.editTransaction(transactionId, {
        ...val,
        catatan: val?.catatan || "-",
      });
      queryClient.invalidateQueries({
        queryKey: ["TRX"],
      });
      queryClient.invalidateQueries({
        queryKey: ["TRANSACTION", transactionId],
      });

      toast.success("Data berhasil diubah!");
      form.resetFields();
    } catch (error) {
      errorResponse(error as AxiosError);
    } finally {
      setLoading(false);
      modal.onClose();
    }
  };

  useEffect(() => {
    if (transaction && modal.isOpen) {
      form.setFieldValue("amount", transaction.data.buyer_payment.toString());
      form.setFieldValue("payment_method", transaction.data.payment_method);
      form.setFieldValue("status", transaction.data.status);
      form.setFieldValue("catatan", transaction.data.catatan);
    }
  }, [transaction, modal]);
  return (
    <Tooltip title="Edit Transaksi">
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
        title={<Typography.Title level={4}>Edit Transaksi</Typography.Title>}
      >
        <Form form={form} requiredMark layout="vertical" onFinish={onSubmit}>
          <Form.Item
            label="Amount"
            name="amount"
            className="w-full mb-2"
            rules={[{ required: true, message: "Amount harus diisi" }]}
          >
            <CurrencyInput className="w-full" />
          </Form.Item>

          <Form.Item
            label="Metode Pembayaran"
            name="payment_method"
            className="mb-2"
            rules={[
              { required: true, message: "Metode Pembayaran harus dipilih" },
            ]}
          >
            <Select
              placeholder="Metode Pembayaran"
              className="w-40"
              options={[
                {
                  label: "Cash",
                  value: "cash",
                },
                {
                  label: "Transfer",
                  value: "transfer",
                },
                {
                  label: "QRIS",
                  value: "qris",
                },
                {
                  label: "Virtual Account",
                  value: "virtual_account",
                },
                {
                  label: "Manual",
                  value: "manual",
                },
              ]}
            />
          </Form.Item>
          <Form.Item
            label="Status"
            name="status"
            className="mb-2"
            rules={[{ required: true, message: "Status harus dipilih" }]}
          >
            <Select
              placeholder="Status"
              className="w-40"
              options={[
                {
                  label: "Pending",
                  value: "pending",
                },
                {
                  label: "Berhasil",
                  value: "berhasil",
                },
                {
                  label: "Failed",
                  value: "failed",
                },
              ]}
            />
          </Form.Item>
          <div className="flex gap-2">
            <Form.Item label="Catatan" name="catatan" className="w-full mb-2">
              <Input.TextArea placeholder="Tulis catatan..." />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </Tooltip>
  );
}

export default EditTransaction;
