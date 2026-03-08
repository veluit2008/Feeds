import { useState, useEffect, useRef } from "react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

// ─────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────
const MOCK_USERS = [
  { id: 1, name: "Admin User", username: "admin", password: "admin123", role: "admin", branch_id: null },
  { id: 2, name: "Branch 1 Manager", username: "branch1", password: "branch1", role: "branch", branch_id: 1 },
  { id: 3, name: "Branch 2 Manager", username: "branch2", password: "branch2", role: "branch", branch_id: 2 },
  { id: 4, name: "Branch 3 Manager", username: "branch3", password: "branch3", role: "branch", branch_id: 3 },
];

const BRANCHES = [
  { id: 1, name: "Branch 1 - Madurai", location: "Madurai" },
  { id: 2, name: "Branch 2 - Dindigul", location: "Dindigul" },
  { id: 3, name: "Branch 3 - Virudhunagar", location: "Virudhunagar" },
];

const INITIAL_UNITS = [
  { id: 1, label: "50kg Bag" },
  { id: 2, label: "70kg Bag" },
  { id: 3, label: "25kg Bag" },
  { id: 4, label: "5kg Pack" },
  { id: 5, label: "kg" },
  { id: 6, label: "Litre" },
];

const INITIAL_PRODUCTS = [
  { id: 1, product_name: "Cattle Feed Premium", brand: "Suguna", purchase_price: 850, selling_price: 950, unit: "50kg Bag", stock: 120 },
  { id: 2, product_name: "Dairy Feed Plus", brand: "Godrej Agrovet", purchase_price: 920, selling_price: 1050, unit: "50kg Bag", stock: 85 },
  { id: 3, product_name: "Cattle Feed Standard", brand: "Heritage", purchase_price: 720, selling_price: 820, unit: "50kg Bag", stock: 200 },
  { id: 4, product_name: "Mineral Mix", brand: "Kapila", purchase_price: 280, selling_price: 350, unit: "5kg Pack", stock: 15 },
  { id: 5, product_name: "Maize Silage", brand: "Local", purchase_price: 12, selling_price: 18, unit: "kg", stock: 1200 },
];

const INITIAL_CUSTOMERS = [
  { id: 1, name: "Murugan Farms", phone: "9876543210", branch_id: 1, credit_balance: 12500 },
  { id: 2, name: "Selvi Dairy", phone: "9865432101", branch_id: 1, credit_balance: 0 },
  { id: 3, name: "Rajan & Sons", phone: "9754321098", branch_id: 2, credit_balance: 8200 },
  { id: 4, name: "Lakshmi Cattle", phone: "9643210987", branch_id: 2, credit_balance: 3100 },
  { id: 5, name: "Krishnan Milk", phone: "9532109876", branch_id: 3, credit_balance: 0 },
  { id: 6, name: "Vijay Livestock", phone: "9421098765", branch_id: 3, credit_balance: 15600 },
];

const INITIAL_SALES = [
  { id: 1, branch_id: 1, product_id: 1, customer_id: 1, quantity: 10, price: 950, total_amount: 9500, sale_type: "credit", date: "2026-03-04" },
  { id: 2, branch_id: 1, product_id: 2, customer_id: 2, quantity: 5, price: 1050, total_amount: 5250, sale_type: "cash", date: "2026-03-04" },
  { id: 3, branch_id: 2, product_id: 3, customer_id: 3, quantity: 20, price: 820, total_amount: 16400, sale_type: "credit", date: "2026-03-04" },
  { id: 4, branch_id: 2, product_id: 1, customer_id: 4, quantity: 8, price: 950, total_amount: 7600, sale_type: "cash", date: "2026-03-03" },
  { id: 5, branch_id: 3, product_id: 2, customer_id: 5, quantity: 12, price: 1050, total_amount: 12600, sale_type: "cash", date: "2026-03-03" },
  { id: 6, branch_id: 3, product_id: 4, customer_id: 6, quantity: 30, price: 350, total_amount: 10500, sale_type: "credit", date: "2026-03-02" },
  { id: 7, branch_id: 1, product_id: 5, customer_id: 1, quantity: 500, price: 18, total_amount: 9000, sale_type: "cash", date: "2026-03-02" },
  { id: 8, branch_id: 2, product_id: 2, customer_id: 3, quantity: 7, price: 1050, total_amount: 7350, sale_type: "direct", date: "2026-03-01" },
];

const INITIAL_PURCHASES = [
  { id: 1, product_id: 1, quantity: 200, price: 850, unit: "50kg Bag", supplier: "Suguna Feeds Ltd", date: "2026-02-25", branch_id: 1 },
  { id: 2, product_id: 2, quantity: 150, price: 920, unit: "50kg Bag", supplier: "Godrej Agrovet", date: "2026-02-26", branch_id: 2 },
  { id: 3, product_id: 3, quantity: 300, price: 720, unit: "70kg Bag", supplier: "Heritage Feeds", date: "2026-02-28", branch_id: 3 },
  { id: 4, product_id: 4, quantity: 100, price: 280, unit: "5kg Pack", supplier: "Kapila Pashu", date: "2026-03-01", branch_id: 1 },
  { id: 5, product_id: 5, quantity: 2000, price: 12, unit: "kg", supplier: "Local Farm Co", date: "2026-03-02", branch_id: 2 },
];

const INITIAL_EXPENSES = [
  { id: 1, category: "Rent", description: "Branch 1 Monthly Rent", amount: 25000, date: "2026-03-01", branch_id: 1 },
  { id: 2, category: "Salary", description: "Staff Salaries", amount: 85000, date: "2026-03-01", branch_id: null },
  { id: 3, category: "Electricity", description: "Branch 2 Electricity", amount: 4500, date: "2026-03-02", branch_id: 2 },
  { id: 4, category: "Transport", description: "Delivery charges", amount: 12000, date: "2026-03-03", branch_id: 3 },
  { id: 5, category: "Miscellaneous", description: "Office supplies", amount: 3200, date: "2026-03-04", branch_id: 1 },
];

const MONTHLY_SALES = [
  { month: "Oct", b1: 145000, b2: 132000, b3: 118000 },
  { month: "Nov", b1: 162000, b2: 148000, b3: 135000 },
  { month: "Dec", b1: 178000, b2: 165000, b3: 152000 },
  { month: "Jan", b1: 155000, b2: 141000, b3: 128000 },
  { month: "Feb", b1: 189000, b2: 173000, b3: 161000 },
  { month: "Mar", b1: 47850, b2: 31350, b3: 23100 },
];

// ─────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────
const style = document.createElement("style");
style.textContent = `
  @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500;600&family=Fraunces:ital,opsz,wght@1,9..144,300;1,9..144,400&family=Instrument+Sans:wght@400;500;600;700&display=swap');
  
  * { box-sizing: border-box; margin: 0; padding: 0; }
  
  :root {
    --earth: #1a1208;
    --earth-mid: #2d1f0a;
    --earth-light: #3d2b0f;
    --amber: #d97706;
    --amber-light: #f59e0b;
    --amber-pale: #fef3c7;
    --wheat: #fefce8;
    --cream: #fffbf0;
    --green: #065f46;
    --green-light: #059669;
    --red: #b91c1c;
    --text-main: #1c1208;
    --text-sub: #78716c;
    --border: #e7e5e4;
    --sidebar-w: 240px;
  }
  
  body { font-family: 'DM Sans', sans-serif; background: var(--cream); color: var(--text-main); }
  
  .app-wrap { display: flex; min-height: 100vh; }
  
  /* SIDEBAR */
  .sidebar {
    width: var(--sidebar-w); min-height: 100vh; background: var(--earth);
    position: fixed; top: 0; left: 0; z-index: 100;
    display: flex; flex-direction: column;
    transition: transform 0.3s ease;
  }
  .sidebar-logo {
    padding: 24px 20px 16px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }
  .sidebar-logo .logo-icon {
    font-size: 28px; margin-bottom: 6px;
  }
  .sidebar-logo h1 {
    font-family: 'Libre Baskerville', serif;
    font-size: 15px; color: var(--amber-light);
    line-height: 1.3; letter-spacing: 0.02em;
  }
  .sidebar-logo p { font-size: 11px; color: rgba(255,255,255,0.35); margin-top: 2px; }
  
  .sidebar-section { padding: 12px 0; }
  .sidebar-section-label {
    font-size: 9px; font-weight: 600; letter-spacing: 0.12em;
    color: rgba(255,255,255,0.25); padding: 0 20px 6px;
    text-transform: uppercase;
  }
  .sidebar-item {
    display: flex; align-items: center; gap: 10px;
    padding: 9px 20px; cursor: pointer;
    font-size: 13px; font-weight: 400;
    color: rgba(255,255,255,0.55);
    transition: all 0.15s ease;
    border-left: 2px solid transparent;
  }
  .sidebar-item:hover { color: rgba(255,255,255,0.9); background: rgba(255,255,255,0.04); }
  .sidebar-item.active {
    color: var(--amber-light); background: rgba(217,119,6,0.12);
    border-left-color: var(--amber);
  }
  .sidebar-item .icon { font-size: 15px; width: 18px; text-align: center; }
  
  .sidebar-footer {
    margin-top: auto; padding: 16px 20px;
    border-top: 1px solid rgba(255,255,255,0.06);
  }
  .user-chip {
    display: flex; align-items: center; gap: 10px;
  }
  .user-avatar {
    width: 32px; height: 32px; border-radius: 8px;
    background: var(--amber); display: flex; align-items: center;
    justify-content: center; font-size: 14px; font-weight: 600;
    color: var(--earth); flex-shrink: 0;
  }
  .user-info p { font-size: 12px; color: rgba(255,255,255,0.8); font-weight: 500; }
  .user-info span { font-size: 10px; color: rgba(255,255,255,0.35); }
  .logout-btn {
    margin-top: 10px; width: 100%;
    padding: 8px; border-radius: 6px;
    border: 1px solid rgba(255,255,255,0.12);
    background: transparent; color: rgba(255,255,255,0.5);
    font-family: 'DM Sans', sans-serif; font-size: 12px;
    cursor: pointer; transition: all 0.15s;
  }
  .logout-btn:hover { background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.8); }
  
  /* MAIN */
  .main-content {
    margin-left: var(--sidebar-w); flex: 1; min-height: 100vh;
    background: var(--cream);
  }
  .topbar {
    background: white; border-bottom: 1px solid var(--border);
    padding: 14px 28px; display: flex; align-items: center;
    justify-content: space-between; position: sticky; top: 0; z-index: 50;
  }
  .topbar h2 {
    font-family: 'Libre Baskerville', serif;
    font-size: 18px; font-weight: 700; color: var(--text-main);
  }
  .topbar-right { display: flex; align-items: center; gap: 12px; }
  .badge-branch {
    padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 500;
    background: var(--amber-pale); color: #92400e;
  }
  .date-chip {
    font-size: 11px; color: var(--text-sub);
    background: #f5f5f4; padding: 4px 10px; border-radius: 20px;
  }
  .page-body { padding: 24px 28px; }
  
  /* CARDS */
  .stat-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; margin-bottom: 24px; }
  .stat-card {
    background: white; border-radius: 12px; padding: 18px 20px;
    border: 1px solid var(--border); position: relative; overflow: hidden;
    transition: box-shadow 0.2s;
  }
  .stat-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.07); }
  .stat-card[style*="pointer"]:hover { box-shadow: 0 6px 20px rgba(0,0,0,0.12); transform: translateY(-1px); }
  .stat-card .accent-bar {
    position: absolute; top: 0; left: 0; right: 0; height: 3px;
  }
  .stat-card .label { font-size: 11px; font-weight: 500; color: var(--text-sub); letter-spacing: 0.04em; text-transform: uppercase; }
  .stat-card .value { font-size: 26px; font-weight: 600; margin: 6px 0 4px; }
  .stat-card .sub { font-size: 11px; color: var(--text-sub); }
  .stat-card .icon-bg {
    position: absolute; right: 16px; top: 50%; transform: translateY(-50%);
    font-size: 28px; opacity: 0.12;
  }
  
  /* CHART CARDS */
  .chart-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 16px; margin-bottom: 24px; }
  .chart-grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 24px; }
  .card {
    background: white; border-radius: 12px; border: 1px solid var(--border);
    padding: 20px;
  }
  .card-title {
    font-family: 'Libre Baskerville', serif;
    font-size: 14px; font-weight: 700; color: var(--text-main);
    margin-bottom: 16px; display: flex; align-items: center; gap: 8px;
  }
  .card-title span { font-family: 'DM Sans', sans-serif; font-size: 11px; font-weight: 400; color: var(--text-sub); margin-left: auto; }
  
  /* TABLE */
  .table-wrap { background: white; border-radius: 12px; border: 1px solid var(--border); overflow: hidden; }
  .table-header {
    padding: 14px 20px; border-bottom: 1px solid var(--border);
    display: flex; align-items: center; justify-content: space-between;
  }
  .table-title { font-family: 'Libre Baskerville', serif; font-size: 14px; font-weight: 700; }
  .table-actions { display: flex; gap: 8px; }
  table { width: 100%; border-collapse: collapse; }
  th {
    text-align: left; padding: 10px 16px; font-size: 11px;
    font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase;
    color: var(--text-sub); background: #fafaf9; border-bottom: 1px solid var(--border);
  }
  td { padding: 11px 16px; font-size: 13px; border-bottom: 1px solid #f5f5f4; }
  tr:last-child td { border-bottom: none; }
  tr:hover td { background: #fafaf9; }
  
  /* BUTTONS */
  .btn {
    padding: 8px 14px; border-radius: 8px; font-family: 'DM Sans', sans-serif;
    font-size: 12px; font-weight: 500; cursor: pointer; transition: all 0.15s;
    border: 1px solid transparent; display: inline-flex; align-items: center; gap: 6px;
  }
  .btn-primary { background: var(--amber); color: white; border-color: var(--amber); }
  .btn-primary:hover { background: var(--amber-light); }
  .btn-outline { background: white; color: var(--text-main); border-color: var(--border); }
  .btn-outline:hover { background: #fafaf9; border-color: #d4d4d4; }
  .btn-green { background: var(--green); color: white; }
  .btn-green:hover { background: var(--green-light); }
  .btn-red { background: #fee2e2; color: var(--red); border-color: #fecaca; }
  .btn-red:hover { background: #fecaca; }
  .btn-sm { padding: 5px 10px; font-size: 11px; }
  .btn-wa { background: #25d366; color: white; }
  .btn-wa:hover { background: #22c55e; }
  
  /* BADGE */
  .badge { padding: 3px 8px; border-radius: 20px; font-size: 11px; font-weight: 500; }
  .badge-cash { background: #d1fae5; color: #065f46; }
  .badge-credit { background: #fee2e2; color: #991b1b; }
  .badge-direct { background: #dbeafe; color: #1d4ed8; }
  .badge-low { background: #fef3c7; color: #92400e; }
  .badge-ok { background: #d1fae5; color: #065f46; }
  
  /* FORM */
  .form-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 14px; margin-bottom: 16px; }
  .form-field { display: flex; flex-direction: column; gap: 5px; }
  .form-field label { font-size: 11px; font-weight: 600; color: var(--text-sub); text-transform: uppercase; letter-spacing: 0.05em; }
  .form-field input, .form-field select, .form-field textarea {
    padding: 9px 12px; border-radius: 8px; border: 1px solid var(--border);
    font-family: 'DM Sans', sans-serif; font-size: 13px; background: white;
    color: var(--text-main); transition: border 0.15s; outline: none;
  }
  .form-field input:focus, .form-field select:focus { border-color: var(--amber); }
  
  /* LOGIN */
  .login-wrap {
    min-height: 100vh; display: flex; align-items: center; justify-content: center;
    background: var(--earth);
    background-image: radial-gradient(ellipse at 30% 70%, rgba(217,119,6,0.18) 0%, transparent 60%),
                      radial-gradient(ellipse at 80% 20%, rgba(6,95,70,0.12) 0%, transparent 50%);
  }
  .login-card {
    background: white; border-radius: 16px; padding: 40px 36px;
    width: 100%; max-width: 400px; box-shadow: 0 24px 64px rgba(0,0,0,0.4);
  }
  .login-logo { text-align: center; margin-bottom: 28px; }
  .login-logo .icon { font-size: 40px; }
  .login-logo h1 { font-family: 'Libre Baskerville', serif; font-size: 22px; margin: 8px 0 4px; color: var(--text-main); }
  .login-logo p { font-size: 13px; color: var(--text-sub); }
  
  /* TABS */
  .tabs { display: flex; gap: 4px; background: #f5f5f4; padding: 4px; border-radius: 10px; margin-bottom: 20px; width: fit-content; }
  .tab { padding: 6px 14px; border-radius: 7px; font-size: 12px; font-weight: 500; cursor: pointer; color: var(--text-sub); transition: all 0.15s; }
  .tab.active { background: white; color: var(--text-main); box-shadow: 0 1px 4px rgba(0,0,0,0.1); }
  
  /* MODAL */
  .modal-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.5);
    display: flex; align-items: center; justify-content: center; z-index: 200;
    padding: 20px;
  }
  .modal {
    background: white; border-radius: 16px; padding: 28px;
    width: 100%; max-width: 560px; max-height: 80vh; overflow-y: auto;
  }
  .modal-title { font-family: 'Libre Baskerville', serif; font-size: 18px; font-weight: 700; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }
  .modal-close { cursor: pointer; font-size: 18px; color: var(--text-sub); padding: 4px; }
  
  /* ALERT */
  .alert { padding: 10px 14px; border-radius: 8px; font-size: 13px; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }
  .alert-warning { background: #fef3c7; color: #92400e; border: 1px solid #fde68a; }
  .alert-success { background: #d1fae5; color: #065f46; border: 1px solid #a7f3d0; }
  .alert-info { background: #dbeafe; color: #1e40af; border: 1px solid #bfdbfe; }
  
  /* DIVIDER */
  .divider { height: 1px; background: var(--border); margin: 20px 0; }
  
  /* SUMMARY ROW */
  .summary-row { display: flex; gap: 16px; padding: 12px 16px; background: #fafaf9; border-top: 1px solid var(--border); font-size: 13px; }
  .summary-row strong { font-weight: 600; }
  
  /* PROFIT */
  .profit-positive { color: var(--green); font-weight: 600; }
  .profit-negative { color: var(--red); font-weight: 600; }
  
  /* SCROLLBAR */
  ::-webkit-scrollbar { width: 5px; height: 5px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #d4d4d4; border-radius: 999px; }
  
  /* RESPONSIVE */
  @media (max-width: 900px) {
    .chart-grid { grid-template-columns: 1fr; }
    .chart-grid-3 { grid-template-columns: 1fr; }
  }
  @media (max-width: 700px) {
    :root { --sidebar-w: 0px; }
    .sidebar { transform: translateX(-240px); }
    .main-content { margin-left: 0; }
  }
  
  /* TOOLTIP CUSTOM */
  .recharts-tooltip-wrapper .recharts-default-tooltip {
    border-radius: 8px !important; border: 1px solid var(--border) !important;
    font-family: 'DM Sans', sans-serif !important; font-size: 12px !important;
  }
  
  .section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
  .section-header h3 { font-family: 'Libre Baskerville', serif; font-size: 16px; font-weight: 700; }
  
  /* BALANCE SHEET */
  .bs-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px; }
  .bs-card { background: white; border-radius: 12px; border: 1px solid var(--border); overflow: hidden; }
  .bs-card-title { padding: 14px 18px; font-family: 'Libre Baskerville', serif; font-size: 13px; font-weight: 700; border-bottom: 1px solid var(--border); }
  .bs-row { display: flex; justify-content: space-between; padding: 10px 18px; font-size: 13px; border-bottom: 1px solid #f5f5f4; }
  .bs-row:last-child { border-bottom: none; }
  .bs-total { display: flex; justify-content: space-between; padding: 12px 18px; background: #fafaf9; font-size: 13px; font-weight: 600; border-top: 1px solid var(--border); }
  
  .empty-state { text-align: center; padding: 40px; color: var(--text-sub); }
  .empty-state .icon { font-size: 36px; margin-bottom: 10px; }
  .empty-state p { font-size: 14px; }
  @keyframes cp-pulse { 0%,100%{opacity:.4} 50%{opacity:1} }
`;
document.head.appendChild(style);

// ─────────────────────────────────────────
// UTILITY
// ─────────────────────────────────────────
const fmt = (n) => "₹" + Number(n).toLocaleString("en-IN");
const today = () => new Date().toISOString().split("T")[0];
const COLORS = ["#d97706", "#065f46", "#b91c1c", "#1d4ed8", "#7c3aed", "#0891b2"];

