import { useState, useEffect } from 'react';
import { papersAPI } from '../api';
import { C, Badge, Spinner, Empty, Table, TR, TD, PageHeader, Card, useToast, Toast } from '../components/UI';

export default function Papers() {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toasts, add: toast } = useToast();

  const load = () => {
    setLoading(true);
    papersAPI.getAll()
      .then(res => setPapers(res.data.data))
      .catch(() => toast('Failed to load papers', 'danger'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleToggle = async (id) => {
    try {
      await papersAPI.toggleVisibility(id);
      toast('Visibility updated');
      load();
    } catch { toast('Failed to update', 'danger'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this test paper?')) return;
    try {
      await papersAPI.delete(id);
      toast('Paper deleted', 'danger');
      load();
    } catch { toast('Failed to delete', 'danger'); }
  };

  return (
    <div>
      <PageHeader title="All Test Papers" subtitle={`${papers.length} papers across all courses`} />
      <div style={{ background: '#1a1a2e', border: `1px solid #252545`, borderRadius: 10, padding: '12px 16px', marginBottom: 18, display: 'flex', gap: 8, alignItems: 'center' }}>
        <span style={{ fontSize: 16 }}>ℹ️</span>
        <span style={{ color: C.textMuted, fontSize: 13 }}>To add or edit papers, navigate to <strong style={{ color: C.text }}>Courses</strong> → click a course → manage its papers from there.</span>
      </div>
      {loading ? <Spinner center /> : papers.length === 0 ? (
        <Card style={{ padding: 0 }}><Empty icon="📋" text="No test papers found." /></Card>
      ) : (
        <Table headers={['Title', 'Course', 'Description', 'File', 'Visibility', 'Date', 'Actions']}>
          {papers.map(p => (
            <TR key={p._id}>
              <TD><span style={{ fontWeight: 600 }}>{p.title}</span></TD>
              <TD>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: p.course?.color || C.accent, flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: C.textMuted }}>{p.course?.title || '—'}</span>
                </div>
              </TD>
              <TD muted>{p.description || '—'}</TD>
              <TD>
                {p.fileUrl
                  ? <a href={p.fileUrl} target="_blank" rel="noreferrer" style={{ color: C.accent, fontSize: 12, textDecoration: 'none' }}>📎 Download</a>
                  : <span style={{ color: C.textDim, fontSize: 12 }}>No file</span>}
              </TD>
              <TD><Badge type={p.visible ? 'visible' : 'hidden'}>{p.visible ? 'visible' : 'hidden'}</Badge></TD>
              <TD muted>{new Date(p.createdAt).toLocaleDateString()}</TD>
              <TD>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => handleToggle(p._id)}
                    style={{ background: 'transparent', border: `1px solid ${C.border}`, borderRadius: 6, padding: '4px 10px', color: C.textMuted, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>
                    {p.visible ? 'Hide' : 'Show'}
                  </button>
                  <button onClick={() => handleDelete(p._id)}
                    style={{ background: '#2a1418', border: '1px solid #3a1c22', borderRadius: 6, padding: '4px 10px', color: C.danger, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>
                    Del
                  </button>
                </div>
              </TD>
            </TR>
          ))}
        </Table>
      )}
      <Toast toasts={toasts} />
    </div>
  );
}
