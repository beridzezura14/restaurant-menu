"use client";

import Link from 'next/link';
import { useCart } from '../components/CartProvider';

export default function CartPage() {
  const { items, totalItems, totalPrice, addItem, removeItem, deleteItem, clearCart } = useCart();

  return (
    <main className="min-h-screen bg-zinc-50 pb-24 pt-16 md:pb-0 md:pt-20">
      <section className="bg-zinc-900 px-4 py-10 text-center md:py-16">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-emerald-400">
          შეკვეთა
        </p>
        <h1 className="text-3xl font-black uppercase italic tracking-tight text-white md:text-6xl">
          კალათა
        </h1>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-8 md:py-12">
        {items.length > 0 ? (
          <div className="grid gap-6 lg:grid-cols-[1fr_320px] lg:gap-8">
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 rounded-2xl border border-zinc-100 bg-white p-3 shadow-sm md:gap-4 md:p-4">
                  <img
                    src={item.image_url || '/placeholder-food.png'}
                    alt={item.name}
                    className="h-20 w-20 flex-shrink-0 rounded-xl object-cover md:h-32 md:w-32"
                  />
                  <div className="flex min-w-0 flex-1 flex-col justify-between">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h2 className="text-base font-black text-zinc-900 md:text-2xl">{item.name}</h2>
                        <p className="mt-1 text-sm font-bold text-zinc-500">{item.price} ₾</p>
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

                    <div className="mt-3 flex items-center justify-between gap-2 md:mt-4 md:gap-3">
                      <div className="flex items-center gap-2 rounded-full bg-zinc-100 p-1">
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-base font-black text-zinc-700 shadow-sm md:h-9 md:w-9 md:text-lg"
                          aria-label={`${item.name} რაოდენობის შემცირება`}
                        >
                          -
                        </button>
                        <span className="min-w-6 text-center text-sm font-black text-zinc-900 md:min-w-8">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => addItem({
                            id: item.id,
                            name: item.name,
                            price: item.price,
                            image_url: item.image_url,
                          })}
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-900 text-base font-black text-white shadow-sm md:h-9 md:w-9 md:text-lg"
                          aria-label={`${item.name} რაოდენობის გაზრდა`}
                        >
                          +
                        </button>
                      </div>

                      <span className="text-sm font-black text-zinc-900 md:text-lg">
                        {(item.price * item.quantity).toFixed(2)} ₾
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <aside className="h-fit rounded-2xl border border-zinc-100 bg-white p-4 shadow-xl shadow-zinc-100 md:p-6">
              <h2 className="text-2xl font-black text-zinc-900">ჯამი</h2>
              <div className="mt-6 space-y-4 text-sm font-bold text-zinc-500">
                <div className="flex justify-between">
                  <span>პროდუქტები</span>
                  <span>{totalItems}</span>
                </div>
                <div className="flex justify-between border-t border-zinc-100 pt-4 text-xl text-zinc-900">
                  <span>სულ</span>
                  <span>{totalPrice.toFixed(2)} ₾</span>
                </div>
              </div>

              <button
                type="button"
                className="mt-6 h-12 w-full rounded-xl bg-zinc-900 text-sm font-bold text-white transition hover:bg-emerald-600"
              >
                შეკვეთის გაფორმება
              </button>
              <button
                type="button"
                onClick={clearCart}
                className="mt-3 h-11 w-full rounded-xl bg-zinc-100 text-sm font-bold text-zinc-600 transition hover:bg-zinc-200"
              >
                კალათის გასუფთავება
              </button>
            </aside>
          </div>
        ) : (
          <div className="rounded-2xl bg-white px-4 py-12 text-center shadow-sm md:px-6 md:py-16">
            <h2 className="text-2xl font-black text-zinc-900">კალათა ცარიელია</h2>
            <p className="mt-3 text-sm text-zinc-500">აირჩიე პროდუქტები მენიუდან და აქ გამოჩნდება.</p>
            <Link
              href="/menu"
              className="mt-8 inline-flex h-12 items-center rounded-xl bg-zinc-900 px-6 text-sm font-bold text-white transition hover:bg-emerald-600"
            >
              მენიუზე გადასვლა
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
