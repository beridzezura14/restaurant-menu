"use client";

import { useState } from 'react';
import Link from 'next/link';
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

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 z-50 w-full border-b border-zinc-100 bg-white/90 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <div className="flex flex-shrink-0 items-center">
            <Link href="/" className="text-2xl font-black tracking-tighter text-zinc-900">
              LOGO<span className="text-emerald-600">.</span>
            </Link>
          </div>

          <nav className="hidden items-center space-x-8 md:flex">
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

          <div className="flex items-center md:hidden">
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
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
