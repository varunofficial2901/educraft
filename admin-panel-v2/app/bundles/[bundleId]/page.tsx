'use client';
import { useState, use } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, Btn, Badge, Modal, Input, Confirm, Empty, Spinner, useToast, Toast } from '@/components/ui';
import { Plus, Trash2, Upload, X, Edit2, ChevronLeft, ChevronRight, BookOpen, ArrowLeft } from 'lucide-react';
import { useApi, useMutation } from '@/lib';
import { api, getErrorMsg } from '@/lib';
import Link from 'next/link';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Subject {
  _id: string;
  name: string;
  icon: string;
  color: string;
  bundle_id: string;
  order: number;
  test_count: number;
}

interface Test {
  _id: string;
  title: string;
  subject_id: string;
  bundle_id: string;
  duration: number;
  is_free: boolean;
  question_count: number;
  created_at: string;
}

// ─── Icon options ─────────────────────────────────────────────────────────────
const ICON_OPTIONS = ['BookOpen', 'Brain', 'Calculator', 'PenTool', 'Microscope', 'Globe', 'Music', 'Code'];
const COLOR_OPTIONS = ['#6366F1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

// ─── CSV Upload Component ─────────────────────────────────────────────────────
function CSVUploadModal({ subjectId, onSuccess, onClose }: {
  subjectId: string;
  onSuccess: () => void;
  onClose: () => void;
}) {
  const [title, setTitle]       = useState('');
  const [duration, setDuration] = useState('40');
  const [isFree, setIsFree]     = useState(false);
  const [file, setFile]         = useState<File | null>(null);
  const [preview, setPreview]   = useState<any[]>([]);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const { toasts, add: toast }  = useToast();

  const downloadTemplate = () => {
    const csv = `question,optionA,optionB,optionC,optionD,correct,explanation\n"What is 2+2?","3","4","5","6","B","2+2 equals 4"\n"Capital of Australia?","Sydney","Melbourne","Canberra","Perth","C","Canberra is the capital"`;
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'questions_template.csv';
    a.click();
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const lines = text.trim().split('\n');
      const map: Record<string, string> = { A: '0', B: '1', C: '2', D: '3', a: '0', b: '1', c: '2', d: '3' };
      const questions: any[] = [];
      const errors: string[] = [];
      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(',').map(c => c.trim().replace(/^"|"$/g, ''));
        if (cols.length < 6) { errors.push(`Row ${i + 1}: not enough columns`); continue; }
        const [text, a, b, c, d, correct, explanation] = cols;
        if (!text || !a || !b || !c || !d) { errors.push(`Row ${i + 1}: missing fields`); continue; }
        if (!map[correct]) { errors.push(`Row ${i + 1}: correct must be A/B/C/D`); continue; }
        questions.push({ text, options: [a, b, c, d], correct: map[correct], explanation: explanation || '' });
      }
      if (errors.length) { setError(errors.slice(0, 3).join(' | ')); setPreview([]); }
      else { setError(''); setPreview(questions); }
    };
    reader.readAsText(f);
  };

  const handleUpload = async () => {
    if (!file || !title || preview.length === 0) return;
    setLoading(true);
    try {
      const form = new FormData();
      form.append('title', title);
      form.append('duration', duration);
      form.append('is_free', String(isFree));
      form.append('file', file);
      await api.post(`/api/admin/subjects/${subjectId}/tests/upload-csv`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast(`Test uploaded with ${preview.length} questions`);
      onSuccess();
      onClose();
    } catch (err) {
      toast(getErrorMsg(err), 'danger');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Input label="Test Title *" value={title} onChange={setTitle} placeholder="e.g. Mathematics Test 1" required />
      <div className="grid grid-cols-2 gap-3">
        <Input label="Duration (min)" type="number" value={duration} onChange={setDuration} />
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Type</label>
          <label className="flex items-center gap-2 cursor-pointer px-3 py-2.5 rounded-xl border text-sm"
            style={{ background: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
            <input type="checkbox" checked={isFree} onChange={e => setIsFree(e.target.checked)} className="accent-[var(--accent)]" />
            Free Test
          </label>
        </div>
      </div>

      <div className="rounded-xl p-3 text-xs" style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
        Format: <code className="mx-1 px-1 rounded" style={{ background: 'var(--border)' }}>question,optionA,optionB,optionC,optionD,correct(A-D),explanation</code>
        <button onClick={downloadTemplate} className="ml-2 underline" style={{ color: 'var(--accent)' }}>Download template</button>
      </div>

      <label className="block border-2 border-dashed rounded-xl p-6 text-center cursor-pointer"
        style={{ borderColor: preview.length ? 'var(--success)' : 'var(--border)' }}>
        <input type="file" accept=".csv" className="hidden" onChange={handleFile} />
        <Upload size={24} className="mx-auto mb-2" style={{ color: preview.length ? 'var(--success)' : 'var(--text-dim)' }} />
        <p className="text-sm" style={{ color: preview.length ? 'var(--success)' : 'var(--text-muted)' }}>
          {preview.length ? `${preview.length} questions ready` : 'Click to upload CSV'}
        </p>
      </label>

      {error && <p className="text-xs" style={{ color: 'var(--danger)' }}>⚠ {error}</p>}

      {preview.length > 0 && (
        <div>
          <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>Preview (first 2):</p>
          {preview.slice(0, 2).map((q, i) => (
            <div key={i} className="rounded-lg px-3 py-2 mb-1.5 text-xs" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
              <strong>Q{i + 1}:</strong> {q.text.slice(0, 60)}... — <span style={{ color: 'var(--success)' }}>✓ {['A','B','C','D'][parseInt(q.correct)]}</span>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-2 justify-end pt-2">
        <Btn variant="ghost" onClick={onClose}>Cancel</Btn>
        <Btn onClick={handleUpload} loading={loading} disabled={!file || !title || preview.length === 0}>
          Upload {preview.length > 0 ? `${preview.length} Questions` : ''}
        </Btn>
      </div>
      <Toast toasts={toasts} />
    </div>
  );
}

// ─── Writing Test Modal ───────────────────────────────────────────────────────
function WritingTestModal({ subjectId, onSuccess, onClose }: {
  subjectId: string;
  onSuccess: () => void;
  onClose: () => void;
}) {
  const [title, setTitle]       = useState('');
  const [duration, setDuration] = useState('30');
  const [isFree, setIsFree]     = useState(false);
  const [prompt, setPrompt]     = useState('');
  const [loading, setLoading]   = useState(false);
  const { toasts, add: toast }  = useToast();

  const handleUpload = async () => {
    if (!title.trim() || !prompt.trim()) return;
    setLoading(true);
    try {
      await api.post(`/api/admin/subjects/${subjectId}/tests/writing`, {
        title,
        duration: parseInt(duration),
        is_free: isFree,
        prompt,
      });
      toast('Writing test created');
      onSuccess();
      onClose();
    } catch (err) {
      toast(getErrorMsg(err), 'danger');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Input label="Test Title *" value={title} onChange={setTitle} placeholder="e.g. Creative Writing Test 1" required />
      <div className="grid grid-cols-2 gap-3">
        <Input label="Duration (min)" type="number" value={duration} onChange={setDuration} />
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Type</label>
          <label className="flex items-center gap-2 cursor-pointer px-3 py-2.5 rounded-xl border text-sm"
            style={{ background: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
            <input type="checkbox" checked={isFree} onChange={e => setIsFree(e.target.checked)} className="accent-[var(--accent)]" />
            Free Test
          </label>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
          Writing Prompt *
        </label>
        <textarea
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          placeholder="e.g. One morning, you receive a message from a phone number that does not exist. Write a story about what happens next."
          rows={5}
          className="px-3 py-2.5 rounded-xl text-sm border outline-none resize-y"
          style={{ background: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text)' }}
        />
      </div>

      <div className="flex gap-2 justify-end pt-2">
        <Btn variant="ghost" onClick={onClose}>Cancel</Btn>
        <Btn onClick={handleUpload} loading={loading} disabled={!title.trim() || !prompt.trim()}>
          Create Writing Test
        </Btn>
      </div>
      <Toast toasts={toasts} />
    </div>
  );
}


// ─── Subject Card ─────────────────────────────────────────────────────────────
function SubjectCard({ subject, bundleId, onDelete, onRefresh }: {
  subject: Subject;
  bundleId: string;
  onDelete: (id: string) => void;
  onRefresh: () => void;
}) {
  const [expanded, setExpanded]       = useState(false);
  const [csvModal, setCsvModal]       = useState(false);
  const [writingModal, setWritingModal] = useState(false);
  const isWritingSubject = subject.name.toUpperCase().includes('WRITING');
  const [confirmDel, setConfirmDel]   = useState<string | null>(null);
  const [confirmDelSubject, setConfirmDelSubject] = useState(false);
  const { toasts, add: toast }        = useToast();

  const { data: testsData, loading: testsLoading, refetch: refetchTests } = useApi(
    () => api.get(`/api/admin/subjects/${subject._id}/tests`).then(r => r.data.data as Test[]),
    [subject._id, expanded]
  );

  const tests = testsData || [];

  const handleDeleteTest = async (testId: string) => {
    try {
      await api.delete(`/api/admin/subjects/${subject._id}/tests/${testId}`);
      toast('Test deleted', 'danger');
      setConfirmDel(null);
      refetchTests();
      onRefresh();
    } catch (err) {
      toast(getErrorMsg(err), 'danger');
    }
  };

  return (
    <Card className="overflow-hidden">
      {/* Subject Header */}
      <div className="flex items-center justify-between p-4 cursor-pointer"
        style={{ background: 'var(--bg)' }}
        onClick={() => setExpanded(!expanded)}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm"
            style={{ background: subject.color }}>
            {subject.name[0]}
          </div>
          <div>
            <p className="font-bold text-sm" style={{ color: 'var(--text)' }}>{subject.name}</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{subject.test_count} tests</p>
          </div>
        </div>
          <div className="flex items-center gap-2">
          <div onMouseDown={(e: React.MouseEvent) => e.stopPropagation()}>
            <Btn size="sm" variant="danger" onClick={() => setConfirmDelSubject(true)}>
              <Trash2 size={12} />
            </Btn>
          </div>
          {expanded ? <ChevronLeft size={16} style={{ color: 'var(--text-muted)' }} /> : <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />}
        </div>
      </div>

      {/* Expanded — Tests list */}
      {expanded && (
        <div className="p-4 border-t" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Tests</p>
            {isWritingSubject ? (
              <Btn size="sm" onClick={() => setWritingModal(true)}><Plus size={12} /> Add Writing Prompt</Btn>
            ) : (
              <Btn size="sm" onClick={() => setCsvModal(true)}><Upload size={12} /> Upload CSV</Btn>
            )}
          </div>

          {testsLoading ? <Spinner center /> : tests.length === 0 ? (
            <Empty icon="📝" text="No tests yet — upload a CSV to add tests." />
          ) : (
            <div className="flex flex-col gap-2">
              {tests.map(t => (
                <div key={t._id} className="flex items-center justify-between px-3 py-2.5 rounded-xl border"
                  style={{ background: 'var(--bg)', borderColor: 'var(--border)' }}>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: 'var(--text)' }}>{t.title}</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      {t.question_count} questions · {t.duration} min
                      {t.is_free && <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] font-bold" style={{ background: '#d1fae5', color: '#059669' }}>FREE</span>}
                    </p>
                  </div>
                  <Btn size="sm" variant="danger" onClick={() => setConfirmDel(t._id)}><Trash2 size={11} /></Btn>
                </div>
              ))}
            </div>
          )}

          <Confirm open={!!confirmDel} onClose={() => setConfirmDel(null)}
            onConfirm={() => confirmDel && handleDeleteTest(confirmDel)}
            message="Delete this test permanently?" />
        </div>
      )}

      {/* CSV Upload Modal */}
      <Modal open={csvModal} onClose={() => setCsvModal(false)} title={`Upload Test — ${subject.name}`} maxWidth={560}>
        <CSVUploadModal subjectId={subject._id} onSuccess={() => { refetchTests(); onRefresh(); }} onClose={() => setCsvModal(false)} />
      </Modal>
      <Modal open={writingModal} onClose={() => setWritingModal(false)} title={`Add Writing Test — ${subject.name}`} maxWidth={560}>
        <WritingTestModal subjectId={subject._id} onSuccess={() => { refetchTests(); onRefresh(); }} onClose={() => setWritingModal(false)} />          
      </Modal>

      {/* Delete Subject Confirm */}
      <Confirm open={confirmDelSubject} onClose={() => setConfirmDelSubject(false)}
        onConfirm={() => { onDelete(subject._id); setConfirmDelSubject(false); }}
        message={`Delete "${subject.name}" and all its tests?`} />

      <Toast toasts={toasts} />
    </Card>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function BundleDetailAdminPage({ params }: { params: { bundleId: string } }) {
  const bundleId = params.bundleId;

  const [addSubjectModal, setAddSubjectModal] = useState(false);
  const [subjectForm, setSubjectForm]         = useState({ name: '', icon: 'BookOpen', color: '#6366F1' });
  const [saving, setSaving]                   = useState(false);
  const { toasts, add: toast }                = useToast();

  // Fetch bundle info
  const { data: bundleData } = useApi(
    () => api.get(`/api/admin/bundles`).then(r => (r.data.data as any[]).find(b => b._id === bundleId)),
    [bundleId]
  );

  // Fetch subjects
  const { data: subjectsData, loading, refetch } = useApi(
    () => api.get(`/api/admin/bundles/${bundleId}/subjects`).then(r => r.data.data as Subject[]),
    [bundleId]
  );

  const subjects = subjectsData || [];

  const handleAddSubject = async () => {
    if (!subjectForm.name.trim()) return;
    setSaving(true);
    try {
      await api.post(`/api/admin/bundles/${bundleId}/subjects`, subjectForm);
      toast('Subject added');
      setAddSubjectModal(false);
      setSubjectForm({ name: '', icon: 'BookOpen', color: '#6366F1' });
      refetch();
    } catch (err) {
      toast(getErrorMsg(err), 'danger');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSubject = async (subjectId: string) => {
    try {
      await api.delete(`/api/admin/bundles/${bundleId}/subjects/${subjectId}`);
      toast('Subject deleted', 'danger');
      refetch();
    } catch (err) {
      toast(getErrorMsg(err), 'danger');
    }
  };

  return (
    <AdminLayout title="Bundle Detail">
      <div className="animate-fade-in space-y-5">

        {/* Back + Header */}
        <div className="flex items-center gap-3">
          <Link href="/bundles">
            <Btn variant="ghost" size="sm"><ArrowLeft size={14} /> Bundles</Btn>
          </Link>
          <div className="flex-1">
            <h2 className="font-bold text-base" style={{ color: 'var(--text)' }}>
              {bundleData?.title || 'Bundle'}
            </h2>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {subjects.length} subjects · {subjects.reduce((a, s) => a + s.test_count, 0)} total tests
            </p>
          </div>
          <Btn onClick={() => setAddSubjectModal(true)}><Plus size={15} /> Add Subject</Btn>
        </div>

        {/* Subjects */}
        {loading ? <Spinner center /> : subjects.length === 0 ? (
          <Empty icon="📚" text="No subjects yet — add your first subject." />
        ) : (
          <div className="flex flex-col gap-4">
            {subjects.map(s => (
              <SubjectCard key={s._id} subject={s} bundleId={bundleId}
                onDelete={handleDeleteSubject} onRefresh={refetch} />
            ))}
          </div>
        )}
      </div>

      {/* Add Subject Modal */}
      <Modal open={addSubjectModal} onClose={() => setAddSubjectModal(false)} title="Add Subject">
        <div className="flex flex-col gap-4">
          <Input label="Subject Name *" value={subjectForm.name}
            onChange={v => setSubjectForm(f => ({ ...f, name: v }))}
            placeholder="e.g. Mathematics" required />

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider mb-2 block" style={{ color: 'var(--text-muted)' }}>Color</label>
            <div className="flex gap-2 flex-wrap">
              {COLOR_OPTIONS.map(c => (
                <button key={c} onClick={() => setSubjectForm(f => ({ ...f, color: c }))}
                  className="w-8 h-8 rounded-xl border-2 transition-all"
                  style={{ background: c, borderColor: subjectForm.color === c ? 'var(--text)' : 'transparent' }} />
              ))}
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <Btn variant="ghost" onClick={() => setAddSubjectModal(false)}>Cancel</Btn>
            <Btn onClick={handleAddSubject} loading={saving} disabled={!subjectForm.name.trim()}>Add Subject</Btn>
          </div>
        </div>
      </Modal>

      <Toast toasts={toasts} />
    </AdminLayout>
  );
}
