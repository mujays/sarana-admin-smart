import { useEffect, useState } from "react";

export const useStoreCSR = <T, F>(
  store: (callback: (state: T) => unknown) => unknown,
  callback: (state: T) => F,
) => {
  const result = store(callback) as F;
  const [data, setData] = useState<F>();

  useEffect(() => {
    setData(result);
  }, [result]);

  return data;
};

export function renderClassText(classNumber: number, type: string) {
  if (classNumber >= 1 && classNumber <= 6) {
    return `${classNumber} ${type.toUpperCase()}`;
  } else if (classNumber >= 7 && classNumber <= 9) {
    return `${classNumber - 6} ${type.toUpperCase()}`;
  } else {
    return "Invalid class number";
  }
}

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export function numberToWordsID(nominal: number): string {
  const satuan = [
    "",
    "satu",
    "dua",
    "tiga",
    "empat",
    "lima",
    "enam",
    "tujuh",
    "delapan",
    "sembilan",
    "sepuluh",
    "sebelas",
  ];

  function terbilang(n: number): string {
    if (n < 12) {
      return satuan[n];
    } else if (n < 20) {
      return `${satuan[n - 10]} belas`;
    } else if (n < 100) {
      const puluhan = Math.floor(n / 10);
      const sisa = n % 10;
      return `${satuan[puluhan]} puluh${sisa ? " " + satuan[sisa] : ""}`;
    } else if (n < 200) {
      return `seratus${n - 100 ? " " + terbilang(n - 100) : ""}`;
    } else if (n < 1000) {
      const ratusan = Math.floor(n / 100);
      const sisa = n % 100;
      return `${satuan[ratusan]} ratus${sisa ? " " + terbilang(sisa) : ""}`;
    } else if (n < 2000) {
      return `seribu${n - 1000 ? " " + terbilang(n - 1000) : ""}`;
    } else if (n < 1000000) {
      const ribuan = Math.floor(n / 1000);
      const sisa = n % 1000;
      return `${terbilang(ribuan)} ribu${sisa ? " " + terbilang(sisa) : ""}`;
    } else if (n < 1000000000) {
      const jutaan = Math.floor(n / 1000000);
      const sisa = n % 1000000;
      return `${terbilang(jutaan)} juta${sisa ? " " + terbilang(sisa) : ""}`;
    } else if (n < 1000000000000) {
      const milyaran = Math.floor(n / 1000000000);
      const sisa = n % 1000000000;
      return `${terbilang(milyaran)} miliar${
        sisa ? " " + terbilang(sisa) : ""
      }`;
    } else {
      return "nominal terlalu besar";
    }
  }

  const hasil = terbilang(nominal).trim();
  return hasil ? hasil + " rupiah" : "";
}
