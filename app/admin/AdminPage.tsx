"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AddCategoryForm from './AddCategoryForm';
import AddProductForm from './AddProductForm';
import ProductList from './ProductList';
import { supabase } from '@/lib/supabase';

export default function AdminDashboard() {
  const router = useRouter();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const handleUpdate = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();

      if (!data.session) {
        router.replace('/login');
        return;
      }

      setCheckingAuth(false);
    };

    checkSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.replace('/login');
      }
    });

    return () => listener.subscription.unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace('/login');
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-zinc-50 py-20 flex items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-zinc-200 border-t-emerald-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 py-20">
      <div className="w-full mx-auto px-4">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-4xl font-black text-zinc-900 tracking-tighter">
            Admin Panel<span className="text-emerald-600">.</span>
          </h1>
          <button
            type="button"
            onClick={handleLogout}
            className="w-fit rounded-xl bg-zinc-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-600"
          >
            გასვლა
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <section>
              <AddCategoryForm onCategoryAdded={handleUpdate} />
            </section>
            
            <section>
              <AddProductForm refreshTrigger={refreshTrigger} />
            </section>
          </div>



          <section>
            <h2 className="text-2xl font-bold text-zinc-900 mb-6">არსებული მენიუ</h2>
            <ProductList refreshTrigger={refreshTrigger} />
          </section>
        </div>
      </div>
    </div>
  );
}
