import { useState, type FormEvent } from 'react';
import { Check, RotateCcw, User } from 'lucide-react';
import { formatRupiah } from '../utils/finance';

interface ProfilTabProps {
  monthlyBudget: number;
  onUpdateBudget: (newBudget: number) => void;
  onResetDemoData: () => void;
}

export function ProfilTab({
  monthlyBudget,
  onUpdateBudget,
  onResetDemoData,
}: ProfilTabProps) {
  const [budgetInput, setBudgetInput] = useState(String(monthlyBudget));
  const [savedNotice, setSavedNotice] = useState(false);
  const [budgetError, setBudgetError] = useState<string | null>(null);

  const handleSaveBudget = (e: FormEvent) => {
    e.preventDefault();
    const parsed = Number(budgetInput.replace(/\D/g, ''));
    if (!Number.isFinite(parsed) || parsed < 100000) {
      setBudgetError('Masukkan target anggaran minimal Rp 100.000.');
      return;
    }
    setBudgetError(null);
    onUpdateBudget(parsed);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 1800);
  };

  return (
    <div className="px-5 pt-5 pb-6 space-y-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#0F172A]">Profil</h1>
        <p className="text-sm text-[#475569]">Pengaturan akun &amp; preferensi tema</p>
      </div>

      {/* Kartu Info Pengguna */}
      <section className="bg-white border border-[#E2E8F0] rounded-2xl p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shrink-0">
          <User className="w-6 h-6" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <h2 className="text-base font-semibold text-[#0F172A] truncate">
            Raka Pratama
          </h2>
          <p className="text-xs text-[#475569] mt-0.5">
            Akun Pribadi · Mata Uang IDR (Rp)
          </p>
        </div>
      </section>

      {/* Kartu Pengaturan Target Anggaran */}
      <section className="bg-white border border-[#E2E8F0] rounded-2xl p-5 space-y-4">
        <div>
          <h2 className="text-base font-semibold text-[#0F172A]">
            Target Anggaran Bulanan
          </h2>
          <p className="text-xs text-[#475569] mt-0.5">
            Saat ini: <span className="font-semibold tabular-nums">{formatRupiah(monthlyBudget)}</span>
          </p>
        </div>

        <form onSubmit={handleSaveBudget} className="space-y-3">
          <div>
            <label
              htmlFor="budget-input"
              className="block text-xs font-semibold text-[#475569] mb-1.5"
            >
              Nominal Target (Rp)
            </label>
            <input
              id="budget-input"
              type="text"
              inputMode="numeric"
              value={budgetInput}
              onChange={(e) => setBudgetInput(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl bg-white border border-[#E2E8F0] text-sm font-semibold text-[#0F172A] tabular-nums focus:outline-none focus:border-[#2563EB]"
            />
            {budgetError && (
              <p className="mt-1.5 text-xs text-[#E11D48]">{budgetError}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full h-12 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors"
          >
            {savedNotice ? (
              <>
                <Check className="w-4 h-4" aria-hidden="true" />
                <span>Target Disimpan</span>
              </>
            ) : (
              <span>Simpan Target Anggaran</span>
            )}
          </button>
        </form>
      </section>

      {/* Kartu Sistem Tema 60-30-10 */}
      <section className="bg-white border border-[#E2E8F0] rounded-2xl p-5 space-y-3">
        <h2 className="text-base font-semibold text-[#0F172A]">Sistem Tema Kemanain</h2>
        <p className="text-xs text-[#475569] leading-relaxed">
          Material Design 3 Light Mode dengan komposisi warna 60-30-10, sudut kartu 16px,
          border 1px #E2E8F0, dan aksen Biru Elektrik #2563EB.
        </p>

        <div className="grid grid-cols-2 gap-2.5 pt-1 text-xs">
          <div className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-[#F8FAFC] border border-[#CBD5E1]" />
              <span className="font-semibold text-[#0F172A]">60% Latar</span>
            </div>
            <p className="mt-1 font-mono-num text-[#64748B]">#F8FAFC</p>
          </div>
          <div className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-white border border-[#CBD5E1]" />
              <span className="font-semibold text-[#0F172A]">30% Kartu</span>
            </div>
            <p className="mt-1 font-mono-num text-[#64748B]">#FFFFFF</p>
          </div>
          <div className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-[#2563EB]" />
              <span className="font-semibold text-[#0F172A]">10% Aksen</span>
            </div>
            <p className="mt-1 font-mono-num text-[#64748B]">#2563EB</p>
          </div>
          <div className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-[#0F172A]" />
              <span className="font-semibold text-[#0F172A]">Teks Utama</span>
            </div>
            <p className="mt-1 font-mono-num text-[#64748B]">#0F172A</p>
          </div>
        </div>
      </section>

      <button
        type="button"
        onClick={onResetDemoData}
        className="w-full h-12 rounded-xl bg-white border border-[#E2E8F0] hover:bg-[#F8FAFC] text-sm font-semibold text-[#475569] inline-flex items-center justify-center gap-2 transition-colors"
      >
        <RotateCcw className="w-4 h-4" aria-hidden="true" />
        <span>Reset Data Dummy Awal</span>
      </button>
    </div>
  );
}
