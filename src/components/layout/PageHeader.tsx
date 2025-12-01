import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router';

interface PageHeaderProps {
  title: string;
  showBackButton?: boolean;
  onBackClick?: () => void;
  backPath?: string;
}

export default function PageHeader({
  title,
  showBackButton = true,
  onBackClick,
  backPath = '/',
}: PageHeaderProps) {
  const navigate = useNavigate();

  function handleBackClick() {
    if (onBackClick) {
      onBackClick();
    } else {
      navigate(backPath);
    }
  }

  return (
    <header className="bg-white border-b border-gray-200">
      {showBackButton ? (
        <div className="px-4">
          <div className="flex items-center h-12">
            <button
              onClick={handleBackClick}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors -ml-2"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>
            <h1 className="flex-1 text-center text-base font-semibold text-gray-900 pr-10">
              {title}
            </h1>
          </div>
        </div>
      ) : (
        <h1 className="flex h-12 justify-center items-center text-base font-semibold text-gray-900">
          {title}
        </h1>
      )}
    </header>
  );
}
