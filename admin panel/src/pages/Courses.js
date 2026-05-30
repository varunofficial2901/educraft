import { useState, useEffect } from 'react';
import { coursesAPI } from '../api';
import { C, Btn, Badge, Modal, Input, Textarea, Select, Confirm, Spinner, Empty, PageHeader, useToast, Toast } from '../components/UI';

const COLOR_OPTIONS = ['#4f6ef7','#22c77a','#7c5cbf','#f5a623','#38bdf8','#e8465a','#f97316','#a855f7'];

function CourseForm({ initial, onSave, onClose, loading }) {
  const [form, setForm] = useState(initial || { title: '', description: '', price: '', status: 'active', color: '#4f6ef7' });
  const [thumb, setThumb] = useState(null);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = () => {
    if (!form.title || !form.description || !form.price) return;
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (thumb) fd.append('thumbnail', thumb);
    onSave(fd);
  };

  return (
    <>
      <Input label="Course Title" value={form.title} onChange={e => set('title', e.target.value)} required />
      <Textarea label="Description" value={form.description} onChange={e => set('description', e.target.value)} rows={3} />
      <Input label="Price (₹)" type="number" value={form.price} onChange={e => set('price', e.target.value)} required />
      <Select label="Status" value={form.status} onChange={e => set('status', e.target.value)}
        options={[{ value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }]} />

      {/* Color picker */}
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', color: C.textMuted, fontSize: 11, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 600 }}>Accent Color</label>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {COLOR_OPTIONS.map(col => (
            <button key={col} onClick={() => set('color', col)}
              style={{ width: 28, height: 28, borderRadius: 7, background: col, border: form.color === col ? `2px solid #fff` : '2px solid transparent', cursor: 'pointer', boxShadow: form.color === col ? `0 0 0 2px ${col}` : 'none', transition: 'all 0.15s' }} />
          ))}
        </div>
      </div>

      {/* Thumbnail upload */}
      <div style={{ marginBottom: 20 }}>
        <label style={{ display: 'block', color: C.textMuted, fontSize: 11, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 600 }}>Course Thumbnail</label>
        <label style={{ display: 'block', border: `2px dashed ${thumb ? C.success : C.border}`, borderRadius: 10, padding: '18px', textAlign: 'center', cursor: 'pointer', transition: 'border-color 0.15s', background: '#0f0f18' }}>
          <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => setThumb(e.target.files[0])} />
          <div style={{ fontSize: 24, marginBottom: 6 }}>{thumb ? '✅' : '📷'}</div>
          <p style={{ margin: 0, color: thumb ? C.success : C.textMuted, fontSize: 12 }}>{thumb ? thumb.name : 'Click to upload image'}</p>
        </label>
      </div>

      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
        <Btn variant="ghost" onClick={onClose}>Cancel</Btn>
        <Btn onClick={submit} loading={loading}>{initial ? 'Save Changes' : 'Add Course'}</Btn>
      </div>
    </>
  );
}