// ─────────────────────────────────────────
// LOGIN PAGE
// ─────────────────────────────────────────
function LoginPage({ onLogin }) {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleLogin = () => {
    const u = MOCK_USERS.find(u => u.username === form.username && u.password === form.password);
    if (u) { onLogin(u); setError(""); }
    else setError("Invalid credentials. Try admin/admin123 or branch1/branch1");
  };

  return (
    <div className="login-wrap">
      <div className="login-card">
        <div className="login-logo">
          <div className="icon">🐄</div>
          <h1>GreenField Feeds</h1>
          <p>Business Management System</p>
        </div>
        {error && <div className="alert alert-warning">⚠️ {error}</div>}
        <div className="form-field" style={{marginBottom: 12}}>
          <label>Username</label>
          <input value={form.username} onChange={e => setForm({...form, username: e.target.value})}
            onKeyDown={e => e.key === "Enter" && handleLogin()} placeholder="admin / branch1 / branch2 / branch3" />
        </div>
        <div className="form-field" style={{marginBottom: 20}}>
          <label>Password</label>
          <input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})}
            onKeyDown={e => e.key === "Enter" && handleLogin()} placeholder="••••••••" />
        </div>
        <button className="btn btn-primary" style={{width:"100%", justifyContent:"center", padding:"11px"}}
          onClick={handleLogin}>Sign In →</button>
        <div style={{marginTop:16, padding:12, background:"#fafaf9", borderRadius:8, fontSize:11, color:"#78716c"}}>
          <strong>Demo:</strong> admin/admin123 · branch1/branch1 · branch2/branch2 · branch3/branch3
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// SIDEBAR
// ─────────────────────────────────────────
function Sidebar({ user, page, setPage, onLogout }) {
  const isAdmin = user.role === "admin";
  const [confirmLogout, setConfirmLogout] = useState(false);

  const adminNav = [
    { group: "Overview", items: [{ id: "dashboard", icon: "📊", label: "Dashboard" }] },
    { group: "Inventory", items: [
      { id: "products", icon: "🌾", label: "Products" },
      { id: "purchases", icon: "🚚", label: "Purchases" },
      { id: "stock", icon: "📦", label: "Stock" },
    ]},
    { group: "Operations", items: [
      { id: "sales-entry", icon: "➕", label: "New Sale" },
      { id: "sales", icon: "🧾", label: "Sales History" },
      { id: "customers", icon: "👥", label: "Customers" },
      { id: "expenses", icon: "💰", label: "Expenses" },
    ]},
    { group: "Analytics", items: [
      { id: "reports", icon: "📈", label: "Reports" },
      { id: "balance", icon: "⚖️", label: "Balance Sheet" },
    ]},
  ];

  const branchNav = [
    { group: "Overview", items: [{ id: "branch-dash", icon: "📊", label: "Dashboard" }] },
    { group: "Operations", items: [
      { id: "sales-entry", icon: "🧾", label: "New Sale" },
      { id: "sales", icon: "📋", label: "Sales History" },
      { id: "customers", icon: "👥", label: "Customers" },
    ]},
    { group: "Inventory", items: [{ id: "stock", icon: "📦", label: "Stock" }] },
  ];

  const nav = isAdmin ? adminNav : branchNav;
  const branchName = isAdmin ? null : BRANCHES.find(b => b.id === user.branch_id)?.name;

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">🐄</div>
        <h1>GreenField Feeds</h1>
        <p>Business Manager v1.0</p>
      </div>
      <div style={{overflowY:"auto", flex:1}}>
        {nav.map(g => (
          <div className="sidebar-section" key={g.group}>
            <div className="sidebar-section-label">{g.group}</div>
            {g.items.map(item => (
              <div key={item.id}
                className={`sidebar-item${page === item.id ? " active" : ""}`}
                onClick={() => setPage(item.id)}>
                <span className="icon">{item.icon}</span>
                {item.label}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="sidebar-footer">
        <div className="user-chip">
          <div className="user-avatar">{user.name[0]}</div>
          <div className="user-info">
            <p>{user.name.split(" ")[0]}</p>
            <span>{isAdmin ? "Administrator" : branchName?.split(" - ")[0]}</span>
          </div>
        </div>
        {!confirmLogout ? (
          <button className="logout-btn" onClick={() => setConfirmLogout(true)}>↩ Sign Out</button>
        ) : (
          <div style={{marginTop:10,background:"rgba(185,28,28,0.12)",borderRadius:8,padding:"10px 12px"}}>
            <p style={{fontSize:11,color:"#fca5a5",marginBottom:8}}>Sure you want to sign out?</p>
            <div style={{display:"flex",gap:6}}>
              <button onClick={onLogout}
                style={{flex:1,padding:"6px",borderRadius:6,background:"#b91c1c",color:"white",border:"none",fontSize:11,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>
                Yes, Logout
              </button>
              <button onClick={() => setConfirmLogout(false)}
                style={{flex:1,padding:"6px",borderRadius:6,background:"rgba(255,255,255,0.1)",color:"rgba(255,255,255,0.7)",border:"1px solid rgba(255,255,255,0.15)",fontSize:11,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// ADMIN DASHBOARD
// ─────────────────────────────────────────
function AdminDashboard({ sales, purchases, customers, expenses, products, setPage }) {
  const [showCustomersModal, setShowCustomersModal] = useState(false);
  const [custSearch, setCustSearch] = useState("");
  const [custFilter, setCustFilter] = useState("");

  const todaySales = sales.filter(s => s.date === "2026-03-04").reduce((sum, s) => sum + s.total_amount, 0);
  const monthSales = sales.reduce((sum, s) => sum + s.total_amount, 0);
  const totalCredit = customers.reduce((sum, c) => sum + c.credit_balance, 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalPurchases = purchases.reduce((sum, p) => sum + p.quantity * p.price, 0);
  const profit = monthSales - totalPurchases - totalExpenses;

  const branchSales = BRANCHES.map(b => ({
    name: b.location,
    sales: sales.filter(s => s.branch_id === b.id).reduce((sum, s) => sum + s.total_amount, 0),
  }));

  const productSales = products.map(p => ({
    name: p.product_name.split(" ").slice(0, 2).join(" "),
    value: sales.filter(s => s.product_id === p.id).reduce((sum, s) => sum + s.total_amount, 0),
  })).filter(p => p.value > 0);

  const lowStock = products.filter(p => p.stock < 20);

  return (
    <div className="page-body">
      <div className="stat-grid">
        {[
          { label: "Today's Sales", value: fmt(todaySales), sub: "03 Mar 2026", icon: "🧾", color: "#d97706", action: () => setPage("sales") },
          { label: "Monthly Sales", value: fmt(monthSales), sub: "All Branches", icon: "📈", color: "#065f46", action: () => setPage("reports") },
          { label: "Profit (MTD)", value: fmt(profit), sub: "Sales - Purchases - Exp", icon: "💵", color: profit > 0 ? "#065f46" : "#b91c1c", action: () => setPage("balance") },
          { label: "Credit Outstanding", value: fmt(totalCredit), sub: `${customers.filter(c => c.credit_balance > 0).length} customers`, icon: "⚠️", color: "#b91c1c", action: () => setPage("customers") },
          { label: "Total Customers", value: customers.length, sub: "Click to view all", icon: "👥", color: "#1d4ed8", action: () => setShowCustomersModal(true) },
          { label: "Total Products", value: products.length, sub: `${lowStock.length} low stock`, icon: "🌾", color: "#7c3aed", action: () => setPage("products") },
        ].map((s, i) => (
          <div className="stat-card" key={i} onClick={s.action}
            style={{cursor: s.action ? "pointer" : "default", transition:"all 0.15s"}}>
            <div className="accent-bar" style={{background: s.color}}></div>
            <div className="label">{s.label}</div>
            <div className="value" style={{color: s.color}}>{s.value}</div>
            <div className="sub">{s.sub}</div>
            <div className="icon-bg">{s.icon}</div>
          </div>
        ))}
      </div>

      {/* CUSTOMER DETAILS MODAL */}
      {showCustomersModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowCustomersModal(false)}>
          <div className="modal" style={{maxWidth:680}}>
            <div className="modal-title">
              👥 All Customers ({customers.length})
              <span className="modal-close" onClick={() => setShowCustomersModal(false)}>✕</span>
            </div>
            {/* Search & Filter */}
            <div style={{display:"flex",gap:10,marginBottom:16,flexWrap:"wrap"}}>
              <input placeholder="🔍 Search by name or phone..."
                value={custSearch} onChange={e => setCustSearch(e.target.value)}
                style={{flex:1,minWidth:180,padding:"8px 12px",borderRadius:8,border:"1px solid #e7e5e4",fontSize:12,fontFamily:"'DM Sans',sans-serif",outline:"none"}} />
              <select value={custFilter} onChange={e => setCustFilter(e.target.value)}
                style={{padding:"8px 10px",borderRadius:8,border:"1px solid #e7e5e4",fontSize:12,fontFamily:"'DM Sans',sans-serif"}}>
                <option value="">All Branches</option>
                {BRANCHES.map(b => <option key={b.id} value={b.id}>{b.location}</option>)}
              </select>
              <select style={{padding:"8px 10px",borderRadius:8,border:"1px solid #e7e5e4",fontSize:12,fontFamily:"'DM Sans',sans-serif"}}
                onChange={e => setCustFilter(e.target.value === "credit" ? "credit" : e.target.value)}>
                <option value="">All Status</option>
                <option value="credit">Has Credit</option>
                <option value="clear">Clear</option>
              </select>
            </div>
            {/* Summary */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:16}}>
              {[
                {label:"Total Customers", val: customers.length, color:"#1d4ed8"},
                {label:"With Credit", val: customers.filter(c=>c.credit_balance>0).length, color:"#b91c1c"},
                {label:"Total Outstanding", val: fmt(totalCredit), color:"#d97706"},
              ].map((s,i) => (
                <div key={i} style={{background:"#fafaf9",borderRadius:8,padding:"10px 14px",textAlign:"center"}}>
                  <div style={{fontSize:10,color:"#78716c",textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:3}}>{s.label}</div>
                  <div style={{fontSize:18,fontWeight:700,color:s.color}}>{s.val}</div>
                </div>
              ))}
            </div>
            {/* Table */}
            <div style={{overflowX:"auto",maxHeight:380,overflowY:"auto",borderRadius:8,border:"1px solid #e7e5e4"}}>
              <table style={{width:"100%",borderCollapse:"collapse"}}>
                <thead style={{position:"sticky",top:0,zIndex:1}}>
                  <tr>
                    <th style={{textAlign:"left",padding:"9px 14px",fontSize:10,fontWeight:600,letterSpacing:"0.06em",textTransform:"uppercase",color:"#78716c",background:"#fafaf9",borderBottom:"1px solid #e7e5e4"}}>#</th>
                    <th style={{textAlign:"left",padding:"9px 14px",fontSize:10,fontWeight:600,letterSpacing:"0.06em",textTransform:"uppercase",color:"#78716c",background:"#fafaf9",borderBottom:"1px solid #e7e5e4"}}>Name</th>
                    <th style={{textAlign:"left",padding:"9px 14px",fontSize:10,fontWeight:600,letterSpacing:"0.06em",textTransform:"uppercase",color:"#78716c",background:"#fafaf9",borderBottom:"1px solid #e7e5e4"}}>Phone</th>
                    <th style={{textAlign:"left",padding:"9px 14px",fontSize:10,fontWeight:600,letterSpacing:"0.06em",textTransform:"uppercase",color:"#78716c",background:"#fafaf9",borderBottom:"1px solid #e7e5e4"}}>Branch</th>
                    <th style={{textAlign:"left",padding:"9px 14px",fontSize:10,fontWeight:600,letterSpacing:"0.06em",textTransform:"uppercase",color:"#78716c",background:"#fafaf9",borderBottom:"1px solid #e7e5e4"}}>Total Purchases</th>
                    <th style={{textAlign:"left",padding:"9px 14px",fontSize:10,fontWeight:600,letterSpacing:"0.06em",textTransform:"uppercase",color:"#78716c",background:"#fafaf9",borderBottom:"1px solid #e7e5e4"}}>Credit Balance</th>
                    <th style={{textAlign:"left",padding:"9px 14px",fontSize:10,fontWeight:600,letterSpacing:"0.06em",textTransform:"uppercase",color:"#78716c",background:"#fafaf9",borderBottom:"1px solid #e7e5e4"}}>Status</th>
                    <th style={{textAlign:"left",padding:"9px 14px",fontSize:10,fontWeight:600,letterSpacing:"0.06em",textTransform:"uppercase",color:"#78716c",background:"#fafaf9",borderBottom:"1px solid #e7e5e4"}}>WhatsApp</th>
                  </tr>
                </thead>
                <tbody>
                  {customers
                    .filter(c =>
                      (!custSearch || c.name.toLowerCase().includes(custSearch.toLowerCase()) || c.phone.includes(custSearch)) &&
                      (!custFilter || custFilter === "credit" ? c.credit_balance > 0 : custFilter === "clear" ? c.credit_balance === 0 : c.branch_id === +custFilter)
                    )
                    .map((c, idx) => {
                      const branch = BRANCHES.find(b => b.id === c.branch_id);
                      const custTotal = sales.filter(s => s.customer_id === c.id).reduce((sum,s) => sum+s.total_amount, 0);
                      return (
                        <tr key={c.id} style={{borderBottom:"1px solid #f5f5f4"}}>
                          <td style={{padding:"10px 14px",fontSize:12,color:"#78716c"}}>{idx+1}</td>
                          <td style={{padding:"10px 14px",fontSize:13,fontWeight:500}}>{c.name}</td>
                          <td style={{padding:"10px 14px",fontSize:12,color:"#78716c"}}>+91 {c.phone}</td>
                          <td style={{padding:"10px 14px"}}>
                            <span style={{padding:"2px 8px",borderRadius:20,fontSize:10,fontWeight:500,background:"#dbeafe",color:"#1d4ed8"}}>{branch?.location}</span>
                          </td>
                          <td style={{padding:"10px 14px",fontSize:13,fontWeight:600,color:"#065f46"}}>{fmt(custTotal)}</td>
                          <td style={{padding:"10px 14px",fontSize:13,fontWeight:700,color: c.credit_balance > 0 ? "#b91c1c" : "#065f46"}}>{fmt(c.credit_balance)}</td>
                          <td style={{padding:"10px 14px"}}>
                            <span style={{padding:"3px 8px",borderRadius:20,fontSize:11,fontWeight:500,
                              background: c.credit_balance > 0 ? "#fee2e2" : "#d1fae5",
                              color: c.credit_balance > 0 ? "#991b1b" : "#065f46"}}>
                              {c.credit_balance > 0 ? "⚠️ Credit" : "✓ Clear"}
                            </span>
                          </td>
                          <td style={{padding:"10px 14px"}}>
                            <a href={`https://wa.me/91${c.phone}`} target="_blank" rel="noreferrer">
                              <button style={{padding:"4px 10px",borderRadius:6,background:"#25d366",color:"white",border:"none",fontSize:11,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>📱 Chat</button>
                            </a>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
            <div style={{marginTop:12,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{fontSize:12,color:"#78716c"}}>{customers.filter(c => (!custSearch || c.name.toLowerCase().includes(custSearch.toLowerCase()) || c.phone.includes(custSearch))).length} results</span>
              <button className="btn btn-primary btn-sm" onClick={() => { setShowCustomersModal(false); setPage("customers"); }}>
                Open Customers Page →
              </button>
            </div>
          </div>
        </div>
      )}

      {lowStock.length > 0 && (
        <div className="alert alert-warning" style={{marginBottom: 20}}>
          ⚠️ Low stock alert: {lowStock.map(p => p.product_name).join(", ")}
        </div>
      )}

      <div className="chart-grid">
        <div className="card">
          <div className="card-title">📊 Monthly Sales by Branch <span>Last 6 Months</span></div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={MONTHLY_SALES} barSize={14}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f4" />
              <XAxis dataKey="month" tick={{fontSize:11}} />
              <YAxis tick={{fontSize:10}} tickFormatter={v => "₹"+v/1000+"K"} />
              <Tooltip formatter={v => fmt(v)} />
              <Legend wrapperStyle={{fontSize:11}} />
              <Bar dataKey="b1" name="Branch 1" fill="#d97706" radius={[3,3,0,0]} />
              <Bar dataKey="b2" name="Branch 2" fill="#065f46" radius={[3,3,0,0]} />
              <Bar dataKey="b3" name="Branch 3" fill="#1d4ed8" radius={[3,3,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card">
          <div className="card-title">🥧 Product Revenue Share</div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={productSales} cx="50%" cy="50%" innerRadius={50} outerRadius={85}
                dataKey="value" nameKey="name" paddingAngle={3}>
                {productSales.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={v => fmt(v)} />
              <Legend wrapperStyle={{fontSize:10}} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="chart-grid">
        <div className="card">
          <div className="card-title">📉 Sales Trend <span>Last 6 Months — All Branches</span></div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={MONTHLY_SALES}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f4" />
              <XAxis dataKey="month" tick={{fontSize:11}} />
              <YAxis tick={{fontSize:10}} tickFormatter={v => "₹"+v/1000+"K"} />
              <Tooltip formatter={v => fmt(v)} />
              <Legend wrapperStyle={{fontSize:11}} />
              <Line type="monotone" dataKey="b1" name="Branch 1" stroke="#d97706" strokeWidth={2} dot={{r:3}} />
              <Line type="monotone" dataKey="b2" name="Branch 2" stroke="#065f46" strokeWidth={2} dot={{r:3}} />
              <Line type="monotone" dataKey="b3" name="Branch 3" stroke="#1d4ed8" strokeWidth={2} dot={{r:3}} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="card">
          <div className="card-title">🏪 Branch Performance</div>
          {branchSales.map((b, i) => {
            const pct = Math.round((b.sales / monthSales) * 100);
            return (
              <div key={i} style={{marginBottom:12}}>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:4}}>
                  <span>{b.name}</span>
                  <span style={{fontWeight:600}}>{fmt(b.sales)} ({pct}%)</span>
                </div>
                <div style={{height:6,background:"#f5f5f4",borderRadius:999}}>
                  <div style={{height:6,background:COLORS[i],borderRadius:999,width:pct+"%",transition:"width 1s"}}></div>
                </div>
              </div>
            );
          })}
          <div className="divider" style={{margin:"14px 0"}}/>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:13}}>
            <span style={{color:"#78716c"}}>Total Expenses</span>
            <span style={{fontWeight:600,color:"#b91c1c"}}>{fmt(totalExpenses)}</span>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:13,marginTop:6}}>
            <span style={{color:"#78716c"}}>Net Profit</span>
            <span className={profit > 0 ? "profit-positive" : "profit-negative"}>{fmt(profit)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// PRODUCTS PAGE
// ─────────────────────────────────────────
// PRODUCTS PAGE
// ─────────────────────────────────────────
function ProductsPage({ products, setProducts, units, setUnits }) {
  const [modal, setModal] = useState(false);
  const [unitModal, setUnitModal] = useState(false);
  const [form, setForm] = useState({ product_name: "", brand: "", purchase_price: "", selling_price: "", unit: units[0]?.label || "50kg Bag", stock: "" });
  const [editId, setEditId] = useState(null);

  // Unit manager state
  const [newUnitLabel, setNewUnitLabel] = useState("");
  const [editUnitId, setEditUnitId] = useState(null);
  const [editUnitLabel, setEditUnitLabel] = useState("");
  const [unitError, setUnitError] = useState("");
  const [deleteUnitConfirm, setDeleteUnitConfirm] = useState(null);

  const save = () => {
    if (!form.product_name) return;
    if (editId) {
      setProducts(products.map(p => p.id === editId ? {...p, ...form, purchase_price: +form.purchase_price, selling_price: +form.selling_price, stock: +form.stock} : p));
    } else {
      setProducts([...products, { id: Date.now(), ...form, purchase_price: +form.purchase_price, selling_price: +form.selling_price, stock: +form.stock || 0 }]);
    }
    setModal(false);
    setForm({ product_name: "", brand: "", purchase_price: "", selling_price: "", unit: units[0]?.label || "50kg Bag", stock: "" });
    setEditId(null);
  };

  const edit = (p) => {
    setForm({...p, purchase_price: String(p.purchase_price), selling_price: String(p.selling_price), stock: String(p.stock)});
    setEditId(p.id); setModal(true);
  };
  const del = (id) => setProducts(products.filter(p => p.id !== id));
  const margin = (p) => Math.round(((p.selling_price - p.purchase_price) / p.purchase_price) * 100);

  // Unit CRUD
  const addUnit = () => {
    const trimmed = newUnitLabel.trim();
    if (!trimmed) { setUnitError("Unit name cannot be empty."); return; }
    if (units.some(u => u.label.toLowerCase() === trimmed.toLowerCase())) { setUnitError("This unit already exists."); return; }
    setUnits(prev => [...prev, { id: Date.now(), label: trimmed }]);
    setNewUnitLabel(""); setUnitError("");
  };

  const startEditUnit = (u) => { setEditUnitId(u.id); setEditUnitLabel(u.label); setUnitError(""); };
  const saveEditUnit = () => {
    const trimmed = editUnitLabel.trim();
    if (!trimmed) { setUnitError("Unit name cannot be empty."); return; }
    if (units.some(u => u.id !== editUnitId && u.label.toLowerCase() === trimmed.toLowerCase())) { setUnitError("This unit already exists."); return; }
    const old = units.find(u => u.id === editUnitId)?.label;
    setUnits(prev => prev.map(u => u.id === editUnitId ? {...u, label: trimmed} : u));
    // Update existing products that used this unit
    if (old) setProducts(prev => prev.map(p => p.unit === old ? {...p, unit: trimmed} : p));
    setEditUnitId(null); setEditUnitLabel(""); setUnitError("");
  };

  const deleteUnit = (id) => {
    const label = units.find(u => u.id === id)?.label;
    const inUse = products.some(p => p.unit === label);
    if (inUse) { setUnitError(`"${label}" is used by ${products.filter(p=>p.unit===label).length} product(s). Reassign first.`); setDeleteUnitConfirm(null); return; }
    setUnits(prev => prev.filter(u => u.id !== id));
    setDeleteUnitConfirm(null); setUnitError("");
  };

  return (
    <div className="page-body">
      <div className="section-header">
        <h3>🌾 Products</h3>
        <div className="table-actions">
          <button className="btn btn-outline btn-sm" onClick={() => { setUnitModal(true); setUnitError(""); setNewUnitLabel(""); setEditUnitId(null); }}>
            📐 Manage Units
          </button>
          <button className="btn btn-outline btn-sm">⬇ Export</button>
          <button className="btn btn-primary btn-sm" onClick={() => {
            setModal(true); setEditId(null);
            setForm({ product_name: "", brand: "", purchase_price: "", selling_price: "", unit: units[0]?.label || "", stock: "" });
          }}>+ Add Product</button>
        </div>
      </div>

      <div className="table-wrap">
        <table>
          <thead><tr>
            <th>Product Name</th><th>Brand</th><th>Purchase Price</th>
            <th>Selling Price</th><th>Margin</th><th>Unit</th><th>Stock</th><th>Actions</th>
          </tr></thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id}>
                <td style={{fontWeight:500}}>{p.product_name}</td>
                <td style={{color:"#78716c"}}>{p.brand}</td>
                <td>{fmt(p.purchase_price)}</td>
                <td style={{fontWeight:600,color:"#065f46"}}>{fmt(p.selling_price)}</td>
                <td><span className="badge" style={{background:"#d1fae5",color:"#065f46"}}>{margin(p)}%</span></td>
                <td>
                  <span style={{padding:"2px 8px",borderRadius:20,fontSize:11,fontWeight:500,background:"#f1f5f9",color:"#475569",border:"1px solid #e2e8f0"}}>
                    {p.unit}
                  </span>
                </td>
                <td>
                  <span className={`badge ${p.stock < 20 ? "badge-low" : "badge-ok"}`}>{p.stock}</span>
                </td>
                <td>
                  <button className="btn btn-outline btn-sm" onClick={() => edit(p)} style={{marginRight:6}}>✏️</button>
                  <button className="btn btn-red btn-sm" onClick={() => del(p.id)}>🗑</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── ADD / EDIT PRODUCT MODAL ── */}
      {modal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModal(false)}>
          <div className="modal">
            <div className="modal-title">
              {editId ? "✏️ Edit Product" : "🌾 Add Product"}
              <span className="modal-close" onClick={() => setModal(false)}>✕</span>
            </div>
            <div className="form-grid">
              <div className="form-field" style={{gridColumn:"span 2"}}>
                <label>Product Name</label>
                <input value={form.product_name} onChange={e => setForm({...form, product_name: e.target.value})} placeholder="e.g. Cattle Feed Premium" />
              </div>
              <div className="form-field"><label>Brand</label><input value={form.brand} onChange={e => setForm({...form, brand: e.target.value})} /></div>
              <div className="form-field">
                <label style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                  Unit
                  <span onClick={() => { setModal(false); setUnitModal(true); setUnitError(""); setNewUnitLabel(""); setEditUnitId(null); }}
                    style={{fontSize:10,color:"#d97706",cursor:"pointer",fontWeight:600,letterSpacing:"0.03em"}}>
                    + Manage Units
                  </span>
                </label>
                <select value={form.unit} onChange={e => setForm({...form, unit: e.target.value})}>
                  {units.map(u => <option key={u.id} value={u.label}>{u.label}</option>)}
                </select>
              </div>
              <div className="form-field"><label>Purchase Price (₹)</label><input type="number" value={form.purchase_price} onChange={e => setForm({...form, purchase_price: e.target.value})} /></div>
              <div className="form-field"><label>Selling Price (₹)</label><input type="number" value={form.selling_price} onChange={e => setForm({...form, selling_price: e.target.value})} /></div>
              {editId && <div className="form-field"><label>Current Stock</label><input type="number" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} /></div>}
            </div>
            <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
              <button className="btn btn-outline" onClick={() => setModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={save}>{editId ? "Update" : "Add Product"}</button>
            </div>
          </div>
        </div>
      )}

      {/* ── MANAGE UNITS MODAL ── */}
      {unitModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setUnitModal(false)}>
          <div className="modal" style={{maxWidth: 480}}>
            <div className="modal-title">
              📐 Manage Units
              <span className="modal-close" onClick={() => setUnitModal(false)}>✕</span>
            </div>

            <p style={{fontSize:12,color:"#78716c",marginBottom:16,lineHeight:1.5}}>
              Add, rename or delete units. Renaming a unit automatically updates all existing products using it.
            </p>

            {unitError && (
              <div style={{background:"#fee2e2",color:"#b91c1c",borderRadius:8,padding:"9px 13px",fontSize:12,marginBottom:14,display:"flex",alignItems:"center",gap:6}}>
                ⚠️ {unitError}
                <span style={{marginLeft:"auto",cursor:"pointer",fontWeight:700}} onClick={() => setUnitError("")}>✕</span>
              </div>
            )}

            {/* Add new unit */}
            <div style={{background:"#fffbf0",border:"1px solid #fde68a",borderRadius:10,padding:"14px",marginBottom:16}}>
              <div style={{fontSize:11,fontWeight:700,color:"#92400e",marginBottom:10,textTransform:"uppercase",letterSpacing:"0.06em"}}>
                ➕ Add New Unit
              </div>
              <div style={{display:"flex",gap:8}}>
                <input
                  value={newUnitLabel}
                  onChange={e => { setNewUnitLabel(e.target.value); setUnitError(""); }}
                  onKeyDown={e => e.key === "Enter" && addUnit()}
                  placeholder="e.g. 100kg Bag, Tonne, Quintal…"
                  style={{flex:1,padding:"9px 12px",borderRadius:8,border:"1px solid #fde68a",fontSize:13,fontFamily:"'DM Sans',sans-serif",outline:"none",background:"white"}}
                />
                <button onClick={addUnit}
                  style={{padding:"9px 16px",borderRadius:8,background:"#d97706",color:"white",border:"none",fontSize:12,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontWeight:500,whiteSpace:"nowrap"}}>
                  Add Unit
                </button>
              </div>
            </div>

            {/* Existing units list */}
            <div style={{fontSize:11,fontWeight:700,color:"#78716c",textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:8}}>
              Current Units ({units.length})
            </div>
            <div style={{border:"1px solid #e7e5e4",borderRadius:10,overflow:"hidden",maxHeight:300,overflowY:"auto"}}>
              {units.map((u, idx) => {
                const inUseCount = products.filter(p => p.unit === u.label).length;
                const isEditing = editUnitId === u.id;
                return (
                  <div key={u.id} style={{
                    display:"flex", alignItems:"center", gap:10, padding:"10px 14px",
                    borderBottom: idx < units.length - 1 ? "1px solid #f5f5f4" : "none",
                    background: deleteUnitConfirm === u.id ? "#fef2f2" : isEditing ? "#fffbf0" : "white",
                    transition:"background 0.2s",
                  }}>
                    {isEditing ? (
                      <>
                        <input
                          value={editUnitLabel}
                          onChange={e => { setEditUnitLabel(e.target.value); setUnitError(""); }}
                          onKeyDown={e => { if(e.key==="Enter") saveEditUnit(); if(e.key==="Escape") setEditUnitId(null); }}
                          autoFocus
                          style={{flex:1,padding:"6px 10px",borderRadius:7,border:"2px solid #d97706",fontSize:13,fontFamily:"'DM Sans',sans-serif",outline:"none",background:"white"}}
                        />
                        <button onClick={saveEditUnit}
                          style={{padding:"5px 12px",borderRadius:6,background:"#065f46",color:"white",border:"none",fontSize:11,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontWeight:500}}>
                          ✓ Save
                        </button>
                        <button onClick={() => { setEditUnitId(null); setUnitError(""); }}
                          style={{padding:"5px 10px",borderRadius:6,background:"#f5f5f4",color:"#78716c",border:"1px solid #e7e5e4",fontSize:11,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>
                          Cancel
                        </button>
                      </>
                    ) : deleteUnitConfirm === u.id ? (
                      <>
                        <span style={{flex:1,fontSize:13,fontWeight:500,color:"#b91c1c"}}>Delete "{u.label}"?</span>
                        <button onClick={() => deleteUnit(u.id)}
                          style={{padding:"5px 12px",borderRadius:6,background:"#b91c1c",color:"white",border:"none",fontSize:11,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>
                          Yes
                        </button>
                        <button onClick={() => setDeleteUnitConfirm(null)}
                          style={{padding:"5px 10px",borderRadius:6,background:"#f5f5f4",color:"#78716c",border:"1px solid #e7e5e4",fontSize:11,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <span style={{fontSize:13,fontWeight:500,flex:1}}>{u.label}</span>
                        {inUseCount > 0 && (
                          <span style={{fontSize:10,color:"#065f46",background:"#d1fae5",padding:"2px 7px",borderRadius:20,fontWeight:600}}>
                            {inUseCount} product{inUseCount > 1 ? "s" : ""}
                          </span>
                        )}
                        <button onClick={() => startEditUnit(u)}
                          style={{padding:"4px 10px",borderRadius:6,background:"#f1f5f9",color:"#475569",border:"1px solid #e2e8f0",fontSize:11,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontWeight:500}}>
                          ✏️ Rename
                        </button>
                        <button onClick={() => { setDeleteUnitConfirm(u.id); setUnitError(""); }}
                          style={{padding:"4px 10px",borderRadius:6,background:"#fee2e2",color:"#b91c1c",border:"1px solid #fecaca",fontSize:11,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontWeight:500}}>
                          🗑
                        </button>
                      </>
                    )}
                  </div>
                );
              })}
              {units.length === 0 && (
                <div style={{textAlign:"center",padding:24,color:"#78716c",fontSize:13}}>No units defined yet</div>
              )}
            </div>

            <div style={{marginTop:14,display:"flex",justifyContent:"flex-end"}}>
              <button className="btn btn-primary" onClick={() => setUnitModal(false)}>Done</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────
// SALES PAGE
// ─────────────────────────────────────────
function SalesPage({ sales, setSales, products, purchases, customers, setCustomers, user, isBranchEntry, payments, setPayments, saleCustomer, setSaleCustomer }) {
  const blankForm = (prefillCust) => ({
    branch_id:       prefillCust ? prefillCust.branch_id : (user.branch_id || 1),
    product_id:      "",
    customer_id:     prefillCust ? String(prefillCust.id) : "",
    walkin_name:     "",
    walkin_phone:    "",
    walkin_address:  "",
    quantity:        "",
    received_amount: "",
    remarks:         "",
    sale_type:       "cash",
    date:            today(),
  });

  const [modal, setModal]       = useState(!!(isBranchEntry || saleCustomer));
  const [filter, setFilter]     = useState({ branch: "", type: "", date: "" });
  const [form, setForm]         = useState(blankForm(saleCustomer));
  const [waLink, setWaLink]     = useState(null);
  const [formError, setFormError] = useState("");

  // Clear saleCustomer after using it once
  const openModal = (prefillCust) => {
    setForm(blankForm(prefillCust || null));
    setFormError("");
    setModal(true);
    if (setSaleCustomer) setSaleCustomer(null);
  };

  // ── Stock calculation per product ──
  const getStock = (productId) => {
    const purchased = purchases.filter(p => p.product_id === productId).reduce((s, p) => s + p.quantity, 0);
    const sold      = sales.filter(s => s.product_id === productId).reduce((s, x) => s + x.quantity, 0);
    const initial   = products.find(p => p.id === productId)?.stock || 0;
    return initial + purchased - sold;
  };

  // Sort products: in-stock first (by qty desc), out-of-stock last (disabled)
  const sortedProducts = [...products].sort((a, b) => {
    const sa = getStock(a.id), sb = getStock(b.id);
    if (sa > 0 && sb <= 0) return -1;
    if (sa <= 0 && sb > 0) return  1;
    return sb - sa;
  });

  const filteredSales = sales
    .filter(s =>
      (!filter.branch || s.branch_id === +filter.branch) &&
      (!filter.type   || s.sale_type  === filter.type)   &&
      (!filter.date   || s.date       === filter.date)
    )
    .filter(s => user.role === "branch" ? s.branch_id === user.branch_id : true);

  const selectedProduct  = products.find(p => p.id === +form.product_id);
  const selectedCustomer = customers.find(c => c.id === +form.customer_id);
  const unitPrice        = selectedProduct?.selling_price || 0;
  const total            = (+form.quantity || 0) * unitPrice;
  const receivedAmt      = form.received_amount !== "" ? +form.received_amount : null;
  const priceDiffers     = receivedAmt !== null && receivedAmt !== total;
  const isWalkIn         = !form.customer_id;
  const needsWalkInInfo  = isWalkIn && form.sale_type === "loan";

  // Auto-fill price when product changes
  const handleProductChange = (product_id) => {
    setForm(f => ({ ...f, product_id }));
    setFormError("");
  };

  const handleAddSale = () => {
    // Validations
    if (!form.product_id) { setFormError("Please select a product."); return; }
    if (!form.quantity || +form.quantity <= 0) { setFormError("Enter a valid quantity."); return; }
    const avail = getStock(+form.product_id);
    if (+form.quantity > avail && avail >= 0) { setFormError(`Only ${avail} ${selectedProduct?.unit || "units"} in stock.`); return; }

    // Walk-in + Loan requires name/phone/address
    if (needsWalkInInfo) {
      if (!form.walkin_name.trim())    { setFormError("Customer name is required for walk-in loan sale."); return; }
      if (!form.walkin_phone.trim())   { setFormError("Mobile number is required for walk-in loan sale."); return; }
      if (!form.walkin_address.trim()) { setFormError("Address is required for walk-in loan sale."); return; }
    }

    // Remarks mandatory if price and received differ
    if (priceDiffers && !form.remarks.trim()) {
      setFormError("Remarks are mandatory when received amount differs from total price."); return;
    }

    // If walk-in loan → auto-create customer
    let customerId = form.customer_id ? +form.customer_id : null;
    if (needsWalkInInfo) {
      const loanAmt = receivedAmt !== null ? Math.max(0, total - receivedAmt) : total;
      const newCust = {
        id:             Date.now(),
        name:           form.walkin_name.trim(),
        phone:          form.walkin_phone.trim(),
        address:        form.walkin_address.trim(),
        branch_id:      +form.branch_id,
        credit_balance: loanAmt,
        walk_in:        true,
      };
      setCustomers(prev => [...prev, newCust]);
      customerId = newCust.id;
    }

    const newSale = {
      id:              Date.now(),
      branch_id:       +form.branch_id,
      product_id:      +form.product_id,
      customer_id:     customerId,
      quantity:        +form.quantity,
      price:           unitPrice,
      total_amount:    total,
      received_amount: receivedAmt,
      remarks:         form.remarks.trim() || null,
      sale_type:       form.sale_type,
      date:            form.date,
    };
    setSales([newSale, ...sales]);

    // ── Handle received amount as a payment entry ──
    if (receivedAmt !== null && receivedAmt > 0 && customerId) {
      const paymentFromSale = {
        id:          Date.now() + 1,
        customer_id: customerId,
        amount:      receivedAmt,
        method:      form.sale_type === "account" ? "account" : "cash",
        reference:   `Sale #${newSale.id}`,
        note:        `Payment collected at time of sale${form.remarks ? ` — ${form.remarks}` : ""}`,
        date:        form.date,
        branch_id:   +form.branch_id,
        from_sale:   true,
      };
      setPayments(prev => [paymentFromSale, ...prev]);
    }

    // ── Update customer credit balance ──
    if (customerId && form.sale_type === "loan" && !needsWalkInInfo) {
      // For existing customers on loan: add unpaid portion to credit
      const loanIncrease = receivedAmt !== null ? Math.max(0, total - receivedAmt) : total;
      setCustomers(prev => prev.map(c =>
        c.id === customerId ? { ...c, credit_balance: c.credit_balance + loanIncrease } : c
      ));
    }

    // WhatsApp bill — if known customer or new walk-in
    const custForWa = needsWalkInInfo
      ? { name: form.walkin_name, phone: form.walkin_phone, credit_balance: 0 }
      : selectedCustomer;

    if (custForWa) {
      const unpaidPortion = receivedAmt !== null ? Math.max(0, total - receivedAmt) : total;
      const outstanding = form.sale_type === "loan"
        ? ((custForWa.credit_balance || 0) + unpaidPortion)
        : (custForWa.credit_balance || 0);
      const msg = encodeURIComponent(
        `🐄 *GreenField Feeds Invoice*\n\nProduct: ${selectedProduct?.product_name}\nQty: ${form.quantity} × ₹${unitPrice}\nTotal: ₹${total.toLocaleString("en-IN")}` +
        (receivedAmt !== null ? `\nReceived: ₹${receivedAmt.toLocaleString("en-IN")}` : "") +
        (form.remarks ? `\nNote: ${form.remarks}` : "") +
        `\nMode: ${form.sale_type.charAt(0).toUpperCase()+form.sale_type.slice(1)}` +
        (form.sale_type === "loan" ? `\nOutstanding: ₹${outstanding.toLocaleString("en-IN")}` : "") +
        `\n\nThank you! 🙏`
      );
      setWaLink(`https://wa.me/91${custForWa.phone}?text=${msg}`);
    }

    setModal(false);
    setForm(blankForm(null));
    setFormError("");
  };

  const totalAmt = filteredSales.reduce((s, x) => s + x.total_amount, 0);
  const saleTypeBadge = (type) => ({ cash:"badge-cash", account:"badge-direct", loan:"badge-credit" }[type] || "badge-cash");
  const inp = (extra={}) => ({ padding:"9px 12px", borderRadius:8, border:"1px solid #e7e5e4", fontSize:13, fontFamily:"'DM Sans',sans-serif", outline:"none", background:"white", width:"100%", ...extra });

  return (
    <div className="page-body">
      <div className="section-header">
        <h3>🧾 Sales</h3>
        <div className="table-actions">
          <button className="btn btn-outline btn-sm">⬇ Excel</button>
          <button className="btn btn-outline btn-sm">📄 PDF</button>
          <button className="btn btn-primary btn-sm" onClick={() => openModal(null)}>+ New Sale</button>
        </div>
      </div>

      {waLink && (
        <div className="alert alert-success" style={{marginBottom:16,display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
          ✅ Sale recorded!
          <a href={waLink} target="_blank" rel="noreferrer"><button className="btn btn-wa btn-sm">📱 Send WhatsApp Bill</button></a>
          <button className="btn btn-sm" style={{marginLeft:"auto"}} onClick={() => setWaLink(null)}>✕</button>
        </div>
      )}

      {/* Filters */}
      <div style={{display:"flex",gap:10,marginBottom:16,flexWrap:"wrap"}}>
        {user.role === "admin" && (
          <select style={{padding:"7px 10px",borderRadius:8,border:"1px solid #e7e5e4",fontSize:12,fontFamily:"'DM Sans',sans-serif"}}
            value={filter.branch} onChange={e => setFilter({...filter, branch: e.target.value})}>
            <option value="">All Branches</option>
            {BRANCHES.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        )}
        <select style={{padding:"7px 10px",borderRadius:8,border:"1px solid #e7e5e4",fontSize:12,fontFamily:"'DM Sans',sans-serif"}}
          value={filter.type} onChange={e => setFilter({...filter, type: e.target.value})}>
          <option value="">All Types</option>
          <option value="cash">💵 Cash</option>
          <option value="account">🏦 Account</option>
          <option value="loan">📋 Loan</option>
        </select>
        <input type="date" style={{padding:"7px 10px",borderRadius:8,border:"1px solid #e7e5e4",fontSize:12}}
          value={filter.date} onChange={e => setFilter({...filter, date: e.target.value})} />
        {(filter.branch || filter.type || filter.date) && (
          <button onClick={() => setFilter({branch:"",type:"",date:""})}
            style={{padding:"5px 10px",borderRadius:20,fontSize:11,cursor:"pointer",border:"1px solid #fecaca",background:"#fef2f2",color:"#b91c1c",fontFamily:"'DM Sans',sans-serif"}}>
            ✕ Clear
          </button>
        )}
      </div>

      <div className="table-wrap">
        <table>
          <thead><tr>
            <th>Date</th>
            {user.role === "admin" && <th>Branch</th>}
            <th>Product</th>
            <th>Customer</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Total</th>
            <th>Received</th>
            <th>Type</th>
            <th>Remarks</th>
            <th>WA</th>
          </tr></thead>
          <tbody>
            {filteredSales.length === 0 ? (
              <tr><td colSpan={11} style={{textAlign:"center",padding:28,color:"#78716c"}}>No sales found</td></tr>
            ) : filteredSales.map(s => {
              const prod   = products.find(p => p.id === s.product_id);
              const cust   = customers.find(c => c.id === s.customer_id);
              const branch = BRANCHES.find(b => b.id === s.branch_id);
              const msg = encodeURIComponent(
                `🐄 *GreenField Feeds*\n\n${prod?.product_name}\nQty: ${s.quantity} × ₹${s.price}\nTotal: ₹${s.total_amount.toLocaleString("en-IN")}` +
                (s.received_amount != null ? `\nReceived: ₹${s.received_amount.toLocaleString("en-IN")}` : "") +
                (s.remarks ? `\nNote: ${s.remarks}` : "") +
                `\nMode: ${s.sale_type}\n\nThank you! 🙏`
              );
              return (
                <tr key={s.id}>
                  <td style={{color:"#78716c",fontSize:12,whiteSpace:"nowrap"}}>{s.date}</td>
                  {user.role === "admin" && <td style={{fontSize:11,color:"#78716c"}}>{branch?.location}</td>}
                  <td style={{fontWeight:500}}>
                    {prod?.product_name || "—"}
                    <div style={{fontSize:10,color:"#78716c"}}>{prod?.unit}</div>
                  </td>
                  <td style={{fontSize:12}}>
                    {cust
                      ? <span>{cust.name}{cust.walk_in && <span style={{marginLeft:4,fontSize:10,color:"#d97706",background:"#fef3c7",padding:"1px 5px",borderRadius:4}}>Walk-in</span>}</span>
                      : <span style={{color:"#94a3b8",fontStyle:"italic",fontSize:11}}>Walk-in</span>}
                  </td>
                  <td style={{fontWeight:600}}>{s.quantity}</td>
                  <td>{fmt(s.price)}</td>
                  <td style={{fontWeight:700,color:"#065f46"}}>{fmt(s.total_amount)}</td>
                  <td style={{fontSize:12}}>
                    {s.received_amount != null
                      ? <span style={{color: s.received_amount < s.total_amount ? "#b91c1c" : "#065f46",fontWeight:600}}>{fmt(s.received_amount)}</span>
                      : <span style={{color:"#d4d4d4"}}>—</span>}
                  </td>
                  <td><span className={`badge ${saleTypeBadge(s.sale_type)}`} style={{textTransform:"capitalize"}}>
                    {s.sale_type === "cash" ? "💵" : s.sale_type === "account" ? "🏦" : "📋"} {s.sale_type}
                  </span></td>
                  <td style={{fontSize:11,color:"#78716c",maxWidth:120,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                    {s.remarks || <span style={{color:"#d4d4d4"}}>—</span>}
                  </td>
                  <td>
                    {cust
                      ? <a href={`https://wa.me/91${cust.phone}?text=${msg}`} target="_blank" rel="noreferrer"><button className="btn btn-wa btn-sm">📱</button></a>
                      : <span style={{fontSize:11,color:"#d4d4d4"}}>—</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="summary-row">
          <span>{filteredSales.length} transactions</span>
          <strong style={{marginLeft:"auto"}}>Total: {fmt(totalAmt)}</strong>
        </div>
      </div>

      {/* ══════════════════════════════════
          NEW SALE MODAL
      ══════════════════════════════════ */}
      {modal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModal(false)}>
          <div className="modal" style={{maxWidth:600}}>
            <div className="modal-title">
              🧾 New Sale Entry
              <span className="modal-close" onClick={() => setModal(false)}>✕</span>
            </div>

            {formError && (
              <div style={{background:"#fee2e2",color:"#b91c1c",borderRadius:8,padding:"9px 13px",fontSize:12,marginBottom:14,display:"flex",alignItems:"center",gap:6}}>
                ⚠️ {formError}
                <span style={{marginLeft:"auto",cursor:"pointer",fontWeight:700}} onClick={() => setFormError("")}>✕</span>
              </div>
            )}

            {/* Row 1: Branch + Date */}
            <div className="form-grid" style={{marginBottom:12}}>
              {user.role === "admin" && (
                <div className="form-field">
                  <label>Branch</label>
                  <select value={form.branch_id} onChange={e => setForm({...form, branch_id: e.target.value})} style={inp()}>
                    {BRANCHES.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                </div>
              )}
              <div className="form-field">
                <label>Date</label>
                <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} style={inp()} />
              </div>
            </div>

            {/* Product */}
            <div className="form-field" style={{marginBottom:12}}>
              <label style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                Product *
                <span style={{fontSize:10,color:"#78716c",fontWeight:400}}>Sorted by available stock ↓</span>
              </label>
              <select value={form.product_id} onChange={e => handleProductChange(e.target.value)} style={inp()}>
                <option value="">— Select product —</option>
                {sortedProducts.map(p => {
                  const st = getStock(p.id);
                  return (
                    <option key={p.id} value={p.id} disabled={st <= 0}>
                      {st <= 0 ? "⚠️" : st < 20 ? "🟡" : "🟢"} {p.product_name} ({p.unit})
                    </option>
                  );
                })}
              </select>
              {selectedProduct && (() => { const st = getStock(+form.product_id); return (
                <div style={{marginTop:5,display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
                  <span style={{fontSize:11,padding:"2px 8px",borderRadius:20,background:"#fef3c7",color:"#92400e"}}>{selectedProduct.unit}</span>
                  <span style={{fontSize:11,padding:"2px 8px",borderRadius:20,fontWeight:600, background: st<20?"#fef3c7":"#d1fae5", color: st<20?"#92400e":"#065f46"}}>Stock: {st}</span>
                </div>
              );})()}
            </div>

            {/* Customer */}
            <div className="form-field" style={{marginBottom:12}}>
              <label style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                Customer
                <span style={{fontSize:10,color:"#065f46",fontWeight:500}}>Optional — leave blank for walk-in</span>
              </label>
              <select value={form.customer_id}
                onChange={e => { setForm({...form, customer_id: e.target.value, walkin_name:"", walkin_phone:"", walkin_address:""}); setFormError(""); }}
                style={inp()}>
                <option value="">— Walk-in / No customer —</option>
                {customers.filter(c => user.role === "branch" ? c.branch_id === user.branch_id : true)
                  .map(c => <option key={c.id} value={c.id}>{c.name}{c.credit_balance > 0 ? ` ⚠️ Loan: ${fmt(c.credit_balance)}` : ""}</option>)}
              </select>
              {selectedCustomer?.credit_balance > 0 && (
                <div style={{marginTop:4,padding:"5px 10px",background:"#fef2f2",borderRadius:6,fontSize:11,color:"#b91c1c"}}>
                  ⚠️ Outstanding loan: <strong>{fmt(selectedCustomer.credit_balance)}</strong>
                </div>
              )}
            </div>

            {/* ── Walk-in Loan Info Panel ── */}
            {needsWalkInInfo && (
              <div style={{background:"#fffbf0",border:"2px solid #fde68a",borderRadius:10,padding:"14px 16px",marginBottom:14}}>
                <div style={{fontSize:12,fontWeight:700,color:"#92400e",marginBottom:10,display:"flex",alignItems:"center",gap:6}}>
                  📋 Walk-in Loan — Customer Details Required
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                  <div style={{gridColumn:"span 2"}}>
                    <label style={{fontSize:10,fontWeight:600,color:"#78716c",textTransform:"uppercase",letterSpacing:"0.05em",display:"block",marginBottom:4}}>Full Name *</label>
                    <input value={form.walkin_name} onChange={e => { setForm({...form, walkin_name: e.target.value}); setFormError(""); }}
                      placeholder="e.g. Murugan Gopal"
                      style={inp({border: !form.walkin_name && formError ? "1px solid #f87171" : "1px solid #fde68a"})} />
                  </div>
                  <div>
                    <label style={{fontSize:10,fontWeight:600,color:"#78716c",textTransform:"uppercase",letterSpacing:"0.05em",display:"block",marginBottom:4}}>Mobile Number *</label>
                    <input value={form.walkin_phone} onChange={e => { setForm({...form, walkin_phone: e.target.value}); setFormError(""); }}
                      placeholder="9876543210"
                      style={inp({border: !form.walkin_phone && formError ? "1px solid #f87171" : "1px solid #fde68a"})} />
                  </div>
                  <div>
                    <label style={{fontSize:10,fontWeight:600,color:"#78716c",textTransform:"uppercase",letterSpacing:"0.05em",display:"block",marginBottom:4}}>Address *</label>
                    <input value={form.walkin_address} onChange={e => { setForm({...form, walkin_address: e.target.value}); setFormError(""); }}
                      placeholder="Village / Town"
                      style={inp({border: !form.walkin_address && formError ? "1px solid #f87171" : "1px solid #fde68a"})} />
                  </div>
                </div>
                <div style={{marginTop:8,fontSize:10,color:"#92400e",background:"#fef3c7",borderRadius:5,padding:"5px 8px"}}>
                  ℹ️ This customer will be automatically added to your Customers list with the loan amount.
                </div>
              </div>
            )}

            {/* Qty + Price row */}
            <div className="form-grid" style={{marginBottom:12}}>
              <div className="form-field">
                <label>Quantity {selectedProduct ? <span style={{color:"#78716c",fontWeight:400,fontSize:11}}>({selectedProduct.unit})</span> : ""} *</label>
                <input type="number" value={form.quantity} min="1"
                  onChange={e => { setForm({...form, quantity: e.target.value}); setFormError(""); }}
                  placeholder="0" style={inp()} />
              </div>
              <div className="form-field">
                <label style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  Total Price (₹)
                  {selectedProduct && <span style={{fontSize:10,color:"#78716c",fontWeight:400,textTransform:"none"}}>
                    {fmt(unitPrice)} / {selectedProduct.unit}
                  </span>}
                </label>
                <div style={{
                  ...inp(),
                  background: total > 0 ? "#f0fdf4" : "#fafaf9",
                  border: `1px solid ${total > 0 ? "#a7f3d0" : "#e7e5e4"}`,
                  display:"flex", alignItems:"center", justifyContent:"space-between",
                  cursor:"default", userSelect:"none",
                }}>
                  {total > 0 ? (
                    <>
                      <span style={{color:"#78716c",fontSize:12}}>{form.quantity} × {fmt(unitPrice)}</span>
                      <strong style={{color:"#065f46",fontSize:15}}>{fmt(total)}</strong>
                    </>
                  ) : (
                    <span style={{color:"#94a3b8",fontSize:12}}>Enter quantity to calculate</span>
                  )}
                </div>
              </div>
            </div>

            {/* Sale Type */}
            <div className="form-field" style={{marginBottom:12}}>
              <label>Sale Type</label>
              <div style={{display:"flex",gap:10}}>
                {[{v:"cash",icon:"💵",label:"Cash"},{v:"account",icon:"🏦",label:"Account"},{v:"loan",icon:"📋",label:"Loan"}].map(t => (
                  <button key={t.v} onClick={() => setForm(f => ({...f, sale_type: t.v}))}
                    style={{
                      flex:1, padding:"10px 8px", borderRadius:10, cursor:"pointer", textAlign:"center",
                      border:      form.sale_type===t.v ? "2px solid #065f46" : "1px solid #e7e5e4",
                      background:  form.sale_type===t.v ? "#f0fdf4" : "white",
                      fontFamily:  "'DM Sans',sans-serif", fontSize:12,
                      fontWeight:  form.sale_type===t.v ? 700 : 400,
                      color:       form.sale_type===t.v ? "#065f46" : "#78716c",
                      transition:  "all 0.15s",
                    }}>
                    <div style={{fontSize:20,marginBottom:3}}>{t.icon}</div>
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Received Amount + Remarks row */}
            <div className="form-grid" style={{marginBottom:12}}>
              <div className="form-field">
                <label style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  Received Amount (₹)
                  {total > 0 && (
                    <span onClick={() => setForm(f => ({...f, received_amount: String(total)}))}
                      style={{fontSize:10,color:"#d97706",cursor:"pointer",fontWeight:600,textTransform:"none"}}>= Full ({fmt(total)})</span>
                  )}
                </label>
                <input type="number" value={form.received_amount}
                  onChange={e => { setForm({...form, received_amount: e.target.value}); setFormError(""); }}
                  placeholder={total > 0 ? `e.g. ${total}` : "0"}
                  style={inp({ borderColor: priceDiffers ? "#d97706" : "#e7e5e4" })} />
                {priceDiffers && (
                  <div style={{fontSize:10,color:"#d97706",marginTop:2}}>
                    {receivedAmt < total
                      ? `⚠️ Short by ${fmt(total - receivedAmt)} — remarks required`
                      : `ℹ️ Excess ${fmt(receivedAmt - total)} — remarks required`}
                  </div>
                )}
              </div>

              <div className="form-field">
                <label style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  Remarks
                  {priceDiffers
                    ? <span style={{fontSize:10,color:"#b91c1c",fontWeight:600,textTransform:"none"}}>Required *</span>
                    : <span style={{fontSize:10,color:"#94a3b8",fontWeight:400,textTransform:"none"}}>Optional</span>}
                </label>
                <input value={form.remarks}
                  onChange={e => { setForm({...form, remarks: e.target.value}); setFormError(""); }}
                  placeholder={priceDiffers ? "Explain difference in amount…" : "e.g. Delivered to farm, advance…"}
                  style={inp({ borderColor: priceDiffers && !form.remarks.trim() ? "#f87171" : "#e7e5e4",
                    background: priceDiffers ? "#fffbf0" : "white" })} />
              </div>
            </div>

            {/* ── Live Summary ── */}
            {total > 0 && (
              <div style={{background:"#f0fdf4",border:"1px solid #a7f3d0",borderRadius:10,padding:"14px 16px",marginBottom:14,fontSize:13}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom: receivedAmt!==null||form.sale_type==="loan" ? 8 : 0}}>
                  <span style={{color:"#78716c"}}>Sale Total</span>
                  <strong style={{fontSize:18,color:"#065f46"}}>{fmt(total)}</strong>
                </div>
                {receivedAmt !== null && (
                  <>
                    <div style={{display:"flex",justifyContent:"space-between",paddingTop:6,borderTop:"1px dashed #a7f3d0",marginBottom:4}}>
                      <span style={{color:"#78716c"}}>Received</span>
                      <strong style={{color: receivedAmt < total ? "#b91c1c" : "#065f46"}}>{fmt(receivedAmt)}</strong>
                    </div>
                    <div style={{display:"flex",justifyContent:"space-between"}}>
                      <span style={{color:"#78716c"}}>{receivedAmt >= total ? "Change to Return" : "Balance Pending"}</span>
                      <strong style={{color: receivedAmt >= total ? "#065f46" : "#b91c1c"}}>
                        {receivedAmt >= total ? fmt(receivedAmt - total) : `− ${fmt(total - receivedAmt)}`}
                      </strong>
                    </div>
                  </>
                )}
                {form.sale_type === "loan" && (
                  <div style={{paddingTop:8,borderTop:"1px dashed #a7f3d0",marginTop:4}}>
                    <div style={{display:"flex",justifyContent:"space-between"}}>
                      <span style={{color:"#78716c"}}>Added to Loan</span>
                      <strong style={{color:"#b91c1c"}}>{fmt(total)}</strong>
                    </div>
                    {selectedCustomer?.credit_balance > 0 && (
                      <div style={{marginTop:3,fontSize:11,color:"#b91c1c"}}>
                        New total loan: <strong>{fmt(selectedCustomer.credit_balance + total)}</strong>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
              <button className="btn btn-outline" onClick={() => { setModal(false); setFormError(""); }}>Cancel</button>
              <button className="btn btn-primary" onClick={handleAddSale}>💾 Record Sale</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


// ─────────────────────────────────────────
// CUSTOMERS PAGE
// ─────────────────────────────────────────
const CP_GRADS = [
  ["#C05E3A","#E8A96A"],["#3A7EC0","#6AAFE8"],["#3AC05E","#6AE89A"],
  ["#C03A7E","#E86AB0"],["#7E3AC0","#B06AE8"],["#C0A03A","#E8D06A"],
  ["#3AC0B0","#6AE8DC"],["#9E3AC0","#CC6AE8"],
];
const CP_BRANCH_STYLE = {
  1: { bg:"rgba(91,138,245,.10)", color:"#3b5fc0", dot:"#5B8AF5", bdr:"rgba(91,138,245,.22)" },
  2: { bg:"rgba(217,119,6,.08)",  color:"#92400e", dot:"#d97706", bdr:"rgba(217,119,6,.22)"  },
  3: { bg:"rgba(5,150,105,.08)",  color:"#065f46", dot:"#059669", bdr:"rgba(5,150,105,.22)"  },
};

function CpAvatar({ name, idx, size }) {
  const sz = size || 38;
  const [a, b] = CP_GRADS[idx % CP_GRADS.length];
  const initials = name.trim().split(/\s+/).map(w => w[0]).join("").toUpperCase().slice(0, 2);
  return (
    <div style={{
      width: sz, height: sz, borderRadius: 10, flexShrink: 0,
      background: "linear-gradient(145deg," + a + "," + b + ")",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: sz * 0.3, fontWeight: 700, color: "#fff", letterSpacing: ".02em",
      fontFamily: "'Instrument Sans',sans-serif",
      boxShadow: "0 3px 10px " + a + "44, inset 0 1px 0 rgba(255,255,255,.18)",
    }}>
      {initials}
    </div>
  );
}

function CpActionBtn({ icon, tip, hoverBg, hoverColor, hoverBorder, onClick }) {
  const [h, setH] = useState(false);
  return (
    <div style={{ position: "relative", flexShrink: 0 }}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}>
      <button
        onClick={onClick}
        style={{
          width: 30, height: 30, borderRadius: 7, cursor: "pointer",
          border: h ? ("1px solid " + hoverBorder) : "1px solid #e7e5e4",
          background: h ? hoverBg : "transparent",
          color: h ? hoverColor : "#a8a29e",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 13, transition: "all .13s",
          boxShadow: h ? "0 2px 6px rgba(0,0,0,.12)" : "none",
        }}>
        {icon}
      </button>
      {h && (
        <div style={{
          position: "absolute", bottom: "calc(100% + 7px)", left: "50%",
          transform: "translateX(-50%)",
          background: "#1c1208", color: "#fff",
          fontSize: 10, fontWeight: 600, padding: "4px 9px", borderRadius: 6,
          whiteSpace: "nowrap", pointerEvents: "none",
          boxShadow: "0 4px 12px rgba(0,0,0,.3)", zIndex: 300, letterSpacing: ".03em",
        }}>
          {tip}
          <span style={{
            position: "absolute", top: "100%", left: "50%",
            transform: "translateX(-50%)", display: "block",
            width: 0, height: 0,
            borderLeft: "4px solid transparent", borderRight: "4px solid transparent",
            borderTop: "4px solid #1c1208",
          }} />
        </div>
      )}
    </div>
  );
}

function CustomersPage({ customers, setCustomers, sales, products, user, payments, setPayments, setPage, setSaleCustomer }) {
  const [addModal, setAddModal]     = useState(false);
  const [editModal, setEditModal]   = useState(null);
  const [selected, setSelected]     = useState(null);
  const [payModal, setPayModal]     = useState(null);
  const [payForm, setPayForm]       = useState({ amount: "", method: "cash", reference: "", note: "", date: today() });
  const [payError, setPayError]     = useState("");
  const [paySuccess, setPaySuccess] = useState(null);
  const [addForm, setAddForm]       = useState({ name: "", phone: "", address: "", branch_id: user.branch_id || 1 });
  const [editForm, setEditForm]     = useState({ name: "", phone: "", address: "", branch_id: 1 });
  const [histTab, setHistTab]       = useState("all");
  const [search, setSearch]         = useState("");
  const [statusF, setStatusF]       = useState("");
  const [hovRow, setHovRow]         = useState(null);

  // ── Filtered list
  const baseCusts = user.role === "branch"
    ? customers.filter(c => c.branch_id === user.branch_id)
    : customers;

  const filteredCusts = baseCusts.filter(c => {
    const q = search.toLowerCase();
    const matchQ = !q || c.name.toLowerCase().includes(q) || (c.phone || "").includes(q);
    const matchS = !statusF
      || (statusF === "credit" ? c.credit_balance > 0 : c.credit_balance === 0);
    return matchQ && matchS;
  });

  // ── History data (depends on `selected`)
  const custSales    = selected ? sales.filter(s => s.customer_id === selected.id) : [];
  const custPayments = selected ? payments.filter(p => p.customer_id === selected.id) : [];
  const allHistory   = [
    ...custSales.map(s => ({ ...s, _type: "sale" })),
    ...custPayments.map(p => ({ ...p, _type: "payment" })),
  ].sort((a, b) => b.date.localeCompare(a.date));
  const histItems = histTab === "all"
    ? allHistory
    : histTab === "sales"
      ? custSales.map(s => ({ ...s, _type: "sale" }))
      : custPayments.map(p => ({ ...p, _type: "payment" }));

  // ── Handlers
  const addCustomer = () => {
    if (!addForm.name.trim()) return;
    setCustomers([...customers, {
      id: Date.now(), ...addForm,
      branch_id: +addForm.branch_id, credit_balance: 0,
    }]);
    setAddModal(false);
    setAddForm({ name: "", phone: "", address: "", branch_id: user.branch_id || 1 });
  };

  const saveEdit = () => {
    if (!editForm.name.trim()) return;
    setCustomers(prev => prev.map(c =>
      c.id === editModal.id ? { ...c, ...editForm, branch_id: +editForm.branch_id } : c
    ));
    setEditModal(null);
  };

  const openPayment = (c) => {
    setPayModal(c);
    setPayForm({ amount: "", method: "cash", reference: "", note: "", date: today() });
    setPayError("");
    setPaySuccess(null);
  };

  const recordPayment = () => {
    if (!payForm.amount || +payForm.amount <= 0) {
      setPayError("Enter a valid payment amount."); return;
    }
    if (+payForm.amount > payModal.credit_balance && payModal.credit_balance > 0) {
      setPayError("Amount exceeds outstanding balance of " + fmt(payModal.credit_balance) + "."); return;
    }
    const payment = {
      id: Date.now(),
      customer_id: payModal.id,
      amount: +payForm.amount,
      method: payForm.method,
      reference: payForm.reference,
      note: payForm.note,
      date: payForm.date,
      branch_id: payModal.branch_id,
    };
    setPayments(prev => [payment, ...prev]);
    setCustomers(prev => prev.map(c =>
      c.id === payModal.id
        ? { ...c, credit_balance: Math.max(0, c.credit_balance - payment.amount) }
        : c
    ));
    setPaySuccess(payment);
    setPayModal(null);
    if (selected && selected.id === payModal.id) {
      setSelected(prev => ({ ...prev, credit_balance: Math.max(0, prev.credit_balance - payment.amount) }));
    }
  };

  const totalCredit = filteredCusts.reduce((s, c) => s + c.credit_balance, 0);
  const withCredit  = filteredCusts.filter(c => c.credit_balance > 0).length;
  const COLS = "2.4fr 1fr 1.3fr 1fr 1.6fr 148px";

  return (
    <div className="page-body">

      {/* ── HEADER */}
      <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", marginBottom:20 }}>
        <div>
          <div style={{ fontSize:10, fontWeight:700, letterSpacing:".10em", textTransform:"uppercase", color:"#a8a29e", marginBottom:6 }}>
            Customer Management
          </div>
          <h1 style={{ fontFamily:"'Fraunces',Georgia,serif", fontSize:28, fontWeight:300, color:"#1c1208", letterSpacing:"-0.04em", lineHeight:1, fontStyle:"italic" }}>
            Customers
          </h1>
          <p style={{ fontSize:13, color:"#78716c", marginTop:5 }}>
            Manage accounts and track outstanding credit balances
          </p>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <button className="btn btn-outline btn-sm">⬇ Export</button>
          <button className="btn btn-primary btn-sm" onClick={() => setAddModal(true)}>+ Add Customer</button>
        </div>
      </div>

      {/* ── STAT STRIP */}
      <div style={{ display:"flex", gap:12, marginBottom:20 }}>
        {[
          { icon:"👥", label:"Total",       val: String(filteredCusts.length),         accent:"#4f46e5" },
          { icon:"⚠️", label:"Credit Due",  val: String(withCredit),                   accent:"#dc2626" },
          { icon:"₹",  label:"Outstanding", val: fmt(totalCredit),                     accent:"#d97706" },
          { icon:"✅", label:"Settled",      val: String(filteredCusts.length - withCredit), accent:"#059669" },
        ].map((s, si) => (
          <div key={si} style={{
            flex:1, background:"white", border:"1px solid #e7e5e4", borderRadius:12,
            padding:"14px 16px", boxShadow:"0 1px 4px rgba(0,0,0,.04)",
            position:"relative", overflow:"hidden",
          }}>
            <div style={{ position:"absolute", top:0, left:0, right:0, height:2.5, background:s.accent, borderRadius:"12px 12px 0 0" }} />
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
              <div style={{ fontSize:16, marginBottom:8 }}>{s.icon}</div>
              <div style={{ fontSize:9, fontWeight:700, letterSpacing:".08em", textTransform:"uppercase", color:"#a8a29e" }}>{s.label}</div>
            </div>
            <div style={{ fontFamily:"'Fraunces',serif", fontSize:26, fontWeight:300, color:"#1c1208", letterSpacing:"-0.03em", lineHeight:1, fontStyle:"italic" }}>
              {s.val}
            </div>
          </div>
        ))}
      </div>

      {/* ── FILTER BAR */}
      <div style={{ display:"flex", gap:8, marginBottom:14, alignItems:"center", flexWrap:"wrap" }}>
        <div style={{ position:"relative", flex:1, maxWidth:280 }}>
          <span style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", fontSize:13, color:"#a8a29e", pointerEvents:"none" }}>⌕</span>
          <input
            value={search} onChange={e => { setSearch(e.target.value); }}
            placeholder="Search customers…"
            style={{ width:"100%", padding:"7px 12px 7px 28px", border:"1px solid #e7e5e4", borderRadius:8, fontFamily:"'DM Sans',sans-serif", fontSize:12.5, color:"#1c1208", background:"white", outline:"none", transition:"all .14s" }}
            onFocus={e => { e.target.style.border = "1px solid #d97706"; e.target.style.boxShadow = "0 0 0 3px rgba(217,119,6,.08)"; }}
            onBlur={e => { e.target.style.border = "1px solid #e7e5e4"; e.target.style.boxShadow = "none"; }}
          />
        </div>
        <select
          value={statusF} onChange={e => setStatusF(e.target.value)}
          style={{ padding:"7px 10px", borderRadius:8, border:"1px solid #e7e5e4", fontSize:12, fontFamily:"'DM Sans',sans-serif", background:"white", color:"#57534e", outline:"none" }}>
          <option value="">All Status</option>
          <option value="credit">Credit Due</option>
          <option value="clear">Clear</option>
        </select>
        {(search || statusF) && (
          <button
            onClick={() => { setSearch(""); setStatusF(""); }}
            style={{ padding:"6px 12px", borderRadius:8, border:"1px solid #fecaca", background:"#fef2f2", color:"#b91c1c", fontFamily:"'DM Sans',sans-serif", fontSize:11, fontWeight:500, cursor:"pointer" }}>
            ✕ Clear
          </button>
        )}
        <span style={{ marginLeft:"auto", fontSize:12, color:"#78716c" }}>
          <span style={{ color:"#d97706", fontWeight:700 }}>{filteredCusts.length}</span>
          {" customer"}{filteredCusts.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* ── Payment success banner */}
      {paySuccess && (
        <div className="alert alert-success" style={{ marginBottom:16, display:"flex", alignItems:"center", gap:10, flexWrap:"wrap" }}>
          ✅ Payment of <strong>{fmt(paySuccess.amount)}</strong> recorded
          {(() => {
            const pc = customers.find(x => x.id === paySuccess.customer_id);
            if (!pc) return null;
            const msg = encodeURIComponent(
              "🐄 *GreenField Feeds — Payment Receipt*\n\nDear " + pc.name + ",\n" +
              "We received your payment of ₹" + paySuccess.amount.toLocaleString("en-IN") + " on " + paySuccess.date + ".\n" +
              "Mode: " + paySuccess.method + (paySuccess.reference ? "\nRef: " + paySuccess.reference : "") + "\n" +
              "Outstanding Balance: ₹" + (pc.credit_balance || 0).toLocaleString("en-IN") + "\n\nThank you! 🙏"
            );
            return (
              <a href={"https://wa.me/91" + pc.phone + "?text=" + msg} target="_blank" rel="noreferrer">
                <button className="btn btn-wa btn-sm">📱 Send Receipt</button>
              </a>
            );
          })()}
          <button className="btn btn-sm" style={{ marginLeft:"auto" }} onClick={() => setPaySuccess(null)}>✕</button>
        </div>
      )}

      {/* ── TABLE */}
      <div style={{ background:"white", border:"1px solid #e7e5e4", borderRadius:14, overflow:"hidden", boxShadow:"0 2px 12px rgba(0,0,0,.06)" }}>

        {/* Header row */}
        <div style={{ display:"grid", gridTemplateColumns:COLS, background:"#fafaf9", borderBottom:"1px solid #e7e5e4", padding:"0 16px" }}>
          {["Customer", "Branch", "Credit Balance", "Status", "Last Transaction", "Actions"].map((h, hi) => (
            <div key={h} style={{ padding:"10px 10px", fontSize:10, fontWeight:700, letterSpacing:".08em", textTransform:"uppercase", color:"#a8a29e", textAlign: hi === 5 ? "center" : "left", whiteSpace:"nowrap" }}>
              {h}
            </div>
          ))}
        </div>

        {/* Data rows */}
        {filteredCusts.length === 0 ? (
          <div style={{ textAlign:"center", padding:"52px 24px", color:"#78716c" }}>
            <div style={{ fontSize:36, marginBottom:10, opacity:.4 }}>🔍</div>
            <div style={{ fontSize:14, fontWeight:600, marginBottom:4 }}>No customers found</div>
            <div style={{ fontSize:12 }}>Try adjusting your search or filters</div>
          </div>
        ) : filteredCusts.map((c, ci) => {
          const branch  = BRANCHES.find(b => b.id === c.branch_id);
          const isCr    = c.credit_balance > 0;
          const isHov   = hovRow === c.id;
          const bStyle  = CP_BRANCH_STYLE[c.branch_id] || { bg:"#f3f4f6", color:"#374151", dot:"#9ca3af", bdr:"#d1d5db" };
          const custPmtsRow = payments.filter(p => p.customer_id === c.id);
          const lastPmt = [...custPmtsRow].sort((a, b) => b.date.localeCompare(a.date))[0];

          return (
            <div
              key={c.id}
              onMouseEnter={() => setHovRow(c.id)}
              onMouseLeave={() => setHovRow(null)}
              style={{
                display:"grid", gridTemplateColumns:COLS,
                borderBottom: ci < filteredCusts.length - 1 ? "1px solid #f5f5f4" : "none",
                background: isHov ? "#f8faff" : "white",
                transition:"background .12s", padding:"0 16px", position:"relative",
              }}>

              {/* Hover accent bar */}
              {isHov && (
                <div style={{
                  position:"absolute", left:0, top:0, bottom:0, width:3,
                  background: isCr ? "#dc2626" : "#059669",
                  borderRadius:"0 2px 2px 0",
                }} />
              )}

              {/* Customer */}
              <div style={{ padding:"13px 10px", display:"flex", alignItems:"center", gap:11 }}>
                <CpAvatar name={c.name} idx={ci} size={38} />
                <div style={{ minWidth:0 }}>
                  <div style={{ fontSize:13.5, fontWeight:600, color:"#1c1208", lineHeight:1.25, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                    {c.name}
                    {c.walk_in && (
                      <span style={{ marginLeft:5, fontSize:9, color:"#d97706", background:"#fef3c7", padding:"1px 5px", borderRadius:4 }}>Walk-in</span>
                    )}
                  </div>
                  <div style={{ fontSize:11, color:"#78716c", marginTop:2 }}>+91 {c.phone}</div>
                  {c.address && (
                    <div style={{ fontSize:10, color:"#a8a29e", marginTop:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{c.address}</div>
                  )}
                </div>
              </div>

              {/* Branch */}
              <div style={{ padding:"13px 10px", display:"flex", alignItems:"center" }}>
                <span style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"3px 9px", borderRadius:6, fontSize:11, fontWeight:500, background:bStyle.bg, color:bStyle.color, border:"1px solid " + bStyle.bdr, whiteSpace:"nowrap" }}>
                  <span style={{ width:4, height:4, borderRadius:"50%", background:bStyle.dot, opacity:.9, flexShrink:0 }} />
                  {branch ? branch.location : "—"}
                </span>
              </div>

              {/* Credit Balance */}
              <div style={{ padding:"13px 10px", display:"flex", flexDirection:"column", justifyContent:"center" }}>
                <div style={{ fontFamily:"'Fraunces',serif", fontSize:18, fontWeight:300, letterSpacing:"-0.03em", fontStyle:"italic", lineHeight:1, color: isCr ? "#dc2626" : "#059669" }}>
                  {fmt(c.credit_balance)}
                </div>
                <div style={{ fontSize:10, color:"#a8a29e", marginTop:2 }}>
                  {isCr ? "outstanding" : "fully settled"}
                  {lastPmt && (" · paid " + lastPmt.date)}
                </div>
              </div>

              {/* Status */}
              <div style={{ padding:"13px 10px", display:"flex", alignItems:"center" }}>
                {isCr ? (
                  <span style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"3px 10px", borderRadius:99, fontSize:11, fontWeight:600, background:"#fef2f2", color:"#dc2626", border:"1px solid #fecaca" }}>
                    <span style={{ width:5, height:5, borderRadius:"50%", background:"#dc2626", animation:"cp-pulse 2s infinite", flexShrink:0 }} />
                    Credit Due
                  </span>
                ) : (
                  <span style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"3px 10px", borderRadius:99, fontSize:11, fontWeight:600, background:"#ecfdf5", color:"#059669", border:"1px solid #a7f3d0" }}>
                    <span style={{ width:5, height:5, borderRadius:"50%", background:"#059669", flexShrink:0 }} />
                    Clear
                  </span>
                )}
              </div>

              {/* Last Transaction */}
              <div style={{ padding:"13px 10px", display:"flex", flexDirection:"column", justifyContent:"center" }}>
                <div style={{ fontSize:12.5, color:"#57534e", fontWeight:500 }}>{c.lastDate || lastPmt?.date || "—"}</div>
                <div style={{ fontSize:11, color:"#a8a29e", marginTop:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                  {c.lastTx || (lastPmt ? ("Payment · " + fmt(lastPmt.amount)) : "No transactions yet")}
                </div>
              </div>

              {/* Actions */}
              <div style={{ padding:"13px 10px", display:"flex", alignItems:"center", justifyContent:"center", gap:4 }}>
                <CpActionBtn icon="📋" tip="View History"   hoverBg="#fffbeb" hoverColor="#d97706" hoverBorder="#fde68a" onClick={() => { setSelected(c); setHistTab("all"); }} />
                <CpActionBtn icon="🧾" tip="New Sale"       hoverBg="#eff6ff" hoverColor="#1d4ed8" hoverBorder="#bfdbfe" onClick={() => { setSaleCustomer(c); setPage("sales"); }} />
                <CpActionBtn icon="💳" tip="Record Payment" hoverBg="#f0fdf4" hoverColor="#059669" hoverBorder="#a7f3d0" onClick={() => openPayment(c)} />
                <CpActionBtn icon="✏️" tip="Edit Customer"  hoverBg="#fffbeb" hoverColor="#d97706" hoverBorder="#fde68a" onClick={() => { setEditModal(c); setEditForm({ name:c.name, phone:c.phone||"", address:c.address||"", branch_id:c.branch_id }); }} />
                <a href={"https://wa.me/91" + c.phone} target="_blank" rel="noreferrer">
                  <CpActionBtn icon="📱" tip="WhatsApp" hoverBg="#dcfce7" hoverColor="#15803d" hoverBorder="#86efac" />
                </a>
              </div>
            </div>
          );
        })}

        {/* Footer */}
        <div style={{ padding:"11px 18px", borderTop:"1px solid #f5f5f4", display:"flex", alignItems:"center", background:"#fafaf9" }}>
          <span style={{ fontSize:12, color:"#78716c" }}>{filteredCusts.length} customer{filteredCusts.length !== 1 ? "s" : ""}</span>
          <strong style={{ marginLeft:"auto", fontSize:13, color:"#1c1208" }}>Total Credit: {fmt(totalCredit)}</strong>
        </div>
      </div>

      {/* ══════════════ PAYMENT MODAL ══════════════ */}
      {payModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setPayModal(null)}>
          <div className="modal" style={{ maxWidth:480 }}>
            <div className="modal-title">
              💳 Record Payment
              <span className="modal-close" onClick={() => setPayModal(null)}>✕</span>
            </div>
            <div style={{ background:"#f8faff", border:"1px solid #dbeafe", borderRadius:10, padding:"14px 16px", marginBottom:18, display:"flex", gap:16, alignItems:"center", flexWrap:"wrap" }}>
              <div style={{ width:40, height:40, borderRadius:10, background:"#1d4ed8", display:"flex", alignItems:"center", justifyContent:"center", color:"white", fontSize:18, fontWeight:700, flexShrink:0 }}>
                {payModal.name[0]}
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:14, fontWeight:700, color:"#1c1208" }}>{payModal.name}</div>
                <div style={{ fontSize:12, color:"#78716c" }}>+91 {payModal.phone}</div>
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontSize:10, color:"#78716c", textTransform:"uppercase", letterSpacing:"0.05em" }}>Outstanding</div>
                <div style={{ fontSize:20, fontWeight:800, color: payModal.credit_balance > 0 ? "#b91c1c" : "#065f46" }}>{fmt(payModal.credit_balance)}</div>
              </div>
            </div>
            {payError && (
              <div style={{ background:"#fee2e2", color:"#b91c1c", borderRadius:8, padding:"9px 13px", fontSize:12, marginBottom:14, display:"flex", gap:6, alignItems:"center" }}>
                ⚠️ {payError}
                <span style={{ marginLeft:"auto", cursor:"pointer", fontWeight:700 }} onClick={() => setPayError("")}>✕</span>
              </div>
            )}
            <div style={{ marginBottom:14 }}>
              <label style={{ fontSize:11, fontWeight:600, color:"#78716c", textTransform:"uppercase", letterSpacing:"0.05em", display:"block", marginBottom:8 }}>Payment Method</label>
              <div style={{ display:"flex", gap:10 }}>
                {[
                  { val:"cash",    icon:"💵", label:"Cash"     },
                  { val:"account", icon:"🏦", label:"Account"  },
                  { val:"upi",     icon:"📲", label:"UPI"      },
                  { val:"cheque",  icon:"🧾", label:"Cheque"   },
                ].map(m => (
                  <button key={m.val} onClick={() => setPayForm(f => ({ ...f, method: m.val }))}
                    style={{ flex:1, padding:"10px 6px", borderRadius:10, cursor:"pointer", textAlign:"center", fontFamily:"'DM Sans',sans-serif", fontSize:11, transition:"all 0.15s",
                      border:   payForm.method === m.val ? "2px solid #065f46" : "1px solid #e7e5e4",
                      background: payForm.method === m.val ? "#f0fdf4" : "white",
                      fontWeight: payForm.method === m.val ? 700 : 400,
                      color:    payForm.method === m.val ? "#065f46" : "#78716c",
                    }}>
                    <div style={{ fontSize:18, marginBottom:3 }}>{m.icon}</div>
                    {m.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="form-grid">
              <div className="form-field" style={{ gridColumn:"span 2" }}>
                <label>Amount (₹) *</label>
                <input type="number" value={payForm.amount}
                  onChange={e => { setPayForm(f => ({ ...f, amount: e.target.value })); setPayError(""); }}
                  placeholder={payModal.credit_balance > 0 ? ("Max: ₹" + payModal.credit_balance.toLocaleString("en-IN")) : "0"}
                  style={{ fontSize:18, fontWeight:700, color:"#065f46" }} />
                {payModal.credit_balance > 0 && (
                  <div style={{ display:"flex", gap:8, marginTop:6 }}>
                    {[25, 50, 75, 100].map(pct => {
                      const amt = Math.round(payModal.credit_balance * pct / 100);
                      return (
                        <button key={pct} onClick={() => setPayForm(f => ({ ...f, amount: String(amt) }))}
                          style={{ flex:1, padding:"4px", borderRadius:6, fontSize:11, cursor:"pointer", border:"1px dashed #d97706", background:"#fffbf0", color:"#92400e", fontFamily:"'DM Sans',sans-serif" }}>
                          {pct === 100 ? "Full" : (pct + "%")}<br />
                          <span style={{ fontSize:10 }}>{fmt(amt)}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
              <div className="form-field">
                <label>Date *</label>
                <input type="date" value={payForm.date} onChange={e => setPayForm(f => ({ ...f, date: e.target.value }))} />
              </div>
              {(payForm.method === "account" || payForm.method === "upi" || payForm.method === "cheque") && (
                <div className="form-field">
                  <label>{payForm.method === "cheque" ? "Cheque No." : payForm.method === "upi" ? "UPI Ref No." : "Transaction Ref."}</label>
                  <input value={payForm.reference} onChange={e => setPayForm(f => ({ ...f, reference: e.target.value }))} placeholder="Optional reference number" />
                </div>
              )}
              <div className="form-field" style={{ gridColumn:"span 2" }}>
                <label>Note <span style={{ color:"#94a3b8", fontWeight:400, textTransform:"none" }}>(optional)</span></label>
                <input value={payForm.note} onChange={e => setPayForm(f => ({ ...f, note: e.target.value }))} placeholder="e.g. Partial payment, advance…" />
              </div>
            </div>
            {payForm.amount && +payForm.amount > 0 && (
              <div style={{ background:"#f0fdf4", border:"1px solid #a7f3d0", borderRadius:10, padding:"12px 16px", marginBottom:14, fontSize:13 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                  <span style={{ color:"#78716c" }}>Payment Amount</span>
                  <strong style={{ color:"#065f46", fontSize:16 }}>{fmt(+payForm.amount)}</strong>
                </div>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                  <span style={{ color:"#78716c" }}>Current Balance</span>
                  <span style={{ color:"#b91c1c", fontWeight:600 }}>{fmt(payModal.credit_balance)}</span>
                </div>
                <div style={{ height:1, background:"#a7f3d0", margin:"8px 0" }} />
                <div style={{ display:"flex", justifyContent:"space-between" }}>
                  <span style={{ color:"#78716c" }}>Balance After Payment</span>
                  <strong style={{ color: (payModal.credit_balance - +payForm.amount) <= 0 ? "#065f46" : "#b91c1c", fontSize:16 }}>
                    {fmt(Math.max(0, payModal.credit_balance - +payForm.amount))}
                    {(payModal.credit_balance - +payForm.amount) <= 0 && <span style={{ marginLeft:6, fontSize:12 }}>✅ Cleared!</span>}
                  </strong>
                </div>
              </div>
            )}
            <div style={{ display:"flex", gap:8, justifyContent:"flex-end" }}>
              <button className="btn btn-outline" onClick={() => setPayModal(null)}>Cancel</button>
              <button className="btn btn-green" onClick={recordPayment}>✅ Record Payment</button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════ HISTORY MODAL ══════════════ */}
      {selected && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setSelected(null)}>
          <div className="modal" style={{ maxWidth:640 }}>
            <div className="modal-title">
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <div style={{ width:34, height:34, borderRadius:8, background:"#1d4ed8", display:"flex", alignItems:"center", justifyContent:"center", color:"white", fontWeight:700 }}>
                  {selected.name[0]}
                </div>
                {selected.name}
              </div>
              <span className="modal-close" onClick={() => setSelected(null)}>✕</span>
            </div>

            {/* Summary cards */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, marginBottom:16 }}>
              {[
                { label:"Outstanding",    val: fmt(customers.find(cx => cx.id === selected.id)?.credit_balance || 0), color:"#b91c1c" },
                { label:"Total Purchased", val: fmt(custSales.reduce((s, x) => s + x.total_amount, 0)),               color:"#1d4ed8" },
                { label:"Total Paid",      val: fmt(custPayments.reduce((s, p) => s + p.amount, 0)),                   color:"#065f46" },
                { label:"Transactions",    val: allHistory.length,                                                      color:"#d97706" },
              ].map((sc, sci) => (
                <div key={sci} style={{ background:"#fafaf9", borderRadius:8, padding:"10px 12px", textAlign:"center", border:"1px solid #e7e5e4" }}>
                  <div style={{ fontSize:9, color:"#78716c", textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:3 }}>{sc.label}</div>
                  <div style={{ fontSize:15, fontWeight:700, color:sc.color }}>{sc.val}</div>
                </div>
              ))}
            </div>

            {/* Action buttons */}
            <div style={{ display:"flex", gap:8, marginBottom:14, alignItems:"center" }}>
              <button
                style={{ padding:"7px 14px", borderRadius:8, background:"#1d4ed8", color:"white", border:"none", cursor:"pointer", fontFamily:"'DM Sans',sans-serif", fontSize:12, fontWeight:500 }}
                onClick={() => {
                  const cx = customers.find(x => x.id === selected.id);
                  setSelected(null);
                  setSaleCustomer(cx);
                  setPage("sales");
                }}>
                🧾 New Sale
              </button>
              <button
                style={{ padding:"7px 14px", borderRadius:8, background:"#065f46", color:"white", border:"none", cursor:"pointer", fontFamily:"'DM Sans',sans-serif", fontSize:12, fontWeight:500 }}
                onClick={() => {
                  const cx = customers.find(cx2 => cx2.id === selected.id);
                  setSelected(null);
                  openPayment(cx);
                }}>
                💳 Record Payment
              </button>
              <a href={"https://wa.me/91" + selected.phone} target="_blank" rel="noreferrer">
                <button className="btn btn-wa btn-sm">📱 WhatsApp</button>
              </a>

              {/* Tab filters */}
              <div style={{ marginLeft:"auto", display:"flex", background:"#f5f5f4", padding:3, borderRadius:8, gap:2 }}>
                {[{ v:"all", l:"All" }, { v:"sales", l:"Sales" }, { v:"payments", l:"Payments" }].map(t => (
                  <button key={t.v} onClick={() => setHistTab(t.v)}
                    style={{ padding:"5px 12px", borderRadius:6, fontSize:11, cursor:"pointer", fontFamily:"'DM Sans',sans-serif", fontWeight:500, border:"none", transition:"all 0.15s",
                      background: histTab === t.v ? "white" : "transparent",
                      color:      histTab === t.v ? "#1c1208" : "#78716c",
                      boxShadow:  histTab === t.v ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                    }}>
                    {t.l}
                    <span style={{ marginLeft:4, fontSize:10, fontWeight:600, color: histTab === t.v ? "#d97706" : "#94a3b8" }}>
                      {t.v === "all" ? allHistory.length : t.v === "sales" ? custSales.length : custPayments.length}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* History table */}
            <div style={{ border:"1px solid #e7e5e4", borderRadius:10, overflow:"hidden", maxHeight:380, overflowY:"auto" }}>
              <table style={{ width:"100%", borderCollapse:"collapse" }}>
                <thead>
                  <tr style={{ background:"#fafaf9", position:"sticky", top:0 }}>
                    {["Date","Type","Details","Total","Received","Method / Mode","Balance Effect"].map(h => (
                      <th key={h} style={{ padding:"9px 13px", textAlign:"left", fontSize:10, fontWeight:600, color:"#78716c", textTransform:"uppercase", letterSpacing:"0.05em", borderBottom:"1px solid #e7e5e4", whiteSpace:"nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {histItems.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign:"center", padding:28, color:"#78716c", fontSize:13 }}>
                        No {histTab === "payments" ? "payments" : histTab === "sales" ? "sales" : "transactions"} found
                      </td>
                    </tr>
                  ) : histItems.map((item, hidx) => {
                    if (item._type === "sale") {
                      const prod = products.find(p => p.id === item.product_id);
                      return (
                        <tr key={"s-" + item.id} style={{ borderBottom:"1px solid #f5f5f4", background: hidx % 2 === 0 ? "white" : "#fafaf9" }}>
                          <td style={{ padding:"10px 13px", fontSize:12, color:"#78716c", whiteSpace:"nowrap" }}>{item.date}</td>
                          <td style={{ padding:"10px 13px" }}>
                            <span style={{ padding:"3px 8px", borderRadius:20, fontSize:10, fontWeight:600, background:"#dbeafe", color:"#1d4ed8" }}>🛒 Sale</span>
                          </td>
                          <td style={{ padding:"10px 13px", fontSize:12 }}>
                            <div style={{ fontWeight:500 }}>{prod ? prod.product_name : "—"}</div>
                            <div style={{ fontSize:11, color:"#78716c" }}>Qty: {item.quantity} {prod ? prod.unit : ""}</div>
                          </td>
                          <td style={{ padding:"10px 13px", fontWeight:700, color:"#b91c1c", fontSize:13 }}>{fmt(item.total_amount)}</td>
                          <td style={{ padding:"10px 13px", fontSize:12 }}>
                            {item.received_amount != null
                              ? <span style={{ color: item.received_amount < item.total_amount ? "#d97706" : "#065f46", fontWeight:600 }}>{fmt(item.received_amount)}</span>
                              : <span style={{ color:"#d4d4d4" }}>—</span>}
                          </td>
                          <td style={{ padding:"10px 13px" }}>
                            <span className={"badge badge-" + item.sale_type}>{item.sale_type}</span>
                          </td>
                          <td style={{ padding:"10px 13px", fontSize:12 }}>
                            {item.sale_type === "credit"
                              ? <span style={{ color:"#b91c1c", fontWeight:600 }}>↑ +{fmt(item.total_amount)}</span>
                              : <span style={{ color:"#065f46", fontWeight:500 }}>No change</span>}
                          </td>
                        </tr>
                      );
                    } else {
                      const methodIcons = { cash:"💵", account:"🏦", upi:"📲", cheque:"🧾" };
                      const isSalePay = item.from_sale;
                      return (
                        <tr key={"p-" + item.id} style={{ borderBottom:"1px solid #f5f5f4", background: hidx % 2 === 0 ? (isSalePay ? "#eff6ff" : "#f0fdf4") : (isSalePay ? "#e0f2fe" : "#ecfdf5") }}>
                          <td style={{ padding:"10px 13px", fontSize:12, color:"#78716c", whiteSpace:"nowrap" }}>{item.date}</td>
                          <td style={{ padding:"10px 13px" }}>
                            {isSalePay
                              ? <span style={{ padding:"3px 8px", borderRadius:20, fontSize:10, fontWeight:600, background:"#dbeafe", color:"#1d4ed8" }}>💵 Sale Payment</span>
                              : <span style={{ padding:"3px 8px", borderRadius:20, fontSize:10, fontWeight:600, background:"#d1fae5", color:"#065f46" }}>💳 Payment</span>}
                          </td>
                          <td style={{ padding:"10px 13px", fontSize:12 }}>
                            <div style={{ fontWeight:500 }}>{methodIcons[item.method] || "💰"} {item.method.charAt(0).toUpperCase() + item.method.slice(1)}</div>
                            {item.reference && <div style={{ fontSize:11, color:"#78716c" }}>Ref: {item.reference}</div>}
                            {item.note && <div style={{ fontSize:11, color:"#78716c", fontStyle:"italic" }}>{item.note}</div>}
                          </td>
                          <td style={{ padding:"10px 13px", fontWeight:700, color:"#065f46", fontSize:13 }}>− {fmt(item.amount)}</td>
                          <td style={{ padding:"10px 13px", fontSize:12, color:"#d4d4d4" }}>—</td>
                          <td style={{ padding:"10px 13px" }}>
                            <span style={{ padding:"3px 8px", borderRadius:20, fontSize:10, fontWeight:600, textTransform:"capitalize", background: isSalePay ? "#dbeafe" : "#d1fae5", color: isSalePay ? "#1d4ed8" : "#065f46" }}>
                              {item.method}
                            </span>
                          </td>
                          <td style={{ padding:"10px 13px", fontSize:12 }}>
                            <span style={{ color:"#065f46", fontWeight:600 }}>↓ −{fmt(item.amount)}</span>
                          </td>
                        </tr>
                      );
                    }
                  })}
                </tbody>
              </table>
            </div>

            <div style={{ marginTop:12, fontSize:11, color:"#78716c", textAlign:"center" }}>
              Showing {histItems.length} record{histItems.length !== 1 ? "s" : ""}
              {histTab === "all" && (" · " + custSales.length + " sales · " + custPayments.length + " payments")}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════ ADD CUSTOMER MODAL ══════════════ */}
      {addModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setAddModal(false)}>
          <div className="modal">
            <div className="modal-title">
              Add Customer
              <span className="modal-close" onClick={() => setAddModal(false)}>✕</span>
            </div>
            <div className="form-grid">
              <div className="form-field" style={{ gridColumn:"span 2" }}>
                <label>Customer Name *</label>
                <input value={addForm.name} onChange={e => setAddForm({ ...addForm, name: e.target.value })} placeholder="e.g. Murugan Farms" />
              </div>
              <div className="form-field">
                <label>Phone</label>
                <input value={addForm.phone} onChange={e => setAddForm({ ...addForm, phone: e.target.value })} placeholder="9876543210" />
              </div>
              <div className="form-field">
                <label>Address</label>
                <input value={addForm.address} onChange={e => setAddForm({ ...addForm, address: e.target.value })} placeholder="Village / Town" />
              </div>
              {user.role === "admin" && (
                <div className="form-field">
                  <label>Branch</label>
                  <select value={addForm.branch_id} onChange={e => setAddForm({ ...addForm, branch_id: e.target.value })}>
                    {BRANCHES.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                </div>
              )}
            </div>
            <div style={{ display:"flex", gap:8, justifyContent:"flex-end" }}>
              <button className="btn btn-outline" onClick={() => setAddModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={addCustomer}>Add Customer</button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════ EDIT CUSTOMER MODAL ══════════════ */}
      {editModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setEditModal(null)}>
          <div className="modal">
            <div className="modal-title">
              ✏️ Edit Customer
              <span className="modal-close" onClick={() => setEditModal(null)}>✕</span>
            </div>
            <div style={{ background:"#f8faff", border:"1px solid #dbeafe", borderRadius:8, padding:"10px 14px", marginBottom:16, fontSize:12, color:"#1d4ed8" }}>
              Editing: <strong>{editModal.name}</strong>
            </div>
            <div className="form-grid">
              <div className="form-field" style={{ gridColumn:"span 2" }}>
                <label>Customer Name *</label>
                <input value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} placeholder="e.g. Murugan Farms" />
              </div>
              <div className="form-field">
                <label>Phone</label>
                <input value={editForm.phone} onChange={e => setEditForm({ ...editForm, phone: e.target.value })} placeholder="9876543210" />
              </div>
              <div className="form-field">
                <label>Address</label>
                <input value={editForm.address} onChange={e => setEditForm({ ...editForm, address: e.target.value })} placeholder="Village / Town" />
              </div>
              {user.role === "admin" && (
                <div className="form-field">
                  <label>Branch</label>
                  <select value={editForm.branch_id} onChange={e => setEditForm({ ...editForm, branch_id: e.target.value })}>
                    {BRANCHES.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                </div>
              )}
            </div>
            <div style={{ display:"flex", gap:8, justifyContent:"flex-end" }}>
              <button className="btn btn-outline" onClick={() => setEditModal(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={saveEdit}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// ─────────────────────────────────────────
// PURCHASES PAGE
// ─────────────────────────────────────────
function PurchasesPage({ purchases, setPurchases, products, setProducts, units, setUnits }) {
  const [modal, setModal] = useState(false);
  const [editPurchase, setEditPurchase] = useState(null); // purchase being edited
  const [manageModal, setManageModal] = useState(false);

  const blankForm = () => ({ product_id: "", quantity: "", bags: "", price: "", unit: units[0]?.label || "50kg Bag", unitCustom: "", useCustomUnit: false, supplier: "", date: today(), branch_id: 1 });
  const [form, setForm] = useState(blankForm());
  const [newProd, setNewProd] = useState({ product_name: "", brand: "", purchase_price: "", selling_price: "", unit: units[0]?.label || "50kg Bag" });
  const [showAddProd, setShowAddProd] = useState(false);
  const [addProdError, setAddProdError] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [sort, setSort] = useState({ col: "date", dir: "desc" });

  // When product changes, auto-fill unit from product default
  const handleProductChange = (product_id) => {
    const prod = products.find(p => p.id === +product_id);
    setForm(f => ({
      ...f,
      product_id,
      price: prod ? String(prod.purchase_price) : f.price,
      unit: prod ? prod.unit : (units[0]?.label || ""),
      useCustomUnit: false,
      unitCustom: "",
    }));
  };

  const effectiveUnit = form.useCustomUnit ? form.unitCustom : form.unit;

  const handleSort = (col) => setSort(s => s.col === col ? { col, dir: s.dir === "asc" ? "desc" : "asc" } : { col, dir: "asc" });
  const SortIcon = ({ col }) => sort.col !== col
    ? <span style={{color:"#d4d4d4",fontSize:10,marginLeft:3}}>⇅</span>
    : <span style={{color:"#d97706",fontSize:10,marginLeft:3}}>{sort.dir === "asc" ? "↑" : "↓"}</span>;

  const sortedPurchases = [...purchases].sort((a, b) => {
    const pa = products.find(p => p.id === a.product_id);
    const pb = products.find(p => p.id === b.product_id);
    const ba = BRANCHES.find(br => br.id === a.branch_id);
    const bb = BRANCHES.find(br => br.id === b.branch_id);
    let va = "", vb = "";
    if (sort.col === "date")     { va = a.date; vb = b.date; }
    if (sort.col === "product")  { va = pa?.product_name || ""; vb = pb?.product_name || ""; }
    if (sort.col === "supplier") { va = a.supplier; vb = b.supplier; }
    if (sort.col === "branch")   { va = ba?.location || ""; vb = bb?.location || ""; }
    if (va < vb) return sort.dir === "asc" ? -1 : 1;
    if (va > vb) return sort.dir === "asc" ? 1 : -1;
    return 0;
  });

  const openAdd = () => { setEditPurchase(null); setForm(blankForm()); setShowAddProd(false); setModal(true); };
  const openEdit = (p) => {
    const isCustom = !units.some(u => u.label === p.unit);
    setEditPurchase(p);
    setForm({ ...p, product_id: String(p.product_id), quantity: String(p.quantity), bags: String(p.bags || ""), price: String(p.price), branch_id: p.branch_id, unit: isCustom ? (units[0]?.label || "") : p.unit, unitCustom: isCustom ? p.unit : "", useCustomUnit: isCustom });
    setShowAddProd(false); setModal(true);
  };

  const savePurchase = () => {
    if (!form.product_id || !form.quantity) return;
    const record = {
      id: editPurchase ? editPurchase.id : Date.now(),
      product_id: +form.product_id,
      quantity: +form.quantity,
      bags: form.bags ? +form.bags : null,
      price: +form.price,
      unit: effectiveUnit,
      supplier: form.supplier,
      date: form.date,
      branch_id: +form.branch_id,
    };
    if (editPurchase) {
      setPurchases(purchases.map(p => p.id === editPurchase.id ? record : p));
    } else {
      setPurchases([record, ...purchases]);
    }
    setModal(false); setForm(blankForm()); setShowAddProd(false);
    setNewProd({ product_name: "", brand: "", purchase_price: "", selling_price: "", unit: units[0]?.label || "50kg Bag" });
  };

  const deletePurchase = (id) => setPurchases(purchases.filter(p => p.id !== id));

  const addNewProductInline = () => {
    if (!newProd.product_name.trim()) { setAddProdError("Product name is required."); return; }
    if (!newProd.purchase_price || !newProd.selling_price) { setAddProdError("Purchase and selling price required."); return; }
    const created = { id: Date.now(), ...newProd, purchase_price: +newProd.purchase_price, selling_price: +newProd.selling_price, stock: 0 };
    setProducts(prev => [...prev, created]);
    setForm(f => ({ ...f, product_id: String(created.id), unit: created.unit, useCustomUnit: false, unitCustom: "", price: String(created.purchase_price) }));
    setShowAddProd(false);
    setNewProd({ product_name: "", brand: "", purchase_price: "", selling_price: "", unit: units[0]?.label || "50kg Bag" });
    setAddProdError("");
  };

  const deleteProduct = (id) => { setProducts(prev => prev.filter(p => p.id !== id)); setDeleteConfirm(null); };

  const thStyle = (col) => ({ cursor:"pointer", userSelect:"none", padding:"10px 16px", textAlign:"left", fontSize:11, fontWeight:600, letterSpacing:"0.06em", textTransform:"uppercase", color:"#78716c", background:"#fafaf9", borderBottom:"1px solid #e7e5e4" });

  return (
    <div className="page-body">
      <div className="section-header">
        <h3>🚚 Purchases</h3>
        <div className="table-actions">
          <button className="btn btn-outline btn-sm">⬆ Import Excel</button>
          <button className="btn btn-outline btn-sm">⬇ Export</button>
          <button className="btn btn-outline btn-sm" onClick={() => setManageModal(true)}>⚙️ Manage Products</button>
          <button className="btn btn-primary btn-sm" onClick={openAdd}>+ Add Purchase</button>
        </div>
      </div>

      {/* SORT BAR */}
      <div style={{display:"flex",gap:8,marginBottom:16,alignItems:"center",flexWrap:"wrap"}}>
        <span style={{fontSize:11,color:"#78716c",fontWeight:600,letterSpacing:"0.05em",textTransform:"uppercase"}}>Sort by:</span>
        {[{col:"date",label:"📅 Date"},{col:"product",label:"🌾 Product"},{col:"supplier",label:"🏭 Supplier"},{col:"branch",label:"📍 Branch"}].map(s => (
          <button key={s.col} onClick={() => handleSort(s.col)} style={{
            padding:"5px 12px",borderRadius:20,fontSize:12,cursor:"pointer",
            border:sort.col===s.col?"1px solid #d97706":"1px solid #e7e5e4",
            background:sort.col===s.col?"#fef3c7":"white",
            color:sort.col===s.col?"#92400e":"#78716c",
            fontFamily:"'DM Sans',sans-serif",fontWeight:sort.col===s.col?600:400,transition:"all 0.15s",
          }}>
            {s.label}{sort.col===s.col?(sort.dir==="asc"?" ↑":" ↓"):" ⇅"}
          </button>
        ))}
        {sort.col !== "date" && (
          <button onClick={() => setSort({col:"date",dir:"desc"})} style={{padding:"5px 10px",borderRadius:20,fontSize:11,cursor:"pointer",border:"1px solid #fecaca",background:"#fef2f2",color:"#b91c1c",fontFamily:"'DM Sans',sans-serif"}}>✕ Reset</button>
        )}
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th onClick={() => handleSort("date")} style={thStyle("date")}>Date <SortIcon col="date"/></th>
              <th onClick={() => handleSort("product")} style={thStyle("product")}>Product <SortIcon col="product"/></th>
              <th onClick={() => handleSort("supplier")} style={thStyle("supplier")}>Supplier <SortIcon col="supplier"/></th>
              <th style={thStyle()}>Qty / Bags</th>
              <th style={thStyle()}>Unit</th>
              <th style={thStyle()}>Price / Unit</th>
              <th style={thStyle()}>Total Value</th>
              <th onClick={() => handleSort("branch")} style={thStyle("branch")}>Branch <SortIcon col="branch"/></th>
              <th style={thStyle()}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedPurchases.map(p => {
              const prod = products.find(pr => pr.id === p.product_id);
              const branch = BRANCHES.find(b => b.id === p.branch_id);
              return (
                <tr key={p.id}>
                  <td style={{fontSize:12,color:"#78716c"}}>{p.date}</td>
                  <td style={{fontWeight:500}}>{prod?.product_name || "—"}</td>
                  <td style={{color:"#78716c",fontSize:12}}>{p.supplier}</td>
                  <td>
                    <span style={{fontWeight:600}}>{p.quantity}</span>
                    {p.bags && <span style={{color:"#78716c",fontSize:11,marginLeft:4}}>({p.bags} bags)</span>}
                  </td>
                  <td>
                    <span style={{padding:"3px 9px",borderRadius:20,fontSize:11,fontWeight:600,background:"#fef3c7",color:"#92400e",border:"1px solid #fde68a"}}>
                      {p.unit || prod?.unit || "—"}
                    </span>
                  </td>
                  <td style={{fontWeight:500}}>{fmt(p.price)}</td>
                  <td style={{fontWeight:700,color:"#065f46"}}>{fmt(p.quantity * p.price)}</td>
                  <td><span style={{padding:"2px 8px",borderRadius:20,fontSize:10,fontWeight:500,background:"#dbeafe",color:"#1d4ed8"}}>{branch?.location}</span></td>
                  <td>
                    <button className="btn btn-outline btn-sm" style={{marginRight:5}} onClick={() => openEdit(p)}>✏️</button>
                    <button className="btn btn-red btn-sm" onClick={() => deletePurchase(p.id)}>🗑</button>
                  </td>
                </tr>
              );
            })}
            {sortedPurchases.length === 0 && (
              <tr><td colSpan={9} style={{textAlign:"center",padding:30,color:"#78716c"}}>No purchases found</td></tr>
            )}
          </tbody>
        </table>
        <div className="summary-row">
          <span>{purchases.length} purchases</span>
          <strong style={{marginLeft:"auto"}}>Total: {fmt(purchases.reduce((s,p) => s + p.quantity*p.price, 0))}</strong>
        </div>
      </div>

      {/* ── ADD / EDIT PURCHASE MODAL ── */}
      {modal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && (setModal(false), setShowAddProd(false))}>
          <div className="modal" style={{maxWidth:640}}>
            <div className="modal-title">
              {editPurchase ? "✏️ Edit Purchase" : "🚚 New Purchase"}
              <span className="modal-close" onClick={() => { setModal(false); setShowAddProd(false); }}>✕</span>
            </div>

            {/* Product selector */}
            <div style={{marginBottom:14}}>
              <label style={{fontSize:11,fontWeight:600,color:"#78716c",textTransform:"uppercase",letterSpacing:"0.05em",display:"block",marginBottom:5}}>Product</label>
              <div style={{display:"flex",gap:8,alignItems:"center"}}>
                <select value={form.product_id} onChange={e => handleProductChange(e.target.value)}
                  style={{flex:1,padding:"9px 12px",borderRadius:8,border:"1px solid #e7e5e4",fontSize:13,fontFamily:"'DM Sans',sans-serif",outline:"none",background:"white"}}>
                  <option value="">— Select existing product —</option>
                  {products.map(p => <option key={p.id} value={p.id}>{p.product_name} ({p.brand}) — {p.unit}</option>)}
                </select>
                <button onClick={() => { setShowAddProd(v => !v); setAddProdError(""); }}
                  style={{padding:"9px 14px",borderRadius:8,fontSize:12,cursor:"pointer",whiteSpace:"nowrap",border:showAddProd?"1px solid #d97706":"1px dashed #d97706",background:showAddProd?"#fef3c7":"white",color:"#92400e",fontFamily:"'DM Sans',sans-serif",fontWeight:500}}>
                  {showAddProd ? "✕ Cancel" : "+ New Product"}
                </button>
              </div>
            </div>

            {/* Inline add new product */}
            {showAddProd && (
              <div style={{background:"#fffbf0",border:"1px solid #fde68a",borderRadius:10,padding:"14px",marginBottom:14}}>
                <div style={{fontSize:12,fontWeight:700,color:"#92400e",marginBottom:10}}>🌾 Add New Product to List</div>
                {addProdError && <div style={{background:"#fee2e2",color:"#b91c1c",borderRadius:6,padding:"7px 10px",fontSize:12,marginBottom:8}}>⚠️ {addProdError}</div>}
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
                  <div style={{gridColumn:"span 2"}}>
                    <label style={{fontSize:10,fontWeight:600,color:"#78716c",textTransform:"uppercase",letterSpacing:"0.05em",display:"block",marginBottom:4}}>Product Name *</label>
                    <input value={newProd.product_name} onChange={e => setNewProd({...newProd,product_name:e.target.value})} placeholder="e.g. Cattle Feed Gold"
                      style={{width:"100%",padding:"8px 10px",borderRadius:7,border:"1px solid #fde68a",fontSize:13,fontFamily:"'DM Sans',sans-serif",outline:"none",background:"white"}} />
                  </div>
                  <div><label style={{fontSize:10,fontWeight:600,color:"#78716c",textTransform:"uppercase",letterSpacing:"0.05em",display:"block",marginBottom:4}}>Brand</label>
                    <input value={newProd.brand} onChange={e => setNewProd({...newProd,brand:e.target.value})} placeholder="e.g. Suguna"
                      style={{width:"100%",padding:"8px 10px",borderRadius:7,border:"1px solid #fde68a",fontSize:13,fontFamily:"'DM Sans',sans-serif",outline:"none",background:"white"}} />
                  </div>
                  <div><label style={{fontSize:10,fontWeight:600,color:"#78716c",textTransform:"uppercase",letterSpacing:"0.05em",display:"block",marginBottom:4}}>Unit</label>
                    <select value={newProd.unit} onChange={e => setNewProd({...newProd,unit:e.target.value})}
                      style={{width:"100%",padding:"8px 10px",borderRadius:7,border:"1px solid #fde68a",fontSize:13,fontFamily:"'DM Sans',sans-serif",outline:"none",background:"white"}}>
                      {units.map(u => <option key={u.id} value={u.label}>{u.label}</option>)}
                    </select>
                  </div>
                  <div><label style={{fontSize:10,fontWeight:600,color:"#78716c",textTransform:"uppercase",letterSpacing:"0.05em",display:"block",marginBottom:4}}>Purchase Price (₹) *</label>
                    <input type="number" value={newProd.purchase_price} onChange={e => setNewProd({...newProd,purchase_price:e.target.value})} placeholder="0"
                      style={{width:"100%",padding:"8px 10px",borderRadius:7,border:"1px solid #fde68a",fontSize:13,fontFamily:"'DM Sans',sans-serif",outline:"none",background:"white"}} />
                  </div>
                  <div><label style={{fontSize:10,fontWeight:600,color:"#78716c",textTransform:"uppercase",letterSpacing:"0.05em",display:"block",marginBottom:4}}>Selling Price (₹) *</label>
                    <input type="number" value={newProd.selling_price} onChange={e => setNewProd({...newProd,selling_price:e.target.value})} placeholder="0"
                      style={{width:"100%",padding:"8px 10px",borderRadius:7,border:"1px solid #fde68a",fontSize:13,fontFamily:"'DM Sans',sans-serif",outline:"none",background:"white"}} />
                  </div>
                </div>
                <button onClick={addNewProductInline}
                  style={{padding:"8px 16px",borderRadius:8,background:"#d97706",color:"white",border:"none",fontSize:12,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontWeight:500}}>
                  ✓ Add Product & Select
                </button>
              </div>
            )}

            {/* ── UNIT field (dropdown + editable custom) ── */}
            <div style={{background:"#f8faff",border:"1px solid #dbeafe",borderRadius:10,padding:"14px",marginBottom:14}}>
              <div style={{fontSize:11,fontWeight:700,color:"#1d4ed8",marginBottom:10,textTransform:"uppercase",letterSpacing:"0.06em"}}>
                📦 Unit of Purchase
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr auto 1fr",gap:10,alignItems:"end"}}>
                {/* Dropdown */}
                <div>
                  <label style={{fontSize:10,fontWeight:600,color:"#78716c",textTransform:"uppercase",letterSpacing:"0.05em",display:"block",marginBottom:4}}>
                    Select Unit
                  </label>
                  <select
                    value={form.useCustomUnit ? "__custom__" : form.unit}
                    onChange={e => {
                      if (e.target.value === "__custom__") setForm(f => ({...f, useCustomUnit:true, unit: units[0]?.label || ""}));
                      else setForm(f => ({...f, unit:e.target.value, useCustomUnit:false, unitCustom:""}));
                    }}
                    style={{width:"100%",padding:"9px 12px",borderRadius:8,border: form.useCustomUnit ? "1px solid #e7e5e4":"2px solid #3b82f6",fontSize:13,fontFamily:"'DM Sans',sans-serif",outline:"none",background:"white",transition:"border 0.15s"}}>
                    {units.map(u => <option key={u.id} value={u.label}>{u.label}</option>)}
                    <option value="__custom__">✏️ Type custom unit…</option>
                  </select>
                </div>
                {/* OR divider */}
                <div style={{textAlign:"center",fontSize:11,color:"#78716c",fontWeight:600,paddingBottom:8}}>OR</div>
                {/* Custom input */}
                <div>
                  <label style={{fontSize:10,fontWeight:600,color:"#78716c",textTransform:"uppercase",letterSpacing:"0.05em",display:"block",marginBottom:4}}>
                    Custom Unit <span style={{color:"#94a3b8",fontWeight:400,textTransform:"none"}}>(type freely)</span>
                  </label>
                  <input
                    value={form.useCustomUnit ? form.unitCustom : ""}
                    onChange={e => setForm(f => ({...f, unitCustom:e.target.value, useCustomUnit:true}))}
                    onClick={() => setForm(f => ({...f, useCustomUnit:true}))}
                    placeholder="e.g. 40kg Sack, Tonne…"
                    style={{width:"100%",padding:"9px 12px",borderRadius:8,fontSize:13,fontFamily:"'DM Sans',sans-serif",outline:"none",transition:"border 0.15s",
                      border: form.useCustomUnit ? "2px solid #d97706":"1px solid #e7e5e4",
                      background: form.useCustomUnit ? "#fffbf0":"#fafaf9",color: form.useCustomUnit ? "#1c1208":"#94a3b8"}} />
                </div>
              </div>
              {/* Preview chip */}
              {effectiveUnit && (
                <div style={{marginTop:10,display:"flex",alignItems:"center",gap:8,fontSize:12,color:"#78716c"}}>
                  <span>Selected unit:</span>
                  <span style={{padding:"3px 12px",borderRadius:20,fontWeight:700,fontSize:12,background:"#fef3c7",color:"#92400e",border:"1px solid #fde68a"}}>
                    {effectiveUnit}
                  </span>
                  {form.useCustomUnit && effectiveUnit && (
                    <button onClick={() => {
                      if (!units.some(u => u.label === effectiveUnit)) setUnits(prev => [...prev, {id:Date.now(), label:effectiveUnit}]);
                    }} style={{padding:"3px 10px",borderRadius:6,background:"#d97706",color:"white",border:"none",fontSize:10,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontWeight:500}}>
                      + Save to list
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Rest of form */}
            <div className="form-grid">
              <div className="form-field">
                <label>Quantity <span style={{color:"#94a3b8",fontWeight:400,fontSize:10}}>(total units)</span></label>
                <input type="number" value={form.quantity} onChange={e => setForm({...form,quantity:e.target.value})} placeholder="e.g. 350" />
              </div>
              <div className="form-field">
                <label>No. of Bags <span style={{color:"#94a3b8",fontWeight:400,fontSize:10}}>(optional)</span></label>
                <input type="number" value={form.bags} onChange={e => setForm({...form,bags:e.target.value})} placeholder="e.g. 5 bags" />
              </div>
              <div className="form-field">
                <label>Price / Unit (₹)</label>
                <input type="number" value={form.price} onChange={e => setForm({...form,price:e.target.value})} placeholder="0" />
              </div>
              <div className="form-field">
                <label>Supplier</label>
                <input value={form.supplier} onChange={e => setForm({...form,supplier:e.target.value})} placeholder="e.g. Suguna Feeds Ltd" />
              </div>
              <div className="form-field">
                <label>Date</label>
                <input type="date" value={form.date} onChange={e => setForm({...form,date:e.target.value})} />
              </div>
              <div className="form-field">
                <label>Branch</label>
                <select value={form.branch_id} onChange={e => setForm({...form,branch_id:e.target.value})}>
                  {BRANCHES.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>
            </div>

            {/* Total preview */}
            {form.quantity && form.price && (
              <div style={{background:"#f0fdf4",borderRadius:8,padding:"11px 16px",marginBottom:14,display:"flex",alignItems:"center",gap:16,fontSize:13,flexWrap:"wrap"}}>
                <span>💰 <strong>Total Value:</strong> <span style={{color:"#065f46",fontWeight:700,fontSize:15}}>{fmt(+form.quantity * +form.price)}</span></span>
                {effectiveUnit && <span style={{color:"#78716c"}}>@ <strong>{fmt(+form.price)}</strong> per <strong>{effectiveUnit}</strong></span>}
                {form.bags && <span style={{color:"#78716c"}}>| <strong>{form.bags}</strong> bags</span>}
              </div>
            )}

            <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
              <button className="btn btn-outline" onClick={() => { setModal(false); setShowAddProd(false); }}>Cancel</button>
              <button className="btn btn-primary" onClick={savePurchase}>
                {editPurchase ? "💾 Update Purchase" : "💾 Record Purchase"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MANAGE PRODUCTS MODAL ── */}
      {manageModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setManageModal(false)}>
          <div className="modal" style={{maxWidth:640}}>
            <div className="modal-title">⚙️ Manage Product List <span className="modal-close" onClick={() => setManageModal(false)}>✕</span></div>
            <div className="alert alert-warning" style={{marginBottom:14}}>
              ⚠️ Deleting a product removes it from the dropdown. Existing purchase records are not affected.
            </div>
            <div style={{border:"1px solid #e7e5e4",borderRadius:10,overflow:"hidden",maxHeight:400,overflowY:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse"}}>
                <thead>
                  <tr style={{background:"#fafaf9",borderBottom:"1px solid #e7e5e4"}}>
                    {["Product Name","Brand","Unit","Buy ₹","Sell ₹","Action"].map(h => (
                      <th key={h} style={{padding:"9px 14px",textAlign: h==="Buy ₹"||h==="Sell ₹"?"right":"left",fontSize:10,fontWeight:600,color:"#78716c",textTransform:"uppercase",letterSpacing:"0.06em"}}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p.id} style={{borderBottom:"1px solid #f5f5f4",background:deleteConfirm===p.id?"#fef2f2":"white",transition:"background 0.2s"}}>
                      <td style={{padding:"10px 14px",fontWeight:500,fontSize:13}}>{p.product_name}</td>
                      <td style={{padding:"10px 14px",color:"#78716c",fontSize:12}}>{p.brand||"—"}</td>
                      <td style={{padding:"10px 14px",fontSize:12}}>
                        <span style={{padding:"2px 8px",borderRadius:20,fontSize:11,background:"#fef3c7",color:"#92400e"}}>{p.unit}</span>
                      </td>
                      <td style={{padding:"10px 14px",textAlign:"right",fontSize:12}}>{fmt(p.purchase_price)}</td>
                      <td style={{padding:"10px 14px",textAlign:"right",fontSize:12,color:"#065f46",fontWeight:600}}>{fmt(p.selling_price)}</td>
                      <td style={{padding:"10px 14px",textAlign:"center"}}>
                        {deleteConfirm===p.id ? (
                          <div style={{display:"flex",gap:6,justifyContent:"center"}}>
                            <button onClick={() => deleteProduct(p.id)} style={{padding:"4px 10px",borderRadius:6,background:"#b91c1c",color:"white",border:"none",fontSize:11,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>Yes</button>
                            <button onClick={() => setDeleteConfirm(null)} style={{padding:"4px 10px",borderRadius:6,background:"#f5f5f4",color:"#78716c",border:"1px solid #e7e5e4",fontSize:11,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>Cancel</button>
                          </div>
                        ) : (
                          <button onClick={() => setDeleteConfirm(p.id)} style={{padding:"4px 10px",borderRadius:6,background:"#fee2e2",color:"#b91c1c",border:"1px solid #fecaca",fontSize:11,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontWeight:500}}>🗑 Remove</button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {products.length===0 && <tr><td colSpan={6} style={{textAlign:"center",padding:24,color:"#78716c",fontSize:13}}>No products</td></tr>}
                </tbody>
              </table>
            </div>
            <div style={{marginTop:14,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{fontSize:12,color:"#78716c"}}>{products.length} products</span>
              <button className="btn btn-primary btn-sm" onClick={() => { setManageModal(false); openAdd(); setShowAddProd(true); }}>+ Add New Product</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────
// EXPENSES PAGE
// ─────────────────────────────────────────
function ExpensesPage({ expenses, setExpenses }) {
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ category: "Rent", description: "", amount: "", date: today(), branch_id: 1 });

  const add = () => {
    if (!form.description || !form.amount) return;
    setExpenses([{ id: Date.now(), ...form, amount: +form.amount, branch_id: +form.branch_id }, ...expenses]);
    setModal(false); setForm({ category: "Rent", description: "", amount: "", date: today(), branch_id: 1 });
  };

  const byCategory = ["Rent","Salary","Electricity","Transport","Miscellaneous"].map(cat => ({
    cat, total: expenses.filter(e => e.category === cat).reduce((s,e) => s+e.amount, 0)
  }));

  return (
    <div className="page-body">
      <div className="section-header">
        <h3>💰 Expenses</h3>
        <div className="table-actions">
          <button className="btn btn-outline btn-sm">⬇ Export</button>
          <button className="btn btn-primary btn-sm" onClick={() => setModal(true)}>+ Add Expense</button>
        </div>
      </div>

      <div className="stat-grid" style={{gridTemplateColumns:"repeat(5,1fr)",marginBottom:20}}>
        {byCategory.map(({cat,total}) => (
          <div className="stat-card" key={cat} style={{padding:"14px 16px"}}>
            <div className="accent-bar" style={{background:"#d97706"}}></div>
            <div className="label">{cat}</div>
            <div className="value" style={{fontSize:18,color:"#b91c1c"}}>{fmt(total)}</div>
          </div>
        ))}
      </div>

      <div className="table-wrap">
        <table>
          <thead><tr><th>Date</th><th>Category</th><th>Description</th><th>Branch</th><th>Amount</th></tr></thead>
          <tbody>
            {expenses.map(e => {
              const branch = BRANCHES.find(b => b.id === e.branch_id);
              return (
                <tr key={e.id}>
                  <td style={{fontSize:12,color:"#78716c"}}>{e.date}</td>
                  <td><span className="badge" style={{background:"#fef3c7",color:"#92400e"}}>{e.category}</span></td>
                  <td>{e.description}</td>
                  <td style={{fontSize:12,color:"#78716c"}}>{branch?.location || "All"}</td>
                  <td style={{fontWeight:600,color:"#b91c1c"}}>{fmt(e.amount)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="summary-row">
          <span>{expenses.length} entries</span>
          <strong style={{marginLeft:"auto",color:"#b91c1c"}}>Total: {fmt(expenses.reduce((s,e)=>s+e.amount,0))}</strong>
        </div>
      </div>

      {modal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModal(false)}>
          <div className="modal">
            <div className="modal-title">Add Expense <span className="modal-close" onClick={() => setModal(false)}>✕</span></div>
            <div className="form-grid">
              <div className="form-field">
                <label>Category</label>
                <select value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                  {["Rent","Salary","Electricity","Transport","Miscellaneous"].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-field">
                <label>Branch</label>
                <select value={form.branch_id} onChange={e => setForm({...form, branch_id: e.target.value})}>
                  <option value="">All Branches</option>
                  {BRANCHES.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>
              <div className="form-field" style={{gridColumn:"span 2"}}>
                <label>Description</label>
                <input value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
              </div>
              <div className="form-field"><label>Amount (₹)</label><input type="number" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} /></div>
              <div className="form-field"><label>Date</label><input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} /></div>
            </div>
            <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
              <button className="btn btn-outline" onClick={() => setModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={add}>Add Expense</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────
// STOCK PAGE
// ─────────────────────────────────────────
function StockPage({ products, purchases, sales, user }) {
  const getStock = (productId) => {
    const purchased = purchases.filter(p => p.product_id === productId).reduce((s,p) => s + p.quantity, 0);
    const sold = sales.filter(s => s.product_id === productId).reduce((sum,s) => sum + s.quantity, 0);
    return { purchased, sold, remaining: purchased + (products.find(p => p.id === productId)?.stock || 0) - sold };
  };

  return (
    <div className="page-body">
      <div className="section-header">
        <h3>📦 Stock Management</h3>
        <div className="table-actions">
          <button className="btn btn-outline btn-sm">⬇ Export</button>
        </div>
      </div>
      <div className="alert alert-info" style={{marginBottom:16}}>
        ℹ️ Stock = Initial Stock + Total Purchases − Total Sales. Low stock threshold: 20 units.
      </div>
      <div className="table-wrap">
        <table>
          <thead><tr>
            <th>Product</th><th>Unit</th><th>Purchased</th><th>Sold</th>
            <th>Remaining</th><th>Value</th><th>Status</th>
          </tr></thead>
          <tbody>
            {products.map(p => {
              const s = getStock(p.id);
              return (
                <tr key={p.id}>
                  <td style={{fontWeight:500}}>{p.product_name}</td>
                  <td style={{fontSize:12,color:"#78716c"}}>{p.unit}</td>
                  <td style={{color:"#065f46"}}>{s.purchased}</td>
                  <td style={{color:"#1d4ed8"}}>{s.sold}</td>
                  <td style={{fontWeight:700,fontSize:16}}>{s.remaining}</td>
                  <td style={{fontWeight:600}}>{fmt(s.remaining * p.selling_price)}</td>
                  <td>
                    <span className={`badge ${s.remaining < 20 ? "badge-low" : "badge-ok"}`}>
                      {s.remaining < 20 ? "⚠️ Low" : "✓ OK"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="summary-row">
          <span>{products.filter(p => getStock(p.id).remaining < 20).length} products low on stock</span>
          <strong style={{marginLeft:"auto"}}>Total Stock Value: {fmt(products.reduce((sum,p) => sum + getStock(p.id).remaining * p.selling_price, 0))}</strong>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// REPORTS PAGE
// ─────────────────────────────────────────
function ReportsPage({ sales, purchases, customers, expenses, products }) {
  const [tab, setTab] = useState("sales");
  const [filter, setFilter] = useState({ branch: "", from: "2026-03-01", to: "2026-03-05" });

  const filtered = sales.filter(s =>
    (!filter.branch || s.branch_id === +filter.branch) &&
    s.date >= filter.from && s.date <= filter.to
  );

  const totalSales = filtered.reduce((s,x) => s+x.total_amount, 0);
  const totalPurchases = purchases.reduce((s,p) => s + p.quantity*p.price, 0);
  const totalExpenses = expenses.reduce((s,e) => s+e.amount, 0);
  const profit = totalSales - totalPurchases - totalExpenses;

  const productReport = products.map(p => ({
    ...p,
    qtySold: filtered.filter(s => s.product_id === p.id).reduce((s,x) => s+x.quantity, 0),
    value: filtered.filter(s => s.product_id === p.id).reduce((s,x) => s+x.total_amount, 0),
  }));

  const creditReport = customers.filter(c => c.credit_balance > 0);

  return (
    <div className="page-body">
      <div className="section-header">
        <h3>📈 Reports</h3>
        <div className="table-actions">
          <button className="btn btn-outline btn-sm">⬇ Excel</button>
          <button className="btn btn-outline btn-sm">📄 PDF</button>
        </div>
      </div>

      <div className="tabs">
        {["sales","products","credit","profit"].map(t => (
          <div key={t} className={`tab${tab===t?" active":""}`} onClick={() => setTab(t)}
            style={{textTransform:"capitalize"}}>{t}</div>
        ))}
      </div>

      <div style={{display:"flex",gap:10,marginBottom:16,flexWrap:"wrap"}}>
        <select style={{padding:"7px 10px",borderRadius:8,border:"1px solid #e7e5e4",fontSize:12,width:"auto"}}
          value={filter.branch} onChange={e => setFilter({...filter, branch: e.target.value})}>
          <option value="">All Branches</option>
          {BRANCHES.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>
        <input type="date" style={{padding:"7px 10px",borderRadius:8,border:"1px solid #e7e5e4",fontSize:12}}
          value={filter.from} onChange={e => setFilter({...filter, from: e.target.value})} />
        <span style={{lineHeight:"32px",fontSize:12,color:"#78716c"}}>to</span>
        <input type="date" style={{padding:"7px 10px",borderRadius:8,border:"1px solid #e7e5e4",fontSize:12}}
          value={filter.to} onChange={e => setFilter({...filter, to: e.target.value})} />
      </div>

      {tab === "sales" && (
        <div className="table-wrap">
          <table>
            <thead><tr><th>Date</th><th>Branch</th><th>Product</th><th>Customer</th><th>Qty</th><th>Total</th><th>Type</th></tr></thead>
            <tbody>
              {filtered.map(s => {
                const prod = products.find(p => p.id === s.product_id);
                const cust = customers.find(c => c.id === s.customer_id);
                const branch = BRANCHES.find(b => b.id === s.branch_id);
                return (
                  <tr key={s.id}>
                    <td style={{fontSize:12,color:"#78716c"}}>{s.date}</td>
                    <td style={{fontSize:12}}>{branch?.location}</td>
                    <td>{prod?.product_name}</td>
                    <td>{cust?.name}</td>
                    <td>{s.quantity}</td>
                    <td style={{fontWeight:600}}>{fmt(s.total_amount)}</td>
                    <td><span className={`badge badge-${s.sale_type}`}>{s.sale_type}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="summary-row">
            <span>{filtered.length} sales</span>
            <strong style={{marginLeft:"auto"}}>Total: {fmt(totalSales)}</strong>
          </div>
        </div>
      )}

      {tab === "products" && (
        <div className="table-wrap">
          <table>
            <thead><tr><th>Product</th><th>Unit</th><th>Qty Sold</th><th>Revenue</th><th>Purchase Cost</th><th>Gross Profit</th></tr></thead>
            <tbody>
              {productReport.filter(p => p.qtySold > 0).map(p => {
                const cost = p.qtySold * p.purchase_price;
                const gp = p.value - cost;
                return (
                  <tr key={p.id}>
                    <td style={{fontWeight:500}}>{p.product_name}</td>
                    <td style={{fontSize:12,color:"#78716c"}}>{p.unit}</td>
                    <td>{p.qtySold}</td>
                    <td style={{fontWeight:600,color:"#065f46"}}>{fmt(p.value)}</td>
                    <td style={{color:"#b91c1c"}}>{fmt(cost)}</td>
                    <td className="profit-positive">{fmt(gp)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {tab === "credit" && (
        <div className="table-wrap">
          <table>
            <thead><tr><th>Customer</th><th>Phone</th><th>Branch</th><th>Credit Balance</th></tr></thead>
            <tbody>
              {creditReport.map(c => {
                const branch = BRANCHES.find(b => b.id === c.branch_id);
                return (
                  <tr key={c.id}>
                    <td style={{fontWeight:500}}>{c.name}</td>
                    <td style={{color:"#78716c",fontSize:12}}>+91 {c.phone}</td>
                    <td style={{fontSize:12,color:"#78716c"}}>{branch?.location}</td>
                    <td style={{fontWeight:700,color:"#b91c1c"}}>{fmt(c.credit_balance)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="summary-row">
            <span>{creditReport.length} customers with credit</span>
            <strong style={{marginLeft:"auto",color:"#b91c1c"}}>Total Outstanding: {fmt(creditReport.reduce((s,c)=>s+c.credit_balance,0))}</strong>
          </div>
        </div>
      )}

      {tab === "profit" && (
        <div>
          <div className="stat-grid">
            <div className="stat-card">
              <div className="accent-bar" style={{background:"#065f46"}}></div>
              <div className="label">Total Sales</div>
              <div className="value" style={{color:"#065f46"}}>{fmt(totalSales)}</div>
            </div>
            <div className="stat-card">
              <div className="accent-bar" style={{background:"#b91c1c"}}></div>
              <div className="label">Total Purchases</div>
              <div className="value" style={{color:"#b91c1c"}}>{fmt(totalPurchases)}</div>
            </div>
            <div className="stat-card">
              <div className="accent-bar" style={{background:"#d97706"}}></div>
              <div className="label">Total Expenses</div>
              <div className="value" style={{color:"#d97706"}}>{fmt(totalExpenses)}</div>
            </div>
            <div className="stat-card">
              <div className="accent-bar" style={{background: profit > 0 ? "#065f46" : "#b91c1c"}}></div>
              <div className="label">Net Profit / Loss</div>
              <div className="value" style={{color: profit > 0 ? "#065f46" : "#b91c1c"}}>{fmt(profit)}</div>
              <div className="sub">{profit > 0 ? "✅ Profitable" : "❌ Loss"}</div>
            </div>
          </div>
          <div className="card">
            <div className="card-title">Profit Breakdown</div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={[{name:"Sales",value:totalSales},{name:"Purchases",value:totalPurchases},{name:"Expenses",value:totalExpenses},{name:"Profit",value:profit}]} barSize={40}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f4" />
                <XAxis dataKey="name" tick={{fontSize:12}} />
                <YAxis tick={{fontSize:10}} tickFormatter={v => "₹"+v/1000+"K"} />
                <Tooltip formatter={v => fmt(v)} />
                <Bar dataKey="value" fill="#d97706" radius={[4,4,0,0]}>
                  {[{},{},{},{fill: profit > 0 ? "#065f46" : "#b91c1c"}].map((entry, i) => (
                    <Cell key={i} fill={i === 3 ? (profit > 0 ? "#065f46" : "#b91c1c") : COLORS[i]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────
// BALANCE SHEET
// ─────────────────────────────────────────
function BalanceSheetPage({ sales, purchases, customers, expenses, products }) {
  const stockValue = products.reduce((sum,p) => {
    const sold = sales.filter(s => s.product_id === p.id).reduce((s,x) => s+x.quantity, 0);
    const rem = p.stock + purchases.filter(pu => pu.product_id === p.id).reduce((s,x) => s+x.quantity, 0) - sold;
    return sum + rem * p.purchase_price;
  }, 0);

  const cashSales = sales.filter(s => s.sale_type === "cash").reduce((s,x) => s+x.total_amount, 0);
  const creditOutstanding = customers.reduce((s,c) => s+c.credit_balance, 0);
  const totalExpenses = expenses.reduce((s,e) => s+e.amount, 0);
  const totalSales = sales.reduce((s,x) => s+x.total_amount, 0);
  const totalPurchases = purchases.reduce((s,p) => s+p.quantity*p.price, 0);
  const profit = totalSales - totalPurchases - totalExpenses;

  const assets = stockValue + cashSales;
  const liabilities = creditOutstanding + totalExpenses;

  return (
    <div className="page-body">
      <div className="section-header">
        <h3>⚖️ Balance Sheet</h3>
        <div className="table-actions">
          <button className="btn btn-outline btn-sm">⬇ Export Excel</button>
          <button className="btn btn-outline btn-sm">📄 Export PDF</button>
        </div>
      </div>

      <div className="alert alert-info" style={{marginBottom:16}}>
        ℹ️ Auto-calculated from all transactions. Date: March 2026
      </div>

      <div className="bs-grid">
        <div className="bs-card">
          <div className="bs-card-title" style={{background:"#f0fdf4",color:"#065f46"}}>🟢 ASSETS</div>
          <div className="bs-row"><span>Stock Value (at cost)</span><strong>{fmt(stockValue)}</strong></div>
          <div className="bs-row"><span>Cash Sales Received</span><strong>{fmt(cashSales)}</strong></div>
          <div className="bs-row"><span>Other Assets</span><strong>{fmt(0)}</strong></div>
          <div className="bs-total"><span>Total Assets</span><span style={{color:"#065f46"}}>{fmt(assets)}</span></div>
        </div>
        <div className="bs-card">
          <div className="bs-card-title" style={{background:"#fef2f2",color:"#b91c1c"}}>🔴 LIABILITIES</div>
          <div className="bs-row"><span>Customer Credit Outstanding</span><strong style={{color:"#b91c1c"}}>{fmt(creditOutstanding)}</strong></div>
          <div className="bs-row"><span>Total Expenses</span><strong style={{color:"#b91c1c"}}>{fmt(totalExpenses)}</strong></div>
          <div className="bs-row"><span>Purchase Payments</span><strong style={{color:"#b91c1c"}}>{fmt(totalPurchases)}</strong></div>
          <div className="bs-total"><span>Total Liabilities</span><span style={{color:"#b91c1c"}}>{fmt(liabilities)}</span></div>
        </div>
      </div>

      <div className="card">
        <div className="card-title">📊 Profit & Loss Summary</div>
        <div className="bs-row"><span>Total Revenue (Sales)</span><strong style={{color:"#065f46"}}>{fmt(totalSales)}</strong></div>
        <div className="bs-row"><span>Less: Purchases</span><strong style={{color:"#b91c1c"}}>− {fmt(totalPurchases)}</strong></div>
        <div className="bs-row"><span>Less: Operating Expenses</span><strong style={{color:"#b91c1c"}}>− {fmt(totalExpenses)}</strong></div>
        <div className="divider" style={{margin:"8px 0"}}/>
        <div className="bs-row" style={{background: profit > 0 ? "#f0fdf4" : "#fef2f2", borderRadius:8, fontWeight:700}}>
          <span style={{fontSize:15}}>{profit > 0 ? "✅ Net Profit" : "❌ Net Loss"}</span>
          <strong style={{fontSize:18, color: profit > 0 ? "#065f46" : "#b91c1c"}}>{fmt(Math.abs(profit))}</strong>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// BRANCH DASHBOARD
// ─────────────────────────────────────────
function BranchDashboard({ user, sales, customers, products, purchases }) {
  const branchSales = sales.filter(s => s.branch_id === user.branch_id);
  const branchCustomers = customers.filter(c => c.branch_id === user.branch_id);
  const todaySales = branchSales.filter(s => s.date === "2026-03-04").reduce((s,x) => s+x.total_amount, 0);
  const monthSales = branchSales.reduce((s,x) => s+x.total_amount, 0);
  const creditOutstanding = branchCustomers.reduce((s,c) => s+c.credit_balance, 0);
  const branch = BRANCHES.find(b => b.id === user.branch_id);

  const dailyData = ["2026-03-01","2026-03-02","2026-03-03","2026-03-04"].map(d => ({
    day: d.split("-")[2] + " Mar",
    sales: branchSales.filter(s => s.date === d).reduce((s,x) => s+x.total_amount, 0)
  }));

  return (
    <div className="page-body">
      <div className="alert alert-info" style={{marginBottom:20}}>
        📍 {branch?.name} — {branch?.location}
      </div>
      <div className="stat-grid">
        {[
          { label: "Today's Sales", value: fmt(todaySales), icon: "🧾", color: "#d97706" },
          { label: "Monthly Sales", value: fmt(monthSales), icon: "📈", color: "#065f46" },
          { label: "Credit Outstanding", value: fmt(creditOutstanding), icon: "⚠️", color: "#b91c1c" },
          { label: "My Customers", value: branchCustomers.length, icon: "👥", color: "#1d4ed8" },
        ].map((s,i) => (
          <div className="stat-card" key={i}>
            <div className="accent-bar" style={{background:s.color}}></div>
            <div className="label">{s.label}</div>
            <div className="value" style={{color:s.color}}>{s.value}</div>
            <div className="icon-bg">{s.icon}</div>
          </div>
        ))}
      </div>
      <div className="chart-grid">
        <div className="card">
          <div className="card-title">📊 Daily Sales — This Week</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={dailyData} barSize={30}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f4" />
              <XAxis dataKey="day" tick={{fontSize:11}} />
              <YAxis tick={{fontSize:10}} tickFormatter={v => "₹"+v/1000+"K"} />
              <Tooltip formatter={v => fmt(v)} />
              <Bar dataKey="sales" fill="#d97706" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card">
          <div className="card-title">👥 Credit Customers</div>
          {branchCustomers.filter(c => c.credit_balance > 0).map(c => (
            <div key={c.id} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid #f5f5f4",fontSize:13}}>
              <span>{c.name}</span>
              <strong style={{color:"#b91c1c"}}>{fmt(c.credit_balance)}</strong>
            </div>
          ))}
          {branchCustomers.filter(c => c.credit_balance > 0).length === 0 && (
            <div className="empty-state"><div className="icon">✅</div><p>No credit outstanding!</p></div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// MAIN APP
// ─────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState(null);
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [customers, setCustomers] = useState(INITIAL_CUSTOMERS);
  const [sales, setSales] = useState(INITIAL_SALES);
  const [purchases, setPurchases] = useState(INITIAL_PURCHASES);
  const [expenses, setExpenses] = useState(INITIAL_EXPENSES);
  const [units, setUnits] = useState(INITIAL_UNITS);
  const [payments, setPayments] = useState([]);
  const [saleCustomer, setSaleCustomer] = useState(null); // pre-fill customer when navigating from Customers

  const handleLogin = (u) => {
    setUser(u);
    setPage(u.role === "admin" ? "dashboard" : "branch-dash");
  };

  const handleLogout = () => { setUser(null); setPage(null); };

  if (!user) return <LoginPage onLogin={handleLogin} />;

  const PAGE_TITLES = {
    dashboard: "Admin Dashboard", products: "Products", purchases: "Purchases",
    sales: "Sales", customers: "Customers", expenses: "Expenses",
    reports: "Reports", balance: "Balance Sheet", stock: "Stock",
    "branch-dash": "Branch Dashboard", "sales-entry": "New Sale",
  };

  const branch = user.role === "branch" ? BRANCHES.find(b => b.id === user.branch_id) : null;

  const renderPage = () => {
    const props = { sales, setSales, products, setProducts, customers, setCustomers, purchases, setPurchases, expenses, setExpenses, user, units, setUnits, payments, setPayments, setPage, saleCustomer, setSaleCustomer };
    switch (page) {
      case "dashboard": return <AdminDashboard {...props} setPage={setPage} />;
      case "branch-dash": return <BranchDashboard {...props} />;
      case "products": return <ProductsPage {...props} />;
      case "purchases": return <PurchasesPage {...props} />;
      case "sales": return <SalesPage {...props} />;
      case "sales-entry": return <SalesPage {...props} isBranchEntry={true} />;
      case "customers": return <CustomersPage {...props} />;
      case "expenses": return <ExpensesPage {...props} />;
      case "stock": return <StockPage {...props} />;
      case "reports": return <ReportsPage {...props} />;
      case "balance": return <BalanceSheetPage {...props} />;
      default: return <div className="page-body"><div className="empty-state"><div className="icon">🔧</div><p>Page coming soon</p></div></div>;
    }
  };

  return (
    <div className="app-wrap">
      <Sidebar user={user} page={page} setPage={setPage} onLogout={handleLogout} />
      <div className="main-content">
        <div className="topbar">
          <h2>{PAGE_TITLES[page] || "Dashboard"}</h2>
          <div className="topbar-right">
            {branch && <span className="badge-branch">📍 {branch.name}</span>}
            <span className="date-chip">📅 05 Mar 2026</span>
            <button className="btn btn-outline btn-sm" onClick={handleLogout}
              style={{display:"flex",alignItems:"center",gap:5,color:"#b91c1c",borderColor:"#fecaca"}}>
              ↩ Logout
            </button>
          </div>
        </div>
        {renderPage()}
      </div>
    </div>
  );
}
