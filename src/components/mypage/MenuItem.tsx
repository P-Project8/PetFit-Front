import type { LucideIcon } from 'lucide-react';

interface MenuItemProps {
  icon?: LucideIcon;
  label: string;
  onClick: () => void;
  showIcon?: boolean;
}

export default function MenuItem({
  icon: Icon,
  label,
  onClick,
  showIcon = true,
}: MenuItemProps) {
  return (
    <button
      className="w-full flex items-center gap-3 py-3 text-gray-700 hover:text-gray-900"
      onClick={onClick}
    >
      {Icon && showIcon && <Icon className="w-4 h-4 text-[#14314F]" />}
      <span className="text-base">{label}</span>
    </button>
  );
}
