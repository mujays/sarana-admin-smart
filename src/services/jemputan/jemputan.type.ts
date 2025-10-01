import { TSiswa } from "../siswa/siswa.type";

export type TJemputan = {
  id: number;
  siswa_id: number;
  code: string;
  date_pickup: null | string;
  time_pickup: null | string;
  expired_at: string;
  address: null | string;
  phone: null | string;
  name: null | string;
  note: null | string;
  status: boolean;
  is_used: boolean;
  created_at: string;
  updated_at: string;
  siswa: TSiswa;
};
