import { useDisclosure } from "@/hooks/useDisclosure";
import KelasServices from "@/services/kelas";
import TypeServices from "@/services/type";
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
import dayjs from "dayjs";
import { EditIcon } from "lucide-react";
import { useEffect, useState } from "react";
import customParseFormat from "dayjs/plugin/customParseFormat";
import "dayjs/locale/id";
import { toast } from "sonner";

dayjs.locale("id");
dayjs.extend(customParseFormat);

const monthOptions = Array.from({ length: 12 }, (_, i) => {
  const monthNumber = String(i + 1).padStart(2, "0");
  const monthLabel = dayjs(`${monthNumber}-01`, "MM-DD").format("MMMM");
  return {
    label: monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1),
    value: monthNumber,
  };
});

function EditTypeAdmission({ typeId }: { typeId: number }) {
  const modal = useDisclosure();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const queryClient = useQueryClient();

  const { data: kelas } = useQuery({
    queryKey: ["CLASSES"],
    queryFn: async () => {
      const response = await KelasServices.get({
        select: true,
        page: 1,
      });
      return response;
    },
  });

  const { data: type, isLoading } = useQuery({
    queryKey: ["TYPE_ADMISSION", typeId],
    enabled: modal.isOpen,
    queryFn: async () => {
      const response = await TypeServices.getOneAdmissionType(typeId);
      return response;
    },
  });

  const onSubmit = async (val: any) => {
    try {
      setLoading(true);
      const currentYear = dayjs().year();
      const startDate = dayjs(
        `${currentYear}-${val?.startDate}-01`,
        "YYYY-MM-DD",
      )
        .startOf("month")
        .format("MM-DD");
      const endDate = dayjs(`${currentYear}-${val?.endDate}-01`, "YYYY-MM-DD")
        .endOf("month")
        .format("MM-DD");

      await TypeServices.updateAdmissionType(typeId, {
        ...val,
        periode: `${startDate},${endDate}`,
        jatuh_tempo: endDate,
      });
      queryClient.invalidateQueries({
        queryKey: ["TYPES_ADMISSION"],
      });
      toast.success("Data berhasil diperbarui");
      queryClient.invalidateQueries({
        queryKey: ["TYPE_ADMISSION", typeId],
      });
      form.resetFields();
      modal.onClose();
    } catch (error) {
      errorResponse(error as AxiosError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (type) {
      form.setFieldValue("nama", type.data.nama);
      form.setFieldValue("biaya", type.data.nominal);
      form.setFieldValue("cicilan", type.data.cicilan);
      form.setFieldValue("kelas_id", type.data.kelas_id);
      form.setFieldValue("nominal", type.data.nominal);
      if (type.data.periode) {
        const [start, end] = type.data.periode.split(",");

        form.setFieldValue("startDate", start.split("-")[0]);
        form.setFieldValue("endDate", end.split("-")[0]);
      }
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
            name="nama"
            className="w-full mb-2"
            rules={[{ required: true, message: "Nama harus diisi" }]}
          >
            <Input placeholder="Nama" maxLength={255} />
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
            label="Jumlah Pembayaran / Cicilan"
            name="cicilan"
            className="w-full mb-2"
            rules={[
              { required: true, message: "Jumlah Pembayaran harus diisi" },
            ]}
          >
            <InputNumber
              className="w-full"
              min={1}
              type="number"
              placeholder="0"
            />
          </Form.Item>

          <div className="flex gap-2">
            <Form.Item
              label="Dari Bulan"
              name="startDate"
              className="w-full mb-2"
              rules={[{ required: true, message: "Bulan awal harus diisi" }]}
            >
              <Select placeholder="Pilih Bulan" options={monthOptions} />
            </Form.Item>
            <Form.Item
              label="Ke Bulan"
              name="endDate"
              className="w-full mb-2"
              rules={[{ required: true, message: "Bulan akhir harus diisi" }]}
            >
              <Select placeholder="Pilih Bulan" options={monthOptions} />
            </Form.Item>
          </div>

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

export default EditTypeAdmission;