function CourseCard({ course, onEdit, onDelete, onToggle, onView }) {
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, overflow: 'hidden', transition: 'border-color 0.2s, transform 0.2s' }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = C.borderLight; e.currentTarget.style.transform = 'translateY(-2px)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.transform = 'none'; }}>
      {/* Header */}
      <div style={{ height: 88, background: course.color + '18', display: 'flex', alignItems: 'center', padding: '0 18px', gap: 14, borderBottom: `1px solid ${C.border}`, position: 'relative' }}>
        {course.thumbnail
          ? <img src={course.thumbnail} alt="" style={{ width: 52, height: 52, borderRadius: 12, objectFit: 'cover', flexShrink: 0 }} />
          : <div style={{ width: 52, height: 52, borderRadius: 12, background: course.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 20, fontFamily: 'Georgia, serif', flexShrink: 0 }}>
              {course.title?.slice(0, 2).toUpperCase()}
            </div>
        }
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ color: C.text, fontWeight: 700, fontSize: 14, lineHeight: 1.3, marginBottom: 5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{course.title}</div>
          <Badge type={course.status}>{course.status}</Badge>
        </div>
      </div>
      {/* Body */}
      <div style={{ padding: '14px 18px' }}>
        <p style={{ margin: '0 0 12px', color: C.textMuted, fontSize: 12, lineHeight: 1.6, height: 36, overflow: 'hidden' }}>{course.description}</p>
        <div style={{ display: 'flex', gap: 18, marginBottom: 14 }}>
          <div style={{ fontSize: 12, color: C.textMuted }}>₹<span style={{ color: C.text, fontWeight: 700 }}>{course.price}</span></div>
          <div style={{ fontSize: 12, color: C.textMuted }}><span style={{ color: C.text, fontWeight: 700 }}>{course.paperCount ?? 0}</span> papers</div>
          <div style={{ fontSize: 12, color: C.textMuted }}><span style={{ color: C.text, fontWeight: 700 }}>{course.enrollmentCount ?? 0}</span> enrolled</div>
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <Btn size="sm" onClick={onView}>View →</Btn>
          <Btn size="sm" variant="ghost" onClick={onEdit}>Edit</Btn>
          <Btn size="sm" variant="ghost" onClick={onToggle}>{course.status === 'active' ? 'Pause' : 'Activate'}</Btn>
          <Btn size="sm" variant="danger" onClick={onDelete}>Del</Btn>
        </div>
      </div>
    </div>
  );
}

export default function Courses({ onSelectCourse }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirmDel, setConfirmDel] = useState(null);
  const { toasts, add: toast } = useToast();

  const load = () => {
    setLoading(true);
    coursesAPI.getAll()
      .then(res => setCourses(res.data.data || res.data || []))
      .catch(() => toast('Failed to load courses', 'danger'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openAdd = () => { setEditing(null); setModal(true); };
  const openEdit = (c) => { setEditing(c); setModal(true); };

  const handleSave = async (formData) => {
    setSaving(true);
    try {
      if (editing) {
        await coursesAPI.update(editing._id, formData);
        toast('Course updated successfully');
      } else {
        await coursesAPI.create(formData);
        toast('Course added successfully');
      }
      setModal(false);
      load();
    } catch (err) {
      toast(err.response?.data?.message || 'Error saving course', 'danger');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await coursesAPI.delete(confirmDel);
      toast('Course deleted', 'danger');
      setConfirmDel(null);
      load();
    } catch {
      toast('Failed to delete course', 'danger');
    }
  };

  const handleToggle = async (id) => {
    try {
      await coursesAPI.toggleStatus(id);
      toast('Status updated');
      load();
    } catch {
      toast('Failed to update status', 'danger');
    }
  };

  return (
    <div>
      <PageHeader
        title="Courses"
        subtitle={`${courses.length} courses on platform`}
        action={<Btn onClick={openAdd}>➕ Add Course</Btn>}
      />

      {loading ? <Spinner center /> : courses.length === 0 ? (
        <Empty icon="📚" text="No courses yet. Create your first course." />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: 16 }}>
          {courses.map(c => (
            <CourseCard key={c._id} course={c}
              onView={() => onSelectCourse(c)}
              onEdit={() => openEdit(c)}
              onDelete={() => setConfirmDel(c._id)}
              onToggle={() => handleToggle(c._id)}
            />
          ))}
        </div>
      )}

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Edit Course' : 'Add New Course'}>
        <CourseForm initial={editing ? { title: editing.title, description: editing.description, price: editing.price, status: editing.status, color: editing.color } : null}
          onSave={handleSave} onClose={() => setModal(false)} loading={saving} />
      </Modal>

      <Confirm open={!!confirmDel} onClose={() => setConfirmDel(null)} onConfirm={handleDelete}
        message="Delete this course? All associated test papers will also be deleted. This cannot be undone." />

      <Toast toasts={toasts} />
    </div>
  );
}
