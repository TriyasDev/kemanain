export type TransactionType = 'income' | 'expense';

export type ExpenseCategory =
  | 'Makanan & Minum'
  | 'Transportasi'
  | 'Belanja'
  | 'Tagihan'
  | 'Hiburan';

export type IncomeCategory = 'Gaji' | 'Freelance' | 'Investasi';

export type TransactionCategory = ExpenseCategory | IncomeCategory;

export interface FinanceTransaction {
  id: string;
  title: string;
  category: TransactionCategory;
  amount: number;
  type: TransactionType;
  date: string; // Format: YYYY-MM-DD
  note?: string;
}

export interface DaySummary {
  dateKey: string;
  income: number;
  expense: number;
  net: number;
  count: number;
}

export interface MonthSummary {
  year: number;
  month: number; // 1..12
  income: number;
  expense: number;
  net: number;
  transactionCount: number;
}

export interface CalendarCell {
  dateKey: string | null;
  dayNumber: number | null;
  income: number;
  expense: number;
  count: number;
}

export interface CategoryBreakdownItem {
  category: TransactionCategory;
  amount: number;
  percentage: number;
  count: number;
}

export type NavTab = 'beranda' | 'riwayat' | 'statistik' | 'profil';
