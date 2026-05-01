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
    <section ref={containerRef} className="relative min-h-[90vh] flex items-center bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col justify-center text-center lg:text-left order-2 lg:order-1">
            <div className="animate-item inline-flex items-center justify-center lg:justify-start gap-2 mb-6">
              <span className="w-12 h-[1px] bg-emerald-600" />
              <span className="text-emerald-600 font-bold tracking-widest text-xs uppercase">
                დღის შეთავაზება
              </span>
            </div>

            <h1 className="animate-item text-4xl md:text-6xl lg:text-7xl font-black text-zinc-900 leading-[1.1] mb-6">
              {loadingProduct ? 'იტვირთება' : dailyProduct?.name || 'მენიუ'}
              <br />
              {/* <span className="text-emerald-600 italic font-serif">
                რჩეული პროდუქტი
              </span> */}
            </h1>

            <p className="animate-item text-zinc-500 text-lg md:text-xl max-w-lg mx-auto lg:mx-0 mb-10 leading-relaxed">
              {loadingProduct
                ? 'დღის შეთავაზება იტვირთება...'
                : dailyProduct?.description || 'აღმოაჩინე ჩვენი დღევანდელი რჩეული პროდუქტი.'}
            </p>

            <div className="animate-item flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <Link
                href={productHref}
                className="w-full sm:w-auto px-10 py-4 bg-zinc-900 text-white rounded-full font-bold hover:bg-emerald-600 transition-all duration-300 text-center"
              >
                {dailyProduct ? `შეუკვეთე - ${dailyProduct.price} ₾` : 'ნახე მენიუ'}
              </Link>
              <Link
                href="/menu"
                className="w-full sm:w-auto px-10 py-4 border border-zinc-200 text-zinc-900 rounded-full font-bold hover:bg-zinc-50 transition-all text-center"
              >
                სრული მენიუ
              </Link>
            </div>
          </div>

          <div className="animate-item relative flex justify-center lg:justify-end order-1 lg:order-2">
            <div className="absolute top-1/2 left-1/2 lg:left-3/4 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-100/50 rounded-full blur-[80px] -z-10" />

            <Link
              href={productHref}
              className="relative w-[280px] h-[280px] sm:w-[400px] sm:h-[400px] lg:w-[500px] lg:h-[500px] overflow-hidden rounded-[2rem] bg-zinc-100 shadow-2xl shadow-zinc-200/70"
            >
              {loadingProduct ? (
                <div className="w-full h-full animate-pulse bg-zinc-200" />
              ) : (
                <Image
                  src={dailyProduct?.image_url || '/hero.jpeg'}
                  alt={dailyProduct?.name || 'დღის შეთავაზება'}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 640px) 280px, (max-width: 1024px) 400px, 500px"
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
