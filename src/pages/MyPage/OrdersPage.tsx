// src/pages/MyPage/OrdersPage.tsx
import React from 'react';

const mockOrders = [
  {
    id: '20251203-0001',
    date: '2025-12-03',
    status: '배송 준비중',
    total: 69000,
    itemSummary: '강아지 한복 외 1개',
  },
  {
    id: '20251128-0002',
    date: '2025-11-28',
    status: '배송 완료',
    total: 42000,
    itemSummary: '알록달록 후드티',
  },
  {
    id: '20251110-0003',
    date: '2025-11-10',
    status: '구매 확정',
    total: 33000,
    itemSummary: '스트라이프 티셔츠',
  },
];

export default function OrdersPage() {
  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">주문 내역</h1>

      <div className="mb-4 flex gap-2 text-sm">
        <button className="rounded-full border border-slate-300 px-3 py-1 text-slate-700">
          최근 3개월
        </button>
        <button className="rounded-full border border-slate-200 px-3 py-1 text-slate-500">
          6개월
        </button>
        <button className="rounded-full border border-slate-200 px-3 py-1 text-slate-500">
          1년
        </button>
      </div>

      <div className="space-y-3">
        {mockOrders.map((order) => (
          <div
            key={order.id}
            className="flex justify-between rounded-xl border bg-white px-4 py-3 text-sm shadow-sm"
          >
            <div>
              <div className="text-xs text-slate-500">주문번호</div>
              <div className="font-semibold text-slate-900">{order.id}</div>
              <div className="mt-1 text-xs text-slate-500">{order.date}</div>
              <div className="mt-2 text-slate-700">{order.itemSummary}</div>
            </div>

            <div className="text-right">
              <div className="text-xs text-slate-500 mb-1">결제 금액</div>
              <div className="text-base font-semibold text-slate-900">
                {order.total.toLocaleString()}원
              </div>
              <div className="mt-2 inline-flex rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
                {order.status}
              </div>
              <button className="mt-3 block w-full rounded-lg border border-slate-300 px-2 py-1 text-xs text-slate-700">
                상세 보기
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
