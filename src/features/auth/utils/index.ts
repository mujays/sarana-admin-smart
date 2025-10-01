import { TAuthStore } from "@/stores/auth";

export const getAuthStatus = (
  authStore?: TAuthStore,
): "loading" | "authenticated" | "not-authenticated" => {
  if (authStore === undefined) return "loading";

  return authStore?.user === null ? "not-authenticated" : "authenticated";
};
