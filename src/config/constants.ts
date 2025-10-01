export const API_MOCKING = process.env.NEXT_PUBLIC_API_MOCKING === "true";

export const IS_DEVELOPMENT = process.env.NODE_ENV === "development";
export const IS_TEST = process.env.NODE_ENV === "test";
export const IS_PRODUCTION = process.env.NODE_ENV === "production";

export const IS_BROWSER = typeof window !== "undefined";
export const IS_SERVER = typeof window === "undefined";

export const MONTS_OPTIONS = [
  { value: 0, label: "Januari" },
  { value: 1, label: "Februari" },
  { value: 2, label: "Maret" },
  { value: 3, label: "April" },
  { value: 4, label: "Mei" },
  { value: 5, label: "Juni" },
  { value: 6, label: "Juli" },
  { value: 7, label: "Agustus" },
  { value: 8, label: "September" },
  { value: 9, label: "Oktober" },
  { value: 10, label: "November" },
  { value: 11, label: "Desember" },
];
