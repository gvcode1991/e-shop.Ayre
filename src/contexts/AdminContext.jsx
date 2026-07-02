import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const AdminContext = createContext(null);

export function AdminProvider({ children }) {
  const [adminLogin, setAdminLogin] = useState({ email: "", password: "" });
  const [adminToken, setAdminToken] = useState(() => sessionStorage.getItem("ayre-admin-token") || "");
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [adminStatus, setAdminStatus] = useState({ state: "idle", message: "" });

  useEffect(() => {
    if (adminToken) sessionStorage.setItem("ayre-admin-token", adminToken);
    else sessionStorage.removeItem("ayre-admin-token");
  }, [adminToken]);

  function adminHeaders(extraHeaders = {}) {
    return adminToken ? { ...extraHeaders, Authorization: `Bearer ${adminToken}` } : extraHeaders;
  }

  function logoutAdmin() {
    setAdminToken("");
    setAdminUnlocked(false);
    setAdminLogin({ email: "", password: "" });
    setAdminStatus({ state: "idle", message: "" });
  }

  const value = useMemo(() => ({
    adminHeaders,
    adminLogin,
    adminStatus,
    adminToken,
    adminUnlocked,
    logoutAdmin,
    setAdminLogin,
    setAdminStatus,
    setAdminToken,
    setAdminUnlocked,
  }), [adminLogin, adminStatus, adminToken, adminUnlocked]);

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdminContext() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdminContext debe usarse dentro de AdminProvider");
  }
  return context;
}
