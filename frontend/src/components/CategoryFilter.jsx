import React from 'react';
import { SlidersHorizontal, ArrowUpDown } from 'lucide-react';

const OCCASIONS = [
  { id: 'all', label: 'All Bouquets', emoji: '🌸' },
  { id: 'Romance', label: 'Romance & Love', emoji: '🌹' },
  { id: 'Birthday', label: 'Birthday Special', emoji: '🎂' },
  { id: 'Anniversary', label: 'Anniversary', emoji: '💍' },
  { id: 'Congratulations', label: 'Celebration', emoji: '🎉' },
  { id: 'Wedding', label: 'Wedding & Bridal', emoji: '👰' },
  { id: 'Sympathy', label: 'Peace & Sympathy', emoji: '🕊️' }
];

export default function CategoryFilter({
  selectedOccasion,
  setSelectedOccasion,
  selectedSort,
  setSelectedSort,
  totalCount
}) {
  return (
    <div className="py-6 border-b border-rose-100 bg-white/70 backdrop-blur-sm sticky top-20 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Occasion Pills */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none no-scrollbar">
            {OCCASIONS.map((occ) => {
              const isActive = selectedOccasion === occ.id;
              return (
                <button
                  key={occ.id}
                  onClick={() => setSelectedOccasion(occ.id)}
                  className={`flex items-center gap-1.5 whitespace-nowrap px-4 py-2 rounded-full text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-rose-600 text-white shadow-md shadow-rose-200 scale-105'
                      : 'bg-rose-50/80 text-gray-700 hover:bg-rose-100 hover:text-rose-800'
                  }`}
                >
                  <span>{occ.emoji}</span>
                  <span>{occ.label}</span>
                </button>
              );
            })}
          </div>

          {/* Sort & Count */}
          <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-4 text-xs text-gray-500">
            <span className="font-medium text-gray-600">
              Showing <span className="text-rose-700 font-bold">{totalCount}</span> bouquets
            </span>

            <div className="flex items-center gap-1.5 bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-200">
              <ArrowUpDown size={14} className="text-rose-500" />
              <select
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value)}
                className="bg-transparent text-gray-700 font-medium focus:outline-none cursor-pointer text-xs"
              >
                <option value="featured">Featured / Bestsellers</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Customer Rating (High to Low)</option>
              </select>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
