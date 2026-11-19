import {
  ArrowDownLeft,
  ArrowUpRight,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Plus,
} from 'lucide-react';
import type { FinanceTransaction } from '../types/finance';
import {
  formatCompactNominal,
  formatRupiah,
  getDaySummary,
  getFullDateLabelId,
  getMonthCalendarGrid,
  getMonthLabelId,
  getMonthSummary,
} from '../utils/finance';
import { CategoryIcon } from './CategoryIcon';

interface BerandaTabProps {
  transactions: FinanceTransaction[];
  focusedYear: number;
  focusedMonth: number;
  selectedDateKey: string;
  onChangeMonth: (delta: number) => void;
  onSelectDate: (dateKey: string) => void;
  onOpenAddSheet: (dateKey?: string) => void;
  onSelectTransaction: (tx: FinanceTransaction) => void;
}

const DAY_LABELS = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];

export function BerandaTab({
  transactions,
  focusedYear,
  focusedMonth,
  selectedDateKey,
  onChangeMonth,
  onSelectDate,
  onOpenAddSheet,
  onSelectTransaction,
}: BerandaTabProps) {
  const monthSummary = getMonthSummary(transactions, focusedYear, focusedMonth);
  const calendarCells = getMonthCalendarGrid(transactions, focusedYear, focusedMonth);
  const daySummary = getDaySummary(transactions, selectedDateKey);
  const dayTransactions = transactions.filter((tx) => tx.date === selectedDateKey);

  return (
    <div className="px-4 sm:px-6 lg:px-8 pt-5 pb-6 space-y-5">
      {/* Header Halaman + Pemilih Bulan */}
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-[22px] sm:text-2xl font-bold tracking-tight text-[#0F172A] leading-tight">
            Kemanain
          </h1>
          <p className="text-xs sm:text-sm text-[#475569] truncate">Arus kas harianmu</p>
        </div>

        <div className="inline-flex items-center bg-white border border-[#E2E8F0] rounded-xl shrink-0">
          <button
            type="button"
            onClick={() => onChangeMonth(-1)}
            aria-label="Bulan sebelumnya"
            className="min-h-[44px] min-w-[40px] flex items-center justify-center text-[#475569] hover:text-[#0F172A] transition-colors rounded-l-xl focus-visible:outline-2 focus-visible:outline-[#2563EB]"
          >
            <ChevronLeft className="w-4 h-4" aria-hidden="true" />
          </button>
          <span className="px-1.5 text-xs sm:text-sm font-semibold text-[#0F172A] whitespace-nowrap">
            {getMonthLabelId(focusedYear, focusedMonth)}
          </span>
          <button
            type="button"
            onClick={() => onChangeMonth(1)}
            aria-label="Bulan berikutnya"
            className="min-h-[44px] min-w-[40px] flex items-center justify-center text-[#475569] hover:text-[#0F172A] transition-colors rounded-r-xl focus-visible:outline-2 focus-visible:outline-[#2563EB]"
          >
            <ChevronRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="space-y-5 lg:grid lg:grid-cols-12 lg:gap-6 lg:space-y-0 lg:items-start">
        {/* Kolom Kiri Desktop: Ringkasan + Kalender */}
        <div className="space-y-4 lg:col-span-7">
          {/* Kartu Ringkasan Bulan Ini */}
          <section
            aria-label="Ringkasan Bulan Ini"
            className="bg-white border border-[#E2E8F0] rounded-2xl p-4 sm:p-5"
          >
            <p className="text-xs font-medium text-[#475569]">Selisih Kas Bulan Ini</p>
            <p
              data-testid="month-net-total"
              className="mt-0.5 text-2xl sm:text-[26px] font-bold tracking-tight text-[#0F172A] tabular-nums"
            >
              {monthSummary.net < 0 ? '- ' : ''}
              {formatRupiah(monthSummary.net)}
            </p>

            <div className="mt-3 bg-[#F8FAFC] rounded-xl p-3 grid grid-cols-2 gap-3">
              <div className="pr-3 border-r border-[#E2E8F0]">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#64748B]">
                  <ArrowDownLeft className="w-3.5 h-3.5 text-[#059669]" aria-hidden="true" />
                  <span>Pemasukan</span>
                </div>
                <p
                  data-testid="month-income-total"
                  className="mt-0.5 text-sm font-bold text-[#059669] tabular-nums"
                >
                  + {formatRupiah(monthSummary.income)}
                </p>
              </div>

              <div className="pl-1">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#64748B]">
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#E11D48]" aria-hidden="true" />
                  <span>Pengeluaran</span>
                </div>
                <p
                  data-testid="month-expense-total"
                  className="mt-0.5 text-sm font-bold text-[#E11D48] tabular-nums"
                >
                  - {formatRupiah(monthSummary.expense)}
                </p>
              </div>
            </div>
          </section>

          {/* Kartu Kalender Harian */}
          <section
            aria-label="Kalender Pengeluaran Harian"
            className="bg-white border border-[#E2E8F0] rounded-2xl p-4 sm:p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[15px] font-semibold text-[#0F172A]">Kalender Harian</h2>
              <span className="text-xs font-semibold text-[#64748B]">Ketuk tanggal</span>
            </div>

            <div className="grid grid-cols-7 gap-1 sm:gap-1.5 mb-1.5">
              {DAY_LABELS.map((day) => (
                <div
                  key={day}
                  className="text-center text-[11px] font-semibold text-[#64748B] py-0.5"
                >
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
              {calendarCells.map((cell, idx) => {
                if (!cell.dateKey || !cell.dayNumber) {
                  return (
                    <div
                      key={`empty-${idx}`}
                      className="min-h-[46px] sm:min-h-[54px]"
                      aria-hidden="true"
                    />
                  );
                }

                const isSelected = cell.dateKey === selectedDateKey;
                const hasExpense = cell.expense > 0;
                const hasIncome = cell.income > 0;

                return (
                  <button
                    key={cell.dateKey}
                    type="button"
                    onClick={() => onSelectDate(cell.dateKey!)}
                    aria-pressed={isSelected}
                    aria-label={`${getFullDateLabelId(cell.dateKey)}${
                      hasExpense ? `, pengeluaran ${formatRupiah(cell.expense)}` : ''
                    }${hasIncome ? `, pemasukan ${formatRupiah(cell.income)}` : ''}`}
                    className={`min-h-[46px] sm:min-h-[54px] rounded-[10px] px-0.5 py-1 sm:py-1.5 flex flex-col items-center justify-between border transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-[#2563EB] ${
                      isSelected
                        ? 'bg-[#EFF6FF] border-[#2563EB]'
                        : 'bg-[#F8FAFC] border-transparent hover:border-[#CBD5E1]'
                    }`}
                  >
                    <span
                      className={`text-xs leading-none tabular-nums ${
                        isSelected
                          ? 'font-bold text-[#2563EB]'
                          : 'font-semibold text-[#0F172A]'
                      }`}
                    >
                      {cell.dayNumber}
                    </span>

                    <div className="flex flex-col items-center gap-0.5 w-full">
                      {hasExpense && (
                        <span className="text-[9.5px] sm:text-[10px] leading-none tracking-tight font-semibold text-[#E11D48] tabular-nums whitespace-nowrap">
                          -{formatCompactNominal(cell.expense)}
                        </span>
                      )}
                      {hasIncome && (
                        <span className="text-[9.5px] sm:text-[10px] leading-none tracking-tight font-semibold text-[#059669] tabular-nums whitespace-nowrap">
                          +{formatCompactNominal(cell.income)}
                        </span>
                      )}
                      {!hasExpense && !hasIncome && (
                        <span className="text-[9.5px] leading-none text-transparent select-none">
                          0
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        {/* Kolom Kanan Desktop: Tombol Catat + Catatan Tanggal Terpilih */}
        <div className="space-y-4 lg:col-span-5">
          {/* Tombol Aksi Utama (radius 12px, tinggi 48px) */}
          <button
            type="button"
            onClick={() => onOpenAddSheet(selectedDateKey)}
            className="w-full h-12 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] active:scale-[0.99] text-white font-semibold text-[15px] inline-flex items-center justify-center gap-2 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB]"
          >
            <Plus className="w-5 h-5" aria-hidden="true" />
            <span className="whitespace-nowrap">Catat Transaksi</span>
          </button>

          {/* Daftar Catatan Hari Terpilih */}
          <section aria-label="Catatan Tanggal Terpilih" className="space-y-3">
            <div className="flex items-end justify-between gap-2">
              <div>
                <h2
                  data-testid="selected-date-heading"
                  className="text-base font-semibold text-[#0F172A]"
                >
                  {getFullDateLabelId(selectedDateKey)}
                </h2>
                <p className="text-xs text-[#475569] mt-0.5 tabular-nums">
                  Masuk +{formatCompactNominal(daySummary.income)} · Keluar -
                  {formatCompactNominal(daySummary.expense)}
                </p>
              </div>
              <span className="text-xs font-semibold text-[#64748B] whitespace-nowrap">
                {dayTransactions.length} item
              </span>
            </div>

            {dayTransactions.length === 0 ? (
              <div className="bg-white border border-[#E2E8F0] rounded-2xl px-5 py-7 text-center">
                <CalendarDays
                  className="w-7 h-7 text-[#64748B] mx-auto mb-2.5"
                  aria-hidden="true"
                />
                <p className="text-sm text-[#475569]">
                  Belum ada catatan keuangan pada tanggal ini.
                </p>
                <button
                  type="button"
                  onClick={() => onOpenAddSheet(selectedDateKey)}
                  className="mt-3 min-h-[44px] px-4 rounded-xl border border-[#E2E8F0] text-sm font-semibold text-[#2563EB] hover:bg-[#EFF6FF] transition-colors"
                >
                  Catat di tanggal ini
                </button>
              </div>
            ) : (
              <div className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden">
                {dayTransactions.map((tx, index) => (
                  <button
                    key={tx.id}
                    type="button"
                    onClick={() => onSelectTransaction(tx)}
                    className={`w-full min-h-[64px] px-4 py-3.5 flex items-center gap-3 text-left hover:bg-[#F8FAFC] transition-colors focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#2563EB] ${
                      index > 0 ? 'border-t border-[#F1F5F9]' : ''
                    }`}
                  >
                    <div className="w-10 h-10 rounded-[10px] bg-[#F1F5F9] text-[#0F172A] flex items-center justify-center shrink-0">
                      <CategoryIcon category={tx.category} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-[15px] font-semibold text-[#0F172A] truncate">
                        {tx.title}
                      </p>
                      <p className="text-xs text-[#475569] mt-0.5 truncate">
                        {tx.category}
                      </p>
                    </div>

                    <span
                      className={`text-sm font-semibold tabular-nums whitespace-nowrap shrink-0 ${
                        tx.type === 'income' ? 'text-[#059669]' : 'text-[#0F172A]'
                      }`}
                    >
                      {tx.type === 'income' ? '+' : '-'} {formatRupiah(tx.amount)}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
