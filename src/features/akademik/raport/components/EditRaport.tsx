import { useEffect } from "react";
import {
  Modal,
  Form,
  InputNumber,
  Input,
  Button,
  Space,
  Typography,
  Row,
  Col,
  message,
} from "antd";
import { SaveOutlined } from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";
import AkademikService from "@/services/akademik";
import { TRaport } from "@/services/akademik/akademik.type";
import { toast } from "sonner";

const { TextArea } = Input;
const { Text, Title } = Typography;

interface EditRaportProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  raportData?: TRaport;
}

interface EditFormData {
  nilai_angka: number;
  catatan: string;
}

function EditRaport({
  visible,
  onCancel,
  onSuccess,
  raportData,
}: EditRaportProps) {
  const [form] = Form.useForm();

  // Update raport mutation
  const { mutate: updateRaport, isPending: isUpdating } = useMutation({
    mutationFn: async (values: EditFormData) => {
      if (!raportData?.id) throw new Error("Raport ID is required");
      return await AkademikService.updateRaport(raportData.id, values);
    },
    onSuccess: () => {
      toast.success("Nilai berhasil diperbarui!");
      form.resetFields();
      onSuccess();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Gagal memperbarui nilai!");
    },
  });

  // Set form values when raportData changes
  useEffect(() => {
    if (raportData && visible) {
      form.setFieldsValue({
        nilai_angka: raportData.nilai_angka,
        catatan: raportData.catatan || "",
      });
    }
  }, [raportData, visible, form]);

  const handleSubmit = (values: EditFormData) => {
    updateRaport(values);
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  const getGradeColor = (nilai: number) => {
    if (nilai >= 90) return "#52c41a"; // green
    if (nilai >= 80) return "#1890ff"; // blue
    if (nilai >= 70) return "#faad14"; // orange
    return "#f5222d"; // red
  };

  const getGradeLetter = (nilai: number) => {
    if (nilai >= 90) return "A";
    if (nilai >= 80) return "B";
    if (nilai >= 70) return "C";
    if (nilai >= 60) return "D";
    return "E";
  };

  const currentNilai = Form.useWatch("nilai_angka", form) || 0;

  return (
    <Modal
      title="Edit Nilai Raport"
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={600}
    >
      <div className="space-y-4">
        {raportData && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <Title level={5} className="!mb-2">
              {raportData.mata_pelajaran.nama}
            </Title>
            <Text type="secondary" className="text-sm">
              Kode: {raportData.mata_pelajaran.kode}
            </Text>
          </div>
        )}

        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="nilai_angka"
                label="Nilai Angka"
                rules={[
                  {
                    required: true,
                    message: "Nilai angka harus diisi!",
                  },
                  {
                    type: "number",
                    min: 0,
                    max: 100,
                    message: "Nilai harus antara 0-100!",
                  },
                ]}
              >
                <InputNumber
                  min={0}
                  max={100}
                  style={{ width: "100%" }}
                  placeholder="0-100"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <div className="space-y-1">
                <Text className="text-sm font-medium">Preview Grade</Text>
                <div
                  className="border rounded px-3 py-2 text-center"
                  style={{
                    borderColor: getGradeColor(currentNilai),
                    backgroundColor: `${getGradeColor(currentNilai)}10`,
                  }}
                >
                  <Text
                    strong
                    style={{ color: getGradeColor(currentNilai) }}
                    className="text-lg"
                  >
                    {currentNilai} ({getGradeLetter(currentNilai)})
                  </Text>
                </div>
              </div>
            </Col>
          </Row>

          <Form.Item name="catatan" label="Catatan">
            <TextArea
              rows={4}
              placeholder="Catatan untuk siswa..."
              showCount
              maxLength={500}
            />
          </Form.Item>

          <Form.Item className="mb-0 flex justify-end">
            <Space>
              <Button onClick={handleCancel}>Batal</Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={isUpdating}
                icon={<SaveOutlined />}
              >
                Simpan Perubahan
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
}

export default EditRaport;
