import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ChevronLeft } from 'lucide-react';
import EmailVerificationForm from '../components/auth/EmailVerificationForm';
import SignupForm from '../components/auth/SignupForm';

export default function SignupPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<'email' | 'signup'>('email');
  const [verifiedEmail, setVerifiedEmail] = useState('');

  function handleVerificationSuccess(email: string) {
    setVerifiedEmail(email);
    setStep('signup');
  }

  function handleSignupSuccess() {
    navigate('/login');
  }

  return (
    <div className="flex-1 bg-white flex flex-col">
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
          <EmailVerificationForm
            onVerificationSuccess={handleVerificationSuccess}
          />
        )}

        {/* Step 2: 회원가입 정보 입력 */}
        {step === 'signup' && (
          <SignupForm
            verifiedEmail={verifiedEmail}
            onSignupSuccess={handleSignupSuccess}
          />
        )}
      </div>
    </div>
  );
}
