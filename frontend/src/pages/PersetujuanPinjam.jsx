import React, { useEffect, useState } from "react";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import { Check, X, Calendar, User, ArrowUpRight, ArrowDownLeft, Sliders, Loader2 } from "lucide-react";

export default function PersetujuanPinjam({ role, setRole, onLogout, onNavigate, currentPage }) {
  const [activeTab, setActiveTab] = useState("request");
  const [peminjamanData, setPeminjamanData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Ambil data semua transaksi peminjaman saat komponen dimuat
  useEffect(() => {
    fetchDataPeminjaman();
  }, []);

  const fetchDataPeminjaman = async () => {
    setLoading(true);
    try {
      const response = await api.get("/borrowing");
      setPeminjamanData(response.data.data);
    } catch (error) {
      console.error("Gagal mengambil data peminjaman:", error);
    } finally {
      setLoading(false);
    }
  };

  // approve / reject
  const handleAction = async (id, tindakan) => {
    try {
      const endpoint = tindakan === "SETUJUI" ? `/borrowing/approve/${id}` : `/borrowing/reject/${id}`;
      const response = await api.post(endpoint);

      if (response.data.status === "success") {
        alert(`Permintaan peminjaman berhasil ${tindakan === "SETUJUI" ? "disetujui" : "ditolak"}!`);
        fetchDataPeminjaman();
      }
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Gagal memproses tindakan.");
    }
  };

  // Proses Terima Pengembalian
  const handleCheckIn = async (id, kondisi) => {
    try {
      const response = await api.post(`/borrowing/return/${id}`, {
        kondisiKembali: kondisi.toUpperCase(),
        catatan: `Dikembalikan dengan kondisi ${kondisi}`,
      });

      if (response.data.status === "success") {
        alert(`Sukses! Barang berhasil dikembalikan dengan kondisi: ${kondisi}`);
        fetchDataPeminjaman();
      }
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Gagal memproses pengembalian.");
    }
  };

  const requests = peminjamanData.filter((item) => item.statusPeminjaman === "PENDING");
  const activeLoans = peminjamanData.filter((item) => item.statusPeminjaman === "AKTIF");

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
          <h2 className="text-xl font-bold tracking-tight">Persetujuan & Log Transaksi</h2>
          <span className="text-xs font-medium bg-purple-100 text-purple-700 px-3 py-1 rounded-full">{role}</span>
        </header>

        {/* Tab Selector Navigasi */}
        <div className="px-8 mt-6">
          <div className="flex border-b border-slate-200 max-w-4xl mx-auto">
            <button
              onClick={() => setActiveTab("request")}
              className={`flex items-center gap-2 py-3 px-4 font-semibold text-sm border-b-2 transition cursor-pointer ${
                activeTab === "request"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <ArrowUpRight size={16} />
              Antrean Pengajuan ({requests.length})
            </button>
            <button
              onClick={() => setActiveTab("dipinjam")}
              className={`flex items-center gap-2 py-3 px-4 font-semibold text-sm border-b-2 transition cursor-pointer ${
                activeTab === "dipinjam"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <ArrowDownLeft size={16} />
              Sedang Dipinjam / Check-In ({activeLoans.length})
            </button>
          </div>
        </div>

        {/* Konten Utama */}
        <main className="p-8 flex-1">
          <div className="max-w-4xl mx-auto space-y-6">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="animate-spin text-blue-600" size={32} />
              </div>
            ) : (
              <>
                {/* --- TAB 1: REQUEST PEMINJAMAN --- */}
                {activeTab === "request" &&
                  (requests.length === 0 ? (
                    <div className="bg-white text-center py-12 rounded-2xl border border-slate-200 text-slate-500">
                      Tidak ada antrean pengajuan peminjaman saat ini.
                    </div>
                  ) : (
                    requests.map((item) => (
                      <div
                        key={item.id}
                        className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between gap-6"
                      >
                        <div className="space-y-4 flex-1">
                          <div className="flex items-center gap-3">
                            <div className="bg-slate-100 p-2 rounded-lg text-slate-600">
                              <User size={18} />
                            </div>
                            <div>
                              <h4 className="font-semibold text-base text-slate-900">
                                {item.user?.namaLengkap || "N/A"}
                              </h4>
                              <p className="text-xs text-slate-500">{item.user?.nim || "N/A"}</p>
                            </div>
                            <span className="ml-auto text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-700">
                              Menunggu
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <div>
                              <span className="text-xs font-medium text-slate-400 block mb-0.5">BARANG</span>
                              <span className="font-medium text-slate-700">{item.asset?.namaAset}</span>
                            </div>
                            <div>
                              <span className="text-xs font-medium text-slate-400 block mb-0.5">DURASI PINJAM</span>
                              <span className="font-medium text-slate-700 flex items-center gap-1.5 text-xs">
                                <Calendar size={14} className="text-slate-400" />
                                {new Date(item.tanggalPinjam).toLocaleDateString("id-ID")} s/d{" "}
                                {new Date(item.tenggatWaktu).toLocaleDateString("id-ID")}
                              </span>
                            </div>
                          </div>
                          <div>
                            <span className="text-xs font-medium text-slate-400 block mb-1">
                              ALASAN / TUJUAN / CATATAN
                            </span>
                            <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                              {item.catatan || "Tidak ada catatan."}
                            </p>
                          </div>
                        </div>

                        <div className="flex md:flex-col justify-end gap-3 shrink-0 self-end md:self-center w-full md:w-auto">
                          <button
                            onClick={() => handleAction(item.id, "SETUJUI")}
                            className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-4 py-2.5 rounded-xl text-sm transition shadow-sm cursor-pointer"
                          >
                            <Check size={16} /> Setujui
                          </button>
                          <button
                            onClick={() => handleAction(item.id, "TOLAK")}
                            className="flex-1 flex items-center justify-center gap-2 bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100 font-medium px-4 py-2.5 rounded-xl text-sm transition cursor-pointer"
                          >
                            <X size={16} /> Tolak
                          </button>
                        </div>
                      </div>
                    ))
                  ))}

                {/* --- TAB 2: PEMINJAMAN AKTIF & VERIFIKASI CHECK-IN --- */}
                {activeTab === "dipinjam" &&
                  (activeLoans.length === 0 ? (
                    <div className="bg-white text-center py-12 rounded-2xl border border-slate-200 text-slate-500">
                      Tidak ada aset yang sedang dipinjam saat ini.
                    </div>
                  ) : (
                    activeLoans.map((item) => {
                      const hariIni = new Date().toISOString().split("T")[0];
                      const tenggatFormat = new Date(item.tenggatWaktu).toISOString().split("T")[0];
                      const apakahTerlambat = hariIni > tenggatFormat;

                      return (
                        <div
                          key={item.id}
                          className={`bg-white rounded-2xl shadow-sm border p-6 flex flex-col md:flex-row justify-between gap-6 border-l-4 ${
                            apakahTerlambat ? "border-rose-500 border-l-rose-500" : "border-slate-200 border-l-blue-500"
                          }`}
                        >
                          <div className="space-y-4 flex-1">
                            <div className="flex items-center gap-3">
                              <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
                                <User size={18} />
                              </div>
                              <div>
                                <h4 className="font-semibold text-base text-slate-900">{item.user?.namaLengkap}</h4>
                                <p className="text-xs text-slate-500">{item.user?.nim}</p>
                              </div>
                              <span
                                className={`ml-auto text-xs font-semibold px-2.5 py-1 rounded-full ${
                                  apakahTerlambat ? "bg-rose-100 text-rose-700" : "bg-blue-100 text-blue-700"
                                }`}
                              >
                                {apakahTerlambat ? "Terlambat" : "Sedang Dipinjam"}
                              </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm bg-slate-50 p-4 rounded-xl border border-slate-100">
                              <div>
                                <span className="text-xs font-medium text-slate-400 block mb-0.5">
                                  BARANG YANG DIBAWA
                                </span>
                                <span className="font-bold text-slate-800">{item.asset?.namaAset}</span>
                              </div>
                              <div>
                                <span className="text-xs font-medium text-slate-400 block mb-0.5">
                                  TENGGAT PENGEMBALIAN
                                </span>
                                <span
                                  className={`flex items-center gap-1.5 text-xs font-bold ${apakahTerlambat ? "text-rose-600" : "text-slate-600"}`}
                                >
                                  <Calendar size={14} /> Harus Kembali:{" "}
                                  {new Date(item.tenggatWaktu).toLocaleDateString("id-ID")}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* VERIFIKASI KONDISI BARANG SAAT DIKEMBALIKAN */}
                          <div className="flex md:flex-col justify-end gap-2 shrink-0 w-full md:w-56 bg-slate-50 p-4 rounded-xl border border-slate-200">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-1">
                              <Sliders size={12} /> Verifikasi Kondisi:
                            </span>
                            <button
                              onClick={() => handleCheckIn(item.id, "Baik")}
                              className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 rounded-lg text-xs transition cursor-pointer shadow-sm"
                            >
                              <Check size={14} /> Terima (Kondisi Baik)
                            </button>
                            <button
                              onClick={() => handleCheckIn(item.id, "Rusak")}
                              className="w-full flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-medium py-2 rounded-lg text-xs transition cursor-pointer shadow-sm"
                            >
                              <X size={14} /> Terima (Kondisi Rusak)
                            </button>
                          </div>
                        </div>
                      );
                    })
                  ))}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
