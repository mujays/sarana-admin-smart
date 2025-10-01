import { TUser } from "@/services/auth/auth.types";

export type TAuthStore = {
  user: TUser | null;
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
