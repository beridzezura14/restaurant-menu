"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface Category {
  id: string;
  name: string;
}

export default function AddProductForm({ refreshTrigger }: { refreshTrigger: number }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category_id: '',
    description: ''
  });

  useEffect(() => {
    async function fetchCategories() {
      const { data } = await supabase.from('categories').select('id, name').order('name');
      if (data) setCategories(data);
    }
    fetchCategories();
  }, [refreshTrigger]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let imageUrl = '';

    // 1. ფოტოს ატვირთვა Supabase Storage-ში
    if (file) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `product-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('images') // გამოიყენე იგივე Bucket რაც კატეგორიებისთვის
        .upload(filePath, file);

      if (!uploadError) {
        const { data } = supabase.storage.from('images').getPublicUrl(filePath);
        imageUrl = data.publicUrl;
      } else {
        console.error('Upload error:', uploadError);
      }
    }

    // 2. მონაცემების შენახვა Database-ში
    const { error } = await supabase.from('products').insert([
      { 
        name: formData.name, 
        price: parseFloat(formData.price), 
        category_id: formData.category_id,
        description: formData.description,
        image_url: imageUrl // ინახება ფოტოს ლინკი
      }
    ]);

    if (!error) {
      alert("პროდუქტი წარმატებით დაემატა!");
      setFormData({ name: '', price: '', category_id: '', description: '' });
      setFile(null);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl border border-zinc-100 shadow-sm">
      <h2 className="text-2xl font-bold mb-6 text-zinc-900">პროდუქტის დამატება</h2>
      
      <div className="space-y-4">
        {/* ფოტოს არჩევა */}
        <div className="mb-4">
          <input 
            type="file" 
            accept="image/*" 
            id="product-image" 
            className="hidden"
            onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
          />
          <label 
            htmlFor="product-image"
            className={`w-full flex items-center justify-center p-4 rounded-xl border-2 border-dashed cursor-pointer transition-all ${
              file ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-zinc-200 text-zinc-500 hover:border-emerald-500'
            }`}
          >
            {file ? `შერჩეულია: ${file.name}` : "📸 აირჩიე პროდუქტის ფოტო"}
          </label>
        </div>

        <select 
          className="w-full p-3 text-[#3b3b3b] rounded-xl border border-zinc-200 outline-none focus:ring-2 focus:ring-emerald-500"
          onChange={(e) => setFormData({...formData, category_id: e.target.value})}
          value={formData.category_id}
          required
        >
          <option value="">აირჩიე კატეგორია</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>

        <input 
          type="text" 
          placeholder="პროდუქტის სახელი"
          className="w-full p-3 text-[#3b3b3b] rounded-xl border border-zinc-200 outline-none focus:ring-2 focus:ring-emerald-500"
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          value={formData.name}
          required
        />

        <input 
          type="number" 
          step="0.01"
          placeholder="ფასი"
          className="w-full p-3 text-[#3b3b3b] rounded-xl border border-zinc-200 outline-none focus:ring-2 focus:ring-emerald-500"
          onChange={(e) => setFormData({...formData, price: e.target.value})}
          value={formData.price}
          required
        />

        <textarea 
          placeholder="აღწერა"
          className="w-full p-3 text-[#3b3b3b] rounded-xl border border-zinc-200 h-24 outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          value={formData.description}
        />

        <button 
          disabled={loading}
          type="submit" 
          className="w-full py-4 bg-zinc-900 text-white font-bold rounded-xl hover:bg-emerald-600 transition-all shadow-lg disabled:opacity-50"
        >
          {loading ? "მიმდინარეობს ატვირთვა..." : "პროდუქტის შენახვა"}
        </button>
      </div>
    </form>
  );
}