import { useState } from 'react';
import PageHeader from '../components/layout/PageHeader';
import CartItem from '../components/cart/CartItem';
import PriceSummary from '../components/cart/PriceSummary';
import ConfirmModal from '../components/common/ConfirmModal';
import { useCartStore } from '../store/cartStore';
import { useNavigate } from 'react-router';

export default function CartPage() {
  const { items, removeItem, updateQuantity, isLoading } = useCartStore();
  const navigate = useNavigate();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);

  // 실제 단가 = 기본가격 + 옵션추가가격
  const totalPrice = items.reduce(
    (sum, item) => sum + (item.price + item.additionalPrice) * item.quantity,
    0,
  );
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

  function handleQuantityChange(cartItemId: number, delta: number) {
    const item = items.find((i) => i.id === cartItemId);
    if (!item) return;

    const newQuantity = item.quantity + delta;
    if (newQuantity >= 1 && newQuantity <= 99) {
      updateQuantity(cartItemId, newQuantity);
    }
  }

  function handleRemove(cartItemId: number) {
    setItemToDelete(cartItemId);
    setDeleteModalOpen(true);
  }

  function confirmDelete() {
    if (itemToDelete !== null) {
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white pt-12 pb-20 flex items-center justify-center">
        <p className="text-gray-400 text-sm">불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-12 pb-20">
      <PageHeader title="장바구니" onBackClick={() => navigate(-1)} />

      <div className="pt-4 px-4">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10">
            <p className="text-gray-400 text-lg mb-2">장바구니가 비어있습니다</p>
            <p className="text-gray-300 text-base">상품을 담아주세요</p>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onQuantityChange={handleQuantityChange}
                  onRemove={handleRemove}
                  onProductClick={(productId) => navigate(`/product/${productId}`)}
                />
              ))}
            </div>

            <PriceSummary totalQuantity={totalQuantity} totalPrice={totalPrice} />
          </>
        )}
      </div>

      {items.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50">
          <button
            onClick={handlePurchase}
            className="w-full py-3 bg-[#14314F] cursor-pointer text-white font-semibold rounded-lg active:bg-[#0d1f33] transition-colors"
          >
            {totalPrice.toLocaleString()}원 구매하기
          </button>
        </div>
      )}

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
