import { useState, useEffect } from 'react';
import { coursesAPI, testsAPI, bundlesAPI } from '../api';
import { C, Btn, Badge, Modal, Input, Textarea, Confirm, Spinner, Empty, Card, Table, TR, TD, useToast, Toast } from '../components/UI';

// ─── Question Form ─────────────────────────────────────────────────────────────
function QuestionForm({ question, index, onChange, onRemove }) {
  const setQ = (k, v) => onChange(index, { ...question, [k]: v });
  const setOption = (i, v) => {
    const opts = [...question.options];
    opts[i] = { ...opts[i], text: v };
    onChange(index, { ...question, options: opts });
  };

  return (
    <div style={{ border: `1px solid ${C.border}`, borderRadius: 10, padding: 16, marginBottom: 14, background: '#0a0a14' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <span style={{ color: C.textMuted, fontSize: 12, fontWeight: 700 }}>QUESTION {index + 1}</span>
        <Btn size="sm" variant="danger" onClick={() => onRemove(index)}>Remove</Btn>
      </div>
      <Textarea label="Question Text" value={question.text} onChange={e => setQ('text', e.target.value)} rows={2} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 }}>
        {question.options.map((opt, i) => (
          <div key={opt.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: C.accent, fontWeight: 700, fontSize: 13, minWidth: 18 }}>{opt.id}.</span>
            <input
              value={opt.text}
              onChange={e => setOption(i, e.target.value)}
              placeholder={`Option ${opt.id}`}
              style={{ flex: 1, background: '#0f0f18', border: `1px solid ${C.border}`, borderRadius: 6, padding: '7px 10px', color: C.text, fontSize: 13, fontFamily: 'inherit' }}
            />
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <label style={{ color: C.textMuted, fontSize: 12, fontWeight: 600 }}>CORRECT ANSWER:</label>
        <div style={{ display: 'flex', gap: 6 }}>
          {question.options.map(opt => (
            <button key={opt.id} onClick={() => setQ('correctAnswer', opt.id)}
              style={{ width: 32, height: 32, borderRadius: 6, border: `1px solid ${question.correctAnswer === opt.id ? C.success : C.border}`, background: question.correctAnswer === opt.id ? C.success : 'transparent', color: question.correctAnswer === opt.id ? '#fff' : C.textMuted, fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}
            >{opt.id}</button>
          ))}
        </div>
        <select value={question.difficulty} onChange={e => setQ('difficulty', e.target.value)}
          style={{ marginLeft: 'auto', background: '#0f0f18', border: `1px solid ${C.border}`, borderRadius: 6, padding: '6px 10px', color: C.textMuted, fontSize: 12, fontFamily: 'inherit' }}>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
          <option value="intense">Intense</option>
        </select>
      </div>
    </div>
  );
}

// ─── Free Test Form (CSV or Manual) ───────────────────────────────────────────
function TestForm({ courseId, onSave, onClose, loading }) {
  const [form, setForm] = useState({ title: '', description: '', duration_minutes: 45 });
  const [mode, setMode] = useState('csv'); // 'csv' or 'manual'
  const [csvFile, setCsvFile] = useState(null);
  const [questions, setQuestions] = useState([]);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const addQuestion = () => {
    setQuestions(qs => [...qs, {
      text: '', topic: 'General', difficulty: 'easy',
      options: [{ id: 'A', text: '' }, { id: 'B', text: '' }, { id: 'C', text: '' }, { id: 'D', text: '' }],
      correctAnswer: 'A',
    }]);
  };

  const submit = () => {
    if (!form.title) return;
    if (mode === 'csv' && !csvFile) return;
    if (mode === 'manual' && questions.length === 0) return;

    if (mode === 'csv') {
      const fd = new FormData();
      fd.append('course_id', courseId);
      fd.append('title', form.title);
      fd.append('description', form.description);
      fd.append('duration_minutes', form.duration_minutes);
      fd.append('file', csvFile);
      onSave(fd, 'csv');
    } else {
      onSave({
        course_id: courseId,
        title: form.title,
        description: form.description,
        duration_minutes: Number(form.duration_minutes),
        is_free: true,
        questions,
      }, 'manual');
    }
  };

  return (
    <div style={{ maxHeight: '75vh', overflowY: 'auto', paddingRight: 4 }}>
      <Input label="Test Title" value={form.title} onChange={e => set('title', e.target.value)} required />
      <Textarea label="Description" value={form.description} onChange={e => set('description', e.target.value)} rows={2} />
      <Input label="Duration (minutes)" type="number" value={form.duration_minutes} onChange={e => set('duration_minutes', e.target.value)} />

      {/* Mode Toggle */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <button onClick={() => setMode('csv')} style={{ flex: 1, padding: '8px', borderRadius: 8, border: `1px solid ${mode === 'csv' ? C.accent : C.border}`, background: mode === 'csv' ? C.accent : 'transparent', color: mode === 'csv' ? '#fff' : C.textMuted, cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: 600 }}>
          📄 Upload CSV
        </button>
        <button onClick={() => setMode('manual')} style={{ flex: 1, padding: '8px', borderRadius: 8, border: `1px solid ${mode === 'manual' ? C.accent : C.border}`, background: mode === 'manual' ? C.accent : 'transparent', color: mode === 'manual' ? '#fff' : C.textMuted, cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: 600 }}>
          ✏️ Manual Entry
        </button>
      </div>

      {mode === 'csv' ? (
        <div>
          <div style={{ marginBottom: 10, padding: '10px 14px', borderRadius: 8, background: 'rgba(99,102,241,0.08)', border: `1px solid rgba(99,102,241,0.2)` }}>
            <p style={{ margin: 0, fontSize: 12, color: C.textMuted }}>CSV format: <code style={{ color: C.accent }}>question, option_a, option_b, option_c, option_d, correct_answer, difficulty</code></p>
          </div>
          <label style={{ display: 'block', border: `2px dashed ${csvFile ? C.success : C.border}`, borderRadius: 10, padding: '22px', textAlign: 'center', cursor: 'pointer', background: '#0f0f18' }}>
            <input type="file" accept=".csv" style={{ display: 'none' }} onChange={e => setCsvFile(e.target.files[0])} />
            <div style={{ fontSize: 28, marginBottom: 8 }}>{csvFile ? '✅' : '📤'}</div>
            <p style={{ margin: 0, color: csvFile ? C.success : C.textMuted, fontSize: 13 }}>{csvFile ? csvFile.name : 'Click to upload CSV file'}</p>
          </label>
        </div>
      ) : (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <span style={{ color: C.text, fontWeight: 700, fontSize: 14 }}>Questions ({questions.length})</span>
            <Btn size="sm" onClick={addQuestion}>+ Add Question</Btn>
          </div>
          {questions.length === 0 && (
            <div style={{ textAlign: 'center', padding: '20px', color: C.textMuted, fontSize: 13 }}>
              Click "Add Question" to start.
            </div>
          )}
          {questions.map((q, i) => (
            <QuestionForm key={i} question={q} index={i}
              onChange={(idx, updated) => setQuestions(qs => qs.map((q, i) => i === idx ? updated : q))}
              onRemove={(idx) => setQuestions(qs => qs.filter((_, i) => i !== idx))}
            />
          ))}
        </div>
      )}

      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 16 }}>
        <Btn variant="ghost" onClick={onClose}>Cancel</Btn>
        <Btn onClick={submit} loading={loading}>Save Test</Btn>
      </div>
    </div>
  );
}

// ─── Bundle Form ───────────────────────────────────────────────────────────────
function BundleForm({ courseId, onSave, onClose, loading }) {
  const [form, setForm] = useState({ title: '', description: '', price: 0, points: '' });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = () => {
    if (!form.title) return;
    const fd = new FormData();
    fd.append('title', form.title);
    fd.append('description', form.description);
    fd.append('course_id', courseId);
    fd.append('price', form.price);
    fd.append('points', form.points);
    onSave(fd);
  };

  return (
    <>
      <Input label="Bundle Title" value={form.title} onChange={e => set('title', e.target.value)} required placeholder="e.g. MATHS PACK 1" />
      <Textarea label="Description" value={form.description} onChange={e => set('description', e.target.value)} rows={2} />
      <Input label="Price (₹)" type="number" value={form.price} onChange={e => set('price', e.target.value)} />
      <Input label="Key Points (comma separated)" value={form.points} onChange={e => set('points', e.target.value)} placeholder="e.g. Timed practice sets, Step-by-step solutions" />
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 16 }}>
        <Btn variant="ghost" onClick={onClose}>Cancel</Btn>
        <Btn onClick={submit} loading={loading}>Add Bundle</Btn>
      </div>
    </>
  );
}

