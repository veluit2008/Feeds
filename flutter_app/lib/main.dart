import 'package:flutter/material.dart';

void main() {
  runApp(const GreenFieldApp());
}

class GreenFieldApp extends StatelessWidget {
  const GreenFieldApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'GreenField Feeds',
      theme: ThemeData(
        primarySwatch: Colors.green,
        scaffoldBackgroundColor: const Color(0xFFFEFBF0),
        textTheme: Theme.of(context).textTheme.apply(
              bodyColor: const Color(0xFF1C1208),
              displayColor: const Color(0xFF1C1208),
            ),
      ),
      initialRoute: LoginScreen.routeName,
      routes: {
        LoginScreen.routeName: (_) => const LoginScreen(),
        HomeScreen.routeName: (_) => const HomeScreen(),
      },
    );
  }
}

/// Simple in-memory authentication for draft/demo purposes.
class AuthService {
  static const _users = <User>[
    User(id: 1, name: 'Admin User', username: 'admin', password: 'admin123', role: UserRole.admin),
    User(id: 2, name: 'Branch 1 Manager', username: 'branch1', password: 'branch1', role: UserRole.branch, branchId: 1),
    User(id: 3, name: 'Branch 2 Manager', username: 'branch2', password: 'branch2', role: UserRole.branch, branchId: 2),
    User(id: 4, name: 'Branch 3 Manager', username: 'branch3', password: 'branch3', role: UserRole.branch, branchId: 3),
  ];

  static Future<User?> login(String username, String password) async {
    await Future.delayed(const Duration(milliseconds: 300));

    for (final user in _users) {
      if (user.username == username && user.password == password) {
        return user;
      }
    }

    return null;
  }
}

enum UserRole { admin, branch }

class User {
  final int id;
  final String name;
  final String username;
  final String password;
  final UserRole role;
  final int? branchId;

  const User({
    required this.id,
    required this.name,
    required this.username,
    required this.password,
    required this.role,
    this.branchId,
  });
}

class LoginScreen extends StatefulWidget {
  static const routeName = '/login';
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _formKey = GlobalKey<FormState>();
  final _usernameController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _loading = false;
  String? _error;

  @override
  void dispose() {
    _usernameController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() {
      _loading = true;
      _error = null;
    });

    final user = await AuthService.login(
      _usernameController.text.trim(),
      _passwordController.text.trim(),
    );

    if (user == null) {
      setState(() {
        _error = 'Invalid username or password';
        _loading = false;
      });
      return;
    }

    if (!mounted) return;

    Navigator.of(context).pushReplacement(
      MaterialPageRoute(
        builder: (_) => HomeScreen(user: user),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 22),
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 400),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Text(
                  'GreenField Feeds',
                  style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 24),
                Form(
                  key: _formKey,
                  child: Column(
                    children: [
                      TextFormField(
                        controller: _usernameController,
                        decoration: const InputDecoration(labelText: 'Username'),
                        validator: (value) => (value ?? '').isEmpty ? 'Required' : null,
                      ),
                      const SizedBox(height: 12),
                      TextFormField(
                        controller: _passwordController,
                        decoration: const InputDecoration(labelText: 'Password'),
                        obscureText: true,
                        validator: (value) => (value ?? '').isEmpty ? 'Required' : null,
                      ),
                      const SizedBox(height: 14),
                      if (_error != null)
                        Padding(
                          padding: const EdgeInsets.only(bottom: 12),
                          child: Text(
                            _error!,
                            style: const TextStyle(color: Colors.red),
                          ),
                        ),
                      SizedBox(
                        width: double.infinity,
                        child: ElevatedButton(
                          onPressed: _loading ? null : _submit,
                          child: _loading
                              ? const SizedBox(
                                  height: 20,
                                  width: 20,
                                  child: CircularProgressIndicator(strokeWidth: 2),
                                )
                              : const Text('Login'),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class HomeScreen extends StatefulWidget {
  static const routeName = '/home';
  final User? user;

  const HomeScreen({super.key, this.user});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _selectedIndex = 0;

  static const _tabs = [
    _DashboardTab(),
    _ProductsTab(),
    _SalesTab(),
    _CustomersTab(),
  ];

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    final displayName = widget.user?.name ?? 'Guest';

    return Scaffold(
      appBar: AppBar(
        title: Text('GreenField • $displayName'),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () {
              Navigator.of(context).pushReplacementNamed(LoginScreen.routeName);
            },
            tooltip: 'Logout',
          ),
        ],
      ),
      body: _tabs[_selectedIndex],
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _selectedIndex,
        onTap: _onItemTapped,
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.dashboard), label: 'Dashboard'),
          BottomNavigationBarItem(icon: Icon(Icons.inventory_2), label: 'Products'),
          BottomNavigationBarItem(icon: Icon(Icons.receipt_long), label: 'Sales'),
          BottomNavigationBarItem(icon: Icon(Icons.people), label: 'Customers'),
        ],
      ),
    );
  }
}

