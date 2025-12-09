import { Search } from 'lucide-react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export default function SearchInput({
  value,
  onChange,
  onKeyDown,
}: SearchInputProps) {
  return (
    <div className="w-full px-6 mt-4 relative">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        className="bg-gray-100 w-full h-10 rounded-2xl placeholder-gray-400 placeholder:text-sm text-black text-base px-4 focus:outline-none"
        placeholder="검색어를 입력해주세요."
        style={{ WebkitTextSizeAdjust: '100%', textSizeAdjust: '100%' }}
      />
      <Search className="absolute w-5 h-5 right-10 top-2.5 text-[#14314F]" />
    </div>
  );
}
