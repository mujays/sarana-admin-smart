import { ReactNode } from "react";
import { ThemeProvider } from "./theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

type TAppProvider = {
  children: ReactNode;
};

const queryClient = new QueryClient();

export const AppProvider = ({ children }: TAppProvider) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>{children}</ThemeProvider>
    </QueryClientProvider>
  );
};
