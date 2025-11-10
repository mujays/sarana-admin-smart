import axios from "axios";
import Cookies from "js-cookie";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect } from "react";

function Login() {
  const router = useRouter();

  const authProcsess = async () => {
    const token = Cookies.get("session_kesiswaan");

    if (router?.query?.email) {
      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_SOURCE}api/v1/login`,
          {
            email: decodeURIComponent(router.query.email as string),
          },
        );
        Cookies.set("session_kesiswaan", res.data.data.token);
        window.location.href = "/home";
        return;
      } catch (error) {
        console.log({ error }, "ERROR_AUTH");
        // window.location.href = process.env.NEXT_PUBLIC_URL_PORTAL as string;
      }
    }

    if (token) {
      window.location.href = "/home";
    } else {
      console.log("ERROR_AUTH");
      // window.location.href = process.env.NEXT_PUBLIC_URL_PORTAL as string;
    }
  };

  useEffect(() => {
    authProcsess();
  }, [router.query]);

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <Loader2Icon className="w-10 h-10 animate-spin" />
    </div>
  );
}

export default Login;
