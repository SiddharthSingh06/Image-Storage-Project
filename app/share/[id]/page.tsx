"use client";

import { useEffect, useState, use } from "react";
import { VaultrixImage } from "@/types";
import { getSharedImage } from "@/lib/firestore";
import Image from "next/image";
import { formatBytes } from "@/lib/formatters";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function SharePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [image, setImage] = useState<VaultrixImage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShared = async () => {
      try {
        const data = await getSharedImage(resolvedParams.id);
        setImage(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchShared();
  }, [resolvedParams.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex flex-col items-center justify-center relative overflow-hidden">
        <h1 className="text-secondary font-sans font-bold text-4xl mb-4 tracking-tight animate-pulse uppercase">Vaultrix</h1>
      </div>
    );
  }

  if (!image) {
    return (
      <div className="min-h-screen bg-dark text-white flex flex-col items-center justify-center text-center p-6 lg:p-12">
        <h2 className="text-4xl lg:text-7xl font-sans font-bold uppercase mb-4 opacity-50">Unavailable</h2>
        <p className="font-mono text-muted text-lg lg:text-xl max-w-lg mb-12">This image is no longer available. It may have been deleted by the owner or the link has been disabled.</p>
      </div>
    );
  }

  const handleDownload = () => {
    if (!image) return;
    const proxyUrl = `/api/download?url=${encodeURIComponent(image.imgbbUrl)}&filename=${encodeURIComponent(image.filename)}`;
    window.location.href = proxyUrl;
  };

  return (
    <div className="min-h-screen bg-dark flex flex-col h-screen overflow-hidden">
      {/* Header bar */}
      <div className="h-16 lg:h-20 flex-shrink-0 flex items-center justify-between px-6 lg:px-12 border-b-2 border-white/10 z-10 bg-dark">
        <div className="flex items-center gap-4">
          <span className="text-white font-sans font-bold text-2xl tracking-tighter uppercase min-w-max cursor-default">VAULTRIX</span>
          <span className="text-muted hidden sm:inline font-mono">|</span>
          <h1 className="text-white font-sans font-bold truncate max-w-[200px] sm:max-w-md lg:max-w-xl">{image.filename}</h1>
        </div>
        <div className="flex items-center gap-4 lg:gap-8">
          <div className="hidden lg:flex items-center gap-4 text-white font-mono text-sm opacity-80">
            <span>{new Date(image.uploadedAt).toLocaleDateString()}</span>
            <span>{formatBytes(image.size)}</span>
          </div>
          <Button variant="primary" onClick={handleDownload} className="font-mono gap-2 rounded-none px-4 py-2 border-2 border-white h-auto sm:px-6">
            <Download size={18} />
            <span className="hidden sm:inline">Download Original</span>
            <span className="inline sm:hidden">Save</span>
          </Button>
        </div>
      </div>

      {/* Main image area */}
      <div className="flex-grow relative w-full flex items-center justify-center p-4 sm:p-8 lg:p-12 overflow-hidden">
        <div className="relative w-full h-full max-w-7xl max-h-[85vh] mx-auto filter drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">
          <Image 
            src={image.imgbbUrl} 
            alt={image.filename}
            fill
            className="object-contain"
            sizes="100vw"
            priority
          />
        </div>
        
        {/* Subtle Watermark */}
        <div className="absolute bottom-4 sm:bottom-6 lg:bottom-8 right-6 lg:right-12 mix-blend-overlay opacity-30 select-none pointer-events-none flex flex-col items-end">
          <span className="text-white font-sans font-bold text-5xl sm:text-7xl lg:text-9xl tracking-tighter uppercase leading-none">VAULTRIX</span>
          <span className="text-white font-mono text-xs sm:text-sm tracking-widest mt-1">SECURE IMAGE VAULT</span>
        </div>
      </div>
    </div>
  );
}
