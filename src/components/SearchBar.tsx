"use client";

import { useState } from "react";
import { Search, MapPin, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

const CATEGORIES = [
  { value: "all", label: "All Categories" },
  { value: "cars-motorcycles", label: "Cars & Motorcycles" },
  { value: "fashion", label: "Fashion" },
  { value: "real-estate", label: "Real Estate" },
  { value: "tech-electronics", label: "Tech & Electronics" },
  { value: "sports-leisure", label: "Sports & Leisure" },
  { value: "home-garden", label: "Home & Garden" },
  { value: "movies-books-music", label: "Movies, Books & Music" },
  { value: "baby-kids", label: "Baby & Kids" },
  { value: "collectibles-art", label: "Collectibles & Art" },
  { value: "diy", label: "DIY" },
  { value: "agriculture-industrial", label: "Agriculture & Industrial" },
  { value: "services", label: "Services" },
  { value: "others", label: "Others" },
];

interface SearchBarProps {
  onSearch?: (query: string, category: string, location: string) => void;
  compact?: boolean;
}

export default function SearchBar({ onSearch, compact = false }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [location, setLocation] = useState("");
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  const handleSearch = () => {
    console.log("Search triggered:", { query, category, location });
    onSearch?.(query, category, location);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <motion.div
      className={`relative w-full ${compact ? "max-w-2xl mx-0" : "max-w-4xl mx-auto"}`}
      initial={compact ? { opacity: 0 } : { opacity: 0, y: 20 }}
      animate={compact ? { opacity: 1 } : { opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Outer glow effect - Only in full mode */}
      {!compact && (
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-full blur-2xl opacity-20" />
      )}

      {/* Main search container */}
      <div className={`relative bg-white rounded-full flex items-center gap-2 transition-all duration-300 ${compact
          ? "shadow-md border border-gray-200 p-1 bg-gray-50/50"
          : "shadow-2xl shadow-primary/10 p-2"
        }`}>
        {/* Search Input */}
        <div className={`flex-1 flex items-center gap-2 ${compact ? "px-4 py-1" : "px-6 py-2"}`}>
          <Search className={`${compact ? "w-4 h-4" : "w-5 h-5"} text-text-main/40 flex-shrink-0`} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={compact ? "Search..." : "Search for anything..."}
            className="w-full text-base outline-none bg-transparent text-text-main placeholder:text-text-main/40 font-medium"
          />
        </div>

        {/* Divider - Hide in compact */}
        {!compact && <div className="h-8 w-px bg-gray-200" />}

        {/* Category Dropdown - Hide in compact */}
        {!compact && (
          <div className="relative">
            {/* ... keeping existing dropdown logic but simplified for brevity of replacement ... */}
            <button
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
              className="flex items-center gap-2 px-6 py-2 hover:bg-gray-50 rounded-full transition-colors duration-200 group"
            >
              <span className="text-sm font-medium text-text-main/70 group-hover:text-text-main whitespace-nowrap">
                {CATEGORIES.find((cat) => cat.value === category)?.label || "All Categories"}
              </span>
              <ChevronDown
                className={`w-4 h-4 text-text-main/40 transition-transform duration-200 ${isCategoryOpen ? "rotate-180" : ""
                  }`}
              />
            </button>
            {isCategoryOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-full right-0 mt-2 bg-white rounded-3xl shadow-xl border border-gray-100 py-2 z-50 min-w-[240px] max-h-96 overflow-y-auto"
              >
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => {
                      setCategory(cat.value);
                      setIsCategoryOpen(false);
                    }}
                    className={`w-full text-left px-6 py-3 hover:bg-primary/5 transition-colors duration-150 ${category === cat.value
                        ? "text-primary font-semibold bg-primary/5"
                        : "text-text-main/70"
                      }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </motion.div>
            )}
          </div>
        )}

        {/* Divider - Hide in compact */}
        {!compact && <div className="h-8 w-px bg-gray-200" />}

        {/* Location Input - Hide in compact */}
        {!compact && (
          <div className="hidden md:flex items-center gap-2 px-6 py-2 min-w-[160px]">
            <MapPin className="w-4 h-4 text-text-main/40 flex-shrink-0" />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Location..."
              className="w-full text-sm outline-none bg-transparent text-text-main placeholder:text-text-main/40"
            />
          </div>
        )}

        {/* Search Button */}
        <motion.button
          onClick={handleSearch}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`flex-shrink-0 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-shadow duration-200 ${compact
              ? "w-8 h-8 bg-primary"
              : "w-14 h-14 bg-gradient-to-r from-primary to-accent"
            }`}
        >
          <Search className={compact ? "w-4 h-4" : "w-6 h-6"} />
        </motion.button>
      </div>

      {/* Click outside to close dropdown */}
      {!compact && isCategoryOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsCategoryOpen(false)}
        />
      )}
    </motion.div>
  );
}
