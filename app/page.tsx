import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Heart, Pill as PillIcon } from "lucide-react";

async function getMedicines() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/medicines`, {
    cache: 'no-store' // Ensure fresh data
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error(`API Error (${res.status}):`, errorText);
    throw new Error(`Failed to fetch data: ${res.status}`);
  }

  return res.json();
}

export default async function Home() {
  let medicines = [];
  try {
    medicines = await getMedicines();
  } catch (error) {
    console.error("Fetch error:", error);
  }

  const displayedMedicines = medicines.slice(0, 8);

  return (
    <div className=" min-h-screen text-white font-sans selection:bg-white selection:text-black">
      <main className="container px-4 md:px-8 py-12 mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
          {displayedMedicines.map((item: any) => (
            <Link
              key={item.id}
              href={`/medicine/${item.id}`}
              className="group flex flex-col space-y-4"
            >
              {/* Product Image Area */}
              <div className="aspect-[3/4] bg-[#0a0a0a] border border-white/5 overflow-hidden relative transition-colors group-hover:bg-[#111]">
                <div className="absolute inset-0 flex items-center justify-center opacity-10">
                  <PillIcon className="h-20 w-20 text-white" />
                </div>
                {item.stok <= 5 && (
                  <div className="absolute top-4 left-4">
                    <span className="bg-white text-black text-[10px] font-bold uppercase tracking-widest px-2 py-0.5">
                      Low Stock
                    </span>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="flex flex-col space-y-1">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-[13px] font-bold uppercase tracking-[0.05em] leading-snug group-hover:underline underline-offset-4 decoration-1">
                    {item.nama_obat}
                  </h3>
                  <button className="text-white/60 hover:text-white transition-colors">
                    <Heart className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-[13px] text-white/50 tracking-wider">
                  Rp {parseInt(item.harga_jual).toLocaleString('id-ID')}
                </p>
              </div>
            </Link>
          ))
          }
        </div>
      </main>
    </div>
  );
}
