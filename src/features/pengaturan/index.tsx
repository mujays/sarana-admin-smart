import { ReactElement, useEffect, useState } from "react";

import { Title } from "@/components/title/Title";

import { AuthenticatedLayout } from "@/layouts/AuthenticatedLayout";
import ClientService from "@/services/client";
import errorResponse from "@/utils/error-response";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Form, Input } from "antd";
import axios, { AxiosError } from "axios";
import classNames from "classnames";
import Head from "next/head";
import { toast } from "sonner";
import { Breadcrumb } from "../navigation/components/breadcrumb";
import { useRouter } from "next/router";
import { useDebounce } from "@/hooks/useDebounce";

export default function PengaturanPage() {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const bankValue = Form.useWatch("bank", form);
  const debounceBank = useDebounce(bankValue, 500);
  const router = useRouter();
  const paths = router.pathname.split("/");
  const type = paths[1];

  const queryClient = useQueryClient();

  const { data: bank } = useQuery({
    queryKey: ["BANK", debounceBank],
    queryFn: async () => {
      const response = await axios.get(
        "https://dev.internal.apps.saranatechnology.com/api/v1/bank",
        {
          params: {
            search: debounceBank,
          },
        },
      );
      return response.data.data;
    },
  });

  const { data: apps } = useQuery({
    queryKey: ["APPS"],
    queryFn: async () => {
      const response = await ClientService.getApp();
      return response;
    },
  });

  const { data: client, isLoading } = useQuery({
    queryKey: ["CLIENT"],
    queryFn: async () => {
      const response = await ClientService.getClient({
        type,
      });
      return response;
    },
  });

  const onSubmit = async (val: any) => {
    try {
      setLoading(true);
      await ClientService.updateClient({
        ...val,
        type,
        xendit_bank_code: bank[0]?.channel || null,
      });
      queryClient.invalidateQueries({
        queryKey: ["CLIENT"],
      });
      toast.success("Data berhasil diperbarui");
    } catch (error) {
      errorResponse(error as AxiosError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (client) {
      form.setFieldValue("pic", client.data.pic);
      form.setFieldValue("no_telp_pic", client.data.no_telp_pic);
      form.setFieldValue("alamat", client.data.alamat);
      form.setFieldValue("bank", client.data.bank);
      form.setFieldValue("norek", client.data.norek);
    }
  }, [client]);

  return (
    <>
      <Head>
        <title>Pengaturan | Smart School</title>
      </Head>

      <div className="p-5">
        <Title
          level={1}
          className={classNames("font-[600] !text-[20px] !mb-[4px]")}
        >
          Pengaturan
        </Title>

        <Breadcrumb />
        <div className="p-3 space-y-3 border rounded mb-2">
          <p className="font-medium text-lg mb-2">Fee</p>
          <div className="flex gap-3">
            <div className="w-full space-y-2">
              <p>Penarikan</p>
              <Input
                disabled
                value={
                  apps?.data?.type?.toLocaleLowerCase() === "persentage"
                    ? `${apps?.data.fee_per_withdrawal * 100}%`
                    : `Rp. ${apps?.data.fee_per_withdrawal}`
                }
              />
            </div>
            <div className="w-full space-y-2">
              <p>Transaksi</p>
              <Input
                disabled
                value={
                  apps?.data?.type?.toLocaleLowerCase() === "persentage"
                    ? `${apps?.data.fee_per_transaction * 100}%`
                    : `Rp. ${apps?.data.fee_per_transaction}`
                }
              />
            </div>
          </div>
        </div>
        <div className="p-3 space-y-3 border rounded">
          <Form form={form} requiredMark layout="vertical" onFinish={onSubmit}>
            <div className="flex gap-3">
              <Form.Item
                label="Penanggung Jawab"
                name="pic"
                className="w-full mb-2"
                rules={[
                  { required: true, message: "Penanggung jawab harus diisi" },
                ]}
              >
                <Input placeholder="Penanggung Jawab" maxLength={255} />
              </Form.Item>
              <Form.Item
                label="No. Telepon"
                name="no_telp_pic"
                className="w-full mb-2"
                rules={[
                  { required: true, message: "Nomor Telepon harus diisi" },
                ]}
              >
                <Input placeholder="08.." maxLength={255} />
              </Form.Item>
            </div>

            <Form.Item
              label="Alamat"
              name="alamat"
              className="w-full mb-2"
              rules={[{ required: true, message: "Alamat harus diisi" }, {}]}
            >
              <Input.TextArea placeholder="Tulis alamat..." maxLength={255} />
            </Form.Item>

            <div className="flex gap-3">
              <Form.Item
                label="Nomor Rekening"
                name="norek"
                className="w-full mb-2"
                rules={[
                  { required: true, message: "Nomor Rekening harus diisi" },
                ]}
              >
                <Input placeholder="Nomor Rekening" maxLength={255} />
              </Form.Item>
              <Form.Item
                label="Bank"
                name="bank"
                className="w-full mb-2"
                rules={[{ required: true, message: "Bank harus diisi" }]}
              >
                <Input placeholder="Bank" maxLength={255} />
              </Form.Item>
            </div>
            <Button type="primary" onClick={() => form.submit()}>
              Perbarui
            </Button>
          </Form>
        </div>
      </div>
    </>
  );
}

PengaturanPage.withLayout = (page: ReactElement) => {
  return (
    <AuthenticatedLayout activeLink="pengaturan">{page}</AuthenticatedLayout>
  );
};
PengaturanPage.isProtected = true;
