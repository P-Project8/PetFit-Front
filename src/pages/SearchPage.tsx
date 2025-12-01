import PageHeader from '@/components/layout/PageHeader';
import { Search } from 'lucide-react';

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-white py-12">
      <PageHeader title="검색" showBackButton={false} />
      <div className="w-full px-6 mt-4 relative">
        <input
          type="text"
          className="bg-gray-100 w-full h-10 rounded-2xl placeholder-gray-400 placeholder:text-sm text-black text-base px-4 focus:outline-none"
          placeholder="검색어를 입력해주세요."
          style={{ WebkitTextSizeAdjust: '100%', textSizeAdjust: '100%' }}
        />
        <Search className="absolute w-5 h-5 right-10 top-2.5 text-[#14314F]" />
      </div>

      {/* Custom Scrollbar Hide */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
