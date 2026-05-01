"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCart } from './CartProvider';

function CartIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 3h2l2.2 11.3a2 2 0 0 0 2 1.7h7.9a2 2 0 0 0 2-1.6L21 7H6" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10 20.5h.01M18 20.5h.01" />
    </svg>
  );
}

export default function FloatingCart() {
  const { items, totalItems, totalPrice, addItem, removeItem, deleteItem, clearCart } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const scrollY = window.scrollY;
    const originalBodyStyle = {
      overflow: document.body.style.overflow,
      position: document.body.style.position,
      top: document.body.style.top,
      width: document.body.style.width,
    };

    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';

    return () => {
      document.body.style.overflow = originalBodyStyle.overflow;
      document.body.style.position = originalBodyStyle.position;
      document.body.style.top = originalBodyStyle.top;
      document.body.style.width = originalBodyStyle.width;
      window.scrollTo(0, scrollY);
    };
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-[120] flex h-14 w-14 items-center justify-center rounded-full bg-zinc-900 text-white shadow-2xl shadow-zinc-400/40 transition hover:bg-emerald-600 md:bottom-5 md:right-5 md:h-16 md:w-16"
        aria-label="კალათა"
      >
        <CartIcon />
        {totalItems > 0 && (
          <span className="absolute -right-1 -top-1 flex h-6 min-w-6 items-center justify-center rounded-full bg-emerald-500 px-1.5 text-xs font-black text-white">
            {totalItems}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[130] bg-zinc-900/50 backdrop-blur-sm md:p-4" onClick={() => setIsOpen(false)}>
          <div
            className="fixed inset-x-0 bottom-0 max-h-[85dvh] overflow-hidden rounded-t-3xl bg-white p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] shadow-2xl md:absolute md:inset-x-auto md:bottom-24 md:right-5 md:w-[calc(100%-2.5rem)] md:max-w-md md:rounded-2xl md:p-5"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-black text-zinc-900">კალათა</h2>
              <button type="button" onClick={() => setIsOpen(false)} className="rounded-full bg-zinc-100 p-2 text-zinc-500">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {items.length > 0 ? (
              <>
                <div className="max-h-[52dvh] space-y-3 overflow-y-auto pr-1 md:max-h-[420px]">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3 rounded-2xl border border-zinc-100 bg-white p-3 shadow-sm">
                      <img src={item.image_url || '/placeholder-food.png'} alt={item.name} className="h-16 w-16 flex-shrink-0 rounded-xl object-cover sm:h-20 sm:w-20" />
                      <div className="flex min-w-0 flex-1 flex-col justify-between">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-black text-zinc-900">{item.name}</p>
                            <p className="mt-1 text-xs font-bold text-zinc-500">{item.price} ₾</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => deleteItem(item.id)}
                            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-red-50 text-red-500 transition hover:bg-red-100"
                            aria-label={`${item.name} კალათიდან სრულად ამოშლა`}
                          >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 7h12M9 7V5h6v2m-8 0 1 12h8l1-12" />
                            </svg>
                          </button>
                        </div>

                        <div className="mt-3 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 rounded-full bg-zinc-100 p-1">
                            <button
                              type="button"
                              onClick={() => removeItem(item.id)}
                              className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-sm font-black text-zinc-700 shadow-sm transition hover:bg-zinc-200"
                              aria-label={`${item.name} რაოდენობის შემცირება`}
                            >
                              -
                            </button>
                            <span className="min-w-6 text-center text-xs font-black text-zinc-900">{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => addItem({
                                id: item.id,
                                name: item.name,
                                price: item.price,
                                image_url: item.image_url,
                              })}
                              className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-900 text-sm font-black text-white shadow-sm transition hover:bg-emerald-600"
                              aria-label={`${item.name} რაოდენობის გაზრდა`}
                            >
                              +
                            </button>
                          </div>
                          <span className="text-xs font-black text-zinc-900 sm:text-sm">
                            {(item.price * item.quantity).toFixed(2)} ₾
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-zinc-100 pt-4">
                  <span className="text-sm font-bold text-zinc-500">ჯამი</span>
                  <span className="text-xl font-black text-zinc-900">{totalPrice.toFixed(2)} ₾</span>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 sm:gap-3">
                  <Link
                    href="/cart"
                    onClick={() => setIsOpen(false)}
                    className="flex h-11 items-center justify-center rounded-xl bg-zinc-900 text-sm font-bold text-white transition hover:bg-emerald-600"
                  >
                    კალათა
                  </Link>
                  <button type="button" onClick={clearCart} className="h-11 rounded-xl bg-zinc-100 text-sm font-bold text-zinc-600 transition hover:bg-zinc-200">
                    გასუფთავება
                  </button>
                </div>
              </>
            ) : (
              <div className="rounded-xl bg-zinc-50 px-4 py-10 text-center text-sm font-semibold text-zinc-400">
                კალათა ცარიელია.
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export { CartIcon };
