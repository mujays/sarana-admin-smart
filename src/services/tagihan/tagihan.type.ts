import { TSiswa } from "../siswa/siswa.type";
import { TWali } from "../wali/wali.type";

export type TTagihan = {
  id: number;
  bulan: string;
  total: number;
  siswa_id: number;
  siswa: TSiswa;
  tagihan: string;
  jatuh_tempo: number;
  tahun_ajaran_id: 1;
  biaya: number;
  is_lunas: boolean;
  created_at: string;
  updated_at: string;
};

export type TTagihanAdmission = {
  bulan: string;
  total: number;
  id: number;
  tagihan: string;
  siswa_id: number;
  siswa: TSiswa;
  nama: string;
  tahun_ajaran_id: string;
  nominal: number;
  cicilan: number;
  pembayaran_sudah: number;
  keterangan: string;
  tanggal_mulai: string;
  tanggal_berakhir: string;
  status: string;
  created_at: string;
  updated_at: string;
};

export type RequestBodyTagihanDto = {
  bulan: number;
  tahun_ajaran: number;
  siswa_id: number;
  biaya: string;
};

export type TTransaction = {
  id: number;
  wali_id: number;
  tagihan_id: number;
  transaction_sid: string;
  catatan: string;
  transaction_id_ipaymu: string | null;
  status: string;
  buyer_payment: number;
  net_payment: number;
  wali: TWali;
  tagihan: TTagihan;
  transaction_fee: number;
  payment_at: string | null;
  payment_method: null | string;
  bukti_pembayaran: null | string;
  created_at: string;
  updated_at: string;
};

export type TTransactionAdmission = {
  id: number;
  uang_pangkal_id: number;
  payment_method: string;
  cicilan: number;
  payment_amount: number;
  status: string;
  net_payment: number;
  transaction_fee: number;
  buyer_payment: number;
  transaction_sid: string;
  transaction_id_ipaymu: string;
  payment_at: string;
  bukti_pembayaran: string;
  uang_pangkal: TTagihanAdmission;
  created_at: string;
  updated_at: string;
};
