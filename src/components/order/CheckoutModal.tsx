import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { createOrder } from '../../services/api';
import { useCartStore } from '../../store/cartStore';

const checkoutSchema = z.object({
  recipientName: z.string().min(2, '이름은 2자 이상 입력해주세요.'),
  phone: z
    .string()
    .regex(/^010-\d{4}-\d{4}$/, '010-0000-0000 형식으로 입력해주세요.'),
  address: z.string().min(5, '주소를 입력해주세요.'),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

interface CheckoutModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function CheckoutModal({ onClose, onSuccess }: CheckoutModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const fetchCart = useCartStore((state) => state.fetchCart);

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      recipientName: '',
      phone: '',
      address: '',
    },
  });

  async function handleSubmit(values: CheckoutFormValues) {
    setIsLoading(true);
    try {
      await createOrder({
        recipientName: values.recipientName,
        phone: values.phone,
        address: values.address,
      });
      // 주문 생성 후 장바구니 새로고침 (백엔드에서 자동 처리했을 수 있음)
      await fetchCart();
      onSuccess();
    } catch {
      toast.error('주문에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-[200] flex items-end sm:items-center justify-center">
      <div className="bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl max-h-screen overflow-y-auto">
        {/* 헤더 */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">주문 정보 입력</h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* 폼 */}
        <div className="px-4 py-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="recipientName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>받는 분</FormLabel>
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
                    <FormLabel>연락처</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="010-0000-0000"
                        disabled={isLoading}
                        {...field}
                      />
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
                    <FormLabel>배송 주소</FormLabel>
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

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#14314F] hover:bg-[#0d1f33] h-11 mt-2"
              >
                {isLoading ? '주문 처리 중...' : '주문하기'}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
