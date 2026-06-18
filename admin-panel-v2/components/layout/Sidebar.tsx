'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, Package, FileText, Users, BookOpen,
  MessageSquare, BarChart3, Settings, LogOut, ChevronLeft, ChevronRight, Tag
} from 'lucide-react';
import { useState } from 'react';

const NAV = [
  { href: '/dashboard',   icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/bundles',     icon: Package,          label: 'Bundles' },
  { href: '/tests',       icon: FileText,         label: 'Tests' },
  { href: '/students',    icon: Users,            label: 'Students' },
  { href: '/enrollments', icon: BookOpen,         label: 'Enrollments' },
  { href: '/messages',    icon: MessageSquare,    label: 'Messages' },
  { href: '/analytics',   icon: BarChart3,        label: 'Analytics' },
  { href: '/coupons',     icon: Tag,              label: 'Coupons' },
  { href: '/settings',    icon: Settings,         label: 'Settings' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  const logout = () => {
    localStorage.removeItem('edu_admin_token');
    localStorage.removeItem('edu_admin');
    router.push('/');
  };

  return (
    <aside
      className="flex flex-col h-screen sticky top-0 transition-all duration-300 border-r"
      style={{
        width: collapsed ? '64px' : '220px',
        background: 'var(--bg-sidebar)',
        borderColor: 'var(--border)',
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b" style={{ borderColor: 'var(--border)', minHeight: '64px' }}>
        <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
          style={{ background: 'var(--accent)' }}>E</div>
        {!collapsed && (
          <div>
            <p className="text-sm font-bold" style={{ color: 'var(--text)' }}>EduCraft</p>
            <p className="text-[10px] uppercase tracking-widest" style={{ color: 'var(--text-dim)' }}>Admin Panel</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-2 overflow-y-auto">
        {NAV.map(({ href, icon: Icon, label }) => {
          const active = pathname.startsWith(href);
          return (
            <Link key={href} href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl mb-0.5 transition-all text-sm font-medium"
              style={{
                background: active ? 'var(--accent-light)' : 'transparent',
                color: active ? 'var(--accent)' : 'var(--text-muted)',
                justifyContent: collapsed ? 'center' : 'flex-start',
              }}
              title={collapsed ? label : undefined}
            >
              <Icon size={17} className="flex-shrink-0" />
              {!collapsed && <span>{label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-2 border-t" style={{ borderColor: 'var(--border)' }}>
        <button onClick={() => setCollapsed(!collapsed)}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm transition-all mb-0.5"
          style={{ color: 'var(--text-muted)', justifyContent: collapsed ? 'center' : 'flex-start' }}>
          {collapsed ? <ChevronRight size={17} /> : <><ChevronLeft size={17} /><span>Collapse</span></>}
        </button>
        <button onClick={logout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm transition-all"
          style={{ color: 'var(--danger)', justifyContent: collapsed ? 'center' : 'flex-start' }}>
          <LogOut size={17} className="flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
