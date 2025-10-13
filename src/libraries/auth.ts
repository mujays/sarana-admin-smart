import Cookies from "js-cookie";

// MAIN AUTH

export async function storeToken(data: string) {
  Cookies.set("session_kesiswaan", data, {
    expires: process.env.NODE_ENV === "development" ? 7 : 1,
  });
}

export async function logout() {
  Cookies.remove("session_kesiswaan");
}

export async function getToken() {
  const session = Cookies.get("session_kesiswaan");
  if (!session) return null;
  return session;
}
// KEUANGAN AUTH

export async function storeTokenKeuangan(data: string) {
  Cookies.set("session_keuangan", data, {
    expires: process.env.NODE_ENV === "development" ? 7 : 1,
  });
}

export async function logoutKeuangan() {
  const session = Cookies.get("session_keuangan");
  if (!session) return null;
  return session;
}

export async function getTokenKeuangan() {
  const session = Cookies.get("session_keuangan");
  if (!session) return null;
  return session;
}

export async function getTokenPerpus() {
  const session = Cookies.get("session_perpus");
  if (!session) return null;
  return session;
}

export async function storeTokenPerpus(data: string) {
  Cookies.set("session_perpus", data, {
    expires: process.env.NODE_ENV === "development" ? 7 : 1,
  });
}
