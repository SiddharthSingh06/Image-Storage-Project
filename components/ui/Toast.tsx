"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

export interface ToastProps {
  id: string;
  message: string;
  type?: "success" | "error" | "info";
  onClose: (id: string) => void;
}

export const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ id, message, type = "info", onClose }, ref) => {
    React.useEffect(() => {
      const timer = setTimeout(() => {
        onClose(id);
      }, 3000);
      return () => clearTimeout(timer);
    }, [id, onClose]);

    return (
      <div
        ref={ref}
        className={cn(
          "vaultrix-border vaultrix-shadow p-4 mb-4 flex items-center justify-between w-80 animate-in slide-in-from-top-4 fade-in duration-300",
          {
            "bg-primary text-white": type === "error",
            "bg-secondary text-dark": type === "info",
            "bg-card text-dark border-primary": type === "success",
          }
        )}
      >
        <span className="font-mono text-sm font-bold truncate pr-4">{message}</span>
        <button onClick={() => onClose(id)} className="hover:opacity-70 transition-opacity">
          <X size={18} />
        </button>
      </div>
    );
  }
);
Toast.displayName = "Toast";

// Simple context provider approach for toasts
interface ToastContextType {
  toast: (message: string, type?: "success" | "error" | "info") => void;
}

const ToastContext = React.createContext<ToastContextType>({ toast: () => {} });

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = React.useState<Omit<ToastProps, "onClose">[]>([]);

  const addToast = (message: string, type: "success" | "error" | "info" = "info") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}
      <div className="fixed top-4 right-4 z-50 flex flex-col">
        {toasts.map((t) => (
          <Toast key={t.id} {...t} onClose={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => React.useContext(ToastContext);
