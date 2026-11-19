import test from 'node:test';
import assert from 'node:assert/strict';
import {
  filterTransactions,
  formatCompactNominal,
  formatRupiah,
  getCategoryBreakdown,
  getDaySummary,
  getMonthCalendarGrid,
  getMonthSummary,
  groupTransactionsByDate,
} from './finance';
import type { FinanceTransaction } from '../types/finance';

const SAMPLE: FinanceTransaction[] = [
  {
    id: '1',
    title: 'Gaji Pokok',
    category: 'Gaji',
    amount: 8000000,
    type: 'income',
    date: '2026-11-01',
  },
  {
    id: '2',
    title: 'Kopi Susu',
    category: 'Makanan & Minum',
    amount: 28000,
    type: 'expense',
    date: '2026-11-19',
  },
  {
    id: '3',
    title: 'Makan Siang',
    category: 'Makanan & Minum',
    amount: 42000,
    type: 'expense',
    date: '2026-11-19',
  },
  {
    id: '4',
    title: 'Tagihan Listrik',
    category: 'Tagihan',
    amount: 500000,
    type: 'expense',
    date: '2026-10-15',
  },
];

test('formatRupiah formats Indonesian thousands cleanly', () => {
  assert.equal(formatRupiah(0), 'Rp 0');
  assert.equal(formatRupiah(45000), 'Rp 45.000');
  assert.equal(formatRupiah(8500000), 'Rp 8.500.000');
});

test('formatCompactNominal compacts rb and jt accurately', () => {
  assert.equal(formatCompactNominal(68000), '68rb');
  assert.equal(formatCompactNominal(1500000), '1,5jt');
  assert.equal(formatCompactNominal(2000000), '2jt');
});

test('getDaySummary aggregates income and expense for a single day', () => {
  const day = getDaySummary(SAMPLE, '2026-11-19');
  assert.equal(day.income, 0);
  assert.equal(day.expense, 70000);
  assert.equal(day.net, -70000);
  assert.equal(day.count, 2);
});

test('getMonthSummary excludes transactions from other months', () => {
  const nov = getMonthSummary(SAMPLE, 2026, 11);
  assert.equal(nov.income, 8000000);
  assert.equal(nov.expense, 70000);
  assert.equal(nov.net, 7930000);
  assert.equal(nov.transactionCount, 3);
});

test('getMonthCalendarGrid builds Monday-first 7-column grid for Nov 2026', () => {
  // 2026-11-01 is a Sunday -> 6 leading empty cells (Mon-Sat)
  const cells = getMonthCalendarGrid(SAMPLE, 2026, 11);
  assert.equal(cells.length % 7, 0);
  assert.equal(cells[0].dayNumber, null);
  assert.equal(cells[5].dayNumber, null);
  assert.equal(cells[6].dayNumber, 1);
  assert.equal(cells[6].income, 8000000);

  const nov19 = cells.find((c) => c.dateKey === '2026-11-19');
  assert.ok(nov19);
  assert.equal(nov19.expense, 70000);
  assert.equal(nov19.count, 2);
});

test('filterTransactions and groupTransactionsByDate handle search & type filters', () => {
  const filtered = filterTransactions(SAMPLE, { typeFilter: 'expense', query: 'kopi' });
  assert.equal(filtered.length, 1);
  assert.equal(filtered[0].id, '2');

  const grouped = groupTransactionsByDate(SAMPLE);
  assert.equal(grouped[0].dateKey, '2026-11-19');
  assert.equal(grouped[0].dayExpense, 70000);
});

test('getCategoryBreakdown computes percentages sorted descending', () => {
  const breakdown = getCategoryBreakdown(SAMPLE, 2026, 11, 'expense');
  assert.equal(breakdown.length, 1);
  assert.equal(breakdown[0].category, 'Makanan & Minum');
  assert.equal(breakdown[0].amount, 70000);
  assert.equal(breakdown[0].percentage, 100);
});
