import { ReactElement, useState } from "react";

import { Title } from "@/components/title/Title";

import { AuthenticatedLayout } from "@/layouts/AuthenticatedLayout";
import classNames from "classnames";
import Head from "next/head";
import { Breadcrumb } from "../navigation/components/breadcrumb";
import TransactionTagihan from "./components/TransactionTagihan";
import TransactionAdm from "./components/TransactionAdm";

export default function TransaksiPage() {
  const [isAdmission, setIsAdmission] = useState(false);
  return (
    <>
      <Head>
        <title>Transaksi | Smart School</title>
      </Head>

      <div className="p-5">
        <Title
          level={1}
          className={classNames("font-[600] !text-[20px] !mb-[4px]")}
        >
          Transaksi
        </Title>

        <Breadcrumb />

        <div className="flex bg-gray-200 w-fit mb-3 rounded-lg p-1">
          <div
            onClick={() => {
              setIsAdmission(false);
            }}
            className={classNames(
              "cursor-pointer rounded px-3 py-1 w-[180px] text-center",
              !isAdmission && "bg-white font-semibold",
            )}
          >
            Tagihan & SPP
          </div>
          <div
            onClick={() => {
              setIsAdmission(true);
            }}
            className={classNames(
              "cursor-pointer rounded px-3 py-1 w-fit text-center whitespace-nowrap",
              isAdmission && "bg-white font-semibold",
            )}
          >
            Tagihan Lainnya
          </div>
        </div>

        <div className="p-3 space-y-3 border rounded">
          {isAdmission ? <TransactionAdm /> : <TransactionTagihan />}
        </div>
      </div>
    </>
  );
}

TransaksiPage.withLayout = (page: ReactElement) => {
  return (
    <AuthenticatedLayout activeLink="transaksi">{page}</AuthenticatedLayout>
  );
};
TransaksiPage.isProtected = true;
