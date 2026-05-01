"use client";
import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category_id: string;
  image_url: string;
  is_daily_offer?: boolean;
}

interface Category {
  id: string;
  name: string;
  image_url: string;
  products: Product[];
}

export default function ProductList({ refreshTrigger }: { refreshTrigger: number }) {
  const [data, setData] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  
  // States
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({ name: '', price: '', description: '', image_url: '' });

  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryForm, setCategoryForm] = useState({ name: '', image_url: '' });

  const fetchData = useCallback(async () => {
    setLoading(true);
    const { data: categories, error } = await supabase
      .from('categories')
      .select(`id, name, image_url, products (id, name, price, description, category_id, image_url, is_daily_offer)`)
      .order('name');

    if (!error && categories) setData(categories as Category[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    void Promise.resolve().then(fetchData);
  }, [fetchData, refreshTrigger]);

  // --- ფოტოს ატვირთვის ფუნქცია ---
  const handleImageUpload = async (file: File, folder: string) => {
    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(filePath, file);

    if (uploadError) {
      alert('ფოტოს ატვირთვა ვერ მოხერხდა');
      setUploading(false);
      return null;
    }

    const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(filePath);
    setUploading(false);
    return publicUrl;
  };

  // --- კატეგორიის განახლება ---
  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;

    const { error } = await supabase
      .from('categories')
      .update({ 
        name: categoryForm.name,
        image_url: categoryForm.image_url 
      })
      .eq('id', editingCategory.id);

    if (!error) {
      setEditingCategory(null);
      fetchData();
    }
  };

  // --- პროდუქტის განახლება ---
  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    const { error } = await supabase
      .from('products')
      .update({
        name: productForm.name,
        price: parseFloat(productForm.price),
        description: productForm.description,
        image_url: productForm.image_url
      })
      .eq('id', editingProduct.id);

    if (!error) {
      setEditingProduct(null);
      fetchData();
    }
  };

  const handleSetDailyOffer = async (productId: string) => {
    const { error: resetError } = await supabase
      .from('products')
      .update({ is_daily_offer: false })
      .neq('id', productId);

    if (resetError) {
      alert('დღის შეთავაზების განახლება ვერ მოხერხდა. შეამოწმე, რომ products ცხრილში is_daily_offer სვეტი არსებობს.');
      return;
    }

    const { error } = await supabase
      .from('products')
      .update({ is_daily_offer: true })
      .eq('id', productId);

    if (!error) {
      fetchData();
    } else {
      alert('დღის შეთავაზების მონიშვნა ვერ მოხერხდა.');
    }
  };

  if (loading) return <div className="text-zinc-500 py-10 text-center italic">იტვირთება...</div>;

  return (
    <div className="mt-12 space-y-16">
      {data.map((category) => (
        <div key={category.id} className="space-y-6">
          <div className="flex items-center gap-4 group">
            <img src={category.image_url} className="w-12 h-12 rounded-full object-cover border" alt="" />
            <h3 className="text-2xl font-bold text-zinc-900">{category.name}</h3>
            <button onClick={() => {
              setEditingCategory(category);
              setCategoryForm({ name: category.name, image_url: category.image_url });
            }} className="p-2 text-zinc-400 hover:text-emerald-600 transition">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {category.products.map((product) => (
              <div key={product.id} className="flex items-center justify-between bg-white p-4 rounded-2xl border border-zinc-100">
                <div className="flex items-center gap-4">
                  <img src={product.image_url} className="w-16 h-16 rounded-xl object-cover bg-zinc-50" alt="" />
                  <div>
                    <h4 className="font-bold text-zinc-800">{product.name}</h4>
                    <p className="text-sm text-zinc-500">{product.price} ₾</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleSetDailyOffer(product.id)}
                    className={`rounded-xl px-3 py-2 text-xs font-bold transition ${
                      product.is_daily_offer
                        ? 'bg-emerald-600 text-white'
                        : 'bg-zinc-100 text-zinc-500 hover:bg-emerald-50 hover:text-emerald-700'
                    }`}
                  >
                    {product.is_daily_offer ? 'დღის შეთავაზება' : 'აირჩიე'}
                  </button>
                  <button onClick={() => {
                    setEditingProduct(product);
                    setProductForm({ name: product.name, price: product.price.toString(), description: product.description, image_url: product.image_url });
                  }} className="p-2 text-zinc-400 hover:text-emerald-600">
                     <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* --- კატეგორიის მოდალი --- */}
      {editingCategory && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 w-full max-w-sm">
            <h3 className="text-xl font-bold mb-6">კატეგორიის შეცვლა</h3>
            <form onSubmit={handleUpdateCategory} className="space-y-4">
              <div className="flex flex-col items-center gap-2 mb-4">
                <img src={categoryForm.image_url} className="w-20 h-20 rounded-full object-cover border" />
                <input type="file" accept="image/*" onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const url = await handleImageUpload(file, 'category-images');
                    if (url) setCategoryForm({ ...categoryForm, image_url: url });
                  }
                }} className="text-xs" />
              </div>
              <input type="text" className="w-full p-3 rounded-xl border border-zinc-200 text-zinc-900" value={categoryForm.name} onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })} required />
              <button disabled={uploading} type="submit" className="w-full py-3 bg-emerald-600 text-white rounded-xl">{uploading ? 'იტვირთება...' : 'შენახვა'}</button>
              <button type="button" onClick={() => setEditingCategory(null)} className="w-full text-zinc-500 text-sm">გაუქმება</button>
            </form>
          </div>
        </div>
      )}

      {/* --- პროდუქტის მოდალი --- */}
      {editingProduct && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-bold mb-6">პროდუქტის რედაქტირება</h3>
            <form onSubmit={handleUpdateProduct} className="space-y-4">
              <div className="flex items-center gap-4 mb-4">
                <img src={productForm.image_url} className="w-20 h-20 rounded-xl object-cover border" />
                <input type="file" accept="image/*" onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const url = await handleImageUpload(file, 'product-images');
                    if (url) setProductForm({ ...productForm, image_url: url });
                  }
                }} className="text-sm" />
              </div>
              <input type="text" className="w-full p-3 rounded-xl border border-zinc-200 text-zinc-900" value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} required />
              <input type="number" className="w-full p-3 rounded-xl border border-zinc-200 text-zinc-900" value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: e.target.value })} required />
              <textarea className="w-full p-3 rounded-xl border border-zinc-200 text-zinc-900 h-24" value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} />
              <button disabled={uploading} type="submit" className="w-full py-3 bg-emerald-600 text-white rounded-xl font-semibold">{uploading ? 'ფოტო იტვირთება...' : 'ცვლილებების შენახვა'}</button>
              <button type="button" onClick={() => setEditingProduct(null)} className="w-full text-zinc-500 py-2">გაუქმება</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
