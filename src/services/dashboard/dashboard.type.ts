// ======================
// Shared Types
// ======================
interface ChartItem {
  label: string;
  value: number;
  percentage?: number;
  color: string;
}

interface RecapItem {
  label: string;
  value: number;
  color: string;
}

// ======================
// Jumlah Siswa
// ======================
interface JumlahSiswa {
  total: number;
  laki_laki: number;
  perempuan: number;
  chart: ChartItem[];
}

// ======================
// Kalender Akademik
// ======================
interface KalenderAkademik {
  year: number;
  month: number;
  month_name: string;
  tahun_ajaran: string;
  days_in_month: number;
  first_day_of_week: number;
}

// ======================
// Keterangan
// ======================
interface FormStatus {
  pending: number;
  approved: number;
  total: number;
}

interface Keterangan {
  form_siswa: FormStatus;
  form_pindahan: FormStatus;
  items: RecapItem[];
}

// ======================
// Alumni
// ======================
interface RecapAlumniByYear {
  year: number;
  total: number;
}

interface RecapAlumni {
  total: number;
  by_year: RecapAlumniByYear[];
}

// ======================
// Kelas
// ======================
interface RecapKelas {
  id: number;
  nama: string;
  jumlah_siswa: number;
}

// ======================
// Wali
// ======================
interface RecapWali {
  total: number;
  with_siswa: number;
  without_siswa: number;
}

// ======================
// Root Response
// ======================
export interface DashboardResponse {
  jumlah_siswa: JumlahSiswa;
  kalender_akademik: KalenderAkademik;
  keterangan: Keterangan;
  recap_alumni: RecapAlumni;
  recap_kelas: RecapKelas[];
  recap_wali: RecapWali;
}
