"use client";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image_url: string;
}

interface Category {
  name: string;
  image_url: string;
}

export default function CategoryPage() {
  const { id } = useParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryData = async () => {
      setLoading(true);
      const { data: catData } = await supabase
        .from('categories')
        .select('name, image_url')
        .eq('id', id)
        .single();

      if (catData) setCategory(catData);

      const { data: prodData } = await supabase
        .from('products')
        .select('*')
        .eq('category_id', id);

      if (prodData) setProducts(prodData);
      setLoading(false);
    };

    if (id) fetchCategoryData();
  }, [id]);

  // --- Skeleton Loader კომპონენტი ---
  const SkeletonCard = () => (
    <div className="bg-white rounded-3xl p-4 flex gap-4 border border-zinc-100 animate-pulse">
      <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-zinc-200" />
      <div className="flex flex-col justify-between py-1 flex-1">
        <div className="space-y-3">
          <div className="h-5 bg-zinc-200 rounded-lg w-3/4" />
          <div className="h-4 bg-zinc-100 rounded-lg w-full" />
          <div className="h-4 bg-zinc-100 rounded-lg w-1/2" />
        </div>
        <div className="flex justify-between items-center mt-4">
          <div className="h-6 bg-zinc-200 rounded-lg w-16" />
          <div className="h-10 bg-zinc-200 rounded-xl w-24" />
        </div>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-zinc-50 pb-20">
      {/* ჰედერი */}
      <div className="relative h-64 w-full overflow-hidden bg-zinc-200">
        {!loading && category?.image_url && (
          <img 
            src={category.image_url} 
            className="w-full h-full object-cover transition-opacity duration-500"
            alt=""
          />
        )}
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          {loading ? (
            <div className="h-10 w-48 bg-white/20 rounded-full animate-pulse" />
          ) : (
            <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-wider">
              {category?.name}
            </h1>
          )}
        </div>
        <Link href="/" className="absolute top-6 left-6 bg-white/20 backdrop-blur-md p-2 rounded-full text-white hover:bg-white hover:text-black transition z-20">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
      </div>

      <div className="max-w-5xl mx-auto px-4 -mt-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loading ? (
            // ჩატვირთვისას ვაჩვენებთ 6 ცალ Skeleton ბარათს
            Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          ) : products.length > 0 ? (
            products.map((product) => (
              <Link
                key={product.id}
                href={`/menu#product-${product.id}`}
                className="bg-white rounded-3xl p-4 flex gap-4 shadow-sm hover:shadow-xl transition-shadow duration-300 border border-zinc-100"
              >
                <img 
                  src={product.image_url} 
                  className="w-24 h-24 md:w-32 md:h-32 rounded-2xl object-cover bg-zinc-50" 
                  alt={product.name}
                />
                <div className="flex flex-col justify-between py-1 flex-1">
                  <div>
                    <h4 className="text-xl font-bold text-zinc-900">{product.name}</h4>
                    <p className="text-sm text-zinc-500 line-clamp-2 mt-1">{product.description}</p>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-xl font-black text-emerald-600">{product.price} ₾</span>
                    <span className="bg-zinc-900 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-emerald-600 transition">
                      დამატება
                    </span>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full bg-white p-20 rounded-3xl text-center text-zinc-400">
              ამ კატეგორიაში პროდუქტები ჯერ არ არის.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
