'use client';
import { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, Input, Btn, useToast, Toast } from '@/components/ui';
import { settingsApi, getAdminFromStorage, saveAdminSession } from '@/lib';
import { useMutation } from '@/lib';

export default function SettingsPage() {
  const admin = getAdminFromStorage();

  const [profile, setProfile] = useState({ name: admin?.name || '', email: admin?.email || '' });
  const [pwd, setPwd]         = useState({ current: '', new: '', confirm: '' });
  const { toasts, add: toast } = useToast();

  const { mutate: updateProfile, loading: savingProfile } = useMutation(settingsApi.updateProfile);
  const { mutate: updatePassword, loading: savingPwd }    = useMutation(settingsApi.updatePassword);

  const saveProfile = async () => {
    const res = await updateProfile({ name: profile.name, email: profile.email });
    if (res) {
      // Update localStorage with new name/email
      const stored = getAdminFromStorage();
      if (stored) {
        localStorage.setItem('edu_admin', JSON.stringify({ ...stored, name: profile.name, email: profile.email }));
      }
      toast('Profile updated');
    } else {
      toast('Update failed', 'danger');
    }
  };

  const savePwd = async () => {
    if (pwd.new !== pwd.confirm) return toast('Passwords do not match', 'danger');
    if (pwd.new.length < 8) return toast('Password must be 8+ characters', 'danger');
    const res = await updatePassword({ current_password: pwd.current, new_password: pwd.new });
    if (res) {
      toast('Password changed');
      setPwd({ current: '', new: '', confirm: '' });
    } else {
      toast('Password update failed', 'danger');
    }
  };

  return (
    <AdminLayout title="Settings">
      <div className="animate-fade-in max-w-2xl space-y-5">

        {/* Profile */}
        <Card className="p-6">
          <h3 className="font-bold text-sm mb-4" style={{ color: 'var(--text)' }}>Profile Information</h3>
          <div className="flex items-center gap-4 mb-5">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-bold"
              style={{ background: 'var(--accent)' }}>{profile.name?.[0] || 'A'}</div>
            <div>
              <p className="font-bold" style={{ color: 'var(--text)' }}>{profile.name || 'Admin'}</p>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Administrator</p>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <Input label="Full Name" value={profile.name} onChange={v => setProfile(p => ({ ...p, name: v }))} />
            <Input label="Email" type="email" value={profile.email} onChange={v => setProfile(p => ({ ...p, email: v }))} />
            <div className="flex justify-end">
              <Btn onClick={saveProfile} loading={savingProfile}>Save Profile</Btn>
            </div>
          </div>
        </Card>

        {/* Password */}
        <Card className="p-6">
          <h3 className="font-bold text-sm mb-4" style={{ color: 'var(--text)' }}>Change Password</h3>
          <div className="flex flex-col gap-4">
            <Input label="Current Password" type="password" value={pwd.current} onChange={v => setPwd(p => ({ ...p, current: v }))} />
            <Input label="New Password" type="password" value={pwd.new} onChange={v => setPwd(p => ({ ...p, new: v }))} />
            <Input label="Confirm New Password" type="password" value={pwd.confirm} onChange={v => setPwd(p => ({ ...p, confirm: v }))} />
            <div className="flex justify-end">
              <Btn onClick={savePwd} loading={savingPwd}>Update Password</Btn>
            </div>
          </div>
        </Card>

        {/* Platform Info */}
        <Card className="p-6">
          <h3 className="font-bold text-sm mb-4" style={{ color: 'var(--text)' }}>Platform Info</h3>
          <div className="grid grid-cols-3 gap-3">
            {[['Backend', 'FastAPI + MongoDB'], ['Frontend', 'Next.js'], ['Admin', 'Next.js + Tailwind']].map(([k, v]) => (
              <div key={k} className="rounded-xl p-3 border" style={{ background: 'var(--bg)', borderColor: 'var(--border)' }}>
                <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--text-dim)' }}>{k}</p>
                <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{v}</p>
              </div>
            ))}
          </div>
        </Card>

      </div>
      <Toast toasts={toasts} />
    </AdminLayout>
  );
}













