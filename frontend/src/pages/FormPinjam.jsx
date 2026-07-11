import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import { Calendar, Info, Clock, CheckCircle2, XCircle, RotateCcw } from "lucide-react";

export default function FormPinjam({ role, setRole, onLogout, onNavigate, currentPage }) {
  // State untuk Form Input
  const [barangId, setBarangId] = useState("");
  const [tanggalPinjam, setTanggalPinjam] = useState("");
  const [tenggatKembali, setTenggatKembali] = useState("");
  const [tujuan, setTujuan] = useState("");
  const [pesanSukses, setPesanSukses] = useState("");

  // Contoh data barang tersedia (Mock Data) untuk dropdown
  const barangTersedia = [
    { id: 1, kode: "AST-ELK-001", nama: "Proyektor Epson X500" },
    { id: 3, kode: "AST-FUR-001", nama: "Kursi Kuliah Chitose" },
  ];

  // Mock Data Riwayat Peminjaman Khusus Pengguna Ini (Sesuai Target PRD)
  const [riwayatSaya, setRiwayatSaya] = useState([
    {
      id: 101,
      barang: "Proyektor Epson X500",
      tanggalPinjam: "2026-07-15",
      tenggatKembali: "2026-07-18",
      status: "Pending",
    },
    {
      id: 102,
      barang: "Logitech WebCam C922",
      tanggalPinjam: "2026-06-01",
      tenggatKembali: "2026-06-03",
      status: "Dikembalikan",
    },
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setPesanSukses("");

    if (!barangId || !tanggalPinjam || !tenggatKembali || !tujuan) {
      alert("Semua kolom form wajib diisi!");
      return;
    }

    // Cari nama barang berdasarkan ID yang dipilih untuk dimasukkan ke riwayat
    const barangDipilih = barangTersedia.find((b) => b.id === parseInt(barangId));

    // Masukkan simulasi pengajuan baru ke baris paling atas riwayat saya
    const dataBaru = {
      id: Date.now(),
      barang: barangDipilih ? barangDipilih.nama : "Aset Tidak Dikenal",
      tanggalPinjam: tanggalPinjam,
      tenggatKembali: tenggatKembali,
      status: "Pending",
    };

    setRiwayatSaya([dataBaru, ...riwayatSaya]);
    setPesanSukses("Permintaan peminjaman berhasil dikirim! Menunggu persetujuan Manajer Aset.");

    // Reset Form
    setBarangId("");
    setTanggalPinjam("");
    setTenggatKembali("");
    setTujuan("");
  };

  return (
    <div className="flex bg-slate-100 min-h-screen font-sans text-slate-800 w-full">
      <Sidebar
        currentRole={role}
        changeRole={setRole}
        onLogout={onLogout}
        onNavigate={onNavigate}
        currentPage={currentPage}
      />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center shadow-sm">
          <h2 className="text-xl font-bold tracking-tight">Area Peminjaman Aset</h2>
          <span className="text-xs font-medium bg-amber-100 text-amber-700 px-3 py-1 rounded-full">{role}</span>
        </header>

        {/* Konten Utama Menggunakan Grid 2 Kolom */}
        <main className="p-8 flex-1 max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* KOLOM KIRI: FORMULIR PENGAJUAN (5/12 lebar layar) */}
          <div className="lg:col-span-5 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-5">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">Buat Pengajuan Baru</h3>

            <div className="bg-blue-50 border border-blue-100 text-blue-700 p-3.5 rounded-xl flex gap-3 text-xs leading-relaxed">
              <Info size={18} className="shrink-0 mt-0.5" />
              <p>Pengajuan memerlukan waktu persetujuan maksimal 1x24 jam oleh Manajer Aset.</p>
            </div>

            {pesanSukses && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-3.5 rounded-xl text-xs font-medium">
                {pesanSukses}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Pilih Barang Aset
                </label>
                <select
                  value={barangId}
                  onChange={(e) => setBarangId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm outline-none"
                >
                  <option value="">-- Pilih Barang --</option>
                  {barangTersedia.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.kode} - {b.nama}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Tanggal Pinjam
                  </label>
                  <input
                    type="date"
                    value={tanggalPinjam}
                    onChange={(e) => setTanggalPinjam(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Tenggat Kembali
                  </label>
                  <input
                    type="date"
                    value={tenggatKembali}
                    onChange={(e) => setTenggatKembali(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Tujuan Peminjaman
                </label>
                <textarea
                  rows="3"
                  placeholder="Kebutuhan kelas/tugas..."
                  value={tujuan}
                  onChange={(e) => setTujuan(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm outline-none resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl transition text-sm shadow-sm cursor-pointer"
              >
                Kirim Pengajuan
              </button>
            </form>
          </div>

          {/* KOLOM KANAN: STATUS & RIWAYAT SAYA (7/12 lebar layar) */}
          <div className="lg:col-span-7 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              Riwayat & Status Peminjaman Saya
            </h3>

            <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
              {riwayatSaya.map((item) => {
                // 1. Cek apakah barangnya telat berdasarkan tanggal hari ini
                const hariIni = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD
                const apakahTerlambat = item.status === "Disetujui" && hariIni > item.tenggatKembali;

                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200"
                  >
                    <div className="space-y-1">
                      <h4 className="font-semibold text-sm text-slate-800">{item.barang}</h4>
                      <p
                        className={`text-xs flex items-center gap-1 ${apakahTerlambat ? "text-rose-600 font-bold" : "text-slate-400"}`}
                      >
                        <Calendar size={12} /> {item.tanggalPinjam} s/d {item.tenggatKembali}
                        {apakahTerlambat && " (Terlambat!)"}
                      </p>
                    </div>

                    {/* Badges Status */}
                    <span
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                        apakahTerlambat
                          ? "bg-rose-100 text-rose-700 border border-rose-300"
                          : item.status === "Pending"
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : item.status === "Disetujui"
                              ? "bg-blue-50 text-blue-700 border border-blue-200"
                              : item.status === "Ditolak"
                                ? "bg-rose-50 text-rose-700 border border-rose-200"
                                : "bg-emerald-50 text-emerald-700 border border-emerald-200" // <- "Dikembalikan"
                      }`}
                    >
                      {apakahTerlambat ? "Terlambat" : item.status}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
