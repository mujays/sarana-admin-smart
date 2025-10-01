import { useDisclosure } from "@/hooks/useDisclosure";
import KelasServices from "@/services/kelas";
import TagihanService from "@/services/tagihan";
import TahunAjaranService from "@/services/tahun-ajaran";
import errorResponse from "@/utils/error-response";
import { useQuery } from "@tanstack/react-query";
import { Button, Form, Modal, Select, Typography } from "antd";
import { AxiosError } from "axios";
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "sonner";

function GenerateTagihan() {
  const modal = useDisclosure();
  const [form] = Form.useForm();
  const tagihanType = Form.useWatch("type", form);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const paths = router.pathname.split("/");
  const type = paths[1];

  const { data: kelas } = useQuery({
    queryKey: ["CLASSES"],
    queryFn: async () => {
      const response = await KelasServices.get({
        select: true,
        page: 1,
        type,
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
      if (tagihanType === "spp") {
        await TagihanService.generateTagihan({
          idKelas: val.kelas_id,
          tahunAjaran: val.tahun_ajaran,
          type: val.jenis,
        });
      } else {
        await TagihanService.generateUangPangkal({
          idKelas: val.kelas_id,
          tahunAjaran: val.tahun_ajaran,
        });
      }

      toast.success("Data berhasil digenerate");
      form.resetFields();
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
        <span className="!hidden md:!inline">Generate Tagihan</span>
      </Button>
      <Modal
        open={modal.isOpen}
        maskClosable={false}
        onCancel={() => {
          modal.onClose();
          form.resetFields();
        }}
        okText="Generate"
        okButtonProps={{
          onClick: form.submit,
        }}
        confirmLoading={loading}
        title={<Typography.Title level={4}>Generate Tagihan</Typography.Title>}
      >
        <Form form={form} requiredMark layout="vertical" onFinish={onSubmit}>
          <Form.Item
            className="mb-2"
            label="Jenis"
            name="type"
            rules={[{ required: true, message: "Jenis harus diisi" }]}
          >
            <Select
              placeholder="Pilih Jenis Tagihan"
              options={[
                {
                  label: "Tagihan SPP",
                  value: "spp",
                },
                {
                  label: "Tagihan Lainnya",
                  value: "uangPangkal",
                },
              ]}
            />
          </Form.Item>
          {tagihanType && (
            <>
              {tagihanType === "spp" && (
                <Form.Item
                  className="mb-2"
                  label="Jenis"
                  name="jenis"
                  rules={[
                    { required: true, message: "Jenis tagihan harus diisi" },
                  ]}
                >
                  <Select
                    placeholder="Pilih Jenis"
                    options={[
                      {
                        label: "Semester",
                        value: "semester",
                      },
                      {
                        label: "Bulanan",
                        value: "bulanan",
                      },
                      {
                        label: "Terbatas",
                        value: "terbatas",
                      },
                    ]}
                  />
                </Form.Item>
              )}

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
                name="tahun_ajaran"
                label="Tahun Ajaran"
                rules={[
                  { required: true, message: "Tahun Ajaran harus diisi" },
                ]}
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
            </>
          )}
        </Form>
      </Modal>
    </>
  );
}

export default GenerateTagihan;