// 'use client';
// import { useState } from 'react';
// import AdminLayout from '@/components/layout/AdminLayout';
// import { Card, Input, Btn, useToast, Toast } from '@/components/ui';

// export default function SettingsPage() {
//   const [profile, setProfile] = useState({ name: 'Admin User', email: 'admin@educraft.com' });
//   const [pwd, setPwd] = useState({ current: '', new: '', confirm: '' });
//   const [savingProfile, setSavingProfile] = useState(false);
//   const [savingPwd, setSavingPwd] = useState(false);
//   const { toasts, add: toast } = useToast();

//   const saveProfile = () => {
//     setSavingProfile(true);
//     setTimeout(() => { setSavingProfile(false); toast('Profile updated'); }, 600);
//   };

//   const savePwd = () => {
//     if (pwd.new !== pwd.confirm) return toast('Passwords do not match', 'danger');
//     if (pwd.new.length < 8) return toast('Password must be 8+ characters', 'danger');
//     setSavingPwd(true);
//     setTimeout(() => { setSavingPwd(false); setPwd({ current: '', new: '', confirm: '' }); toast('Password changed'); }, 600);
//   };

//   return (
//     <AdminLayout title="Settings">
//       <div className="animate-fade-in max-w-2xl space-y-5">

//         {/* Profile */}
//         <Card className="p-6">
//           <h3 className="font-bold text-sm mb-4" style={{ color: 'var(--text)' }}>Profile Information</h3>
//           <div className="flex items-center gap-4 mb-5">
//             <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-bold"
//               style={{ background: 'var(--accent)' }}>{profile.name[0]}</div>
//             <div>
//               <p className="font-bold" style={{ color: 'var(--text)' }}>{profile.name}</p>
//               <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Administrator</p>
//             </div>
//           </div>
//           <div className="flex flex-col gap-4">
//             <Input label="Full Name" value={profile.name} onChange={v => setProfile(p => ({ ...p, name: v }))} />
//             <Input label="Email" type="email" value={profile.email} onChange={v => setProfile(p => ({ ...p, email: v }))} />
//             <div className="flex justify-end">
//               <Btn onClick={saveProfile} loading={savingProfile}>Save Profile</Btn>
//             </div>
//           </div>
//         </Card>

//         {/* Password */}
//         <Card className="p-6">
//           <h3 className="font-bold text-sm mb-4" style={{ color: 'var(--text)' }}>Change Password</h3>
//           <div className="flex flex-col gap-4">
//             <Input label="Current Password" type="password" value={pwd.current} onChange={v => setPwd(p => ({ ...p, current: v }))} />
//             <Input label="New Password" type="password" value={pwd.new} onChange={v => setPwd(p => ({ ...p, new: v }))} />
//             <Input label="Confirm New Password" type="password" value={pwd.confirm} onChange={v => setPwd(p => ({ ...p, confirm: v }))} />
//             <div className="flex justify-end">
//               <Btn onClick={savePwd} loading={savingPwd}>Update Password</Btn>
//             </div>
//           </div>
//         </Card>

//         {/* Platform Info */}
//         <Card className="p-6">
//           <h3 className="font-bold text-sm mb-4" style={{ color: 'var(--text)' }}>Platform Info</h3>
//           <div className="grid grid-cols-3 gap-3">
//             {[['Backend', 'FastAPI + MongoDB'], ['Frontend', 'Next.js 14'], ['Admin', 'Next.js + Tailwind']].map(([k, v]) => (
//               <div key={k} className="rounded-xl p-3 border" style={{ background: 'var(--bg)', borderColor: 'var(--border)' }}>
//                 <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--text-dim)' }}>{k}</p>
//                 <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{v}</p>
//               </div>
//             ))}
//           </div>
//         </Card>

//       </div>
//       <Toast toasts={toasts} />
//     </AdminLayout>
//   );
// }
