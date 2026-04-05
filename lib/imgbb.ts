export const uploadToImgBB = async (base64string: string) => {
  const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
  if (!apiKey) throw new Error("ImgBB API Key is not set in environment");

  const formData = new FormData();
  formData.append("key", apiKey);
  // ImgBB requires exactly the base64 string without data uris etc for "base64string"
  // If the string starts with data:image/..., we need to strip it
  const cleanBase64 = base64string.includes("base64,") 
    ? base64string.split("base64,")[1] 
    : base64string;
    
  formData.append("image", cleanBase64);

  const res = await fetch("https://api.imgbb.com/1/upload", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Failed to upload image to ImgBB");
  }

  const data = await res.json();
  return {
    url: data.data.url,
    delete_url: data.data.delete_url,
    display_url: data.data.display_url,
  };
};

export const deleteFromImgBB = async (deleteUrl: string) => {
  // ImgBB's API delete_url often blocks standard cross-origin requests.
  // Using mode: 'no-cors' sends an opaque request without expecting a readable response,
  // bypassing the "TypeError: Failed to fetch" CORS error entirely.
  try {
    await fetch(deleteUrl, { method: "GET", mode: "no-cors" });
  } catch (error) {
    // Silently ignore strictly to avoid Next.js dev server intercepting console.error.
  }
};
