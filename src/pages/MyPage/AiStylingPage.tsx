// src/pages/MyPage/AiStylingPage.tsx
import React from 'react';

const mockStylings = [
  {
    id: 1,
    petName: '몽이',
    style: '겨울 한복 코디',
    createdAt: '2025-12-02',
  },
  {
    id: 2,
    petName: '콩이',
    style: '후드티 + 머플러 코디',
    createdAt: '2025-11-30',
  },
  {
    id: 3,
    petName: '두부',
    style: '비 오는 날 레인코트',
    createdAt: '2025-11-25',
  },
];

export default function AiStylingPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">AI 스타일링 히스토리</h1>
      <p className="mb-6 text-sm text-slate-600">
        AI 코디에서 마음에 들었던 결과들을 모아두는 공간이에요.
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {mockStylings.map((item) => (
          <div
            key={item.id}
            className="flex flex-col rounded-xl border bg-white p-3 shadow-sm"
          >
            {/* 이미지 자리 */}
            <div className="mb-3 aspect-[4/3] w-full rounded-lg bg-slate-100" />

            <div className="flex-1">
              <div className="text-xs text-slate-500 mb-1">
                {item.createdAt} · {item.petName}
              </div>
              <div className="text-sm font-semibold text-slate-900">
                {item.style}
              </div>
            </div>

            <div className="mt-3 flex gap-2 text-xs">
              <button className="flex-1 rounded-lg border border-slate-300 px-2 py-1 text-slate-700">
                크게 보기
              </button>
              <button className="flex-1 rounded-lg border border-slate-200 bg-slate-900 px-2 py-1 font-medium text-white">
                다시 코디하기
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
