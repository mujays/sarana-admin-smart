import axios from "axios";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useCallback } from "react";
import { useAuthStore } from "@/stores/auth";

function Login() {
  const router = useRouter();
  const { tokens, setTokens } = useAuthStore();

  const authProcsess = useCallback(async () => {
    if (router?.query?.email) {
      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_SOURCE}api/v1/login`,
          {
            email: decodeURIComponent(router.query.email as string),
          },
        );
        const resFinance = await axios.post(
          `${process.env.NEXT_PUBLIC_API_SOURCE_FINANCE}api/v1/login`,
          {
            email: decodeURIComponent(router.query.email as string),
          },
        );

        const resPerpus = await axios.post(
          `${process.env.NEXT_PUBLIC_API_SOURCE_PERPUS}api/v1/login`,
          {
            email: decodeURIComponent(router.query.email as string),
          },
        );

        const resAkademik = await axios.post(
          `${process.env.NEXT_PUBLIC_API_SOURCE_AKADEMIK}api/v1/login`,
          {
            email: decodeURIComponent(router.query.email as string),
          },
        );

        // Store all tokens in Zustand
        setTokens({
          kesiswaan: res.data.data.token,
          finance: resFinance.data.data.token,
          perpus: resPerpus.data.data.token,
          akademik: resAkademik.data.data.token,
        });

        window.location.href = "/home";
        return;
      } catch (error) {
        console.log({ error }, "ERROR_AUTH");
        // window.location.href = process.env.NEXT_PUBLIC_URL_PORTAL as string;
      }
    }

    if (tokens.kesiswaan) {
      window.location.href = "/home";
    } else {
      console.log("ERROR_AUTH");
      // window.location.href = process.env.NEXT_PUBLIC_URL_PORTAL as string;
    }
  }, [router.query, tokens.kesiswaan, setTokens]);
  useEffect(() => {
    authProcsess();
  }, [authProcsess]);

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <Loader2Icon className="w-10 h-10 animate-spin" />
    </div>
  );
}

export default Login;
