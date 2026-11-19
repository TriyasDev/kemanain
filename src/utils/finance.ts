import type {
  CalendarCell,
  CategoryBreakdownItem,
  DaySummary,
  FinanceTransaction,
  MonthSummary,
  TransactionCategory,
  TransactionType,
} from '../types/finance';

const MONTH_NAMES_ID = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];

const SHORT_MONTH_NAMES_ID = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'Mei',
  'Jun',
  'Jul',
  'Agu',
  'Sep',
  'Okt',
  'Nov',
  'Des',
];

const DAY_NAMES_ID = [
  'Minggu',
  'Senin',
  'Selasa',
  'Rabu',
  'Kamis',
  'Jumat',
  'Sabtu',
];

export function formatRupiah(amount: number): string {
  const abs = Math.abs(Math.round(amount));
  const formatted = abs.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `Rp ${formatted}`;
}

export function formatCompactNominal(amount: number): string {
  const abs = Math.abs(Math.round(amount));
  if (abs >= 1_000_000) {
    const jt = abs / 1_000_000;
    const label = Number.isInteger(jt) ? jt.toFixed(0) : jt.toFixed(1).replace('.', ',');
    return `${label}jt`;
  }
  if (abs >= 1_000) {
    return `${Math.round(abs / 1_000)}rb`;
  }
  return `${abs}`;
}

export function formatDateKey(year: number, month: number, day: number): string {
  const m = String(month).padStart(2, '0');
  const d = String(day).padStart(2, '0');
  return `${year}-${m}-${d}`;
}

export function parseDateKey(dateKey: string): { year: number; month: number; day: number } {
  const [y, m, d] = dateKey.split('-').map(Number);
  return { year: y, month: m, day: d };
}

export function getMonthLabelId(year: number, month: number): string {
  return `${MONTH_NAMES_ID[month - 1]} ${year}`;
}

export function getFullDateLabelId(dateKey: string): string {
  const { year, month, day } = parseDateKey(dateKey);
  const dateObj = new Date(Date.UTC(year, month - 1, day));
  const weekday = DAY_NAMES_ID[dateObj.getUTCDay()];
  return `${weekday}, ${day} ${SHORT_MONTH_NAMES_ID[month - 1]} ${year}`;
}

export function getDaysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

export function getDaySummary(
  transactions: FinanceTransaction[],
  dateKey: string
): DaySummary {
  let income = 0;
  let expense = 0;
  let count = 0;

  for (const tx of transactions) {
    if (tx.date !== dateKey) continue;
    count += 1;
    if (tx.type === 'income') income += tx.amount;
    else expense += tx.amount;
  }

  return {
    dateKey,
    income,
    expense,
    net: income - expense,
    count,
  };
}

export function getMonthSummary(
  transactions: FinanceTransaction[],
  year: number,
  month: number
): MonthSummary {
  const prefix = `${year}-${String(month).padStart(2, '0')}-`;
  let income = 0;
  let expense = 0;
  let transactionCount = 0;

  for (const tx of transactions) {
    if (!tx.date.startsWith(prefix)) continue;
    transactionCount += 1;
    if (tx.type === 'income') income += tx.amount;
    else expense += tx.amount;
  }

  return {
    year,
    month,
    income,
    expense,
    net: income - expense,
    transactionCount,
  };
}

/**
 * Generates a Monday-first 7-column calendar grid for the given year and month (1..12).
 */
export function getMonthCalendarGrid(
  transactions: FinanceTransaction[],
  year: number,
  month: number
): CalendarCell[] {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayUtc = new Date(Date.UTC(year, month - 1, 1)).getUTCDay();
  // Convert Sunday=0..Saturday=6 into Monday=0..Sunday=6
  const leadingEmpty = (firstDayUtc + 6) % 7;
  const totalCells = Math.ceil((leadingEmpty + daysInMonth) / 7) * 7;

  const dailyMap = new Map<string, { income: number; expense: number; count: number }>();
  const prefix = `${year}-${String(month).padStart(2, '0')}-`;

  for (const tx of transactions) {
    if (!tx.date.startsWith(prefix)) continue;
    const current = dailyMap.get(tx.date) ?? { income: 0, expense: 0, count: 0 };
    current.count += 1;
    if (tx.type === 'income') current.income += tx.amount;
    else current.expense += tx.amount;
    dailyMap.set(tx.date, current);
  }

  const cells: CalendarCell[] = [];
  for (let i = 0; i < totalCells; i++) {
    const dayNumber = i - leadingEmpty + 1;
    if (dayNumber < 1 || dayNumber > daysInMonth) {
      cells.push({
        dateKey: null,
        dayNumber: null,
        income: 0,
        expense: 0,
        count: 0,
      });
    } else {
      const dateKey = formatDateKey(year, month, dayNumber);
      const totals = dailyMap.get(dateKey) ?? { income: 0, expense: 0, count: 0 };
      cells.push({
        dateKey,
        dayNumber,
        income: totals.income,
        expense: totals.expense,
        count: totals.count,
      });
    }
  }

  return cells;
}

export function filterTransactions(
  transactions: FinanceTransaction[],
  options: {
    typeFilter: 'all' | TransactionType;
    query: string;
  }
): FinanceTransaction[] {
  const normalizedQuery = options.query.trim().toLowerCase();

  return [...transactions]
    .filter((tx) => {
      if (options.typeFilter !== 'all' && tx.type !== options.typeFilter) {
        return false;
      }
      if (!normalizedQuery) return true;
      return (
        tx.title.toLowerCase().includes(normalizedQuery) ||
        tx.category.toLowerCase().includes(normalizedQuery) ||
        (tx.note?.toLowerCase().includes(normalizedQuery) ?? false)
      );
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function groupTransactionsByDate(
  transactions: FinanceTransaction[]
): Array<{ dateKey: string; items: FinanceTransaction[]; dayExpense: number; dayIncome: number }> {
  const map = new Map<string, FinanceTransaction[]>();

  for (const tx of transactions) {
    const existing = map.get(tx.date) ?? [];
    existing.push(tx);
    map.set(tx.date, existing);
  }

  return Array.from(map.entries())
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([dateKey, items]) => {
      let dayExpense = 0;
      let dayIncome = 0;
      for (const item of items) {
        if (item.type === 'expense') dayExpense += item.amount;
        else dayIncome += item.amount;
      }
      return { dateKey, items, dayExpense, dayIncome };
    });
}

export function getCategoryBreakdown(
  transactions: FinanceTransaction[],
  year: number,
  month: number,
  type: TransactionType = 'expense'
): CategoryBreakdownItem[] {
  const prefix = `${year}-${String(month).padStart(2, '0')}-`;
  const totals = new Map<TransactionCategory, { amount: number; count: number }>();
  let grandTotal = 0;

  for (const tx of transactions) {
    if (!tx.date.startsWith(prefix) || tx.type !== type) continue;
    grandTotal += tx.amount;
    const entry = totals.get(tx.category) ?? { amount: 0, count: 0 };
    entry.amount += tx.amount;
    entry.count += 1;
    totals.set(tx.category, entry);
  }

  return Array.from(totals.entries())
    .map(([category, { amount, count }]) => ({
      category,
      amount,
      count,
      percentage: grandTotal > 0 ? Math.round((amount / grandTotal) * 100) : 0,
    }))
    .sort((a, b) => b.amount - a.amount);
}
