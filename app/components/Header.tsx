"use client";

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from './CartProvider';

function CartNavLabel() {
  const { totalItems } = useCart();

  return (
    <>
      კალათა
      {totalItems > 0 && (
        <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-500 px-1.5 text-[10px] font-black text-white">
          {totalItems}
        </span>
      )}
    </>
  );
}

function SearchIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="m21 21-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z" />
    </svg>
  );
}

function HeaderSearch({ onSearch, compact = false }: { onSearch?: () => void; compact?: boolean }) {
  const router = useRouter();
  const [term, setTerm] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = term.trim();
    router.push(value ? `/menu?search=${encodeURIComponent(value)}` : '/menu');
    onSearch?.();
  };

  return (
    <form onSubmit={handleSubmit} className={`relative ${compact ? 'w-full' : 'w-64 lg:w-80'}`}>
      <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
      <input
        type="search"
        value={term}
        onChange={(event) => setTerm(event.target.value)}
        placeholder="ძებნა..."
        className="h-10 w-full rounded-full border border-zinc-200 bg-zinc-50 pl-9 pr-4 text-sm font-medium text-zinc-900 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
      />
    </form>
  );
}

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="fixed top-0 z-50 w-full border-b border-zinc-100 bg-white/90 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between md:h-20">
          <div className="flex flex-shrink-0 items-center">
            <Link href="/" className="text-2xl font-black tracking-tighter text-zinc-900">
              LOGO<span className="text-emerald-600">.</span>
            </Link>
          </div>

          <nav className="hidden items-center gap-6 md:flex">
            <HeaderSearch />
            <Link href="/contact" className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900">
              კონტაქტი
            </Link>
            <Link href="/cart" className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900">
              <CartNavLabel />
            </Link>
            <Link
              href="/menu"
              className="rounded-lg bg-zinc-900 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:bg-emerald-600"
            >
              მენიუ
            </Link>
          </nav>

          <div className="flex items-center gap-1 md:hidden">
            <button
              type="button"
              onClick={() => {
                setIsSearchOpen((current) => !current);
                setIsOpen(false);
              }}
              className="p-2 text-zinc-900 focus:outline-none"
              aria-label="ძებნის გახსნა"
            >
              <SearchIcon className="h-6 w-6" />
            </button>
            <button
              type="button"
              onClick={() => {
                setIsOpen(!isOpen);
                setIsSearchOpen(false);
              }}
              className="p-2 text-zinc-900 focus:outline-none"
              aria-label="მენიუს გახსნა"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8h18M3 16h18" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {isSearchOpen && (
        <div className="border-t border-zinc-50 bg-white px-4 py-3 shadow-xl md:hidden">
          <HeaderSearch compact onSearch={() => setIsSearchOpen(false)} />
        </div>
      )}

      {isOpen && (
        <div className="border-t border-zinc-50 bg-white shadow-xl md:hidden">
          <div className="space-y-4 px-6 py-8">
            <Link href="/contact" className="block text-lg font-medium text-zinc-800" onClick={() => setIsOpen(false)}>
              კონტაქტი
            </Link>
            <Link href="/cart" className="block text-lg font-medium text-zinc-800" onClick={() => setIsOpen(false)}>
              <CartNavLabel />
            </Link>
            <div className="pt-4">
              <Link
                href="/menu"
                className="block w-full rounded-xl bg-emerald-600 px-5 py-4 text-center font-bold text-white"
                onClick={() => setIsOpen(false)}
              >
                მენიუ
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
