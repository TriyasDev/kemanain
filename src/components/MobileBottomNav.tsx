import { BarChart3, Home, ReceiptText, User } from 'lucide-react';
import type { NavTab } from '../types/finance';

interface MobileBottomNavProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
}

const NAV_ITEMS: Array<{
  id: NavTab;
  label: string;
  Icon: typeof Home;
}> = [
  { id: 'beranda', label: 'Beranda', Icon: Home },
  { id: 'riwayat', label: 'Riwayat', Icon: ReceiptText },
  { id: 'statistik', label: 'Statistik', Icon: BarChart3 },
  { id: 'profil', label: 'Profil', Icon: User },
];

export function MobileBottomNav({
  activeTab,
  onSelectTab,
}: MobileBottomNavProps) {
  return (
    <nav
      aria-label="Navigasi utama Kemanain"
      className="bg-white border-t border-[#E2E8F0] grid grid-cols-4 h-[68px] px-2 shrink-0"
    >
      {NAV_ITEMS.map(({ id, label, Icon }) => {
        const isActive = activeTab === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onSelectTab(id)}
            aria-current={isActive ? 'page' : undefined}
            className="min-h-[48px] flex flex-col items-center justify-center gap-1 focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#2563EB]"
          >
            <span
              className={`w-14 h-7 rounded-full flex items-center justify-center transition-colors duration-150 ${
                isActive
                  ? 'bg-[#EFF6FF] text-[#2563EB]'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              <Icon
                className="w-[20px] h-[20px]"
                strokeWidth={isActive ? 2.25 : 1.85}
                aria-hidden="true"
              />
            </span>
            <span
              className={`text-[11px] leading-none whitespace-nowrap ${
                isActive
                  ? 'font-semibold text-[#2563EB]'
                  : 'font-medium text-[#64748B]'
              }`}
            >
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
