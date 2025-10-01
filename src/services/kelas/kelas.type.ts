import { TSiswa } from "../siswa/siswa.type";
import { TTahunAjaran } from "../tahun-ajaran/tahun-ajaran.type";

export type TKelas = {
  id: number;
  tahun_ajaran_id: number;
  tingkatan_id: number;
  nama: string;
  description: string;
  created_at: string;
  updated_at: string;
  siswa: TSiswa[];
  siswa_count: number;
  tahun_ajaran: TTahunAjaran;
};
