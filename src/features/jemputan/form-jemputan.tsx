import { Title } from "@/components/title/Title";

import JemputanServices from "@/services/jemputan";
import errorResponse from "@/utils/error-response";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Form, Input } from "antd";
import { AxiosError } from "axios";
import classNames from "classnames";
import { Loader2Icon } from "lucide-react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "sonner";

export default function FormJemputan() {
  const router = useRouter();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const paths = router.pathname.split("/");
  const typeSchool = paths[1];

  const { pickupId } = router.query;

  const { data: jemputan, isLoading } = useQuery({
    queryKey: ["PICKUP", pickupId],
    enabled: !!pickupId,
    queryFn: async () => {
      const response = await JemputanServices.getOne(+(pickupId as string));
      return response;
    },
  });

  const queryClient = useQueryClient();

  const onSubmit = async (val: any) => {
    try {
      setLoading(true);
      await JemputanServices.update(+(pickupId as string), val);
      // await JemputanServices.check(jemputan?.data.code as string);
      // queryClient.invalidateQueries({
      //   queryKey: ["PICKUP"],
      // });
      toast.success("Data berhasil dikonfirmasi");
      form.resetFields();
      router.replace(`/${typeSchool}/kesiswaan/jemputan`);
    } catch (error) {
      errorResponse(error as AxiosError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Form Jemputan | Smart School</title>
      </Head>

      <div className="p-5">
        <Title
          level={1}
          className={classNames("font-[600] text-center !text-[20px] !mb-6")}
        >
          Form Jemputan
        </Title>

        {isLoading ? (
          <div className="py-10 flex justify-center">
            <Loader2Icon className="animate-spin text-primary-500" />
          </div>
        ) : (
          <div className="p-3 space-y-3 border rounded">
            <div className="grid grid-cols-2 gap-3 border-b pb-3">
              <div>
                <p className="font-bold">Nama Siswa</p>
                <p>{jemputan?.data.siswa.nama}</p>
              </div>
              <div>
                <p className="font-bold">NIS</p>
                <p>{jemputan?.data.siswa.nis}</p>
              </div>
              <div>
                <p className="font-bold">NISN</p>
                <p>{jemputan?.data.siswa.nisn}</p>
              </div>
              <div>
                <p className="font-bold">Alamat</p>
                <p>{jemputan?.data.siswa.alamat}</p>
              </div>
            </div>
            <Form
              form={form}
              requiredMark
              layout="vertical"
              onFinish={onSubmit}
            >
              <div className="flex gap-2">
                <Form.Item
                  label="Nama"
                  name="name"
                  className="w-full mb-2"
                  rules={[{ required: true, message: "Nama harus diisi" }]}
                >
                  <Input placeholder="Nama" maxLength={255} />
                </Form.Item>
                <Form.Item
                  label="No Telp"
                  name="phone"
                  className="w-full mb-2"
                  rules={[
                    { required: true, message: "Nomor telepon harus diisi" },
                  ]}
                >
                  <Input placeholder="08" maxLength={255} />
                </Form.Item>
              </div>

              <Form.Item label="Alamat" name="address" className="mb-2">
                <Input.TextArea placeholder="Alamat" maxLength={255} />
              </Form.Item>
              <Form.Item label="Catatan" name="note" className="mb-2">
                <Input.TextArea
                  placeholder="Tulis catatan..."
                  maxLength={255}
                />
              </Form.Item>

              <div className="flex justify-end">
                <Button htmlType="submit" type="primary">
                  Konfirmasi
                </Button>
              </div>
            </Form>
          </div>
        )}
      </div>
    </>
  );
}

FormJemputan.isProtected = true;
