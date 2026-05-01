import Link from 'next/link';

const contactItems = [
  {
    label: 'მისამართი',
    value: 'თბილისი, საქართველო',
    href: 'https://maps.google.com/?q=Tbilisi,%20Georgia',
  },
  {
    label: 'ტელეფონი',
    value: '+995 555 00 00 00',
    href: 'tel:+995555000000',
  },
  {
    label: 'ელფოსტა',
    value: 'info@restaurant.ge',
    href: 'mailto:info@restaurant.ge',
  },
];

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white pt-20">
      <section className="bg-zinc-900 px-4 py-20 text-center">
        <div className="mx-auto max-w-3xl">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-emerald-400">
            დაგვიკავშირდი
          </p>
          <h1 className="text-4xl font-black uppercase italic tracking-tight text-white md:text-6xl">
            კონტაქტი
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-zinc-300 md:text-lg">
            დაგვირეკე, მოგვწერე ან გვეწვიე. შეკვეთებზე, დაჯავშნაზე და მენიუს დეტალებზე სწრაფად გიპასუხებთ.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-16 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-8">
          <div>
            <h2 className="text-3xl font-black uppercase italic tracking-tight text-zinc-900">
              ინფორმაცია
            </h2>
            <p className="mt-3 text-sm leading-7 text-zinc-500">
              სამუშაო საათებში დაგვიკავშირდი ნებისმიერი კითხვისთვის. თუ კონკრეტული პროდუქტი გაინტერესებს, შეგიძლია მენიუდან პირდაპირ მის გვერდზე გადახვიდე.
            </p>
          </div>

          <div className="grid gap-4">
            {contactItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="rounded-lg border border-zinc-100 bg-zinc-50 p-5 transition hover:border-emerald-200 hover:bg-emerald-50"
                target={item.href.startsWith('http') ? '_blank' : undefined}
              >
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-400">
                  {item.label}
                </span>
                <p className="mt-2 text-lg font-extrabold text-zinc-900">{item.value}</p>
              </Link>
            ))}
          </div>

          <div className="rounded-lg bg-zinc-900 p-6 text-white">
            <h3 className="text-xl font-black">სამუშაო საათები</h3>
            <div className="mt-5 space-y-3 text-sm text-zinc-300">
              <div className="flex justify-between gap-4">
                <span>ორშ - პარ</span>
                <span className="font-bold text-white">09:00 - 22:00</span>
              </div>
              <div className="flex justify-between gap-4">
                <span>შაბ - კვ</span>
                <span className="font-bold text-white">10:00 - 23:00</span>
              </div>
            </div>
          </div>
        </div>

        <form className="rounded-lg border border-zinc-100 bg-white p-6 shadow-xl shadow-zinc-100 md:p-8">
          <h2 className="text-2xl font-black uppercase italic tracking-tight text-zinc-900">
            მოგვწერე
          </h2>

          <div className="mt-8 grid gap-5">
            <label className="grid gap-2 text-sm font-bold text-zinc-700">
              სახელი
              <input
                type="text"
                name="name"
                className="h-12 rounded-lg border border-zinc-200 px-4 font-medium outline-none transition focus:border-emerald-500"
                placeholder="თქვენი სახელი"
              />
            </label>

            <label className="grid gap-2 text-sm font-bold text-zinc-700">
              ტელეფონი ან ელფოსტა
              <input
                type="text"
                name="contact"
                className="h-12 rounded-lg border border-zinc-200 px-4 font-medium outline-none transition focus:border-emerald-500"
                placeholder="+995..."
              />
            </label>

            <label className="grid gap-2 text-sm font-bold text-zinc-700">
              შეტყობინება
              <textarea
                name="message"
                rows={6}
                className="resize-none rounded-lg border border-zinc-200 px-4 py-3 font-medium outline-none transition focus:border-emerald-500"
                placeholder="რით შეგვიძლია დახმარება?"
              />
            </label>

            <button
              type="button"
              className="mt-2 h-12 rounded-lg bg-zinc-900 px-6 text-sm font-bold text-white transition hover:bg-emerald-600"
            >
              გაგზავნა
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
