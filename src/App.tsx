import { useEffect, useState } from 'react';
import { SEED_TRANSACTIONS } from './data/seedTransactions';
import type { FinanceTransaction, NavTab } from './types/finance';
import { formatDateKey, getDaysInMonth } from './utils/finance';
import { AppTopBar } from './components/AppTopBar';
import { SidebarDrawer } from './components/SidebarDrawer';
import { BerandaTab } from './components/BerandaTab';
import { RiwayatTab } from './components/RiwayatTab';
import { StatistikTab } from './components/StatistikTab';
import { ProfilTab } from './components/ProfilTab';
import { MobileBottomNav } from './components/MobileBottomNav';
import { TransactionModalSheet } from './components/TransactionModalSheet';
import { TransactionDetailSheet } from './components/TransactionDetailSheet';

const USER_NAME = 'Raka Pratama';

export default function App() {
  const [transactions, setTransactions] = useState<FinanceTransaction[]>(SEED_TRANSACTIONS);
  const [activeTab, setActiveTab] = useState<NavTab>('beranda');
  const [focusedYear, setFocusedYear] = useState(2026);
  const [focusedMonth, setFocusedMonth] = useState(11);
  const [selectedDateKey, setSelectedDateKey] = useState('2026-11-19');
  const [monthlyBudget, setMonthlyBudget] = useState(4000000);

  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 1024 : true
  );
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [sheetInitialDate, setSheetInitialDate] = useState('2026-11-19');
  const [selectedTransaction, setSelectedTransaction] =
    useState<FinanceTransaction | null>(null);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const syncBreakpoint = () => setIsDesktop(mq.matches);
    syncBreakpoint();
    mq.addEventListener('change', syncBreakpoint);
    return () => mq.removeEventListener('change', syncBreakpoint);
  }, []);

  const handleToggleSidebar = () => {
    if (isDesktop) {
      setIsDesktopSidebarOpen((prev) => !prev);
    } else {
      setIsMobileSidebarOpen((prev) => !prev);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setFocusedYear(2026);
    setFocusedMonth(11);
    setSelectedDateKey('2026-11-19');
    setTimeout(() => {
      setIsRefreshing(false);
    }, 200);
  };

  const handleChangeMonth = (delta: number) => {
    let nextMonth = focusedMonth + delta;
    let nextYear = focusedYear;
    if (nextMonth < 1) {
      nextMonth = 12;
      nextYear -= 1;
    } else if (nextMonth > 12) {
      nextMonth = 1;
      nextYear += 1;
    }
    const maxDay = getDaysInMonth(nextYear, nextMonth);
    const currentDay = Number(selectedDateKey.split('-')[2] ?? 1);
    const safeDay = Math.min(currentDay, maxDay);

    setFocusedYear(nextYear);
    setFocusedMonth(nextMonth);
    setSelectedDateKey(formatDateKey(nextYear, nextMonth, safeDay));
  };

  const handleOpenAddSheet = (dateKey?: string) => {
    setSheetInitialDate(dateKey ?? selectedDateKey);
    setIsAddSheetOpen(true);
  };

  const handleAddTransaction = (newTx: FinanceTransaction) => {
    setTransactions((prev) => [newTx, ...prev]);
    const [y, m] = newTx.date.split('-').map(Number);
    if (y && m) {
      setFocusedYear(y);
      setFocusedMonth(m);
      setSelectedDateKey(newTx.date);
    }
    setIsAddSheetOpen(false);
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((item) => item.id !== id));
    setSelectedTransaction(null);
  };

  const handleResetDemoData = () => {
    setTransactions(SEED_TRANSACTIONS);
    setFocusedYear(2026);
    setFocusedMonth(11);
    setSelectedDateKey('2026-11-19');
    setMonthlyBudget(4000000);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col">
      <AppTopBar
        userName={USER_NAME}
        isSidebarOpen={isDesktop ? isDesktopSidebarOpen : isMobileSidebarOpen}
        isRefreshing={isRefreshing}
        onToggleSidebar={handleToggleSidebar}
        onRefresh={handleRefresh}
        onOpenBudgetSettings={() => setActiveTab('profil')}
        onOpenAddTransaction={() => handleOpenAddSheet(selectedDateKey)}
        onResetDemoData={handleResetDemoData}
      />

      <div className="flex-1 flex min-h-0">
        <SidebarDrawer
          userName={USER_NAME}
          activeTab={activeTab}
          isDesktopOpen={isDesktopSidebarOpen}
          isMobileOpen={isMobileSidebarOpen}
          onSelectTab={setActiveTab}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
          onOpenAddTransaction={() => handleOpenAddSheet(selectedDateKey)}
        />

        <main className="flex-1 min-w-0 pb-[68px] lg:pb-6">
          <div className="max-w-5xl mx-auto">
            {activeTab === 'beranda' && (
              <BerandaTab
                transactions={transactions}
                focusedYear={focusedYear}
                focusedMonth={focusedMonth}
                selectedDateKey={selectedDateKey}
                onChangeMonth={handleChangeMonth}
                onSelectDate={setSelectedDateKey}
                onOpenAddSheet={handleOpenAddSheet}
                onSelectTransaction={setSelectedTransaction}
              />
            )}
            {activeTab === 'riwayat' && (
              <div className="max-w-3xl mx-auto">
                <RiwayatTab
                  transactions={transactions}
                  onSelectTransaction={setSelectedTransaction}
                />
              </div>
            )}
            {activeTab === 'statistik' && (
              <div className="max-w-3xl mx-auto">
                <StatistikTab
                  transactions={transactions}
                  focusedYear={focusedYear}
                  focusedMonth={focusedMonth}
                  monthlyBudget={monthlyBudget}
                  onChangeMonth={handleChangeMonth}
                />
              </div>
            )}
            {activeTab === 'profil' && (
              <div className="max-w-3xl mx-auto">
                <ProfilTab
                  monthlyBudget={monthlyBudget}
                  onUpdateBudget={setMonthlyBudget}
                  onResetDemoData={handleResetDemoData}
                />
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Bottom Navigation Bar (Mobile) */}
      <div className="fixed bottom-0 left-0 right-0 z-30 lg:hidden">
        <MobileBottomNav activeTab={activeTab} onSelectTab={setActiveTab} />
      </div>

      {isAddSheetOpen && (
        <TransactionModalSheet
          initialDateKey={sheetInitialDate}
          onClose={() => setIsAddSheetOpen(false)}
          onSave={handleAddTransaction}
        />
      )}

      {selectedTransaction && (
        <TransactionDetailSheet
          transaction={selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
          onDelete={handleDeleteTransaction}
        />
      )}
    </div>
  );
}
