import { login, logout } from "@/features/auth";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { TAuthStore } from "./type";
import { useStoreCSR } from "../utils";

export const useAuthStore = create<TAuthStore>()(
  persist(
    (set, get) => ({
      user: null,
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