// ─── CSV Upload Form for Bundle Paper ─────────────────────────────────────────
function BundlePaperCSVForm({ bundleId, onSave, onClose, loading }) {
  const [title, setTitle] = useState('');
  const [csvFile, setCsvFile] = useState(null);

  const submit = () => {
    if (!title || !csvFile) return;
    const fd = new FormData();
    fd.append('title', title);
    fd.append('file', csvFile);
    onSave(bundleId, fd);
  };

  return (
    <>
      <Input label="Test Paper Title" value={title} onChange={e => setTitle(e.target.value)} required placeholder="e.g. Practice Test 1" />
      <div style={{ marginBottom: 10, padding: '10px 14px', borderRadius: 8, background: 'rgba(99,102,241,0.08)', border: `1px solid rgba(99,102,241,0.2)` }}>
        <p style={{ margin: 0, fontSize: 12, color: C.textMuted }}>CSV format: <code style={{ color: C.accent }}>question, option_a, option_b, option_c, option_d, correct_answer, difficulty</code></p>
      </div>
      <label style={{ display: 'block', border: `2px dashed ${csvFile ? C.success : C.border}`, borderRadius: 10, padding: '22px', textAlign: 'center', cursor: 'pointer', background: '#0f0f18' }}>
        <input type="file" accept=".csv" style={{ display: 'none' }} onChange={e => setCsvFile(e.target.files[0])} />
        <div style={{ fontSize: 28, marginBottom: 8 }}>{csvFile ? '✅' : '📤'}</div>
        <p style={{ margin: 0, color: csvFile ? C.success : C.textMuted, fontSize: 13 }}>{csvFile ? csvFile.name : 'Click to upload CSV file'}</p>
      </label>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 16 }}>
        <Btn variant="ghost" onClick={onClose}>Cancel</Btn>
        <Btn onClick={submit} loading={loading} disabled={!title || !csvFile}>Upload Test Paper</Btn>
      </div>
    </>
  );
}

