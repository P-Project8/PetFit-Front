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
import { sendVerificationCode, verifyEmail } from '../../services/api';
import type { ApiException } from '../../services/api';

const emailVerificationSchema = z.object({
  email: z.email('올바른 이메일 형식이 아닙니다.'),
  verificationCode: z
    .string()
    .length(6, '인증 코드는 정확히 6자리여야 합니다.'),
});

type EmailVerificationValues = z.infer<typeof emailVerificationSchema>;

interface EmailVerificationFormProps {
  onVerificationSuccess: (email: string) => void;
}

export default function EmailVerificationForm({
  onVerificationSuccess,
}: EmailVerificationFormProps) {
  const [codeSent, setCodeSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<EmailVerificationValues>({
    resolver: zodResolver(emailVerificationSchema),
    defaultValues: {
      email: '',
      verificationCode: '',
    },
  });

  async function handleSendCode() {
    const email = form.getValues('email');
    const result = await form.trigger('email');

    if (!result) return;

    setIsLoading(true);
    try {
      await sendVerificationCode(email);
      setCodeSent(true);
      toast.success('인증 코드가 발송되었습니다.');
    } catch (error) {
      const apiError = error as ApiException;
      toast.error(apiError.message || '인증 코드 발송에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  }

  async function onSubmit(values: EmailVerificationValues) {
    setIsLoading(true);
    try {
      const trimmedEmail = values.email.trim();
      const trimmedCode = values.verificationCode.trim();

      const response = await verifyEmail(trimmedEmail, trimmedCode);

      if (response.verified) {
        toast.success('이메일 인증이 완료되었습니다.');
        onVerificationSuccess(trimmedEmail);
      } else {
        toast.error('인증 코드가 일치하지 않습니다.');
      }
    } catch (error) {
      console.error('이메일 인증 에러:', error);
      const apiError = error as ApiException;
      toast.error(apiError.message || '이메일 인증에 실패했습니다.');
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
              <div className="flex gap-2">
                <FormControl>
                  <Input
                    type="email"
                    className="placeholder-gray-400 placeholder:text-sm"
                    placeholder="example@email.com"
                    disabled={isLoading || codeSent}
                    {...field}
                  />
                </FormControl>
                <Button
                  type="button"
                  onClick={handleSendCode}
                  disabled={isLoading || codeSent}
                  variant="outline"
                  className="shrink-0 h-11"
                >
                  {codeSent ? '발송 완료' : '코드 발송'}
                </Button>
              </div>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        {codeSent && (
          <FormField
            control={form.control}
            name="verificationCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>인증 코드</FormLabel>
                <FormControl>
                  <Input
                    placeholder="6자리 인증 코드"
                    className="placeholder-gray-400 placeholder:text-sm py-3"
                    disabled={isLoading}
                    maxLength={6}
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
        )}

        {codeSent && (
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#14314F] hover:bg-[#0d1f33] h-11"
          >
            {isLoading ? '인증 중...' : '인증 확인'}
          </Button>
        )}
      </form>
    </Form>
  );
}
