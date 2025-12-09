import { useState } from 'react';
import PageHeader from '../components/layout/PageHeader';
import CartItem from '../components/cart/CartItem';
import PriceSummary from '../components/cart/PriceSummary';
import ConfirmModal from '../components/common/ConfirmModal';
import { useCartStore } from '../store/cartStore';
import { useNavigate } from 'react-router';

export default function CartPage() {
  const { items, removeItem, updateQuantity, product } = useCartStore();
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
              {items.map((item) => (
                <CartItem
                  key={item.cartItemId}
                  item={item}
                  onQuantityChange={handleQuantityChange}
                  onRemove={handleRemove}
                  onProductClick={(productId) => navigate(`/product/${productId}`)}
                />
              ))}
            </div>

            {/* Price Summary */}
            <PriceSummary totalQuantity={totalQuantity} totalPrice={totalPrice} />
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
