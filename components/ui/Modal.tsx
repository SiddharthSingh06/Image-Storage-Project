"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="vaultrix-border vaultrix-shadow bg-card w-full max-w-md p-6 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold font-sans tracking-tight uppercase">{title}</h2>
          <button onClick={onClose} className="hover:text-primary transition-colors">
            <X size={24} />
          </button>
        </div>
        <div>
          {children}
        </div>
      </div>
    </div>
  );
}
