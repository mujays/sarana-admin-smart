import { TKelas } from "../kelas/kelas.type";

export type TType = {
  id: number;
  code: string;
  status: string;
  name: string;
  jenis: string;
  kelas_id: number | null;
  biaya: 15000000;
  tanggal: 6;
  created_at: string;
  updated_at: string;
};

export type TTypeAdmission = {
  id: number;
  code: string;
  status: string;
  nama: string;
  kelas_id: number;
  kelas: TKelas;
  nominal: number;
  cicilan: number;
  periode: string;
  jatuh_tempo: string;
  keterangan: string;
  created_at: string;
  updated_at: string;
};
