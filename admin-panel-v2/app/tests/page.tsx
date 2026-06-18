'use client';
import { useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, Btn, Badge, Table, TR, TD, Modal, Input, Confirm, Empty, Spinner, useToast, Toast } from '@/components/ui';
import { Plus, Edit2, Trash2, Upload, X } from 'lucide-react';
import { testsApi, bundlesApi, useApi, useMutation } from '@/lib';
import type { Test, Question } from '@/lib';

// ─── Question Form (MCQ only) ──────────────────────────────────────────────────
function QuestionForm({ initial, onSave, onCancel }: any) {
  const [form, setForm] = useState(initial || { text: '', options: ['', '', '', ''], correct: '0', explanation: '' });
  const set = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }));
  const setOpt = (i: number, v: string) => { const o = [...form.options]; o[i] = v; set('options', o); };
  const valid = form.text.trim() && form.options.every((o: string) => o.trim());

  return (
    <div className="rounded-xl border p-4 mb-3" style={{ background: 'var(--bg)', borderColor: 'var(--border)' }}>
      <div className="mb-3">
        <label className="text-xs font-semibold uppercase tracking-wider mb-1.5 block" style={{ color: 'var(--text-muted)' }}>Question *</label>
        <textarea value={form.text} onChange={e => set('text', e.target.value)} rows={2}
          placeholder="Enter question..." className="w-full px-3 py-2 rounded-xl text-sm border outline-none resize-none"
          style={{ background: 'var(--bg-card)', borderColor: 'var(--border)', color: 'var(--text)' }} />
      </div>
      <div className="mb-3">
        <label className="text-xs font-semibold uppercase tracking-wider mb-1.5 block" style={{ color: 'var(--text-muted)' }}>
          Options <span className="normal-case font-normal">(click radio to mark correct)</span>
        </label>
        {['A', 'B', 'C', 'D'].map((letter, i) => (
          <div key={i} className="flex items-center gap-2 mb-2">
            <input type="radio" checked={form.correct === String(i)} onChange={() => set('correct', String(i))}
              className="accent-[var(--accent)] w-4 h-4 flex-shrink-0" />
            <div className="w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center flex-shrink-0"
              style={{ background: form.correct === String(i) ? 'var(--accent)' : 'var(--border)', color: form.correct === String(i) ? '#fff' : 'var(--text-muted)' }}>
              {letter}
            </div>
            <input value={form.options[i]} onChange={e => setOpt(i, e.target.value)} placeholder={`Option ${letter}`}
              className="flex-1 px-3 py-2 rounded-xl text-sm border outline-none"
              style={{ background: 'var(--bg-card)', borderColor: form.correct === String(i) ? 'var(--accent)' : 'var(--border)', color: 'var(--text)' }} />
          </div>
        ))}
      </div>
      <div className="mb-3">
        <label className="text-xs font-semibold uppercase tracking-wider mb-1.5 block" style={{ color: 'var(--text-muted)' }}>Explanation (optional)</label>
        <input value={form.explanation} onChange={e => set('explanation', e.target.value)} placeholder="Why is this correct?"
          className="w-full px-3 py-2 rounded-xl text-sm border outline-none"
          style={{ background: 'var(--bg-card)', borderColor: 'var(--border)', color: 'var(--text)' }} />
      </div>
      <div className="flex gap-2 justify-end">
        <Btn size="sm" variant="ghost" onClick={onCancel}>Cancel</Btn>
        <Btn size="sm" onClick={() => valid && onSave(form)} disabled={!valid}>Save Question</Btn>
      </div>
    </div>
  );
}

