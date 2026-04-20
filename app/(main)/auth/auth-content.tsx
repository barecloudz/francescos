'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/use-supabase-auth';
import { supabase } from '@/lib/supabase';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

const registerSchema = z.object({
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  confirmPassword: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  email: z.string().email({ message: 'Invalid email address' }),
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().min(1, { message: 'Last name is required' }),
  phone: z.string().optional(),
  marketingOptIn: z.boolean().default(true),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

/* ─── Shared dark input style ─── */
const inputClass =
  'bg-[#1a1a1a] border border-[rgba(192,57,43,0.3)] text-[#f5f0e8] placeholder:text-[#6b6560] ' +
  'focus:border-[#c0392b] focus:ring-1 focus:ring-[#c0392b] focus:outline-none rounded-md ' +
  'h-11 px-3 w-full transition-colors';

/* ─── Shared label style ─── */
const labelClass = 'text-[#b8b3ab] text-sm font-medium mb-1.5 block';

/* ─── Red gradient submit button style ─── */
const redGradientClass =
  'w-full h-11 rounded-md font-semibold text-white tracking-wide ' +
  'transition-opacity duration-200 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed ' +
  'cursor-pointer border-0';

const redGradientStyle = {
  background: 'linear-gradient(135deg, #7a1a14, #c0392b, #e74c3c, #c0392b, #7a1a14)',
} as React.CSSProperties;

function AuthContentInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading, signInWithGoogle, loginMutation, registerMutation } = useAuth();
  const { toast } = useToast();

  const tabFromUrl = searchParams.get('tab');
  const redirectTo = searchParams.get('redirectTo') ?? '/';

  const [activeTab, setActiveTab] = useState<string>(tabFromUrl === 'register' ? 'register' : 'login');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [isResetting, setIsResetting] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      toast({
        title: 'Sign-in failed',
        description: 'There was an error signing in with Google. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsResetting(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      if (error) throw error;
      toast({ title: 'Password reset email sent', description: 'Check your email for a link to reset your password' });
      setShowForgotPassword(false);
      setResetEmail('');
    } catch (error: any) {
      toast({ title: 'Failed to send reset email', description: error.message || 'Please try again later', variant: 'destructive' });
    } finally {
      setIsResetting(false);
    }
  };

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { password: '', confirmPassword: '', email: '', firstName: '', lastName: '', phone: '', marketingOptIn: true },
  });

  const onLoginSubmit = (values: LoginFormValues) => {
    loginMutation.mutate(values);
  };

  const onRegisterSubmit = (values: RegisterFormValues) => {
    const { confirmPassword, ...registerData } = values;
    registerMutation.mutate({ ...registerData, username: registerData.email, role: 'customer', isActive: true });
  };

  useEffect(() => {
    if (user && !loginMutation.isPending && !registerMutation.isPending) {
      router.push(redirectTo);
    }
  }, [user, loginMutation.isPending, registerMutation.isPending, router, redirectTo]);

  const headingText = activeTab === 'register' ? 'Join the Family' : 'Welcome Back';
  const eyebrowText = activeTab === 'register' ? 'Create Your Account' : 'Member Sign In';

  return (
    /* Full-screen hero background */
    <div className="relative min-h-screen flex items-center justify-center bg-brand-dark overflow-hidden">

      {/* Hero background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-bg.jpeg"
          alt=""
          fill
          priority
          className="object-cover object-center"
          aria-hidden="true"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/70" />
        {/* Subtle red vignette at bottom */}
        <div
          className="absolute inset-x-0 bottom-0 h-48 pointer-events-none"
          style={{ background: 'linear-gradient(to top, rgba(10,0,0,0.6), transparent)' }}
        />
      </div>

      {/* Back to home — top-left */}
      <button
        type="button"
        onClick={() => router.push('/')}
        className="absolute top-6 left-6 z-20 flex items-center gap-2 text-[#b8b3ab] hover:text-[#f5f0e8] text-sm transition-colors"
        aria-label="Back to home"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back to Home
      </button>

      {/* Centered card */}
      <div
        className="relative z-10 w-full max-w-md mx-4 my-12 rounded-xl shadow-2xl overflow-hidden"
        style={{
          background: 'rgba(10,10,10,0.95)',
          border: '1px solid rgba(192,57,43,0.25)',
        }}
      >
        {/* Card header — logo + heading */}
        <div className="px-8 pt-8 pb-6 text-center border-b border-[rgba(192,57,43,0.15)]">
          <div className="flex justify-center mb-5">
            <Image
              src="/images/logo.png"
              alt="Francesco's Pizza Kitchen"
              width={96}
              height={96}
              className="object-contain"
              priority
            />
          </div>

          {/* Eyebrow */}
          <p className="text-[#c0392b] text-xs font-semibold uppercase tracking-[0.18em] mb-2">
            {eyebrowText}
          </p>

          {/* Main heading */}
          <h1 className="font-playfair text-3xl font-bold text-[#f5f0e8]">
            {headingText}
          </h1>
        </div>

        {/* Tabs + forms */}
        <div className="px-8 py-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">

            {/* Tab switcher */}
            <TabsList
              className="grid grid-cols-2 w-full mb-6 rounded-lg p-1"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(192,57,43,0.2)' }}
            >
              <TabsTrigger
                value="login"
                className="rounded-md text-sm font-medium transition-all
                  text-[#b8b3ab]
                  data-[state=active]:text-white
                  data-[state=active]:shadow-sm"
                style={activeTab === 'login' ? redGradientStyle : undefined}
              >
                Sign In
              </TabsTrigger>
              <TabsTrigger
                value="register"
                className="rounded-md text-sm font-medium transition-all
                  text-[#b8b3ab]
                  data-[state=active]:text-white
                  data-[state=active]:shadow-sm"
                style={activeTab === 'register' ? redGradientStyle : undefined}
              >
                Register
              </TabsTrigger>
            </TabsList>

            {/* ── LOGIN TAB ── */}
            <TabsContent value="login" className="mt-0">
              {showForgotPassword ? (
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div>
                    <Label htmlFor="reset-email" className={labelClass}>
                      Email Address
                    </Label>
                    <input
                      id="reset-email"
                      type="email"
                      placeholder="Enter your email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      required
                      className={inputClass}
                    />
                    <p className="mt-1.5 text-xs text-[#6b6560]">
                      We'll send you a link to reset your password
                    </p>
                  </div>
                  <div className="flex gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(false)}
                      className="flex-1 h-11 rounded-md border border-[rgba(192,57,43,0.3)] text-[#b8b3ab] text-sm font-medium hover:border-[#c0392b] hover:text-[#f5f0e8] transition-colors bg-transparent cursor-pointer"
                    >
                      Back to Sign In
                    </button>
                    <button
                      type="submit"
                      disabled={isResetting}
                      className={`flex-1 ${redGradientClass}`}
                      style={redGradientStyle}
                    >
                      {isResetting ? 'Sending...' : 'Send Reset Link'}
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <Form {...loginForm}>
                    <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                      <FormField
                        control={loginForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={labelClass}>Email</FormLabel>
                            <FormControl>
                              <input
                                type="email"
                                placeholder="Enter your email"
                                className={inputClass}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="text-[#e74c3c] text-xs mt-1" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={loginForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={labelClass}>Password</FormLabel>
                            <FormControl>
                              <input
                                type="password"
                                placeholder="Enter your password"
                                className={inputClass}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="text-[#e74c3c] text-xs mt-1" />
                          </FormItem>
                        )}
                      />
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => setShowForgotPassword(true)}
                          className="text-xs text-[#c0392b] hover:text-[#e74c3c] transition-colors"
                        >
                          Forgot password?
                        </button>
                      </div>
                      <button
                        type="submit"
                        disabled={loginMutation.isPending}
                        className={redGradientClass}
                        style={redGradientStyle}
                      >
                        {loginMutation.isPending ? 'Signing in...' : 'Sign In'}
                      </button>
                    </form>
                  </Form>

                </>
              )}
            </TabsContent>

            {/* ── REGISTER TAB ── */}
            <TabsContent value="register" className="mt-0">
              <Form {...registerForm}>
                <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <FormField
                      control={registerForm.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={labelClass}>First Name</FormLabel>
                          <FormControl>
                            <input
                              placeholder="First name"
                              className={inputClass}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-[#e74c3c] text-xs mt-1" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={labelClass}>Last Name</FormLabel>
                          <FormControl>
                            <input
                              placeholder="Last name"
                              className={inputClass}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-[#e74c3c] text-xs mt-1" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={registerForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={labelClass}>Email</FormLabel>
                        <FormControl>
                          <input
                            type="email"
                            placeholder="Enter your email"
                            className={inputClass}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-[#e74c3c] text-xs mt-1" />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <FormField
                      control={registerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={labelClass}>Password</FormLabel>
                          <FormControl>
                            <input
                              type="password"
                              placeholder="Create password"
                              className={inputClass}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-[#e74c3c] text-xs mt-1" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={labelClass}>Confirm</FormLabel>
                          <FormControl>
                            <input
                              type="password"
                              placeholder="Confirm password"
                              className={inputClass}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-[#e74c3c] text-xs mt-1" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={registerForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={labelClass}>Phone Number <span className="text-[#6b6560] font-normal">(optional)</span></FormLabel>
                        <FormControl>
                          <input
                            placeholder="Enter your phone number"
                            className={inputClass}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-[#e74c3c] text-xs mt-1" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={registerForm.control}
                    name="marketingOptIn"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start gap-3 py-1">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="mt-0.5 border-[rgba(192,57,43,0.4)] data-[state=checked]:bg-[#c0392b] data-[state=checked]:border-[#c0392b]"
                          />
                        </FormControl>
                        <FormLabel className="text-[#b8b3ab] text-xs leading-relaxed font-normal cursor-pointer">
                          Subscribe to marketing emails for exclusive offers and rewards
                        </FormLabel>
                      </FormItem>
                    )}
                  />

                  <button
                    type="submit"
                    disabled={registerMutation.isPending}
                    className={redGradientClass}
                    style={redGradientStyle}
                  >
                    {registerMutation.isPending ? 'Creating account...' : 'Create Account'}
                  </button>
                </form>
              </Form>

            </TabsContent>
          </Tabs>
        </div>

        {/* Card footer */}
        <div className="px-8 py-4 border-t border-[rgba(192,57,43,0.15)] text-center">
          <p className="text-[#6b6560] text-xs">
            Francesco's Pizza Kitchen &mdash; Authentic Italian Since 1987
          </p>
        </div>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg className="h-4 w-4 flex-shrink-0" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

export default function AuthContent() {
  return (
    <Suspense
      fallback={
        <div
          className="min-h-screen flex items-center justify-center"
          style={{ background: '#0a0a0a' }}
        >
          <div
            className="w-12 h-12 rounded-full border-2 border-transparent animate-spin"
            style={{ borderTopColor: '#c0392b', borderRightColor: 'rgba(192,57,43,0.3)' }}
            role="status"
            aria-label="Loading"
          />
        </div>
      }
    >
      <AuthContentInner />
    </Suspense>
  );
}