class _DashboardTab extends StatelessWidget {
  const _DashboardTab();

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: const [
          _DashboardCard(title: 'Monthly Sales (placeholder)', content: 'Chart UI goes here'),
          SizedBox(height: 14),
          _DashboardCard(title: 'Top Branch Performance', content: 'Replace with chart or table'),
          SizedBox(height: 14),
          _DashboardCard(title: 'Quick Actions', content: 'Add shortcuts for common tasks'),
        ],
      ),
    );
  }
}

class _DashboardCard extends StatelessWidget {
  final String title;
  final String content;

  const _DashboardCard({required this.title, required this.content});

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(title, style: Theme.of(context).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w600)),
            const SizedBox(height: 12),
            Text(content, style: Theme.of(context).textTheme.bodyMedium),
          ],
        ),
      ),
    );
  }
}

class _ProductsTab extends StatelessWidget {
  const _ProductsTab();

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: AppData.products.length,
      itemBuilder: (context, index) {
        final product = AppData.products[index];
        return Card(
          margin: const EdgeInsets.only(bottom: 12),
          child: ListTile(
            title: Text(product.productName),
            subtitle: Text('Brand: ${product.brand} • Unit: ${product.unit}'),
            trailing: Text('Stock ${product.stock}'),
          ),
        );
      },
    );
  }
}

class _SalesTab extends StatelessWidget {
  const _SalesTab();

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: AppData.sales.length,
      itemBuilder: (context, index) {
        final sale = AppData.sales[index];
        return Card(
          margin: const EdgeInsets.only(bottom: 12),
          child: ListTile(
            title: Text('Sale #${sale.id} • ${sale.saleType.toUpperCase()}'),
            subtitle: Text('${sale.quantity} x ${sale.productName} • ${sale.date}'),
            trailing: Text('₹${sale.totalAmount}'),
          ),
        );
      },
    );
  }
}

class _CustomersTab extends StatelessWidget {
  const _CustomersTab();

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: AppData.customers.length,
      itemBuilder: (context, index) {
        final customer = AppData.customers[index];
        return Card(
          margin: const EdgeInsets.only(bottom: 12),
          child: ListTile(
            title: Text(customer.name),
            subtitle: Text('Phone: ${customer.phone}'),
            trailing: Text('Credit ₹${customer.creditBalance}'),
          ),
        );
      },
    );
  }
}

/// A simple in-memory dataset matching the web version for quick prototyping.
class AppData {
  static final products = <Product>[
    const Product(
      id: 1,
      productName: 'Cattle Feed Premium',
      brand: 'Suguna',
      purchasePrice: 850,
      sellingPrice: 950,
      unit: '50kg Bag',
      stock: 120,
    ),
    const Product(
      id: 2,
      productName: 'Dairy Feed Plus',
      brand: 'Godrej Agrovet',
      purchasePrice: 920,
      sellingPrice: 1050,
      unit: '50kg Bag',
      stock: 85,
    ),
    const Product(
      id: 3,
      productName: 'Cattle Feed Standard',
      brand: 'Heritage',
      purchasePrice: 720,
      sellingPrice: 820,
      unit: '50kg Bag',
      stock: 200,
    ),
    const Product(
      id: 4,
      productName: 'Mineral Mix',
      brand: 'Kapila',
      purchasePrice: 280,
      sellingPrice: 350,
      unit: '5kg Pack',
      stock: 15,
    ),
    const Product(
      id: 5,
      productName: 'Maize Silage',
      brand: 'Local',
      purchasePrice: 12,
      sellingPrice: 18,
      unit: 'kg',
      stock: 1200,
    ),
  ];

