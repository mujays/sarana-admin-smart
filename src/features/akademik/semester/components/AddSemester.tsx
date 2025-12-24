import { Modal, Form, Input, Select, DatePicker, Switch } from "antd";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AkademikService from "@/services/akademik";
import TahunAjaranService from "@/services/tahun-ajaran";
import dayjs from "dayjs";
import { SemesterDto } from "@/services/akademik/akademik.type";
import { toast } from "sonner";

interface AddSemesterProps {
  open: boolean;
  onClose: () => void;
}

const { Option } = Select;

export const AddSemester = ({ open, onClose }: AddSemesterProps) => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  // Get tahun ajaran list
  const { data: tahunAjaranList, isLoading: isLoadingTahunAjaran } = useQuery({
    queryKey: ["LIST_TAHUN_AJARAN"],
    queryFn: async () => {
      const response = await TahunAjaranService.get();
      return response;
    },
  });

  const { mutate: createSemester, isPending } = useMutation({
    mutationFn: async (values: SemesterDto) => {
      const response = await AkademikService.createSemester(values);
      return response;
    },
    onSuccess: () => {
      toast.success("Semester berhasil ditambahkan!");
      queryClient.invalidateQueries({ queryKey: ["LIST_SEMESTER"] });
      form.resetFields();
      onClose();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Gagal menambah semester!");
    },
  });

  const handleSubmit = (values: any) => {
    const payload: SemesterDto = {
      nama: values.nama,
      is_active: values.is_active,
      nomor: values.nomor,
      tahun_ajaran_id: values.tahun_ajaran_id,
      tanggal_mulai: values.tanggal_mulai.format("YYYY-MM-DD"),
      tanggal_akhir: values.tanggal_akhir.format("YYYY-MM-DD"),
    };
    createSemester(payload);
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title="Tambah Semester"
      open={open}
      onCancel={handleCancel}
      onOk={() => form.submit()}
      confirmLoading={isPending}
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        disabled={isPending}
      >
        <Form.Item
          name="nama"
          label="Nama Semester"
          className="!mb-2"
          rules={[{ required: true, message: "Nama semester harus diisi!" }]}
        >
          <Input placeholder="Contoh: Semester Genap" />
        </Form.Item>

        <Form.Item
          name="nomor"
          label="Nomor Semester"
          className="!mb-2"
          rules={[{ required: true, message: "Nomor semester harus diisi!" }]}
        >
          <Select placeholder="Pilih nomor semester">
            <Option value={1}>1 (Ganjil)</Option>
            <Option value={2}>2 (Genap)</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="tahun_ajaran_id"
          label="Tahun Ajaran"
          className="!mb-2"
          rules={[{ required: true, message: "Tahun ajaran harus dipilih!" }]}
        >
          <Select
            placeholder="Pilih tahun ajaran"
            loading={isLoadingTahunAjaran}
          >
            {tahunAjaranList?.data?.map((tahunAjaran) => (
              <Option key={tahunAjaran.id} value={tahunAjaran.id}>
                {tahunAjaran.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="tanggal_mulai"
          label="Tanggal Mulai"
          className="!mb-2"
          rules={[{ required: true, message: "Tanggal mulai harus diisi!" }]}
        >
          <DatePicker
            style={{ width: "100%" }}
            placeholder="Pilih tanggal mulai"
            format="DD/MM/YYYY"
          />
        </Form.Item>

        <Form.Item
          name="tanggal_akhir"
          label="Tanggal Akhir"
          className="!mb-2"
          rules={[
            { required: true, message: "Tanggal akhir harus diisi!" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                const tanggalMulai = getFieldValue("tanggal_mulai");
                if (!value || !tanggalMulai) {
                  return Promise.resolve();
                }
                if (dayjs(value).isBefore(tanggalMulai)) {
                  return Promise.reject(
                    new Error("Tanggal akhir harus setelah tanggal mulai!"),
                  );
                }
                return Promise.resolve();
              },
            }),
          ]}
        >
          <DatePicker
            style={{ width: "100%" }}
            placeholder="Pilih tanggal akhir"
            format="DD/MM/YYYY"
          />
        </Form.Item>

        <Form.Item name="is_active" className="!mb-2" initialValue={true}>
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
};
