'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import {
  Zap,
  Lock,
  Mail,
  User,
  AlertCircle,
  Loader2,
  ArrowRight,
  CheckCircle2,
  Shield,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create account.');
      }

      // Auto sign-in after successful registration
      const signInRes = await signIn('credentials', {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
      });

      if (signInRes?.error) {
        // Fallback to login page with notice if auto sign-in has any hiccup
        router.push(`/auth/login?registered=true&callbackUrl=${encodeURIComponent(callbackUrl)}`);
        return;
      }

      router.push(callbackUrl);
      router.refresh();
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-6">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <Link href="/" className="inline-flex items-center gap-2 group">
          <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm group-hover:scale-105 transition-transform">
            <Zap className="size-6 fill-current" />
          </span>
          <span className="text-2xl font-black tracking-tight text-foreground">
            Electro<span className="text-primary">Mart</span>
          </span>
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-foreground pt-1">
          Create an account
        </h1>
        <p className="text-xs text-muted-foreground">
          Join thousands of tech enthusiasts for exclusive deals and order tracking
        </p>
      </div>

      {/* Registration Card */}
      <div className="rounded-3xl border border-border/80 bg-card/70 p-6 sm:p-8 shadow-sm space-y-5">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="name" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <User className="size-3.5 text-muted-foreground" />
              Full Name
            </label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Alex Johnson"
              required
              className="h-10 text-xs bg-background border-border/80 rounded-xl"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="email" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Mail className="size-3.5 text-muted-foreground" />
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@example.com"
              required
              className="h-10 text-xs bg-background border-border/80 rounded-xl"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Lock className="size-3.5 text-muted-foreground" />
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              required
              minLength={6}
              className="h-10 text-xs bg-background border-border/80 rounded-xl"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="confirmPassword" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Shield className="size-3.5 text-muted-foreground" />
              Confirm Password
            </label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-type your password"
              required
              className="h-10 text-xs bg-background border-border/80 rounded-xl"
            />
          </div>

          {errorMessage && (
            <div className="p-3 rounded-xl border border-destructive/30 bg-destructive/10 text-xs text-destructive flex items-center gap-2">
              <AlertCircle className="size-4 shrink-0" />
              {errorMessage}
            </div>
          )}

          <div className="pt-1">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 text-xs font-semibold rounded-xl gap-2 shadow-xs"
            >
              {isLoading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="size-4" />
                </>
              )}
            </Button>
          </div>
        </form>

        <div className="pt-2 text-[11px] text-muted-foreground text-center flex items-center justify-center gap-1.5">
          <CheckCircle2 className="size-3.5 text-emerald-500" />
          <span>By signing up, you agree to our Terms & Privacy Policy</span>
        </div>
      </div>

      {/* Switch to Login */}
      <p className="text-center text-xs text-muted-foreground">
        Already have an account?{' '}
        <Link
          href={`/auth/login${callbackUrl !== '/' ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ''}`}
          className="font-semibold text-primary hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Suspense
        fallback={
          <div className="w-full max-w-md p-8 rounded-3xl border border-border/80 bg-card/50 flex flex-col items-center justify-center space-y-4">
            <Loader2 className="size-8 text-primary animate-spin" />
            <p className="text-xs text-muted-foreground font-medium">Loading registration form...</p>
          </div>
        }
      >
        <RegisterForm />
      </Suspense>
    </div>
  );
}
