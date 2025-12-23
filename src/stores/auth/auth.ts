import { login, logout } from "@/features/auth";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { TAuthStore } from "./type";
import { useStoreCSR } from "../utils";

export const useAuthStore = create<TAuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      tokens: {
        kesiswaan: null,
        finance: null,
        perpus: null,
        akademik: null,
      },
      setTokens: (tokens) => {
        set(() => ({
          tokens: {
            kesiswaan: tokens.kesiswaan,
            finance: tokens.finance,
            perpus: tokens.perpus,
            akademik: tokens.akademik,
          },
        }));
      },
      clearTokens: () => {
        set(() => ({
          tokens: {
            kesiswaan: null,
            finance: null,
            perpus: null,
            akademik: null,
          },
        }));
      },
      doLogin: async ({ email, password }) => {
        try {
          const res = await login({ email, password });

          set(() => ({ user: res.data.user }));
        } catch (error) {
          throw error;
        }

        return;
      },
      resetUser: () => {
        set(() => ({ user: null }));
      },
      doLogout: async () => {
        try {
          await logout();

          set(() => ({ user: null }));
          get().clearTokens();
        } catch (error) {
          throw error;
        }

        return;
      },
    }),
    { name: "auth-storage" },
  ),
);

export const useAuthStoreCSR = () =>
  useStoreCSR(useAuthStore, (state) => state);
