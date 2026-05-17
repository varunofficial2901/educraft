import { useState, useEffect } from 'react';
import { coursesAPI, papersAPI } from '../api';
import { C, Btn, Badge, Modal, Input, Textarea, Confirm, Spinner, Empty, Card, Table, TR, TD, useToast, Toast } from '../components/UI';

function PaperForm({ initial, courseId, onSave, onClose, loading }) {
  const [form, setForm] = useState(initial || { title: '', description: '', visible: true });
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = () => {
    if (!form.title) return;
    const fd = new FormData();
    fd.append('title', form.title);
    fd.append('description', form.description);
    fd.append('visible', form.visible);
    if (!initial) fd.append('course', courseId);
    if (file) fd.append('paper', file);
    onSave(fd);
  };

  return (
    <>
      <Input label="Paper Title" value={form.title} onChange={e => set('title', e.target.value)} required />
      <Textarea label="Description" value={form.description} onChange={e => set('description', e.target.value)} rows={2} />
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '10px 12px', background: '#0f0f18', border: `1px solid ${C.border}`, borderRadius: 8 }}>
          <input type="checkbox" checked={form.visible} onChange={e => set('visible', e.target.checked)} style={{ accentColor: C.accent, width: 16, height: 16 }} />
          <span style={{ color: C.textMuted, fontSize: 13 }}>Visible to enrolled students</span>
        </label>
      </div>
      <div style={{ marginBottom: 20 }}>
        <label style={{ display: 'block', color: C.textMuted, fontSize: 11, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 600 }}>Upload PDF / Document</label>
        <label style={{ display: 'block', border: `2px dashed ${file ? C.success : C.border}`, borderRadius: 10, padding: '22px', textAlign: 'center', cursor: 'pointer', background: '#0f0f18', transition: 'border-color 0.15s' }}>
          <input type="file" accept=".pdf,.doc,.docx" style={{ display: 'none' }} onChange={e => setFile(e.target.files[0])} />
          <div style={{ fontSize: 28, marginBottom: 8 }}>{file ? '✅' : '📤'}</div>
          <p style={{ margin: 0, color: file ? C.success : C.textMuted, fontSize: 13, fontWeight: file ? 600 : 400 }}>{file ? file.name : 'Click to upload PDF or Word document'}</p>
          {!file && <p style={{ margin: '4px 0 0', color: C.textDim, fontSize: 11 }}>Max 50MB</p>}
        </label>
      </div>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
        <Btn variant="ghost" onClick={onClose}>Cancel</Btn>
        <Btn onClick={submit} loading={loading}>{initial ? 'Save Changes' : 'Add Paper'}</Btn>
      </div>
    </>
  );
}

