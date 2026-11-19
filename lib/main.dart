import 'package:flutter/material.dart';
import 'theme/app_theme.dart';
import 'screens/home_screen.dart';

void main() {
  runApp(const KemanainApp());
}

class KemanainApp extends StatelessWidget {
  const KemanainApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Kemanain',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      home: const MainNavigationShell(),
    );
  }
}

class MainNavigationShell extends StatefulWidget {
  const MainNavigationShell({super.key});

  @override
  State<MainNavigationShell> createState() => _MainNavigationShellState();
}

class _MainNavigationShellState extends State<MainNavigationShell> {
  int _currentIndex = 0;

  // Data dummy statis awal untuk prototipe Kemanain
  final List<FinanceTransaction> _transactions = [
    FinanceTransaction(
      id: '1',
      title: 'Gaji Bulanan',
      category: 'Gaji',
      amount: 8500000,
      type: TransactionType.income,
      date: DateTime(2026, 11, 1),
      icon: Icons.account_balance_wallet_rounded,
    ),
    FinanceTransaction(
      id: '2',
      title: 'Tagihan Internet & Listrik',
      category: 'Tagihan',
      amount: 650000,
      type: TransactionType.expense,
      date: DateTime(2026, 11, 5),
      icon: Icons.bolt_rounded,
    ),
    FinanceTransaction(
      id: '3',
      title: 'Belanja Mingguan',
      category: 'Belanja',
      amount: 420000,
      type: TransactionType.expense,
      date: DateTime(2026, 11, 10),
      icon: Icons.shopping_bag_outlined,
    ),
    FinanceTransaction(
      id: '4',
      title: 'Proyek Desain UI',
      category: 'Freelance',
      amount: 1750000,
      type: TransactionType.income,
      date: DateTime(2026, 11, 14),
      icon: Icons.work_outline_rounded,
    ),
    FinanceTransaction(
      id: '5',
      title: 'Makan Siang & Kopi',
      category: 'Makanan & Minum',
      amount: 68000,
      type: TransactionType.expense,
      date: DateTime(2026, 11, 19),
      icon: Icons.local_cafe_outlined,
    ),
    FinanceTransaction(
      id: '6',
      title: 'Transportasi KRL & Ojek',
      category: 'Transportasi',
      amount: 34000,
      type: TransactionType.expense,
      date: DateTime(2026, 11, 19),
      icon: Icons.directions_transit_outlined,
    ),
  ];

  void _addTransaction(FinanceTransaction tx) {
    setState(() {
      _transactions.insert(0, tx);
    });
  }

  void _deleteTransaction(String id) {
    setState(() {
      _transactions.removeWhere((item) => item.id == id);
    });
  }

  @override
  Widget build(BuildContext context) {
    final screens = [
      HomeScreen(
        transactions: _transactions,
        onAddTransaction: _addTransaction,
        onDeleteTransaction: _deleteTransaction,
      ),
      _HistoryTab(transactions: _transactions),
      _StatisticsTab(transactions: _transactions),
      const _ProfileTab(),
    ];

    return Scaffold(
      body: IndexedStack(
        index: _currentIndex,
        children: screens,
      ),
      bottomNavigationBar: Container(
        decoration: const BoxDecoration(
          border: Border(
            top: BorderSide(color: AppColors.border, width: 1),
          ),
        ),
        child: NavigationBar(
          selectedIndex: _currentIndex,
          onDestinationSelected: (index) {
            setState(() => _currentIndex = index);
          },
          destinations: const [
            NavigationDestination(
              icon: Icon(Icons.home_outlined),
              selectedIcon: Icon(Icons.home_rounded),
              label: 'Beranda',
            ),
            NavigationDestination(
              icon: Icon(Icons.receipt_long_outlined),
              selectedIcon: Icon(Icons.receipt_long_rounded),
              label: 'Riwayat',
            ),
            NavigationDestination(
              icon: Icon(Icons.bar_chart_outlined),
              selectedIcon: Icon(Icons.bar_chart_rounded),
              label: 'Statistik',
            ),
            NavigationDestination(
              icon: Icon(Icons.person_outline_rounded),
              selectedIcon: Icon(Icons.person_rounded),
              label: 'Profil',
            ),
          ],
        ),
      ),
    );
  }
}

