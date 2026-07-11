import React, { useState } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import KatalogAset from "./pages/KatalogAset";
import FormPinjam from "./pages/FormPinjam";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState("Pengguna Biasa");
  const [currentPage, setCurrentPage] = useState("Dashboard"); // Mengatur halaman aktif

  const handleLoginSuccess = (role) => {
    setUserRole(role);
    setIsLoggedIn(true);
    setCurrentPage("Dashboard");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  // Logika pembagian render halaman
  if (!isLoggedIn) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  // Jika sudah login, cek halaman apa yang sedang aktif
  return (
    <>
      {currentPage === "Dashboard" && (
        <Dashboard
          role={userRole}
          setRole={setUserRole}
          onLogout={handleLogout}
          onNavigate={setCurrentPage}
          currentPage={currentPage}
        />
      )}
      {currentPage === "Katalog Aset" && (
        <KatalogAset
          role={userRole}
          setRole={setUserRole}
          onLogout={handleLogout}
          onNavigate={setCurrentPage}
          currentPage={currentPage}
        />
      )}
      {currentPage === "Peminjaman Saya" && (
        <FormPinjam
          role={userRole}
          setRole={setUserRole}
          onLogout={handleLogout}
          onNavigate={setCurrentPage}
          currentPage={currentPage}
        />
      )}
    </>
  );
}