// ─── Bundle Detail View ────────────────────────────────────────────────────────
function BundleDetail({ bundle, onBack, onAddPaper, onDeletePaper, saving }) {
  return (
    <div>
      <button onClick={onBack} style={{ background: 'none', border: 'none', color: C.accent, cursor: 'pointer', fontSize: 13, padding: '0 0 16px', display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'inherit', fontWeight: 600 }}>
        ← Back to Paid Bundles
      </button>

      <Card style={{ padding: 20, marginBottom: 18 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ margin: '0 0 4px', color: C.text, fontSize: 18, fontWeight: 700 }}>{bundle.title}</h3>
            <p style={{ margin: 0, color: C.textMuted, fontSize: 13 }}>{bundle.description}</p>
            <div style={{ marginTop: 6, color: C.text, fontWeight: 700 }}>₹{bundle.price?.toLocaleString('en-IN')}</div>
          </div>
          <Btn size="sm" onClick={onAddPaper}>➕ Add Test Paper (CSV)</Btn>
        </div>
      </Card>

      <h4 style={{ color: C.text, marginBottom: 12 }}>Test Papers ({bundle.test_papers?.length || 0})</h4>

      {(!bundle.test_papers || bundle.test_papers.length === 0) ? (
        <Card style={{ padding: 0 }}><Empty icon="📄" text="No test papers yet. Upload a CSV to add." /></Card>
      ) : (
        <Table headers={['#', 'Title', 'Questions', 'Actions']}>
          {bundle.test_papers.map((p, i) => (
            <TR key={p.id}>
              <TD muted>{i + 1}</TD>
              <TD><span style={{ fontWeight: 600, color: C.text }}>{p.title}</span></TD>
              <TD muted>{p.total_questions} questions</TD>
              <TD>
                <Btn size="sm" variant="danger" onClick={() => onDeletePaper(bundle._id, p.id)}>Del</Btn>
              </TD>
            </TR>
          ))}
        </Table>
      )}
    </div>
  );
}

// ─── Tests Table ───────────────────────────────────────────────────────────────
function TestsTable({ tests, onDelete, loading }) {
  if (loading) return <Spinner center />;
  if (tests.length === 0) return (
    <Card style={{ padding: 0 }}><Empty icon="🧪" text="No free assessment tests yet. Add your first test." /></Card>
  );
  return (
    <Table headers={['#', 'Title', 'Questions', 'Duration', 'Actions']}>
      {tests.map((t, i) => (
        <TR key={t._id}>
          <TD muted>{i + 1}</TD>
          <TD><span style={{ fontWeight: 600, color: C.text }}>{t.title}</span></TD>
          <TD muted>{t.total_questions} questions</TD>
          <TD muted>{t.duration_minutes} min</TD>
          <TD><Btn size="sm" variant="danger" onClick={() => onDelete(t._id)}>Del</Btn></TD>
        </TR>
      ))}
    </Table>
  );
}

// ─── Bundles Table ─────────────────────────────────────────────────────────────
function BundlesTable({ bundles, onView, onDelete, loading }) {
  if (loading) return <Spinner center />;
  if (bundles.length === 0) return (
    <Card style={{ padding: 0 }}><Empty icon="📦" text="No bundles yet. Add your first bundle." /></Card>
  );
  return (
    <Table headers={['#', 'Title', 'Description', 'Price', 'Test Papers', 'Actions']}>
      {bundles.map((b, i) => (
        <TR key={b._id}>
          <TD muted>{i + 1}</TD>
          <TD><span style={{ fontWeight: 600, color: C.text }}>{b.title}</span></TD>
          <TD muted>{b.description || '—'}</TD>
          <TD muted>₹{b.price?.toLocaleString('en-IN')}</TD>
          <TD muted>{b.testPaperCount} papers</TD>
          <TD>
            <div style={{ display: 'flex', gap: 6 }}>
              <Btn size="sm" variant="ghost" onClick={() => onView(b)}>View →</Btn>
              <Btn size="sm" variant="danger" onClick={() => onDelete(b._id)}>Del</Btn>
            </div>
          </TD>
        </TR>
      ))}
    </Table>
  );
}

