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

// ======================
// Dashboard Keuangan
// ======================
interface Pemasukan {
  total: number;
  target: number;
  percentage: number;
  formatted: string;
}

interface Saldo {
  balance: number;
  formatted: string;
}

interface JumlahSiswaKeuangan {
  total: number;
  aktif: number;
  non_aktif: number;
}

interface TagihanStatus {
  lunas: number;
  belum_lunas: number;
  melampaui_tempo: number;
  belum_melampaui_tempo: number;
}

interface UangPangkalStatus {
  lunas: number;
  diangsur: number;
  belum_lunas: number;
}

interface SummaryItem {
  label: string;
  value: number;
  color: string;
}

interface RiwayatTransaksi {
  tagihan: TagihanStatus;
  transaksi_pending: number;
  uang_pangkal: UangPangkalStatus;
  summary: SummaryItem[];
}

interface JalurTempoItem {
  label: string;
  value: number;
  color: string;
}

interface TagihanChartItem {
  bulan: string;
  bulan_number: number;
  total_tagihan: number;
  tagihan_lunas: number;
  pembayaran: number;
}

interface UangPangkalSummaryFormatted {
  total_kewajiban: string;
  total_terbayar: string;
  sisa_tagihan: string;
}

interface UangPangkalSummary {
  total_kewajiban: number;
  total_terbayar: number;
  sisa_tagihan: number;
  percentage: number;
  formatted: UangPangkalSummaryFormatted;
}

export interface DashboardKeuanganResponse {
  pemasukan: Pemasukan;
  saldo: Saldo;
  jumlah_siswa: JumlahSiswaKeuangan;
  riwayat_transaksi: RiwayatTransaksi;
  jalur_tempo_tagihan: JalurTempoItem[];
  tagihan_chart: TagihanChartItem[];
  uang_pangkal_summary: UangPangkalSummary;
}
