"use client";

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import { supabase } from '@/lib/supabase';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image_url: string;
}

export default function Hero() {
  const containerRef = useRef<HTMLElement | null>(null);
  const [dailyProduct, setDailyProduct] = useState<Product | null>(null);
  const [loadingProduct, setLoadingProduct] = useState(true);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".animate-item", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const fetchDailyProduct = async () => {
      setLoadingProduct(true);
      const { data, error } = await supabase
        .from('products')
        .select('id, name, price, description, image_url')
        .eq('is_daily_offer', true)
        .limit(1)
        .maybeSingle();

      if (!error && data) setDailyProduct(data);

      setLoadingProduct(false);
    };

    fetchDailyProduct();
  }, []);

  const productHref = dailyProduct ? `/menu#product-${dailyProduct.id}` : '/menu';

  return (
    <section ref={containerRef} className="relative overflow-hidden bg-white py-5 md:py-8">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-5 rounded-[1.75rem] bg-zinc-50 p-4 shadow-sm ring-1 ring-zinc-100 md:grid-cols-[1fr_260px] md:p-6 lg:grid-cols-[1fr_340px]">
          <div className="flex flex-col justify-center text-center md:text-left">
            <div className="animate-item mb-3 inline-flex items-center justify-center gap-2 md:justify-start">
              <span className="h-[1px] w-8 bg-emerald-600" />
              <span className="text-emerald-600 font-bold tracking-widest text-xs uppercase">
                დღის შეთავაზება
              </span>
            </div>

            <h1 className="animate-item mb-3 text-3xl font-black leading-[1.05] text-zinc-900 md:text-4xl lg:text-5xl">
              {loadingProduct ? 'იტვირთება' : dailyProduct?.name || 'მენიუ'}
              {/* <span className="text-emerald-600 italic font-serif">
                რჩეული პროდუქტი
              </span> */}
            </h1>

            <p className="animate-item mx-auto mb-5 max-w-2xl text-sm leading-relaxed text-zinc-500 md:mx-0 md:text-base">
              {loadingProduct
                ? 'დღის შეთავაზება იტვირთება...'
                : dailyProduct?.description || 'აღმოაჩინე ჩვენი დღევანდელი რჩეული პროდუქტი.'}
            </p>

            <div className="animate-item flex flex-col items-center gap-3 sm:flex-row md:justify-start">
              <Link
                href={productHref}
                className="w-full rounded-full bg-zinc-900 px-7 py-3 text-center text-sm font-bold text-white transition-all duration-300 hover:bg-emerald-600 sm:w-auto"
              >
                {dailyProduct ? `შეუკვეთე - ${dailyProduct.price} ₾` : 'ნახე მენიუ'}
              </Link>
              <Link
                href="/menu"
                className="w-full rounded-full border border-zinc-200 bg-white px-7 py-3 text-center text-sm font-bold text-zinc-900 transition-all hover:bg-zinc-50 sm:w-auto"
              >
                სრული მენიუ
              </Link>
            </div>
          </div>

          <div className="animate-item relative flex justify-center md:justify-end">
            <Link
              href={productHref}
              className="relative h-[180px] w-full max-w-[260px] overflow-hidden rounded-[1.35rem] bg-zinc-100 shadow-xl shadow-zinc-200/70 md:h-[220px] md:max-w-none lg:h-[260px]"
            >
              {loadingProduct ? (
                <div className="w-full h-full animate-pulse bg-zinc-200" />
              ) : (
                <Image
                  src={dailyProduct?.image_url || '/hero.jpeg'}
                  alt={dailyProduct?.name || 'დღის შეთავაზება'}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 768px) 260px, (max-width: 1024px) 260px, 340px"
                  priority
                />
              )}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
