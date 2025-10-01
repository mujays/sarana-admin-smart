import { ReactNode } from "react";

import {
  AuthenticatedNavbar,
  TAuthenticatedNavbar,
} from "@/features/navigation";
import { LayoutBase } from "./LayoutBase";
import { Layout } from "antd";
import { UnderConstruction } from "@/features/common/components";
import { Sidebar } from "@/features/navigation/components/sidebar";

type TLayout = {
  children: ReactNode;
  activeLink: TAuthenticatedNavbar["activeLink"];
  isUnderConstruction?: boolean;
};

export const AuthenticatedLayout = (props: TLayout) => {
  return (
    <LayoutBase>
      <Layout>
        {props.activeLink !== "notification" && <Sidebar />}
        <Layout.Content
          style={{
            backgroundColor: "#ffffff",
          }}
        >
          <AuthenticatedNavbar activeLink={props.activeLink} />
          {props.isUnderConstruction ? (
            <UnderConstruction />
          ) : (
            <div
              style={{
                height: "calc(100dvh - 65px)",
                overflow: "auto",
              }}
            >
              {props.children}
            </div>
          )}
        </Layout.Content>
      </Layout>
    </LayoutBase>
  );
};
