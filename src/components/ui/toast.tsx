"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
  icon?: string;
}

interface ToastCtx {
  show: (msg: string, type?: Toast["type"], icon?: string) => void;
}

const Ctx = createContext<ToastCtx>({ show: () => {} });
export const useToast = () => useContext(Ctx);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const show = useCallback((message: string, type: Toast["type"] = "info", icon?: string) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, message, type, icon }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  }, []);

  const COLOR: Record<Toast["type"], string> = {
    success: "bg-primary text-on-primary border-primary-container",
    error:   "bg-error-container text-on-error-container border-error/30",
    info:    "bg-surface-container-lowest text-on-surface border-[#c6c8b7]",
  };
  const ICON: Record<Toast["type"], string> = {
    success: "check_circle",
    error:   "error",
    info:    "info",
  };

  return (
    <Ctx.Provider value={{ show }}>
      {children}
      {/* Toast stack */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg text-sm font-medium pointer-events-auto animate-slide-up ${COLOR[t.type]}`}
            style={{ minWidth: 260, maxWidth: 400 }}
          >
            <span className="material-symbols-outlined text-[20px] icon-fill shrink-0">
              {t.icon ?? ICON[t.type]}
            </span>
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}
