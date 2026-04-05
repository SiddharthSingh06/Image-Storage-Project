export interface VaultrixImage {
  id: string; // Document ID
  imgbbUrl: string;
  imgbbDeleteUrl: string;
  displayUrl: string;
  filename: string;
  size: number;
  uploadedAt: number; // Storing as epoch timestamp for easier serialization
  isShared: boolean;
  shareId: string;
}

export interface SharedImage {
  uid: string;
  imageId: string;
}
