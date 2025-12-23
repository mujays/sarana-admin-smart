export type TMataPelajaran = {
  id: number;
  kode: string;
  nama: string;
  deskripsi: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type MataPelajaranDto = {
  deskripsi: string;
  is_active: boolean;
  kode: string;
  nama: string;
};
