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

export type TSemester = {
  id: number;
  tahun_ajaran_id: number;
  nama: string;
  nomor: number;
  tanggal_mulai: string;
  tanggal_akhir: string;
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

export type SemesterDto = {
  nama: string;
  nomor: number;
  is_active: boolean;
  tahun_ajaran_id: number;
  tanggal_akhir: string;
  tanggal_mulai: string;
};

export type TRaport = {
  id: number;
  siswa_id: number;
  kelas_id: number;
  semester_id: number;
  mata_pelajaran_id: number;
  nilai_angka: number;
  nilai_huruf: string;
  predikat: string;
  catatan: string;
  created_at: string;
  updated_at: string;
  deleted_at: null | string;
  semester: TSemester;
  mata_pelajaran: TMataPelajaran;
};

export type RaportDto = {
  nilai: {
    catatan: string;
    kelas_id: number;
    mata_pelajaran_id: number;
    nilai_angka: number;
    semester_id: number;
    siswa_id: number;
  }[];
};
