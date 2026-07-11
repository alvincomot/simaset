import React, { useState } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import KatalogAset from "./pages/KatalogAset";
import FormPinjam from "./pages/FormPinjam";
import PersetujuanPinjam from "./pages/PersetujuanPinjam";
import MasterKategori from "./pages/MasterKategori";
import MasterLokasi from "./pages/MasterLokasi";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState("Pengguna Biasa");
  const [currentPage, setCurrentPage] = useState("Dashboard");

  const handleLoginSuccess = (role) => {
    setUserRole(role);
    setIsLoggedIn(true);
    setCurrentPage("Dashboard");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  // 1. PROTEKSI LOGIN
  if (!isLoggedIn) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  // 2. LOGIKA RENDERING HALAMAN MENGGUNAKAN SWITCH CASE
  const renderPage = () => {
    const sharedProps = {
      role: userRole,
      setRole: setUserRole,
      onLogout: handleLogout,
      onNavigate: setCurrentPage,
      currentPage: currentPage,
    };

    switch (currentPage) {
      case "Dashboard":
        return <Dashboard {...sharedProps} />;

      case "Katalog Aset":
        return <KatalogAset {...sharedProps} />;

      case "Peminjaman Saya":
        return <FormPinjam {...sharedProps} />;

      case "Persetujuan Pinjam":
        return <PersetujuanPinjam {...sharedProps} />;

      case "Master Kategori":
        return <MasterKategori {...sharedProps} />;

      case "Master Lokasi":
        return <MasterLokasi {...sharedProps} />;

      default:
        return <Dashboard {...sharedProps} />;
    }
  };

  return <>{renderPage()}</>;
}
