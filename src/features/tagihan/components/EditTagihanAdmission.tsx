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
import customParseFormat from "dayjs/plugin/customParseFormat";
import "dayjs/locale/id";

dayjs.locale("id");
dayjs.extend(customParseFormat);

function EditTagihanAdmission({ tagihanId }: { tagihanId: number }) {
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
      await TagihanService.updateAdmission(tagihanId, {
        ...val,
        tanggal_mulai: dayjs(val.periode[0]).format("YYYY-MM-DD"),
        tanggal_berakhir: dayjs(val.periode[1]).format("YYYY-MM-DD"),
        siswa_id: siswaId,
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
      form.setFieldValue("nama", tagihan.data.nama);
      form.setFieldValue("nominal", tagihan.data.nominal);
      form.setFieldValue("tahun_ajaran_id", tagihan.data.tahun_ajaran_id);
      const rangePeriode = [
        dayjs(tagihan.data.tanggal_mulai),
        dayjs(tagihan.data.tanggal_berakhir),
      ];
      form.setFieldValue("periode", rangePeriode);
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
          <Form.Item
            label="Nama"
            name="nama"
            className="w-full mb-2"
            rules={[{ required: true, message: "Nama harus diisi" }]}
          >
            <Input placeholder="Tagihan" maxLength={255} />
          </Form.Item>

          <Form.Item
            label="Periode"
            name="periode"
            className="w-full mb-2"
            rules={[{ required: true, message: "Periode harus diisi" }]}
          >
            <DatePicker.RangePicker
              picker="month"
              allowClear={false}
              format="MMMM YYYY"
              className="w-full"
            />
          </Form.Item>

          <Form.Item
            name="tahun_ajaran_id"
            label="Tahun Ajaran"
            rules={[{ required: true, message: "Tahun Ajaran harus diisi" }]}
            className="mb-2"
          >
            <Select
              placeholder="Pilih Tahun Ajaran"
              options={tahunAjaran?.data.map((ta) => ({
                label: ta.name,
                value: ta.id,
              }))}
            />
          </Form.Item>

          <Form.Item
            label="Nominal"
            name="nominal"
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

export default EditTagihanAdmission;
