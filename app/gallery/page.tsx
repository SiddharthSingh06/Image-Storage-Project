"use client";

import { useState, useMemo, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { useImages } from "@/hooks/useImages";
import { ImageGrid } from "@/components/ImageGrid";
import { Navbar } from "@/components/Navbar";
import { Input } from "@/components/ui/Input";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";

type FilterType = "all" | "shared";
type SortType = "newest" | "oldest" | "largest";

export default function GalleryPage() {
  const { user, loading: authLoading } = useAuth();
  const { images, loading: imagesLoading, removeImage, toggleShare } = useImages();
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [sort, setSort] = useState<SortType>("newest");

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  const filteredAndSortedImages = useMemo(() => {
    let result = [...images];

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(img => img.filename.toLowerCase().includes(q));
    }

    // Filter
    if (filter === "shared") {
      result = result.filter(img => img.isShared);
    }

    // Sort
    result.sort((a, b) => {
      if (sort === "newest") return b.uploadedAt - a.uploadedAt;
      if (sort === "oldest") return a.uploadedAt - b.uploadedAt;
      if (sort === "largest") return b.size - a.size;
      return 0;
    });

    return result;
  }, [images, search, filter, sort]);

  if (authLoading || (!user && !authLoading)) {
    return <div className="min-h-screen flex items-center justify-center bg-background"><p className="font-mono font-bold text-xl animate-pulse">Loading Gallery...</p></div>;
  }

  return (
    <>
      <Navbar />
      <main className="flex-grow w-full max-w-7xl mx-auto px-6 py-12 page-enter page-enter-active">
        <h1 className="text-4xl sm:text-5xl font-sans font-bold uppercase tracking-tight mb-8">Gallery</h1>

        <div className="flex flex-col md:flex-row gap-6 mb-8 items-start md:items-center justify-between border-b-4 border-dark pb-6">
          <div className="relative w-full max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={20} className="text-muted" />
            </div>
            <Input 
              type="text"
              placeholder="Search by filename..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-10 font-mono"
            />
          </div>

          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex bg-card vaultrix-border p-1 gap-1">
              {["all", "shared"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f as FilterType)}
                  className={`px-4 py-2 font-mono font-bold uppercase text-sm transition-colors ${filter === f ? "bg-primary text-white" : "hover:bg-muted/10 text-dark"}`}
                >
                  {f}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 font-mono font-bold uppercase text-sm">
              <span>Sort:</span>
              <select 
                value={sort} 
                onChange={(e) => setSort(e.target.value as SortType)}
                className="vaultrix-border bg-card px-4 py-2.5 outline-none cursor-pointer hover:border-primary focus:border-primary appearance-none"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="largest">Largest First</option>
              </select>
            </div>
          </div>
        </div>

        {imagesLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-muted/20 animate-pulse vaultrix-border"></div>
            ))}
          </div>
        ) : (
          <ImageGrid images={filteredAndSortedImages} onDelete={removeImage} onToggleShare={toggleShare} />
        )}
      </main>
    </>
  );
}
