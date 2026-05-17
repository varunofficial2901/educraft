import { C } from './UI';
import { useAuth } from '../context/AuthContext';

const NAV = [
  { id: 'dashboard', icon: '⊞', label: 'Dashboard' },
  { id: 'courses',   icon: '◫', label: 'Courses' },
  { id: 'papers',    icon: '⊟', label: 'Test Papers' },
  { id: 'enrollments', icon: '◈', label: 'Enrollments' },
  { id: 'students',  icon: '◉', label: 'Students' },
  { id: 'messages',  icon: '◻', label: 'Messages' },
  { id: 'settings',  icon: '⊕', label: 'Settings' },
];

export default function Sidebar({ active, onNav, collapsed, unread }) {
  const { logout } = useAuth();

  return (
    <div style={{ width: collapsed ? 60 : 220, background: C.bgSec, borderRight: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', transition: 'width 0.25s ease', overflow: 'hidden', flexShrink: 0, height: '100vh', position: 'sticky', top: 0 }}>
      {/* Logo */}
      <div style={{ padding: collapsed ? '18px 12px' : '18px 18px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 10, minHeight: 64 }}>
        <div style={{ width: 34, height: 34, borderRadius: 9, background: C.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0, boxShadow: `0 0 16px ${C.accent}44` }}>✦</div>
        {!collapsed && (
          <div>
            <div style={{ color: C.text, fontWeight: 700, fontSize: 15, fontFamily: 'Georgia, serif', whiteSpace: 'nowrap', letterSpacing: '-0.01em' }}>EduAdmin</div>
            <div style={{ color: C.textDim, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Control Panel</div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '10px 8px', overflowY: 'auto' }}>
        {NAV.map(item => {
          const isActive = active === item.id;
          return (
            <button key={item.id} onClick={() => onNav(item.id)}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: collapsed ? '10px 0' : '10px 12px', justifyContent: collapsed ? 'center' : 'flex-start', borderRadius: 10, border: 'none', background: isActive ? C.accentGlow : 'transparent', color: isActive ? C.accent : C.textMuted, cursor: 'pointer', fontSize: 20, transition: 'all 0.15s', marginBottom: 2, textDecoration: 'none' }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = '#ffffff09'; }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}>
              <span style={{ flexShrink: 0, lineHeight: 1 }}>{item.icon}</span>
              {!collapsed && (
                <span style={{ fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap', flex: 1, textAlign: 'left' }}>{item.label}</span>
              )}
              {!collapsed && item.id === 'messages' && unread > 0 && (
                <span style={{ background: C.accent, color: '#fff', borderRadius: 10, fontSize: 10, padding: '1px 7px', fontWeight: 700, lineHeight: 1.8 }}>{unread}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div style={{ padding: '10px 8px', borderTop: `1px solid ${C.border}` }}>
        <button onClick={logout}
          style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: collapsed ? '10px 0' : '10px 12px', justifyContent: collapsed ? 'center' : 'flex-start', borderRadius: 10, border: 'none', background: 'transparent', color: C.danger, cursor: 'pointer', fontSize: 20, transition: 'all 0.15s' }}
          onMouseEnter={e => e.currentTarget.style.background = '#2a141822'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
          <span>⏻</span>
          {!collapsed && <span style={{ fontSize: 13, fontWeight: 500 }}>Logout</span>}
        </button>
      </div>
    </div>
  );
}
