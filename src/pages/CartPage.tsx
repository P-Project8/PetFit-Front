import { Plus, Minus, X } from 'lucide-react';
import { useState } from 'react';
import PageHeader from '../components/layout/PageHeader';
import { useCartStore } from '../store/cartStore';
import { useNavigate } from 'react-router';
import ConfirmModal from '../components/common/ConfirmModal';

export default function CartPage() {
  const { items, removeItem, updateQuantity } = useCartStore();
  const navigate = useNavigate();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const totalPrice = items.reduce((sum, item) => {
    const price = item.product.discountRate
      ? item.product.price * (1 - item.product.discountRate / 100)
      : item.product.price;
    return sum + price * item.quantity;
  }, 0);

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

  function handleQuantityChange(cartItemId: string, delta: number) {
    const item = items.find((item) => item.cartItemId === cartItemId);
    if (!item) return;

    const newQuantity = item.quantity + delta;
    if (newQuantity >= 1 && newQuantity <= 99) {
      updateQuantity(cartItemId, newQuantity);
    }
  }

  function handleRemove(cartItemId: string) {
    setItemToDelete(cartItemId);
    setDeleteModalOpen(true);
  }

  function confirmDelete() {
    if (itemToDelete) {
      removeItem(itemToDelete);
    }
    setDeleteModalOpen(false);
    setItemToDelete(null);
  }

  function cancelDelete() {
    setDeleteModalOpen(false);
    setItemToDelete(null);
  }

  function handlePurchase() {
    if (items.length === 0) {
      alert('장바구니가 비어있습니다.');
      return;
    }
    alert('구매하기 기능은 준비 중입니다.');
  }

  return (
    <div className="min-h-screen bg-white py-12">
      <PageHeader title="장바구니" onBackClick={() => navigate(-1)} />

      <div className="pt-4 px-4">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10">
            <p className="text-gray-400 text-lg mb-2">
              장바구니가 비어있습니다
            </p>
            <p className="text-gray-300 text-base">상품을 담아주세요</p>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="space-y-4 mb-6">
              {items.map((item) => {
                const discountedPrice = item.product.discountRate
                  ? item.product.price * (1 - item.product.discountRate / 100)
                  : item.product.price;

                return (
                  <div
                    key={item.cartItemId}
                    className="bg-white border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex gap-4">
                      {/* Product Image */}
                      <div className="w-24 h-24 bg-gray-100 rounded-lg shrink-0 overflow-hidden">
                        {item.product.imageUrl && (
                          <img
                            src={item.product.imageUrl}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-sm font-semibold text-gray-900 truncate pr-2">
                            {item.product.name}
                          </h3>
                          <button
                            onClick={() => handleRemove(item.cartItemId)}
                            className="text-gray-400 hover:text-gray-600 shrink-0"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        <p className="text-xs text-gray-500 mb-3">
                          {item.size} / {item.color}
                        </p>

                        <div className="flex items-center justify-between">
                          {/* Quantity Control */}
                          <div className="flex items-center border border-gray-300 rounded-lg px-2 py-1.5 bg-white">
                            <button
                              onClick={() =>
                                handleQuantityChange(item.cartItemId, -1)
                              }
                              disabled={item.quantity <= 1}
                              className="disabled:opacity-30"
                            >
                              <Minus className="w-3 h-3 text-gray-700" />
                            </button>
                            <span className="text-xs text-gray-900 mx-3 min-w-[20px] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                handleQuantityChange(item.cartItemId, 1)
                              }
                              disabled={item.quantity >= 99}
                              className="disabled:opacity-30"
                            >
                              <Plus className="w-3 h-3 text-gray-700" />
                            </button>
                          </div>

                          {/* Price */}
                          <div className="text-right">
                            {item.product.discountRate ? (
                              <>
                                <p className="text-xs text-gray-400 line-through">
                                  {(
                                    item.product.price * item.quantity
                                  ).toLocaleString()}
                                  원
                                </p>
                                <p className="text-sm font-bold text-gray-900">
                                  {(
                                    discountedPrice * item.quantity
                                  ).toLocaleString()}
                                  원
                                </p>
                              </>
                            ) : (
                              <p className="text-sm font-bold text-gray-900">
                                {(
                                  discountedPrice * item.quantity
                                ).toLocaleString()}
                                원
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Price Summary */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">상품 개수</span>
                <span className="text-gray-900 font-semibold">
                  {totalQuantity}개
                </span>
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
          </>
        )}
      </div>

      {/* Fixed Bottom Button */}
      {items.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50">
          <button
            onClick={handlePurchase}
            className="w-full py-3 bg-[#14314F] text-white font-semibold rounded-lg active:bg-[#0d1f33] transition-colors"
          >
            {totalPrice.toLocaleString()}원 구매하기
          </button>
        </div>
      )}

      {/* Delete Confirm Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        title="상품 삭제"
        message="장바구니에서 상품을 삭제하시겠습니까?"
        confirmText="삭제"
        cancelText="취소"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
}
