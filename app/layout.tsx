import type { Metadata } from "next";
import { Space_Mono, DM_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth";
import { ToastProvider } from "@/components/ui/Toast";
import { Navbar } from "@/components/Navbar";

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VAULTRIX | Your images. Your vault.",
  description: "Minimalist full-stack image storage web application.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${spaceMono.variable} ${dmSans.variable} font-sans antialiased bg-background text-dark min-h-screen flex flex-col`}>
        <AuthProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
