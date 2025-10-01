import Head from "next/head";
import React from "react";

type TSeo = {
  title: string;
  description: string;
};
export const Seo = (props: TSeo) => {
  return (
    <Head>
      <title>{props.title}</title>
      <meta name="description" content={props.description} />
    </Head>
  );
};
