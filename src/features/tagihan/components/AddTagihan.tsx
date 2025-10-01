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

function AddTagihan() {
  const modal = useDisclosure();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [typeId, setTypeId] = useState<null | number>(null);
  const router = useRouter();

  const queryClient = useQueryClient();
  const { siswaId } = router.query;

  const { data: types } = useQuery({
    queryKey: ["TYPES"],
    queryFn: async () => {
      const response = await TypeServices.get({
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
        select: true,
        page: 1,
      });
      return response;
    },
  });

  const onSubmit = async (val: any) => {
    try {
      setLoading(true);
      await TagihanService.create({
        ...val,
        jatuh_tempo: dayjs(val.jatuh_tempo).format("YYYY-MM-DD"),
        bulan: new Date(val.jatuh_tempo).getMonth(),
        siswa_id: siswaId,
      });
      queryClient.invalidateQueries({
        queryKey: ["BILLS"],
      });
      toast.success("Data berhasil dibuat");
      form.resetFields();
      setTypeId(null);
      modal.onClose();
    } catch (error) {
      errorResponse(error as AxiosError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (typeId) {
      const selectedType = types?.data.find((t) => t.id === typeId);
      if (selectedType) {
        form.setFieldValue("biaya", selectedType.biaya);
      }
    }
  }, [typeId]);

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
        }}
        okText="Tambah"
        okButtonProps={{
          onClick: form.submit,
        }}
        confirmLoading={loading}
        title={<Typography.Title level={4}>Tambah Tagihan</Typography.Title>}
      >
        <Form form={form} requiredMark layout="vertical" onFinish={onSubmit}>
          <Form.Item className="mb-2" label="Tipe">
            <Select
              value={typeId}
              onChange={(val) => {
                setTypeId(val);
              }}
              placeholder="Pilih Tipe"
              options={types?.data.map((t) => ({
                label: t.name,
                value: t.id,
              }))}
            />
          </Form.Item>
          <Form.Item
            label="Nama Tagihan"
            name="tagihan"
            className="w-full mb-2"
            rules={[{ required: true, message: "Nama harus diisi" }]}
          >
            <Input placeholder="Seragam, SPP" maxLength={255} />
          </Form.Item>

          <Form.Item
            label="Tanggal Jatuh Tempo"
            name="jatuh_tempo"
            className="w-full mb-2"
            rules={[
              { required: true, message: "Tanggal Jatuh Tempo harus diisi" },
            ]}
          >
            <DatePicker
              allowClear={false}
              format="DD/MM/YYYY"
              className="w-full"
            />
          </Form.Item>

          <Form.Item
            name="tahun_ajaran"
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
            label="Biaya"
            name="biaya"
            className="mb-2 w-full"
            rules={[{ required: true, message: "Biaya harus diisi" }]}
          >
            <Input prefix="Rp. " placeholder="Biaya" maxLength={255} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default AddTagihan;
