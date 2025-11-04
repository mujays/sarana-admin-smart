import { useDisclosure } from "@/hooks/useDisclosure";
import SiswaServices from "@/services/siswa";
import WaliService from "@/services/wali";
import errorResponse from "@/utils/error-response";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Form, Input, Modal, Select, Tooltip, Typography } from "antd";
import { AxiosError } from "axios";
import { EditIcon } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { createEmojiPreventionHandler, noEmojiRule } from "@/utils/emoji-prevention";

function EditWali({ waliId }: { waliId: number }) {
  const modal = useDisclosure();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const queryClient = useQueryClient();

  const { data: wali, isLoading } = useQuery({
    queryKey: ["WALI", waliId],
    enabled: modal.isOpen,
    queryFn: async () => {
      const response = await WaliService.getOne(waliId);
      return response;
    },
  });

  const { data: students } = useQuery({
    queryKey: ["STUDENTS"],
    queryFn: async () => {
      const response = await SiswaServices.get({
        page_size: 1000000,
        page: 1,
      });
      return response;
    },
    select(data) {
      return data.data.map((siswa, index) => ({
        label: siswa.nama,
        value: `${siswa.id}-${siswa.nama}`,
      }));
    },
  });

  const onSubmit = async (val: any) => {
    try {
      setLoading(true);
      await WaliService.update(waliId, {
        ...val,
        siswa: val.siswa?.map((val: any) => val.split("-")[0]),
      });
      queryClient.invalidateQueries({
        queryKey: ["WALI", waliId],
      });
      queryClient.invalidateQueries({
        queryKey: ["WALIES"],
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
    if (wali) {
      form.setFieldValue("nama", wali.data.nama);
      form.setFieldValue("email", wali.data.email);
      form.setFieldValue("password", wali.data.password);
      form.setFieldValue("hubungan", wali.data.hubungan);
      form.setFieldValue("pekerjaan", wali.data.pekerjaan);
      form.setFieldValue("gaji", wali.data.gaji);
      form.setFieldValue("no_hp", wali.data.no_hp);

      if (wali.data.siswa?.length) {
        form.setFieldValue(
          "siswa",
          wali.data.siswa.map((s) => `${s.id}-${s.nama}`),
        );
      }
    }
  }, [wali, modal]);

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
        okText="Edit"
        okButtonProps={{
          onClick: form.submit,
        }}
        confirmLoading={loading}
        title={<Typography.Title level={4}>Edit Wali</Typography.Title>}
      >
        <Form form={form} requiredMark layout="vertical" onFinish={onSubmit}>
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
          <div className="flex gap-2">
            <Form.Item
              label="Email"
              name="email"
              className="w-full mb-2"
              rules={[{ required: true, message: "Email harus diisi" }, {}]}
            >
              <Input placeholder="Email" maxLength={255} />
            </Form.Item>
          </div>
          <Form.Item
            label="Hubungan"
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
            <Form.Item
              label="Gaji"
              name="gaji"
              className="mb-2 w-full"
              rules={[{ required: true, message: "Gaji harus diisi" }]}
            >
              <Input prefix="Rp. " placeholder="Gaji" maxLength={255} />
            </Form.Item>
          </div>

          <Form.Item
            label="Nomor Telepon"
            name="no_hp"
            className="mb-2"
            rules={[{ required: true, message: "Nomor Telepon harus diisi" }]}
          >
            <Input placeholder="Nomor Telepon" maxLength={255} />
          </Form.Item>

          <Form.Item label="Siswa" name="siswa" className="mb-2">
            <Select
              mode="multiple"
              placeholder="Pilih Siswa"
              options={students}
            />
          </Form.Item>
        </Form>
      </Modal>
    </Tooltip>
  );
}

export default EditWali;
