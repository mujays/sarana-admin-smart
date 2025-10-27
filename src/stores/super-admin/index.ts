import { create } from "zustand";
import { persist } from "zustand/middleware";
import Cookies from "js-cookie";

interface SuperAdminState {
  isSuperAdmin: boolean;
  superAdminToken: string | null;
  superAdminEmail: string | null;

  // Actions
  setSuperAdmin: (token: string, email: string) => void;
  clearSuperAdmin: () => void;
  toggleSuperAdminMode: (isSuper: boolean) => void;
  checkSuperAdminStatus: () => void;
}

export const useSuperAdminStore = create<SuperAdminState>()(
  persist(
    (set, get) => ({
      isSuperAdmin: false,
      superAdminToken: null,
      superAdminEmail: null,

      setSuperAdmin: (token: string, email: string) => {
        // Set cookie untuk super admin
        Cookies.set("session_keuangan_super_admin", token, {
          expires: 7, // 7 days
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        });

        set({
          isSuperAdmin: true,
          superAdminToken: token,
          superAdminEmail: email,
        });
      },

      clearSuperAdmin: () => {
        // Remove cookie
        Cookies.remove("session_keuangan_super_admin");

        set({
          isSuperAdmin: false,
          superAdminToken: null,
          superAdminEmail: null,
        });
      },

      toggleSuperAdminMode: (isSuper: boolean) => {
        // Hanya toggle mode tanpa menghapus token atau email
        // Ini untuk switch sementara tanpa logout
        const currentState = get();
        if (currentState.superAdminToken) {
          set({
            isSuperAdmin: isSuper,
          });
        }
      },

      checkSuperAdminStatus: () => {
        const superAdminCookie = Cookies.get("session_keuangan_super_admin");
        const currentState = get();

        if (superAdminCookie) {
          // Jika ada cookie, set sebagai super admin
          set({
            isSuperAdmin: currentState.isSuperAdmin,
            superAdminToken: superAdminCookie,
            // Pertahankan email dari localStorage jika ada
            superAdminEmail: currentState.superAdminEmail,
          });
        } else {
          // Jika tidak ada cookie, clear semua
          set({
            isSuperAdmin: false,
            superAdminToken: null,
            superAdminEmail: null,
          });
        }
      },
    }),
    {
      name: "super-admin-storage",
      partialize: (state) => ({
        // Hanya persist token dan email, isSuperAdmin akan ditentukan oleh cookie
        superAdminToken: state.superAdminToken,
        superAdminEmail: state.superAdminEmail,
        isSuperAdmin: state.isSuperAdmin,
      }),
    },
  ),
);
