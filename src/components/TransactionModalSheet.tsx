import { useState, type FormEvent } from 'react';
import { ArrowDownLeft, ArrowUpRight, X } from 'lucide-react';
import type {
  ExpenseCategory,
  FinanceTransaction,
  IncomeCategory,
  TransactionCategory,
  TransactionType,
} from '../types/finance';

interface TransactionModalSheetProps {
  initialDateKey: string;
  onClose: () => void;
  onSave: (tx: FinanceTransaction) => void;
}

const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  'Makanan & Minum',
  'Transportasi',
  'Belanja',
  'Tagihan',
  'Hiburan',
];

const INCOME_CATEGORIES: IncomeCategory[] = [
  'Gaji',
  'Freelance',
  'Investasi',
];

const QUICK_PRESETS = [25000, 50000, 100000, 250000];

export function TransactionModalSheet({
  initialDateKey,
  onClose,
  onSave,
}: TransactionModalSheetProps) {
  const [type, setType] = useState<TransactionType>('expense');
  const [amountInput, setAmountInput] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<TransactionCategory>('Makanan & Minum');
  const [date, setDate] = useState(initialDateKey);
  const [note, setNote] = useState('');
  const [error, setError] = useState<string | null>(null);

  const availableCategories =
    type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  const handleTypeChange = (nextType: TransactionType) => {
    setType(nextType);
    setCategory(
      nextType === 'expense' ? EXPENSE_CATEGORIES[0] : INCOME_CATEGORIES[0]
    );
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const numericAmount = Number(amountInput.replace(/\D/g, ''));
    const cleanTitle = title.trim();

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      setError('Masukkan nominal transaksi lebih dari Rp 0.');
      return;
    }
    if (!cleanTitle) {
      setError('Masukkan keterangan transaksi terlebih dahulu.');
      return;
    }
    if (!date) {
      setError('Pilih tanggal transaksi.');
      return;
    }

    onSave({
      id: `tx-${Date.now()}`,
      title: cleanTitle,
      category,
      amount: numericAmount,
      type,
      date,
      note: note.trim() || undefined,
    });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-tx-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#0F172A]/45"
    >
      <div className="w-full max-w-[440px] bg-white rounded-t-3xl sm:rounded-2xl border border-[#E2E8F0] px-6 pt-3 pb-6 max-h-[90vh] overflow-y-auto">
        {/* Handle bar */}
        <div
          className="w-10 h-1 bg-[#E2E8F0] rounded-full mx-auto mb-4 sm:hidden"
          aria-hidden="true"
        />

        <div className="flex items-center justify-between mb-4">
          <h2 id="add-tx-title" className="text-lg font-bold text-[#0F172A]">
            Catat Transaksi
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup form catatan"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0F172A]"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Segmented Type Selector */}
          <div
            role="group"
            aria-label="Jenis transaksi"
            className="grid grid-cols-2 gap-1 p-1 bg-[#F1F5F9] rounded-xl"
          >
            <button
              type="button"
              onClick={() => handleTypeChange('expense')}
              aria-pressed={type === 'expense'}
              className={`min-h-[42px] rounded-[10px] text-sm font-semibold inline-flex items-center justify-center gap-1.5 transition-colors ${
                type === 'expense'
                  ? 'bg-white text-[#E11D48] border border-[#E2E8F0]'
                  : 'text-[#475569] hover:text-[#0F172A]'
              }`}
            >
              <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
              <span>Pengeluaran</span>
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange('income')}
              aria-pressed={type === 'income'}
              className={`min-h-[42px] rounded-[10px] text-sm font-semibold inline-flex items-center justify-center gap-1.5 transition-colors ${
                type === 'income'
                  ? 'bg-white text-[#059669] border border-[#E2E8F0]'
                  : 'text-[#475569] hover:text-[#0F172A]'
              }`}
            >
              <ArrowDownLeft className="w-4 h-4" aria-hidden="true" />
              <span>Pemasukan</span>
            </button>
          </div>

          {/* Nominal */}
          <div>
            <label
              htmlFor="tx-amount"
              className="block text-xs font-semibold text-[#475569] mb-1.5"
            >
              Nominal (Rp)
            </label>
            <input
              id="tx-amount"
              type="text"
              inputMode="numeric"
              value={amountInput}
              onChange={(e) => setAmountInput(e.target.value.replace(/[^\d]/g, ''))}
              placeholder="Contoh: 45000"
              className="w-full h-12 px-4 rounded-xl bg-white border border-[#E2E8F0] text-base font-bold text-[#0F172A] tabular-nums focus:outline-none focus:border-[#2563EB]"
            />

            <div className="mt-2 grid grid-cols-4 gap-1.5">
              {QUICK_PRESETS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setAmountInput(String(preset))}
                  className="min-h-[36px] rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#2563EB] text-xs font-semibold text-[#475569] hover:text-[#2563EB] tabular-nums transition-colors"
                >
                  {preset / 1000}rb
                </button>
              ))}
            </div>
          </div>

          {/* Keterangan */}
          <div>
            <label
              htmlFor="tx-title"
              className="block text-xs font-semibold text-[#475569] mb-1.5"
            >
              Keterangan
            </label>
            <input
              id="tx-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Kopi Susu Gula Aren"
              className="w-full h-11 px-4 rounded-xl bg-white border border-[#E2E8F0] text-sm text-[#0F172A] focus:outline-none focus:border-[#2563EB]"
            />
          </div>

          {/* Kategori & Tanggal */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="tx-category"
                className="block text-xs font-semibold text-[#475569] mb-1.5"
              >
                Kategori
              </label>
              <select
                id="tx-category"
                value={category}
                onChange={(e) => setCategory(e.target.value as TransactionCategory)}
                className="w-full h-11 px-3 rounded-xl bg-white border border-[#E2E8F0] text-sm text-[#0F172A] focus:outline-none focus:border-[#2563EB]"
              >
                {availableCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="tx-date"
                className="block text-xs font-semibold text-[#475569] mb-1.5"
              >
                Tanggal
              </label>
              <input
                id="tx-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-white border border-[#E2E8F0] text-sm text-[#0F172A] tabular-nums focus:outline-none focus:border-[#2563EB]"
              />
            </div>
          </div>

          {/* Catatan Opsional */}
          <div>
            <label
              htmlFor="tx-note"
              className="block text-xs font-semibold text-[#475569] mb-1.5"
            >
              Catatan Tambahan (Opsional)
            </label>
            <input
              id="tx-note"
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Misal: Bayar pakai QRIS"
              className="w-full h-11 px-4 rounded-xl bg-white border border-[#E2E8F0] text-sm text-[#0F172A] focus:outline-none focus:border-[#2563EB]"
            />
          </div>

          {error && (
            <p role="alert" className="text-xs font-semibold text-[#E11D48]">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full h-12 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-[15px] font-semibold transition-colors"
          >
            Simpan Transaksi
          </button>
        </form>
      </div>
    </div>
  );
}
