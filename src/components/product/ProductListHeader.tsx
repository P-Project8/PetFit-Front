import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { SortOption } from '../../hooks/useProductSort';

interface ProductListHeaderProps {
  itemCount: number;
  sortBy: SortOption;
  sortOptions: SortOption[];
  onSortChange: (option: SortOption) => void;
}

export default function ProductListHeader({
  itemCount,
  sortBy,
  sortOptions,
  onSortChange,
}: ProductListHeaderProps) {
  const [isOpen, setIsOpen] = useState(false);

  function handleSortSelect(option: SortOption) {
    onSortChange(option);
    setIsOpen(false);
  }

  return (
    <div className="font-['Balsamiq'] w-full text-[#14314F] px-6 flex justify-between pt-4 items-center">
      <p className="text-sm">{itemCount} items</p>
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-0.5 text-xs font-medium text-gray-500 hover:opacity-70 transition-opacity cursor-pointer"
        >
          {sortBy}
          <ChevronDown
            className={`w-3 h-3 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {/* 드롭다운 메뉴 */}
        {isOpen && (
          <div className="absolute right-0 top-full mt-2 w-32 bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden py-1 z-50">
            {sortOptions.map((option) => (
              <button
                key={option}
                onClick={() => handleSortSelect(option)}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors cursor-pointer ${
                  sortBy === option
                    ? 'text-[#14314F] font-bold'
                    : 'text-gray-400'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
