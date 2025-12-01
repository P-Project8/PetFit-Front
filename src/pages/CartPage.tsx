import PageHeader from '../components/layout/PageHeader';

export default function CartPage() {
  return (
    <div className="min-h-screen bg-white pt-12 pb-16">
      <PageHeader title="장바구니" />

      {/* Custom Scrollbar Hide */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
