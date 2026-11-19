import 'package:flutter/material.dart';
import '../theme/app_theme.dart';

enum TransactionType { income, expense }

class FinanceTransaction {
  final String id;
  final String title;
  final String category;
  final int amount;
  final TransactionType type;
  final DateTime date;
  final IconData icon;

  const FinanceTransaction({
    required this.id,
    required this.title,
    required this.category,
    required this.amount,
    required this.type,
    required this.date,
    required this.icon,
  });
}

String formatRupiah(int amount) {
  final absStr = amount.abs().toString();
  final buffer = StringBuffer();
  for (int i = 0; i < absStr.length; i++) {
    final reverseIdx = absStr.length - 1 - i;
    buffer.write(absStr[i]);
    if (reverseIdx > 0 && reverseIdx % 3 == 0) {
      buffer.write('.');
    }
  }
  return 'Rp $buffer';
}

String formatCompactNominal(int amount) {
  if (amount >= 1000000) {
    final jt = amount / 1000000;
    return '${jt.toStringAsFixed(jt % 1 == 0 ? 0 : 1)}jt';
  }
  if (amount >= 1000) {
    return '${(amount / 1000).round()}rb';
  }
  return amount.toString();
}

class HomeScreen extends StatefulWidget {
  final List<FinanceTransaction> transactions;
  final void Function(FinanceTransaction) onAddTransaction;
  final void Function(String id) onDeleteTransaction;

  const HomeScreen({
    super.key,
    required this.transactions,
    required this.onAddTransaction,
    required this.onDeleteTransaction,
  });

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  DateTime _focusedMonth = DateTime(2026, 11, 1);
  DateTime _selectedDate = DateTime(2026, 11, 19);

