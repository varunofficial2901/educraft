import { useState, useEffect } from 'react';
import { studentsAPI } from '../api';
import { C, Badge, Spinner, Empty, Table, TR, TD, SearchBar, PageHeader, Avatar, Card, useToast, Toast } from '../components/UI';

export default function Students() {
  const [courses, setCourses] = useState([]);
  const [selected, setSelected] = useState(null);
  const [students, setStudents] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, pages: 1, page: 1 });
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const { toasts, add: toast } = useToast();

  useEffect(() => {
    studentsAPI.getCourses()
      .then(res => setCourses(res.data.data))
      .catch(() => toast('Failed to load courses', 'danger'))
      .finally(() => setLoadingCourses(false));
  }, []);

  useEffect(() => {
    if (!selected) return;
    setLoadingStudents(true);
    studentsAPI.getByCourse(selected._id, { search, page, limit: 10 })
      .then(res => { setStudents(res.data.data); setPagination(res.data.pagination); })
      .catch(() => toast('Failed to load students', 'danger'))
      .finally(() => setLoadingStudents(false));
  }, [selected, search, page]);

  const selectCourse = (c) => { setSelected(c); setSearch(''); setPage(1); };

  return (
    <div>
      <PageHeader title="Students" subtitle="Select a course to view enrolled students" />

      {loadingCourses ? <Spinner center /> : (
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 24 }}>
          {courses.map(c => (
            <button key={c._id} onClick={() => selectCourse(c)}
              style={{ background: selected?._id === c._id ? C.accent : C.card, border: `1px solid ${selected?._id === c._id ? C.accent : C.border}`, borderRadius: 10, padding: '9px 16px', cursor: 'pointer', color: selected?._id === c._id ? '#fff' : C.textMuted, fontSize: 13, fontFamily: 'inherit', transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontWeight: 600, color: selected?._id === c._id ? '#fff' : C.text }}>{c.title.split(' ').slice(0, 3).join(' ')}</span>
              <span style={{ fontSize: 11, background: selected?._id === c._id ? 'rgba(255,255,255,0.2)' : C.border, borderRadius: 6, padding: '2px 7px', fontWeight: 700 }}>{c.studentCount}</span>
            </button>
          ))}
        </div>
      )}

      {selected && (
        <>
          {/* Course summary */}
          <Card style={{ padding: '14px 20px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 42, height: 42, borderRadius: 10, background: (selected.color || C.accent), display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 16, fontFamily: 'Georgia, serif' }}>
              {selected.title?.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div style={{ color: C.text, fontWeight: 700, fontSize: 15 }}>{selected.title}</div>
              <div style={{ color: C.textMuted, fontSize: 12 }}>{pagination.total} students enrolled</div>
            </div>
            <Badge type={selected.status} style={{ marginLeft: 'auto' }}>{selected.status}</Badge>
          </Card>

          <div style={{ marginBottom: 14 }}>
            <SearchBar value={search} onChange={v => { setSearch(v); setPage(1); }} placeholder="Search students by name, email..." />
          </div>

          {loadingStudents ? <Spinner center /> : students.length === 0 ? (
            <Card style={{ padding: 0 }}><Empty icon="👥" text="No students found." /></Card>
          ) : (
            <Table headers={['Student', 'Email', 'Phone', 'Payment', 'Enrolled', 'OTP', 'Access']}>
              {students.map(s => (
                <TR key={s._id}>
                  <TD>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Avatar name={s.studentName} size={32} color={C.violet} />
                      <span style={{ fontWeight: 600 }}>{s.studentName}</span>
                    </div>
                  </TD>
                  <TD muted>{s.email}</TD>
                  <TD muted>{s.phone}</TD>
                  <TD><Badge type={s.paymentStatus}>{s.paymentStatus}</Badge></TD>
                  <TD muted>{new Date(s.createdAt).toLocaleDateString()}</TD>
                  <TD>
                    <span style={{ fontSize: 12, color: s.otpVerified ? C.success : C.warning, fontWeight: 600 }}>
                      {s.otpVerified ? '✓ Yes' : '✕ No'}
                    </span>
                  </TD>
                  <TD>
                    <span style={{ fontSize: 12, color: s.accessActive ? C.success : C.danger, fontWeight: 600 }}>
                      {s.accessActive ? '✓ Active' : '✕ Locked'}
                    </span>
                  </TD>
                </TR>
              ))}
            </Table>
          )}

          {pagination.pages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 16 }}>
              {Array.from({ length: pagination.pages }, (_, i) => (
                <button key={i} onClick={() => setPage(i + 1)}
                  style={{ width: 34, height: 34, borderRadius: 8, background: page === i + 1 ? C.accent : C.card, border: `1px solid ${page === i + 1 ? C.accent : C.border}`, color: page === i + 1 ? '#fff' : C.textMuted, cursor: 'pointer', fontSize: 13, fontFamily: 'inherit', fontWeight: 600 }}>
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}

      <Toast toasts={toasts} />
    </div>
  );
}
