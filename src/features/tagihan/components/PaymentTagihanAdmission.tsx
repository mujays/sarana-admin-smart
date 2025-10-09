import { useDisclosure } from "@/hooks/useDisclosure";
import TagihanService from "@/services/tagihan";
import TahunAjaranService from "@/services/tahun-ajaran";
import TypeServices from "@/services/type";
import errorResponse from "@/utils/error-response";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Form, InputNumber, Modal, Tooltip, Typography } from "antd";
import { AxiosError } from "axios";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "sonner";
import customParseFormat from "dayjs/plugin/customParseFormat";
import "dayjs/locale/id";
import { HandCoinsIcon } from "lucide-react";

dayjs.locale("id");
dayjs.extend(customParseFormat);

function PaymentTagihanAdmission({ tagihanId }: { tagihanId: number }) {
  const modal = useDisclosure();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const queryClient = useQueryClient();
  const { siswaId } = router.query;

  const { data: types } = useQuery({
    queryKey: ["TYPES_ADMISSION"],
    queryFn: async () => {
      const response = await TypeServices.getAdmissionType({
        page_size: 1000000,
        page: 1,
      });
      return response;
    },
  });

  const { data: tahunAjaran } = useQuery({
    queryKey: ["ACADEMIC"],
    queryFn: async () => {
      const response = await TahunAjaranService.get({
        page_size: 1000000,
        page: 1,
      });
      return response;
    },
  });

  const onSubmit = async (val: any) => {
    try {
      setLoading(true);
      await TagihanService.createTrxAdmission({
        ...val,
        uang_pangkal_id: tagihanId,
      });
      queryClient.invalidateQueries({
        queryKey: ["BILLS_ADMISSION"],
      });
      queryClient.invalidateQueries({
        queryKey: ["BILL_ADMISSION", tagihanId],
      });
      toast.success("Data berhasil dibuat");
      form.resetFields();
      modal.onClose();
    } catch (error) {
      errorResponse(error as AxiosError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Tooltip title="Bayar Tagihan">
      <Button
        onClick={() => modal.onOpen()}
        icon={<HandCoinsIcon className="w-4 h-4 text-blue-500" />}
        type="text"
      />

      <Modal
        open={modal.isOpen}
        maskClosable={false}
        onCancel={() => {
          modal.onClose();
          form.resetFields();
        }}
        okText="Bayar"
        okButtonProps={{
          onClick: form.submit,
        }}
        confirmLoading={loading}
        title={<Typography.Title level={4}>Bayar Tagihan</Typography.Title>}
      >
        <Form form={form} requiredMark layout="vertical" onFinish={onSubmit}>
          <Form.Item
            label="Nominal"
            name="payment_amount"
            className="mb-2 w-full"
            rules={[{ required: true, message: "Nominal harus diisi" }]}
          >
            <InputNumber
              prefix="Rp. "
              placeholder="Nominal"
              className="w-full"
              step={100000}
              min={0}
            />
          </Form.Item>
        </Form>
      </Modal>
    </Tooltip>
  );
}

export default PaymentTagihanAdmission;
