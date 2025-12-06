import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui';
import { ChevronLeft } from 'lucide-react';
import { toast } from 'sonner';
import { sendVerificationCode, verifyEmail, signup } from '../services/api';
import type { ApiException } from '../services/api';

// Step 1: 이메일 인증 스키마
const emailVerificationSchema = z.object({
  email: z.email('올바른 이메일 형식이 아닙니다.'),
  verificationCode: z
    .string()
    .length(6, '인증 코드는 정확히 6자리여야 합니다.'),
});

// Step 2: 회원가입 스키마
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

type EmailVerificationValues = z.infer<typeof emailVerificationSchema>;
type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<'email' | 'signup'>('email');
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

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i); // 올해부터 100년 전까지
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  async function handleSendCode() {
    const email = emailForm.getValues('email');
    const result = await emailForm.trigger('email');

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

  async function onEmailVerify(values: EmailVerificationValues) {
    setIsLoading(true);
    try {
      const trimmedEmail = values.email.trim();
      const trimmedCode = values.verificationCode.trim();

      const response = await verifyEmail(trimmedEmail, trimmedCode);

      if (response.verified) {
        signupForm.setValue('email', trimmedEmail);
        setStep('signup');
        toast.success('이메일 인증이 완료되었습니다.');
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

  async function onSignup(values: SignupFormValues) {
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
      navigate('/login');
    } catch (error) {
      const apiError = error as ApiException;
      toast.error(apiError.message || '회원가입에 실패했습니다.');
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
                          maxLength={6}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
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
                render={({ field }) => {
                  // 현재 field.value (YYYY-MM-DD)를 파싱
                  const [y, m, d] = field.value
                    ? field.value.split('-')
                    : ['', '', ''];

                  // [수정] useMemo 제거 -> 일반 변수로 계산
                  // JS의 Date 연산은 가벼워서 렌더링마다 실행되어도 괜찮습니다.
                  let daysInMonth = 31;
                  if (y && m) {
                    daysInMonth = new Date(
                      parseInt(y),
                      parseInt(m),
                      0
                    ).getDate();
                  }

                  const days = Array.from(
                    { length: daysInMonth },
                    (_, i) => i + 1
                  );

                  const handleDateChange = (
                    type: 'y' | 'm' | 'd',
                    value: string
                  ) => {
                    let newY = y;
                    let newM = m;
                    let newD = d;

                    if (type === 'y') newY = value;
                    if (type === 'm') {
                      newM = value.padStart(2, '0');
                      // 월이 변경되었을 때, 현재 일이 그 달의 마지막 날보다 크다면 리셋 또는 조정
                      const maxDay = new Date(
                        parseInt(newY || '2000'),
                        parseInt(newM),
                        0
                      ).getDate();
                      if (parseInt(newD) > maxDay) newD = '';
                    }
                    if (type === 'd') newD = value.padStart(2, '0');

                    // 값이 일부만 있어도 저장 (유효성 검사는 zod 스키마가 담당)
                    field.onChange(`${newY || ''}-${newM || ''}-${newD || ''}`);
                  };

                  return (
                    <FormItem>
                      <FormLabel>생년월일</FormLabel>
                      <FormControl>
                        <div className="flex gap-2">
                          {/* 연도 선택 */}
                          <Select
                            onValueChange={(val) => handleDateChange('y', val)}
                            value={y || undefined}
                          >
                            <FormControl>
                              <SelectTrigger className="flex-1">
                                <SelectValue placeholder="년도" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="max-h-[200px]">
                              {years.map((year) => (
                                <SelectItem key={year} value={year.toString()}>
                                  {year}년
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          {/* 월 선택 */}
                          <Select
                            onValueChange={(val) => handleDateChange('m', val)}
                            value={m ? parseInt(m).toString() : undefined}
                          >
                            <FormControl>
                              <SelectTrigger className="flex-1">
                                <SelectValue placeholder="월" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="max-h-[200px]">
                              {months.map((month) => (
                                <SelectItem
                                  key={month}
                                  value={month.toString()}
                                >
                                  {month}월
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          {/* 일 선택 */}
                          <Select
                            onValueChange={(val) => handleDateChange('d', val)}
                            value={d ? parseInt(d).toString() : undefined}
                          >
                            <FormControl>
                              <SelectTrigger className="flex-1">
                                <SelectValue placeholder="일" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="max-h-[200px]">
                              {days.map((day) => (
                                <SelectItem key={day} value={day.toString()}>
                                  {day}일
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
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
