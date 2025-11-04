import { Title } from "@/components/title";
import classNames from "classnames";
import Head from "next/head";
import { Breadcrumb } from "../navigation/components/breadcrumb";
import { AuthenticatedLayout } from "@/layouts/AuthenticatedLayout";
import { ReactElement, useEffect, useState } from "react";
import { Button, DatePicker, Form, Input, Select } from "antd";
import SiswaServices from "@/services/siswa";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import errorResponse from "@/utils/error-response";
import { AxiosError } from "axios";
import { useRouter } from "next/router";
import dayjs from "dayjs";
import {
  createEmojiPreventionHandler,
  noEmojiRule,
} from "@/utils/emoji-prevention";

function EditSiswaPage() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const router = useRouter();
  const paths = router.pathname.split("/");
  const type = paths[1];
  const { siswaId } = router.query;

  const { data: siswa, isLoading: isLoadingDetail } = useQuery({
    queryKey: ["STUDENT", router.query?.siswaId],
    enabled: !!siswaId,
    queryFn: async () => {
      const response = await SiswaServices.getOne(+(siswaId as string));
      return response.data;
    },
  });

  useEffect(() => {
    if (siswa) {
      form.setFieldValue("nik", siswa.nik);
      form.setFieldValue("nis", siswa.nis);
      form.setFieldValue("nisn", siswa.nisn);
      form.setFieldValue("nama", siswa.nama);
      form.setFieldValue("agama", siswa.agama);
      form.setFieldValue("alamat", siswa.alamat);
      form.setFieldValue("bahasa_sehari", siswa.bahasa_sehari);
      form.setFieldValue("jenis_kelamin", siswa.jenis_kelamin);
      form.setFieldValue("tanggal_lahir", dayjs(siswa.tanggal_lahir));
      form.setFieldValue("tanggal_masuk", dayjs(siswa.tanggal_masuk));
      form.setFieldValue("kewarganegaraan", siswa.kewarganegaraan);
      form.setFieldValue("ibu_kandung", siswa.ibu_kandung);
      form.setFieldValue("lulusan_dari", siswa.lulusan_dari);
      form.setFieldValue("alamat_sekolah_asal", siswa.alamat_sekolah_asal);
    }
  }, [siswa]);

  const onSubmit = async (val: any) => {
    try {
      setLoading(true);
      await SiswaServices.update(+(siswaId as string), {
        ...val,
        tanggal_lahir: dayjs(val?.tanggal_lahir).format("YYYY-MM-DD"),
        tanggal_masuk: dayjs(val?.tanggal_masuk).format("YYYY-MM-DD"),
      });
      queryClient.invalidateQueries({ queryKey: ["STUDENTS"] });
      toast.success("Siswa berhasil diubah");
      router.push(`/${type}/kesiswaan/siswa`);
      form.resetFields();
    } catch (error) {
      errorResponse(error as AxiosError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Edit Siswa | Smart School</title>
      </Head>
      <div className="p-5">
        <Title
          level={1}
          className={classNames("font-[600] !text-[20px] !mb-[4px]")}
        >
          Edit Siswa
        </Title>

        <Breadcrumb />

        <div>
          <Form form={form} requiredMark layout="vertical" onFinish={onSubmit}>
            <div className="flex gap-2">
              <Form.Item
                label="NIS"
                name="nis"
                className="w-full mb-2"
                rules={[{ required: true, message: "NIS harus diisi" }]}
              >
                <Input
                  placeholder="NIS"
                  maxLength={255}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    form.setFieldsValue({ nis: value });
                  }}
                />
              </Form.Item>
              <Form.Item
                label="NISN"
                name="nisn"
                className="w-full mb-2"
                rules={[{ required: true, message: "NISN harus diisi" }]}
              >
                <Input
                  placeholder="NISN"
                  maxLength={255}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    form.setFieldsValue({ nisn: value });
                  }}
                />
              </Form.Item>
            </div>
            <Form.Item
              label="Nama"
              name="nama"
              className="mb-2"
              rules={[
                { required: true, message: "nama harus diisi" },
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
              label="NIK"
              name="nik"
              className="mb-2"
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

            <Form.Item
              label="Nama Ibu Kandung"
              name="ibu_kandung"
              className="mb-2"
              rules={[
                { required: true, message: "Nama ibu kandung harus diisi" },
                noEmojiRule,
              ]}
            >
              <Input
                placeholder="Ibu Kandung"
                maxLength={255}
                onChange={createEmojiPreventionHandler()}
              />
            </Form.Item>

            <Form.Item
              className="mb-2"
              label="Agama"
              name="agama"
              rules={[
                { required: true, message: "agama harus diisi" },
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
              name="tanggal_lahir"
              label="Tanggal Lahir"
              className="mb-2"
              rules={[{ required: true, message: "tanggal lahir harus diisi" }]}
            >
              <DatePicker
                allowClear={false}
                format="DD/MM/YYYY"
                className="w-full"
                // value={dateValue as [Dayjs, Dayjs]}
              />
            </Form.Item>

            <Form.Item
              label="Alamat"
              name="alamat"
              rules={[{ required: true, message: "alamat harus diisi" }]}
            >
              <Input.TextArea
                rows={5}
                showCount
                maxLength={255}
                placeholder="Alamat"
              />
            </Form.Item>

            <div className="flex gap-2">
              <Form.Item
                className="w-full mb-2"
                label="Bahasa Sehari-hari"
                name="bahasa_sehari"
                rules={[{ required: true, message: "bahasa harus diisi" }]}
              >
                <Select
                  placeholder="Pilih Bahasa"
                  options={[
                    {
                      label: "Bahasa Indonesia",
                      value: "Bahasa Indonesia",
                    },
                    {
                      label: "Bahasa Inggris",
                      value: "Bahasa Inggris",
                    },
                    {
                      label: "Bahasa Arab",
                      value: "Bahasa Arab",
                    },
                    {
                      label: "Lainnya",
                      value: "Lainnya",
                    },
                  ]}
                />
              </Form.Item>

              <Form.Item
                label="Kewarganegaraan"
                name="kewarganegaraan"
                className="w-full mb-2"
                rules={[
                  { required: true, message: "kewarganegaraan harus diisi" },
                  noEmojiRule,
                ]}
              >
                <Input
                  placeholder="kewarganegaraan"
                  maxLength={255}
                  onChange={createEmojiPreventionHandler()}
                />
              </Form.Item>
            </div>

            <Form.Item
              name="tanggal_masuk"
              label="Tanggal Masuk"
              className="mb-2"
              rules={[{ required: true, message: "tanggal masuk harus diisi" }]}
            >
              <DatePicker
                allowClear={false}
                format="DD/MM/YYYY"
                className="w-full"
                // value={dateValue as [Dayjs, Dayjs]}
              />
            </Form.Item>

            <Form.Item
              label="Asal Sekolah"
              name="lulusan_dari"
              className="w-full mb-2"
              rules={[
                { required: true, message: "asal sekolah harus diisi" },
                noEmojiRule,
              ]}
            >
              <Input
                placeholder="Asal Sekolah"
                maxLength={255}
                onChange={createEmojiPreventionHandler()}
              />
            </Form.Item>

            <Form.Item
              label="Alamat Sekolah Asal"
              name="alamat_sekolah_asal"
              rules={[
                { required: true, message: "alamat harus diisi" },
                noEmojiRule,
              ]}
            >
              <Input.TextArea
                rows={5}
                maxLength={255}
                placeholder="Alamat"
                onChange={createEmojiPreventionHandler()}
              />
            </Form.Item>

            <div className="flex justify-end">
              <Button
                loading={loading}
                type="primary"
                onClick={() => {
                  form.submit();
                }}
              >
                Edit
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
}

EditSiswaPage.withLayout = (page: ReactElement) => {
  return <AuthenticatedLayout activeLink="siswa">{page}</AuthenticatedLayout>;
};
EditSiswaPage.isProtected = true;

export default EditSiswaPage;
