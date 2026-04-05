"use client";

import { useCallback, useState } from "react";
import { UploadCloud } from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadZoneProps {
  onUpload: (file: File) => void;
  disabled?: boolean;
}

export function UploadZone({ onUpload, disabled }: UploadZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragOver(true);
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (!disabled && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onUpload(e.dataTransfer.files[0]);
    }
  }, [disabled, onUpload]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!disabled && e.target.files && e.target.files.length > 0) {
      onUpload(e.target.files[0]);
    }
  }, [disabled, onUpload]);

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        "relative flex flex-col items-center justify-center p-12 transition-all bg-card cursor-pointer group",
        "border-4 border-dashed",
        isDragOver ? "border-secondary pulse-border bg-secondary/10 scale-[1.02]" : "border-muted hover:border-dark hover:bg-muted/5",
        disabled && "opacity-50 cursor-not-allowed pointer-events-none"
      )}
    >
      <input
        type="file"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        onChange={handleFileSelect}
        accept="image/*"
        disabled={disabled}
      />
      
      <div className="flex flex-col items-center text-center space-y-4 pointer-events-none">
        <div className={cn(
          "p-4 rounded-full transition-colors",
          isDragOver ? "bg-secondary text-dark" : "bg-primary text-white group-hover:bg-dark"
        )}>
          <UploadCloud size={48} />
        </div>
        <h3 className="text-2xl font-bold font-sans uppercase tracking-tight">
          {isDragOver ? "Drop it!" : "Drop images here or click to upload"}
        </h3>
        <p className="text-muted font-mono font-bold max-w-md">
          Supports PNG, JPG, GIF up to 32MB
        </p>
      </div>
    </div>
  );
}
