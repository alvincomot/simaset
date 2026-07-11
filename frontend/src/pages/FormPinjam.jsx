import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import { Calendar, Info, FileText } from "lucide-react";

export default function FormPinjam({ role, setRole, onLogout, onNavigate, currentPage }) {
  // State untuk Form Input
  const [barangId, setBarangId] = useState("");
  const [tanggalPinjam, setTanggalPinjam] = useState("");
  const [tenggatKembali, setTenggatKembali] = useState("");
  const [tujuan, setTujuan] = useState("");
  const [pesanSukses, setPesanSukses] = useState("");

  // Contoh data barang tersedia (Mock Data) untuk dipilih di dropdown
  const barangTersedia = [
    { id: 1, kode: "AST-ELK-001", nama: "Proyektor Epson X500" },
    { id: 3, kode: "AST-FUR-001", nama: "Kursi Kuliah Chitose" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setPesanSukses("");

    if (!barangId || !tanggalPinjam || !tenggatKembali || !tujuan) {
      alert("Semua kolom form wajib diisi!");
      return;
    }

    setPesanSukses("Permintaan peminjaman berhasil dikirim! Menunggu persetujuan Manajer Aset.");

    // Reset Form
    setBarangId("");
    setTanggalPinjam("");
    setTenggatKembali("");
    setTujuan("");
  };

  return (
    <div className="flex bg-slate-100 min-h-screen font-sans text-slate-800 w-full">
      {/* Pasang Sidebar dengan prop lengkap yang sudah kita perbaiki tadi */}
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
          <h2 className="text-xl font-bold tracking-tight">Formulir Pengajuan Peminjaman</h2>
          <span className="text-xs font-medium bg-amber-100 text-amber-700 px-3 py-1 rounded-full">{role}</span>
        </header>

        {/* Konten Utama */}
        <main className="p-8 flex-1 flex justify-center items-start">
          <div className="max-w-xl w-full bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
            {/* Info Box */}
            <div className="mb-6 bg-blue-50 border border-blue-100 text-blue-700 p-4 rounded-xl flex gap-3 text-sm">
              <Info size={20} className="shrink-0 mt-0.5" />
              <p>
                Sesuai aturan kampus, pengajuan peminjaman barang inventaris FTI memerlukan waktu persetujuan maksimal
                1x24 jam oleh Manajer Aset.
              </p>
            </div>

            {/* Notifikasi Sukses */}
            {pesanSukses && (
              <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-700 p-4 rounded-xl text-sm font-medium">
                {pesanSukses}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Pilih Barang */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                  Pilih Barang Aset
                </label>
                <select
                  value={barangId}
                  onChange={(e) => setBarangId(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm outline-none"
                >
                  <option value="">-- Pilih Barang yang Tersedia --</option>
                  {barangTersedia.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.kode} - {b.nama}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tanggal Pinjam & Tenggat */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                    Tanggal Pinjam
                  </label>
                  <input
                    type="date"
                    value={tanggalPinjam}
                    onChange={(e) => setTanggalPinjam(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                    Tenggat Pengembalian
                  </label>
                  <input
                    type="date"
                    value={tenggatKembali}
                    onChange={(e) => setTenggatKembali(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm outline-none"
                  />
                </div>
              </div>

              {/* Tujuan Pinjam */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                  Tujuan Peminjaman
                </label>
                <textarea
                  rows="4"
                  placeholder="Contoh: Digunakan untuk presentasi tugas akhir matakuliah PBP di Ruang Kelas FTI..."
                  value={tujuan}
                  onChange={(e) => setTujuan(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm outline-none resize-none"
                ></textarea>
              </div>

              {/* Tombol Submit */}
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-xl transition text-sm shadow-md shadow-blue-100 cursor-pointer"
              >
                Kirim Pengajuan Pinjaman
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
