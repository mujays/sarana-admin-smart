import { useDisclosure } from "@/hooks/useDisclosure";
import TagihanService from "@/services/tagihan";
import TahunAjaranService from "@/services/tahun-ajaran";
import TypeServices from "@/services/type";
import { TTypeAdmission } from "@/services/type/type.type";
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
  Typography,
} from "antd";
import { AxiosError } from "axios";
import dayjs from "dayjs";
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  createEmojiPreventionHandler,
  noEmojiRule,
} from "@/utils/emoji-prevention";
import customParseFormat from "dayjs/plugin/customParseFormat";
import "dayjs/locale/id";

dayjs.locale("id");
dayjs.extend(customParseFormat);

function AddTagihanAdmission() {
  const modal = useDisclosure();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState<null | TTypeAdmission>(null);
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
      await TagihanService.createAdmission({
        ...val,
        tanggal_mulai: dayjs(val.periode[0]).format("YYYY-MM-DD"),
        tanggal_berakhir: dayjs(val.periode[1]).format("YYYY-MM-DD"),
        siswa_id: siswaId,
      });
      queryClient.invalidateQueries({
        queryKey: ["BILLS_ADMISSION"],
      });
      toast.success("Data berhasil dibuat");
      form.resetFields();
      setType(null);
      modal.onClose();
    } catch (error) {
      errorResponse(error as AxiosError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (type) {
      form.setFieldValue("nama", type.nama);
      form.setFieldValue("nominal", type.nominal);
      if (type.periode) {
        const [start, end] = type.periode.split(",");

        const currentYear = dayjs().year();

        const defaultRange = [
          dayjs(`${currentYear}-${start}`, "YYYY-MM-DD"),
          dayjs(`${currentYear + 1}-${end}`, "YYYY-MM-DD"),
        ];
        form.setFieldValue("periode", defaultRange);
      }
    }
  }, [type]);

  return (
    <>
      <Button onClick={() => modal.onOpen()} icon={<PlusIcon />} type="primary">
        <span className="!hidden md:!inline">Tambah Tagihan</span>
      </Button>
      <Modal
        open={modal.isOpen}
        maskClosable={false}
        onCancel={() => {
          modal.onClose();
          form.resetFields();
          setType(null);
        }}
        okText="Tambah"
        okButtonProps={{
          onClick: form.submit,
          disabled: !type,
        }}
        confirmLoading={loading}
        title={<Typography.Title level={4}>Tambah Tagihan</Typography.Title>}
      >
        <Form form={form} requiredMark layout="vertical" onFinish={onSubmit}>
          <Form.Item className="mb-2" label="Tipe">
            <Select
              value={type?.id}
              onChange={(val) => {
                const selectedType = types?.data.find((t) => t.id === val);
                if (selectedType) {
                  setType(selectedType);
                }
              }}
              placeholder="Pilih Tipe"
              options={types?.data.map((t) => ({
                label: t.nama,
                value: t.id,
              }))}
            />
          </Form.Item>
          <Form.Item
            label="Nama"
            name="nama"
            className="w-full mb-2"
            rules={[
              { required: true, message: "Nama harus diisi" },
              noEmojiRule,
            ]}
          >
            <Input
              disabled={!type}
              placeholder="Tagihan"
              maxLength={255}
              onChange={createEmojiPreventionHandler()}
            />
          </Form.Item>

          <Form.Item
            label="Periode"
            name="periode"
            className="w-full mb-2"
            rules={[{ required: true, message: "Periode harus diisi" }]}
          >
            <DatePicker.RangePicker
              picker="month"
              disabled={!type}
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
              disabled={!type}
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
              disabled={!type}
              prefix="Rp. "
              placeholder="Nominal"
              className="w-full"
              step={100000}
              min={0}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default AddTagihanAdmission;