// ─── CSV Upload ────────────────────────────────────────────────────────────────
function CSVUpload({ onImport }: { onImport: (qs: Question[]) => void }) {
  const [preview, setPreview] = useState<Question[]>([]);
  const [error, setError] = useState('');

  const downloadTemplate = () => {
    const csv = `question,optionA,optionB,optionC,optionD,correct,explanation\n"What is 2+2?","3","4","5","6","B","2+2 equals 4"`;
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'questions_template.csv';
    a.click();
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const lines = text.trim().split('\n');
      const map: Record<string, string> = { A: '0', B: '1', C: '2', D: '3', a: '0', b: '1', c: '2', d: '3' };
      const questions: Question[] = [];
      const errors: string[] = [];

      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(',').map(c => c.trim().replace(/^"|"$/g, ''));
        if (cols.length < 6) { errors.push(`Row ${i + 1}: not enough columns`); continue; }
        const [text, a, b, c, d, correct, explanation] = cols;
        if (!text || !a || !b || !c || !d) { errors.push(`Row ${i + 1}: missing fields`); continue; }
        if (!map[correct]) { errors.push(`Row ${i + 1}: correct must be A/B/C/D`); continue; }
        questions.push({ id: '', text, options: [a, b, c, d], correct: map[correct], explanation: explanation || '' });
      }

      if (errors.length) { setError(errors.slice(0, 3).join(' | ')); setPreview([]); }
      else { setError(''); setPreview(questions); }
    };
    reader.readAsText(file);
  };

  return (
    <div>
      <div className="rounded-xl p-3 mb-3 text-xs" style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
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
      {error && <p className="text-xs mt-2" style={{ color: 'var(--danger)' }}>⚠ {error}</p>}
      {preview.length > 0 && (
        <div className="mt-3">
          <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>Preview (first 2):</p>
          {preview.slice(0, 2).map((q, i) => (
            <div key={i} className="rounded-lg px-3 py-2 mb-1.5 text-xs" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
              <strong>Q{i + 1}:</strong> {q.text} — <span style={{ color: 'var(--success)' }}>✓ {['A', 'B', 'C', 'D'][parseInt(q.correct)]}</span>
            </div>
          ))}
          <div className="flex justify-end mt-2">
            <Btn size="sm" onClick={() => onImport(preview)}>Import {preview.length} Questions</Btn>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Test Modal ────────────────────────────────────────────────────────────────
function TestModal({ initial, bundles, onSave, onClose }: any) {
  const [form, setForm] = useState(initial || { title: '', subject: '', duration: 40, is_free: false, bundle_id: '', type: 'mcq' });
  const [questions, setQuestions] = useState<Question[]>(initial?.questions || []);
  const [prompt, setPrompt] = useState<string>(initial?.prompt || '');
  const [addingQ, setAddingQ] = useState(false);
  const [editingQ, setEditingQ] = useState<number | null>(null);
  const [tab, setTab] = useState<'manual' | 'csv'>('manual');
  const [saving, setSaving] = useState(false);
  const set = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }));

  const isWriting = form.type === 'writing';

  // When subject changes to Writing Skills, auto-set type to writing
  const handleSubjectChange = (val: string) => {
    set('subject', val);
    if (val === 'Writing Skills') {
      set('type', 'writing');
    } else {
      set('type', 'mcq');
    }
  };

  const handleSave = async () => {
    if (!form.title) return;
    if (isWriting && !prompt.trim()) return;
    if (!isWriting && questions.length === 0) return;

    setSaving(true);
    if (isWriting) {
      await onSave({ ...form, type: 'writing', prompt });
    } else {
      await onSave({ ...form, type: 'mcq', questions });
    }
    setSaving(false);
  };

  const canSave = form.title && (isWriting ? prompt.trim() : questions.length > 0);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <Input label="Test Title *" value={form.title} onChange={v => set('title', v)} placeholder="e.g. Writing Task 1" required />
        </div>

        {/* Subject */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider mb-1.5 block" style={{ color: 'var(--text-muted)' }}>Subject</label>
          <select value={form.subject} onChange={e => handleSubjectChange(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl text-sm border outline-none"
            style={{ background: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text)' }}>
            <option value="">Select subject</option>
            {['Mathematics', 'English', 'Science', 'Reasoning', 'Writing Skills'].map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <Input label="Duration (min)" type="number" value={String(form.duration)} onChange={v => set('duration', parseInt(v) || 40)} />

        {/* Bundle */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider mb-1.5 block" style={{ color: 'var(--text-muted)' }}>Bundle</label>
          <select value={form.bundle_id} onChange={e => set('bundle_id', e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl text-sm border outline-none"
            style={{ background: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text)' }}>
            <option value="">No bundle</option>
            {bundles?.map((b: any) => <option key={b._id} value={b._id}>{b.title}</option>)}
          </select>
        </div>

        {/* Free checkbox */}
        <div className="flex items-end">
          <label className="flex items-center gap-2 cursor-pointer px-3 py-2.5 rounded-xl border text-sm w-full"
            style={{ background: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
            <input type="checkbox" checked={form.is_free} onChange={e => set('is_free', e.target.checked)} className="accent-[var(--accent)]" />
            Free test
          </label>
        </div>

        {/* Test Type badge — shown when Writing Skills selected */}
        {isWriting && (
          <div className="col-span-2">
            <div className="rounded-xl px-4 py-3 text-sm flex items-center gap-2"
              style={{ background: 'var(--accent-light)', color: 'var(--accent)', border: '1px solid var(--accent)' }}>
              ✍️ <strong>Writing Test</strong> — Student will see the prompt and write a response. No MCQ options needed.
            </div>
          </div>
        )}
      </div>

      {/* ── Writing Prompt (only for Writing Skills) ── */}
      {isWriting ? (
        <div className="border-t pt-4" style={{ borderColor: 'var(--border)' }}>
          <label className="text-xs font-semibold uppercase tracking-wider mb-1.5 block" style={{ color: 'var(--text-muted)' }}>
            Writing Prompt * <span className="normal-case font-normal">(this is the question/task the student sees)</span>
          </label>
          <textarea
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            rows={5}
            placeholder="e.g. Write a letter to your local council about improving park facilities in your area. Your letter should be 150–200 words."
            className="w-full px-3 py-2 rounded-xl text-sm border outline-none resize-y"
            style={{ background: 'var(--bg-card)', borderColor: prompt.trim() ? 'var(--accent)' : 'var(--border)', color: 'var(--text)' }}
          />
          {!prompt.trim() && (
            <p className="text-xs mt-1" style={{ color: 'var(--danger)' }}>Writing prompt is required.</p>
          )}
        </div>
      ) : (
        /* ── MCQ Questions ── */
        <div className="border-t pt-4" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center justify-between mb-3">
            <span className="font-bold text-sm" style={{ color: 'var(--text)' }}>
              Questions <span className="font-normal text-xs ml-1" style={{ color: 'var(--text-muted)' }}>({questions.length} added)</span>
            </span>
            <div className="flex gap-2">
              <Btn size="sm" variant="ghost" onClick={() => { setTab('csv'); setAddingQ(true); }}><Upload size={12} /> CSV</Btn>
              <Btn size="sm" onClick={() => { setTab('manual'); setAddingQ(true); setEditingQ(null); }}><Plus size={12} /> Add</Btn>
            </div>
          </div>

          {addingQ && tab === 'manual' && (
            <QuestionForm onSave={(q: Question) => { setQuestions(p => [...p, q]); setAddingQ(false); }} onCancel={() => setAddingQ(false)} />
          )}
          {addingQ && tab === 'csv' && (
            <div className="rounded-xl border p-4 mb-3" style={{ background: 'var(--bg)', borderColor: 'var(--border)' }}>
              <CSVUpload onImport={(qs) => { setQuestions(p => [...p, ...qs]); setAddingQ(false); }} />
              <div className="flex justify-end mt-2"><Btn size="sm" variant="ghost" onClick={() => setAddingQ(false)}>Cancel</Btn></div>
            </div>
          )}

          {questions.length === 0 && !addingQ ? (
            <p className="text-center text-sm py-6" style={{ color: 'var(--text-dim)' }}>No questions yet — add manually or upload CSV</p>
          ) : (
            <div className="max-h-52 overflow-y-auto space-y-2">
              {questions.map((q, i) => (
                editingQ === i ? (
                  <QuestionForm key={i} initial={q}
                    onSave={(updated: Question) => { setQuestions(p => p.map((x, idx) => idx === i ? updated : x)); setEditingQ(null); }}
                    onCancel={() => setEditingQ(null)} />
                ) : (
                  <div key={i} className="flex items-start gap-3 rounded-xl p-3 border" style={{ background: 'var(--bg)', borderColor: 'var(--border)' }}>
                    <div className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                      style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>{i + 1}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate font-medium" style={{ color: 'var(--text)' }}>{q.text}</p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--success)' }}>
                        ✓ {['A', 'B', 'C', 'D'][parseInt(q.correct)]}: {q.options[parseInt(q.correct)]}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <Btn size="sm" variant="ghost" onClick={() => setEditingQ(i)}><Edit2 size={11} /></Btn>
                      <Btn size="sm" variant="danger" onClick={() => setQuestions(p => p.filter((_, idx) => idx !== i))}><X size={11} /></Btn>
                    </div>
                  </div>
                )
              ))}
            </div>
          )}
        </div>
      )}

      <div className="flex gap-2 justify-end pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
        <Btn variant="ghost" onClick={onClose}>Cancel</Btn>
        <Btn onClick={handleSave} loading={saving} disabled={!canSave}>
          {initial
            ? 'Update Test'
            : isWriting
              ? 'Save Writing Test'
              : `Save Test (${questions.length} questions)`}
        </Btn>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function TestsPage() {
  const { data: tests, loading, refetch } = useApi(() => testsApi.list());
  const { data: bundles } = useApi(() => bundlesApi.list());
  const { mutate: createTest } = useMutation(testsApi.create);
  const { mutate: deleteTest } = useMutation(testsApi.delete);

  const [modal, setModal]           = useState(false);
  const [editing, setEditing]       = useState<Test | null>(null);
  const [confirmDel, setConfirmDel] = useState<string | null>(null);
  const [filter, setFilter]         = useState('All');
  const { toasts, add: toast }      = useToast();

  const subjects = ['All', 'Mathematics', 'English', 'Science', 'Reasoning', 'Writing Skills'];
  const filtered: Test[] = !tests ? [] : filter === 'All' ? tests : tests.filter((t: Test) => t.subject === filter);

  const handleSave = async (form: any) => {
    if (editing) {
      await testsApi.update(editing._id, form);
      toast('Test updated');
    } else {
      const res = await createTest(form);
      if (!res) { toast('Create failed', 'danger'); return; }
      toast('Test created');
    }
    setModal(false);
    refetch();
  };

  const handleDelete = async () => {
    if (!confirmDel) return;
    await deleteTest(confirmDel);
    toast('Test deleted', 'danger');
    setConfirmDel(null);
    refetch();
  };

  return (
    <AdminLayout title="Tests">
      <div className="animate-fade-in space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-2 flex-wrap">
            {subjects.map(s => (
              <button key={s} onClick={() => setFilter(s)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
                style={{ background: filter === s ? 'var(--accent)' : 'var(--bg-card)', color: filter === s ? '#fff' : 'var(--text-muted)', border: '1px solid var(--border)' }}>
                {s}
              </button>
            ))}
          </div>
          <Btn onClick={() => { setEditing(null); setModal(true); }}><Plus size={15} /> Add Test</Btn>
        </div>

        {loading ? <Spinner center /> : (
          <Table headers={['Title', 'Subject', 'Bundle', 'Duration', 'Questions', 'Type', 'Actions']}>
            {filtered.map(t => (
              <TR key={t._id}>
                <TD><span className="font-semibold">{t.title}</span></TD>
                <TD muted>{t.subject || '—'}</TD>
                <TD muted>{t.bundle_title || '—'}</TD>
                <TD muted>{t.duration} min</TD>
                <TD muted>{t.question_count}</TD>
                <TD>
                  <Badge type={t.is_free ? 'success' : 'info'}>{t.is_free ? 'Free' : 'Paid'}</Badge>
                </TD>
                <TD>
                  <div className="flex gap-1.5">
                    <Btn size="sm" variant="secondary" onClick={() => { setEditing(t); setModal(true); }}><Edit2 size={12} /></Btn>
                    <Btn size="sm" variant="danger" onClick={() => setConfirmDel(t._id)}><Trash2 size={12} /></Btn>
                  </div>
                </TD>
              </TR>
            ))}
          </Table>
        )}
        {!loading && filtered.length === 0 && <Empty icon="📝" text="No tests found." />}
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Edit Test' : 'New Test'} maxWidth={600}>
        <TestModal initial={editing} bundles={bundles} onSave={handleSave} onClose={() => setModal(false)} />
      </Modal>

      <Confirm open={!!confirmDel} onClose={() => setConfirmDel(null)} onConfirm={handleDelete}
        message="Delete this test permanently?" />

      <Toast toasts={toasts} />
    </AdminLayout>
  );
}




// 'use client';
// import { useState } from 'react';
// import AdminLayout from '@/components/layout/AdminLayout';
// import { Card, Btn, Badge, Table, TR, TD, Modal, Input, Confirm, Empty, Spinner, useToast, Toast } from '@/components/ui';
// import { Plus, Edit2, Trash2, Upload, X } from 'lucide-react';
// import { testsApi, bundlesApi, useApi, useMutation } from '@/lib';
// import type { Test, Question } from '@/lib';

// // ─── Question Form ─────────────────────────────────────────────────────────────
// function QuestionForm({ initial, onSave, onCancel }: any) {
//   const [form, setForm] = useState(initial || { text: '', options: ['', '', '', ''], correct: '0', explanation: '' });
//   const set = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }));
//   const setOpt = (i: number, v: string) => { const o = [...form.options]; o[i] = v; set('options', o); };
//   const valid = form.text.trim() && form.options.every((o: string) => o.trim());

//   return (
//     <div className="rounded-xl border p-4 mb-3" style={{ background: 'var(--bg)', borderColor: 'var(--border)' }}>
//       <div className="mb-3">
//         <label className="text-xs font-semibold uppercase tracking-wider mb-1.5 block" style={{ color: 'var(--text-muted)' }}>Question *</label>
//         <textarea value={form.text} onChange={e => set('text', e.target.value)} rows={2}
//           placeholder="Enter question..." className="w-full px-3 py-2 rounded-xl text-sm border outline-none resize-none"
//           style={{ background: 'var(--bg-card)', borderColor: 'var(--border)', color: 'var(--text)' }} />
//       </div>
//       <div className="mb-3">
//         <label className="text-xs font-semibold uppercase tracking-wider mb-1.5 block" style={{ color: 'var(--text-muted)' }}>
//           Options <span className="normal-case font-normal">(click radio to mark correct)</span>
//         </label>
//         {['A', 'B', 'C', 'D'].map((letter, i) => (
//           <div key={i} className="flex items-center gap-2 mb-2">
//             <input type="radio" checked={form.correct === String(i)} onChange={() => set('correct', String(i))}
//               className="accent-[var(--accent)] w-4 h-4 flex-shrink-0" />
//             <div className="w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center flex-shrink-0"
//               style={{ background: form.correct === String(i) ? 'var(--accent)' : 'var(--border)', color: form.correct === String(i) ? '#fff' : 'var(--text-muted)' }}>
//               {letter}
//             </div>
//             <input value={form.options[i]} onChange={e => setOpt(i, e.target.value)} placeholder={`Option ${letter}`}
//               className="flex-1 px-3 py-2 rounded-xl text-sm border outline-none"
//               style={{ background: 'var(--bg-card)', borderColor: form.correct === String(i) ? 'var(--accent)' : 'var(--border)', color: 'var(--text)' }} />
//           </div>
//         ))}
//       </div>
//       <div className="mb-3">
//         <label className="text-xs font-semibold uppercase tracking-wider mb-1.5 block" style={{ color: 'var(--text-muted)' }}>Explanation (optional)</label>
//         <input value={form.explanation} onChange={e => set('explanation', e.target.value)} placeholder="Why is this correct?"
//           className="w-full px-3 py-2 rounded-xl text-sm border outline-none"
//           style={{ background: 'var(--bg-card)', borderColor: 'var(--border)', color: 'var(--text)' }} />
//       </div>
//       <div className="flex gap-2 justify-end">
//         <Btn size="sm" variant="ghost" onClick={onCancel}>Cancel</Btn>
//         <Btn size="sm" onClick={() => valid && onSave(form)} disabled={!valid}>Save Question</Btn>
//       </div>
//     </div>
//   );
// }

// // ─── CSV Upload ────────────────────────────────────────────────────────────────
// function CSVUpload({ onImport }: { onImport: (qs: Question[]) => void }) {
//   const [preview, setPreview] = useState<Question[]>([]);
//   const [error, setError] = useState('');

//   const downloadTemplate = () => {
//     const csv = `question,optionA,optionB,optionC,optionD,correct,explanation\n"What is 2+2?","3","4","5","6","B","2+2 equals 4"`;
//     const blob = new Blob([csv], { type: 'text/csv' });
//     const a = document.createElement('a');
//     a.href = URL.createObjectURL(blob);
//     a.download = 'questions_template.csv';
//     a.click();
//   };

//   const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     const reader = new FileReader();
//     reader.onload = (ev) => {
//       const text = ev.target?.result as string;
//       const lines = text.trim().split('\n');
//       const map: Record<string, string> = { A: '0', B: '1', C: '2', D: '3', a: '0', b: '1', c: '2', d: '3' };
//       const questions: Question[] = [];
//       const errors: string[] = [];

//       for (let i = 1; i < lines.length; i++) {
//         const cols = lines[i].split(',').map(c => c.trim().replace(/^"|"$/g, ''));
//         if (cols.length < 6) { errors.push(`Row ${i + 1}: not enough columns`); continue; }
//         const [text, a, b, c, d, correct, explanation] = cols;
//         if (!text || !a || !b || !c || !d) { errors.push(`Row ${i + 1}: missing fields`); continue; }
//         if (!map[correct]) { errors.push(`Row ${i + 1}: correct must be A/B/C/D`); continue; }
//         questions.push({ id: '', text, options: [a, b, c, d], correct: map[correct], explanation: explanation || '' });
//       }

//       if (errors.length) { setError(errors.slice(0, 3).join(' | ')); setPreview([]); }
//       else { setError(''); setPreview(questions); }
//     };
//     reader.readAsText(file);
//   };

//   return (
//     <div>
//       <div className="rounded-xl p-3 mb-3 text-xs" style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
//         Format: <code className="mx-1 px-1 rounded" style={{ background: 'var(--border)' }}>question,optionA,optionB,optionC,optionD,correct(A-D),explanation</code>
//         <button onClick={downloadTemplate} className="ml-2 underline" style={{ color: 'var(--accent)' }}>Download template</button>
//       </div>
//       <label className="block border-2 border-dashed rounded-xl p-6 text-center cursor-pointer"
//         style={{ borderColor: preview.length ? 'var(--success)' : 'var(--border)' }}>
//         <input type="file" accept=".csv" className="hidden" onChange={handleFile} />
//         <Upload size={24} className="mx-auto mb-2" style={{ color: preview.length ? 'var(--success)' : 'var(--text-dim)' }} />
//         <p className="text-sm" style={{ color: preview.length ? 'var(--success)' : 'var(--text-muted)' }}>
//           {preview.length ? `${preview.length} questions ready` : 'Click to upload CSV'}
//         </p>
//       </label>
//       {error && <p className="text-xs mt-2" style={{ color: 'var(--danger)' }}>⚠ {error}</p>}
//       {preview.length > 0 && (
//         <div className="mt-3">
//           <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>Preview (first 2):</p>
//           {preview.slice(0, 2).map((q, i) => (
//             <div key={i} className="rounded-lg px-3 py-2 mb-1.5 text-xs" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
//               <strong>Q{i + 1}:</strong> {q.text} — <span style={{ color: 'var(--success)' }}>✓ {['A', 'B', 'C', 'D'][parseInt(q.correct)]}</span>
//             </div>
//           ))}
//           <div className="flex justify-end mt-2">
//             <Btn size="sm" onClick={() => onImport(preview)}>Import {preview.length} Questions</Btn>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// // ─── Test Modal ────────────────────────────────────────────────────────────────
// function TestModal({ initial, bundles, onSave, onClose }: any) {
//   const [form, setForm] = useState(initial || { title: '', subject: '', duration: 40, is_free: false, bundle_id: '' });
//   const [questions, setQuestions] = useState<Question[]>(initial?.questions || []);
//   const [addingQ, setAddingQ] = useState(false);
//   const [editingQ, setEditingQ] = useState<number | null>(null);
//   const [tab, setTab] = useState<'manual' | 'csv'>('manual');
//   const [saving, setSaving] = useState(false);
//   const set = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }));

//   const handleSave = async () => {
//     if (!form.title || questions.length === 0) return;
//     setSaving(true);
//     await onSave({ ...form, questions });
//     setSaving(false);
//   };

//   return (
//     <div className="flex flex-col gap-4">
//       <div className="grid grid-cols-2 gap-3">
//         <div className="col-span-2">
//           <Input label="Test Title *" value={form.title} onChange={v => set('title', v)} placeholder="e.g. Maths Practice Set 1" required />
//         </div>
//         <div>
//           <label className="text-xs font-semibold uppercase tracking-wider mb-1.5 block" style={{ color: 'var(--text-muted)' }}>Subject</label>
//           <select value={form.subject} onChange={e => set('subject', e.target.value)}
//             className="w-full px-3 py-2.5 rounded-xl text-sm border outline-none"
//             style={{ background: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text)' }}>
//             <option value="">Select subject</option>
//             {['Mathematics', 'English', 'Science', 'Reasoning'].map(s => <option key={s} value={s}>{s}</option>)}
//           </select>
//         </div>
//         <Input label="Duration (min)" type="number" value={String(form.duration)} onChange={v => set('duration', parseInt(v) || 40)} />
//         <div>
//           <label className="text-xs font-semibold uppercase tracking-wider mb-1.5 block" style={{ color: 'var(--text-muted)' }}>Bundle</label>
//           <select value={form.bundle_id} onChange={e => set('bundle_id', e.target.value)}
//             className="w-full px-3 py-2.5 rounded-xl text-sm border outline-none"
//             style={{ background: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text)' }}>
//             <option value="">No bundle</option>
//             {bundles?.map((b: any) => <option key={b._id} value={b._id}>{b.title}</option>)}
//           </select>
//         </div>
//         <div className="flex items-end">
//           <label className="flex items-center gap-2 cursor-pointer px-3 py-2.5 rounded-xl border text-sm w-full"
//             style={{ background: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
//             <input type="checkbox" checked={form.is_free} onChange={e => set('is_free', e.target.checked)} className="accent-[var(--accent)]" />
//             Free test
//           </label>
//         </div>
//       </div>

//       <div className="border-t pt-4" style={{ borderColor: 'var(--border)' }}>
//         <div className="flex items-center justify-between mb-3">
//           <span className="font-bold text-sm" style={{ color: 'var(--text)' }}>
//             Questions <span className="font-normal text-xs ml-1" style={{ color: 'var(--text-muted)' }}>({questions.length} added)</span>
//           </span>
//           <div className="flex gap-2">
//             <Btn size="sm" variant="ghost" onClick={() => { setTab('csv'); setAddingQ(true); }}><Upload size={12} /> CSV</Btn>
//             <Btn size="sm" onClick={() => { setTab('manual'); setAddingQ(true); setEditingQ(null); }}><Plus size={12} /> Add</Btn>
//           </div>
//         </div>

//         {addingQ && tab === 'manual' && (
//           <QuestionForm onSave={(q: Question) => { setQuestions(p => [...p, q]); setAddingQ(false); }} onCancel={() => setAddingQ(false)} />
//         )}
//         {addingQ && tab === 'csv' && (
//           <div className="rounded-xl border p-4 mb-3" style={{ background: 'var(--bg)', borderColor: 'var(--border)' }}>
//             <CSVUpload onImport={(qs) => { setQuestions(p => [...p, ...qs]); setAddingQ(false); }} />
//             <div className="flex justify-end mt-2"><Btn size="sm" variant="ghost" onClick={() => setAddingQ(false)}>Cancel</Btn></div>
//           </div>
//         )}

//         {questions.length === 0 && !addingQ ? (
//           <p className="text-center text-sm py-6" style={{ color: 'var(--text-dim)' }}>No questions yet — add manually or upload CSV</p>
//         ) : (
//           <div className="max-h-52 overflow-y-auto space-y-2">
//             {questions.map((q, i) => (
//               editingQ === i ? (
//                 <QuestionForm key={i} initial={q}
//                   onSave={(updated: Question) => { setQuestions(p => p.map((x, idx) => idx === i ? updated : x)); setEditingQ(null); }}
//                   onCancel={() => setEditingQ(null)} />
//               ) : (
//                 <div key={i} className="flex items-start gap-3 rounded-xl p-3 border" style={{ background: 'var(--bg)', borderColor: 'var(--border)' }}>
//                   <div className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
//                     style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>{i + 1}</div>
//                   <div className="flex-1 min-w-0">
//                     <p className="text-sm truncate font-medium" style={{ color: 'var(--text)' }}>{q.text}</p>
//                     <p className="text-xs mt-0.5" style={{ color: 'var(--success)' }}>
//                       ✓ {['A', 'B', 'C', 'D'][parseInt(q.correct)]}: {q.options[parseInt(q.correct)]}
//                     </p>
//                   </div>
//                   <div className="flex gap-1">
//                     <Btn size="sm" variant="ghost" onClick={() => setEditingQ(i)}><Edit2 size={11} /></Btn>
//                     <Btn size="sm" variant="danger" onClick={() => setQuestions(p => p.filter((_, idx) => idx !== i))}><X size={11} /></Btn>
//                   </div>
//                 </div>
//               )
//             ))}
//           </div>
//         )}
//       </div>

//       <div className="flex gap-2 justify-end pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
//         <Btn variant="ghost" onClick={onClose}>Cancel</Btn>
//         <Btn onClick={handleSave} loading={saving} disabled={!form.title || questions.length === 0}>
//           {initial ? 'Update Test' : `Save Test (${questions.length} questions)`}
//         </Btn>
//       </div>
//     </div>
//   );
// }

// // ─── Main Page ─────────────────────────────────────────────────────────────────
// export default function TestsPage() {
//   const { data: tests, loading, refetch } = useApi(() => testsApi.list());
//   const { data: bundles } = useApi(() => bundlesApi.list());
//   const { mutate: createTest } = useMutation(testsApi.create);
//   const { mutate: deleteTest } = useMutation(testsApi.delete);

//   const [modal, setModal]           = useState(false);
//   const [editing, setEditing]       = useState<Test | null>(null);
//   const [confirmDel, setConfirmDel] = useState<string | null>(null);
//   const [filter, setFilter]         = useState('All');
//   const { toasts, add: toast }      = useToast();

//   const subjects = ['All', 'Mathematics', 'English', 'Science', 'Reasoning'];
//   const filtered: Test[] = !tests ? [] : filter === 'All' ? tests : tests.filter((t: Test) => t.subject === filter);

//   const handleSave = async (form: any) => {
//     if (editing) {
//       await testsApi.update(editing._id, form);
//       toast('Test updated');
//     } else {
//       const res = await createTest(form);
//       if (!res) { toast('Create failed', 'danger'); return; }
//       toast('Test created');
//     }
//     setModal(false);
//     refetch();
//   };

//   const handleDelete = async () => {
//     if (!confirmDel) return;
//     await deleteTest(confirmDel);
//     toast('Test deleted', 'danger');
//     setConfirmDel(null);
//     refetch();
//   };

//   return (
//     <AdminLayout title="Tests">
//       <div className="animate-fade-in space-y-5">
//         <div className="flex flex-wrap items-center justify-between gap-3">
//           <div className="flex gap-2 flex-wrap">
//             {subjects.map(s => (
//               <button key={s} onClick={() => setFilter(s)}
//                 className="px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
//                 style={{ background: filter === s ? 'var(--accent)' : 'var(--bg-card)', color: filter === s ? '#fff' : 'var(--text-muted)', border: '1px solid var(--border)' }}>
//                 {s}
//               </button>
//             ))}
//           </div>
//           <Btn onClick={() => { setEditing(null); setModal(true); }}><Plus size={15} /> Add Test</Btn>
//         </div>

//         {loading ? <Spinner center /> : (
//           <Table headers={['Title', 'Subject', 'Bundle', 'Duration', 'Questions', 'Type', 'Actions']}>
//             {filtered.map(t => (
//               <TR key={t._id}>
//                 <TD><span className="font-semibold">{t.title}</span></TD>
//                 <TD muted>{t.subject || '—'}</TD>
//                 <TD muted>{t.bundle_title || '—'}</TD>
//                 <TD muted>{t.duration} min</TD>
//                 <TD muted>{t.question_count}</TD>
//                 <TD><Badge type={t.is_free ? 'success' : 'info'}>{t.is_free ? 'Free' : 'Paid'}</Badge></TD>
//                 <TD>
//                   <div className="flex gap-1.5">
//                     <Btn size="sm" variant="secondary" onClick={() => { setEditing(t); setModal(true); }}><Edit2 size={12} /></Btn>
//                     <Btn size="sm" variant="danger" onClick={() => setConfirmDel(t._id)}><Trash2 size={12} /></Btn>
//                   </div>
//                 </TD>
//               </TR>
//             ))}
//           </Table>
//         )}
//         {!loading && filtered.length === 0 && <Empty icon="📝" text="No tests found." />}
//       </div>

//       <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Edit Test' : 'New Test'} maxWidth={600}>
//         <TestModal initial={editing} bundles={bundles} onSave={handleSave} onClose={() => setModal(false)} />
//       </Modal>

//       <Confirm open={!!confirmDel} onClose={() => setConfirmDel(null)} onConfirm={handleDelete}
//         message="Delete this test permanently?" />

//       <Toast toasts={toasts} />
//     </AdminLayout>
//   );
// }



