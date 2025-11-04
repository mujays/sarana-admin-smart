import { useDisclosure } from "@/hooks/useDisclosure";
import TagihanService from "@/services/tagihan";
import TahunAjaranService from "@/services/tahun-ajaran";
import TypeServices from "@/services/type";
import errorResponse from "@/utils/error-response";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Tooltip,
  Typography,
} from "antd";
import { AxiosError } from "axios";
import dayjs from "dayjs";
import { EditIcon } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  createEmojiPreventionHandler,
  noEmojiRule,
} from "@/utils/emoji-prevention";
import customParseFormat from "dayjs/plugin/customParseFormat";
import "dayjs/locale/id";
import { superAdminAuthService } from "@/services/auth/super-admin-auth.service";
import CurrencyInput from "@/components/currency-input";

dayjs.locale("id");
dayjs.extend(customParseFormat);

function EditTagihanAdmission({ tagihanId }: { tagihanId: number }) {
  const modal = useDisclosure();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const queryClient = useQueryClient();
  const { siswaId } = router.query;

  const { data: tagihan } = useQuery({
    queryKey: ["BILL_ADMISSION", tagihanId],
    enabled: modal.isOpen,
    queryFn: async () => {
      const response = await TagihanService.getOneAdmission(tagihanId);
      return response;
    },
  });

  const onSubmit = async (val: any) => {
    try {
      setLoading(true);
      await superAdminAuthService.editUangPangkal(tagihanId, {
        ...val,
        siswa_id: siswaId,
        keterangan: val?.keterangan || "-",
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

  useEffect(() => {
    if (tagihan) {
      form.setFieldValue("nominal", tagihan.data.nominal);
      form.setFieldValue("nominal_terbayar", tagihan.data.pembayaran_sudah);
      form.setFieldValue("keterangan", tagihan.data.keterangan);
    }
  }, [tagihan, modal.isOpen]);

  return (
    <Tooltip title="Edit">
      <Button
        onClick={() => modal.onOpen()}
        icon={<EditIcon className="w-4 h-4 text-orange-500" />}
        type="text"
      />

      <Modal
        open={modal.isOpen}
        maskClosable={false}
        onCancel={() => {
          modal.onClose();
          form.resetFields();
        }}
        okText="Edit"
        okButtonProps={{
          onClick: form.submit,
        }}
        confirmLoading={loading}
        title={<Typography.Title level={4}>Edit Tagihan</Typography.Title>}
      >
        <Form form={form} requiredMark layout="vertical" onFinish={onSubmit}>
          {/* <Form.Item
            label="Nama"
            name="nama"
            className="w-full mb-2"
            rules={[{ required: true, message: "Nama harus diisi" }]}
          >
            <Input placeholder="Tagihan" maxLength={255} />
          </Form.Item> */}

          <Form.Item
            label="Nominal Terbayar"
            name="nominal_terbayar"
            className="w-full mb-2"
            rules={[
              { required: true, message: "Nominal terbayar harus diisi" },
            ]}
          >
            <CurrencyInput className="w-full" />
          </Form.Item>

          <Form.Item
            label="Nominal Tagihan"
            name="nominal"
            className="w-full mb-2"
            rules={[{ required: true, message: "Nominal harus diisi" }]}
          >
            <CurrencyInput className="w-full" />
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
                  label: "Lunas",
                  value: "lunas",
                },
                {
                  label: "Belum Lunas",
                  value: "belum_lunas",
                },
              ]}
            />
          </Form.Item>
          <div className="flex gap-2">
            <Form.Item
              label="Catatan"
              name="keterangan"
              className="w-full mb-2"
              rules={[noEmojiRule]}
            >
              <Input.TextArea
                placeholder="Tulis catatan..."
                onChange={createEmojiPreventionHandler()}
              />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </Tooltip>
  );
}

export default EditTagihanAdmission;
