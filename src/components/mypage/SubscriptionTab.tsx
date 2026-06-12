import { useState, useEffect } from 'react';
import { Crown, Zap, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import PageHeader from '../layout/PageHeader';
import {
  getSubscription,
  getCredits,
  upgradeSubscription,
  cancelSubscription,
} from '../../services/subscriptionApi';
import type { SubscriptionResponse, CreditResponse } from '../../types/subscription';

interface SubscriptionTabProps {
  onBack: () => void;
  onPlanChange: (isPremium: boolean) => void;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}.${d.getMonth() + 1}.${d.getDate()}`;
}

export default function SubscriptionTab({ onBack, onPlanChange }: SubscriptionTabProps) {
  const [subscription, setSubscription] = useState<SubscriptionResponse | null>(null);
  const [credits, setCredits] = useState<CreditResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isActing, setIsActing] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const [sub, cred] = await Promise.all([getSubscription(), getCredits()]);
        setSubscription(sub);
        setCredits(cred);
      } catch {
        toast.error('구독 정보를 불러오지 못했습니다.');
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  async function handleUpgrade() {
    if (isActing) return;
    setIsActing(true);
    try {
      const result = await upgradeSubscription();
      setSubscription(result);
      onPlanChange(result.isPremium);
      const [cred] = await Promise.all([getCredits()]);
      setCredits(cred);
      toast.success('PREMIUM으로 업그레이드됐어요!');
    } catch {
      toast.error('업그레이드에 실패했습니다.');
    } finally {
      setIsActing(false);
    }
  }

  async function handleCancel() {
    if (isActing) return;
    setIsActing(true);
    setShowCancelConfirm(false);
    try {
      const result = await cancelSubscription();
      setSubscription(result);
      onPlanChange(result.isPremium);
      const cred = await getCredits();
      setCredits(cred);
      toast.success('구독이 취소됐어요. FREE 플랜으로 전환됩니다.');
    } catch {
      toast.error('취소 처리에 실패했습니다.');
    } finally {
      setIsActing(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-12 pb-24">
      <PageHeader title="구독 관리" onBackClick={onBack} />

      {isLoading ? (
        <div className="px-4 py-6 space-y-4">
          <div className="h-36 bg-gray-200 rounded-2xl animate-pulse" />
          <div className="h-28 bg-gray-200 rounded-2xl animate-pulse" />
        </div>
      ) : (
        <div className="px-4 py-6 space-y-4">
          {/* 현재 플랜 카드 */}
          <div className={`rounded-2xl p-5 ${subscription?.isPremium ? 'bg-[#14314F] text-white' : 'bg-white border border-gray-200'}`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Crown className={`w-5 h-5 ${subscription?.isPremium ? 'text-yellow-300' : 'text-gray-400'}`} />
                <span className="font-bold text-lg">
                  {subscription?.isPremium ? 'PREMIUM' : 'FREE'}
                </span>
              </div>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${subscription?.isPremium ? 'bg-yellow-300 text-[#14314F]' : 'bg-gray-100 text-gray-500'}`}>
                현재 플랜
              </span>
            </div>

            {subscription?.isPremium ? (
              <div className="space-y-1">
                <p className="text-sm text-white/80">AI 스타일링 무제한 이용</p>
                <p className="text-sm text-white/80">고화질 다운로드 (워터마크 없음)</p>
                <p className="text-xs text-white/60 mt-3">
                  만료일: {subscription.endDate ? formatDate(subscription.endDate) : '-'}
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                <p className="text-sm text-gray-500">AI 스타일링 월 3회</p>
                <p className="text-sm text-gray-500">512px 저화질 다운로드 (워터마크)</p>
              </div>
            )}
          </div>

          {/* AI 크레딧 현황 */}
          {credits && (
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-4 h-4 text-[#14314F]" />
                <span className="font-semibold text-gray-900">이번 달 AI 사용량</span>
              </div>

              {credits.unlimited ? (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">사용 횟수</span>
                  <span className="font-bold text-[#14314F]">{credits.used}회 / 무제한</span>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">잔여 횟수</span>
                    <span className="font-bold text-[#14314F]">{credits.remaining}회 남음</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-[#14314F] h-2 rounded-full transition-all"
                      style={{ width: `${Math.min((credits.used / credits.monthlyLimit) * 100, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 text-right">
                    {credits.used} / {credits.monthlyLimit}회 사용
                  </p>
                </div>
              )}
            </div>
          )}

          {/* 업그레이드 / 취소 버튼 */}
          {subscription?.isPremium ? (
            <button
              onClick={() => setShowCancelConfirm(true)}
              disabled={isActing}
              className="w-full py-3.5 border border-gray-300 text-gray-500 text-sm font-medium rounded-2xl active:scale-[0.98] transition-all disabled:opacity-50"
            >
              구독 취소
            </button>
          ) : (
            <button
              onClick={handleUpgrade}
              disabled={isActing}
              className="w-full py-4 bg-[#14314F] text-white font-bold rounded-2xl active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isActing ? (
                <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <Crown className="w-5 h-5 text-yellow-300" />
              )}
              {isActing ? '처리 중...' : 'PREMIUM 업그레이드'}
            </button>
          )}
        </div>
      )}

      {/* 취소 확인 모달 */}
      {showCancelConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowCancelConfirm(false)} />
          <div className="relative bg-white rounded-2xl p-6 w-full max-w-sm">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <h3 className="font-bold text-gray-900">구독을 취소할까요?</h3>
            </div>
            <p className="text-sm text-gray-500 mb-6">
              즉시 FREE 플랜으로 전환됩니다. AI 스타일링 횟수 제한이 적용돼요.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="flex-1 py-3 border border-gray-200 text-gray-700 font-medium rounded-xl"
              >
                유지하기
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 py-3 bg-red-500 text-white font-bold rounded-xl"
              >
                취소하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
