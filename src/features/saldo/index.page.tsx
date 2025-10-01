import { ReactElement } from "react";

import { Title } from "@/components/title/Title";

import { AuthenticatedLayout } from "@/layouts/AuthenticatedLayout";
import classNames from "classnames";
import Head from "next/head";
import { Breadcrumb } from "../navigation/components/breadcrumb";
import { useQuery } from "@tanstack/react-query";
import ClientService from "@/services/client";
import { formatCurrency } from "@/stores/utils";

export default function SaldoPage() {
  const { data: balance, isLoading } = useQuery({
    queryKey: ["SALDO"],
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const response = await ClientService.getBalance();
      return response;
    },
  });

  return (
    <>
      <Head>
        <title>Saldo | Smart School</title>
      </Head>

      <div className="p-5">
        <Title
          level={1}
          className={classNames("font-[600] !text-[20px] !mb-[4px]")}
        >
          Saldo
        </Title>

        <Breadcrumb />

        <div className="p-3 space-y-3 border rounded grid grid-cols-2">
          <div>
            <p className="font-semibold">Saldo</p>
            <p>{formatCurrency(balance?.data?.data.saldo as number)}</p>
          </div>
          <div>
            <p className="font-semibold">Saldo Yang Bisa di Tarik</p>
            <p>
              {formatCurrency(
                balance?.data?.data.saldo_yang_bisa_ditarik as number,
              )}
            </p>
          </div>
          <div>
            <p className="font-semibold">Penanggung Jawab</p>
            <p>{balance?.data?.data.pic || "-"}</p>
          </div>
          <div>
            <p className="font-semibold">Nomor Telepon</p>
            <p>{balance?.data?.data.no_telp_pic || "-"}</p>
          </div>
          <div>
            <p className="font-semibold">Email</p>
            <p>{balance?.data?.data.email || "-"}</p>
          </div>
          <div>
            <p className="font-semibold">Alamat</p>
            <p>{balance?.data?.data.alamat || "-"}</p>
          </div>
          <div>
            <p className="font-semibold">Nomor Rekening</p>
            <p>
              {balance?.data?.data.norek} - {balance?.data?.data.bank}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

SaldoPage.withLayout = (page: ReactElement) => {
  return <AuthenticatedLayout activeLink="saldo">{page}</AuthenticatedLayout>;
};
SaldoPage.isProtected = true;
