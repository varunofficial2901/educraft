'use client';
import { ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import clsx from 'clsx';

// ─── Card ─────────────────────────────────────────────────────────────────────
export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={clsx('rounded-2xl border', className)}
      style={{ background: 'var(--bg-card)', borderColor: 'var(--border)', boxShadow: 'var(--shadow)' }}>
      {children}
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
export function StatCard({ label, value, delta, icon, color = 'var(--accent)' }: {
  label: string; value: string | number; delta?: string; icon: ReactNode; color?: string;
}) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: color + '18', color }}>
          {icon}
        </div>
        {delta && (
          <span className="text-xs font-semibold px-2 py-0.5 rounded-lg"
            style={{ background: '#d1fae5', color: '#059669' }}>
            {delta}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold mb-0.5" style={{ color: 'var(--text)' }}>{value}</p>
      <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>{label}</p>
    </Card>
  );
}

// ─── Button ──────────────────────────────────────────────────────────────────
type BtnVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
export function Btn({ children, onClick, variant = 'primary', size = 'md', loading, disabled, type = 'button', className }: {
  children: ReactNode; onClick?: () => void; variant?: BtnVariant;
  size?: 'sm' | 'md' | 'lg'; loading?: boolean; disabled?: boolean;
  type?: 'button' | 'submit'; className?: string;
}) {
  const styles: Record<BtnVariant, React.CSSProperties> = {
    primary:   { background: 'var(--accent)', color: '#fff', border: 'none' },
    secondary: { background: 'var(--bg)', color: 'var(--text)', border: '1px solid var(--border)' },
    danger:    { background: '#fef2f2', color: 'var(--danger)', border: '1px solid #fecaca' },
    ghost:     { background: 'transparent', color: 'var(--text-muted)', border: '1px solid var(--border)' },
  };
  const pad = size === 'sm' ? 'px-3 py-1.5 text-xs' : size === 'lg' ? 'px-6 py-3 text-base' : 'px-4 py-2 text-sm';

  return (
    <button type={type} onClick={onClick} disabled={loading || disabled}
      className={clsx('rounded-xl font-semibold flex items-center gap-1.5 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed', pad, className)}
      style={styles[variant]}>
      {loading && <Loader2 size={13} className="animate-spin" />}
      {children}
    </button>
  );
}

// ─── Badge ────────────────────────────────────────────────────────────────────
export function Badge({ children, type = 'default' }: {
  children: ReactNode;
  type?: 'success' | 'warning' | 'danger' | 'info' | 'default';
}) {
  const styles = {
    success: { background: '#d1fae5', color: '#059669' },
    warning: { background: '#fef3c7', color: '#d97706' },
    danger:  { background: '#fee2e2', color: '#dc2626' },
    info:    { background: '#dbeafe', color: '#2563eb' },
    default: { background: 'var(--bg)', color: 'var(--text-muted)', border: '1px solid var(--border)' },
  };
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-semibold"
      style={styles[type]}>{children}</span>
  );
}

// ─── Input ────────────────────────────────────────────────────────────────────
export function Input({ label, value, onChange, type = 'text', placeholder, required, className }: {
  label?: string; value: string; onChange: (v: string) => void; type?: string;
  placeholder?: string; required?: boolean; className?: string;
}) {
  return (
    <div className={clsx('flex flex-col gap-1.5', className)}>
      {label && <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
        {label}{required && <span style={{ color: 'var(--danger)' }}> *</span>}
      </label>}
      <input type={type} value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder} required={required}
        className="w-full px-3 py-2.5 rounded-xl text-sm border outline-none transition-all"
        style={{ background: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text)' }}
        onFocus={e => e.target.style.borderColor = 'var(--accent)'}
        onBlur={e => e.target.style.borderColor = 'var(--border)'}
      />
    </div>
  );
}

