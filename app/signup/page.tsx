"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useToast } from "@/components/ui/Toast";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { signUpWithEmail, signInWithGoogle } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast("Passwords do not match", "error");
      return;
    }
    setLoading(true);
    try {
      await signUpWithEmail(email, password);
      router.push("/");
    } catch (err) {
      toast("Failed to create account. Email might be in use.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
      router.push("/");
    } catch (err) {
      toast("Failed to sign up with Google.", "error");
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <div className="hidden lg:flex w-1/2 bg-primary p-12 flex-col justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-multiply"></div>
        <div className="relative z-10">
          <h1 className="text-white text-8xl font-sans font-bold tracking-tighter uppercase leading-[0.8] mb-6">VAULTRIX</h1>
          <p className="text-dark bg-secondary inline-block px-4 py-2 text-2xl font-mono font-bold border-4 border-dark">
            Your images. Your vault.
          </p>
        </div>
      </div>
      
      <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 sm:p-12 md:p-24 bg-background">
        <div className="max-w-md w-full mx-auto">
          <h2 className="text-4xl font-sans font-bold uppercase tracking-tight mb-2">Create Account</h2>
          <p className="text-muted font-mono mb-8">Start organizing your images securely.</p>
          
          <form onSubmit={handleEmailSignup} className="space-y-4 mb-8">
            <div>
              <label className="block font-mono font-bold text-sm mb-1 uppercase">Email</label>
              <Input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block font-mono font-bold text-sm mb-1 uppercase">Password</label>
              <Input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                placeholder="••••••••"
                minLength={6}
              />
            </div>
            <div>
              <label className="block font-mono font-bold text-sm mb-1 uppercase">Confirm Password</label>
              <Input 
                type="password" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                required 
                placeholder="••••••••"
                minLength={6}
              />
            </div>
            <Button type="submit" variant="primary" className="w-full mt-4" disabled={loading}>
              {loading ? "Creating..." : "Sign Up"}
            </Button>
          </form>

          <div className="relative flex py-5 items-center">
            <div className="flex-grow border-t-2 border-dark"></div>
            <span className="flex-shrink-0 mx-4 text-dark font-mono font-bold top-[1px] relative">OR</span>
            <div className="flex-grow border-t-2 border-dark"></div>
          </div>

          <Button 
            variant="secondary" 
            className="w-full mb-8" 
            onClick={handleGoogleLogin}
            type="button"
          >
            Sign up with Google
          </Button>

          <p className="text-center font-mono font-bold text-dark">
            Already have an account?{' '}
            <Link href="/login" className="text-primary hover:underline underline-offset-4">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
