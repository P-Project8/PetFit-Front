import { Heart } from 'lucide-react';
import FLogo from '/src/assets/F.svg?react';

interface ProductActionBarProps {
  isLike?: boolean;
  wishCount: number;
  onWishClick: () => void;
  onAIStyling: () => void;
  onBuyClick: () => void;
}

export default function ProductActionBar({
  isLike,
  wishCount,
  onWishClick,
  onAIStyling,
  onBuyClick,
}: ProductActionBarProps) {
  return (
    <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
      <div
        className="
          pointer-events-auto
          w-full max-w-[400px] h-16
          bg-white/50
          backdrop-blur-md
          border border-white/40
          rounded-[35px]
          shadow-[0_8px_32px_rgba(31,38,135,0.15)]
          flex items-center justify-between
          pl-6 pr-2 py-2 gap-4
        "
      >
        <div className="flex items-center gap-5">
          <button
            className="flex flex-col items-center justify-center gap-0.5 min-w-8"
            onClick={onWishClick}
          >
            {isLike ? (
              <Heart className="w-6 h-6 text-red-600 fill-red-600" />
            ) : (
              <Heart className="w-6 h-6 text-[#14314F]" />
            )}
            <span className="text-[10px] font-medium text-[#14314F] leading-none">
              {wishCount}
            </span>
          </button>

          <div className="w-px h-8 bg-gray-300/50" />

          <button
            onClick={onAIStyling}
            className="w-16 items-center justify-center"
          >
            <div className="flex items-center justify-center h-6 text-[#14314F]">
              <FLogo className="w-3 h-5 " />
              <span className='font-["Kakamora"] text-base ml-0.5'>it</span>
            </div>
          </button>
        </div>

        <button
          onClick={onBuyClick}
          className="
            flex-1 h-full
            bg-[#14314F]
            text-white
            rounded-[28px]
            font-bold text-sm
            shadow-sm
            flex items-center justify-center
          "
        >
          구매하기
        </button>
      </div>
    </div>
  );
}
