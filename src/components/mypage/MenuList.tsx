import MenuItem from './MenuItem';
import {
  Package,
  MessageSquare,
  HelpCircle,
  Bell,
  LogOut,
} from 'lucide-react';

interface MenuListProps {
  onOrdersClick: () => void;
  onInquiriesClick: () => void;
  onFaqClick: () => void;
  onNoticesClick: () => void;
  onLogoutClick: () => void;
}

export default function MenuList({
  onOrdersClick,
  onInquiriesClick,
  onFaqClick,
  onNoticesClick,
  onLogoutClick,
}: MenuListProps) {
  return (
    <>
      {/* Main Menu */}
      <div className="mt-2 bg-white">
        <div className="px-6 py-4">
          <div className="space-y-1">
            <MenuItem icon={Package} label="주문내역" onClick={onOrdersClick} />
            <MenuItem
              icon={MessageSquare}
              label="문의내역"
              onClick={onInquiriesClick}
            />
            <MenuItem icon={HelpCircle} label="FAQ" onClick={onFaqClick} />
            <MenuItem icon={Bell} label="공지사항" onClick={onNoticesClick} />
          </div>
        </div>
      </div>

      {/* Service Info */}
      <div className="mt-2 bg-white">
        <div className="px-6 py-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">
            서비스 정보
          </h3>
          <div className="space-y-1">
            <MenuItem showIcon={false} label="이용약관" onClick={() => {}} />
            <MenuItem
              showIcon={false}
              label="개인정보처리방침"
              onClick={() => {}}
            />
          </div>
        </div>
      </div>

      {/* Logout */}
      <div className="mt-2 bg-white px-6 py-2">
        <MenuItem icon={LogOut} label="로그아웃" onClick={onLogoutClick} />
      </div>
    </>
  );
}
