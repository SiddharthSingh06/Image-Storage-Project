"use client";

import { VaultrixImage } from "@/types";
import { ImageCard } from "./ImageCard";
import { ConfirmDialog } from "./ui/ConfirmDialog";
import { useState, useEffect } from "react";
import { useToast } from "./ui/Toast";
import { Button } from "./ui/Button";
import { createPortal } from "react-dom";

interface ImageGridProps {
  images: VaultrixImage[];
  onDelete: (id: string) => Promise<void>;
  onToggleShare: (id: string) => Promise<void>;
}

export function ImageGrid({ images, onDelete, onToggleShare }: ImageGridProps) {
  const { toast } = useToast();
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<VaultrixImage | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDownload = () => {
    if (!previewImage) return;
    const proxyUrl = `/api/download?url=${encodeURIComponent(previewImage.imgbbUrl)}&filename=${encodeURIComponent(previewImage.filename)}`;
    window.location.href = proxyUrl;
  };

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    // the card handles its own toast or feedback
  };

  const shareBaseUrl = typeof window !== "undefined" ? window.location.origin : "";

  const handleShareClick = (id: string) => {
    onToggleShare(id);
    const img = images.find(img => img.id === id);
    if (!img?.isShared) { // it will become shared
      // we can't reliably copy the new shareId here until the state updates in the parent,
      // but the parent `toggleShare` toast is sufficient
    }
  };

  if (images.length === 0) {
    return (
      <div className="py-24 text-center border-4 border-dashed border-muted bg-card">
        <h3 className="text-2xl font-bold font-sans uppercase mb-2">No Images Found</h3>
        <p className="text-muted font-mono font-bold">Upload an image to start your vault.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {images.map(image => (
          <ImageCard 
            key={image.id} 
            image={image} 
            onCopyLink={handleCopyLink}
            onDeleteUrlClick={() => setDeleteConfirmId(image.id)}
            onShareClick={handleShareClick}
            onPreviewClick={setPreviewImage}
          />
        ))}
      </div>

      <ConfirmDialog
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={() => {
          if (deleteConfirmId) onDelete(deleteConfirmId);
        }}
        title="Delete Image?"
        description="Are you sure you want to permanently delete this image from your vault? This action cannot be undone."
        confirmText="Yes, delete it"
        isDestructive={true}
      />

      {previewImage && mounted && createPortal(
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/60 backdrop-blur-md p-4 sm:p-8 animate-in fade-in duration-200">
          <img 
            src={previewImage.imgbbUrl} 
            alt={previewImage.filename}
            className="max-w-full max-h-[75vh] object-contain vaultrix-border vaultrix-shadow mb-6 bg-card"
          />
          
          <div className="flex gap-4">
            <Button variant="secondary" className="vaultrix-shadow hover:-translate-y-1" onClick={() => setPreviewImage(null)}>
              Close
            </Button>
            <Button variant="primary" className="vaultrix-shadow hover:-translate-y-1" onClick={handleDownload}>
              Download Image
            </Button>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
