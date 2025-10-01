import { ReactElement, useState } from "react";

import { Title } from "@/components/title/Title";

import { AuthenticatedLayout } from "@/layouts/AuthenticatedLayout";
import Head from "next/head";
import classNames from "classnames";
import { Breadcrumb } from "../navigation/components/breadcrumb";
import ViewType from "./components/ViewType";
import ViewTypeAdmission from "./components/ViewTypeAdmission";

export default function TypePage() {
  const [isTypeAdmission, setIsTypeAdmission] = useState(false);

  return (
    <>
      <Head>
        <title>Tipe | Smart School</title>
      </Head>

      <div className="p-5">
        <Title
          level={1}
          className={classNames("font-[600] !text-[20px] !mb-[4px]")}
        >
          Tipe
        </Title>

        <Breadcrumb
          items={[
            {
              title: "Tipe",
            },
          ]}
        />

        <div className="flex bg-gray-200 w-fit mb-3 rounded-lg p-1">
          <div
            onClick={() => {
              setIsTypeAdmission(false);
            }}
            className={classNames(
              "cursor-pointer rounded px-3 py-1 w-[180px] text-center",
              !isTypeAdmission && "bg-white font-semibold",
            )}
          >
            Tagihan & SPP
          </div>
          <div
            onClick={() => {
              setIsTypeAdmission(true);
            }}
            className={classNames(
              "cursor-pointer rounded px-3 py-1 w-fit text-center whitespace-nowrap",
              isTypeAdmission && "bg-white font-semibold",
            )}
          >
            Tagihan Lainnya
          </div>
        </div>

        <div className="p-3 space-y-3 border rounded">
          {isTypeAdmission ? <ViewTypeAdmission /> : <ViewType />}
        </div>
      </div>
    </>
  );
}

TypePage.withLayout = (page: ReactElement) => {
  return <AuthenticatedLayout activeLink="tipe">{page}</AuthenticatedLayout>;
};
TypePage.isProtected = true;
