import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { FinanceTransaction } from '../types/finance';
import {
  formatRupiah,
  getCategoryBreakdown,
  getMonthLabelId,
  getMonthSummary,
} from '../utils/finance';
import { CategoryIcon } from './CategoryIcon';

interface StatistikTabProps {
  transactions: FinanceTransaction[];
  focusedYear: number;
  focusedMonth: number;
  monthlyBudget: number;
  onChangeMonth: (delta: number) => void;
}

export function StatistikTab({
  transactions,
  focusedYear,
  focusedMonth,
  monthlyBudget,
  onChangeMonth,
}: StatistikTabProps) {
  const monthSummary = getMonthSummary(transactions, focusedYear, focusedMonth);
  const breakdown = getCategoryBreakdown(transactions, focusedYear, focusedMonth, 'expense');

  const budgetUsagePct =
    monthlyBudget > 0
      ? Math.min(100, Math.round((monthSummary.expense / monthlyBudget) * 100))
      : 0;
  const isOverBudget = monthSummary.expense > monthlyBudget;

  return (
    <div className="px-5 pt-5 pb-6 space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0F172A]">Statistik</h1>
          <p className="text-sm text-[#475569]">Ringkasan kategori &amp; anggaran</p>
        </div>

        <div className="inline-flex items-center bg-white border border-[#E2E8F0] rounded-xl">
          <button
            type="button"
            onClick={() => onChangeMonth(-1)}
            aria-label="Bulan sebelumnya"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center text-[#475569] hover:text-[#0F172A] rounded-l-xl"
          >
            <ChevronLeft className="w-4 h-4" aria-hidden="true" />
          </button>
          <span className="px-1.5 text-sm font-semibold text-[#0F172A] whitespace-nowrap">
            {getMonthLabelId(focusedYear, focusedMonth)}
          </span>
          <button
            type="button"
            onClick={() => onChangeMonth(1)}
            aria-label="Bulan berikutnya"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center text-[#475569] hover:text-[#0F172A] rounded-r-xl"
          >
            <ChevronRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Kartu Target Anggaran Bulanan */}
      <section className="bg-white border border-[#E2E8F0] rounded-2xl p-5 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-[#0F172A]">
              Pemakaian Anggaran
            </h2>
            <p className="text-xs text-[#475569] mt-0.5 tabular-nums">
              {formatRupiah(monthSummary.expense)} dari target {formatRupiah(monthlyBudget)}
            </p>
          </div>
          <span
            className={`text-sm font-bold tabular-nums ${
              isOverBudget ? 'text-[#E11D48]' : 'text-[#2563EB]'
            }`}
          >
            {budgetUsagePct}%
          </span>
        </div>

        <div
          role="progressbar"
          aria-valuenow={budgetUsagePct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Persentase penggunaan anggaran bulanan"
          className="h-2.5 w-full bg-[#F1F5F9] rounded-full overflow-hidden"
        >
          <div
            className={`h-full rounded-full transition-all duration-200 ${
              isOverBudget ? 'bg-[#E11D48]' : 'bg-[#2563EB]'
            }`}
            style={{ width: `${budgetUsagePct}%` }}
          />
        </div>

        <div className="pt-2 grid grid-cols-2 gap-3 text-xs">
          <div className="bg-[#F8FAFC] rounded-xl p-3">
            <p className="text-[#64748B]">Total Pemasukan</p>
            <p className="mt-1 text-sm font-bold text-[#059669] tabular-nums">
              + {formatRupiah(monthSummary.income)}
            </p>
          </div>
          <div className="bg-[#F8FAFC] rounded-xl p-3">
            <p className="text-[#64748B]">Total Pengeluaran</p>
            <p className="mt-1 text-sm font-bold text-[#E11D48] tabular-nums">
              - {formatRupiah(monthSummary.expense)}
            </p>
          </div>
        </div>
      </section>

      {/* Kartu Pengeluaran per Kategori */}
      <section className="bg-white border border-[#E2E8F0] rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-[#0F172A]">
            Pengeluaran per Kategori
          </h2>
          <span className="text-xs font-semibold text-[#64748B]">
            {breakdown.length} kategori
          </span>
        </div>

        {breakdown.length === 0 ? (
          <p className="text-sm text-[#475569] py-4 text-center">
            Belum ada pengeluaran pada bulan ini.
          </p>
        ) : (
          <div className="space-y-4">
            {breakdown.map((item) => (
              <div key={item.category} className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-[#F1F5F9] text-[#0F172A] flex items-center justify-center shrink-0">
                      <CategoryIcon category={item.category} className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#0F172A] truncate">
                        {item.category}
                      </p>
                      <p className="text-xs text-[#64748B]">
                        {item.count} transaksi · {item.percentage}%
                      </p>
                    </div>
                  </div>

                  <span className="text-sm font-semibold text-[#0F172A] tabular-nums whitespace-nowrap">
                    {formatRupiah(item.amount)}
                  </span>
                </div>

                <div className="h-1.5 w-full bg-[#F1F5F9] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#2563EB] rounded-full"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