export default function CourseDetail({ course: initialCourse, onBack }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paperModal, setPaperModal] = useState(false);
  const [editingPaper, setEditingPaper] = useState(null);
  const [confirmDel, setConfirmDel] = useState(null);
  const [saving, setSaving] = useState(false);
  const { toasts, add: toast } = useToast();

  const load = () => {
    setLoading(true);
    coursesAPI.getOne(initialCourse._id)
      .then(res => setData(res.data.data))
      .catch(() => toast('Failed to load course details', 'danger'))
      .finally(() => setLoading(false));
  };

  useEffect(load, [initialCourse._id]);

  const openAdd = () => { setEditingPaper(null); setPaperModal(true); };
  const openEdit = (p) => { setEditingPaper(p); setPaperModal(true); };

  const handleSavePaper = async (fd) => {
    setSaving(true);
    try {
      if (editingPaper) {
        await papersAPI.update(editingPaper._id, fd);
        toast('Paper updated');
      } else {
        await papersAPI.create(fd);
        toast('Paper added successfully');
      }
      setPaperModal(false);
      load();
    } catch (err) {
      toast(err.response?.data?.message || 'Error saving paper', 'danger');
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePaper = async () => {
    try {
      await papersAPI.delete(confirmDel);
      toast('Paper deleted', 'danger');
      setConfirmDel(null);
      load();
    } catch {
      toast('Failed to delete paper', 'danger');
    }
  };

  const handleToggleVisibility = async (id) => {
    try {
      await papersAPI.toggleVisibility(id);
      toast('Visibility updated');
      load();
    } catch {
      toast('Failed to update visibility', 'danger');
    }
  };

  const course = data?.course || initialCourse;
  const papers = data?.papers || [];
  const enrollments = data?.enrollments || [];

  return (
    <div>
      <button onClick={onBack} style={{ background: 'none', border: 'none', color: C.accent, cursor: 'pointer', fontSize: 13, padding: '0 0 20px', display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'inherit', fontWeight: 600 }}>
        ← Back to Courses
      </button>

      {/* Course header card */}
      <Card style={{ padding: 24, marginBottom: 22 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap' }}>
          <div style={{ width: 58, height: 58, borderRadius: 14, background: course.color || C.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 22, fontFamily: 'Georgia, serif', flexShrink: 0 }}>
            {course.title?.slice(0, 2).toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h2 style={{ margin: '0 0 5px', color: C.text, fontFamily: 'Georgia, serif', fontSize: 20, fontWeight: 700 }}>{course.title}</h2>
            <p style={{ margin: 0, color: C.textMuted, fontSize: 13 }}>{course.description}</p>
            <div style={{ marginTop: 8 }}><Badge type={course.status}>{course.status}</Badge></div>
          </div>
          <div style={{ display: 'flex', gap: 28, flexShrink: 0 }}>
            {[['₹' + course.price, 'Price'], [papers.length, 'Papers'], [enrollments.length, 'Enrolled']].map(([v, l]) => (
              <div key={l} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: C.text, fontFamily: 'Georgia, serif' }}>{v}</div>
                <div style={{ fontSize: 11, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Papers section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 style={{ margin: 0, color: C.text, fontFamily: 'Georgia, serif', fontSize: 17 }}>Test Papers ({papers.length})</h3>
        <Btn size="sm" onClick={openAdd}>➕ Add Paper</Btn>
      </div>

      {loading ? <Spinner center /> : papers.length === 0 ? (
        <Card style={{ padding: 0 }}><Empty icon="📄" text="No test papers yet. Add your first paper." /></Card>
      ) : (
        <Table headers={['#', 'Title', 'Description', 'Uploaded', 'File', 'Visibility', 'Actions']}>
          {papers.map((p, i) => (
            <TR key={p._id}>
              <TD muted>{i + 1}</TD>
              <TD><span style={{ fontWeight: 600, color: C.text }}>{p.title}</span></TD>
              <TD muted>{p.description || '—'}</TD>
              <TD muted>{new Date(p.createdAt).toLocaleDateString()}</TD>
              <TD>
                {p.fileUrl
                  ? <a href={p.fileUrl} target="_blank" rel="noreferrer" style={{ color: C.accent, fontSize: 12, textDecoration: 'none' }}>📎 {p.fileName || 'Download'}</a>
                  : <span style={{ color: C.textDim, fontSize: 12 }}>No file</span>}
              </TD>
              <TD><Badge type={p.visible ? 'visible' : 'hidden'}>{p.visible ? 'visible' : 'hidden'}</Badge></TD>
              <TD>
                <div style={{ display: 'flex', gap: 6 }}>
                  <Btn size="sm" variant="ghost" onClick={() => openEdit(p)}>Edit</Btn>
                  <Btn size="sm" variant="ghost" onClick={() => handleToggleVisibility(p._id)}>{p.visible ? 'Hide' : 'Show'}</Btn>
                  <Btn size="sm" variant="danger" onClick={() => setConfirmDel(p._id)}>Del</Btn>
                </div>
              </TD>
            </TR>
          ))}
        </Table>
      )}

      {/* Recent enrollments for this course */}
      {enrollments.length > 0 && (
        <div style={{ marginTop: 22 }}>
          <h3 style={{ margin: '0 0 14px', color: C.text, fontFamily: 'Georgia, serif', fontSize: 17 }}>Enrolled Students ({enrollments.length})</h3>
          <Table headers={['Student', 'Email', 'Phone', 'Payment', 'Date']}>
            {enrollments.slice(0, 8).map(e => (
              <TR key={e._id}>
                <TD><span style={{ fontWeight: 600 }}>{e.studentName}</span></TD>
                <TD muted>{e.email}</TD>
                <TD muted>{e.phone}</TD>
                <TD><Badge type={e.paymentStatus}>{e.paymentStatus}</Badge></TD>
                <TD muted>{new Date(e.createdAt).toLocaleDateString()}</TD>
              </TR>
            ))}
          </Table>
        </div>
      )}

      <Modal open={paperModal} onClose={() => setPaperModal(false)} title={editingPaper ? 'Edit Test Paper' : 'Add Test Paper'}>
        <PaperForm
          initial={editingPaper ? { title: editingPaper.title, description: editingPaper.description, visible: editingPaper.visible } : null}
          courseId={course._id}
          onSave={handleSavePaper}
          onClose={() => setPaperModal(false)}
          loading={saving}
        />
      </Modal>

      <Confirm open={!!confirmDel} onClose={() => setConfirmDel(null)} onConfirm={handleDeletePaper}
        message="Delete this test paper permanently?" />

      <Toast toasts={toasts} />
    </div>
  );
}
