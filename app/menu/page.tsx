"use client";
import { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useCart } from '../components/CartProvider';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image_url: string;
  category_id: string;
}

interface Category {
  id: string;
  name: string;
  products: Product[];
}

function MenuSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-20 space-y-20 animate-pulse">
      {[1, 2].map((i) => (
        <section key={i}>
          <div className="h-10 w-48 bg-zinc-200 rounded-lg mb-10" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-10">
            {[1, 2, 3, 4].map((j) => (
              <div key={j} className="flex gap-5 p-3">
                <div className="w-28 h-28 md:w-36 md:h-36 bg-zinc-200 rounded-[1.5rem] flex-shrink-0" />
                <div className="flex-1 space-y-4 py-2">
                  <div className="h-6 bg-zinc-200 rounded w-3/4" />
                  <div className="h-4 bg-zinc-100 rounded w-full" />
                  <div className="flex justify-end pt-2">
                    <div className="w-10 h-10 bg-zinc-200 rounded-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

export default function FullMenuPage() {
  const { addItem } = useCart();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [highlightedProduct, setHighlightedProduct] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [mobileColumns, setMobileColumns] = useState<1 | 2>(2);
  const observer = useRef<IntersectionObserver | null>(null);
  const categoryNavRef = useRef<HTMLDivElement | null>(null);
  const menuResultsRef = useRef<HTMLDivElement | null>(null);
  const didMountSearchRef = useRef(false);
  const categoryButtonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  // 1. მონაცემების წამოღება Supabase-დან
  useEffect(() => {
    const fetchMenu = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('categories')
        .select(`
          id, 
          name, 
          products (id, name, price, description, image_url, category_id)
        `)
        .order('name');

      if (!error && data) {
        setCategories(data as Category[]);
        if (data.length > 0) setActiveCategory(data[0].id);
      }
      setLoading(false);
    };
    fetchMenu();
  }, []);

  // 2. ფუნქცია, რომელიც პასუხისმგებელია სწორ დასქროლვაზე
  const scrollToElement = useCallback((id: string, behavior: ScrollBehavior = 'smooth') => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 140; // Sticky მენიუს + ჰედერის სიმაღლის კომპენსაცია
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: behavior
      });
      return true;
    }

    return false;
  }, []);

  const scrollToCategory = useCallback((id: string, behavior: ScrollBehavior = 'smooth') => {
    if (scrollToElement(id, behavior)) {
      setActiveCategory(id);
    }
  }, [scrollToElement]);

  const scrollToProduct = useCallback((productId: string, behavior: ScrollBehavior = 'smooth') => {
    const productCategory = categories.find((category) =>
      category.products?.some((product) => product.id === productId)
    );

    if (scrollToElement(`product-${productId}`, behavior)) {
      if (productCategory) setActiveCategory(productCategory.id);
      setHighlightedProduct(productId);

      window.setTimeout(() => {
        setHighlightedProduct((current) => current === productId ? '' : current);
      }, 2200);
    }
  }, [categories, scrollToElement]);

  // 3. Deep Linking - სხვა გვერდიდან (მაგ. მთავარიდან) გადმოსვლისას სქროლი
  useEffect(() => {
    if (!loading && categories.length > 0) {
      const hash = window.location.hash;
      if (hash) {
        const targetId = hash.replace('#', '');
        // მცირე დაყოვნება, რომ DOM სრულად დახატოს სკელეტონის შემდეგ
        const timer = setTimeout(() => {
          if (targetId.startsWith('product-')) {
            scrollToProduct(targetId.replace('product-', ''));
          } else if (categories.some((category) => category.products?.some((product) => product.id === targetId))) {
            scrollToProduct(targetId);
          } else {
            scrollToCategory(targetId);
          }
        }, 300);
        return () => clearTimeout(timer);
      }
    }
  }, [loading, categories, scrollToCategory, scrollToProduct]);

  // 4. Intersection Observer - სქროლვისას აქტიური ღილაკის შეცვლა
  const normalizedSearch = searchTerm.trim().toLowerCase();
  const visibleCategories = useMemo(() => (
    normalizedSearch
      ? categories
          .map((category) => ({
            ...category,
            products: category.name.toLowerCase().includes(normalizedSearch)
              ? category.products
              : category.products.filter((product) =>
                  `${product.name} ${product.description}`.toLowerCase().includes(normalizedSearch)
                ),
          }))
          .filter((category) => category.products.length > 0)
      : categories
  ), [categories, normalizedSearch]);

  useEffect(() => {
    if (loading || visibleCategories.length === 0) return;

    const elements: Element[] = [];
    observer.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        // როცა სექცია ხილვადობის 30%-ს გადაცდება
        if (entry.isIntersecting) {
          setActiveCategory(entry.target.id);
        }
      });
    }, { rootMargin: '-15% 0px -70% 0px' });

    elements.forEach(el => observer.current?.observe(el));
    return () => observer.current?.disconnect();
  }, [categories, loading, visibleCategories]);

  useEffect(() => {
    if (loading || visibleCategories.length === 0) return;

    let animationFrame = 0;

    const updateActiveCategory = () => {
      const activationLine = window.innerWidth < 768 ? 190 : 170;
      const sections = visibleCategories
        .map((category) => document.getElementById(category.id))
        .filter((section): section is HTMLElement => Boolean(section));

      let currentCategory = sections[0]?.id || '';

      sections.forEach((section) => {
        if (section.getBoundingClientRect().top <= activationLine) {
          currentCategory = section.id;
        }
      });

      if (currentCategory) setActiveCategory(currentCategory);
    };

    const handleScroll = () => {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = window.requestAnimationFrame(updateActiveCategory);
    };

    const timer = window.setTimeout(updateActiveCategory, 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    return () => {
      window.clearTimeout(timer);
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [loading, visibleCategories]);

  useEffect(() => {
    if (!activeCategory || typeof window === 'undefined') return;
    if (!window.matchMedia('(max-width: 767px)').matches) return;

    const nav = categoryNavRef.current;
    const activeButton = categoryButtonRefs.current[activeCategory];
    if (!nav || !activeButton) return;

    const navRect = nav.getBoundingClientRect();
    const buttonRect = activeButton.getBoundingClientRect();
    const targetLeft = nav.scrollLeft + buttonRect.left - navRect.left - (navRect.width - buttonRect.width) / 2;

    nav.scrollTo({
      left: targetLeft,
      behavior: 'smooth',
    });
  }, [activeCategory]);

  useEffect(() => {
    if (loading) return;

    if (!didMountSearchRef.current) {
      didMountSearchRef.current = true;
      return;
    }

    const timer = window.setTimeout(() => {
      const results = menuResultsRef.current;
      if (!results) return;

      const offset = window.innerWidth < 768 ? 190 : 170;
      const bodyRect = document.body.getBoundingClientRect().top;
      const resultsRect = results.getBoundingClientRect().top;
      const resultsPosition = resultsRect - bodyRect;

      window.scrollTo({
        top: Math.max(resultsPosition - offset, 0),
        behavior: 'smooth',
      });

      if (visibleCategories[0]) {
        setActiveCategory(visibleCategories[0].id);
      }
    }, 80);

    return () => window.clearTimeout(timer);
  }, [loading, normalizedSearch, visibleCategories]);

  return (
    <main className="min-h-screen bg-white py-20">
      <span
        className="hidden"
        aria-hidden="true"
        aria-label="მთავარ გვერდზე დაბრუნება"
        title="მთავარ გვერდზე დაბრუნება"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M15 19l-7-7 7-7" />
        </svg>
      </span>

      {/* მთავარი სათაური */}
      <div className="bg-zinc-900 py-24 px-4 text-center">
        <h1 className="text-4xl md:text-7xl font-black text-white uppercase italic tracking-tighter">
          ჩვენი მენიუ
        </h1>
        <p className="text-zinc-400 mt-4 max-w-md mx-auto text-sm md:text-base font-medium">
          აღმოაჩინე საუკეთესო გემოები, დამზადებული ნატურალური პროდუქტებით
        </p>
      </div>

      {/* STICKY NAVIGATION - მენიუს კატეგორიები */}
      <div className="sticky top-20 z-40 bg-white/90 backdrop-blur-xl border-b border-zinc-100 shadow-sm">
        <div
          ref={categoryNavRef}
          className="max-w-7xl mx-auto px-4 flex gap-3 py-4 overflow-x-auto no-scrollbar scroll-smooth"
        >
          <span
            className="hidden"
            aria-hidden="true"
            aria-label="მთავარ გვერდზე დაბრუნება"
            title="მთავარ გვერდზე დაბრუნება"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M15 19l-7-7 7-7" />
            </svg>
          </span>
          {loading ? (
            [1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-10 w-28 bg-zinc-100 rounded-full animate-pulse flex-shrink-0" />
            ))
          ) : (
            categories.map((cat) => (
              <button
                key={cat.id}
                ref={(element) => {
                  categoryButtonRefs.current[cat.id] = element;
                }}
                onClick={() => scrollToCategory(cat.id)}
                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 whitespace-nowrap ${
                  activeCategory === cat.id 
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200 scale-105' 
                  : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200 hover:text-zinc-800'
                }`}
              >
                {cat.name}
              </button>
            ))
          )}
        </div>

        <div className="max-w-7xl mx-auto px-4 pb-4 mt-4 flex items-center gap-3">
          <label className="relative block min-w-0 flex-1">
            <span className="sr-only">პროდუქტის ძებნა</span>
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="ძებნა..."
              className="w-full h-11 rounded-xl border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </label>

          <div className="grid w-24 flex-shrink-0 grid-cols-2 rounded-xl bg-zinc-100 p-1 md:hidden" aria-label="სვეტების რაოდენობა">
            {([1, 2] as const).map((count) => (
              <button
                key={count}
                type="button"
                onClick={() => setMobileColumns(count)}
                aria-label={count === 1 ? 'ერთი სვეტი' : 'ორი სვეტი'}
                title={count === 1 ? 'ერთი სვეტი' : 'ორი სვეტი'}
                className={`h-9 rounded-lg text-sm font-bold transition ${
                  mobileColumns === count
                    ? 'bg-zinc-900 text-white shadow-sm'
                    : 'text-zinc-500'
                }`}
              >
                {count === 1 ? (
                  <svg className="mx-auto h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                    <rect x="5" y="6" width="14" height="4" rx="1.5" strokeWidth="2" />
                    <rect x="5" y="14" width="14" height="4" rx="1.5" strokeWidth="2" />
                  </svg>
                ) : (
                  <svg className="mx-auto h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                    <rect x="4" y="5" width="6" height="6" rx="1.5" strokeWidth="2" />
                    <rect x="14" y="5" width="6" height="6" rx="1.5" strokeWidth="2" />
                    <rect x="4" y="15" width="6" height="4" rx="1.5" strokeWidth="2" />
                    <rect x="14" y="15" width="6" height="4" rx="1.5" strokeWidth="2" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* მენიუს კონტენტი */}
      {loading ? (
        <MenuSkeleton />
      ) : (
        <div ref={menuResultsRef} className="max-w-7xl mx-auto px-4 py-16 flex flex-col gap-14">
          {visibleCategories.length > 0 ? visibleCategories.map((category) => (
            <section 
              key={category.id} 
              id={category.id} 
              className="scroll-mt-40 transition-opacity duration-500"
            >
              <div className="flex items-center gap-4 mb-12">
                <h2 className="text-3xl md:text-4xl font-black text-zinc-900 uppercase italic tracking-tight">
                  {category.name}
                </h2>
                <div className="h-[2px] flex-1 bg-gradient-to-r from-zinc-200 to-transparent"></div>
              </div>

              <div className={`grid gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4 lg:gap-8 ${
                mobileColumns === 1 ? 'grid-cols-1' : 'grid-cols-2'
              }`}>
                {category.products && category.products.length > 0 ? (
                  category.products.map((product) => (
                    <div 
                      key={product.id} 
                      id={`product-${product.id}`}
                      className={`group flex gap-4 p-3 md:p-4 rounded-[1.5rem] md:rounded-[2rem] scroll-mt-40 transition-all duration-500 border ${
                        mobileColumns === 1 ? 'flex-row' : 'flex-col'
                      } md:flex-col ${
                        highlightedProduct === product.id
                          ? 'bg-emerald-50 border-emerald-300 shadow-2xl shadow-emerald-100'
                          : 'border-transparent hover:bg-zinc-50 hover:border-zinc-100'
                      }`}
                    >
                      {/* პროდუქტის ფოტო */}
                      <div className={`relative flex-shrink-0 overflow-hidden rounded-[1.25rem] md:rounded-[1.75rem] bg-zinc-100 shadow-sm ${
                        mobileColumns === 1 ? 'h-28 w-28' : 'aspect-square w-full'
                      } md:aspect-square md:h-auto md:w-full`}>
                        <img 
                          src={product.image_url || '/placeholder-food.png'} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          alt={product.name}
                          loading="lazy"
                        />
                      </div>
                      
                      {/* ინფორმაცია */}
                      <div className="flex flex-col justify-between flex-1 py-1">
                        <div>
                          <div className={`flex gap-2 ${
                            mobileColumns === 1 ? 'flex-row justify-between items-start' : 'flex-col'
                          } md:flex-row md:justify-between md:items-start`}>
                            <h3 className={`${mobileColumns === 1 ? 'text-lg' : 'text-sm'} md:text-xl font-extrabold text-zinc-800 group-hover:text-emerald-600 transition-colors leading-tight`}>
                              {product.name}
                            </h3>
                            <span className={`w-fit ${mobileColumns === 1 ? 'text-lg' : 'text-sm'} md:text-xl font-black text-zinc-900 whitespace-nowrap bg-zinc-100 px-2.5 md:px-3 py-1 rounded-xl group-hover:bg-emerald-50 group-hover:text-emerald-700 transition-colors`}>
                              {product.price}₾
                            </span>
                          </div>
                          <p className={`${mobileColumns === 1 ? 'text-sm line-clamp-3' : 'text-xs line-clamp-2'} md:text-sm mt-2 leading-relaxed text-zinc-500 md:line-clamp-3`}>
                            {product.description}
                          </p>
                        </div>
                        
                        {/* დამატების ღილაკი */}
                        <button
                          type="button"
                          onClick={() => addItem({
                            id: product.id,
                            name: product.name,
                            price: product.price,
                            image_url: product.image_url || '/placeholder-food.png',
                          })}
                          className="self-end mt-4 bg-zinc-900 text-white w-9 h-9 md:w-11 md:h-11 rounded-full flex items-center justify-center hover:bg-emerald-600 hover:scale-110 transition-all shadow-md active:scale-95 group/btn"
                          aria-label={`${product.name} კალათაში დამატება`}
                        >
                           <span className="text-xl md:text-2xl leading-none group-hover/btn:rotate-90 transition-transform">+</span>
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-zinc-400 italic">ამ კატეგორიაში პროდუქტები ჯერ არ არის.</p>
                )}
              </div>
            </section>
          )) : (
            <div className="rounded-2xl bg-zinc-50 px-6 py-16 text-center text-zinc-400">
              პროდუქტი ვერ მოიძებნა.
            </div>
          )}
        </div>
      )}

      {/* Footer-თან დაშორება */}
      <div className="h-20"></div>
    </main>
  );
}
