// src/pages/MyPage/SettingsPage.tsx
import React, { useState } from 'react';

export default function SettingsPage() {
  const [emailNotice, setEmailNotice] = useState(true);
  const [marketing, setMarketing] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert('설정 저장 요청 보낸 걸로! (나중에 API 연결)');
  };

  const handleLogout = () => {
    alert('로그아웃 요청 보낸 걸로! (AUTH-007 연동 예정)');
  };

  const handleDelete = () => {
    if (confirm('정말 탈퇴하시겠어요?')) {
      alert('회원 탈퇴 요청 보낸 걸로! (USER-003 연동 예정)');
    }
  };

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold mb-6">설정</h1>

      <form onSubmit={handleSave} className="space-y-6 rounded-xl border bg-white p-4 shadow-sm">
        <div>
          <h2 className="mb-3 text-sm font-semibold text-slate-900">
            알림 설정
          </h2>

          <label className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm">
            <span className="text-slate-800">주문/배송 안내 메일 받기</span>
            <input
              type="checkbox"
              checked={emailNotice}
              onChange={(e) => setEmailNotice(e.target.checked)}
              className="h-4 w-4"
            />
          </label>

          <label className="mt-2 flex items-center justify-between rounded-lg border px-3 py-2 text-sm">
            <span className="text-slate-800">이벤트/할인 소식 받기</span>
            <input
              type="checkbox"
              checked={marketing}
              onChange={(e) => setMarketing(e.target.checked)}
              className="h-4 w-4"
            />
          </label>
        </div>

        <button
          type="submit"
          className="w-full rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
        >
          설정 저장하기
        </button>
      </form>

      <div className="mt-8 space-y-3 rounded-xl border bg-white p-4 text-sm shadow-sm">
        <button
          onClick={handleLogout}
          className="w-full rounded-md border border-slate-300 px-4 py-2 text-slate-800"
        >
          로그아웃
        </button>
        <button
          onClick={handleDelete}
          className="w-full rounded-md border border-red-200 px-4 py-2 text-red-600"
        >
          회원 탈퇴
        </button>
      </div>
    </div>
  );
}
