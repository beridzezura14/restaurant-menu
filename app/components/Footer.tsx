"use client";

import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-zinc-100 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4 lg:gap-8">
          <div>
            <Link href="/" className="text-2xl font-black tracking-tighter text-zinc-900">
              LOGO<span className="text-emerald-600">.</span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-zinc-500">
              საუკეთესო გემო და ხარისხი თქვენს ქალაქში. ჩვენ ვქმნით მარტივ, სასიამოვნო და გემრიელ გამოცდილებას.
            </p>
          </div>

          <div>
            <h3 className="mb-6 font-bold text-zinc-900">ნავიგაცია</h3>
            <ul className="space-y-4 text-sm">
              <li>
                <Link href="/menu" className="text-zinc-500 transition hover:text-emerald-600">
                  მენიუ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-zinc-500 transition hover:text-emerald-600">
                  კონტაქტი
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-6 font-bold text-zinc-900">სამუშაო საათები</h3>
            <ul className="space-y-4 text-sm text-zinc-500">
              <li>ორშ - პარ: 09:00 - 22:00</li>
              <li>შაბ - კვ: 10:00 - 23:00</li>
            </ul>
          </div>

          <div>
            <h3 className="mb-6 font-bold text-zinc-900">კონტაქტი</h3>
            <ul className="space-y-4 text-sm text-zinc-500">
              <li>თბილისი, საქართველო</li>
              <li>
                <Link href="tel:+995555000000" className="transition hover:text-emerald-600">
                  +995 555 00 00 00
                </Link>
              </li>
              <li>
                <Link href="mailto:info@restaurant.ge" className="transition hover:text-emerald-600">
                  info@restaurant.ge
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-zinc-50 pt-8 md:flex-row">
          <p className="text-xs text-zinc-400">
            © {currentYear} LOGO. ყველა უფლება დაცულია.
          </p>
          <div className="flex gap-6 text-xs text-zinc-400">
            <Link href="/contact" className="transition hover:text-zinc-900">
              დახმარება
            </Link>
            <Link href="/contact" className="transition hover:text-zinc-900">
              კონფიდენციალურობა
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
