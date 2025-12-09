import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Button,
} from '../ui';
import BirthDatePicker from './BirthDatePicker';
import { signup } from '../../services/api';
import type { ApiException } from '../../services/api';

const signupSchema = z.object({
  email: z.email('올바른 이메일 형식이 아닙니다.'),
  userId: z
    .string()
    .min(4, '아이디는 4자 이상이어야 합니다.')
    .max(20, '아이디는 20자 이하여야 합니다.'),
  password: z.string().min(8, '비밀번호는 8자 이상이어야 합니다.'),
  name: z.string().min(2, '이름은 2자 이상이어야 합니다.'),
  birth: z.string().min(10, '생년월일을 모두 선택해주세요.'),
});

type SignupFormValues = z.infer<typeof signupSchema>;

interface SignupFormProps {
  verifiedEmail: string;
  onSignupSuccess: () => void;
}

export default function SignupForm({
  verifiedEmail,
  onSignupSuccess,
}: SignupFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: verifiedEmail,
      userId: '',
      password: '',
      name: '',
      birth: '',
    },
  });

  async function onSubmit(values: SignupFormValues) {
    setIsLoading(true);
    try {
      await signup({
        email: values.email,
        userId: values.userId,
        password: values.password,
        name: values.name,
        birth: values.birth,
      });

      toast.success('회원가입이 완료되었습니다. 로그인해주세요.');
      onSignupSuccess();
    } catch (error) {
      const apiError = error as ApiException;
      toast.error(apiError.message || '회원가입에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>이메일</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  disabled
                  className="bg-gray-50 text-gray-400"
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="userId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>아이디</FormLabel>
              <FormControl>
                <Input
                  placeholder="아이디 (4-20자)"
                  className="placeholder:text-sm placeholder:text-gray-400"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-xs" />
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
                  placeholder="비밀번호 (8자 이상)"
                  className="placeholder:text-sm placeholder:text-gray-400"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>이름</FormLabel>
              <FormControl>
                <Input
                  placeholder="이름"
                  className="placeholder:text-sm placeholder:text-gray-400"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="birth"
          render={({ field }) => <BirthDatePicker field={field} />}
        />

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#14314F] hover:bg-[#0d1f33] h-11 mt-3"
        >
          {isLoading ? '회원가입 중...' : '회원가입'}
        </Button>
      </form>
    </Form>
  );
}
