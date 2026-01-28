import { getFilteredProducts, getCategories } from "@/lib/actions/product-actions"
import { ProductCard } from "@/components/product-card"
import { ProductFilters } from "@/components/product-filters"
import { Suspense } from "react"

export default async function ProductsPage({
    searchParams: searchParamsPromise,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const searchParams = await searchParamsPromise
    const filters = {
        search: (searchParams.search as string) || "",
        category: (searchParams.category as string) || "",
        sort: (searchParams.sort as any) || "latest",
    }

    const [products, categories] = await Promise.all([
        getFilteredProducts(filters),
        getCategories(),
    ])

    return (
        <div className="min-h-screen bg-white">
            <div className="container mx-auto px-4 py-8 md:py-16 flex flex-col md:flex-row gap-12">
                {/* Left Sidebar - Filters */}
                <Suspense fallback={<div className="w-64 animate-pulse bg-slate-50 rounded-2xl h-96" />}>
                    <ProductFilters categories={categories} />
                </Suspense>

                {/* Main Content Area */}
                <main className="flex-1 space-y-10">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-4xl font-bold tracking-tight text-primary italic underline decoration-primary/10 underline-offset-8">All products</h1>
                        {filters.search && (
                            <p className="text-sm text-slate-400 font-medium tracking-tight">
                                Menampilkan hasil pencarian untuk "{filters.search}" ({products.length} produk)
                            </p>
                        )}
                    </div>

                    {products.length === 0 ? (
                        <div className="py-32 flex flex-col items-center justify-center gap-4 text-slate-300">
                            <span className="text-4xl italic font-black opacity-20 uppercase tracking-tighter">No Results Found</span>
                            <p className="text-sm font-medium italic opacity-50">Coba gunakan kata kunci atau filter lain.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
                            {products.map((item: any) => (
                                <ProductCard key={item.id} product={item} />
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    )
}
