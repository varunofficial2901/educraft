import { useState } from 'react';
import { authAPI } from '../api';
import { useAuth } from '../context/AuthContext';
import { C, Input, Btn, Card, PageHeader, useToast, Toast } from '../components/UI';

export function Settings() {
  const { admin, updateAdmin } = useAuth();
  const [profile, setProfile] = useState({ name: admin?.name || '', email: admin?.email || '' });
  const [pwd, setPwd] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPwd, setSavingPwd] = useState(false);
  const { toasts, add: toast } = useToast();

  const saveProfile = async () => {
    setSavingProfile(true);
    try {
      const res = await authAPI.updateProfile(profile);
      updateAdmin(res.data.admin);
      toast('Profile updated successfully');
    } catch (err) {
      toast(err.response?.data?.message || 'Failed to update profile', 'danger');
    } finally {
      setSavingProfile(false);
    }
  };

  const savePassword = async () => {
    if (pwd.newPassword !== pwd.confirm) {
      toast('New passwords do not match', 'danger');
      return;
    }
    if (pwd.newPassword.length < 6) {
      toast('Password must be at least 6 characters', 'danger');
      return;
    }
    setSavingPwd(true);
    try {
      await authAPI.changePassword({ currentPassword: pwd.currentPassword, newPassword: pwd.newPassword });
      toast('Password changed successfully');
      setPwd({ currentPassword: '', newPassword: '', confirm: '' });
    } catch (err) {
      toast(err.response?.data?.message || 'Failed to change password', 'danger');
    } finally {
      setSavingPwd(false);
    }
  };

  return (
    <div>
      <PageHeader title="Settings" subtitle="Manage your admin account" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, maxWidth: 900 }}>
        <Card style={{ padding: 26 }}>
          <h3 style={{ margin: '0 0 20px', color: C.text, fontFamily: 'Georgia, serif', fontSize: 16, fontWeight: 700 }}>Profile Information</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 22 }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: C.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, color: '#fff', fontWeight: 800 }}>
              {admin?.name?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div>
              <div style={{ color: C.text, fontWeight: 700, fontSize: 15 }}>{admin?.name}</div>
              <div style={{ color: C.textMuted, fontSize: 13 }}>{admin?.role}</div>
            </div>
          </div>
          <Input label="Full Name" value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} />
          <Input label="Email Address" type="email" value={profile.email} onChange={e => setProfile(p => ({ ...p, email: e.target.value }))} />
          <Btn onClick={saveProfile} loading={savingProfile}>Save Profile</Btn>
        </Card>

        <Card style={{ padding: 26 }}>
          <h3 style={{ margin: '0 0 20px', color: C.text, fontFamily: 'Georgia, serif', fontSize: 16, fontWeight: 700 }}>Change Password</h3>
          <Input label="Current Password" type="password" value={pwd.currentPassword} onChange={e => setPwd(p => ({ ...p, currentPassword: e.target.value }))} />
          <Input label="New Password" type="password" value={pwd.newPassword} onChange={e => setPwd(p => ({ ...p, newPassword: e.target.value }))} />
          <Input label="Confirm New Password" type="password" value={pwd.confirm} onChange={e => setPwd(p => ({ ...p, confirm: e.target.value }))} />
          <Btn onClick={savePassword} loading={savingPwd}>Update Password</Btn>
        </Card>

        <Card style={{ padding: 26, gridColumn: 'span 2' }}>
          <h3 style={{ margin: '0 0 16px', color: C.text, fontFamily: 'Georgia, serif', fontSize: 16, fontWeight: 700 }}>Platform Info</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {[['Backend', 'Node.js + Express'], ['Database', 'MongoDB'], ['Auth', 'JWT Bearer']].map(([k, v]) => (
              <div key={k} style={{ background: '#0f0f18', borderRadius: 10, padding: '14px 16px', border: `1px solid ${C.border}` }}>
                <div style={{ fontSize: 11, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6, fontWeight: 600 }}>{k}</div>
                <div style={{ fontSize: 14, color: C.text, fontWeight: 700 }}>{v}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
      <Toast toasts={toasts} />
    </div>
  );
}

export function LoginPage() {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: 'admin@eduplatform.com', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async () => {
    if (!form.email || !form.password) { setError('Please enter email and password'); return; }
    setLoading(true); setError('');
    try {
      await login(form.email, form.password);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => { if (e.key === 'Enter') submit(); };

  return (
    <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui, sans-serif', padding: 20 }}>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: 44, width: '100%', maxWidth: 400, boxShadow: '0 25px 60px rgba(0,0,0,0.5)' }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: C.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, margin: '0 auto 18px', boxShadow: `0 0 30px ${C.accent}66` }}>✦</div>
          <h1 style={{ margin: '0 0 8px', color: C.text, fontFamily: 'Georgia, serif', fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em' }}>Admin Panel</h1>
          <p style={{ margin: 0, color: C.textMuted, fontSize: 14 }}>EduPlatform Control Center</p>
        </div>

        <Input label="Email Address" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="admin@eduplatform.com" />
        <div onKeyDown={handleKey}>
          <Input label="Password" type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="Enter your password" />
        </div>

        {error && (
          <div style={{ background: '#2a1418', border: '1px solid #3a1c22', borderRadius: 8, padding: '10px 14px', marginBottom: 16, color: C.danger, fontSize: 13 }}>
            {error}
          </div>
        )}

        <button onClick={submit} disabled={loading}
          style={{ width: '100%', background: C.accent, border: 'none', borderRadius: 10, padding: '13px', color: '#fff', fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', marginTop: 4, opacity: loading ? 0.7 : 1, transition: 'all 0.2s', letterSpacing: '0.01em' }}>
          {loading ? '⏳ Signing in...' : 'Sign In →'}
        </button>

        <div style={{ marginTop: 22, padding: '14px 16px', background: '#0f0f18', borderRadius: 10, border: `1px solid ${C.border}` }}>
          <p style={{ margin: '0 0 4px', fontSize: 11, color: C.textDim, textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 600 }}>Demo Credentials</p>
          <p style={{ margin: 0, fontSize: 12, color: C.textMuted }}>admin@eduplatform.com</p>
          <p style={{ margin: 0, fontSize: 12, color: C.textMuted }}>admin123</p>
        </div>
      </div>
    </div>
  );
}
