// components/SearchBar.jsx

"use client";

import { useState } from "react";
import { Search } from "lucide-react";

export default function SearchBar({ onSearch }) {
  const [inputVal, setInputVal] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(inputVal);
    }
  };

  return (
    <section className="bg-[#f5f7fb] px-4 pt-8 pb-4 md:px-8">
      <div className="mx-auto max-w-7xl">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Search Doctor name, specialty or hospital..."
              className="h-14 w-full rounded-2xl border border-gray-200 bg-white pl-12 pr-4 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 shadow-sm"
            />
          </div>

          {/* Search Button */}
          <button
            type="submit"
            className="h-14 rounded-2xl bg-blue-600 px-8 text-sm font-semibold text-white hover:bg-blue-700 active:scale-95 transition shadow-sm hover:shadow cursor-pointer flex items-center justify-center gap-2 shrink-0"
          >
            <Search size={16} />
            Search
          </button>
        </form>
      </div>
    </section>
  );
}
