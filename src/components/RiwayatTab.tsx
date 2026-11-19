import { useState } from 'react';
import { Search, X } from 'lucide-react';
import type { FinanceTransaction, TransactionType } from '../types/finance';
import {
  filterTransactions,
  formatRupiah,
  getFullDateLabelId,
  groupTransactionsByDate,
} from '../utils/finance';
import { CategoryIcon } from './CategoryIcon';

interface RiwayatTabProps {
  transactions: FinanceTransaction[];
  onSelectTransaction: (tx: FinanceTransaction) => void;
}

export function RiwayatTab({ transactions, onSelectTransaction }: RiwayatTabProps) {
  const [typeFilter, setTypeFilter] = useState<'all' | TransactionType>('all');
  const [query, setQuery] = useState('');

  const filtered = filterTransactions(transactions, { typeFilter, query });
  const grouped = groupTransactionsByDate(filtered);

  return (
    <div className="px-5 pt-5 pb-6 space-y-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#0F172A]">Riwayat</h1>
        <p className="text-sm text-[#475569]">Semua catatan pemasukan dan pengeluaran</p>
      </div>

      {/* Pencarian & Segmented Filter */}
      <div className="space-y-3">
        <div className="relative">
          <Search
            className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari keterangan atau kategori..."
            aria-label="Cari transaksi"
            className="w-full h-11 pl-10 pr-10 rounded-xl bg-white border border-[#E2E8F0] text-sm text-[#0F172A] placeholder:text-[#64748B] focus:outline-none focus:border-[#2563EB]"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="Hapus pencarian"
              className="absolute right-1 top-1/2 -translate-y-1/2 min-h-[40px] min-w-[40px] flex items-center justify-center text-[#64748B] hover:text-[#0F172A]"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          )}
        </div>

        <div
          role="group"
          aria-label="Filter tipe transaksi"
          className="grid grid-cols-3 gap-1 p-1 bg-[#F1F5F9] rounded-xl"
        >
          {(
            [
              { id: 'all', label: 'Semua' },
              { id: 'expense', label: 'Pengeluaran' },
              { id: 'income', label: 'Pemasukan' },
            ] as const
          ).map((option) => {
            const active = typeFilter === option.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setTypeFilter(option.id)}
                aria-pressed={active}
                className={`min-h-[40px] px-3 rounded-[10px] text-xs font-semibold whitespace-nowrap transition-colors ${
                  active
                    ? 'bg-white text-[#0F172A] border border-[#E2E8F0]'
                    : 'text-[#475569] hover:text-[#0F172A]'
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Daftar Transaksi Dikelompokkan per Tanggal */}
      {grouped.length === 0 ? (
        <div className="bg-white border border-[#E2E8F0] rounded-2xl px-5 py-10 text-center">
          <p className="text-sm font-semibold text-[#0F172A]">Tidak ada transaksi ditemukan</p>
          <p className="text-xs text-[#64748B] mt-1">
            Coba ubah kata kunci pencarian atau filter tipe transaksi.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {grouped.map((group) => (
            <section key={group.dateKey} className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <h2 className="text-xs font-semibold text-[#64748B]">
                  {getFullDateLabelId(group.dateKey)}
                </h2>
                <span className="text-xs font-semibold text-[#475569] tabular-nums">
                  {group.dayExpense > 0 ? `- ${formatRupiah(group.dayExpense)}` : ''}
                  {group.dayExpense > 0 && group.dayIncome > 0 ? ' · ' : ''}
                  {group.dayIncome > 0 ? `+ ${formatRupiah(group.dayIncome)}` : ''}
                </span>
              </div>

              <div className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden">
                {group.items.map((tx, idx) => (
                  <button
                    key={tx.id}
                    type="button"
                    onClick={() => onSelectTransaction(tx)}
                    className={`w-full min-h-[64px] px-4 py-3.5 flex items-center gap-3 text-left hover:bg-[#F8FAFC] transition-colors ${
                      idx > 0 ? 'border-t border-[#F1F5F9]' : ''
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
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
