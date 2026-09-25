import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col w-full">

      {/* --- 1. HERO SECTION --- */}
      <section
        className="flex flex-col items-center justify-center min-h-[calc(100vh-6rem)] px-4 sm:px-6 lg:px-8 pb-10"
        style={{
          background: 'linear-gradient(135deg, #3E200B 0%, #2a1508 30%, #1A0F0A 65%, #0e0804 100%)',
        }}
      >
        <div className="w-full max-w-7xl flex flex-col-reverse lg:flex-row items-center gap-12 mt-10">

          {/* Left Side: Text aur Buttons */}
          <div className="w-full lg:w-1/2 flex flex-col gap-6 text-center lg:text-left">
            <h1 className="text-5xl md:text-7xl font-extrabold text-[#EEEBD3] tracking-tight leading-tight">
              Premium Coffee, <br />
              <span className="text-[#B68D40]">Brewed For You.</span>
            </h1>
            <p className="text-lg md:text-xl text-[#EEEBD3] font-medium max-w-lg mx-auto lg:mx-0">
              Pre-order your favorite artisan coffee, skip the line, and earn loyalty points with every single sip.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mt-6">
              <Link href="/outlets" className="px-8 py-4 bg-[#B68D40] text-[#1A0F0A] font-bold text-lg rounded-full hover:bg-[#EEEBD3] hover:-translate-y-1 transition-all shadow-xl text-center">
                Order Now
              </Link>
              <Link href="/rewards" className="px-8 py-4 bg-transparent border-2 border-[#EEEBD3] text-[#EEEBD3] font-bold text-lg rounded-full hover:bg-[#EEEBD3] hover:text-[#1A0F0A] hover:-translate-y-1 transition-all text-center">
                Loyalty Rewards
              </Link>
            </div>
          </div>

          {/* Right Side: Hero Image */}
          <div className="w-full lg:w-1/2">
            <img
              src="/hero.png"
              alt="Delicious Premium Coffee"
              className="w-full h-auto max-h-[70vh] rounded-[2.5rem] shadow-2xl shadow-black/50 object-cover transform hover:scale-[1.03] transition-transform duration-500 border-2 border-[#D4AF37]/30"
            />
          </div>

        </div>
      </section>

      {/* --- 2. BESTSELLER #1 — Caramel Macchiato (Image Left, Text Right) --- */}
      <section className="w-full py-16 bg-[#1A0F0A] border-t border-[#B68D40]/15">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-16">

          {/* Image Left */}
          <div className="w-full lg:w-2/5">
            <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-2 border-[#B68D40]/25 group">
              <img
                src="/caramel_macchiato.png"
                alt="Caramel Macchiato"
                className="w-full h-[400px] object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A0F0A] via-transparent to-transparent opacity-50"></div>
            </div>
          </div>

          {/* Text Right */}
          <div className="w-full lg:w-3/5 flex flex-col gap-5 text-center lg:text-left">
            <div className="flex items-center gap-3 justify-center lg:justify-start">
              <span className="px-3 py-1 bg-[#B68D40] text-[#1A0F0A] text-xs font-black rounded-full uppercase tracking-widest">⭐ #1 Bestseller</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-[#EEEBD3] leading-tight">
              Signature Caramel Macchiato
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed">
              The crown jewel of our menu. Freshly steamed milk, rich vanilla syrup, our signature double-shot espresso — all finished with a golden caramel drizzle. One sip and you'll understand why it never leaves our top spot.
            </p>
            <ul className="text-gray-400 space-y-2 mt-2">
              <li className="flex items-center gap-2 justify-center lg:justify-start"><span className="text-[#B68D40]">✦</span> Rich in antioxidants, improves focus instantly.</li>
              <li className="flex items-center gap-2 justify-center lg:justify-start"><span className="text-[#B68D40]">✦</span> Available in Tall & Grande for the perfect pour.</li>
              <li className="flex items-center gap-2 justify-center lg:justify-start"><span className="text-[#B68D40]">✦</span> Hot or Iced — your call, our craft.</li>
            </ul>

          </div>

        </div>
      </section>

      {/* --- 3. SUMMER FAVOURITE — Iced Hazelnut Latte (Text Left, Image Right) --- */}
      <section className="w-full py-16 bg-[#150d08] border-t border-[#B68D40]/15">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col-reverse lg:flex-row items-center gap-16">

          {/* Text Left */}
          <div className="w-full lg:w-3/5 flex flex-col gap-5 text-center lg:text-left">
            <div className="flex items-center gap-3 justify-center lg:justify-start">
              <span className="px-3 py-1 bg-transparent border border-[#B68D40] text-[#B68D40] text-xs font-black rounded-full uppercase tracking-widest">❄️ Summer Favourite</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-[#EEEBD3] leading-tight">
              Iced Hazelnut Latte
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed">
              Bold espresso meets sweet hazelnut over a mountain of ice. Slow-cold-steeped for 12 hours so every drop is silky smooth with zero bitterness — the drink that keeps you coming back all summer long.
            </p>
            <ul className="text-gray-400 space-y-2 mt-2">
              <li className="flex items-center gap-2 justify-center lg:justify-start"><span className="text-[#B68D40]">✦</span> 12-hour cold steep for zero bitterness.</li>
              <li className="flex items-center gap-2 justify-center lg:justify-start"><span className="text-[#B68D40]">✦</span> Premium ethically sourced Hazelnut extract.</li>
              <li className="flex items-center gap-2 justify-center lg:justify-start"><span className="text-[#B68D40]">✦</span> Low acidity — easy on the stomach, big on taste.</li>
            </ul>

          </div>

          {/* Image Right */}
          <div className="w-full lg:w-2/5">
            <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-2 border-[#B68D40]/25 group">
              <img
                src="/iced_hazelnut_latte.png"
                alt="Iced Hazelnut Latte"
                className="w-full h-[400px] object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A0F0A] via-transparent to-transparent opacity-50"></div>
            </div>
          </div>

        </div>
      </section>

      {/* --- 4. PURIST'S PICK — Espresso Shot (Image Left, Text Right) --- */}
      <section className="w-full py-16 bg-[#1A0F0A] border-t border-[#B68D40]/15">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-16">

          {/* Image Left */}
          <div className="w-full lg:w-2/5">
            <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-2 border-[#B68D40]/25 group">
              <img
                src="/espresso_shot.png"
                alt="Espresso Shot"
                className="w-full h-[400px] object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A0F0A] via-transparent to-transparent opacity-50"></div>
            </div>
          </div>

          {/* Text Right */}
          <div className="w-full lg:w-3/5 flex flex-col gap-5 text-center lg:text-left">
            <div className="flex items-center gap-3 justify-center lg:justify-start">
              <span className="px-3 py-1 bg-transparent border border-[#B68D40] text-[#B68D40] text-xs font-black rounded-full uppercase tracking-widest">☕ The Classic</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-[#EEEBD3] leading-tight">
              Slickbucks Espresso Shot
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed">
              Pure, unadulterated espresso. A concentrated double-shot of our finest single-origin beans, pulled to perfection — with a thick, golden crema that only a master roast can produce.
            </p>
            <ul className="text-gray-400 space-y-2 mt-2">
              <li className="flex items-center gap-2 justify-center lg:justify-start"><span className="text-[#B68D40]">✦</span> Instant, clean energy — no sugar crash.</li>
              <li className="flex items-center gap-2 justify-center lg:justify-start"><span className="text-[#B68D40]">✦</span> Single-origin, ethically sourced beans.</li>
              <li className="flex items-center gap-2 justify-center lg:justify-start"><span className="text-[#B68D40]">✦</span> The base of every great drink we make.</li>
            </ul>

          </div>

        </div>
      </section>

      {/* --- 5. CROWD PLEASER — Mocha Frappuccino (Text Left, Image Right) --- */}
      <section className="w-full py-16 bg-[#150d08] border-t border-[#B68D40]/15">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col-reverse lg:flex-row items-center gap-16">

          {/* Text Left */}
          <div className="w-full lg:w-3/5 flex flex-col gap-5 text-center lg:text-left">
            <div className="flex items-center gap-3 justify-center lg:justify-start">
              <span className="px-3 py-1 bg-transparent border border-[#B68D40] text-[#B68D40] text-xs font-black rounded-full uppercase tracking-widest">🥤 Crowd Pleaser</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-[#EEEBD3] leading-tight">
              Mocha Frappuccino
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed">
              Blended ice, rich dark chocolate, and a bold double-shot of espresso — our most indulgent creation. Finished with whipped cream and a chocolate drizzle. A dessert in a cup.
            </p>
            <ul className="text-gray-400 space-y-2 mt-2">
              <li className="flex items-center gap-2 justify-center lg:justify-start"><span className="text-[#B68D40]">✦</span> Rich dark Belgian chocolate blend.</li>
              <li className="flex items-center gap-2 justify-center lg:justify-start"><span className="text-[#B68D40]">✦</span> Perfectly blended — never icy, always smooth.</li>
              <li className="flex items-center gap-2 justify-center lg:justify-start"><span className="text-[#B68D40]">✦</span> Topped with fresh whipped cream.</li>
            </ul>

          </div>

          {/* Image Right */}
          <div className="w-full lg:w-2/5">
            <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-2 border-[#B68D40]/25 group">
              <img
                src="/mocha_frappuccino.png"
                alt="Mocha Frappuccino"
                className="w-full h-[400px] object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A0F0A] via-transparent to-transparent opacity-50"></div>
            </div>
          </div>

        </div>
      </section>

      {/* --- 6. FOOTER --- */}
      <footer className="bg-[#1A0F0A] py-14 border-t border-[#B68D40]/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col items-center justify-center">
          <div className="flex items-center gap-3 mb-6 opacity-60 hover:opacity-100 transition-all">
            <img src="/logo.png" alt="Slickbucks Logo" className="h-10 w-auto mix-blend-screen" />
            <span className="text-2xl font-black text-[#B68D40] uppercase tracking-widest">Slickbucks</span>
          </div>
          <p className="text-gray-500 font-medium text-center max-w-md mb-8">
            Elevating your daily ritual with ethically sourced beans, unparalleled craftsmanship, and a touch of modern convenience.
          </p>
          <div className="flex gap-8 text-sm font-bold text-gray-400">
            <Link href="#" className="hover:text-[#B68D40] transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-[#B68D40] transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-[#B68D40] transition-colors">Contact Us</Link>
          </div>
          <p className="mt-10 text-sm text-gray-600 font-semibold tracking-wide">© 2026 Slickbucks Coffee. Brewed with ❤️ in India.</p>
        </div>
      </footer>

    </div>
  );
}
