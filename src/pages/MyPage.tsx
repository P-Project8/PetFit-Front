import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuthStore } from '../store/authStore';
import {
  getProfile,
  updateProfile,
  logout as apiLogout,
} from '../services/api';
import type { ApiException, UserProfile } from '../services/api';
import { toast } from 'sonner';
import PageHeader from '../components/layout/PageHeader';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// 프로필 수정 스키마
const profileSchema = z.object({
  name: z.string().min(2, '이름은 2자 이상이어야 합니다.'),
  birth: z.string().min(10, '생년월일을 입력해주세요.'),
});

// 비밀번호 변경 스키마
const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, '현재 비밀번호를 입력해주세요.'),
    newPassword: z.string().min(8, '새 비밀번호는 8자 이상이어야 합니다.'),
    confirmPassword: z.string().min(1, '비밀번호 확인을 입력해주세요.'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['confirmPassword'],
  });

type ProfileFormValues = z.infer<typeof profileSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function MyPage() {
  const navigate = useNavigate();
  const { user, logout: logoutStore } = useAuthStore();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      birth: '',
    },
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  // 프로필 조회
  async function fetchProfile() {
    setIsLoadingProfile(true);
    try {
      const data = await getProfile();
      setProfile(data);
      profileForm.setValue('name', data.name);
      profileForm.setValue('birth', data.birth);
      toast.success('프로필을 불러왔습니다.');
    } catch (error) {
      const apiError = error as ApiException;
      toast.error(apiError.message || '프로필 조회에 실패했습니다.');
    } finally {
      setIsLoadingProfile(false);
    }
  }

  // 프로필 수정
  async function onUpdateProfile(values: ProfileFormValues) {
    setIsUpdatingProfile(true);
    try {
      const updated = await updateProfile({
        name: values.name,
        birth: values.birth,
      });
      setProfile(updated);
      toast.success('프로필이 수정되었습니다.');
    } catch (error) {
      const apiError = error as ApiException;
      toast.error(apiError.message || '프로필 수정에 실패했습니다.');
    } finally {
      setIsUpdatingProfile(false);
    }
  }

  // 비밀번호 변경
  async function onChangePassword(values: PasswordFormValues) {
    setIsChangingPassword(true);
    try {
      await updateProfile({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
        passwordChangeValid: true,
      });
      toast.success('비밀번호가 변경되었습니다.');
      passwordForm.reset();
    } catch (error) {
      const apiError = error as ApiException;
      toast.error(apiError.message || '비밀번호 변경에 실패했습니다.');
    } finally {
      setIsChangingPassword(false);
    }
  }

  // 로그아웃
  async function handleLogout() {
    try {
      await apiLogout();
      logoutStore();
      toast.success('로그아웃 되었습니다.');
      navigate('/login');
    } catch (error) {
      // API 실패해도 로컬 상태는 초기화
      logoutStore();
      navigate('/login');
    }
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      <PageHeader title="마이페이지 (API 테스트)" showBackButton={false} />

      <div className="px-6 py-6 space-y-8">
        {/* 현재 저장된 사용자 정보 (authStore) */}
        <section className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-3">
            현재 저장된 사용자 정보 (authStore)
          </h2>
          <div className="space-y-2 text-sm">
            <p>
              <span className="font-medium">아이디:</span> {user?.userId || '-'}
            </p>
            <p>
              <span className="font-medium">이메일:</span> {user?.email || '-'}
            </p>
            <p>
              <span className="font-medium">이름:</span> {user?.name || '-'}
            </p>
            <p>
              <span className="font-medium">생년월일:</span>{' '}
              {user?.birth || '-'}
            </p>
          </div>
        </section>

        {/* 프로필 조회 버튼 */}
        <section>
          <Button
            onClick={fetchProfile}
            disabled={isLoadingProfile}
            className="w-full bg-[#14314F] hover:bg-[#0d1f33]"
          >
            {isLoadingProfile
              ? '조회 중...'
              : '프로필 조회 (GET /api/auth/profile)'}
          </Button>

          {profile && (
            <div className="mt-4 bg-green-50 p-4 rounded-lg">
              <h3 className="text-sm font-semibold mb-2 text-green-800">
                API 응답 결과:
              </h3>
              <div className="space-y-1 text-sm text-green-900">
                <p>아이디: {profile.userId}</p>
                <p>이메일: {profile.email}</p>
                <p>이름: {profile.name}</p>
                <p>생년월일: {profile.birth}</p>
              </div>
            </div>
          )}
        </section>

        {/* 프로필 수정 폼 */}
        <section className="border-t pt-6">
          <h2 className="text-lg font-semibold mb-4">
            프로필 수정 (PATCH /api/auth/profile)
          </h2>
          <Form {...profileForm}>
            <form
              onSubmit={profileForm.handleSubmit(onUpdateProfile)}
              className="space-y-4"
            >
              <FormField
                control={profileForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>이름</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="이름"
                        disabled={isUpdatingProfile}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={profileForm.control}
                name="birth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>생년월일</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        disabled={isUpdatingProfile}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isUpdatingProfile}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {isUpdatingProfile ? '수정 중...' : '프로필 수정'}
              </Button>
            </form>
          </Form>
        </section>

        {/* 비밀번호 변경 폼 */}
        <section className="border-t pt-6">
          <h2 className="text-lg font-semibold mb-4">
            비밀번호 변경 (PATCH /api/auth/profile)
          </h2>
          <Form {...passwordForm}>
            <form
              onSubmit={passwordForm.handleSubmit(onChangePassword)}
              className="space-y-4"
            >
              <FormField
                control={passwordForm.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>현재 비밀번호</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="현재 비밀번호"
                        disabled={isChangingPassword}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={passwordForm.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>새 비밀번호</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="새 비밀번호 (8자 이상)"
                        disabled={isChangingPassword}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={passwordForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>비밀번호 확인</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="비밀번호 확인"
                        disabled={isChangingPassword}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isChangingPassword}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                {isChangingPassword ? '변경 중...' : '비밀번호 변경'}
              </Button>
            </form>
          </Form>
        </section>

        {/* 로그아웃 버튼 */}
        <section className="border-t pt-6">
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full border-red-600 text-red-600 hover:bg-red-50"
          >
            로그아웃 (DELETE /api/auth/logout)
          </Button>
        </section>
      </div>
    </div>
  );
}
