import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Package, FolderTree, ShoppingBag, Users,
  Ticket, Image, Settings, LogOut, Satellite, Menu, X, Activity,
  BarChart3, Layout
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import CosmicBackground from '../components/world/CosmicBackground';
import './AdminLayout.css';

const navItems = [
  { to: '/admin', icon: LayoutDashboard, label: 'مركز القيادة', end: true },
  { to: '/admin/products', icon: Package, label: 'الكنوز' },
  { to: '/admin/categories', icon: FolderTree, label: 'الكواكب' },
  { to: '/admin/orders', icon: ShoppingBag, label: 'المهمات' },
  { to: '/admin/customers', icon: Users, label: 'المسافرون' },
  { to: '/admin/coupons', icon: Ticket, label: 'العروض' },
  { to: '/admin/banners', icon: Image, label: 'البث' },
  { to: '/admin/cms', icon: Layout, label: 'الصفحة الرئيسية' },
  { to: '/admin/reports', icon: BarChart3, label: 'التقارير' },
  { to: '/admin/settings', icon: Settings, label: 'الأنظمة' },
];

export default function AdminLayout() {
  const { logout, userName } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className={`mission-control ${collapsed ? 'collapsed' : ''}`}>
      <CosmicBackground variant="admin" />

      <aside className={`mc-sidebar holo-panel ${mobileOpen ? 'open' : ''}`}>
        <div className="mc-brand">
          <Satellite size={22} className="mc-brand__icon" />
          {!collapsed && (
            <div>
              <strong>أوربيتا</strong>
              <small>مركز القيادة</small>
            </div>
          )}
        </div>

        <nav className="mc-nav">
          {navItems.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => `mc-nav__item ${isActive ? 'active' : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              <Icon size={18} />
              {!collapsed && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="mc-sidebar__foot">
          <Link to="/" className="mc-nav__item">← العودة للمحطة</Link>
          <button className="mc-nav__item" onClick={() => { logout(); navigate('/login'); }}>
            <LogOut size={18} />
            {!collapsed && <span>خروج</span>}
          </button>
        </div>
      </aside>

      <div className="mc-main">
        <header className="mc-topbar holo-panel">
          <button className="mc-icon-btn" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <button className="mc-icon-btn hide-mobile" onClick={() => setCollapsed(!collapsed)}>
            <Menu size={20} />
          </button>
          <div className="mc-topbar__status">
            <Activity size={14} className="mc-pulse" />
            <span>المحطة تعمل · جميع الأنظمة جاهزة</span>
          </div>
          <div className="mc-topbar__user">{userName}</div>
        </header>

        <div className="mc-content">
          <Outlet />
        </div>
      </div>

      {mobileOpen && <div className="mc-overlay" onClick={() => setMobileOpen(false)} />}
    </div>
  );
}
