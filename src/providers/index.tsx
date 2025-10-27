import { ReactNode } from "react";
import { ThemeProvider } from "./theme-provider";
import { SuperAdminProvider } from "./super-admin-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

type TAppProvider = {
  children: ReactNode;
};

const queryClient = new QueryClient();

export const AppProvider = ({ children }: TAppProvider) => {
  return (
    <QueryClientProvider client={queryClient}>
      <SuperAdminProvider>
        <ThemeProvider>{children}</ThemeProvider>
      </SuperAdminProvider>
    </QueryClientProvider>
  );
};
