import { useDisclosure } from "@/hooks/useDisclosure";
import KeluargaServices from "@/services/keluarga";
import errorResponse from "@/utils/error-response";
import { useQueryClient } from "@tanstack/react-query";
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
import {
  createEmojiPreventionHandler,
  noEmojiRule,
} from "@/utils/emoji-prevention";
import { toast } from "sonner";
import useListKeluarga from "../hooks/useListKeluarga";

function AddKeluarga() {
  const modal = useDisclosure();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [hubunganValue, setHubunganValue] = useState("");
  const router = useRouter();

  const queryClient = useQueryClient();

  const { families } = useListKeluarga({
    limit: 20,
    page: 1,
    search: "",
  });

  const onSubmit = async (val: any) => {
    try {
      setLoading(true);
      await KeluargaServices.create({
        ...val,
        tanggal_lahir: dayjs(val?.tanggal_lahir).format("YYYY-MM-DD"),
        siswa_id: router.query.siswaId,
        hubungan: val?.hubungan || hubunganValue,
      });
      queryClient.invalidateQueries({
        queryKey: ["FAMILIES", router.query.siswaId],
      });
      toast.success("Keluarga berhasil dibuat");
      form.resetFields();
      setHubunganValue("");
    } catch (error) {
      errorResponse(error as AxiosError);
    } finally {
      setLoading(false);
      modal.onClose();
    }
  };

  return (
    <>
      <Button onClick={() => modal.onOpen()} icon={<PlusIcon />} type="primary">
        <span className="!hidden md:!inline">Tambah Keluarga</span>
      </Button>
      <Modal
        open={modal.isOpen}
        maskClosable={false}
        onCancel={() => {
          modal.onClose();
          form.resetFields();
          setHubunganValue("");
        }}
        okText="Tambah"
        okButtonProps={{
          onClick: form.submit,
          disabled: !hubunganValue,
        }}
        confirmLoading={loading}
        title={<Typography.Title level={4}>Tambah Keluarga</Typography.Title>}
      >
        <Form form={form} requiredMark layout="vertical" onFinish={onSubmit}>
          <div className="flex gap-2">
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
                placeholder="Nama"
                maxLength={255}
                onChange={createEmojiPreventionHandler()}
              />
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
              ].filter(
                (opt) => !families?.data.some((f) => f.hubungan === opt.value),
              )}
            />
          </div>
          {hubunganValue === "Lainnya" && (
            <Form.Item
              label="Hubungan Lainnya"
              name="hubungan"
              className="w-full mb-2"
              rules={[
                { required: true, message: "Hubungan harus diisi" },
                noEmojiRule,
              ]}
            >
              <Input
                placeholder="Hubungan"
                maxLength={255}
                onChange={createEmojiPreventionHandler()}
              />
            </Form.Item>
          )}

          <div className="flex gap-2">
            <Form.Item
              label="Pekerjaan"
              name="pekerjaan"
              className="mb-2 w-full"
              rules={[
                { required: true, message: "Pekerjaan harus diisi" },
                noEmojiRule,
              ]}
            >
              <Input
                placeholder="Pekerjaan"
                maxLength={255}
                onChange={createEmojiPreventionHandler()}
              />
            </Form.Item>
            <Form.Item label="Gaji" name="gaji" className="mb-2 w-full">
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
            rules={[
              { required: true, message: "Pendidikan harus diisi" },
              noEmojiRule,
            ]}
          >
            <Input
              placeholder="Pendidikan"
              maxLength={255}
              onChange={createEmojiPreventionHandler()}
            />
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
              rules={[
                { required: true, message: "Agama harus diisi" },
                noEmojiRule,
              ]}
            >
              <Input
                placeholder="Agama"
                maxLength={255}
                onChange={createEmojiPreventionHandler()}
              />
            </Form.Item>
            <Form.Item
              label="Suku"
              name="suku"
              className="mb-2 w-full"
              rules={[noEmojiRule]}
            >
              <Input
                placeholder="Suku"
                maxLength={255}
                onChange={createEmojiPreventionHandler()}
              />
            </Form.Item>
          </div>
          <Form.Item
            label="Alamat"
            name="alamat"
            className="mb-2"
            rules={[
              { required: true, message: "Alamat harus diisi" },
              noEmojiRule,
            ]}
          >
            <Input.TextArea
              placeholder="Alamat"
              maxLength={255}
              onChange={createEmojiPreventionHandler()}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default AddKeluarga;
