import { useState, useEffect } from 'react';
import { C, Btn, Input, Textarea, Modal, Confirm, Spinner, Empty, Table, TR, TD, PageHeader, Card, Badge, useToast, Toast } from '../components/UI';
import api from '../api';

// ─── Bundle Form ──────────────────────────────────────────────────────────────
function BundleForm({ initial, onSave, onClose, loading }) {
  const empty = { title: '', description: '', price: '', is_free: false, is_published: true, points: ['', '', ''] };
  const [form, setForm] = useState(initial || empty);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const setPoint = (i, val) => {
    const pts = [...form.points];
    pts[i] = val;
    setForm(f => ({ ...f, points: pts }));
  };

  const addPoint = () => setForm(f => ({ ...f, points: [...f.points, ''] }));
  const removePoint = (i) => setForm(f => ({ ...f, points: f.points.filter((_, idx) => idx !== i) }));

  const handleSave = () => {
    if (!form.title || (!form.is_free && !form.price)) return;
    const cleanPoints = form.points.filter(p => p.trim());
    onSave({ ...form, price: parseFloat(form.price) || 0, points: cleanPoints });
  };

  return (
    <>
      <Input label="Bundle Title *" value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. Bundle 1 — Starter Pack" required />
      <Textarea label="Description" value={form.description} onChange={e => set('description', e.target.value)} rows={2} placeholder="Brief description of this bundle..." />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 4 }}>
        <Input
          label="Price (₹)"
          type="number"
          value={form.price}
          onChange={e => set('price', e.target.value)}
          placeholder="0"
        />
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', color: C.textMuted, fontSize: 11, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 600 }}>Type</label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '9px 12px', background: '#0f0f18', border: `1px solid ${C.border}`, borderRadius: 8 }}>
            <input type="checkbox" checked={form.is_free} onChange={e => set('is_free', e.target.checked)} style={{ accentColor: C.accent, width: 16, height: 16 }} />
            <span style={{ color: C.textMuted, fontSize: 13 }}>Free Bundle</span>
          </label>
        </div>
      </div>

      {/* Feature Points */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <label style={{ color: C.textMuted, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 600 }}>Feature Points</label>
          <Btn size="sm" variant="ghost" onClick={addPoint}>+ Add Point</Btn>
        </div>
        {form.points.map((pt, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <input
              type="text"
              value={pt}
              onChange={e => setPoint(i, e.target.value)}
              placeholder={`e.g. 20 tests per subject`}
              style={{ flex: 1, background: '#0f0f18', border: `1px solid ${C.border}`, borderRadius: 8, padding: '8px 12px', color: C.text, fontSize: 13, outline: 'none', fontFamily: 'inherit' }}
            />
            <button onClick={() => removePoint(i)} style={{ background: 'none', border: 'none', color: C.danger, cursor: 'pointer', fontSize: 18, padding: '0 4px' }}>×</button>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '9px 12px', background: '#0f0f18', border: `1px solid ${C.border}`, borderRadius: 8 }}>
          <input type="checkbox" checked={form.is_published} onChange={e => set('is_published', e.target.checked)} style={{ accentColor: C.accent, width: 16, height: 16 }} />
          <span style={{ color: C.textMuted, fontSize: 13 }}>Published (visible on website)</span>
        </label>
      </div>

      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
        <Btn variant="ghost" onClick={onClose}>Cancel</Btn>
        <Btn onClick={handleSave} loading={loading}>{initial ? 'Update Bundle' : 'Create Bundle'}</Btn>
      </div>
    </>
  );
}