  static final customers = <Customer>[
    const Customer(id: 1, name: 'Murugan Farms', phone: '9876543210', branchId: 1, creditBalance: 12500),
    const Customer(id: 2, name: 'Selvi Dairy', phone: '9865432101', branchId: 1, creditBalance: 0),
    const Customer(id: 3, name: 'Rajan & Sons', phone: '9754321098', branchId: 2, creditBalance: 8200),
    const Customer(id: 4, name: 'Lakshmi Cattle', phone: '9643210987', branchId: 2, creditBalance: 3100),
    const Customer(id: 5, name: 'Krishnan Milk', phone: '9532109876', branchId: 3, creditBalance: 0),
    const Customer(id: 6, name: 'Vijay Livestock', phone: '9421098765', branchId: 3, creditBalance: 15600),
  ];

  static final sales = <Sale>[
    const Sale(id: 1, branchId: 1, productId: 1, productName: 'Cattle Feed Premium', customerId: 1, quantity: 10, price: 950, totalAmount: 9500, saleType: 'credit', date: '2026-03-04'),
    const Sale(id: 2, branchId: 1, productId: 2, productName: 'Dairy Feed Plus', customerId: 2, quantity: 5, price: 1050, totalAmount: 5250, saleType: 'cash', date: '2026-03-04'),
    const Sale(id: 3, branchId: 2, productId: 3, productName: 'Cattle Feed Standard', customerId: 3, quantity: 20, price: 820, totalAmount: 16400, saleType: 'credit', date: '2026-03-04'),
    const Sale(id: 4, branchId: 2, productId: 1, productName: 'Cattle Feed Premium', customerId: 4, quantity: 8, price: 950, totalAmount: 7600, saleType: 'cash', date: '2026-03-03'),
    const Sale(id: 5, branchId: 3, productId: 2, productName: 'Dairy Feed Plus', customerId: 5, quantity: 12, price: 1050, totalAmount: 12600, saleType: 'cash', date: '2026-03-03'),
    const Sale(id: 6, branchId: 3, productId: 4, productName: 'Mineral Mix', customerId: 6, quantity: 30, price: 350, totalAmount: 10500, saleType: 'credit', date: '2026-03-02'),
    const Sale(id: 7, branchId: 1, productId: 5, productName: 'Maize Silage', customerId: 1, quantity: 500, price: 18, totalAmount: 9000, saleType: 'cash', date: '2026-03-02'),
    const Sale(id: 8, branchId: 2, productId: 2, productName: 'Dairy Feed Plus', customerId: 3, quantity: 7, price: 1050, totalAmount: 7350, saleType: 'direct', date: '2026-03-01'),
  ];
}

class Product {
  final int id;
  final String productName;
  final String brand;
  final int purchasePrice;
  final int sellingPrice;
  final String unit;
  final int stock;

  const Product({
    required this.id,
    required this.productName,
    required this.brand,
    required this.purchasePrice,
    required this.sellingPrice,
    required this.unit,
    required this.stock,
  });
}

class Customer {
  final int id;
  final String name;
  final String phone;
  final int branchId;
  final int creditBalance;

  const Customer({
    required this.id,
    required this.name,
    required this.phone,
    required this.branchId,
    required this.creditBalance,
  });
}

class Sale {
  final int id;
  final int branchId;
  final int productId;
  final String productName;
  final int customerId;
  final int quantity;
  final int price;
  final int totalAmount;
  final String saleType;
  final String date;

  const Sale({
    required this.id,
    required this.branchId,
    required this.productId,
    required this.productName,
    required this.customerId,
    required this.quantity,
    required this.price,
    required this.totalAmount,
    required this.saleType,
    required this.date,
  });
}
