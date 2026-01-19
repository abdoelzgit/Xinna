import Link from "next/link";
import Image from "next/image";
import { Pill as PillIcon, Star, ShoppingCart } from "lucide-react";
import { getProducts } from "@/lib/actions/product-actions";

export default async function Home() {
  const medicines = await getProducts();
  const displayedMedicines = medicines.slice(0, 8);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-primary selection:text-white">
      {/* Hero Section */}
      <section className="relative h-[65vh] flex items-center justify-center overflow-hidden border-b border-slate-100">
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-50 via-white to-primary/5 z-0" />
        <div className="container relative z-10 px-4 text-center space-y-8">
          <div className="inline-flex items-center gap-2 bg-slate-100 px-4 py-1.5 rounded-full mb-4 animate-in fade-in slide-in-from-top-4 duration-1000">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Trusted Healthcare Provider</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.9] text-slate-950 animate-in fade-in slide-in-from-bottom-8 duration-700">
            Xinna <span className="text-primary italic">Apotek</span>
          </h1>
          <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto font-medium tracking-tight leading-relaxed animate-in fade-in slide-in-from-bottom-10 duration-1000">
            Solusi Kesehatan Modern & Terpercaya. Menyediakan Obat-obatan Berkualitas untuk Keluarga Anda dengan layanan prima.
          </p>
          <div className="pt-4 animate-in fade-in zoom-in duration-1000 delay-300">
            <Link href="/products" className="bg-slate-950 text-white px-10 py-4 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-primary transition-all shadow-xl hover:shadow-primary/20 transform hover:-translate-y-1">
              Shop Collection
            </Link>
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <main className="container px-4 md:px-8 py-24 mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <div className="space-y-2">
            <h2 className="text-3xl font-black uppercase tracking-tighter">Featured Products</h2>
            <p className="text-slate-400 text-sm font-medium">Koleksi obat-obatan terbaik pilihan kami.</p>
          </div>
          <Link href="/products" className="text-xs font-bold uppercase tracking-widest hover:text-primary transition-colors border-b-2 border-slate-950 hover:border-primary pb-1 w-fit">
            View All Products
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-20">
          {displayedMedicines.length === 0 ? (
            <div className="col-span-full h-40 flex items-center justify-center text-slate-300 italic">
              Belum ada produk yang tersedia.
            </div>
          ) : (
            displayedMedicines.map((item: any) => (
              <div
                key={item.id}
                className="group flex flex-col space-y-6 relative"
              >
                {/* Product Image Area */}
                <Link
                  href={`/medicine/${item.id}`}
                  className="aspect-[4/5] bg-slate-50 border border-slate-100 overflow-hidden relative transition-all duration-700 group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-[2rem]"
                >
                  {item.foto1 ? (
                    <Image
                      src={item.foto1}
                      alt={item.nama_obat}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-100 to-white">
                      <PillIcon className="h-24 w-24 text-slate-200" />
                    </div>
                  )}

                  {item.stok <= 5 && (
                    <div className="absolute top-6 left-6 z-10">
                      <div className="bg-white/90 backdrop-blur-md text-red-600 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-sm border border-red-100">
                        Low Stock
                      </div>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center p-6">
                    <button className="bg-white text-slate-950 size-14 rounded-full flex items-center justify-center shadow-2xl transform scale-50 group-hover:scale-100 transition-transform duration-500 hover:bg-primary hover:text-white">
                      <ShoppingCart className="size-6" />
                    </button>
                  </div>
                </Link>

                {/* Product Info */}
                <div className="flex flex-col space-y-3 px-2">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                      {item.jenis_obat?.jenis || "Umum"}
                    </span>
                    <div className="h-[1px] flex-1 bg-slate-100" />
                  </div>

                  <div className="flex flex-col space-y-1">
                    <h3 className="text-xl font-bold tracking-tight leading-tight hover:text-primary transition-colors cursor-pointer">
                      <Link href={`/medicine/${item.id}`}>{item.nama_obat}</Link>
                    </h3>
                    <div className="flex items-center gap-1.5 mt-1">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} className="size-2.5 text-yellow-400 fill-yellow-400" />
                        ))}
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Reviewed</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <p className="text-2xl font-black text-slate-950 tracking-tighter">
                      Rp {new Intl.NumberFormat('id-ID').format(item.harga_jual)}
                    </p>
                    <button className="text-slate-400 hover:text-primary transition-colors uppercase text-[10px] font-black tracking-widest border-b border-transparent hover:border-primary">
                      Details
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* Newsletter */}
      <section className="container mx-auto px-4 py-32">
        <div className="bg-slate-50 p-12 md:p-24 rounded-[4rem] border border-slate-100 text-center space-y-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 size-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          <div className="absolute bottom-0 left-0 size-64 bg-blue-500/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />

          <div className="relative z-10 space-y-4">
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-slate-950">Join The <span className="text-primary italic">Health</span> Club</h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto font-medium">Subscribe untuk mendapatkan info stok terbaru dan promo kesehatan eksklusif.</p>
          </div>

          <div className="relative z-10 flex flex-col md:flex-row gap-4 max-w-lg mx-auto pt-6">
            <div className="flex-1 relative">
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-5 outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-medium"
              />
            </div>
            <button className="bg-slate-950 text-white px-10 py-5 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-primary transition-all shadow-xl hover:shadow-primary/20">
              Join Now
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
