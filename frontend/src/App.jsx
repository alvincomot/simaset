import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import KatalogAset from "./pages/KatalogAset";
import FormPinjam from "./pages/FormPinjam";
import PersetujuanPinjam from "./pages/PersetujuanPinjam";
import MasterKategori from "./pages/MasterKategori";
import MasterLokasi from "./pages/MasterLokasi";
import ResetPassword from "./pages/ResetPassword";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState("Pengguna Biasa");

  const handleLoginSuccess = (role) => {
    setUserRole(role);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  // Shared props untuk halaman setelah login (Dashboard & CRUD)
  const sharedProps = {
    role: userRole,
    setRole: setUserRole,
    onLogout: handleLogout,
  };

  return (
    <Router>
      <Routes>
        {/* public routes */}
        <Route
          path="/login"
          element={!isLoggedIn ? <Login onLoginSuccess={handleLoginSuccess} /> : <Navigate to="/dashboard" />}
        />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* protected routes */}
        <Route path="/dashboard" element={isLoggedIn ? <Dashboard {...sharedProps} /> : <Navigate to="/login" />} />
        <Route
          path="/katalog-aset"
          element={isLoggedIn ? <KatalogAset {...sharedProps} /> : <Navigate to="/login" />}
        />
        <Route
          path="/peminjaman-saya"
          element={isLoggedIn ? <FormPinjam {...sharedProps} /> : <Navigate to="/login" />}
        />
        <Route
          path="/persetujuan-pinjam"
          element={isLoggedIn ? <PersetujuanPinjam {...sharedProps} /> : <Navigate to="/login" />}
        />
        <Route
          path="/master-kategori"
          element={isLoggedIn ? <MasterKategori {...sharedProps} /> : <Navigate to="/login" />}
        />
        <Route
          path="/master-lokasi"
          element={isLoggedIn ? <MasterLokasi {...sharedProps} /> : <Navigate to="/login" />}
        />

        <Route path="*" element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} />} />
      </Routes>
    </Router>
  );
}
