import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';
import { ChevronDown, CreditCard } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../components/ui/form';
import { Input } from '../components/ui/input';
import PageHeader from '../components/layout/PageHeader';
import ConfirmModal from '../components/common/ConfirmModal';
import { createOrder } from '../services/api';
import { useCartStore } from '../store/cartStore';
import type { CartResponse } from '../services/cartApi';

const checkoutSchema = z.object({
  recipientName: z.string().min(2, '이름은 2자 이상 입력해주세요.'),
  phone: z
    .string()
    .regex(/^010-\d{4}-\d{4}$/, '010-0000-0000 형식으로 입력해주세요.'),
  address: z.string().min(5, '주소를 입력해주세요.'),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

type PaymentMethod = 'kakaopay' | 'tosspay' | 'card';

const PAYMENT_METHODS: { id: PaymentMethod; label: string; color: string; bg: string }[] = [
  { id: 'kakaopay', label: '카카오페이', color: '#3C1E1E', bg: '#FFCD00' },
  { id: 'tosspay', label: '토스페이', color: '#ffffff', bg: '#0064FF' },
  { id: 'card', label: '신용/체크카드', color: '#374151', bg: '#F3F4F6' },
];

const SHIPPING_FEE: number = 0;

function OrderItemRow({ item }: { item: CartResponse }) {
  const unitPrice = item.price + item.additionalPrice;
  return (
    <div className="flex gap-3 py-3">
      <div className="w-16 h-16 bg-gray-100 rounded-lg shrink-0 overflow-hidden">
        {item.thumbnailUrl && (
          <img src={item.thumbnailUrl} alt={item.productName} className="w-full h-full object-cover" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{item.productName}</p>
        <p className="text-xs text-gray-400 mt-0.5">{item.size} / {item.color} / {item.quantity}개</p>
        <p className="text-sm font-bold text-gray-900 mt-1">
          {(unitPrice * item.quantity).toLocaleString()}원
        </p>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingValues, setPendingValues] = useState<CheckoutFormValues | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('kakaopay');
  const [isItemsExpanded, setIsItemsExpanded] = useState(false);
  const { items, fetchCart } = useCartStore();
  const navigate = useNavigate();

  const totalPrice = items.reduce(
    (sum, item) => sum + (item.price + item.additionalPrice) * item.quantity,
    0,
  );
  const finalPrice = totalPrice + SHIPPING_FEE;
  const displayItems = isItemsExpanded ? items : items.slice(0, 2);

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { recipientName: '', phone: '', address: '' },
  });

  function handleValidSubmit(values: CheckoutFormValues) {
    setPendingValues(values);
    setConfirmOpen(true);
  }

  async function handleConfirmOrder() {
    if (!pendingValues) return;
    setConfirmOpen(false);
    setIsLoading(true);
    try {
      await createOrder({
        recipientName: pendingValues.recipientName,
        phone: pendingValues.phone,
        address: pendingValues.address,
      });
      await fetchCart();
      navigate('/my', { replace: true });
    } catch {
      toast.error('주문에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
      setPendingValues(null);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-12 pb-32">
      <PageHeader title="주문/결제" onBackClick={() => navigate(-1)} />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleValidSubmit)} className="space-y-3 mt-3">

          {/* 주문 상품 */}
          <section className="bg-white px-4 py-5">
            <h2 className="text-base font-bold text-gray-900 mb-1">
              주문 상품 <span className="text-[#14314F]">{items.length}개</span>
            </h2>
            <div className="divide-y divide-gray-100">
              {displayItems.map((item) => (
                <OrderItemRow key={item.id} item={item} />
              ))}
            </div>
            {items.length > 2 && (
              <button
                type="button"
                onClick={() => setIsItemsExpanded(!isItemsExpanded)}
                className="w-full flex items-center justify-center gap-1 pt-2 text-xs text-gray-400 hover:text-gray-600"
              >
                {isItemsExpanded ? '접기' : `${items.length - 2}개 더보기`}
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform ${isItemsExpanded ? 'rotate-180' : ''}`}
                />
              </button>
            )}
          </section>

          {/* 배송 정보 */}
          <section className="bg-white px-4 py-5">
            <h2 className="text-base font-bold text-gray-900 mb-4">배송 정보</h2>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="recipientName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm text-gray-600">받는 분</FormLabel>
                    <FormControl>
                      <Input placeholder="홍길동" disabled={isLoading} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm text-gray-600">연락처</FormLabel>
                    <FormControl>
                      <Input placeholder="010-0000-0000" disabled={isLoading} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm text-gray-600">배송 주소</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="서울특별시 강남구 테헤란로 123"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </section>

          {/* 결제 수단 */}
          <section className="bg-white px-4 py-5">
            <h2 className="text-base font-bold text-gray-900 mb-4">결제 수단</h2>
            <div className="grid grid-cols-3 gap-2">
              {PAYMENT_METHODS.map((method) => {
                const isSelected = paymentMethod === method.id;
                return (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setPaymentMethod(method.id)}
                    className={`flex flex-col items-center justify-center gap-2 py-4 rounded-xl border-2 transition-all ${
                      isSelected
                        ? 'border-[#14314F] shadow-sm'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {method.id === 'card' ? (
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: method.bg }}
                      >
                        <CreditCard className="w-5 h-5 text-gray-600" />
                      </div>
                    ) : (
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: method.bg }}
                      >
                        <span
                          className="text-xs font-extrabold"
                          style={{ color: method.color }}
                        >
                          {method.id === 'kakaopay' ? 'pay' : 'toss'}
                        </span>
                      </div>
                    )}
                    <span className={`text-xs font-medium ${isSelected ? 'text-[#14314F]' : 'text-gray-500'}`}>
                      {method.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* 결제 금액 */}
          <section className="bg-white px-4 py-5">
            <h2 className="text-base font-bold text-gray-900 mb-4">결제 금액</h2>
            <div className="space-y-3">
              <div className="flex justify-between text-sm text-gray-600">
                <span>상품 금액</span>
                <span>{totalPrice.toLocaleString()}원</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>배송비</span>
                <span className="text-[#14314F] font-medium">
                  {SHIPPING_FEE === 0 ? '무료' : `${SHIPPING_FEE.toLocaleString()}원`}
                </span>
              </div>
              <div className="h-px bg-gray-100" />
              <div className="flex justify-between text-base font-bold text-gray-900">
                <span>총 결제 금액</span>
                <span className="text-[#14314F]">{finalPrice.toLocaleString()}원</span>
              </div>
            </div>
          </section>

        </form>
      </Form>

      {/* 하단 고정 결제 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-4 z-50">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm text-gray-500">최종 결제 금액</span>
          <span className="text-lg font-bold text-gray-900">{finalPrice.toLocaleString()}원</span>
        </div>
        <button
          type="button"
          onClick={form.handleSubmit(handleValidSubmit)}
          disabled={isLoading || items.length === 0}
          className="w-full py-3.5 bg-[#14314F] text-white font-semibold rounded-xl active:bg-[#0d1f33] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isLoading ? '처리 중...' : `${finalPrice.toLocaleString()}원 결제하기`}
        </button>
      </div>

      <ConfirmModal
        isOpen={confirmOpen}
        title="결제 확인"
        message={`${finalPrice.toLocaleString()}원을 결제하시겠습니까?`}
        confirmText="결제하기"
        cancelText="취소"
        onConfirm={handleConfirmOrder}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}
