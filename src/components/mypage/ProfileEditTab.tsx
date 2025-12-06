import { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { getProfile, updateProfile } from '../../services/api';
import type { ApiException } from '../../services/api';
import { toast } from 'sonner';
import PageHeader from '../layout/PageHeader';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import ConfirmModal from '../common/ConfirmModal';

interface ProfileEditTabProps {
  onBack: () => void;
}

// 통합 프로필 수정 스키마
const profileSchema = z
  .object({
    name: z.string().min(2, '이름은 2자 이상이어야 합니다.'),
    birth: z.string().min(10, '생년월일을 모두 선택해주세요.'),
    currentPassword: z.string().optional(),
    newPassword: z.string().optional(),
    confirmPassword: z.string().optional(),
  })
  .refine(
    (data) => {
      // 비밀번호 변경하려면 현재 비밀번호 필수
      if (data.newPassword && !data.currentPassword) {
        return false;
      }
      return true;
    },
    {
      message: '현재 비밀번호를 입력해주세요.',
      path: ['currentPassword'],
    }
  )
  .refine(
    (data) => {
      // 새 비밀번호는 8자 이상
      if (data.newPassword && data.newPassword.length < 8) {
        return false;
      }
      return true;
    },
    {
      message: '새 비밀번호는 8자 이상이어야 합니다.',
      path: ['newPassword'],
    }
  )
  .refine(
    (data) => {
      // 비밀번호 확인 일치 검사
      if (data.newPassword && data.newPassword !== data.confirmPassword) {
        return false;
      }
      return true;
    },
    {
      message: '비밀번호가 일치하지 않습니다.',
      path: ['confirmPassword'],
    }
  );

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfileEditTab({ onBack }: ProfileEditTabProps) {
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [pendingFormData, setPendingFormData] =
    useState<ProfileFormValues | null>(null);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      birth: user?.birth || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  // 프로필 조회
  useEffect(() => {
    async function fetchProfile() {
      setIsLoadingProfile(true);
      try {
        const data = await getProfile();
        form.setValue('name', data.name);
        form.setValue('birth', data.birth);
      } catch (error) {
        const apiError = error as ApiException;
        toast.error(apiError.message || '프로필 조회에 실패했습니다.');
      } finally {
        setIsLoadingProfile(false);
      }
    }
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 폼 제출 시 모달 열기
  function handleSubmitClick(values: ProfileFormValues) {
    setPendingFormData(values);
    setConfirmModalOpen(true);
  }

  // 모달 확인 시 실제 프로필 수정
  async function confirmUpdate() {
    if (!pendingFormData) return;

    setConfirmModalOpen(false);
    setIsUpdating(true);

    try {
      // 비밀번호 변경 여부 확인
      const isChangingPassword =
        pendingFormData.newPassword && pendingFormData.currentPassword;

      const requestData = {
        name: pendingFormData.name,
        birth: pendingFormData.birth,
        ...(isChangingPassword && {
          currentPassword: pendingFormData.currentPassword,
          newPassword: pendingFormData.newPassword,
          passwordChangeValid: true,
        }),
      };

      await updateProfile(requestData);

      // 수정 성공 후 최신 프로필 조회
      const updatedProfile = await getProfile();

      // authStore 업데이트
      updateUser(updatedProfile);

      // 비밀번호 필드 초기화
      if (isChangingPassword) {
        form.setValue('currentPassword', '');
        form.setValue('newPassword', '');
        form.setValue('confirmPassword', '');
        toast.success('프로필 및 비밀번호가 변경되었습니다.');
      } else {
        toast.success('프로필이 수정되었습니다.');
      }
    } catch (error) {
      console.error('프로필 수정 에러:', error);
      const apiError = error as ApiException;
      toast.error(apiError.message || '프로필 수정에 실패했습니다.');
    } finally {
      setIsUpdating(false);
      setPendingFormData(null);
    }
  }

  // 모달 취소
  function cancelUpdate() {
    setConfirmModalOpen(false);
    setPendingFormData(null);
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-12 pb-20">
      <PageHeader title="프로필 수정" onBackClick={onBack} />

      <div className="px-6 py-6 space-y-6">
        {/* 사용자 정보 */}
        <div className="bg-white rounded-xl p-4">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between py-2">
              <span className="text-gray-500">아이디</span>
              <span className="font-medium text-gray-900">
                {user?.userId || '-'}
              </span>
            </div>
            <div className="flex justify-between py-2 border-t border-gray-100">
              <span className="text-gray-500">이메일</span>
              <span className="font-medium text-gray-900">
                {user?.email || '-'}
              </span>
            </div>
          </div>
        </div>

        {/* 프로필 수정 폼 */}
        <div className="bg-white rounded-xl p-4">
          <h2 className="text-base font-semibold mb-4">프로필 수정</h2>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmitClick)}
              className="space-y-4"
            >
              {/* 이름 */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>이름</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="이름"
                        disabled={isUpdating || isLoadingProfile}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 생년월일 */}
              <FormField
                control={form.control}
                name="birth"
                render={({ field }) => {
                  const [y, m, d] = field.value
                    ? field.value.split('-')
                    : ['', '', ''];

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

                  function handleDateChange(
                    type: 'y' | 'm' | 'd',
                    value: string
                  ) {
                    let newY = y;
                    let newM = m;
                    let newD = d;

                    if (type === 'y') newY = value;
                    if (type === 'm') {
                      newM = value.padStart(2, '0');
                      const maxDay = new Date(
                        parseInt(newY || '2000'),
                        parseInt(newM),
                        0
                      ).getDate();
                      if (parseInt(newD) > maxDay) newD = '';
                    }
                    if (type === 'd') newD = value.padStart(2, '0');

                    field.onChange(`${newY || ''}-${newM || ''}-${newD || ''}`);
                  }

                  return (
                    <FormItem>
                      <FormLabel>생년월일</FormLabel>
                      <FormControl>
                        <div className="flex gap-2">
                          {/* 연도 */}
                          <Select
                            onValueChange={(val) => handleDateChange('y', val)}
                            value={y || undefined}
                            disabled={isUpdating || isLoadingProfile}
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

                          {/* 월 */}
                          <Select
                            onValueChange={(val) => handleDateChange('m', val)}
                            value={m ? parseInt(m).toString() : undefined}
                            disabled={isUpdating || isLoadingProfile}
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

                          {/* 일 */}
                          <Select
                            onValueChange={(val) => handleDateChange('d', val)}
                            value={d ? parseInt(d).toString() : undefined}
                            disabled={isUpdating || isLoadingProfile}
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

              {/* 현재 비밀번호 */}
              <FormField
                control={form.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>현재 비밀번호</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="변경 시에만 입력"
                        disabled={isUpdating}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 새 비밀번호 */}
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>새 비밀번호</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="변경 시에만 입력 (8자 이상)"
                        disabled={isUpdating}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 비밀번호 확인 */}
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>비밀번호 확인</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="새 비밀번호 확인"
                        disabled={isUpdating}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isUpdating || isLoadingProfile}
                className="w-full bg-[#14314F] hover:bg-[#0d1f33]"
              >
                {isUpdating ? '수정 중...' : '프로필 수정'}
              </Button>
            </form>
          </Form>
        </div>
      </div>

      {/* 프로필 수정 확인 모달 */}
      <ConfirmModal
        isOpen={confirmModalOpen}
        title="프로필 수정"
        message="프로필 정보를 수정하시겠습니까?"
        confirmText="수정"
        cancelText="취소"
        onConfirm={confirmUpdate}
        onCancel={cancelUpdate}
      />
    </div>
  );
}
