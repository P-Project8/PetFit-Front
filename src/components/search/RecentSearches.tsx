import { X } from 'lucide-react';

interface RecentSearchesProps {
  searches: string[];
  onSearchClick: (term: string) => void;
  onRemove: (term: string) => void;
  onClearAll: () => void;
}

export default function RecentSearches({
  searches,
  onSearchClick,
  onRemove,
  onClearAll,
}: RecentSearchesProps) {
  if (searches.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-gray-900">최근 검색어</h3>
        </div>
        <button
          onClick={onClearAll}
          className="text-xs text-gray-400 hover:text-gray-600"
        >
          전체 삭제
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {searches.map((term, index) => (
          <button
            key={index}
            onClick={() => onSearchClick(term)}
            className="group flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition-colors"
          >
            <span>{term}</span>
            <X
              className="w-3 h-3 text-gray-400 hover:text-gray-600"
              onClick={(e) => {
                e.stopPropagation();
                onRemove(term);
              }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
