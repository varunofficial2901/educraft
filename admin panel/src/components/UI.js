import { useState } from 'react';

export const C = {
  bg: '#0c0c0e', bgSec: '#131318', card: '#17171f', cardHover: '#1e1e28',
  border: '#2a2a3a', borderLight: '#32324a',
  accent: '#4f6ef7', accentDeep: '#3b52d4', accentGlow: '#4f6ef720',
  violet: '#7c5cbf',
  text: '#e8e8f0', textMuted: '#8888a8', textDim: '#55556a',
  success: '#22c77a', warning: '#f5a623', danger: '#e8465a', info: '#38bdf8',
};

export function Toast({ toasts }) {
  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 8 }}>
      {toasts.map(t => (
        <div key={t.id} style={{
          background: t.type === 'success' ? '#16281e' : t.type === 'danger' ? '#2a1418' : '#1a1a2e',
          border: `1px solid ${t.type === 'success' ? C.success : t.type === 'danger' ? C.danger : C.accent}`,
          color: t.type === 'success' ? C.success : t.type === 'danger' ? C.danger : C.text,
          padding: '10px 18px', borderRadius: 10, fontSize: 13, fontFamily: 'inherit',
          animation: 'slideIn 0.3s ease', minWidth: 220, boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
        }}>
          {t.type === 'success' ? '✓ ' : t.type === 'danger' ? '✕ ' : 'ℹ '}{t.msg}
        </div>
      ))}
    </div>
  );
}

export function useToast() {
  const [toasts, setToasts] = useState([]);
  const add = (msg, type = 'success') => {
    const id = Date.now();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3200);
  };
  return { toasts, add };
}

export function Modal({ open, onClose, title, children, maxWidth = 520 }) {
  if (!open) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 28, width: '100%', maxWidth, maxHeight: '90vh', overflowY: 'auto', animation: 'fadeIn 0.2s ease' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
          <h3 style={{ margin: 0, color: C.text, fontSize: 18, fontFamily: 'Georgia, serif' }}>{title}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: C.textMuted, fontSize: 22, cursor: 'pointer', lineHeight: 1, padding: '0 4px', borderRadius: 6, transition: 'color 0.15s' }}
            onMouseEnter={e => e.target.style.color = C.text} onMouseLeave={e => e.target.style.color = C.textMuted}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Confirm({ open, onClose, onConfirm, message = 'Are you sure? This cannot be undone.', confirmLabel = 'Delete', loading }) {
  return (
    <Modal open={open} onClose={onClose} title="Confirm Action" maxWidth={400}>
      <p style={{ color: C.textMuted, fontSize: 14, margin: '0 0 22px', lineHeight: 1.6 }}>{message}</p>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
        <Btn variant="ghost" onClick={onClose}>Cancel</Btn>
        <Btn variant="danger" onClick={onConfirm} loading={loading}>{confirmLabel}</Btn>
      </div>
    </Modal>
  );
}

export function Input({ label, value, onChange, type = 'text', placeholder, required }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: 16 }}>
      {label && <label style={{ display: 'block', color: C.textMuted, fontSize: 11, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 600 }}>
        {label}{required && <span style={{ color: C.danger, marginLeft: 3 }}>*</span>}
      </label>}
      <input type={type} value={value} onChange={onChange} placeholder={placeholder}
        style={{ width: '100%', background: '#0f0f18', border: `1px solid ${focused ? C.accent : C.border}`, borderRadius: 8, padding: '9px 13px', color: C.text, fontSize: 14, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', transition: 'border-color 0.15s' }}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} />
    </div>
  );
}

export function Textarea({ label, value, onChange, rows = 3, placeholder }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: 16 }}>
      {label && <label style={{ display: 'block', color: C.textMuted, fontSize: 11, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 600 }}>{label}</label>}
      <textarea value={value} onChange={onChange} rows={rows} placeholder={placeholder}
        style={{ width: '100%', background: '#0f0f18', border: `1px solid ${focused ? C.accent : C.border}`, borderRadius: 8, padding: '9px 13px', color: C.text, fontSize: 14, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', transition: 'border-color 0.15s', resize: 'vertical' }}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} />
    </div>
  );
}

export function Select({ label, value, onChange, options }) {
  return (
    <div style={{ marginBottom: 16 }}>
      {label && <label style={{ display: 'block', color: C.textMuted, fontSize: 11, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 600 }}>{label}</label>}
      <select value={value} onChange={onChange}
        style={{ width: '100%', background: '#0f0f18', border: `1px solid ${C.border}`, borderRadius: 8, padding: '9px 13px', color: C.text, fontSize: 14, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }}>
        {options.map(o => <option key={o.value} value={o.value} style={{ background: '#17171f' }}>{o.label}</option>)}
      </select>
    </div>
  );
}

