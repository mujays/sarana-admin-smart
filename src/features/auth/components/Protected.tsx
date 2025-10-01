import { useRouter } from "next/router";
import { ReactNode, useEffect } from "react";
import Cookies from "js-cookie";

type TProtected = {
  children: ReactNode;
  notAuthorizedRedirectUrl?: string;
  loadingState?: ReactNode;
};
export const Protected = (props: TProtected) => {
  const router = useRouter();

  const authorize = () => {
    const token = Cookies.get("session_kesiswaan");
    if (!token) {
      window.location.href = process.env.NEXT_PUBLIC_URL_PORTAL as string;
    }
  };

  useEffect(() => {
    authorize();
  }, [router]);

  return <>{props.children}</>;
};
