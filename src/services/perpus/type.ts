export type TBooks = {
  id: number;
  isbn: string;
  judul: string;
  penulis: string;
  penerbit: string;
  tahun_terbit: number;
  stok: number;
  created_at: string;
  updated_at: string;
};

export type BorrowDto = {
  borrower_id: number;
  buku_id: number;
  durasi_hari: number;
};

export type TBorrow = {
  id: number;
  borrower_id: number;
  buku_id: number;
  tanggal_pinjam: string;
  tanggal_jatuh_tempo: string;
  tanggal_kembali: string;
  denda: number;
  created_at: string;
  updated_at: string;
  borrower: {
    id: number;
    name: string;
    email: string;
    username: string;
    role: string;
  };
  book: {
    id: number;
    isbn: string;
    judul: string;
    penulis: string;
    penerbit: string;
    tahun_terbit: number;
    stok: number;
    created_at: string;
    updated_at: string;
  };
};
