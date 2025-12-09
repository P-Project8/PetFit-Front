interface ProfileSectionProps {
  name: string;
  email: string;
  onEditClick: () => void;
}

export default function ProfileSection({
  name,
  email,
  onEditClick,
}: ProfileSectionProps) {
  return (
    <div className="bg-white">
      <div className="px-6 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">{name}</h2>
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
