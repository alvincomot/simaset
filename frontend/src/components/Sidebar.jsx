import React from "react";
import { LayoutDashboard, Box, MapPin, ClipboardList, LogOut, Layers } from "lucide-react";

export default function Sidebar({ currentRole, changeRole, onLogout, onNavigate, currentPage }) {
  const menuItems = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      roles: ["Super Admin", "Manajer Aset", "Pengguna Biasa"],
    },
    { name: "Katalog Aset", icon: <Box size={20} />, roles: ["Super Admin", "Manajer Aset", "Pengguna Biasa"] },
    { name: "Peminjaman Saya", icon: <ClipboardList size={20} />, roles: ["Pengguna Biasa"] },
    { name: "Persetujuan Pinjam", icon: <ClipboardList size={20} />, roles: ["Super Admin", "Manajer Aset"] },
    { name: "Master Kategori", icon: <Layers size={20} />, roles: ["Super Admin"] },
    { name: "Master Lokasi", icon: <MapPin size={20} />, roles: ["Super Admin"] },
  ];

  const filteredMenu = menuItems.filter((item) => item.roles.includes(currentRole));

  return (
    <div className="w-64 bg-slate-900 text-white min-h-screen flex flex-col justify-between p-4">
      <div>
        <div className="flex items-center gap-2 px-2 py-4 mb-6 border-b border-slate-800">
          <div className="bg-blue-600 p-2 rounded-lg font-bold text-xs">FTI</div>
          <div>
            <h1 className="font-bold text-sm tracking-wide">SIMASET</h1>
            <p className="text-xs text-slate-400">UKSW</p>
          </div>
        </div>

        <div className="mb-6 p-2 bg-slate-800 rounded-xl">
          <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">Simulasi Role:</label>
          <select
            value={currentRole}
            onChange={(e) => changeRole(e.target.value)}
            className="w-full bg-slate-700 text-xs rounded p-1 text-white outline-none"
          >
            <option value="Pengguna Biasa">Pengguna Biasa (Mhs)</option>
            <option value="Manajer Aset">Manajer Aset (Staf)</option>
            <option value="Super Admin">Super Admin (Koordinator)</option>
          </select>
        </div>

        <nav className="space-y-1">
          {filteredMenu.map((item, index) => (
            <button
              key={index}
              onClick={() => onNavigate(item.name)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition font-medium ${
                item.name === currentPage
                  ? "bg-blue-600 text-white"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              {item.icon}
              {item.name}
            </button>
          ))}
        </nav>
      </div>

      <button
        onClick={onLogout}
        className="flex items-center gap-3 px-3 py-2.5 text-slate-400 hover:text-red-400 hover:bg-red-950/30 rounded-xl text-sm transition font-medium mt-auto"
      >
        <LogOut size={20} />
        Keluar
      </button>
    </div>
  );
}
