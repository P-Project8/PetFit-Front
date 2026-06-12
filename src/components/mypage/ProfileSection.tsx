import { Crown } from 'lucide-react';

interface ProfileSectionProps {
  name: string;
  email: string;
  isPremium?: boolean;
  onEditClick: () => void;
}

export default function ProfileSection({
  name,
  email,
  isPremium,
  onEditClick,
}: ProfileSectionProps) {
  return (
    <div className="bg-white">
      <div className="px-6 py-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl font-bold text-gray-900">{name}</h2>
              {isPremium !== undefined && (
                <span className={`flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${isPremium ? 'bg-[#14314F] text-yellow-300' : 'bg-gray-100 text-gray-500'}`}>
                  {isPremium && <Crown className="w-3 h-3" />}
                  {isPremium ? 'PREMIUM' : 'FREE'}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500">{email}</p>
          </div>
          <button
            onClick={onEditClick}
            className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors"
          >
            프로필 수정
          </button>
        </div>
      </div>
    </div>
  );
}
