import React from "react";
import Sidebar from "../components/Sidebar";
import { Box, CheckCircle, AlertTriangle, Clock } from "lucide-react";

export default function Dashboard({ role, setRole, onLogout }) {
  const stats = [
    { title: "Total Aset", value: "142 Barang", icon: <Box className="text-blue-600" />, bg: "bg-blue-50" },
    {
      title: "Aset Tersedia",
      value: "120 Barang",
      icon: <CheckCircle className="text-green-600" />,
      bg: "bg-green-50",
    },
    { title: "Sedang Dipinjam", value: "15 Barang", icon: <Clock className="text-amber-600" />, bg: "bg-amber-50" },
    { title: "Aset Rusak", value: "7 Barang", icon: <AlertTriangle className="text-red-600" />, bg: "bg-red-50" },
  ];

  return (
    <div className="flex bg-slate-100 min-h-screen font-sans text-slate-800 w-full">
      <Sidebar currentRole={role} changeRole={setRole} onLogout={onLogout} />

      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center shadow-sm">
          <h2 className="text-xl font-bold tracking-tight">Dashboard Utama</h2>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-semibold">Nama Mahasiswa / Staf</p>
              <p className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded mt-0.5 inline-block font-medium">
                {role}
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
              U
            </div>
          </div>
        </header>

        <main className="p-8 flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between"
              >
                <div>
                  <p className="text-sm font-medium text-slate-500">{stat.title}</p>
                  <p className="text-2xl font-bold mt-1 text-slate-900">{stat.value}</p>
                </div>
                <div className={`p-3.5 rounded-xl ${stat.bg}`}>{stat.icon}</div>
              </div>
            ))}
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 min-h-[300px] flex items-center justify-center text-slate-400">
            [ Tempat grafik visual atau tabel log aktivitas peminjaman terbaru ]
          </div>
        </main>
      </div>
    </div>
  );
}