class _HistoryTab extends StatelessWidget {
  final List<FinanceTransaction> transactions;

  const _HistoryTab({required this.transactions});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Riwayat Transaksi')),
      body: ListView.separated(
        padding: const EdgeInsets.all(20),
        itemCount: transactions.length,
        separatorBuilder: (_, __) => const SizedBox(height: 12),
        itemBuilder: (context, index) {
          final tx = transactions[index];
          return Card(
            child: ListTile(
              contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              leading: Container(
                width: 40,
                height: 40,
                decoration: BoxDecoration(
                  color: AppColors.surfaceSubtle,
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Icon(tx.icon, size: 20, color: AppColors.textPrimary),
              ),
              title: Text(tx.title, style: Theme.of(context).textTheme.titleMedium),
              subtitle: Text(
                '${tx.category} · ${tx.date.day}/${tx.date.month}/${tx.date.year}',
                style: Theme.of(context).textTheme.bodyMedium,
              ),
              trailing: Text(
                '${tx.type == TransactionType.income ? '+' : '-'} ${formatRupiah(tx.amount)}',
                style: Theme.of(context).textTheme.labelLarge?.copyWith(
                      color: tx.type == TransactionType.income
                          ? AppColors.income
                          : AppColors.textPrimary,
                    ),
              ),
            ),
          );
        },
      ),
    );
  }
}

class _StatisticsTab extends StatelessWidget {
  final List<FinanceTransaction> transactions;

  const _StatisticsTab({required this.transactions});

  @override
  Widget build(BuildContext context) {
    final totalIncome = transactions
        .where((t) => t.type == TransactionType.income)
        .fold(0, (s, t) => s + t.amount);
    final totalExpense = transactions
        .where((t) => t.type == TransactionType.expense)
        .fold(0, (s, t) => s + t.amount);
    final ratio = totalIncome == 0
        ? 0.0
        : (totalExpense / totalIncome).clamp(0.0, 1.0);

    return Scaffold(
      appBar: AppBar(title: const Text('Statistik')),
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          Card(
            child: Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Rasio Pengeluaran', style: Theme.of(context).textTheme.titleMedium),
                  const SizedBox(height: 8),
                  Text(
                    '${(ratio * 100).round()}% dari pemasukan terpakai',
                    style: Theme.of(context).textTheme.bodyMedium,
                  ),
                  const SizedBox(height: 16),
                  ClipRRect(
                    borderRadius: BorderRadius.circular(8),
                    child: LinearProgressIndicator(
                      value: ratio,
                      minHeight: 10,
                      backgroundColor: AppColors.surfaceSubtle,
                      color: AppColors.primary,
                    ),
                  ),
                  const SizedBox(height: 16),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text('Masuk: ${formatRupiah(totalIncome)}',
                          style: Theme.of(context).textTheme.bodyMedium),
                      Text('Keluar: ${formatRupiah(totalExpense)}',
                          style: Theme.of(context).textTheme.bodyMedium),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _ProfileTab extends StatelessWidget {
  const _ProfileTab();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Profil')),
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          Card(
            child: Padding(
              padding: const EdgeInsets.all(20),
              child: Row(
                children: [
                  Container(
                    width: 48,
                    height: 48,
                    decoration: BoxDecoration(
                      color: AppColors.primarySoft,
                      borderRadius: BorderRadius.circular(14),
                    ),
                    child: const Icon(Icons.person_rounded, color: AppColors.primary),
                  ),
                  const SizedBox(width: 14),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Raka Pratama', style: Theme.of(context).textTheme.titleMedium),
                      const SizedBox(height: 2),
                      Text('Mata Uang · IDR (Rp)',
                          style: Theme.of(context).textTheme.bodyMedium),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