// ─── Textarea ────────────────────────────────────────────────────────────────
export function Textarea({ label, value, onChange, rows = 3, placeholder }: {
  label?: string; value: string; onChange: (v: string) => void; rows?: number; placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{label}</label>}
      <textarea value={value} onChange={e => onChange(e.target.value)} rows={rows}
        placeholder={placeholder}
        className="w-full px-3 py-2.5 rounded-xl text-sm border outline-none transition-all resize-none"
        style={{ background: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text)' }}
        onFocus={e => e.target.style.borderColor = 'var(--accent)'}
        onBlur={e => e.target.style.borderColor = 'var(--border)'}
      />
    </div>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────
export function Modal({ open, onClose, title, children, maxWidth = 480 }: {
  open: boolean; onClose: () => void; title: string; children: ReactNode; maxWidth?: number;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="w-full rounded-2xl border animate-slide-up overflow-y-auto"
        style={{ maxWidth, maxHeight: '90vh', background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
        <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: 'var(--border)' }}>
          <h2 className="font-bold text-base" style={{ color: 'var(--text)' }}>{title}</h2>
          <button onClick={onClose} className="text-xl leading-none transition-opacity hover:opacity-60"
            style={{ color: 'var(--text-muted)' }}>×</button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

// ─── Table ────────────────────────────────────────────────────────────────────
export function Table({ headers, children, empty }: {
  headers: string[]; children: ReactNode; empty?: ReactNode;
}) {
  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr style={{ background: 'var(--bg)' }}>
              {headers.map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider"
                  style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>{h}</th>
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

export function TR({ children, onClick }: { children: ReactNode; onClick?: () => void }) {
  return (
    <tr onClick={onClick} className="transition-colors"
      style={{ borderBottom: '1px solid var(--border)', cursor: onClick ? 'pointer' : 'default' }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--bg)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}>
      {children}
    </tr>
  );
}

export function TD({ children, muted, className }: { children: ReactNode; muted?: boolean; className?: string }) {
  return (
    <td className={clsx('px-4 py-3 text-sm', className)}
      style={{ color: muted ? 'var(--text-muted)' : 'var(--text)' }}>{children}</td>
  );
}

// ─── Spinner ─────────────────────────────────────────────────────────────────
export function Spinner({ center }: { center?: boolean }) {
  const el = <Loader2 size={24} className="animate-spin" style={{ color: 'var(--accent)' }} />;
  if (center) return <div className="flex justify-center py-12">{el}</div>;
  return el;
}

// ─── Empty ───────────────────────────────────────────────────────────────────
export function Empty({ icon = '📭', text = 'Nothing here yet.' }: { icon?: string; text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <span className="text-4xl">{icon}</span>
      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{text}</p>
    </div>
  );
}

// ─── Confirm ────────────────────────────────────────────────────────────────
export function Confirm({ open, onClose, onConfirm, message, loading }: {
  open: boolean; onClose: () => void; onConfirm: () => void;
  message?: string; loading?: boolean;
}) {
  return (
    <Modal open={open} onClose={onClose} title="Confirm Action" maxWidth={380}>
      <p className="text-sm mb-5" style={{ color: 'var(--text-muted)' }}>
        {message || 'Are you sure? This cannot be undone.'}
      </p>
      <div className="flex gap-2 justify-end">
        <Btn variant="ghost" onClick={onClose}>Cancel</Btn>
        <Btn variant="danger" onClick={onConfirm} loading={loading}>Delete</Btn>
      </div>
    </Modal>
  );
}

// ─── Toast hook ──────────────────────────────────────────────────────────────
import { useState } from 'react';
export function useToast() {
  const [toasts, setToasts] = useState<{ id: number; msg: string; type: string }[]>([]);
  const add = (msg: string, type = 'success') => {
    const id = Date.now();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3000);
  };
  return { toasts, add };
}

export function Toast({ toasts }: { toasts: { id: number; msg: string; type: string }[] }) {
  if (!toasts.length) return null;
  return (
    <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2">
      {toasts.map(t => (
        <div key={t.id} className="px-4 py-3 rounded-xl text-sm font-medium animate-slide-up"
          style={{
            background: t.type === 'success' ? '#d1fae5' : t.type === 'danger' ? '#fee2e2' : 'var(--bg-card)',
            color: t.type === 'success' ? '#059669' : t.type === 'danger' ? '#dc2626' : 'var(--text)',
            border: '1px solid ' + (t.type === 'success' ? '#a7f3d0' : t.type === 'danger' ? '#fecaca' : 'var(--border)'),
            boxShadow: 'var(--shadow-md)',
          }}>
          {t.type === 'success' ? '✓ ' : t.type === 'danger' ? '✕ ' : 'ℹ '}{t.msg}
        </div>
      ))}
    </div>
  );
}
