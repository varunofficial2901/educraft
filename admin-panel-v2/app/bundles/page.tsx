'use client';
// @ts-ignore: react module resolution may be disabled in local TS configuration
import { useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, Btn, Badge, Modal, Input, Textarea, Confirm, Empty, Spinner, useToast, Toast } from '@/components/ui';
// @ts-ignore: lucide-react module resolution may be disabled in local TS configuration
import { Package, Plus, Edit2, Trash2, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { bundlesApi, useApi, useMutation } from '@/lib';
import type { Bundle } from '@/lib';
import { useRouter } from 'next/navigation';

// ─── Bundle Form ──────────────────────────────────────────────────────────────
function BundleForm({ initial, onSave, onClose, loading }: any) {
  const empty = { title: '', description: '', price: '0', is_free: false, is_published: true, points: ['', '', ''] };
  const [form, setForm] = useState<any>(initial
    ? { ...initial, price: String(initial.price), points: initial.points?.length ? initial.points : ['', '', ''] }
    : empty
  );

  const set = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }));
  const setPoint = (i: number, v: string) => {
    const pts = [...form.points]; pts[i] = v; set('points', pts);
  };


  return (
    <div className="flex flex-col gap-4">
      <Input label="Bundle Title" value={form.title} onChange={v => set('title', v)} placeholder="e.g. Foundation Bundle" required />
      <Textarea label="Description" value={form.description} onChange={v => set('description', v)} placeholder="Brief description..." />
      <div className="grid grid-cols-2 gap-3">
        <Input label="Price (₹)" type="number" value={form.price} onChange={v => set('price', v)} placeholder="0" />
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Type</label>
          <label className="flex items-center gap-2 cursor-pointer px-3 py-2.5 rounded-xl border text-sm"
            style={{ background: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
            <input type="checkbox" checked={form.is_free} onChange={e => set('is_free', e.target.checked)} className="accent-[var(--accent)]" />
            Free Bundle
          </label>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Feature Points</label>
          <Btn size="sm" variant="ghost" onClick={() => set('points', [...form.points, ''])}>+ Add</Btn>
        </div>
        <div className="flex flex-col gap-2">
          {form.points.map((pt: string, i: number) => (
            <div key={i} className="flex gap-2">
              <input value={pt} onChange={e => setPoint(i, e.target.value)} placeholder={`Feature ${i + 1}...`}
                className="flex-1 px-3 py-2 rounded-xl text-sm border outline-none"
                style={{ background: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text)' }} />
              <button onClick={() => set('points', form.points.filter((_: any, idx: number) => idx !== i))}
                className="text-lg px-2" style={{ color: 'var(--danger)' }}>×</button>
            </div>
          ))}
        </div>
      </div>

      <label className="flex items-center gap-2 cursor-pointer px-3 py-2.5 rounded-xl border text-sm"
        style={{ background: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
        <input type="checkbox" checked={form.is_published} onChange={e => set('is_published', e.target.checked)} className="accent-[var(--accent)]" />
        Published (visible on website)
      </label>

      <div className="flex gap-2 justify-end pt-2">
        <Btn variant="ghost" onClick={onClose}>Cancel</Btn>
        <Btn onClick={() => onSave({ ...form, price: parseFloat(form.price) || 0, points: form.points.filter(Boolean) })} loading={loading}>
          {initial ? 'Update Bundle' : 'Create Bundle'}
        </Btn>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function BundlesPage() {
  const { data: bundles, loading, refetch } = useApi(() => bundlesApi.list());
  const { mutate: createBundle, loading: creating } = useMutation(bundlesApi.create);
  const { mutate: updateBundle, loading: updating } = useMutation(
    (id: string, payload: Partial<Bundle>) => bundlesApi.update(id, payload)
  );
  const { mutate: deleteBundle } = useMutation(bundlesApi.delete);
  const { mutate: toggleBundle } = useMutation(bundlesApi.toggle);

  const [modal, setModal]         = useState(false);
  const [editing, setEditing]     = useState<Bundle | null>(null);
  const [confirmDel, setConfirmDel] = useState<string | null>(null);
  const { toasts, add: toast }    = useToast();
  const router = useRouter();

  const handleSave = async (form: any) => {
    if (editing) {
      const res = await updateBundle(editing._id, form);
      if (res) { toast('Bundle updated'); setModal(false); refetch(); }
      else toast('Update failed', 'danger');
    } else {
      const res = await createBundle(form);
      if (res) { toast('Bundle created'); setModal(false); refetch(); }
      else toast('Create failed', 'danger');
    }
  };

  const handleDelete = async () => {
    if (!confirmDel) return;
    await deleteBundle(confirmDel);
    toast('Bundle deleted', 'danger');
    setConfirmDel(null);
    refetch();
  };

  const handleToggle = async (id: string) => {
    await toggleBundle(id);
    toast('Visibility updated');
    refetch();
  };

  return (
    <AdminLayout title="Bundles">
      <div className="animate-fade-in space-y-5">
        <div className="flex items-center justify-between">
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            {bundles ? `${bundles.length} bundles total` : ''}
          </p>
          <Btn onClick={() => { setEditing(null); setModal(true); }}><Plus size={15} /> Add Bundle</Btn>
        </div>

        {loading ? <Spinner center /> : !bundles?.length ? <Empty icon="📦" text="No bundles yet." /> : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {bundles.map((b: Bundle) => (
              <Card key={b._id} className="overflow-hidden">
                <div className="p-4 border-b" style={{
                  borderColor: 'var(--border)',
                  background: b.is_free ? 'rgba(16,185,129,0.06)' : 'rgba(67,97,238,0.06)',
                }}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                      style={{ background: b.is_free ? '#d1fae5' : 'var(--accent-light)', color: b.is_free ? '#059669' : 'var(--accent)' }}>
                      <Package size={15} />
                    </div>
                    <Badge type={b.is_published ? 'success' : 'default'}>{b.is_published ? 'Live' : 'Hidden'}</Badge>
                  </div>
                  <h3 className="font-bold text-sm" style={{ color: 'var(--text)' }}>{b.title}</h3>
                </div>
                <div className="p-4">
                  <p className="text-xs mb-3 line-clamp-2" style={{ color: 'var(--text-muted)' }}>{b.description}</p>
                  {!b.is_free && (
                    <p className="font-bold text-lg mb-3" style={{ color: 'var(--text)' }}>
                      ₹{b.price.toLocaleString('en-IN')}
                    </p>
                  )}
                  <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>
                    {b.test_count} tests · {b.enroll_count} enrolled
                  </p>
                  {b.points.filter(Boolean).length > 0 && (
                    <ul className="flex flex-col gap-1.5 mb-4">
                      {b.points.filter(Boolean).map((pt: string, i: number) => (
                        <li key={i} className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
                          <CheckCircle2 size={11} style={{ color: 'var(--success)', flexShrink: 0 }} />
                          {pt}
                        </li>
                      ))}
                    </ul>
                  )}
                  <div className="flex gap-1.5">
                    <Btn size="sm" variant="secondary" onClick={() => router.push(`/bundles/${b._id}`)}>Manage</Btn>
                    <Btn size="sm" variant="secondary" onClick={() => { setEditing(b); setModal(true); }}><Edit2 size={12} /></Btn>
                    <Btn size="sm" variant="secondary" onClick={() => handleToggle(b._id)}>
                      {b.is_published ? <EyeOff size={12} /> : <Eye size={12} />}
                    </Btn>
                    <Btn size="sm" variant="danger" onClick={() => setConfirmDel(b._id)}><Trash2 size={12} /></Btn>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Edit Bundle' : 'New Bundle'}>
        <BundleForm initial={editing} onSave={handleSave} onClose={() => setModal(false)} loading={creating || updating} />
      </Modal>

      <Confirm open={!!confirmDel} onClose={() => setConfirmDel(null)} onConfirm={handleDelete}
        message="Delete this bundle? All its tests will also be deleted." />

      <Toast toasts={toasts} />
    </AdminLayout>
  );
}




// 'use client';
// import { useState } from 'react';
// import AdminLayout from '@/components/layout/AdminLayout';
// import { Card, Btn, Badge, Modal, Input, Textarea, Confirm, Empty, useToast, Toast } from '@/components/ui';
// import { Package, Plus, Edit2, Trash2, Eye, EyeOff, CheckCircle2 } from 'lucide-react';

// const MOCK_BUNDLES = [
//   { _id: '1', title: 'Free Assessment', description: 'Start your learning journey with our free diagnostic test.', price: 0, is_free: true, is_published: true, points: ['3 subjects covered', 'Instant results', 'No signup required'] },
//   { _id: '2', title: 'Foundation Bundle', description: 'Build strong fundamentals across all subjects.', price: 1999, is_free: false, is_published: true, points: ['20 tests per subject', '4 subjects', 'Detailed analysis', '6 months access'] },
//   { _id: '3', title: 'Advance Bundle', description: 'Step up your preparation with advanced practice sets.', price: 3499, is_free: false, is_published: true, points: ['30 tests per subject', '4 subjects', 'Performance tracking', '1 year access'] },
//   { _id: '4', title: 'Mastery Bundle', description: 'Complete preparation package for top performers.', price: 5999, is_free: false, is_published: false, points: ['40 tests per subject', '4 subjects', 'Priority support', 'Lifetime access'] },
// ];

// function BundleForm({ initial, onSave, onClose, loading }: any) {
//   const empty = { title: '', description: '', price: '', is_free: false, is_published: true, points: ['', '', ''] };
//   const [form, setForm] = useState<any>(initial || empty);

//   const set = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }));
//   const setPoint = (i: number, v: string) => {
//     const pts = [...form.points]; pts[i] = v;
//     set('points', pts);
//   };

//   return (
//     <div className="flex flex-col gap-4">
//       <Input label="Bundle Title" value={form.title} onChange={v => set('title', v)} placeholder="e.g. Foundation Bundle" required />
//       <Textarea label="Description" value={form.description} onChange={v => set('description', v)} placeholder="Brief description..." />
//       <div className="grid grid-cols-2 gap-3">
//         <Input label="Price (₹)" type="number" value={form.price} onChange={v => set('price', v)} placeholder="0" />
//         <div className="flex flex-col gap-1.5">
//           <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Type</label>
//           <label className="flex items-center gap-2 cursor-pointer px-3 py-2.5 rounded-xl border text-sm"
//             style={{ background: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
//             <input type="checkbox" checked={form.is_free} onChange={e => set('is_free', e.target.checked)}
//               className="accent-[var(--accent)]" />
//             Free Bundle
//           </label>
//         </div>
//       </div>

//       <div>
//         <div className="flex items-center justify-between mb-2">
//           <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Feature Points</label>
//           <Btn size="sm" variant="ghost" onClick={() => set('points', [...form.points, ''])}>+ Add</Btn>
//         </div>
//         <div className="flex flex-col gap-2">
//           {form.points.map((pt: string, i: number) => (
//             <div key={i} className="flex gap-2">
//               <input value={pt} onChange={e => setPoint(i, e.target.value)}
//                 placeholder={`Feature ${i + 1}...`}
//                 className="flex-1 px-3 py-2 rounded-xl text-sm border outline-none"
//                 style={{ background: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text)' }}
//               />
//               <button onClick={() => set('points', form.points.filter((_: any, idx: number) => idx !== i))}
//                 className="text-lg px-2" style={{ color: 'var(--danger)' }}>×</button>
//             </div>
//           ))}
//         </div>
//       </div>

//       <label className="flex items-center gap-2 cursor-pointer px-3 py-2.5 rounded-xl border text-sm"
//         style={{ background: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
//         <input type="checkbox" checked={form.is_published} onChange={e => set('is_published', e.target.checked)}
//           className="accent-[var(--accent)]" />
//         Published (visible on website)
//       </label>

//       <div className="flex gap-2 justify-end pt-2">
//         <Btn variant="ghost" onClick={onClose}>Cancel</Btn>
//         <Btn onClick={() => onSave(form)} loading={loading}>{initial ? 'Update Bundle' : 'Create Bundle'}</Btn>
//       </div>
//     </div>
//   );
// }

// export default function BundlesPage() {
//   const [bundles, setBundles] = useState(MOCK_BUNDLES);
//   const [modal, setModal] = useState(false);
//   const [editing, setEditing] = useState<any>(null);
//   const [confirmDel, setConfirmDel] = useState<string | null>(null);
//   const { toasts, add: toast } = useToast();

//   const openAdd = () => { setEditing(null); setModal(true); };
//   const openEdit = (b: any) => { setEditing(b); setModal(true); };

//   const handleSave = (form: any) => {
//     if (editing) {
//       setBundles(bs => bs.map(b => b._id === editing._id ? { ...b, ...form } : b));
//       toast('Bundle updated');
//     } else {
//       setBundles(bs => [...bs, { ...form, _id: Date.now().toString(), price: parseFloat(form.price) || 0 }]);
//       toast('Bundle created');
//     }
//     setModal(false);
//   };

//   const handleDelete = () => {
//     setBundles(bs => bs.filter(b => b._id !== confirmDel));
//     toast('Bundle deleted', 'danger');
//     setConfirmDel(null);
//   };

//   const togglePublish = (id: string) => {
//     setBundles(bs => bs.map(b => b._id === id ? { ...b, is_published: !b.is_published } : b));
//     toast('Visibility updated');
//   };

//   return (
//     <AdminLayout title="Bundles">
//       <div className="animate-fade-in space-y-5">
//         <div className="flex items-center justify-between">
//           <div>
//             <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{bundles.length} bundles total</p>
//           </div>
//           <Btn onClick={openAdd}><Plus size={15} /> Add Bundle</Btn>
//         </div>

//         {bundles.length === 0 ? <Empty icon="📦" text="No bundles yet." /> : (
//           <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
//             {bundles.map(b => (
//               <Card key={b._id} className="overflow-hidden">
//                 <div className="p-4 border-b" style={{
//                   borderColor: 'var(--border)',
//                   background: b.is_free ? 'rgba(16,185,129,0.06)' : 'rgba(67,97,238,0.06)',
//                 }}>
//                   <div className="flex items-center justify-between mb-2">
//                     <div className="w-8 h-8 rounded-xl flex items-center justify-center"
//                       style={{ background: b.is_free ? '#d1fae5' : 'var(--accent-light)', color: b.is_free ? '#059669' : 'var(--accent)' }}>
//                       <Package size={15} />
//                     </div>
//                     <Badge type={b.is_published ? 'success' : 'default'}>{b.is_published ? 'Live' : 'Hidden'}</Badge>
//                   </div>
//                   <h3 className="font-bold text-sm" style={{ color: 'var(--text)' }}>{b.title}</h3>
//                 </div>
//                 <div className="p-4">
//                   <p className="text-xs mb-3 line-clamp-2" style={{ color: 'var(--text-muted)' }}>{b.description}</p>
//                   {!b.is_free && (
//                     <p className="font-bold text-lg mb-3" style={{ color: 'var(--text)' }}>
//                       ₹{b.price.toLocaleString('en-IN')}
//                     </p>
//                   )}
//                   {b.points.filter(Boolean).length > 0 && (
//                     <ul className="flex flex-col gap-1.5 mb-4">
//                       {b.points.filter(Boolean).map((pt, i) => (
//                         <li key={i} className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
//                           <CheckCircle2 size={11} style={{ color: 'var(--success)', flexShrink: 0 }} />
//                           {pt}
//                         </li>
//                       ))}
//                     </ul>
//                   )}
//                   <div className="flex gap-1.5">
//                     <Btn size="sm" variant="secondary" onClick={() => openEdit(b)}><Edit2 size={12} /></Btn>
//                     <Btn size="sm" variant="secondary" onClick={() => togglePublish(b._id)}>
//                       {b.is_published ? <EyeOff size={12} /> : <Eye size={12} />}
//                     </Btn>
//                     <Btn size="sm" variant="danger" onClick={() => setConfirmDel(b._id)}><Trash2 size={12} /></Btn>
//                   </div>
//                 </div>
//               </Card>
//             ))}
//           </div>
//         )}
//       </div>

//       <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Edit Bundle' : 'New Bundle'}>
//         <BundleForm initial={editing} onSave={handleSave} onClose={() => setModal(false)} loading={false} />
//       </Modal>

//       <Confirm open={!!confirmDel} onClose={() => setConfirmDel(null)} onConfirm={handleDelete}
//         message="Delete this bundle? Students won't be able to purchase it." />

//       <Toast toasts={toasts} />
//     </AdminLayout>
//   );
// }
