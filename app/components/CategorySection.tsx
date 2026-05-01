"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import Link from 'next/link';

interface Category {
  id: string;
  name: string;
  image_url: string;
}

export default function CategorySection() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name, image_url')
        .order('name');

      if (!error && data) setCategories(data);
      setLoading(false);
    };

    fetchCategories();
  }, []);

  // --- Skeleton Loading View ---
  if (loading) {
    return (
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="flex flex-col items-center mb-12">
          <div className="h-10 w-40 bg-zinc-100 rounded-md animate-pulse mb-2"></div>
          <div className="h-1.5 w-20 bg-zinc-100 rounded-full animate-pulse"></div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-4">
              <div className="aspect-square bg-zinc-100 rounded-[2.5rem] animate-pulse" />
              <div className="h-6 bg-zinc-100 rounded-md w-2/3 mx-auto animate-pulse" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      <div className="flex flex-col items-center mb-12">
        <h2 className="text-4xl font-black text-zinc-900 mb-2 uppercase italic tracking-tighter">მენიუ</h2>
        <div className="h-1.5 w-20 bg-emerald-500 rounded-full"></div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {categories.map((category) => (
          <Link 
            href={`/menu#${category.id}`} 
            key={category.id} 
            className="group block space-y-4 text-center"
          >
            <div className="relative aspect-square overflow-hidden rounded-[2.5rem] bg-zinc-100 border border-zinc-100 shadow-sm transition-all duration-500 group-hover:scale-[1.03] group-hover:shadow-2xl group-hover:shadow-emerald-100/50">
              <Image
                src={category.image_url || 'https://via.placeholder.com/400'}
                alt={category.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                <span className="text-white text-xs font-bold bg-emerald-600/80 backdrop-blur-md px-5 py-2 rounded-full border border-white/20 uppercase tracking-widest">
                  ნახვა
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="font-extrabold text-xl text-zinc-800 capitalize group-hover:text-emerald-600 transition-colors duration-300">
                {category.name}
              </h3>
              <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                აღმოაჩინე
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}