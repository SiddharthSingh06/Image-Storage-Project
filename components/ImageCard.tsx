"use client";

import { VaultrixImage } from "@/types";
import { Copy, Share2, Trash2 } from "lucide-react";
import Image from "next/image";
import { formatBytes } from "@/lib/formatters";
import Link from "next/link";
import { useState } from "react";

interface ImageCardProps {
  image: VaultrixImage;
  onDeleteUrlClick: (imageId: string) => void;
  onShareClick: (imageId: string) => void;
  onCopyLink: (url: string) => void;
  onPreviewClick: (image: VaultrixImage) => void;
}

export function ImageCard({ image, onDeleteUrlClick, onShareClick, onCopyLink, onPreviewClick }: ImageCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    onCopyLink(image.displayUrl || image.imgbbUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group vaultrix-border vaultrix-shadow-hover bg-card flex flex-col overflow-hidden border-t-4 border-t-primary relative h-full">
      <button 
        type="button"
        onClick={() => onPreviewClick(image)} 
        className="block relative w-full bg-muted/10 overflow-hidden cursor-zoom-in"
      >
        <Image 
          src={image.imgbbUrl} 
          alt={image.filename}
          width={0}
          height={0}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="w-full h-auto object-contain transition-transform duration-500 group-hover:scale-[1.02]"
        />
        {image.isShared && (
          <div className="absolute top-2 left-2 bg-secondary text-dark font-mono font-bold text-xs px-2 py-1 border-2 border-dark">
            Shared
          </div>
        )}
      </button>
      <div className="p-4 flex flex-col justify-between flex-grow">
        <div className="mb-4">
          <Link href={`/image/${image.id}`} className="hover:text-primary transition-colors">
            <h4 className="font-sans font-bold truncate text-lg" title={image.filename}>
              {image.filename}
            </h4>
          </Link>
          <div className="flex justify-between items-center mt-2 font-mono text-sm">
            <span className="text-muted">{new Date(image.uploadedAt).toLocaleDateString()}</span>
            <span className="bg-secondary text-dark px-2 font-bold border border-dark border-b-2">{formatBytes(image.size)}</span>
          </div>
        </div>
        
        <div className="flex gap-2 border-t-2 border-dark pt-3">
          {!image.isShared ? (
            <>
              <button 
                onClick={handleCopy}
                className="flex-1 flex items-center justify-center gap-1 font-mono text-[13px] sm:text-sm font-bold border-2 border-dark hover:bg-dark hover:text-white transition-colors py-1"
              >
                {copied ? <span className="text-primary pr-1">✓</span> : <Copy size={16} />}
                {copied ? "Copied" : "Copy"}
              </button>
              <button 
                onClick={(e) => { e.preventDefault(); onShareClick(image.id); }}
                className="flex-1 flex items-center justify-center gap-1 font-mono text-[13px] sm:text-sm font-bold border-2 border-dark hover:bg-dark hover:text-white transition-colors py-1"
              >
                <Share2 size={16} /> Share
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={(e) => { e.preventDefault(); onShareClick(image.id); }}
                className="flex-1 flex items-center justify-center gap-1 font-mono text-[13px] sm:text-sm font-bold border-2 border-dark hover:bg-dark hover:text-white transition-colors py-1 bg-muted/20"
              >
                <Share2 size={14} className="opacity-70" /> Unshare
              </button>
              <button 
                onClick={(e) => { 
                  e.preventDefault(); 
                  const shareUrl = `${window.location.origin}/share/${image.shareId}`;
                  navigator.clipboard.writeText(shareUrl).catch(() => {});
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="flex-1 flex items-center justify-center gap-1 font-mono text-[13px] sm:text-sm font-bold border-2 border-dark bg-primary text-white hover:bg-dark transition-colors py-1"
              >
                {copied ? <span className="text-white pr-1 leading-none">✓</span> : <Copy size={14} />}
                {copied ? "Copied" : "Copy Link"}
              </button>
            </>
          )}
          <button 
            onClick={(e) => { e.preventDefault(); onDeleteUrlClick(image.id); }}
            className="flex-none w-10 flex items-center justify-center text-dark border-2 border-dark hover:bg-primary hover:text-white transition-colors py-1 group/btn"
          >
            <Trash2 size={16} className="group-hover/btn:shake-animation" />
          </button>
        </div>
      </div>
    </div>
  );
}
