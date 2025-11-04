import { useDisclosure } from "@/hooks/useDisclosure";
import KeluargaServices from "@/services/keluarga";
import errorResponse from "@/utils/error-response";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  DatePicker,
  Form,
  Input,
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
import {
  createEmojiPreventionHandler,
  noEmojiRule,
} from "@/utils/emoji-prevention";
import { toast } from "sonner";

function EditKeluarga({ keluargaId }: { keluargaId: number }) {
  const modal = useDisclosure();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [hubunganValue, setHubunganValue] = useState("");
  const router = useRouter();

  const queryClient = useQueryClient();

  const { data: family, isLoading } = useQuery({
    queryKey: ["FAMILY", keluargaId],
    enabled: modal.isOpen,
    queryFn: async () => {
      const response = await KeluargaServices.getOne(keluargaId);
      return response;
    },
  });

  const onSubmit = async (val: any) => {
    try {
      setLoading(true);
      await KeluargaServices.update(keluargaId, {
        ...val,
        tanggal_lahir: dayjs(val?.tanggal_lahir).format("YYYY-MM-DD"),
        siswa_id: router.query.siswaId,
      });
      queryClient.invalidateQueries({
        queryKey: ["FAMILY", keluargaId],
      });
      queryClient.invalidateQueries({
        queryKey: ["FAMILIES"],
      });
      toast.success("Data berhasil diubah!");
      form.resetFields();
    } catch (error) {
      errorResponse(error as AxiosError);
    } finally {
      setLoading(false);
      modal.onClose();
    }
  };

  useEffect(() => {
    if (family) {
      form.setFieldValue("nama", family.data.nama);
      form.setFieldValue("tanggal_lahir", dayjs(family.data.tanggal_lahir));
      form.setFieldValue("hubungan", family.data.hubungan);
      if (!["Ayah", "Ibu", "Saudara"].includes(family.data.hubungan)) {
        setHubunganValue("Lainnya");
        form.setFieldValue("hubungan", family.data.hubungan);
      } else {
        setHubunganValue(family.data.hubungan);
      }
      form.setFieldValue("pekerjaan", family.data.pekerjaan);
      form.setFieldValue("pendidikan", family.data.pendidikan);
      form.setFieldValue("gaji", family.data.gaji);
      form.setFieldValue("no_hp", family.data.no_hp);
      form.setFieldValue("agama", family.data.agama);
      form.setFieldValue("suku", family.data.suku);
      form.setFieldValue("alamat", family.data.alamat);
      form.setFieldValue("nik", family.data.nik);
      form.setFieldValue("jenis_kelamin", family.data.jenis_kelamin);
    }
  }, [family, modal]);

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
        loading={isLoading}
        onCancel={() => {
          modal.onClose();
          form.resetFields();
        }}
        okText="Simpan"
        okButtonProps={{
          onClick: form.submit,
        }}
        confirmLoading={loading}
        title={<Typography.Title level={4}>Edit Keluarga</Typography.Title>}
      >
        <Form form={form} requiredMark layout="vertical" onFinish={onSubmit}>
          <div className="flex gap-2">
            <Form.Item
              label="Nama"
              name="nama"
              className="w-full mb-2"
              rules={[{ required: true, message: "Nama harus diisi" }]}
            >
              <Input placeholder="Nama" maxLength={255} />
            </Form.Item>
            <Form.Item
              name="tanggal_lahir"
              label="Tanggal Lahir"
              className="mb-2 w-full"
              rules={[{ required: true, message: "Tanggal lahir harus diisi" }]}
            >
              <DatePicker
                allowClear={false}
                format="DD/MM/YYYY"
                className="w-full"
              />
            </Form.Item>
          </div>
          <Form.Item
            label="NIK"
            name="nik"
            className="w-full !mb-2"
            rules={[{ required: true, message: "NIK harus diisi" }]}
          >
            <Input
              placeholder="NIK"
              maxLength={255}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                form.setFieldsValue({ nik: value });
              }}
            />
          </Form.Item>
          <Form.Item
            className="w-full !mb-2"
            label="Jenis Kelamin"
            name="jenis_kelamin"
            rules={[{ required: true, message: "Jenis Kelamin harus diisi" }]}
          >
            <Select
              placeholder="Pilih Jenis Kelamin"
              options={[
                {
                  label: "Laki-laki",
                  value: "Laki-laki",
                },
                {
                  label: "Perempuan",
                  value: "Perempuan",
                },
              ]}
            />
          </Form.Item>
          <div className="space-y-2 mb-2">
            <p>
              <span className="text-red-500">*</span> Hubungan
            </p>
            <Select
              placeholder="Pilih Hubungan"
              className="w-full"
              onChange={(val) => {
                setHubunganValue(val);
              }}
              value={hubunganValue || undefined}
              disabled
              options={[
                {
                  label: "Ayah",
                  value: "Ayah",
                },
                {
                  label: "Ibu",
                  value: "Ibu",
                },
                {
                  label: "Saudara",
                  value: "Saudara",
                },
                {
                  label: "Lainnya",
                  value: "Lainnya",
                },
              ]}
            />
          </div>
          {hubunganValue === "Lainnya" && (
            <Form.Item
              label="Hubungan Lainnya"
              name="hubungan"
              className="w-full mb-2"
              rules={[{ required: true, message: "Hubungan harus diisi" }]}
            >
              <Input placeholder="Hubungan" maxLength={255} />
            </Form.Item>
          )}

          <div className="flex gap-2">
            <Form.Item
              label="Pekerjaan"
              name="pekerjaan"
              className="mb-2 w-full"
              rules={[{ required: true, message: "Pekerjaan harus diisi" }]}
            >
              <Input placeholder="Pekerjaan" maxLength={255} />
            </Form.Item>
            <Form.Item
              label="Gaji"
              name="gaji"
              className="mb-2 w-full"
              rules={[{ required: true, message: "Gaji harus diisi" }]}
            >
              <Input
                prefix="Rp. "
                placeholder="Gaji"
                maxLength={255}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  form.setFieldsValue({ gaji: value });
                }}
              />
            </Form.Item>
          </div>
          <Form.Item
            label="Pendidikan"
            name="pendidikan"
            className="mb-2"
            rules={[{ required: true, message: "Pendidikan harus diisi" }]}
          >
            <Input placeholder="Pendidikan" maxLength={255} />
          </Form.Item>
          <Form.Item
            label="Nomor Telepon"
            name="no_hp"
            className="mb-2"
            rules={[{ required: true, message: "Nomor Telepon harus diisi" }]}
          >
            <Input placeholder="Nomor Telepon" maxLength={255} />
          </Form.Item>
          <div className="flex gap-2">
            <Form.Item
              label="Agama"
              name="agama"
              className="mb-2 w-full"
              rules={[{ required: true, message: "Agama harus diisi" }]}
            >
              <Input placeholder="Agama" maxLength={255} />
            </Form.Item>
            <Form.Item label="Suku" name="suku" className="mb-2 w-full">
              <Input placeholder="Suku" maxLength={255} />
            </Form.Item>
          </div>
          <Form.Item
            label="Alamat"
            name="alamat"
            className="mb-2"
            rules={[{ required: true, message: "Alamat harus diisi" }]}
          >
            <Input.TextArea placeholder="Alamat" maxLength={255} />
          </Form.Item>
        </Form>
      </Modal>
    </Tooltip>
  );
}

export default EditKeluarga;
