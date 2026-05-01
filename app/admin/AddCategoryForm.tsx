"use client";
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function AddCategoryForm({ onCategoryAdded }: { onCategoryAdded: () => void }) {
  const [name, setName] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let imageUrl = '';

    // 1. ფოტოს ატვირთვა Storage-ში
    if (file) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `category-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('images') // დარწმუნდი რომ 'images' ბაკეტი შექმნილი გაქვს
        .upload(filePath, file);

      if (uploadError) {
        console.error('Error uploading image:', uploadError);
      } else {
        const { data } = supabase.storage.from('images').getPublicUrl(filePath);
        imageUrl = data.publicUrl;
      }
    }

    // 2. კატეგორიის შენახვა ბაზაში
    const { error } = await supabase
      .from('categories')
      .insert([{ name, image_url: imageUrl }]);

    if (!error) {
      setName('');
      setFile(null);
      onCategoryAdded();
      alert("კატეგორია ფოტოსთან ერთად დაემატა!");
    } else {
      alert("შეცდომა კატეგორიის დამატებისას");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-zinc-100 mb-8">
      <h3 className="text-lg font-bold mb-4 text-zinc-900">კატეგორიის დამატება</h3>
      <div className="flex flex-col gap-4">
        <div className="flex gap-3">
          <input 
            type="text" 
            placeholder="კატეგორიის სახელი"
            className="flex-1 p-3 text-[#3b3b3b] rounded-xl border border-zinc-200 outline-none focus:ring-2 focus:ring-emerald-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          
          {/* ფაილის ასარჩევი ინპუტი */}
          <div className="relative">
            <input 
              type="file" 
              accept="image/*"
              className="hidden" 
              id="category-image"
              onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
            />
            <label 
              htmlFor="category-image" 
              className={`flex items-center justify-center px-6 py-3 rounded-xl border border-dashed cursor-pointer transition ${
                file ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-zinc-300 text-zinc-500 hover:border-zinc-400'
              }`}
            >
              {file ? "ფოტო არჩეულია" : "ფოტოს არჩევა"}
            </label>
          </div>

          <button 
            disabled={loading}
            className="bg-zinc-900 text-white px-8 py-3 rounded-xl font-medium hover:bg-zinc-800 transition disabled:opacity-50"
          >
            {loading ? "ემატება..." : "დამატება"}
          </button>
        </div>
        
        {/* შერჩეული ფაილის სახელი */}
        {file && <p className="text-xs text-zinc-400 ml-1">შერჩეულია: {file.name}</p>}
      </div>
    </form>
  );
}