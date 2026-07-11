import React, { useState } from "react";
import { Lock, User, AlertCircle } from "lucide-react";

export default function Login({ onLoginSuccess }) {
  const [nim, setNim] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    if (!nim || !password) {
      setError("NIM/NIP dan Password wajib diisi!");
      return;
    }

    // Simulasi Berhasil Login & Melempar data Role ke App.jsx
    console.log("Logging in with:", { nim, password });

    // Anggap saja jika NIM mengandung angka '1', dia jadi Admin. Sisanya user biasa.
    const mockRole = nim.includes("1") ? "Super Admin" : "Pengguna Biasa";
    onLoginSuccess(mockRole);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-blue-50 rounded-xl text-blue-600 mb-3 font-bold text-xl tracking-wider">
            SIMASET
          </div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Selamat Datang</h2>
          <p className="text-sm text-gray-500 mt-1">Sistem Informasi Manajemen Aset FTI UKSW</p>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl flex items-center gap-2 text-sm">
            <AlertCircle size={18} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">NIM / NIP</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <User size={18} />
              </span>
              <input
                type="text"
                placeholder="Contoh: 67202XXXX"
                value={nim}
                onChange={(e) => setNim(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <Lock size={18} />
              </span>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-xl transition text-sm shadow-md shadow-blue-100 mt-2"
          >
            Masuk
          </button>
        </form>
      </div>
    </div>
  );
}
