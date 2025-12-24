import { Modal, Form, Input, Select, DatePicker } from "antd";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AkademikService from "@/services/akademik";
import TahunAjaranService from "@/services/tahun-ajaran";
import dayjs from "dayjs";
import { SemesterDto, TSemester } from "@/services/akademik/akademik.type";
import { useEffect } from "react";
import { toast } from "sonner";
import { Switch } from "antd/lib";

interface EditSemesterProps {
  open: boolean;
  onClose: () => void;
  semesterId: number | null;
}

const { Option } = Select;

export const EditSemester = ({
  open,
  onClose,
  semesterId,
}: EditSemesterProps) => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  // Get semester detail
  const { data: semesterDetail, isLoading: isLoadingSemester } = useQuery({
    queryKey: ["SEMESTER_DETAIL", semesterId],
    queryFn: async () => {
      if (semesterId) {
        const response = await AkademikService.getOneSemester(semesterId);
        return response.data;
      }
      return null;
    },
    enabled: !!semesterId && open,
  });

  // Get tahun ajaran list
  const { data: tahunAjaranList, isLoading: isLoadingTahunAjaran } = useQuery({
    queryKey: ["LIST_TAHUN_AJARAN"],
    queryFn: async () => {
      const response = await TahunAjaranService.get();
      return response;
    },
  });

  const { mutate: updateSemester, isPending } = useMutation({
    mutationFn: async (values: SemesterDto) => {
      if (semesterId) {
        const response = await AkademikService.updateSemester(
          semesterId,
          values,
        );
        return response;
      }
      throw new Error("Semester ID tidak ditemukan");
    },
    onSuccess: () => {
      toast.success("Semester berhasil diperbarui!");
      queryClient.invalidateQueries({ queryKey: ["LIST_SEMESTER"] });
      queryClient.invalidateQueries({
        queryKey: ["SEMESTER_DETAIL", semesterId],
      });
      form.resetFields();
      onClose();
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Gagal memperbarui semester!",
      );
    },
  });

  // Fill form when semester detail is loaded
  useEffect(() => {
    if (semesterDetail && open) {
      form.setFieldsValue({
        nama: semesterDetail.nama,
        nomor: semesterDetail.nomor,
        tahun_ajaran_id: semesterDetail.tahun_ajaran_id,
        tanggal_mulai: dayjs(semesterDetail.tanggal_mulai),
        tanggal_akhir: dayjs(semesterDetail.tanggal_akhir),
        is_active: semesterDetail.is_active,
      });
    }
  }, [semesterDetail, form, open]);

  const handleSubmit = (values: any) => {
    const payload: SemesterDto = {
      nama: values.nama,
      nomor: values.nomor,
      tahun_ajaran_id: values.tahun_ajaran_id,
      is_active: values.is_active,
      tanggal_mulai: values.tanggal_mulai.format("YYYY-MM-DD"),
      tanggal_akhir: values.tanggal_akhir.format("YYYY-MM-DD"),
    };
    updateSemester(payload);
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title="Edit Semester"
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
        disabled={isPending || isLoadingSemester}
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
          className="!mb-2"
          label="Nomor Semester"
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
