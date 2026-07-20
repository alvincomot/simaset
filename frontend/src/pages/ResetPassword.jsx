import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function ResetPassword() {
  const { token } = useParams(); // Menangkap :token dari router URL
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return setError("Konfirmasi password baru tidak cocok.");
    }

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await api.post(`/auth/reset-password/${token}`, { newPassword });
      setMessage(response.data.message);

      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Gagal mereset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white border border-slate-200 rounded-2xl shadow-sm">
      <h2 className="text-xl font-bold text-slate-800 mb-4">Buat Password Baru</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-slate-600 mb-1">Password Baru</label>
          <input
            type="password"
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-600 mb-1">Konfirmasi Password Baru</label>
          <input
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Memproses..." : "Perbarui Password"}
        </button>
      </form>
      {message && <p className="text-sm text-green-600 mt-3 p-3 bg-green-50 rounded-xl">{message}</p>}
      {error && <p className="text-sm text-red-600 mt-3 p-3 bg-red-50 rounded-xl">{error}</p>}
    </div>
  );
}
