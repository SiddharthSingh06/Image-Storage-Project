import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");
  const filename = searchParams.get("filename") || "vaultrix-image.jpg";

  if (!url) {
    return new NextResponse("Missing URL", { status: 400 });
  }

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch image");
    
    const blob = await response.blob();
    
    const headers = new Headers();
    headers.set("Content-Type", response.headers.get("Content-Type") || "application/octet-stream");
    // Ensure filename is safely quoted
    const safeFilename = filename.replace(/"/g, '');
    headers.set("Content-Disposition", `attachment; filename="${safeFilename}"`);

    return new NextResponse(blob, { status: 200, headers });
  } catch (error) {
    console.error("Download proxy error:", error);
    return new NextResponse("Error downloading image", { status: 500 });
  }
}
