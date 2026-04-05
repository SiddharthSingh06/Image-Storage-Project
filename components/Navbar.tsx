"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { Button } from "./ui/Button";

export function Navbar() {
  const { user, signOut } = useAuth();

  return (
    <nav className="sticky top-0 z-40 bg-background/90 backdrop-blur-md border-b-2 border-dark w-full">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="text-3xl font-bold font-sans tracking-tighter uppercase text-primary hover:text-dark transition-colors">
          Vaultrix
        </Link>
        {user ? (
          <div className="flex items-center gap-6">
            <div className="hidden sm:flex gap-4 font-mono font-bold text-sm">
              <Link href="/" className="hover:text-primary transition-colors hover:underline underline-offset-4 decoration-2">Dashboard</Link>
              <Link href="/gallery" className="hover:text-primary transition-colors hover:underline underline-offset-4 decoration-2">Gallery</Link>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-mono text-sm hidden md:inline-block border-2 border-dark px-2 py-1 bg-secondary">
                {user.email}
              </span>
              <Button variant="outline" size="sm" onClick={signOut}>
                Logout
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex gap-4">
            <Link href="/login">
              <Button variant="ghost" size="sm">Login</Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">Sign Up</Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
