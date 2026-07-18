"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Tema = "dark" | "light";

const AdminThemeContext = createContext<{
  tema: Tema;
  alternarTema: () => void;
} | null>(null);

export function AdminThemeShell({ children }: { children: ReactNode }) {
  const [tema, setTema] = useState<Tema>("dark");

  useEffect(() => {
    const salvo = localStorage.getItem("r3-admin-tema");
    if (salvo === "light" || salvo === "dark") setTema(salvo);
  }, []);

  function alternarTema() {
    setTema((atual) => {
      const proximo = atual === "dark" ? "light" : "dark";
      localStorage.setItem("r3-admin-tema", proximo);
      return proximo;
    });
  }

  return (
    <AdminThemeContext.Provider value={{ tema, alternarTema }}>
      <div
        data-theme={tema}
        className="admin-scope font-inter flex min-h-screen bg-admin-bg text-admin-text"
      >
        {children}
      </div>
    </AdminThemeContext.Provider>
  );
}

export function useAdminTheme() {
  const ctx = useContext(AdminThemeContext);
  if (!ctx) {
    throw new Error("useAdminTheme precisa estar dentro de <AdminThemeShell>");
  }
  return ctx;
}