// ─── Main Bundles Page ────────────────────────────────────────────────────────
export default function Bundles() {
  const [bundles, setBundles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirmDel, setConfirmDel] = useState(null);
  const { toasts, add: toast } = useToast();

  const load = () => {
    setLoading(true);
    api.get('/v1/admin/bundles')
      .then(res => setBundles(res.data.data || []))
      .catch(() => toast('Failed to load bundles', 'danger'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openAdd = () => { setEditing(null); setModal(true); };
  const openEdit = (b) => { setEditing(b); setModal(true); };

  const handleSave = async (formData) => {
    setSaving(true);
    try {
      if (editing) {
        await api.put(`/v1/admin/bundles/${editing._id}`, formData);
        toast('Bundle updated');
      } else {
        await api.post('/v1/admin/bundles', formData);
        toast('Bundle created');
      }
      setModal(false);
      load();
    } catch (err) {
      toast(err.response?.data?.detail || 'Error saving bundle', 'danger');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/v1/admin/bundles/${confirmDel}`);
      toast('Bundle deleted', 'danger');
      setConfirmDel(null);
      load();
    } catch {
      toast('Failed to delete', 'danger');
    }
  };

  const togglePublish = async (bundle) => {
    try {
      await api.put(`/v1/admin/bundles/${bundle._id}`, { is_published: !bundle.is_published });
      toast(bundle.is_published ? 'Bundle unpublished' : 'Bundle published');
      load();
    } catch {
      toast('Failed to update', 'danger');
    }
  };

  return (
    <div>
      <PageHeader
        title="Test Bundles"
        subtitle={`${bundles.length} bundles`}
        action={<Btn onClick={openAdd}>➕ Add Bundle</Btn>}
      />

      <div style={{ background: '#1a1a2e', border: `1px solid #252545`, borderRadius: 10, padding: '12px 16px', marginBottom: 18, display: 'flex', gap: 8, alignItems: 'flex-start' }}>
        <span style={{ fontSize: 16 }}>ℹ️</span>
        <div style={{ color: C.textMuted, fontSize: 13 }}>
          <strong style={{ color: C.text }}>Bundles</strong> are shown on the Test Series page. Free bundle shows free assessment tests. Paid bundles are sold to students.
        </div>
      </div>

      {loading ? <Spinner center /> : bundles.length === 0 ? (
        <Card style={{ padding: 0 }}><Empty icon="📦" text="No bundles yet. Create your first bundle." /></Card>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {bundles.map(b => (
            <Card key={b._id} style={{ padding: 0, overflow: 'hidden' }}>
              {/* Header */}
              <div style={{ padding: '16px 20px', background: b.is_free ? '#0d2418' : C.accentGlow, borderBottom: `1px solid ${C.border}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: b.is_free ? '#22c77a' : C.accent }}>
                    {b.is_free ? '🎁 FREE' : '💰 PAID'}
                  </span>
                  <Badge type={b.is_published ? 'visible' : 'hidden'}>{b.is_published ? 'Published' : 'Hidden'}</Badge>
                </div>
                <h3 style={{ margin: 0, color: C.text, fontFamily: 'Georgia, serif', fontSize: 16, fontWeight: 700 }}>{b.title}</h3>
              </div>

              {/* Body */}
              <div style={{ padding: '14px 20px' }}>
                <p style={{ margin: '0 0 10px', color: C.textMuted, fontSize: 12, lineHeight: 1.6 }}>{b.description || '—'}</p>

                {!b.is_free && (
                  <div style={{ fontSize: 20, fontWeight: 800, color: C.text, fontFamily: 'Georgia, serif', marginBottom: 10 }}>
                    ₹{(b.price || 0).toLocaleString('en-IN')}
                  </div>
                )}

                {b.points?.length > 0 && (
                  <ul style={{ margin: '0 0 14px', padding: 0, listStyle: 'none' }}>
                    {b.points.map((pt, i) => (
                      <li key={i} style={{ fontSize: 12, color: C.textMuted, padding: '3px 0', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ color: '#22c77a' }}>✓</span> {pt}
                      </li>
                    ))}
                  </ul>
                )}

                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  <Btn size="sm" onClick={() => openEdit(b)}>Edit</Btn>
                  <Btn size="sm" variant="ghost" onClick={() => togglePublish(b)}>
                    {b.is_published ? 'Unpublish' : 'Publish'}
                  </Btn>
                  <Btn size="sm" variant="danger" onClick={() => setConfirmDel(b._id)}>Delete</Btn>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Edit Bundle' : 'Add New Bundle'}>
        <BundleForm
          initial={editing ? { title: editing.title, description: editing.description, price: editing.price, is_free: editing.is_free, is_published: editing.is_published, points: editing.points?.length ? editing.points : ['', '', ''] } : null}
          onSave={handleSave}
          onClose={() => setModal(false)}
          loading={saving}
        />
      </Modal>

      <Confirm open={!!confirmDel} onClose={() => setConfirmDel(null)} onConfirm={handleDelete}
        message="Delete this bundle? Students won't be able to purchase it anymore." />

      <Toast toasts={toasts} />
    </div>
  );
}
