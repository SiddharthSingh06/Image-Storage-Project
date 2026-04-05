import { collection, doc, addDoc, getDoc, getDocs, deleteDoc, updateDoc, query, orderBy, setDoc } from "firebase/firestore";
import { db } from "./firebase";
import { VaultrixImage, SharedImage } from "@/types";

export const addImage = async (uid: string, imageData: Omit<VaultrixImage, "id">) => {
  const imagesRef = collection(db, "users", uid, "images");
  const docRef = await addDoc(imagesRef, imageData);

  if (imageData.isShared && imageData.shareId) {
    const sharedRef = doc(db, "sharedImages", imageData.shareId);
    await setDoc(sharedRef, { uid, imageId: docRef.id });
  }

  return docRef.id;
};

export const getImages = async (uid: string): Promise<VaultrixImage[]> => {
  const imagesRef = collection(db, "users", uid, "images");
  const q = query(imagesRef, orderBy("uploadedAt", "desc"));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as VaultrixImage[];
};

export const deleteImage = async (uid: string, imageId: string, shareId: string) => {
  await deleteDoc(doc(db, "users", uid, "images", imageId));

  if (shareId) {
    await deleteDoc(doc(db, "sharedImages", shareId));
  }
};

export const getSharedImage = async (shareId: string): Promise<VaultrixImage | null> => {
  const sharedRef = doc(db, "sharedImages", shareId);
  const sharedSnap = await getDoc(sharedRef);

  if (!sharedSnap.exists()) return null;

  const { uid, imageId } = sharedSnap.data() as SharedImage;

  const imageRef = doc(db, "users", uid, "images", imageId);
  const imageSnap = await getDoc(imageRef);

  if (!imageSnap.exists()) return null;

  return { id: imageSnap.id, ...imageSnap.data() } as VaultrixImage;
};

export const updateSharedStatus = async (uid: string, imageId: string, isShared: boolean, newShareId: string, oldShareId?: string) => {
  const imageRef = doc(db, "users", uid, "images", imageId);
  await updateDoc(imageRef, { isShared, shareId: newShareId });

  if (isShared && newShareId) {
    const sharedRef = doc(db, "sharedImages", newShareId);
    await setDoc(sharedRef, { uid, imageId });
  } else if (!isShared && oldShareId) {
    const sharedRef = doc(db, "sharedImages", oldShareId);
    await deleteDoc(sharedRef);
  }
};
