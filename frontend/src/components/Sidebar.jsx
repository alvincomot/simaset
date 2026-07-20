import React from "react";
import { LayoutDashboard, Box, MapPin, ClipboardList, LogOut, Layers } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar({ currentRole, changeRole, onLogout }) {
  const location = useLocation();

  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <LayoutDashboard size={20} />,
      roles: ["SUPER_ADMIN", "STAFF", "USER"],
    },
    {
      name: "Katalog Aset",
      path: "/katalog-aset",
      icon: <Box size={20} />,
      roles: ["SUPER_ADMIN", "STAFF", "USER"],
    },
    {
      name: "Peminjaman Saya",
      path: "/peminjaman-saya",
      icon: <ClipboardList size={20} />,
      roles: ["USER"],
    },
    {
      name: "Persetujuan Pinjam",
      path: "/persetujuan-pinjam",
      icon: <ClipboardList size={20} />,
      roles: ["SUPER_ADMIN", "STAFF"],
    },
    {
      name: "Master Kategori",
      path: "/master-kategori",
      icon: <Layers size={20} />,
      roles: ["SUPER_ADMIN"],
    },
    {
      name: "Master Lokasi",
      path: "/master-lokasi",
      icon: <MapPin size={20} />,
      roles: ["SUPER_ADMIN"],
    },
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
            <option value="USER">Pengguna Biasa (Mhs)</option>
            <option value="STAFF">Manajer Aset (Staf)</option>
            <option value="SUPER_ADMIN">Super Admin (Koordinator)</option>
          </select>
        </div>

        <nav className="space-y-1">
          {filteredMenu.map((item, index) => {
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={index}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition font-medium ${
                  isActive ? "bg-blue-600 text-white" : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <button
        onClick={onLogout}
        className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-400 hover:text-red-400 hover:bg-red-950/30 rounded-xl text-sm transition font-medium mt-auto"
      >
        <LogOut size={20} />
        Keluar
      </button>
    </div>
  );
}