  static const List<String> _monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
  ];

  static const List<String> _dayLabels = [
    'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min',
  ];

  bool _isSameDay(DateTime a, DateTime b) =>
      a.year == b.year && a.month == b.month && a.day == b.day;

  List<FinanceTransaction> get _monthTransactions => widget.transactions
      .where((t) =>
          t.date.year == _focusedMonth.year &&
          t.date.month == _focusedMonth.month)
      .toList();

  List<FinanceTransaction> get _selectedDayTransactions => widget.transactions
      .where((t) => _isSameDay(t.date, _selectedDate))
      .toList();

  int _sumByType(List<FinanceTransaction> list, TransactionType type) {
    return list
        .where((t) => t.type == type)
        .fold(0, (sum, item) => sum + item.amount);
  }

  void _changeMonth(int delta) {
    setState(() {
      _focusedMonth = DateTime(_focusedMonth.year, _focusedMonth.month + delta, 1);
      _selectedDate = DateTime(_focusedMonth.year, _focusedMonth.month, 1);
    });
  }

  void _openAddTransactionSheet() {
    showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      builder: (ctx) => _AddTransactionSheet(
        initialDate: _selectedDate,
        onSave: (tx) {
          widget.onAddTransaction(tx);
          Navigator.of(ctx).pop();
        },
      ),
    );
  }

  void _openTransactionDetail(FinanceTransaction tx) {
    showModalBottomSheet<void>(
      context: context,
      builder: (ctx) => Padding(
        padding: const EdgeInsets.fromLTRB(24, 16, 24, 32),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Center(
              child: Container(
                width: 40,
                height: 4,
                decoration: BoxDecoration(
                  color: AppColors.border,
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
            ),
            const SizedBox(height: 20),
            Row(
              children: [
                Container(
                  width: 44,
                  height: 44,
                  decoration: BoxDecoration(
                    color: tx.type == TransactionType.income
                        ? AppColors.incomeSoft
                        : AppColors.expenseSoft,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Icon(
                    tx.icon,
                    color: tx.type == TransactionType.income
                        ? AppColors.income
                        : AppColors.expense,
                  ),
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(tx.title, style: Theme.of(ctx).textTheme.titleMedium),
                      const SizedBox(height: 2),
                      Text(
                        '${tx.category} · ${tx.date.day} ${_monthNames[tx.date.month - 1]} ${tx.date.year}',
                        style: Theme.of(ctx).textTheme.bodyMedium,
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 20),
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppColors.background,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: AppColors.border),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    tx.type == TransactionType.income ? 'Pemasukan' : 'Pengeluaran',
                    style: Theme.of(ctx).textTheme.bodyMedium,
                  ),
                  Text(
                    '${tx.type == TransactionType.income ? '+' : '-'} ${formatRupiah(tx.amount)}',
                    style: Theme.of(ctx).textTheme.titleLarge?.copyWith(
                          color: tx.type == TransactionType.income
                              ? AppColors.income
                              : AppColors.expense,
                        ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),
            OutlinedButton.icon(
              onPressed: () {
                widget.onDeleteTransaction(tx.id);
                Navigator.of(ctx).pop();
              },
              icon: const Icon(Icons.delete_outline_rounded, color: AppColors.expense),
              label: const Text(
                'Hapus Transaksi',
                style: TextStyle(color: AppColors.expense),
              ),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final monthTx = _monthTransactions;
    final monthIncome = _sumByType(monthTx, TransactionType.income);
    final monthExpense = _sumByType(monthTx, TransactionType.expense);
    final monthNet = monthIncome - monthExpense;

    final dayTx = _selectedDayTransactions;
    final dayExpense = _sumByType(dayTx, TransactionType.expense);
    final dayIncome = _sumByType(dayTx, TransactionType.income);

    return Scaffold(
      body: SafeArea(
        child: CustomScrollView(
          slivers: [
            SliverPadding(
              padding: const EdgeInsets.fromLTRB(20, 20, 20, 24),
              sliver: SliverList(
                delegate: SliverChildListDelegate([
                  // Header Halaman
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Kemanain',
                            style: Theme.of(context).textTheme.headlineMedium,
                          ),
                          const SizedBox(height: 2),
                          Text(
                            'Pantau arus kas harianmu',
                            style: Theme.of(context).textTheme.bodyMedium,
                          ),
                        ],
                      ),
                      Container(
                        decoration: BoxDecoration(
                          color: AppColors.surface,
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: AppColors.border),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            IconButton(
                              onPressed: () => _changeMonth(-1),
                              icon: const Icon(Icons.chevron_left_rounded, size: 20),
                              tooltip: 'Bulan sebelumnya',
                            ),
                            Text(
                              '${_monthNames[_focusedMonth.month - 1]} ${_focusedMonth.year}',
                              style: Theme.of(context).textTheme.labelLarge,
                            ),
                            IconButton(
                              onPressed: () => _changeMonth(1),
                              icon: const Icon(Icons.chevron_right_rounded, size: 20),
                              tooltip: 'Bulan berikutnya',
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: AppSpacing.lg),

                  // Kartu Ringkasan Bulan Ini
                  Card(
                    child: Padding(
                      padding: const EdgeInsets.all(20),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Selisih Kas Bulan Ini',
                            style: Theme.of(context).textTheme.bodyMedium,
                          ),
                          const SizedBox(height: 6),
                          Text(
                            '${monthNet >= 0 ? '' : '- '}${formatRupiah(monthNet)}',
                            style: Theme.of(context).textTheme.headlineMedium,
                          ),
                          const SizedBox(height: 16),
                          Container(
                            padding: const EdgeInsets.all(14),
                            decoration: BoxDecoration(
                              color: AppColors.background,
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Row(
                              children: [
                                Expanded(
                                  child: _MetricItem(
                                    label: 'Pemasukan',
                                    amount: '+ ${formatRupiah(monthIncome)}',
                                    color: AppColors.income,
                                    icon: Icons.arrow_downward_rounded,
                                  ),
                                ),
                                Container(
                                  width: 1,
                                  height: 36,
                                  color: AppColors.border,
                                  margin: const EdgeInsets.symmetric(horizontal: 12),
                                ),
                                Expanded(
                                  child: _MetricItem(
                                    label: 'Pengeluaran',
                                    amount: '- ${formatRupiah(monthExpense)}',
                                    color: AppColors.expense,
                                    icon: Icons.arrow_upward_rounded,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: AppSpacing.lg),

                  // Kartu Kalender Pengeluaran Harian
                  Card(
                    child: Padding(
                      padding: const EdgeInsets.all(20),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(
                                'Kalender Harian',
                                style: Theme.of(context).textTheme.titleMedium,
                              ),
                              Text(
                                'Ketuk tanggal',
                                style: Theme.of(context).textTheme.labelMedium,
                              ),
                            ],
                          ),
                          const SizedBox(height: 16),
                          // Nama Hari
                          Row(
                            children: _dayLabels
                                .map(
                                  (day) => Expanded(
                                    child: Center(
                                      child: Text(
                                        day,
                                        style: Theme.of(context).textTheme.labelMedium,
                                      ),
                                    ),
                                  ),
                                )
                                .toList(),
                          ),
                          const SizedBox(height: 10),
                          _buildCalendarGrid(),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: AppSpacing.lg),

                  // Tombol Aksi Utama (12px radius, tinggi 50px)
                  FilledButton.icon(
                    onPressed: _openAddTransactionSheet,
                    icon: const Icon(Icons.add_rounded, size: 20),
                    label: const Text('Catat Transaksi'),
                  ),
                  const SizedBox(height: AppSpacing.xl),

                  // Header Daftar Transaksi Hari Terpilih
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Catatan ${_selectedDate.day} ${_monthNames[_selectedDate.month - 1]}',
                            style: Theme.of(context).textTheme.titleMedium,
                          ),
                          const SizedBox(height: 2),
                          Text(
                            'Masuk +${formatCompactNominal(dayIncome)} · Keluar -${formatCompactNominal(dayExpense)}',
                            style: Theme.of(context).textTheme.bodyMedium,
                          ),
                        ],
                      ),
                      Text(
                        '${dayTx.length} item',
                        style: Theme.of(context).textTheme.labelMedium,
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),

                  if (dayTx.isEmpty)
                    Card(
                      child: Padding(
                        padding: const EdgeInsets.symmetric(vertical: 28, horizontal: 20),
                        child: Column(
                          children: [
                            const Icon(
                              Icons.event_note_outlined,
                              size: 28,
                              color: AppColors.textMuted,
                            ),
                            const SizedBox(height: 10),
                            Text(
                              'Belum ada catatan pada tanggal ini',
                              style: Theme.of(context).textTheme.bodyMedium,
                            ),
                          ],
                        ),
                      ),
                    )
                  else
                    Card(
                      child: Column(
                        children: List.generate(dayTx.length, (index) {
                          final tx = dayTx[index];
                          final isLast = index == dayTx.length - 1;
                          return Column(
                            children: [
                              InkWell(
                                borderRadius: BorderRadius.vertical(
                                  top: index == 0
                                      ? const Radius.circular(16)
                                      : Radius.zero,
                                  bottom: isLast
                                      ? const Radius.circular(16)
                                      : Radius.zero,
                                ),
                                onTap: () => _openTransactionDetail(tx),
                                child: Padding(
                                  padding: const EdgeInsets.symmetric(
                                    horizontal: 16,
                                    vertical: 14,
                                  ),
                                  child: Row(
                                    children: [
                                      Container(
                                        width: 40,
                                        height: 40,
                                        decoration: BoxDecoration(
                                          color: AppColors.surfaceSubtle,
                                          borderRadius: BorderRadius.circular(10),
                                        ),
                                        child: Icon(
                                          tx.icon,
                                          size: 20,
                                          color: AppColors.textPrimary,
                                        ),
                                      ),
                                      const SizedBox(width: 12),
                                      Expanded(
                                        child: Column(
                                          crossAxisAlignment: CrossAxisAlignment.start,
                                          children: [
                                            Text(
                                              tx.title,
                                              style: Theme.of(context).textTheme.titleMedium?.copyWith(fontSize: 15),
                                              maxLines: 1,
                                              overflow: TextOverflow.ellipsis,
                                            ),
                                            const SizedBox(height: 2),
                                            Text(
                                              tx.category,
                                              style: Theme.of(context).textTheme.bodyMedium?.copyWith(fontSize: 13),
                                            ),
                                          ],
                                        ),
                                      ),
                                      const SizedBox(width: 12),
                                      Text(
                                        '${tx.type == TransactionType.income ? '+' : '-'} ${formatRupiah(tx.amount)}',
                                        style: Theme.of(context).textTheme.labelLarge?.copyWith(
                                              color: tx.type == TransactionType.income
                                                  ? AppColors.income
                                                  : AppColors.textPrimary,
                                            ),
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                              if (!isLast)
                                const Padding(
                                  padding: EdgeInsets.only(left: 68),
                                  child: Divider(),
                                ),
                            ],
                          );
                        }),
                      ),
                    ),
                ]),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildCalendarGrid() {
    final daysInMonth =
        DateUtils.getDaysInMonth(_focusedMonth.year, _focusedMonth.month);
    final firstWeekdayOffset = _focusedMonth.weekday - 1; // 0 = Senin
    final totalCells = ((firstWeekdayOffset + daysInMonth) / 7).ceil() * 7;

    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      itemCount: totalCells,
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 7,
        mainAxisSpacing: 6,
        crossAxisSpacing: 6,
        childAspectRatio: 0.78,
      ),
      itemBuilder: (context, index) {
        final dayNumber = index - firstWeekdayOffset + 1;
        if (dayNumber < 1 || dayNumber > daysInMonth) {
          return const SizedBox.shrink();
        }

        final cellDate =
            DateTime(_focusedMonth.year, _focusedMonth.month, dayNumber);
        final isSelected = _isSameDay(cellDate, _selectedDate);
        final cellTx = widget.transactions
            .where((t) => _isSameDay(t.date, cellDate))
            .toList();
        final dayExpense = _sumByType(cellTx, TransactionType.expense);
        final dayIncome = _sumByType(cellTx, TransactionType.income);

        return InkWell(
          borderRadius: BorderRadius.circular(10),
          onTap: () => setState(() => _selectedDate = cellDate),
          child: Container(
            padding: const EdgeInsets.symmetric(vertical: 6, horizontal: 2),
            decoration: BoxDecoration(
              color: isSelected ? AppColors.primarySoft : AppColors.background,
              borderRadius: BorderRadius.circular(10),
              border: Border.all(
                color: isSelected ? AppColors.primary : Colors.transparent,
                width: 1.5,
              ),
            ),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  '$dayNumber',
                  style: TextStyle(
                    fontSize: 13,
                    fontWeight: isSelected ? FontWeight.w700 : FontWeight.w600,
                    color: isSelected ? AppColors.primary : AppColors.textPrimary,
                  ),
                ),
                if (dayExpense > 0)
                  Text(
                    '-${formatCompactNominal(dayExpense)}',
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(
                      fontSize: 10,
                      fontWeight: FontWeight.w600,
                      color: AppColors.expense,
                    ),
                  )
                else if (dayIncome > 0)
                  Text(
                    '+${formatCompactNominal(dayIncome)}',
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(
                      fontSize: 10,
                      fontWeight: FontWeight.w600,
                      color: AppColors.income,
                    ),
                  )
                else
                  const SizedBox(height: 12),
              ],
            ),
          ),
        );
      },
    );
  }
}

class _MetricItem extends StatelessWidget {
  final String label;
  final String amount;
  final Color color;
  final IconData icon;

  const _MetricItem({
    required this.label,
    required this.amount,
    required this.color,
    required this.icon,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Icon(icon, size: 14, color: color),
            const SizedBox(width: 4),
            Text(
              label,
              style: Theme.of(context).textTheme.labelMedium,
            ),
          ],
        ),
        const SizedBox(height: 4),
        Text(
          amount,
          style: Theme.of(context).textTheme.labelLarge?.copyWith(color: color),
        ),
      ],
    );
  }
}

class _AddTransactionSheet extends StatefulWidget {
  final DateTime initialDate;
  final void Function(FinanceTransaction) onSave;

  const _AddTransactionSheet({
    required this.initialDate,
    required this.onSave,
  });

  @override
  State<_AddTransactionSheet> createState() => _AddTransactionSheetState();
}

class _AddTransactionSheetState extends State<_AddTransactionSheet> {
  final _titleController = TextEditingController();
  final _amountController = TextEditingController();
  TransactionType _type = TransactionType.expense;
  String _category = 'Makanan & Minum';
  String? _errorMessage;

  static const List<String> _expenseCategories = [
    'Makanan & Minum',
    'Transportasi',
    'Belanja',
    'Tagihan',
    'Hiburan',
  ];

  static const List<String> _incomeCategories = [
    'Gaji',
    'Freelance',
    'Investasi',
  ];

  @override
  void dispose() {
    _titleController.dispose();
    _amountController.dispose();
    super.dispose();
  }

  void _submit() {
    final title = _titleController.text.trim();
    final amount = int.tryParse(_amountController.text.replaceAll('.', '').trim()) ?? 0;

    if (title.isEmpty || amount <= 0) {
      setState(() {
        _errorMessage = 'Isi judul transaksi dan nominal lebih dari 0.';
      });
      return;
    }

    widget.onSave(
      FinanceTransaction(
        id: DateTime.now().millisecondsSinceEpoch.toString(),
        title: title,
        category: _category,
        amount: amount,
        type: _type,
        date: widget.initialDate,
        icon: _type == TransactionType.income
            ? Icons.account_balance_wallet_rounded
            : Icons.receipt_long_rounded,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final categories =
        _type == TransactionType.expense ? _expenseCategories : _incomeCategories;

    return Padding(
      padding: EdgeInsets.fromLTRB(
        24,
        16,
        24,
        24 + MediaQuery.of(context).viewInsets.bottom,
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Center(
            child: Container(
              width: 40,
              height: 4,
              decoration: BoxDecoration(
                color: AppColors.border,
                borderRadius: BorderRadius.circular(2),
              ),
            ),
          ),
          const SizedBox(height: 16),
          Text('Catat Transaksi', style: Theme.of(context).textTheme.titleLarge),
          const SizedBox(height: 16),
          SegmentedButton<TransactionType>(
            segments: const [
              ButtonSegment(
                value: TransactionType.expense,
                label: Text('Pengeluaran'),
                icon: Icon(Icons.arrow_upward_rounded, size: 18),
              ),
              ButtonSegment(
                value: TransactionType.income,
                label: Text('Pemasukan'),
                icon: Icon(Icons.arrow_downward_rounded, size: 18),
              ),
            ],
            selected: {_type},
            onSelectionChanged: (selection) {
              setState(() {
                _type = selection.first;
                _category = _type == TransactionType.expense
                    ? _expenseCategories.first
                    : _incomeCategories.first;
              });
            },
          ),
          const SizedBox(height: 16),
          TextField(
            controller: _amountController,
            keyboardType: TextInputType.number,
            decoration: const InputDecoration(
              labelText: 'Nominal (Rp)',
              hintText: 'Contoh: 45000',
            ),
          ),
          const SizedBox(height: 12),
          TextField(
            controller: _titleController,
            decoration: const InputDecoration(
              labelText: 'Keterangan',
              hintText: 'Contoh: Kopi Susu Pagi',
            ),
          ),
          const SizedBox(height: 12),
          DropdownButtonFormField<String>(
            initialValue: categories.contains(_category) ? _category : categories.first,
            decoration: const InputDecoration(labelText: 'Kategori'),
            items: categories
                .map((cat) => DropdownMenuItem(value: cat, child: Text(cat)))
                .toList(),
            onChanged: (value) {
              if (value != null) setState(() => _category = value);
            },
          ),
          if (_errorMessage != null) ...[
            const SizedBox(height: 10),
            Text(
              _errorMessage!,
              style: const TextStyle(color: AppColors.expense, fontSize: 13),
            ),
          ],
          const SizedBox(height: 20),
          FilledButton(
            onPressed: _submit,
            child: const Text('Simpan Transaksi'),
          ),
        ],
      ),
    );
  }
}
