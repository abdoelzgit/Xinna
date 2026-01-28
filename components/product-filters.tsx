"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState, useTransition } from "react"
import { Search, X } from "lucide-react"
import { useDebounce } from "@/hooks/use-debounce"

interface ProductFiltersProps {
    categories: any[]
}

export function ProductFilters({ categories }: ProductFiltersProps) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [isPending, startTransition] = useTransition()

    // Local states
    const [searchValue, setSearchValue] = useState(searchParams.get("search") || "")
    const debouncedSearch = useDebounce(searchValue, 500)

    const currentCategory = searchParams.get("category") || "all"
    const currentSort = searchParams.get("sort") || "latest"

    // Sync search with URL
    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString())
        if (debouncedSearch) {
            params.set("search", debouncedSearch)
        } else {
            params.delete("search")
        }

        startTransition(() => {
            router.push(`/products?${params.toString()}`, { scroll: false })
        })
    }, [debouncedSearch])

    const updateFilter = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString())
        if (value === "all" || !value) {
            params.delete(key)
        } else {
            params.set(key, value)
        }
        router.push(`/products?${params.toString()}`, { scroll: false })
    }

    return (
        <aside className="w-full md:w-64 flex flex-col gap-8 shrink-0">
            {/* Search Input */}
            <div className="space-y-4">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Search</h3>
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground group-focus-within:text-foreground transition-colors" />
                    <input
                        type="text"
                        placeholder="Cari obat..."
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        className="w-full bg-muted/50 border-none rounded-xl pl-9 pr-4 py-3 text-xs font-medium focus:ring-2 focus:ring-primary/10 transition-all outline-none"
                    />
                    {searchValue && (
                        <button
                            onClick={() => setSearchValue("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-foreground transition-colors"
                        >
                            <X className="size-3" />
                        </button>
                    )}
                </div>
            </div>

            {/* Sorting */}
            <div className="space-y-6">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Sort by</h3>
                <ul className="flex flex-col gap-4">
                    <li>

                    </li>
                    <li>
                        <button
                            onClick={() => updateFilter("sort", "price_asc")}
                            className={`text-xs font-semibold pb-0.5 transition-all w-fit ${currentSort === "price_asc" ? "text-foreground border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"}`}
                        >
                            Price: Low -{">"} High
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={() => updateFilter("sort", "price_desc")}
                            className={`text-xs font-semibold pb-0.5 transition-all w-fit ${currentSort === "price_desc" ? "text-foreground border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"}`}
                        >
                            Price: High -{">"} Low
                        </button>
                    </li>
                </ul>
            </div>

            {/* Categories */}
            <div className="space-y-6 pt-8 border-t border-border">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Categories</h3>
                <ul className="flex flex-col gap-3">
                    <li>
                        <button
                            onClick={() => updateFilter("category", "all")}
                            className={`text-xs font-medium transition-colors ${currentCategory === "all" ? "text-foreground font-bold" : "text-muted-foreground hover:text-foreground"}`}
                        >
                            All Categories
                        </button>
                    </li>
                    {categories.map((cat) => (
                        <li key={cat.hashedId}>
                            <button
                                onClick={() => updateFilter("category", cat.hashedId)}
                                className={`text-xs font-medium transition-colors ${currentCategory === cat.hashedId ? "text-foreground font-bold underline underline-offset-4 decoration-primary" : "text-muted-foreground hover:text-foreground"}`}
                            >
                                {cat.jenis}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </aside>
    )
}
