"use client";

import { useEffect, useState, use } from "react";
import { useAuth } from "@/lib/auth";
import { VaultrixImage } from "@/types";
import { deleteImage as dbDeleteImage, getImages, updateSharedStatus } from "@/lib/firestore";
import { deleteFromImgBB } from "@/lib/imgbb";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/Button";
import { formatBytes } from "@/lib/formatters";
import { useToast } from "@/components/ui/Toast";
import { Copy, Share2, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

export default function ImageDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  
  const [image, setImage] = useState<VaultrixImage | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [directCopied, setDirectCopied] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }

    if (user) {
      // In a real sophisticated app, we'd fetch a single doc. For now reusing getImages is fine for small scale.
      // Better yet:
      const fetchSingle = async () => {
        try {
          // This is a naive approach, you could write a specific getDoc(doc(db, "users", uid, "images", params.id)) in firestore.ts
          const allImages = await getImages(user.uid);
          const found = allImages.find(i => i.id === resolvedParams.id);
          if (found) setImage(found);
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchSingle();
    }
  }, [user, authLoading, router, resolvedParams.id]);

  if (authLoading || loading) return <div className="min-h-screen flex items-center justify-center bg-background"><p className="font-mono font-bold animate-pulse">Loading Image...</p></div>;
  if (!image) return <div className="min-h-screen flex items-center justify-center bg-background"><p className="font-mono font-bold text-primary">Image not found.</p></div>;

  const handleDelete = async () => {
    if (!user) return;
    try {
      await dbDeleteImage(user.uid, image.id, image.shareId);
      if (image.imgbbDeleteUrl) deleteFromImgBB(image.imgbbDeleteUrl);
      toast("Image deleted successfully", "success");
      router.push("/gallery");
    } catch (err) {
      toast("Failed to delete image", "error");
    }
  };

  const handleShareToggle = async () => {
    if (!user) return;
    const newIsShared = !image.isShared;
    const newShareId = newIsShared ? (image.shareId || crypto.randomUUID()) : "";
    try {
      setImage({ ...image, isShared: newIsShared, shareId: newShareId });
      await updateSharedStatus(user.uid, image.id, newIsShared, newShareId);
      toast(newIsShared ? "Image shared!" : "Image is private", "success");
    } catch (err) {
      toast("Failed to update share status", "error");
      setImage({ ...image }); // rudimentary revert
    }
  };

  const shareUrl = typeof window !== "undefined" ? `${window.location.origin}/share/${image.shareId}` : "";

  return (
    <>
      <Navbar />
      <main className="flex-grow w-full max-w-7xl mx-auto px-6 py-12 page-enter page-enter-active">
        <div className="mb-8">
          <Link href="/gallery" className="inline-flex items-center gap-2 text-dark hover:text-primary transition-colors font-mono font-bold uppercase">
            <ArrowLeft size={20} /> Back to Gallery
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 items-start">
          <div className="w-full lg:w-2/3 vaultrix-border vaultrix-shadow bg-card relative aspect-video flex-shrink-0">
            <Image 
              src={image.imgbbUrl} 
              alt={image.filename}
              fill
              className="object-contain p-4"
              sizes="(max-width: 1024px) 100vw, 66vw"
              priority
            />
          </div>

          <div className="w-full lg:w-1/3 flex flex-col gap-8">
            <div>
              <h1 className="text-3xl font-sans font-bold tracking-tight break-all leading-tight mb-4">{image.filename}</h1>
              <div className="flex gap-4 mb-4">
                <span className="bg-secondary text-dark px-3 py-1 font-mono font-bold border-2 border-dark">{formatBytes(image.size)}</span>
                <span className="bg-muted text-white px-3 py-1 font-mono font-bold border-2 border-dark">{new Date(image.uploadedAt).toLocaleDateString()}</span>
              </div>
              <div className="mt-8 border-t-4 border-dark pt-8">
                <h3 className="font-mono font-bold uppercase mb-4 text-muted border-b-2 border-muted pb-2">Actions</h3>
                
                <div className="flex flex-col gap-4">
                  <Button 
                    variant="outline" 
                    className="w-full justify-between"
                    onClick={() => {
                      navigator.clipboard.writeText(image.displayUrl || image.imgbbUrl);
                      setDirectCopied(true);
                      setTimeout(() => setDirectCopied(false), 2000);
                    }}
                  >
                    <span className="flex items-center gap-2"><Copy size={18} /> {directCopied ? "Copied direct link!" : "Copy Direct Link"}</span>
                  </Button>

                  <div className="p-4 border-2 border-dark bg-card">
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-mono font-bold flex items-center gap-2">
                        <Share2 size={18} /> Share Link Status
                      </span>
                      <button 
                        onClick={handleShareToggle}
                        className={`text-xs font-bold font-mono px-2 py-1 uppercase border-2 border-dark ${image.isShared ? "bg-primary text-white" : "bg-muted text-dark"}`}
                      >
                        {image.isShared ? "Active" : "Disabled"}
                      </button>
                    </div>
                    
                    {image.isShared && (
                      <div className="flex flex-col gap-2">
                        <input 
                          type="text" 
                          readOnly 
                          value={shareUrl} 
                          className="w-full font-mono text-sm p-2 vaultrix-border bg-muted/10 outline-none" 
                        />
                        <Button 
                          variant="secondary" 
                          size="sm"
                          onClick={() => {
                            navigator.clipboard.writeText(shareUrl);
                            setShareCopied(true);
                            setTimeout(() => setShareCopied(false), 2000);
                          }}
                        >
                          {shareCopied ? "Copied!" : "Copy Share Link"}
                        </Button>
                      </div>
                    )}
                  </div>

                  <Button 
                    variant="ghost" 
                    className="w-full text-primary hover:bg-primary hover:text-white border-2 border-transparent hover:border-dark justify-start gap-2 mt-4"
                    onClick={() => setDeleteConfirm(true)}
                  >
                    <Trash2 size={18} /> Delete Image permanently
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <ConfirmDialog
        isOpen={deleteConfirm}
        onClose={() => setDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Image?"
        description="Are you sure you want to completely erase this file? It will be removed from ImgBB and no longer accessible via any links."
        confirmText="Yes, delete it"
        isDestructive={true}
      />
    </>
  );
}
