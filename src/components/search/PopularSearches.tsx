interface PopularSearchesProps {
  searches: string[];
  onSearchClick: (term: string) => void;
}

export default function PopularSearches({
  searches,
  onSearchClick,
}: PopularSearchesProps) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <h3 className="text-sm font-semibold text-gray-900">인기 검색어</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {searches.map((term, index) => (
          <button
            key={index}
            onClick={() => onSearchClick(term)}
            className="px-3 py-2 bg-[#14314F]/5 hover:bg-[#14314F]/10 rounded-full text-sm text-[#14314F] font-medium transition-colors"
          >
            <span className="text-[#14314F] font-bold mr-1">{index + 1}</span>
            {term}
          </button>
        ))}
      </div>
    </div>
  );
}
