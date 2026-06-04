"use client";

import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Search } from "lucide-react"; 

type SearchbarProps = {
  className?: string;
  placeholder?: string;
};

const Searchbar = ({ className, placeholder = "Search Product..." }: SearchbarProps) => {
  const router = useRouter();
  const [query, setQuery] = useState(() => {
    if (typeof window !== "undefined") {
      return new URLSearchParams(window.location.search).get("q") || "";
    }
    return "";
  });

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); 
    
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <form
      onSubmit={handleSearch}
      className={cn(
        "group flex h-12 w-full items-center gap-3 rounded-xl border border-black/10 bg-white px-4 shadow-sm transition-all duration-200 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20",
        className
      )}
    >
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="w-full bg-transparent border-none outline-none text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-0"
      />

      <button 
        type="submit" 
        className="relative flex h-8 w-8 items-center justify-center shrink-0 rounded-full transition-colors hover:bg-gray-100"
        aria-label="Submit search"
      >
        <Search className="h-5 w-5 text-gray-400 transition-colors group-focus-within:text-primary" />

      </button>
    </form>
  );
};

export default Searchbar;