export type TClient = {
  nama: string;
  saldo: number;
  saldo_yang_bisa_ditarik: number;
  alamat: string | null;
  no_telp_pic: string | null;
  pic: string | null;
  norek: string | null;
  bank: string | null;
  created_at: string;
  updated_at: string;
};

export type TWithdraw = {
  id: number;
  internal_id: number;
  jumlah: number;
  biaya_penarikan: number;
  by: string;
  status: string;
  di_transfer_oleh: null | string;
  transfer_at: null | string;
  created_at: Date;
  updated_at: Date;
};
export type TApps = {
  id: number;
  app_id: number;
  fee_per_transaction: number;
  fee_per_withdrawal: number;
  type: string;
  created_at: Date;
  updated_at: Date;
};
export type TBalance = {
  id: number;
  nama: string;
  email: string;
  type: string;
  status: string;
  saldo: number;
  saldo_yang_bisa_ditarik: number;
  alamat: string;
  no_telp_pic: string;
  pic: string;
  email_pic: string;
  norek: string;
  bank: string;
  xendit_customer_id: string;
  xendit_customer_secret: string;
  xendit_token: string;
  xendit_bank_code: string;
  created_at: Date;
  updated_at: Date;
};
