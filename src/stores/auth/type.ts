import { TUser } from "@/services/auth/auth.types";

export type TAuthStore = {
  user: TUser | null;
  tokens: {
    kesiswaan: string | null;
    finance: string | null;
    perpus: string | null;
    akademik: string | null;
  };
  setTokens: (tokens: {
    kesiswaan: string;
    finance: string;
    perpus: string;
    akademik: string;
  }) => void;
  clearTokens: () => void;
  doLogin: ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => Promise<void>;
  doLogout: () => Promise<void>;
  resetUser: () => void;
};
