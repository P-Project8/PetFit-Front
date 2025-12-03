import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuthStore } from '../store/authStore';
import { toast } from 'sonner';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../components/ui/form';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { ChevronLeft } from 'lucide-react';

const loginSchema = z.object({
  userId: z.string().min(1, '아이디를 입력해주세요.'),
  password: z.string().min(1, '비밀번호를 입력해주세요.'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      userId: '',
      password: '',
    },
  });

  async function onSubmit(values: LoginFormValues) {
    setIsLoading(true);

    try {
      // TODO: 실제 API 호출로 대체
      // const response = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(values),
      // });
      // const data = await response.json();

      // 임시 Mock 로그인
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockToken = 'mock-jwt-token-' + Date.now();
      const mockUser = {
        userId: values.userId,
        email: `${values.userId}@example.com`,
        name: '테스트 유저',
        birth: '1990-01-01',
      };

      login(mockToken, mockUser);
      toast.success('로그인 되었습니다.');
      navigate('/');
    } catch (error) {
      toast.error('로그인에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="px-4 pt-4 pb-3">
        <button onClick={() => navigate(-1)}>
          <ChevronLeft />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-center px-6 pb-20">
        <div className="flex justify-center mb-10">
          {/* Logo */}
          <div className="flex items-end">
            <img src="/P.png" alt="P" className="h-12 mb-1" />
            <span className="font-['KaKamora'] text-4xl mr-0.5 mb-1 text-[#14314F] whitespace-nowrap transition-all duration-500 ease-in-out">
              et
            </span>

            <img src="/F.png" alt="F" className="h-12 mb-1" />
            <span className="font-['KaKamora'] text-4xl mb-1 text-[#14314F] whitespace-nowrap transition-all duration-500 ease-in-out">
              it
            </span>
          </div>
        </div>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="userId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>아이디</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="아이디를 입력하세요"
                      className="placeholder-gray-400 placeholder:text-sm py-3"
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
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>비밀번호</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="비밀번호를 입력하세요"
                      className="placeholder-gray-400 placeholder:text-sm"
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
              className="mt-3 w-full py-3 bg-[#14314F] font-semibold"
            >
              {isLoading ? '로그인 중...' : '로그인'}
            </Button>
          </form>
        </Form>

        {/* Sign Up Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            계정이 없으신가요?&nbsp;
            <button
              onClick={() => navigate('/signup')}
              className="text-[#14314F] font-semibold hover:underline"
            >
              회원가입
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
