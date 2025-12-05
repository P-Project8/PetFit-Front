import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { X, Star } from 'lucide-react';
import { toast } from 'sonner';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Button } from '../ui/button';
import { markAsReviewed } from '../../data/mockOrders';

const reviewSchema = z.object({
  rating: z.number().min(1, '별점을 선택해주세요.').max(5),
  content: z.string().min(10, '최소 10자 이상 작성해주세요.'),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

interface ReviewWriteModalProps {
  productId: number;
  productName: string;
  onClose: () => void;
  onSubmit?: (data: ReviewFormValues) => void;
}

export default function ReviewWriteModal({
  productId,
  productName,
  onClose,
  onSubmit,
}: ReviewWriteModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      content: '',
    },
  });

  const currentRating = form.watch('rating');

  async function handleSubmit(values: ReviewFormValues) {
    setIsLoading(true);
    try {
      // TODO: 실제 API 호출로 대체
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 리뷰 작성 완료 표시
      markAsReviewed(productId);

      toast.success('리뷰가 등록되었습니다.');
      onSubmit?.(values);
      onClose();
    } catch (error) {
      console.log(error);
      toast.error('리뷰 등록에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  }

  function renderStarButton(starNumber: number) {
    const isFilled =
      hoveredStar !== null
        ? starNumber <= hoveredStar
        : starNumber <= currentRating;

    return (
      <button
        type="button"
        onClick={() => form.setValue('rating', starNumber)}
        onMouseEnter={() => setHoveredStar(starNumber)}
        onMouseLeave={() => setHoveredStar(null)}
        className="p-1 transition-transform hover:scale-110"
      >
        <Star
          className={`w-8 h-8 transition-colors ${
            isFilled ? 'fill-yellow-300 text-yellow-300' : 'text-gray-300'
          }`}
        />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-100 flex items-end sm:items-center justify-center">
      <div className="bg-white w-full sm:max-w-md sm:rounded-t-2xl rounded-t-2xl max-h-screen overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">리뷰 작성</h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="px-4 py-6">
          {/* Product Name */}
          <div className="mb-6">
            <p className="text-sm text-gray-600">상품</p>
            <p className="text-base font-medium text-gray-900">{productName}</p>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6"
            >
              {/* Rating */}
              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>별점</FormLabel>
                    <FormControl>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => renderStarButton(star))}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Content */}
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>리뷰 내용</FormLabel>
                    <FormControl>
                      <textarea
                        {...field}
                        placeholder="상품에 대한 솔직한 후기를 남겨주세요. (최소 10자)"
                        className="w-full min-h-[120px] px-3 py-2 border border-gray-300 rounded-lg text-base resize-none focus:outline-none placeholder:text-sm"
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#14314F] hover:bg-[#0d1f33] h-11"
              >
                {isLoading ? '등록 중...' : '리뷰 등록'}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
