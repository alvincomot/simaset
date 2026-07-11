import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import { Check, X, Calendar, User, FileText } from "lucide-react";

export default function PersetujuanAset({ role, setRole, onLogout, onNavigate, currentPage }) {
  // Mock Data Pengajuan dari Mahasiswa
  const [pengajuanList, setPengajuanList] = useState([
    {
      id: 1,
      namaPeminjam: "Andi Saputra",
      nim: "A11.2023.12345",
      barang: "Proyektor Epson X500",
      tanggalPinjam: "2026-07-15",
      tenggatKembali: "2026-07-18",
      tujuan: "Digunakan untuk presentasi tugas akhir matakuliah PBP di Ruang Kelas FTI.",
      status: "Pending",
    },
    {
      id: 2,
      namaPeminjam: "Siti Rahma",
      nim: "A11.2023.54321",
      barang: "Kursi Kuliah Chitose",
      tanggalPinjam: "2026-07-20",
      tenggatKembali: "2026-07-21",
      tujuan: "Kekurangan kursi untuk acara seminar himpunan mahasiswa di Aula Gedung H.",
      status: "Pending",
    },
  ]);

  const handleAction = (id, tindakan) => {
    setPengajuanList((prevList) => prevList.map((item) => (item.id === id ? { ...item, status: tindakan } : item)));
  };

  return (
    <div className="flex bg-slate-100 min-h-screen font-sans text-slate-800 w-full">
      {/* Sidebar */}
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
          <h2 className="text-xl font-bold tracking-tight">Persetujuan Peminjaman Aset</h2>
          <span className="text-xs font-medium bg-purple-100 text-purple-700 px-3 py-1 rounded-full">{role}</span>
        </header>

        {/* Konten Utama */}
        <main className="p-8 flex-1">
          <div className="max-w-4xl mx-auto space-y-6">
            {pengajuanList.length === 0 ? (
              <div className="bg-white text-center py-12 rounded-2xl border border-slate-200 text-slate-500">
                Tidak ada pengajuan peminjaman saat ini.
              </div>
            ) : (
              pengajuanList.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between gap-6 transition hover:shadow-md"
                >
                  {/* Detail Pengajuan */}
                  <div className="space-y-4 flex-1">
                    <div className="flex items-center gap-3">
                      <div className="bg-slate-100 p-2 rounded-lg text-slate-600">
                        <User size={18} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-base text-slate-900">{item.namaPeminjam}</h4>
                        <p className="text-xs text-slate-500">{item.nim}</p>
                      </div>

                      {/* Badge Status */}
                      <span
                        className={`ml-auto md:ml-4 text-xs font-semibold px-2.5 py-1 rounded-full ${
                          item.status === "Pending"
                            ? "bg-amber-100 text-amber-700"
                            : item.status === "Disetujui"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-rose-100 text-rose-700"
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <div>
                        <span className="text-xs font-medium text-slate-400 block mb-0.5">BARANG</span>
                        <span className="font-medium text-slate-700">{item.barang}</span>
                      </div>
                      <div>
                        <span className="text-xs font-medium text-slate-400 block mb-0.5">DURASI PINJAM</span>
                        <span className="font-medium text-slate-700 flex items-center gap-1.5 text-xs">
                          <Calendar size={14} className="text-slate-400" />
                          {item.tanggalPinjam} s/d {item.tenggatKembali}
                        </span>
                      </div>
                    </div>

                    <div>
                      <span className="text-xs font-medium text-slate-400 block mb-1">ALASAN / TUJUAN</span>
                      <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                        {item.tujuan}
                      </p>
                    </div>
                  </div>

                  {/* Tombol Aksi (Hanya muncul jika status masih Pending) */}
                  {item.status === "Pending" && (
                    <div className="flex md:flex-col justify-end gap-3 shrink-0 self-end md:self-center w-full md:w-auto">
                      <button
                        onClick={() => handleAction(item.id, "Disetujui")}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-4 py-2.5 rounded-xl text-sm transition shadow-sm cursor-pointer"
                      >
                        <Check size={16} /> Setujui
                      </button>
                      <button
                        onClick={() => handleAction(item.id, "Ditolak")}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100 font-medium px-4 py-2.5 rounded-xl text-sm transition cursor-pointer"
                      >
                        <X size={16} /> Tolak
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
