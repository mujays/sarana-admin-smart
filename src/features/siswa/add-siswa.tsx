import { Title } from "@/components/title";
import classNames from "classnames";
import Head from "next/head";
import { Breadcrumb } from "../navigation/components/breadcrumb";
import { AuthenticatedLayout } from "@/layouts/AuthenticatedLayout";
import { ReactElement, useState } from "react";
import { Button, DatePicker, Form, Input, Select } from "antd";
import { PlusIcon, TrashIcon } from "lucide-react";
import SiswaServices from "@/services/siswa";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import errorResponse from "@/utils/error-response";
import { AxiosError } from "axios";
import { useRouter } from "next/router";
import dayjs from "dayjs";
import {
  createEmojiPreventionHandler,
  noEmojiRule,
} from "@/utils/emoji-prevention";

function AddSiswaPage() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const router = useRouter();
  const paths = router.pathname.split("/");
  const type = paths[1];

  const onSubmit = async (val: any) => {
    try {
      setLoading(true);
      await SiswaServices.create({
        ...val,
        tanggal_lahir: dayjs(val?.tanggal_lahir).format("YYYY-MM-DD"),
        tanggal_masuk: dayjs(val?.tanggal_masuk).format("YYYY-MM-DD"),
        type: type.toUpperCase(),
        keluarga: [
          {
            nama: val.nama_ayah,
            hubungan: "Ayah",
            jenis_kelamin: "Laki-laki",
            gaji: val.gaji_ayah,
            pendidikan: val.pendidikan_ayah,
            agama: val.agama_ayah,
            pekerjaan: val.pekerjaan_ayah,
            no_hp: val.no_hp_ayah,
            tanggal_lahir: dayjs(val.tanggal_lahir_ayah).format("YYYY-MM-DD"),
          },
          {
            nama: val.nama_ibu,
            hubungan: "Ibu",
            jenis_kelamin: "Perempuan",
            gaji: val.gaji_ibu,
            pendidikan: val.pendidikan_ibu,
            agama: val.agama_ibu,
            pekerjaan: val.pekerjaan_ibu,
            no_hp: val.no_hp_ibu,
            tanggal_lahir: dayjs(val.tanggal_lahir_ibu).format("YYYY-MM-DD"),
          },
          ...(val?.keluarga
            ? val?.keluarga?.map((kel: any) => ({
                ...kel,
                tanggal_lahir: dayjs(kel?.tanggal_lahir).format("YYYY-MM-DD"),
              }))
            : []),
        ],
      });
      queryClient.invalidateQueries({ queryKey: ["STUDENTS"] });
      toast.success("Siswa berhasil dibuat");
      router.push(`/${type}/kesiswaan/siswa`);
      form.resetFields();
    } catch (error) {
      console.error(error);
      errorResponse(error as AxiosError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Tambah Siswa | Smart School</title>
      </Head>
      <div className="p-5">
        <Title
          level={1}
          className={classNames("font-[600] !text-[20px] !mb-[4px]")}
        >
          Tambah Siswa
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
              />
            </Form.Item>

            <Form.Item
              label="Alamat"
              name="alamat"
              rules={[
                { required: true, message: "alamat harus diisi" },
                noEmojiRule,
              ]}
            >
              <Input.TextArea
                rows={5}
                showCount
                maxLength={255}
                placeholder="Alamat"
                onChange={createEmojiPreventionHandler()}
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

            <div className="p-5 rounded-lg border border-gray-300 mb-4">
              <p className="text-center font-semibold mb-5">
                Data Orang Tua (Ayah)
              </p>
              <div className="flex gap-2">
                <Form.Item
                  label="Nama"
                  name="nama_ayah"
                  className="w-full !mb-2"
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
                  name="tanggal_lahir_ayah"
                  label="Tanggal Lahir"
                  className="!mb-2 w-full"
                  rules={[
                    { required: true, message: "Tanggal lahir harus diisi" },
                  ]}
                >
                  <DatePicker
                    allowClear={false}
                    format="DD/MM/YYYY"
                    className="w-full"
                  />
                </Form.Item>
              </div>
              <Form.Item
                label="Agama"
                name="agama_ayah"
                className="w-full mb-2"
                rules={[noEmojiRule]}
              >
                <Input
                  placeholder="Agama"
                  maxLength={255}
                  onChange={createEmojiPreventionHandler()}
                />
              </Form.Item>
              <div className="flex gap-2">
                <Form.Item
                  label="Pekerjaan"
                  name="pekerjaan_ayah"
                  className="!mb-2 w-full"
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
                  label="Penghasilan Perbulan"
                  name="gaji_ayah"
                  className="!mb-2 w-full"
                >
                  <Input
                    prefix="Rp. "
                    placeholder="0"
                    maxLength={255}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      form.setFieldsValue({ gaji_ayah: value });
                    }}
                  />
                </Form.Item>
              </div>
              <div className="flex gap-2">
                <Form.Item
                  label="Pendidikan"
                  name="pendidikan_ayah"
                  className="w-full mb-2"
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
                  name="no_hp_ayah"
                  className="w-full mb-2"
                  rules={[
                    { required: true, message: "Nomor telepon harus diisi" },
                  ]}
                >
                  <Input
                    placeholder="Nomor Telepon"
                    maxLength={255}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      form.setFieldsValue({ no_hp_ayah: value });
                    }}
                  />
                </Form.Item>
              </div>
            </div>

            <div className="p-5 rounded-lg border border-gray-300 mb-4">
              <p className="text-center font-semibold mb-5">
                Data Orang Tua (Ibu)
              </p>
              <div className="flex gap-2">
                <Form.Item
                  label="Nama"
                  name="nama_ibu"
                  className="w-full !mb-2"
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
                  name="tanggal_lahir_ibu"
                  label="Tanggal Lahir"
                  className="!mb-2 w-full"
                  rules={[
                    { required: true, message: "Tanggal lahir harus diisi" },
                  ]}
                >
                  <DatePicker
                    allowClear={false}
                    format="DD/MM/YYYY"
                    className="w-full"
                  />
                </Form.Item>
              </div>
              <Form.Item
                label="Agama"
                name="agama_ibu"
                className="w-full mb-2"
                rules={[noEmojiRule]}
              >
                <Input
                  placeholder="Agama"
                  maxLength={255}
                  onChange={createEmojiPreventionHandler()}
                />
              </Form.Item>
              <div className="flex gap-2">
                <Form.Item
                  label="Pekerjaan"
                  name="pekerjaan_ibu"
                  className="!mb-2 w-full"
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
                  label="Penghasilan Perbulan"
                  name="gaji_ibu"
                  className="!mb-2 w-full"
                >
                  <Input
                    prefix="Rp. "
                    placeholder="0"
                    maxLength={255}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      form.setFieldsValue({ gaji_ibu: value });
                    }}
                  />
                </Form.Item>
              </div>
              <div className="flex gap-2">
                <Form.Item
                  label="Pendidikan"
                  name="pendidikan_ibu"
                  className="w-full mb-2"
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
                  name="no_hp_ibu"
                  className="w-full mb-2"
                  rules={[
                    { required: true, message: "Nomor telepon harus diisi" },
                  ]}
                >
                  <Input
                    placeholder="Nomor Telepon"
                    maxLength={255}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      form.setFieldsValue({ no_hp_ibu: value });
                    }}
                  />
                </Form.Item>
              </div>
            </div>

            <div className="border p-4 rounded-lg mb-4">
              <Form.List name="riwayat">
                {(fields, { add, remove }, { errors }) => (
                  <>
                    {fields.map((field, index) => (
                      <Form.Item
                        className="!mb-2"
                        label={index === 0 ? "Riwayat Penyakit" : ""}
                        required={false}
                        key={field.key}
                      >
                        <div className="flex gap-2 p-4 border rounded">
                          <div className="grid w-full grid-cols-1 gap-3 md:grid-cols-2">
                            <Form.Item
                              {...field}
                              label="Jenis Penyakit"
                              name={[field.name, "jenis_penyakit"]}
                              validateTrigger={["onChange", "onBlur"]}
                              className="!mb-0"
                              rules={[
                                {
                                  required: true,
                                  whitespace: true,
                                  message: "",
                                },
                              ]}
                            >
                              <Input
                                placeholder={`Jenis Penyakit`}
                                className="w-full"
                              />
                            </Form.Item>
                          </div>
                          <Button
                            onClick={() => remove(field.name)}
                            className="!border-red-500"
                          >
                            <TrashIcon className="w-5 h-5 text-red-500 " />
                          </Button>
                        </div>
                      </Form.Item>
                    ))}
                    <Form.Item className="!mb-0">
                      <Button
                        type="dashed"
                        className="w-full"
                        onClick={() => add()}
                        icon={<PlusIcon />}
                      >
                        Tambah Riwayat Penyakit
                      </Button>
                      <Form.ErrorList errors={errors} />
                    </Form.Item>
                  </>
                )}
              </Form.List>
            </div>

            <Form.List name="keluarga">
              {(fields, { add, remove }, { errors }) => (
                <>
                  {fields.map((field, index) => (
                    <Form.Item
                      className="!mb-2"
                      label={index === 0 ? "Keluarga" : ""}
                      required={false}
                      key={field.key}
                    >
                      <div className="flex gap-2 p-4 border rounded">
                        <div className="grid w-full grid-cols-1 gap-3 md:grid-cols-2">
                          <Form.Item
                            label="Nama"
                            name={[field.name, "nama"]}
                            validateTrigger={["onChange", "onBlur"]}
                            className="!mb-0"
                            rules={[
                              {
                                required: true,
                                whitespace: true,
                                message: "",
                              },
                            ]}
                          >
                            <Input
                              placeholder={`Nama Keluarga ${index + 1}`}
                              className="w-full"
                            />
                          </Form.Item>

                          <Form.Item
                            {...field}
                            label="Hubungan"
                            name={[field.name, "hubungan"]}
                            validateTrigger={["onChange", "onBlur"]}
                            className="!mb-0"
                            rules={[
                              {
                                required: true,
                                whitespace: true,
                                message: "",
                              },
                            ]}
                          >
                            <Input
                              placeholder={`Hubungan`}
                              className="w-full"
                            />
                          </Form.Item>

                          <Form.Item
                            {...field}
                            label="Pekerjaan"
                            name={[field.name, "pekerjaan"]}
                            validateTrigger={["onChange", "onBlur"]}
                            className="!mb-0"
                            rules={[
                              {
                                required: true,
                                whitespace: true,
                                message: "",
                              },
                            ]}
                          >
                            <Input
                              placeholder={`Pekerjaan`}
                              className="w-full"
                            />
                          </Form.Item>

                          <Form.Item
                            {...field}
                            label="Tanggal Lahir"
                            name={[field.name, "tanggal_lahir"]}
                            className="!mb-0"
                            rules={[
                              {
                                required: true,
                                message: "",
                              },
                            ]}
                          >
                            <DatePicker
                              allowClear={false}
                              format="DD/MM/YYYY"
                              className="w-full"
                              // value={dateValue as [Dayjs, Dayjs]}
                            />
                          </Form.Item>

                          <Form.Item
                            label="Pendidikan"
                            name={[field.name, "pendidikan"]}
                            validateTrigger={["onChange", "onBlur"]}
                            className="!mb-0"
                            rules={[
                              {
                                required: true,
                                whitespace: true,
                                message: "",
                              },
                            ]}
                          >
                            <Input
                              placeholder={`Pendidikan Keluarga ${index + 1}`}
                              className="w-full"
                            />
                          </Form.Item>

                          <Form.Item
                            label="Nomor HP"
                            name={[field.name, "no_hp"]}
                            validateTrigger={["onChange", "onBlur"]}
                            className="!mb-0"
                            rules={[
                              {
                                required: true,
                                whitespace: true,
                                message: "",
                              },
                            ]}
                          >
                            <Input placeholder={`08xx`} className="w-full" />
                          </Form.Item>
                        </div>
                        <Button
                          onClick={() => remove(field.name)}
                          className="!border-red-500"
                        >
                          <TrashIcon className="w-5 h-5 text-red-500 " />
                        </Button>
                      </div>
                    </Form.Item>
                  ))}
                  <Form.Item>
                    <Button
                      type="dashed"
                      className="w-full"
                      onClick={() => add()}
                      icon={<PlusIcon />}
                    >
                      Tambah Keluarga
                    </Button>
                    <Form.ErrorList errors={errors} />
                  </Form.Item>
                </>
              )}
            </Form.List>

            <div className="flex justify-end">
              <Button
                loading={loading}
                type="primary"
                onClick={() => {
                  form.submit();
                }}
              >
                Tambah
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
}

AddSiswaPage.withLayout = (page: ReactElement) => {
  return <AuthenticatedLayout activeLink="siswa">{page}</AuthenticatedLayout>;
};
AddSiswaPage.isProtected = true;

export default AddSiswaPage;
