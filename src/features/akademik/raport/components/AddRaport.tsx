import { useState } from "react";
import {
  Modal,
  Form,
  Select,
  InputNumber,
  Input,
  Button,
  Space,
  Card,
  Row,
  Col,
  Typography,
  Divider,
  message,
  Popconfirm,
} from "antd";
import {
  PlusOutlined,
  MinusCircleOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";
import AkademikService from "@/services/akademik";
import { RaportDto, TMataPelajaran } from "@/services/akademik/akademik.type";

const { Option } = Select;
const { TextArea } = Input;
const { Text } = Typography;

interface AddRaportProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  siswaId: number;
  semesterId: number;
  availableMapel?: TMataPelajaran[];
  isLoadingMapel?: boolean;
  kelasId: number;
  isPage?: boolean; // New prop to determine if it's used in a page or modal
}

interface RaportFormItem {
  mata_pelajaran_id: number;
  nilai_angka: number;
  catatan: string;
  key: number;
}

function AddRaport({
  visible,
  onCancel,
  onSuccess,
  siswaId,
  semesterId,
  availableMapel = [],
  isLoadingMapel = false,
  isPage = false,
  kelasId,
}: AddRaportProps) {
  const [form] = Form.useForm();
  const [raportItems, setRaportItems] = useState<RaportFormItem[]>([
    { mata_pelajaran_id: 0, nilai_angka: 0, catatan: "", key: Date.now() },
  ]);

  // Create raport mutation
  const { mutate: createRaport, isPending: isCreating } = useMutation({
    mutationFn: async (values: { raportItems: RaportFormItem[] }) => {
      const payload: RaportDto = {
        nilai: values.raportItems.map((item) => ({
          catatan: item.catatan,
          kelas_id: kelasId,
          mata_pelajaran_id: item.mata_pelajaran_id,
          nilai_angka: item.nilai_angka,
          semester_id: semesterId,
          siswa_id: siswaId,
        })),
      };

      return await AkademikService.createRaport(payload);
    },
    onSuccess: () => {
      message.success("Nilai berhasil ditambahkan!");
      form.resetFields();
      setRaportItems([
        { mata_pelajaran_id: 0, nilai_angka: 0, catatan: "", key: Date.now() },
      ]);
      onSuccess();
    },
    onError: (error: any) => {
      message.error(error?.response?.data?.message || "Gagal menambah nilai!");
    },
  });

  const handleAddItem = () => {
    setRaportItems([
      ...raportItems,
      { mata_pelajaran_id: 0, nilai_angka: 0, catatan: "", key: Date.now() },
    ]);
  };

  const handleRemoveItem = (key: number) => {
    if (raportItems.length > 1) {
      setRaportItems(raportItems.filter((item) => item.key !== key));
    }
  };

  const handleItemChange = (key: number, field: string, value: any) => {
    setRaportItems(
      raportItems.map((item) =>
        item.key === key ? { ...item, [field]: value } : item,
      ),
    );
  };

  const handleSubmit = () => {
    // Validate all items
    const isValid = raportItems.every(
      (item) => item.mata_pelajaran_id > 0 && item.nilai_angka >= 0,
    );

    if (!isValid) {
      message.error("Mohon lengkapi semua field yang diperlukan!");
      return;
    }

    // Check for duplicate mata pelajaran
    const mapelIds = raportItems.map((item) => item.mata_pelajaran_id);
    const hasDuplicate = mapelIds.some(
      (id, index) => mapelIds.indexOf(id) !== index,
    );

    if (hasDuplicate) {
      message.error("Mata pelajaran tidak boleh duplikat!");
      return;
    }

    createRaport({ raportItems });
  };

  const handleCancel = () => {
    form.resetFields();
    setRaportItems([
      { mata_pelajaran_id: 0, nilai_angka: 0, catatan: "", key: Date.now() },
    ]);
    if (!isPage) {
      onCancel();
    }
  };

  const getUsedMapelIds = () => {
    return raportItems
      .map((item) => item.mata_pelajaran_id)
      .filter((id) => id > 0);
  };

  // If it's used in a page, render without modal wrapper
  if (isPage) {
    return (
      <Card className="shadow-sm">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Text type="secondary">
              Tambahkan satu atau lebih nilai untuk siswa ini
            </Text>
            <Button
              type="dashed"
              icon={<PlusOutlined />}
              onClick={handleAddItem}
              disabled={raportItems.length >= availableMapel.length}
            >
              Tambah Item
            </Button>
          </div>

          <Divider />

          <div className="space-y-4 max-h-96 overflow-y-auto">
            {raportItems.map((item, index) => (
              <Card
                key={item.key}
                size="small"
                className="shadow-sm"
                title={
                  <div className="flex justify-between items-center">
                    <span>Nilai #{index + 1}</span>
                    {raportItems.length > 1 && (
                      <Popconfirm
                        title="Hapus item ini?"
                        onConfirm={() => handleRemoveItem(item.key)}
                        okText="Ya"
                        cancelText="Tidak"
                      >
                        <Button
                          type="link"
                          danger
                          icon={<MinusCircleOutlined />}
                          size="small"
                        >
                          Hapus
                        </Button>
                      </Popconfirm>
                    )}
                  </div>
                }
              >
                <div className="flex gap-3">
                  <div className="space-y-1 flex-1">
                    <Text className="text-sm font-medium">
                      Mata Pelajaran *
                    </Text>
                    <Select
                      value={item.mata_pelajaran_id || undefined}
                      onChange={(value) =>
                        handleItemChange(item.key, "mata_pelajaran_id", value)
                      }
                      placeholder="Pilih mata pelajaran"
                      loading={isLoadingMapel}
                      style={{ width: "100%" }}
                    >
                      {availableMapel
                        .filter(
                          (mapel) =>
                            !getUsedMapelIds().includes(mapel.id) ||
                            mapel.id === item.mata_pelajaran_id,
                        )
                        .map((mapel) => (
                          <Option key={mapel.id} value={mapel.id}>
                            {mapel.nama} ({mapel.kode})
                          </Option>
                        ))}
                    </Select>
                  </div>

                  <div className="space-y-1 flex-1">
                    <Text className="text-sm font-medium">Nilai Angka *</Text>
                    <InputNumber
                      min={0}
                      max={100}
                      value={item.nilai_angka}
                      onChange={(value) =>
                        handleItemChange(item.key, "nilai_angka", value || 0)
                      }
                      placeholder="0-100"
                      style={{ width: "100%" }}
                    />
                  </div>
                </div>
                <div className="space-y-1 mt-3">
                  <Text className="text-sm font-medium">Catatan</Text>
                  <TextArea
                    value={item.catatan}
                    onChange={(e) =>
                      handleItemChange(item.key, "catatan", e.target.value)
                    }
                    placeholder="Catatan untuk siswa..."
                    rows={2}
                  />
                </div>
              </Card>
            ))}
          </div>

          <Divider />

          <div className="flex justify-end">
            <Space>
              <Button
                type="primary"
                onClick={handleSubmit}
                loading={isCreating}
                icon={<SaveOutlined />}
                size="large"
              >
                Simpan Semua ({raportItems.length} Item)
              </Button>
            </Space>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Modal
      title="Tambah Nilai Raport"
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={800}
      className="add-raport-modal"
    >
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Text type="secondary">
            Tambahkan satu atau lebih nilai untuk siswa ini
          </Text>
          <Button
            type="dashed"
            icon={<PlusOutlined />}
            onClick={handleAddItem}
            disabled={raportItems.length >= availableMapel.length}
          >
            Tambah Item
          </Button>
        </div>

        <Divider />

        <div className="space-y-4 max-h-96 overflow-y-auto">
          {raportItems.map((item, index) => (
            <Card
              key={item.key}
              size="small"
              className="shadow-sm"
              title={
                <div className="flex justify-between items-center">
                  <span>Nilai #{index + 1}</span>
                  {raportItems.length > 1 && (
                    <Popconfirm
                      title="Hapus item ini?"
                      onConfirm={() => handleRemoveItem(item.key)}
                      okText="Ya"
                      cancelText="Tidak"
                    >
                      <Button
                        type="link"
                        danger
                        icon={<MinusCircleOutlined />}
                        size="small"
                      >
                        Hapus
                      </Button>
                    </Popconfirm>
                  )}
                </div>
              }
            >
              <Row gutter={16}>
                <Col xs={24} sm={8}>
                  <div className="space-y-1">
                    <Text className="text-sm font-medium">
                      Mata Pelajaran *
                    </Text>
                    <Select
                      value={item.mata_pelajaran_id || undefined}
                      onChange={(value) =>
                        handleItemChange(item.key, "mata_pelajaran_id", value)
                      }
                      placeholder="Pilih mata pelajaran"
                      loading={isLoadingMapel}
                      style={{ width: "100%" }}
                    >
                      {availableMapel
                        .filter(
                          (mapel) =>
                            !getUsedMapelIds().includes(mapel.id) ||
                            mapel.id === item.mata_pelajaran_id,
                        )
                        .map((mapel) => (
                          <Option key={mapel.id} value={mapel.id}>
                            {mapel.nama} ({mapel.kode})
                          </Option>
                        ))}
                    </Select>
                  </div>
                </Col>

                <Col xs={24} sm={6}>
                  <div className="space-y-1">
                    <Text className="text-sm font-medium">Nilai Angka *</Text>
                    <InputNumber
                      min={0}
                      max={100}
                      value={item.nilai_angka}
                      onChange={(value) =>
                        handleItemChange(item.key, "nilai_angka", value || 0)
                      }
                      placeholder="0-100"
                      style={{ width: "100%" }}
                    />
                  </div>
                </Col>

                <Col xs={24} sm={10}>
                  <div className="space-y-1">
                    <Text className="text-sm font-medium">Catatan</Text>
                    <TextArea
                      value={item.catatan}
                      onChange={(e) =>
                        handleItemChange(item.key, "catatan", e.target.value)
                      }
                      placeholder="Catatan untuk siswa..."
                      rows={2}
                    />
                  </div>
                </Col>
              </Row>
            </Card>
          ))}
        </div>

        <Divider />

        <div className="flex justify-end">
          <Space>
            <Button onClick={handleCancel}>Batal</Button>
            <Button
              type="primary"
              onClick={handleSubmit}
              loading={isCreating}
              icon={<SaveOutlined />}
            >
              Simpan Semua ({raportItems.length} Item)
            </Button>
          </Space>
        </div>
      </div>
    </Modal>
  );
}

export default AddRaport;
