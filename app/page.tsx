"use client";

import { useAuth } from "@/lib/auth";
import { useImages } from "@/hooks/useImages";
import { UploadZone } from "@/components/UploadZone";
import { ImageGrid } from "@/components/ImageGrid";
import { Navbar } from "@/components/Navbar";
import { formatBytes } from "@/lib/formatters";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const { images, loading: imagesLoading, uploading, uploadFile, removeImage, toggleShare } = useImages();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  if (authLoading || (!user && !authLoading)) {
    return <div className="min-h-screen flex items-center justify-center bg-background"><p className="font-mono font-bold text-xl animate-pulse">Loading Vaultrix...</p></div>;
  }

  const totalSize = images.reduce((acc, img) => acc + img.size, 0);
  const sharedCount = images.filter(img => img.isShared).length;

  return (
    <>
      <Navbar />
      <main className="flex-grow w-full max-w-7xl mx-auto px-6 py-12 page-enter page-enter-active">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
          <div>
            <h1 className="text-4xl sm:text-5xl font-sans font-bold uppercase tracking-tight mb-2">Dashboard</h1>
            <p className="text-muted font-mono font-bold">Manage your image vault.</p>
          </div>
          <div className="flex gap-4">
            <div className="vaultrix-border bg-card px-4 py-2 flex flex-col items-center justify-center min-w-[120px]">
              <span className="text-2xl font-bold font-sans">{images.length}</span>
              <span className="text-xs uppercase font-mono font-bold text-muted">Total Images</span>
            </div>
            <div className="vaultrix-border bg-secondary px-4 py-2 flex flex-col items-center justify-center min-w-[120px]">
              <span className="text-2xl font-bold font-sans text-dark">{formatBytes(totalSize)}</span>
              <span className="text-xs uppercase font-mono font-bold text-dark opacity-80">Storage Used</span>
            </div>
            <div className="vaultrix-border bg-card px-4 py-2 flex flex-col items-center justify-center min-w-[120px]">
              <span className="text-2xl font-bold font-sans text-primary">{sharedCount}</span>
              <span className="text-xs uppercase font-mono font-bold text-muted">Shared Links</span>
            </div>
          </div>
        </div>

        <div className="mb-12">
          <UploadZone onUpload={uploadFile} disabled={uploading} />
          {uploading && (
            <div className="mt-4 p-4 bg-primary text-white font-mono font-bold text-center vaultrix-border animate-pulse">
              Uploading to vault... please wait.
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-6 border-b-4 border-dark pb-2">
            <h2 className="text-2xl font-sans font-bold uppercase">Recent Uploads</h2>
          </div>
          {imagesLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-[3/4] bg-muted/20 animate-pulse vaultrix-border"></div>
              ))}
            </div>
          ) : (
            <ImageGrid images={images.slice(0, 8)} onDelete={removeImage} onToggleShare={toggleShare} />
          )}
        </div>
      </main>
    </>
  );
}