export function Btn({ children, onClick, variant = 'primary', size = 'md', loading, disabled, style: sx, type = 'button' }) {
  const pad = size === 'sm' ? '5px 12px' : size === 'lg' ? '12px 24px' : '9px 18px';
  const fs = size === 'sm' ? 12 : size === 'lg' ? 15 : 14;
  const variants = {
    primary: { background: C.accent, color: '#fff', border: 'none' },
    danger: { background: '#2a1418', color: C.danger, border: `1px solid #3a1c22` },
    ghost: { background: 'transparent', color: C.textMuted, border: `1px solid ${C.border}` },
    success: { background: '#0d2418', color: C.success, border: `1px solid #1a3d28` },
  };
  return (
    <button type={type} onClick={onClick} disabled={loading || disabled}
      style={{ cursor: loading || disabled ? 'not-allowed' : 'pointer', borderRadius: 8, fontFamily: 'inherit', fontWeight: 600, transition: 'all 0.15s', display: 'inline-flex', alignItems: 'center', gap: 6, padding: pad, fontSize: fs, opacity: loading || disabled ? 0.6 : 1, ...variants[variant], ...sx }}>
      {loading ? '⏳' : children}
    </button>
  );
}

export function Badge({ children, type }) {
  const styles = {
    paid: { bg: '#0d2418', color: C.success, border: '#1a3d28' },
    active: { bg: '#0d2418', color: C.success, border: '#1a3d28' },
    pending: { bg: '#241c08', color: C.warning, border: '#3d2e10' },
    failed: { bg: '#240d10', color: C.danger, border: '#3d1418' },
    refunded: { bg: '#1a1a2e', color: C.info, border: '#252545' },
    inactive: { bg: '#1e1e2a', color: C.textMuted, border: '#2a2a3a' },
    unread: { bg: '#1a1a2e', color: C.accent, border: '#252545' },
    read: { bg: '#1e1e2a', color: C.textMuted, border: '#2a2a3a' },
    visible: { bg: '#0d2418', color: C.success, border: '#1a3d28' },
    hidden: { bg: '#1e1e2a', color: C.textMuted, border: '#2a2a3a' },
  };
  const s = styles[type] || styles.inactive;
  return <span style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}`, borderRadius: 6, padding: '3px 9px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{children}</span>;
}

export function Spinner({ size = 20, center }) {
  const el = (
    <div style={{ width: size, height: size, border: `2px solid ${C.border}`, borderTopColor: C.accent, borderRadius: '50%', animation: 'spin 0.7s linear infinite', flexShrink: 0 }} />
  );
  if (center) return <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>{el}</div>;
  return el;
}

export function Empty({ icon = '📭', text = 'Nothing here yet.' }) {
  return (
    <div style={{ padding: '50px 20px', textAlign: 'center' }}>
      <div style={{ fontSize: 36, marginBottom: 12 }}>{icon}</div>
      <p style={{ margin: 0, color: C.textMuted, fontSize: 14 }}>{text}</p>
    </div>
  );
}

export function SearchBar({ value, onChange, placeholder }) {
  return (
    <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder || 'Search...'}
      style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 9, padding: '9px 14px', color: C.text, fontSize: 13, outline: 'none', fontFamily: 'inherit', flex: '1 1 220px', transition: 'border-color 0.15s' }}
      onFocus={e => e.target.style.borderColor = C.accent} onBlur={e => e.target.style.borderColor = C.border} />
  );
}

export function PageHeader({ title, subtitle, action }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 26 }}>
      <div>
        <h2 style={{ margin: '0 0 4px', color: C.text, fontFamily: 'Georgia, serif', fontSize: 22, fontWeight: 700 }}>{title}</h2>
        {subtitle && <p style={{ margin: 0, color: C.textMuted, fontSize: 13 }}>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function Card({ children, style: sx }) {
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, ...sx }}>
      {children}
    </div>
  );
}

export function Table({ headers, children, empty }) {
  return (
    <Card>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#0f0f18' }}>
              {headers.map(h => (
                <th key={h} style={{ padding: '12px 16px', color: C.textMuted, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: 'left', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>{children}</tbody>
        </table>
        {empty}
      </div>
    </Card>
  );
}

export function TR({ children, onClick }) {
  return (
    <tr style={{ borderTop: `1px solid ${C.border}`, transition: 'background 0.1s', cursor: onClick ? 'pointer' : 'default' }}
      onMouseEnter={e => e.currentTarget.style.background = C.cardHover}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
      onClick={onClick}>
      {children}
    </tr>
  );
}

export function TD({ children, muted, style: sx }) {
  return <td style={{ padding: '12px 16px', fontSize: 13, color: muted ? C.textMuted : C.text, ...sx }}>{children}</td>;
}

export function Avatar({ name, size = 32, color }) {
  const initials = name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '?';
  const bg = color || C.accent;
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: bg + '33', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.38, color: bg, fontWeight: 800, flexShrink: 0 }}>
      {initials}
    </div>
  );
}
