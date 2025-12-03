// src/pages/MyPage/ProfilePage.tsx
import { useState } from 'react';

export default function ProfilePage() {
  const [form, setForm] = useState({
    email: 'user@example.com',
    nickname: '멍멍이집사',
    bio: '우리 강아지 옷 고르는 중 🐶',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: 나중에 여기서 Axios로 API 연결
    alert('프로필 수정 요청 보낸 걸로 치자! (나중에 API 붙일 예정)');
  };

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold mb-6">내 프로필</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 이메일 */}
        <div>
          <label className="block text-sm font-medium mb-1">이메일</label>
          <input
            name="email"
            value={form.email}
            disabled
            className="w-full rounded-md border bg-slate-100 px-3 py-2 text-sm"
          />
        </div>

        {/* 닉네임 */}
        <div>
          <label className="block text-sm font-medium mb-1">닉네임</label>
          <input
            name="nickname"
            value={form.nickname}
            onChange={handleChange}
            className="w-full rounded-md border px-3 py-2 text-sm"
          />
        </div>

        {/* 한 줄 소개 */}
        <div>
          <label className="block text-sm font-medium mb-1">한 줄 소개</label>
          <textarea
            name="bio"
            value={form.bio}
            onChange={handleChange}
            rows={3}
            className="w-full rounded-md border px-3 py-2 text-sm resize-none"
          />
        </div>

        <button
          type="submit"
          className="mt-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
        >
          저장하기
        </button>
      </form>
    </div>
  );
}
