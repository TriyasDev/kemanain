import {
  BarChart3,
  Home,
  Plus,
  ReceiptText,
  User,
  X,
} from 'lucide-react';
import type { NavTab } from '../types/finance';

interface SidebarDrawerProps {
  userName: string;
  activeTab: NavTab;
  isDesktopOpen: boolean;
  isMobileOpen: boolean;
  onSelectTab: (tab: NavTab) => void;
  onCloseMobile: () => void;
  onOpenAddTransaction: () => void;
}

const MENU_ITEMS: Array<{
  id: NavTab;
  label: string;
  Icon: typeof Home;
}> = [
  { id: 'beranda', label: 'Beranda', Icon: Home },
  { id: 'riwayat', label: 'Riwayat', Icon: ReceiptText },
  { id: 'statistik', label: 'Statistik', Icon: BarChart3 },
  { id: 'profil', label: 'Profil', Icon: User },
];

function SidebarContent({
  userName,
  activeTab,
  onSelectTab,
  onCloseMobile,
  onOpenAddTransaction,
  showCloseButton,
}: {
  userName: string;
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onCloseMobile: () => void;
  onOpenAddTransaction: () => void;
  showCloseButton: boolean;
}) {
  return (
    <div className="flex flex-col h-full p-4">
      <div className="flex items-center justify-between gap-2 pb-4 border-b border-[#F1F5F9]">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shrink-0">
            <User className="w-5 h-5" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-[#0F172A] truncate">{userName}</p>
            <p className="text-xs text-[#64748B] truncate">Kemanain · IDR</p>
          </div>
        </div>

        {showCloseButton && (
          <button
            type="button"
            onClick={onCloseMobile}
            aria-label="Tutup menu samping"
            className="min-h-[44px] min-w-[44px] rounded-xl flex items-center justify-center text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0F172A]"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        )}
      </div>

      <div className="mt-4">
        <button
          type="button"
          onClick={() => {
            onCloseMobile();
            onOpenAddTransaction();
          }}
          className="w-full h-11 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
          <span>Catat Transaksi</span>
        </button>
      </div>

      <nav aria-label="Menu samping Kemanain" className="mt-5 space-y-1 flex-1">
        {MENU_ITEMS.map(({ id, label, Icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => {
                onSelectTab(id);
                onCloseMobile();
              }}
              aria-current={isActive ? 'page' : undefined}
              className={`w-full min-h-[46px] px-3.5 rounded-xl flex items-center gap-3 text-sm font-semibold transition-colors ${
                isActive
                  ? 'bg-[#EFF6FF] text-[#2563EB]'
                  : 'text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0F172A]'
              }`}
            >
              <Icon className="w-[18px] h-[18px]" aria-hidden="true" />
              <span>{label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

export function SidebarDrawer({
  userName,
  activeTab,
  isDesktopOpen,
  isMobileOpen,
  onSelectTab,
  onCloseMobile,
  onOpenAddTransaction,
}: SidebarDrawerProps) {
  return (
    <>
      {/* Desktop Collapsible Sidebar */}
      {isDesktopOpen && (
        <aside
          aria-label="Sidebar Kemanain"
          className="hidden lg:block w-64 bg-white border-r border-[#E2E8F0] shrink-0"
        >
          <SidebarContent
            userName={userName}
            activeTab={activeTab}
            onSelectTab={onSelectTab}
            onCloseMobile={onCloseMobile}
            onOpenAddTransaction={onOpenAddTransaction}
            showCloseButton={false}
          />
        </aside>
      )}

      {/* Mobile Slide-Over Drawer */}
      {isMobileOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Menu samping"
          className="fixed inset-0 z-50 lg:hidden flex"
        >
          <div
            onClick={onCloseMobile}
            className="fixed inset-0 bg-[#0F172A]/40"
            aria-hidden="true"
          />
          <aside className="relative z-10 w-72 max-w-[82vw] bg-white border-r border-[#E2E8F0] h-full">
            <SidebarContent
              userName={userName}
              activeTab={activeTab}
              onSelectTab={onSelectTab}
              onCloseMobile={onCloseMobile}
              onOpenAddTransaction={onOpenAddTransaction}
              showCloseButton={true}
            />
          </aside>
        </div>
      )}
    </>
  );
}
