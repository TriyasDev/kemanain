import { useEffect, useRef, useState } from 'react';
import {
  Menu,
  MoreVertical,
  Plus,
  RefreshCw,
  RotateCcw,
  SlidersHorizontal,
} from 'lucide-react';

interface AppTopBarProps {
  userName: string;
  isSidebarOpen: boolean;
  isRefreshing: boolean;
  onToggleSidebar: () => void;
  onRefresh: () => void;
  onOpenBudgetSettings: () => void;
  onOpenAddTransaction: () => void;
  onResetDemoData: () => void;
}

export function AppTopBar({
  userName,
  isSidebarOpen,
  isRefreshing,
  onToggleSidebar,
  onRefresh,
  onOpenBudgetSettings,
  onOpenAddTransaction,
  onResetDemoData,
}: AppTopBarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isMenuOpen) return;

    const handleOutsideClick = (event: MouseEvent) => {
      if (
        menuContainerRef.current &&
        !menuContainerRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMenuOpen]);

  return (
    <header className="sticky top-0 z-40 h-14 bg-white border-b border-[#E2E8F0] px-3 sm:px-5 flex items-center justify-between gap-3 shrink-0">
      {/* Kiri: Hamburger Sidebar + Nama Pengguna */}
      <div className="flex items-center gap-2 min-w-0">
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label={isSidebarOpen ? 'Tutup menu samping' : 'Buka menu samping'}
          aria-expanded={isSidebarOpen}
          className="min-h-[44px] min-w-[44px] rounded-xl flex items-center justify-center text-[#0F172A] hover:bg-[#F8FAFC] transition-colors focus-visible:outline-2 focus-visible:outline-[#2563EB]"
        >
          <Menu className="w-5 h-5" aria-hidden="true" />
        </button>

        <div className="min-w-0 flex items-center gap-2">
          <span
            data-testid="navbar-user-name"
            className="text-[15px] font-bold tracking-tight text-[#0F172A] truncate"
          >
            {userName}
          </span>
          <span
            aria-hidden="true"
            className="hidden sm:inline text-xs text-[#64748B]"
          >
            ·
          </span>
          <span className="hidden sm:inline text-xs font-medium text-[#64748B] whitespace-nowrap">
            Kemanain
          </span>
        </div>
      </div>

      {/* Kanan: Refresh + Titik 3 Setting */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          type="button"
          onClick={onRefresh}
          aria-label="Segarkan data"
          className="min-h-[44px] min-w-[44px] rounded-xl flex items-center justify-center text-[#475569] hover:text-[#0F172A] hover:bg-[#F8FAFC] transition-colors focus-visible:outline-2 focus-visible:outline-[#2563EB]"
        >
          <RefreshCw
            className={`w-[18px] h-[18px] transition-transform duration-200 ${
              isRefreshing ? 'rotate-180 text-[#2563EB]' : ''
            }`}
            aria-hidden="true"
          />
        </button>

        <div ref={menuContainerRef} className="relative">
          <button
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-label="Menu pengaturan"
            aria-haspopup="menu"
            aria-expanded={isMenuOpen}
            className="min-h-[44px] min-w-[44px] rounded-xl flex items-center justify-center text-[#475569] hover:text-[#0F172A] hover:bg-[#F8FAFC] transition-colors focus-visible:outline-2 focus-visible:outline-[#2563EB]"
          >
            <MoreVertical className="w-5 h-5" aria-hidden="true" />
          </button>

          {isMenuOpen && (
            <div
              role="menu"
              aria-label="Opsi pengaturan"
              className="absolute right-0 mt-1.5 w-56 bg-white border border-[#E2E8F0] rounded-2xl py-1.5 z-50"
            >
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setIsMenuOpen(false);
                  onOpenAddTransaction();
                }}
                className="w-full min-h-[44px] px-4 py-2 text-left text-sm font-medium text-[#0F172A] hover:bg-[#F8FAFC] flex items-center gap-2.5"
              >
                <Plus className="w-4 h-4 text-[#2563EB]" aria-hidden="true" />
                <span>Catat Transaksi</span>
              </button>

              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setIsMenuOpen(false);
                  onOpenBudgetSettings();
                }}
                className="w-full min-h-[44px] px-4 py-2 text-left text-sm font-medium text-[#0F172A] hover:bg-[#F8FAFC] flex items-center gap-2.5"
              >
                <SlidersHorizontal
                  className="w-4 h-4 text-[#475569]"
                  aria-hidden="true"
                />
                <span>Atur Target Anggaran</span>
              </button>

              <div className="my-1 border-t border-[#F1F5F9]" />

              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setIsMenuOpen(false);
                  onResetDemoData();
                }}
                className="w-full min-h-[44px] px-4 py-2 text-left text-sm font-medium text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0F172A] flex items-center gap-2.5"
              >
                <RotateCcw className="w-4 h-4" aria-hidden="true" />
                <span>Reset Data Demo</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