// ─── Main CourseDetail ─────────────────────────────────────────────────────────
export default function CourseDetail({ course: initialCourse, onBack }) {
  const [data, setData] = useState(null);
  const [tests, setTests] = useState([]);
  const [bundles, setBundles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('free');
  const [selectedBundle, setSelectedBundle] = useState(null);

  const [testModal, setTestModal] = useState(false);
  const [bundleModal, setBundleModal] = useState(false);
  const [bundlePaperModal, setBundlePaperModal] = useState(false);

  const [confirmDelTest, setConfirmDelTest] = useState(null);
  const [confirmDelBundle, setConfirmDelBundle] = useState(null);
  const [saving, setSaving] = useState(false);
  const { toasts, add: toast } = useToast();

  const load = () => {
    setLoading(true);
    Promise.all([
      coursesAPI.getOne(initialCourse._id),
      testsAPI.getBycourse(initialCourse._id),
      bundlesAPI.getByCourse(initialCourse._id),
    ])
      .then(([courseRes, testsRes, bundlesRes]) => {
        setData(courseRes.data.data);
        setTests(testsRes.data.data || []);
        setBundles(bundlesRes.data.data || []);
      })
      .catch(() => toast('Failed to load course details', 'danger'))
      .finally(() => setLoading(false));
  };

  useEffect(load, [initialCourse._id]);

  const handleSaveTest = async (formData, mode) => {
    setSaving(true);
    try {
      if (mode === 'csv') {
        await testsAPI.uploadCSV(formData);
      } else {
        await testsAPI.create(formData);
      }
      toast('Test added successfully');
      setTestModal(false);
      load();
    } catch (err) {
      toast(err.response?.data?.detail || 'Error saving test', 'danger');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveBundle = async (fd) => {
    setSaving(true);
    try {
      await bundlesAPI.create(fd);
      toast('Bundle added successfully');
      setBundleModal(false);
      load();
    } catch (err) {
      toast(err.response?.data?.detail || 'Error saving bundle', 'danger');
    } finally {
      setSaving(false);
    }
  };

  const handleAddBundlePaper = async (bundleId, fd) => {
    setSaving(true);
    try {
      await bundlesAPI.uploadCSV(bundleId, fd);
      toast('Test paper added successfully');
      setBundlePaperModal(false);
      // Refresh selected bundle
      const res = await bundlesAPI.getOne(selectedBundle._id);
      setSelectedBundle(res.data.data);
      load();
    } catch (err) {
      toast(err.response?.data?.detail || 'Error uploading test paper', 'danger');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteBundlePaper = async (bundleId, paperId) => {
    try {
      await bundlesAPI.deletePaper(bundleId, paperId);
      toast('Paper deleted', 'danger');
      const res = await bundlesAPI.getOne(selectedBundle._id);
      setSelectedBundle(res.data.data);
      load();
    } catch {
      toast('Failed to delete paper', 'danger');
    }
  };

  const handleDeleteTest = async () => {
    try {
      await testsAPI.delete(confirmDelTest);
      toast('Test deleted', 'danger');
      setConfirmDelTest(null);
      load();
    } catch {
      toast('Failed to delete test', 'danger');
    }
  };

  const handleDeleteBundle = async () => {
    try {
      await bundlesAPI.delete(confirmDelBundle);
      toast('Bundle deleted', 'danger');
      setConfirmDelBundle(null);
      load();
    } catch {
      toast('Failed to delete bundle', 'danger');
    }
  };

  const handleViewBundle = async (bundle) => {
    try {
      const res = await bundlesAPI.getOne(bundle._id);
      setSelectedBundle(res.data.data);
    } catch {
      toast('Failed to load bundle', 'danger');
    }
  };

  const course = data?.course || initialCourse;
  const enrollments = data?.enrollments || [];

  const tabStyle = (tab) => ({
    padding: '8px 22px', borderRadius: 8, border: 'none', cursor: 'pointer',
    fontFamily: 'inherit', fontSize: 13, fontWeight: 600,
    background: activeTab === tab ? C.accent : 'transparent',
    color: activeTab === tab ? '#fff' : C.textMuted,
    transition: 'all 0.15s',
  });

  // If a bundle is selected, show bundle detail
  if (selectedBundle) {
    return (
      <div>
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: C.accent, cursor: 'pointer', fontSize: 13, padding: '0 0 8px', display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'inherit', fontWeight: 600 }}>
          ← Back to Courses
        </button>
        <BundleDetail
          bundle={selectedBundle}
          onBack={() => setSelectedBundle(null)}
          onAddPaper={() => setBundlePaperModal(true)}
          onDeletePaper={handleDeleteBundlePaper}
          saving={saving}
        />
        <Modal open={bundlePaperModal} onClose={() => setBundlePaperModal(false)} title="Add Test Paper (CSV)">
          <BundlePaperCSVForm
            bundleId={selectedBundle._id}
            onSave={handleAddBundlePaper}
            onClose={() => setBundlePaperModal(false)}
            loading={saving}
          />
        </Modal>
        <Toast toasts={toasts} />
      </div>
    );
  }

  return (
    <div>
      <button onClick={onBack} style={{ background: 'none', border: 'none', color: C.accent, cursor: 'pointer', fontSize: 13, padding: '0 0 20px', display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'inherit', fontWeight: 600 }}>
        ← Back to Courses
      </button>

      {/* Course header */}
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
            {[['₹' + course.price, 'Price'], [tests.length, 'Free Tests'], [bundles.length, 'Bundles'], [enrollments.length, 'Enrolled']].map(([v, l]) => (
              <div key={l} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: C.text, fontFamily: 'Georgia, serif' }}>{v}</div>
                <div style={{ fontSize: 11, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
        <div style={{ display: 'flex', gap: 6, background: '#0f0f18', padding: 4, borderRadius: 10, border: `1px solid ${C.border}` }}>
          <button style={tabStyle('free')} onClick={() => setActiveTab('free')}>
            🎁 Free Assessment ({tests.length})
          </button>
          <button style={tabStyle('paid')} onClick={() => setActiveTab('paid')}>
            💳 Paid Bundles ({bundles.length})
          </button>
        </div>
        <Btn size="sm" onClick={() => activeTab === 'free' ? setTestModal(true) : setBundleModal(true)}>
          ➕ Add {activeTab === 'free' ? 'Free Test' : 'Bundle'}
        </Btn>
      </div>

      {/* Tab description */}
      <div style={{ marginBottom: 16, padding: '10px 14px', borderRadius: 8, background: activeTab === 'free' ? 'rgba(99,102,241,0.08)' : 'rgba(234,88,12,0.08)', border: `1px solid ${activeTab === 'free' ? 'rgba(99,102,241,0.2)' : 'rgba(234,88,12,0.2)'}` }}>
        <p style={{ margin: 0, fontSize: 12, color: C.textMuted }}>
          {activeTab === 'free'
            ? '🎁 Free Assessment — Students can take these tests without payment.'
            : '💳 Paid Bundles — Click View to manage test papers inside each bundle.'}
        </p>
      </div>

      {/* Content */}
      {activeTab === 'free' ? (
        <TestsTable tests={tests} onDelete={(id) => setConfirmDelTest(id)} loading={loading} />
      ) : (
        <BundlesTable bundles={bundles} onView={handleViewBundle} onDelete={(id) => setConfirmDelBundle(id)} loading={loading} />
      )}

      {/* Enrolled Students */}
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

      {/* Free Test Modal */}
      <Modal open={testModal} onClose={() => setTestModal(false)} title="Add Free Assessment Test">
        <TestForm courseId={course._id} onSave={handleSaveTest} onClose={() => setTestModal(false)} loading={saving} />
      </Modal>

      {/* Bundle Modal */}
      <Modal open={bundleModal} onClose={() => setBundleModal(false)} title="Add New Bundle">
        <BundleForm courseId={course._id} onSave={handleSaveBundle} onClose={() => setBundleModal(false)} loading={saving} />
      </Modal>

      <Confirm open={!!confirmDelTest} onClose={() => setConfirmDelTest(null)} onConfirm={handleDeleteTest} message="Delete this free assessment test permanently?" />
      <Confirm open={!!confirmDelBundle} onClose={() => setConfirmDelBundle(null)} onConfirm={handleDeleteBundle} message="Delete this bundle permanently?" />

      <Toast toasts={toasts} />
    </div>
  );
}





// import { useState, useEffect } from 'react';
// import { coursesAPI, papersAPI, testsAPI } from '../api';
// import { C, Btn, Badge, Modal, Input, Textarea, Confirm, Spinner, Empty, Card, Table, TR, TD, useToast, Toast } from '../components/UI';

// // ─── Paid Paper Form ───────────────────────────────────────────────────────────
// function PaperForm({ initial, courseId, paperType, onSave, onClose, loading }) {
//   const [form, setForm] = useState(initial || { title: '', description: '', visible: true, price: 0, points: '' });
//   const [file, setFile] = useState(null);
//   const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

//   const submit = () => {
//     if (!form.title) return;
//     const fd = new FormData();
//     fd.append('title', form.title);
//     fd.append('description', form.description);
//     fd.append('visible', form.visible);
//     fd.append('type', paperType);
//     fd.append('price', form.price || 0);
//     fd.append('points', form.points || '');
//     if (!initial) fd.append('course', courseId);
//     if (file) fd.append('paper', file);
//     onSave(fd);
//   };

//   return (
//     <>
//       <Input label="Paper Title" value={form.title} onChange={e => set('title', e.target.value)} required />
//       <Textarea label="Description" value={form.description} onChange={e => set('description', e.target.value)} rows={2} />
//       {paperType === 'paid' && (
//         <>
//           <Input label="Price (₹)" type="number" value={form.price} onChange={e => set('price', e.target.value)} />
//           <Input label="Key Points (comma separated)" value={form.points} onChange={e => set('points', e.target.value)} placeholder="e.g. Timed practice sets, Step-by-step solutions" />
//         </>
//       )}
//       <div style={{ marginBottom: 16 }}>
//         <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '10px 12px', background: '#0f0f18', border: `1px solid ${C.border}`, borderRadius: 8 }}>
//           <input type="checkbox" checked={form.visible} onChange={e => set('visible', e.target.checked)} style={{ accentColor: C.accent, width: 16, height: 16 }} />
//           <span style={{ color: C.textMuted, fontSize: 13 }}>Visible to enrolled students</span>
//         </label>
//       </div>
//       <div style={{ marginBottom: 20 }}>
//         <label style={{ display: 'block', color: C.textMuted, fontSize: 11, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 600 }}>Upload PDF / Document</label>
//         <label style={{ display: 'block', border: `2px dashed ${file ? C.success : C.border}`, borderRadius: 10, padding: '22px', textAlign: 'center', cursor: 'pointer', background: '#0f0f18' }}>
//           <input type="file" accept=".pdf,.doc,.docx" style={{ display: 'none' }} onChange={e => setFile(e.target.files[0])} />
//           <div style={{ fontSize: 28, marginBottom: 8 }}>{file ? '✅' : '📤'}</div>
//           <p style={{ margin: 0, color: file ? C.success : C.textMuted, fontSize: 13 }}>{file ? file.name : 'Click to upload PDF or Word document'}</p>
//           {!file && <p style={{ margin: '4px 0 0', color: C.textDim, fontSize: 11 }}>Max 50MB</p>}
//         </label>
//       </div>
//       <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
//         <Btn variant="ghost" onClick={onClose}>Cancel</Btn>
//         <Btn onClick={submit} loading={loading}>{initial ? 'Save Changes' : 'Add Paper'}</Btn>
//       </div>
//     </>
//   );
// }

// // ─── Question Form ─────────────────────────────────────────────────────────────
// function QuestionForm({ question, index, onChange, onRemove }) {
//   const setQ = (k, v) => onChange(index, { ...question, [k]: v });
//   const setOption = (i, v) => {
//     const opts = [...question.options];
//     opts[i] = { ...opts[i], text: v };
//     onChange(index, { ...question, options: opts });
//   };

//   return (
//     <div style={{ border: `1px solid ${C.border}`, borderRadius: 10, padding: 16, marginBottom: 14, background: '#0a0a14' }}>
//       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
//         <span style={{ color: C.textMuted, fontSize: 12, fontWeight: 700 }}>QUESTION {index + 1}</span>
//         <Btn size="sm" variant="danger" onClick={() => onRemove(index)}>Remove</Btn>
//       </div>
//       <Textarea
//         label="Question Text"
//         value={question.text}
//         onChange={e => setQ('text', e.target.value)}
//         rows={2}
//       />
//       <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 }}>
//         {question.options.map((opt, i) => (
//           <div key={opt.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
//             <span style={{ color: C.accent, fontWeight: 700, fontSize: 13, minWidth: 18 }}>{opt.id}.</span>
//             <input
//               value={opt.text}
//               onChange={e => setOption(i, e.target.value)}
//               placeholder={`Option ${opt.id}`}
//               style={{ flex: 1, background: '#0f0f18', border: `1px solid ${C.border}`, borderRadius: 6, padding: '7px 10px', color: C.text, fontSize: 13, fontFamily: 'inherit' }}
//             />
//           </div>
//         ))}
//       </div>
//       <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
//         <label style={{ color: C.textMuted, fontSize: 12, fontWeight: 600 }}>CORRECT ANSWER:</label>
//         <div style={{ display: 'flex', gap: 6 }}>
//           {question.options.map(opt => (
//             <button
//               key={opt.id}
//               onClick={() => setQ('correctAnswer', opt.id)}
//               style={{
//                 width: 32, height: 32, borderRadius: 6, border: `1px solid ${question.correctAnswer === opt.id ? C.success : C.border}`,
//                 background: question.correctAnswer === opt.id ? C.success : 'transparent',
//                 color: question.correctAnswer === opt.id ? '#fff' : C.textMuted,
//                 fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit'
//               }}
//             >{opt.id}</button>
//           ))}
//         </div>
//         <select
//           value={question.difficulty}
//           onChange={e => setQ('difficulty', e.target.value)}
//           style={{ marginLeft: 'auto', background: '#0f0f18', border: `1px solid ${C.border}`, borderRadius: 6, padding: '6px 10px', color: C.textMuted, fontSize: 12, fontFamily: 'inherit' }}
//         >
//           <option value="easy">Easy</option>
//           <option value="medium">Medium</option>
//           <option value="hard">Hard</option>
//           <option value="intense">Intense</option>
//         </select>
//       </div>
//     </div>
//   );
// }

// // ─── Test Form ─────────────────────────────────────────────────────────────────
// function TestForm({ courseId, onSave, onClose, loading }) {
//   const [form, setForm] = useState({ title: '', description: '', duration_minutes: 45 });
//   const [questions, setQuestions] = useState([]);
//   const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

//   const addQuestion = () => {
//     setQuestions(qs => [...qs, {
//       text: '',
//       topic: 'General',
//       difficulty: 'easy',
//       options: [
//         { id: 'A', text: '' },
//         { id: 'B', text: '' },
//         { id: 'C', text: '' },
//         { id: 'D', text: '' },
//       ],
//       correctAnswer: 'A',
//     }]);
//   };

//   const updateQuestion = (index, updated) => {
//     setQuestions(qs => qs.map((q, i) => i === index ? updated : q));
//   };

//   const removeQuestion = (index) => {
//     setQuestions(qs => qs.filter((_, i) => i !== index));
//   };

//   const submit = () => {
//     if (!form.title || questions.length === 0) return;
//     onSave({
//       course_id: courseId,
//       title: form.title,
//       description: form.description,
//       duration_minutes: Number(form.duration_minutes),
//       is_free: true,
//       questions,
//     });
//   };

//   return (
//     <div style={{ maxHeight: '75vh', overflowY: 'auto', paddingRight: 4 }}>
//       <Input label="Test Title" value={form.title} onChange={e => set('title', e.target.value)} required />
//       <Textarea label="Description" value={form.description} onChange={e => set('description', e.target.value)} rows={2} />
//       <Input label="Duration (minutes)" type="number" value={form.duration_minutes} onChange={e => set('duration_minutes', e.target.value)} />

//       <div style={{ margin: '18px 0 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//         <span style={{ color: C.text, fontWeight: 700, fontSize: 14 }}>Questions ({questions.length})</span>
//         <Btn size="sm" onClick={addQuestion}>+ Add Question</Btn>
//       </div>

//       {questions.length === 0 && (
//         <div style={{ textAlign: 'center', padding: '20px', color: C.textMuted, fontSize: 13 }}>
//           No questions yet. Click "Add Question" to start.
//         </div>
//       )}

//       {questions.map((q, i) => (
//         <QuestionForm key={i} question={q} index={i} onChange={updateQuestion} onRemove={removeQuestion} />
//       ))}

//       <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 16 }}>
//         <Btn variant="ghost" onClick={onClose}>Cancel</Btn>
//         <Btn onClick={submit} loading={loading} disabled={!form.title || questions.length === 0}>
//           Save Test ({questions.length} questions)
//         </Btn>
//       </div>
//     </div>
//   );
// }

// // ─── Papers Table ──────────────────────────────────────────────────────────────
// function PapersTable({ papers, onEdit, onToggle, onDelete, loading }) {
//   if (loading) return <Spinner center />;
//   if (papers.length === 0) return (
//     <Card style={{ padding: 0 }}><Empty icon="📄" text="No test papers yet. Add your first paper." /></Card>
//   );
//   return (
//     <Table headers={['#', 'Title', 'Description', 'Uploaded', 'File', 'Visibility', 'Actions']}>
//       {papers.map((p, i) => (
//         <TR key={p._id}>
//           <TD muted>{i + 1}</TD>
//           <TD><span style={{ fontWeight: 600, color: C.text }}>{p.title}</span></TD>
//           <TD muted>{p.description || '—'}</TD>
//           <TD muted>{new Date(p.createdAt).toLocaleDateString()}</TD>
//           <TD>
//             {p.fileUrl
//               ? <a href={p.fileUrl} target="_blank" rel="noreferrer" style={{ color: C.accent, fontSize: 12, textDecoration: 'none' }}>📎 {p.fileName || 'Download'}</a>
//               : <span style={{ color: C.textDim, fontSize: 12 }}>No file</span>}
//           </TD>
//           <TD><Badge type={p.visible ? 'visible' : 'hidden'}>{p.visible ? 'visible' : 'hidden'}</Badge></TD>
//           <TD>
//             <div style={{ display: 'flex', gap: 6 }}>
//               <Btn size="sm" variant="ghost" onClick={() => onEdit(p)}>Edit</Btn>
//               <Btn size="sm" variant="ghost" onClick={() => onToggle(p._id)}>{p.visible ? 'Hide' : 'Show'}</Btn>
//               <Btn size="sm" variant="danger" onClick={() => onDelete(p._id)}>Del</Btn>
//             </div>
//           </TD>
//         </TR>
//       ))}
//     </Table>
//   );
// }

// // ─── Tests Table ───────────────────────────────────────────────────────────────
// function TestsTable({ tests, onDelete, loading }) {
//   if (loading) return <Spinner center />;
//   if (tests.length === 0) return (
//     <Card style={{ padding: 0 }}><Empty icon="🧪" text="No free assessment tests yet. Add your first test." /></Card>
//   );
//   return (
//     <Table headers={['#', 'Title', 'Description', 'Questions', 'Duration', 'Actions']}>
//       {tests.map((t, i) => (
//         <TR key={t._id}>
//           <TD muted>{i + 1}</TD>
//           <TD><span style={{ fontWeight: 600, color: C.text }}>{t.title}</span></TD>
//           <TD muted>{t.description || '—'}</TD>
//           <TD muted>{t.total_questions} questions</TD>
//           <TD muted>{t.duration_minutes} min</TD>
//           <TD>
//             <Btn size="sm" variant="danger" onClick={() => onDelete(t._id)}>Del</Btn>
//           </TD>
//         </TR>
//       ))}
//     </Table>
//   );
// }

// // ─── Main CourseDetail ─────────────────────────────────────────────────────────
// export default function CourseDetail({ course: initialCourse, onBack }) {
//   const [data, setData] = useState(null);
//   const [tests, setTests] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState('free');
//   const [paperModal, setPaperModal] = useState(false);
//   const [testModal, setTestModal] = useState(false);
//   const [editingPaper, setEditingPaper] = useState(null);
//   const [confirmDel, setConfirmDel] = useState(null);
//   const [confirmDelTest, setConfirmDelTest] = useState(null);
//   const [saving, setSaving] = useState(false);
//   const { toasts, add: toast } = useToast();

//   const load = () => {
//     setLoading(true);
//     Promise.all([
//       coursesAPI.getOne(initialCourse._id),
//       testsAPI.getBycourse(initialCourse._id),
//     ])
//       .then(([courseRes, testsRes]) => {
//         setData(courseRes.data.data);
//         setTests(testsRes.data.data || []);
//       })
//       .catch(() => toast('Failed to load course details', 'danger'))
//       .finally(() => setLoading(false));
//   };

//   useEffect(load, [initialCourse._id]);

//   const openAdd = () => { setEditingPaper(null); setPaperModal(true); };
//   const openEdit = (p) => {
//     setEditingPaper({ ...p, price: p.price || 0, points: (p.points || []).join(', ') });
//     setPaperModal(true);
//   };

//   const handleSavePaper = async (fd) => {
//     setSaving(true);
//     try {
//       if (editingPaper) {
//         await papersAPI.update(editingPaper._id, fd);
//         toast('Paper updated');
//       } else {
//         await papersAPI.create(fd);
//         toast('Paper added successfully');
//       }
//       setPaperModal(false);
//       load();
//     } catch (err) {
//       toast(err.response?.data?.message || 'Error saving paper', 'danger');
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleSaveTest = async (testData) => {
//     setSaving(true);
//     try {
//       await testsAPI.create(testData);
//       toast('Test added successfully');
//       setTestModal(false);
//       load();
//     } catch (err) {
//       toast(err.response?.data?.message || 'Error saving test', 'danger');
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleDeletePaper = async () => {
//     try {
//       await papersAPI.delete(confirmDel);
//       toast('Paper deleted', 'danger');
//       setConfirmDel(null);
//       load();
//     } catch {
//       toast('Failed to delete paper', 'danger');
//     }
//   };

//   const handleDeleteTest = async () => {
//     try {
//       await testsAPI.delete(confirmDelTest);
//       toast('Test deleted', 'danger');
//       setConfirmDelTest(null);
//       load();
//     } catch {
//       toast('Failed to delete test', 'danger');
//     }
//   };

//   const handleToggleVisibility = async (id) => {
//     try {
//       await papersAPI.toggleVisibility(id);
//       toast('Visibility updated');
//       load();
//     } catch {
//       toast('Failed to update visibility', 'danger');
//     }
//   };

//   const course = data?.course || initialCourse;
//   const papers = data?.papers || [];
//   const enrollments = data?.enrollments || [];
//   const freePapers = papers.filter(p => p.type === 'free' || !p.type);
//   const paidPapers = papers.filter(p => p.type === 'paid');

//   const tabStyle = (tab) => ({
//     padding: '8px 22px', borderRadius: 8, border: 'none', cursor: 'pointer',
//     fontFamily: 'inherit', fontSize: 13, fontWeight: 600,
//     background: activeTab === tab ? C.accent : 'transparent',
//     color: activeTab === tab ? '#fff' : C.textMuted,
//     transition: 'all 0.15s',
//   });

//   return (
//     <div>
//       <button onClick={onBack} style={{ background: 'none', border: 'none', color: C.accent, cursor: 'pointer', fontSize: 13, padding: '0 0 20px', display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'inherit', fontWeight: 600 }}>
//         ← Back to Courses
//       </button>

//       {/* Course header */}
//       <Card style={{ padding: 24, marginBottom: 22 }}>
//         <div style={{ display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap' }}>
//           <div style={{ width: 58, height: 58, borderRadius: 14, background: course.color || C.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 22, fontFamily: 'Georgia, serif', flexShrink: 0 }}>
//             {course.title?.slice(0, 2).toUpperCase()}
//           </div>
//           <div style={{ flex: 1, minWidth: 0 }}>
//             <h2 style={{ margin: '0 0 5px', color: C.text, fontFamily: 'Georgia, serif', fontSize: 20, fontWeight: 700 }}>{course.title}</h2>
//             <p style={{ margin: 0, color: C.textMuted, fontSize: 13 }}>{course.description}</p>
//             <div style={{ marginTop: 8 }}><Badge type={course.status}>{course.status}</Badge></div>
//           </div>
//           <div style={{ display: 'flex', gap: 28, flexShrink: 0 }}>
//             {[['₹' + course.price, 'Price'], [tests.length, 'Free Tests'], [paidPapers.length, 'Paid'], [enrollments.length, 'Enrolled']].map(([v, l]) => (
//               <div key={l} style={{ textAlign: 'center' }}>
//                 <div style={{ fontSize: 22, fontWeight: 800, color: C.text, fontFamily: 'Georgia, serif' }}>{v}</div>
//                 <div style={{ fontSize: 11, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{l}</div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </Card>

//       {/* Tabs */}
//       <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
//         <div style={{ display: 'flex', gap: 6, background: '#0f0f18', padding: 4, borderRadius: 10, border: `1px solid ${C.border}` }}>
//           <button style={tabStyle('free')} onClick={() => setActiveTab('free')}>
//             🎁 Free Assessment ({tests.length})
//           </button>
//           <button style={tabStyle('paid')} onClick={() => setActiveTab('paid')}>
//             💳 Paid Tests ({paidPapers.length})
//           </button>
//         </div>
//         <Btn size="sm" onClick={() => activeTab === 'free' ? setTestModal(true) : openAdd()}>
//           ➕ Add {activeTab === 'free' ? 'Free Test' : 'Paid Test'}
//         </Btn>
//       </div>

//       {/* Tab description */}
//       <div style={{ marginBottom: 16, padding: '10px 14px', borderRadius: 8, background: activeTab === 'free' ? 'rgba(99,102,241,0.08)' : 'rgba(234,88,12,0.08)', border: `1px solid ${activeTab === 'free' ? 'rgba(99,102,241,0.2)' : 'rgba(234,88,12,0.2)'}` }}>
//         <p style={{ margin: 0, fontSize: 12, color: C.textMuted }}>
//           {activeTab === 'free'
//             ? '🎁 Free Assessment — Students can access these tests without payment. Each test has questions with options.'
//             : '💳 Paid Tests — Only enrolled & paid students can access these tests.'}
//         </p>
//       </div>

//       {/* Content */}
//       {activeTab === 'free' ? (
//         <TestsTable
//           tests={tests}
//           onDelete={(id) => setConfirmDelTest(id)}
//           loading={loading}
//         />
//       ) : (
//         <PapersTable
//           papers={paidPapers}
//           onEdit={openEdit}
//           onToggle={handleToggleVisibility}
//           onDelete={(id) => setConfirmDel(id)}
//           loading={loading}
//         />
//       )}

//       {/* Enrolled Students */}
//       {enrollments.length > 0 && (
//         <div style={{ marginTop: 22 }}>
//           <h3 style={{ margin: '0 0 14px', color: C.text, fontFamily: 'Georgia, serif', fontSize: 17 }}>Enrolled Students ({enrollments.length})</h3>
//           <Table headers={['Student', 'Email', 'Phone', 'Payment', 'Date']}>
//             {enrollments.slice(0, 8).map(e => (
//               <TR key={e._id}>
//                 <TD><span style={{ fontWeight: 600 }}>{e.studentName}</span></TD>
//                 <TD muted>{e.email}</TD>
//                 <TD muted>{e.phone}</TD>
//                 <TD><Badge type={e.paymentStatus}>{e.paymentStatus}</Badge></TD>
//                 <TD muted>{new Date(e.createdAt).toLocaleDateString()}</TD>
//               </TR>
//             ))}
//           </Table>
//         </div>
//       )}

//       {/* Paid Paper Modal */}
//       <Modal open={paperModal} onClose={() => setPaperModal(false)} title={editingPaper ? 'Edit Paid Test' : 'Add Paid Test'}>
//         <PaperForm
//           initial={editingPaper ? { title: editingPaper.title, description: editingPaper.description, visible: editingPaper.visible, price: editingPaper.price, points: editingPaper.points } : null}
//           courseId={course._id}
//           paperType="paid"
//           onSave={handleSavePaper}
//           onClose={() => setPaperModal(false)}
//           loading={saving}
//         />
//       </Modal>

//       {/* Free Test Modal */}
//       <Modal open={testModal} onClose={() => setTestModal(false)} title="Add Free Assessment Test">
//         <TestForm
//           courseId={course._id}
//           onSave={handleSaveTest}
//           onClose={() => setTestModal(false)}
//           loading={saving}
//         />
//       </Modal>

//       <Confirm open={!!confirmDel} onClose={() => setConfirmDel(null)} onConfirm={handleDeletePaper} message="Delete this paid test permanently?" />
//       <Confirm open={!!confirmDelTest} onClose={() => setConfirmDelTest(null)} onConfirm={handleDeleteTest} message="Delete this free assessment test permanently?" />

//       <Toast toasts={toasts} />
//     </div>
//   );
// }




