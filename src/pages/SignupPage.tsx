import { useState } from 'react';
import { useNavigate } from 'react-router';
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
} from '../components/ui/form';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { ChevronLeft } from 'lucide-react';

// Step 1: 이메일 인증 스키마
const emailVerificationSchema = z.object({
  email: z.string().email('올바른 이메일 형식이 아닙니다.'),
  verificationCode: z.string().min(6, '인증 코드는 6자리입니다.'),
});

// Step 2: 회원가입 스키마
const signupSchema = z.object({
  email: z.string().email(),
  userId: z
    .string()
    .min(4, '아이디는 4자 이상이어야 합니다.')
    .max(20, '아이디는 20자 이하여야 합니다.'),
  password: z.string().min(8, '비밀번호는 8자 이상이어야 합니다.'),
  name: z.string().min(2, '이름은 2자 이상이어야 합니다.'),
  birth: z.string().min(1, '생년월일을 입력해주세요.'),
});

type EmailVerificationValues = z.infer<typeof emailVerificationSchema>;
type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<'email' | 'signup'>('email');
  const [verifiedEmail, setVerifiedEmail] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Step 1: 이메일 인증 폼
  const emailForm = useForm<EmailVerificationValues>({
    resolver: zodResolver(emailVerificationSchema),
    defaultValues: {
      email: '',
      verificationCode: '',
    },
  });

  // Step 2: 회원가입 폼
  const signupForm = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      userId: '',
      password: '',
      name: '',
      birth: '',
    },
  });

  async function handleSendCode() {
    const email = emailForm.getValues('email');
    const result = await emailForm.trigger('email');

    if (!result) return;

    setIsLoading(true);
    try {
      // TODO: 실제 API 호출로 대체
      // await fetch('/api/auth/send-verification-code', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email }),
      // });

      await new Promise((resolve) => setTimeout(resolve, 1000));
      setCodeSent(true);
      toast.success('인증 코드가 발송되었습니다.');
    } catch (error) {
      toast.error('인증 코드 발송에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  }

  async function onEmailVerify(values: EmailVerificationValues) {
    setIsLoading(true);
    try {
      // TODO: 실제 API 호출로 대체
      // const response = await fetch('/api/auth/verify-email', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(values),
      // });

      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 임시: 인증 코드 123456으로 고정
      if (values.verificationCode !== '123456') {
        toast.error('인증 코드가 일치하지 않습니다.');
        return;
      }

      setVerifiedEmail(values.email);
      signupForm.setValue('email', values.email);
      setStep('signup');
      toast.success('이메일 인증이 완료되었습니다.');
    } catch (error) {
      toast.error('이메일 인증에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  }

  async function onSignup(values: SignupFormValues) {
    setIsLoading(true);
    try {
      // TODO: 실제 API 호출로 대체
      // const response = await fetch('/api/auth/signup', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(values),
      // });

      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success('회원가입이 완료되었습니다. 로그인해주세요.');
      navigate('/login');
    } catch (error) {
      toast.error('회원가입에 실패했습니다.');
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
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#14314F] mb-2">회원가입</h1>
          <p className="text-gray-600 text-sm">
            {step === 'email'
              ? '이메일 인증을 진행해주세요'
              : '회원 정보를 입력해주세요'}
          </p>
        </div>

        {/* Step 1: 이메일 인증 */}
        {step === 'email' && (
          <Form {...emailForm}>
            <form
              onSubmit={emailForm.handleSubmit(onEmailVerify)}
              className="space-y-4"
            >
              <FormField
                control={emailForm.control}
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
                    <FormMessage />
                  </FormItem>
                )}
              />

              {codeSent && (
                <FormField
                  control={emailForm.control}
                  name="verificationCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>인증 코드</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="6자리 인증 코드"
                          className="placeholder-gray-400 placeholder:text-sm py-3"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                      <p className="text-xs text-gray-500">
                        테스트용 인증 코드: 123456
                      </p>
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
        )}

        {/* Step 2: 회원가입 정보 입력 */}
        {step === 'signup' && (
          <Form {...signupForm}>
            <form
              onSubmit={signupForm.handleSubmit(onSignup)}
              className="space-y-4"
            >
              <FormField
                control={signupForm.control}
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
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={signupForm.control}
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
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={signupForm.control}
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
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={signupForm.control}
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
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={signupForm.control}
                name="birth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>생년월일</FormLabel>
                    <FormControl>
                      <Input type="date" disabled={isLoading} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
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
        )}
      </div>
    </div>
  );
}
