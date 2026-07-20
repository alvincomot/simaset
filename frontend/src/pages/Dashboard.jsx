import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { Box, CheckCircle, AlertTriangle, Clock } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import api from "../services/api";

export default function Dashboard({ role, setRole, onLogout, onNavigate }) {
  const [namaLengkap, setNamaLengkap] = useState("User");
  const [stats, setStats] = useState({
    totalAssets: 0,
    borrowedAssets: 0,
    damageAssets: 0,
  });

  const fetchStats = async () => {
    try {
      const response = await api.get("/assets/stats");
      setStats(response.data.data);
    } catch (error) {
      console.error("Gagal mengambil statistik:", error);
    }
  };

  useEffect(() => {
    fetchStats();

    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      const userObj = JSON.parse(loggedInUser);
      setNamaLengkap(userObj.namaLengkap || "User");
    }
  }, []);

  const statCards = [
    {
      title: "Total Aset",
      value: `${stats.totalAssets} Barang`,
      icon: <Box className="text-blue-600" />,
      bg: "bg-blue-50",
    },
    {
      title: "Sedang Dipinjam",
      value: `${stats.borrowedAssets} Barang`,
      icon: <Clock className="text-amber-600" />,
      bg: "bg-amber-50",
    },
    {
      title: "Aset Rusak",
      value: `${stats.damageAssets} Barang`,
      icon: <AlertTriangle className="text-red-600" />,
      bg: "bg-red-50",
    },
    {
      title: "Aset Tersedia",
      value: `${stats.totalAssets - stats.borrowedAssets - stats.damageAssets} Barang`,
      icon: <CheckCircle className="text-green-600" />,
      bg: "bg-green-50",
    },
  ];

  const chartData = [
    {
      name: "Total",
      jumlah: stats.totalAssets,
    },
    {
      name: "Tersedia",
      jumlah: stats.totalAssets - stats.borrowedAssets - stats.damageAssets,
    },
    {
      name: "Dipinjam",
      jumlah: stats.borrowedAssets,
    },
    {
      name: "Rusak",
      jumlah: stats.damageAssets,
    },
  ];

  return (
    <div className="flex bg-slate-100 min-h-screen font-sans text-slate-800 w-full">
      <Sidebar
        currentRole={role}
        changeRole={setRole}
        onLogout={onLogout}
        onNavigate={onNavigate}
        currentPage="Dashboard"
      />

      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center shadow-sm">
          <h2 className="text-xl font-bold tracking-tight">Dashboard Utama</h2>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-semibold">{namaLengkap}</p>
              <p className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded mt-0.5 inline-block font-medium">
                {role}
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
              {namaLengkap.charAt(0)}
            </div>
          </div>
        </header>

        <main className="p-8 flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((stat, idx) => (
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

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold mb-6">Statistik Aset</h3>

            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="name" />

                <YAxis allowDecimals={false} />

                <Tooltip />

                <Bar dataKey="jumlah" radius={[8, 8, 0, 0]} fill="#2563eb" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </main>
      </div>
    </div>
  );
}
