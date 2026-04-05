"use client";

import { useState, useEffect, useCallback } from "react";
import { VaultrixImage } from "@/types";
import { getImages, addImage, deleteImage as dbDeleteImage, updateSharedStatus } from "@/lib/firestore";
import { uploadToImgBB, deleteFromImgBB } from "@/lib/imgbb";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/components/ui/Toast";

export function useImages() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [images, setImages] = useState<VaultrixImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const fetchImages = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const data = await getImages(user.uid);
      setImages(data);
    } catch (error) {
      toast("Failed to fetch images", "error");
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const uploadFile = async (file: File) => {
    if (!user) return;
    setUploading(true);
    try {
      // 1. Convert to base64
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
      });
      reader.readAsDataURL(file);
      const base64string = await base64Promise;

      // 2. Upload to ImgBB
      const imgbbData = await uploadToImgBB(base64string);

      // 3. Save to Firestore
      const newImage: Omit<VaultrixImage, "id"> = {
        imgbbUrl: imgbbData.url,
        imgbbDeleteUrl: imgbbData.delete_url,
        displayUrl: imgbbData.display_url,
        filename: file.name,
        size: file.size,
        uploadedAt: Date.now(),
        isShared: false,
        shareId: "",
      };

      const docId = await addImage(user.uid, newImage);
      const createdImage: VaultrixImage = { ...newImage, id: docId };
      
      setImages(prev => [createdImage, ...prev]);
      toast("Image uploaded successfully!", "success");
    } catch (error) {
      console.error(error);
      toast("Failed to upload image", "error");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = async (imageId: string) => {
    if (!user) return;
    try {
      const img = images.find(i => i.id === imageId);
      if (img) {
        // Optimistic UI update
        setImages(prev => prev.filter(i => i.id !== imageId));
        await dbDeleteImage(user.uid, imageId, img.shareId);
        // Fire and forget delete to ImgBB
        if (img.imgbbDeleteUrl) {
          deleteFromImgBB(img.imgbbDeleteUrl);
        }
        toast("Image deleted", "info");
      }
    } catch (error) {
      toast("Failed to delete image", "error");
      fetchImages(); // Re-fetch on error to revert optimistic update
    }
  };

  const toggleShare = async (imageId: string) => {
    if (!user) return;
    const imgIndex = images.findIndex(i => i.id === imageId);
    if (imgIndex === -1) return;
    
    const img = images[imgIndex];
    const newIsShared = !img.isShared;
    const newShareId = newIsShared ? (img.shareId || crypto.randomUUID()) : "";

    try {
      // Optimistic update
      const newImages = [...images];
      newImages[imgIndex] = { ...img, isShared: newIsShared, shareId: newShareId };
      setImages(newImages);

      await updateSharedStatus(user.uid, imageId, newIsShared, newShareId, img.shareId);
      if (newIsShared) {
        const shareUrl = `${window.location.origin}/share/${newShareId}`;
        navigator.clipboard.writeText(shareUrl).catch(() => {});
        toast("Share link copied to clipboard!", "success");
      } else {
        toast("Image unshared", "info");
      }
    } catch (error) {
      toast("Failed to update share status", "error");
      fetchImages(); // revert
    }
  };

  return { images, loading, uploading, uploadFile, removeImage, toggleShare, fetchImages };
}
