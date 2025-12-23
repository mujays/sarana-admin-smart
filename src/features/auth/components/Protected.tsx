import { useRouter } from "next/router";
import { ReactNode, useEffect, useCallback } from "react";
import { useAuthStore } from "@/stores/auth";

type TProtected = {
  children: ReactNode;
  notAuthorizedRedirectUrl?: string;
  loadingState?: ReactNode;
};
export const Protected = (props: TProtected) => {
  const router = useRouter();
  const { tokens } = useAuthStore();

  const authorize = useCallback(() => {
    if (!tokens.kesiswaan) {
      window.location.href = process.env.NEXT_PUBLIC_URL_PORTAL as string;
    }
  }, [tokens.kesiswaan]);

  useEffect(() => {
    authorize();
  }, [authorize]);

  return <>{props.children}</>;
};
