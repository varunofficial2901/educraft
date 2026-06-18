'use client';
import { Bell, Sun, Moon } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { useEffect, useState } from 'react';

export default function Header({ title }: { title: string }) {
  const { theme, toggle } = useTheme();
  const [admin, setAdmin] = useState<any>(null);

  useEffect(() => {
    const a = localStorage.getItem('edu_admin');
    if (a) setAdmin(JSON.parse(a));
  }, []);

  const initials = admin?.name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() || 'AD';

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b"
      style={{ background: 'var(--bg-card)', borderColor: 'var(--border)', minHeight: '64px' }}>
      <h1 className="text-lg font-bold" style={{ color: 'var(--text)' }}>{title}</h1>

      <div className="flex items-center gap-2">
        {/* Theme toggle */}
        <button onClick={toggle}
          className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
          style={{ background: 'var(--bg)', color: 'var(--text-muted)' }}>
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* Notifications */}
        <button className="w-9 h-9 rounded-xl flex items-center justify-center relative transition-all"
          style={{ background: 'var(--bg)', color: 'var(--text-muted)' }}>
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
            style={{ background: 'var(--danger)' }} />
        </button>

        {/* Avatar */}
        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold"
          style={{ background: 'var(--accent)' }}>
          {initials}
        </div>
      </div>
    </header>
  );
}
