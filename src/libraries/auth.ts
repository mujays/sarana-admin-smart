import { useAuthStore } from "@/stores/auth";
import { useSuperAdminStore } from "@/stores/super-admin";
import Cookies from "js-cookie";

// MAIN AUTH

export async function storeToken(data: string) {
  const { setTokens, tokens } = useAuthStore.getState();
  setTokens({
    kesiswaan: data,
    finance: tokens.finance || "",
    perpus: tokens.perpus || "",
    akademik: tokens.akademik || "",
  });
}

export async function logout() {
  const { clearTokens } = useAuthStore.getState();
  clearTokens();
}

export async function getToken() {
  const { tokens } = useAuthStore.getState();
  return tokens.kesiswaan;
}

// FINANCE AUTH

export async function storeTokenKeuangan(data: string) {
  const { setTokens, tokens } = useAuthStore.getState();
  setTokens({
    kesiswaan: tokens.kesiswaan || "",
    finance: data,
    perpus: tokens.perpus || "",
    akademik: tokens.akademik || "",
  });
}

export async function logoutKeuangan() {
  const { tokens } = useAuthStore.getState();
  return tokens.finance;
}

export async function getTokenKeuangan(withAdmin = false) {
  const superAdminCookie = Cookies.get("session_keuangan_super_admin");
  const { tokens } = useAuthStore.getState();
  return withAdmin ? superAdminCookie : tokens.finance;
}

// PERPUS AUTH

export async function getTokenPerpus() {
  const { tokens } = useAuthStore.getState();
  return tokens.perpus;
}

export async function storeTokenPerpus(data: string) {
  const { setTokens, tokens } = useAuthStore.getState();
  setTokens({
    kesiswaan: tokens.kesiswaan || "",
    finance: tokens.finance || "",
    perpus: data,
    akademik: tokens.akademik || "",
  });
}

// AKADEMIK AUTH

export async function getTokenAkademik() {
  const { tokens } = useAuthStore.getState();
  return tokens.akademik;
}

export async function storeTokenAkademik(data: string) {
  const { setTokens, tokens } = useAuthStore.getState();
  setTokens({
    kesiswaan: tokens.kesiswaan || "",
    finance: tokens.finance || "",
    perpus: tokens.perpus || "",
    akademik: data,
  });
}
