"use client";

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();

      if (data.session) {
        router.replace('/admin');
        return;
      }

      setCheckingSession(false);
    };

    checkSession();
  }, [router]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setErrorMessage('ელფოსტა ან პაროლი არასწორია.');
      return;
    }

    router.replace('/admin');
    router.refresh();
  };

  if (checkingSession) {
    return (
      <main className="min-h-screen bg-zinc-50 pt-20 flex items-center justify-center px-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-zinc-200 border-t-emerald-600" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-50 pt-20 flex items-center justify-center px-4">
      <section className="w-full max-w-md rounded-2xl border border-zinc-100 bg-white p-6 shadow-xl shadow-zinc-100 md:p-8">
        <div className="mb-8 text-center">
          <Link href="/" className="text-2xl font-black tracking-tighter text-zinc-900">
            LOGO<span className="text-emerald-600">.</span>
          </Link>
          <h1 className="mt-6 text-3xl font-black uppercase italic tracking-tight text-zinc-900">
            Admin Login
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            შეიყვანე Supabase-ში შექმნილი მომხმარებლის მონაცემები.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="grid gap-2 text-sm font-bold text-zinc-700">
            ელფოსტა
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="h-12 rounded-xl border border-zinc-200 px-4 font-medium text-zinc-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              placeholder="admin@example.com"
              required
            />
          </label>

          <label className="grid gap-2 text-sm font-bold text-zinc-700">
            პაროლი
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="h-12 rounded-xl border border-zinc-200 px-4 font-medium text-zinc-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              placeholder="••••••••"
              required
            />
          </label>

          {errorMessage && (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="h-12 w-full rounded-xl bg-zinc-900 px-6 text-sm font-bold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'შესვლა...' : 'შესვლა'}
          </button>
        </form>
      </section>
    </main>
  );
}
