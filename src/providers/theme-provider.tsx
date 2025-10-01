import { ReactNode } from "react";
import { App, ConfigProvider } from "antd";
import idID from "antd/locale/id_ID";

import { theme } from "@/config/theme";

type TThemeProvider = {
  children: ReactNode;
};
export const ThemeProvider = ({ children }: TThemeProvider) => {
  return (
    <ConfigProvider theme={theme} locale={idID}>
      <App>{children}</App>
    </ConfigProvider>
  );
};
