interface PriceSummaryProps {
  totalQuantity: number;
  totalPrice: number;
}

export default function PriceSummary({
  totalQuantity,
  totalPrice,
}: PriceSummaryProps) {
  return (
    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">상품 개수</span>
        <span className="text-gray-900 font-semibold">{totalQuantity}개</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">총 상품 금액</span>
        <span className="text-gray-900 font-semibold">
          {totalPrice.toLocaleString()}원
        </span>
      </div>
      <div className="border-t border-gray-200 pt-2 mt-2">
        <div className="flex justify-between">
          <span className="text-base font-bold text-gray-900">
            총 결제 금액
          </span>
          <span className="text-lg font-bold text-[#14314F]">
            {totalPrice.toLocaleString()}원
          </span>
        </div>
      </div>
    </div>
  );
}
