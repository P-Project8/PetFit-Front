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
import { login as apiLogin, getProfile } from '../services/api';
import type { ApiException } from '../services/api';

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
      const tokens = await apiLogin(values.userId, values.password);

      // 토큰을 먼저 저장 (프로필 조회 시 필요)
      login(tokens.accessToken, tokens.refreshToken, {
        userId: values.userId,
        email: '',
        name: '',
        birth: '',
      });

      // 프로필 정보 조회
      try {
        const userProfile = await getProfile();
        // 프로필 정보로 업데이트
        login(tokens.accessToken, tokens.refreshToken, userProfile);
      } catch (profileError) {
        console.error('프로필 조회 실패:', profileError);
        // 프로필 조회 실패해도 로그인은 유지
      }

      toast.success('로그인 되었습니다.');
      navigate('/');
    } catch (error) {
      const apiError = error as ApiException;
      toast.error(apiError.message || '로그인에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="px-4 pt-4 pb-3">
        <button onClick={() => navigate('/')}>
          <ChevronLeft />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-center px-6">
        <h1 className="flex text-3xl font-bold justify-center mb-10 items-end text-[#14314F]">
          로그인
        </h1>

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
