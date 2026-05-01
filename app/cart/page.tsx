"use client";

import Link from 'next/link';
import { useCart } from '../components/CartProvider';

export default function CartPage() {
  const { items, totalItems, totalPrice, addItem, removeItem, clearCart } = useCart();

  return (
    <main className="min-h-screen bg-zinc-50 pt-20">
      <section className="bg-zinc-900 px-4 py-16 text-center">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-emerald-400">
          შეკვეთა
        </p>
        <h1 className="text-4xl font-black uppercase italic tracking-tight text-white md:text-6xl">
          კალათა
        </h1>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12">
        {items.length > 0 ? (
          <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 rounded-2xl border border-zinc-100 bg-white p-4 shadow-sm">
                  <img
                    src={item.image_url || '/placeholder-food.png'}
                    alt={item.name}
                    className="h-24 w-24 flex-shrink-0 rounded-xl object-cover md:h-32 md:w-32"
                  />
                  <div className="flex min-w-0 flex-1 flex-col justify-between">
                    <div>
                      <h2 className="text-lg font-black text-zinc-900 md:text-2xl">{item.name}</h2>
                      <p className="mt-1 text-sm font-bold text-zinc-500">{item.price} ₾</p>
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 rounded-full bg-zinc-100 p-1">
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-lg font-black text-zinc-700 shadow-sm"
                          aria-label={`${item.name} რაოდენობის შემცირება`}
                        >
                          -
                        </button>
                        <span className="min-w-8 text-center text-sm font-black text-zinc-900">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => addItem({
                            id: item.id,
                            name: item.name,
                            price: item.price,
                            image_url: item.image_url,
                          })}
                          className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-900 text-lg font-black text-white shadow-sm"
                          aria-label={`${item.name} რაოდენობის გაზრდა`}
                        >
                          +
                        </button>
                      </div>

                      <span className="text-lg font-black text-zinc-900">
                        {(item.price * item.quantity).toFixed(2)} ₾
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <aside className="h-fit rounded-2xl border border-zinc-100 bg-white p-6 shadow-xl shadow-zinc-100">
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
          <div className="rounded-2xl bg-white px-6 py-16 text-center shadow-sm">
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
