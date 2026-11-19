import { Trash2, X } from 'lucide-react';
import type { FinanceTransaction } from '../types/finance';
import { formatRupiah, getFullDateLabelId } from '../utils/finance';
import { CategoryIcon } from './CategoryIcon';

interface TransactionDetailSheetProps {
  transaction: FinanceTransaction;
  onClose: () => void;
  onDelete: (id: string) => void;
}

export function TransactionDetailSheet({
  transaction,
  onClose,
  onDelete,
}: TransactionDetailSheetProps) {
  const isIncome = transaction.type === 'income';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="detail-tx-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#0F172A]/45"
    >
      <div className="w-full max-w-[440px] bg-white rounded-t-3xl sm:rounded-2xl border border-[#E2E8F0] px-6 pt-3 pb-7">
        <div
          className="w-10 h-1 bg-[#E2E8F0] rounded-full mx-auto mb-4 sm:hidden"
          aria-hidden="true"
        />

        <div className="flex items-start justify-between gap-3 mb-5">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                isIncome
                  ? 'bg-[#ECFDF5] text-[#059669]'
                  : 'bg-[#FFF1F2] text-[#E11D48]'
              }`}
            >
              <CategoryIcon category={transaction.category} />
            </div>
            <div className="min-w-0">
              <h2
                id="detail-tx-title"
                className="text-base font-bold text-[#0F172A] truncate"
              >
                {transaction.title}
              </h2>
              <p className="text-xs text-[#475569] mt-0.5">
                {transaction.category} · {getFullDateLabelId(transaction.date)}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup detail transaksi"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0F172A]"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4 flex items-center justify-between gap-3">
          <span className="text-sm text-[#475569]">
            {isIncome ? 'Pemasukan' : 'Pengeluaran'}
          </span>
          <span
            className={`text-xl font-bold tabular-nums ${
              isIncome ? 'text-[#059669]' : 'text-[#E11D48]'
            }`}
          >
            {isIncome ? '+' : '-'} {formatRupiah(transaction.amount)}
          </span>
        </div>

        {transaction.note && (
          <div className="mt-4">
            <p className="text-xs font-semibold text-[#64748B]">Catatan</p>
            <p className="mt-1 text-sm text-[#0F172A]">{transaction.note}</p>
          </div>
        )}

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onClose}
            className="h-12 rounded-xl border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] text-sm font-semibold text-[#0F172A] transition-colors"
          >
            Tutup
          </button>
          <button
            type="button"
            onClick={() => onDelete(transaction.id)}
            className="h-12 rounded-xl border border-[#FECDD3] bg-[#FFF1F2] hover:bg-[#FFE4E6] text-sm font-semibold text-[#E11D48] inline-flex items-center justify-center gap-2 transition-colors"
          >
            <Trash2 className="w-4 h-4" aria-hidden="true" />
            <span>Hapus</span>
          </button>
        </div>
      </div>
    </div>
  );
}
