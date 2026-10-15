'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import {
  Zap,
  Lock,
  Mail,
  AlertCircle,
  Loader2,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const registered = searchParams.get('registered') === 'true';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      const res = await signIn('credentials', {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
      });

      if (res?.error) {
        setErrorMessage('Invalid email or password. Please try again.');
        setIsLoading(false);
        return;
      }

      router.push(callbackUrl);
      router.refresh();
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred.');
      setIsLoading(false);
    }
  };

  const handleQuickLogin = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setErrorMessage('');
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
          Welcome back
        </h1>
        <p className="text-xs text-muted-foreground">
          Sign in to your account to manage orders, addresses, and wishlist
        </p>
      </div>

      {registered && (
        <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2.5">
          <CheckCircle2 className="size-4 shrink-0" />
          <span>Account created successfully! Please sign in with your credentials.</span>
        </div>
      )}

      {/* Login Card */}
      <div className="rounded-3xl border border-border/80 bg-card/70 p-6 sm:p-8 shadow-sm space-y-5">
        <form onSubmit={handleSubmit} className="space-y-4">
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
              placeholder="name@example.com"
              required
              className="h-10 text-xs bg-background border-border/80 rounded-xl"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Lock className="size-3.5 text-muted-foreground" />
                Password
              </label>
              <Link
                href="/support"
                className="text-[11px] text-primary hover:underline font-medium"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
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

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 text-xs font-semibold rounded-xl gap-2 shadow-xs"
          >
            {isLoading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                Sign In
                <ArrowRight className="size-4" />
              </>
            )}
          </Button>
        </form>

        {/* Quick Demo Credentials */}
        <div className="pt-3 border-t border-border/60 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
              <ShieldCheck className="size-3 text-primary" />
              Demo Accounts
            </span>
            <span className="text-[10px] text-muted-foreground">Click to quick-fill</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleQuickLogin('customer@electromart.com', 'password123')}
              className="h-8 text-[11px] font-medium rounded-lg border-border/80 hover:bg-muted/60"
            >
              Demo Customer
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleQuickLogin('admin@electromart.com', 'admin123')}
              className="h-8 text-[11px] font-medium rounded-lg border-border/80 hover:bg-muted/60"
            >
              Demo Admin
            </Button>
          </div>
        </div>
      </div>

      {/* Switch to Register */}
      <p className="text-center text-xs text-muted-foreground">
        Don&apos;t have an account yet?{' '}
        <Link
          href={`/auth/register${callbackUrl !== '/' ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ''}`}
          className="font-semibold text-primary hover:underline"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Suspense
        fallback={
          <div className="w-full max-w-md p-8 rounded-3xl border border-border/80 bg-card/50 flex flex-col items-center justify-center space-y-4">
            <Loader2 className="size-8 text-primary animate-spin" />
            <p className="text-xs text-muted-foreground font-medium">Loading login form...</p>
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
