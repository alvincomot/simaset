import React, { useState } from "react";
import { Lock, User, AlertCircle, Mail, X, CheckCircle2 } from "lucide-react";
import api from "../services/api";

export default function Login({ onLoginSuccess }) {
  const [nim, setNim] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [emailLupa, setEmailLupa] = useState("");
  const [errorModal, setErrorModal] = useState("");
  const [suksesModal, setSuksesModal] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!nim || !password) {
      setError("NIM/NIP dan Password wajib diisi!");
      return;
    }

    setLoading(true);

    try {
      setError("");

      const response = await api.post("/auth/login", {
        nim: nim,
        password: password,
      });

      const { token, user } = response.data.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      onLoginSuccess(user.role);
    } catch (err) {
      const pesanError = err.response?.data?.message || "NIM/NIP atau Password salah.";
      setError(pesanError);
    } finally {
      setLoading(false);
    }
  };

  // Lupa Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setErrorModal("");
    setSuksesModal("");

    if (!emailLupa) {
      setErrorModal("Email wajib diisi!");
      return;
    }

    // Validasi domain email @student
    if (!emailLupa.endsWith("@student.uksw.edu")) {
      setErrorModal("Sistem hanya menerima email mahasiswa dengan domain @student.uksw.edu");
      return;
    }

    setLoading(true);

    try {
      const extractedNim = emailLupa.split("@")[0];

      const response = await api.post("/auth/forgot-password", {
        nim: extractedNim,
      });

      if (response.data.status === "success") {
        setSuksesModal(response.data.message || "Link reset password berhasil dikirim!");
        setEmailLupa("");
      }
    } catch (err) {
      const pesanError = err.response?.data?.message || "Gagal memproses permintaan reset password.";
      setErrorModal(pesanError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100 relative">
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
                disabled={loading}
                onChange={(e) => setNim(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition text-sm outline-none"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider">Password</label>
              {/* button lupa pw */}
              <button
                type="button"
                disabled={loading}
                onClick={() => {
                  setIsModalOpen(true);
                  setErrorModal("");
                  setSuksesModal("");
                }}
                className="text-xs text-blue-600 hover:underline font-medium cursor-pointer"
              >
                Lupa Password?
              </button>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <Lock size={18} />
              </span>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                disabled={loading}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition text-sm outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-xl transition text-sm shadow-md shadow-blue-100 mt-2 cursor-pointer flex items-center justify-center disabled:opacity-50"
          >
            {loading ? "Memproses..." : "Masuk"}
          </button>
        </form>
      </div>

      {/* --- backdrop & modal lupa pw --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl relative border border-slate-100">
            {/* tombol close modal */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="mb-4">
              <h3 className="text-base font-bold text-slate-900">Reset Password</h3>
              <p className="text-xs text-slate-500 mt-1">
                Masukkan email student UKSW kamu untuk menerima tautan pemulihan kata sandi.
              </p>
            </div>

            {/* error / sukses state dalam Modal */}
            {errorModal && (
              <div className="mb-3 bg-rose-50 border border-rose-100 text-rose-600 p-3 rounded-xl text-xs flex items-start gap-1.5">
                <AlertCircle size={14} className="shrink-0 mt-0.5" />
                <span>{errorModal}</span>
              </div>
            )}

            {suksesModal && (
              <div className="mb-3 bg-emerald-50 border border-emerald-100 text-emerald-700 p-3 rounded-xl text-xs flex items-start gap-1.5 font-medium">
                <CheckCircle2 size={14} className="shrink-0 mt-0.5" />
                <span>{suksesModal}</span>
              </div>
            )}

            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Email Student
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <Mail size={16} />
                  </span>
                  <input
                    type="email"
                    placeholder="nim@student.uksw.edu"
                    value={emailLupa}
                    onChange={(e) => setEmailLupa(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-2 rounded-xl text-xs transition cursor-pointer disabled:opacity-50"
              >
                {loading ? "Memproses..." : "Kirim Tautan Reset"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
