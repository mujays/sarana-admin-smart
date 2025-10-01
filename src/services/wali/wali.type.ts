import { TSiswa } from "../siswa/siswa.type";

export type TWali = {
  id: number;
  siswa_id: number;
  email: string;
  password: string;
  nama: string;
  hubungan: string;
  no_hp: string;
  pekerjaan: string;
  gaji: string;
  siswa_count: number;
  siswa?: TSiswa[];
  created_at: string;
  updated_at: string;
};
