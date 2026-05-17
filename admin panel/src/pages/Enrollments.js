import { useState, useEffect, useCallback } from 'react';
import { enrollmentsAPI, coursesAPI } from '../api';
import { C, Badge, Spinner, Empty, Table, TR, TD, SearchBar, Select, PageHeader, Avatar, Btn, useToast, Toast } from '../components/UI';

export default function Enrollments() {
  const [enrollments, setEnrollments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ total: 0, pages: 1, page: 1 });
  const [filters, setFilters] = useState({ search: '', course: '', paymentStatus: '', page: 1 });
  const { toasts, add: toast } = useToast();

  useEffect(() => {
    coursesAPI.getAll().then(r => setCourses(r.data.data)).catch(() => {});
  }, []);

  const load = useCallback(() => {
    setLoading(true);
    const params = { page: filters.page, limit: 15 };
    if (filters.search) params.search = filters.search;
    if (filters.course) params.course = filters.course;
    if (filters.paymentStatus) params.paymentStatus = filters.paymentStatus;

    enrollmentsAPI.getAll(params)
      .then(res => {
        setEnrollments(res.data.data);
        setPagination(res.data.pagination);
      })
      .catch(() => toast('Failed to load enrollments', 'danger'))
      .finally(() => setLoading(false));
  }, [filters]);

  useEffect(load, [load]);

  const setFilter = (k, v) => setFilters(f => ({ ...f, [k]: v, page: 1 }));

  const handlePaymentUpdate = async (id, status) => {
    try {
      await enrollmentsAPI.updatePayment(id, status);
      toast('Payment status updated');
      load();
    } catch {
      toast('Failed to update payment', 'danger');
    }
  };

  return (
    <div>
      <PageHeader title="Enrollments" subtitle={`${pagination.total} total enrollments`} />

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 18, flexWrap: 'wrap' }}>
        <SearchBar value={filters.search} onChange={v => setFilter('search', v)} placeholder="Search name, email, phone..." />
        <select value={filters.course} onChange={e => setFilter('course', e.target.value)}
          style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 9, padding: '9px 14px', color: C.text, fontSize: 13, outline: 'none', fontFamily: 'inherit' }}>
          <option value="">All Courses</option>
          {courses.map(c => <option key={c._id} value={c._id} style={{ background: '#17171f' }}>{c.title}</option>)}
        </select>
        <select value={filters.paymentStatus} onChange={e => setFilter('paymentStatus', e.target.value)}
          style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 9, padding: '9px 14px', color: C.text, fontSize: 13, outline: 'none', fontFamily: 'inherit' }}>
          <option value="">All Payments</option>
          {['paid', 'pending', 'failed', 'refunded'].map(s => <option key={s} value={s} style={{ background: '#17171f' }}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
      </div>

      {loading ? <Spinner center /> : enrollments.length === 0 ? (
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14 }}>
          <Empty icon="🔍" text="No enrollments match your search." />
        </div>
      ) : (
        <Table headers={['Student', 'Contact', 'Course', 'Payment', 'OTP', 'Access', 'Date', 'Actions']}>
          {enrollments.map(e => (
            <TR key={e._id}>
              <TD>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Avatar name={e.studentName} size={32} color={C.accent} />
                  <span style={{ fontWeight: 600 }}>{e.studentName}</span>
                </div>
              </TD>
              <TD>
                <div style={{ fontSize: 12, color: C.textMuted }}>{e.email}</div>
                <div style={{ fontSize: 11, color: C.textDim }}>{e.phone}</div>
              </TD>
              <TD muted style={{ maxWidth: 160 }}>
                <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 12 }}>{e.course?.title || '—'}</div>
              </TD>
              <TD>
                <select value={e.paymentStatus} onChange={ev => handlePaymentUpdate(e._id, ev.target.value)}
                  style={{ background: 'transparent', border: 'none', color: 'inherit', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', outline: 'none' }}>
                  {['paid', 'pending', 'failed', 'refunded'].map(s => <option key={s} value={s} style={{ background: '#17171f' }}>{s}</option>)}
                </select>
                <Badge type={e.paymentStatus}>{e.paymentStatus}</Badge>
              </TD>
              <TD>
                <span style={{ fontSize: 12, color: e.otpVerified ? C.success : C.danger, fontWeight: 600 }}>
                  {e.otpVerified ? '✓ Verified' : '✕ Pending'}
                </span>
              </TD>
              <TD>
                <span style={{ fontSize: 12, color: e.accessActive ? C.success : C.danger, fontWeight: 600 }}>
                  {e.accessActive ? '✓ Active' : '✕ Restricted'}
                </span>
              </TD>
              <TD muted>{new Date(e.createdAt).toLocaleDateString()}</TD>
              <TD>
                <Btn size="sm" variant="danger" onClick={async () => {
                  if (window.confirm('Delete this enrollment?')) {
                    await enrollmentsAPI.delete(e._id);
                    toast('Enrollment deleted', 'danger');
                    load();
                  }
                }}>Del</Btn>
              </TD>
            </TR>
          ))}
        </Table>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 18 }}>
          {Array.from({ length: pagination.pages }, (_, i) => (
            <button key={i} onClick={() => setFilters(f => ({ ...f, page: i + 1 }))}
              style={{ width: 34, height: 34, borderRadius: 8, background: pagination.page === i + 1 ? C.accent : C.card, border: `1px solid ${pagination.page === i + 1 ? C.accent : C.border}`, color: pagination.page === i + 1 ? '#fff' : C.textMuted, cursor: 'pointer', fontSize: 13, fontFamily: 'inherit', fontWeight: 600 }}>
              {i + 1}
            </button>
          ))}
        </div>
      )}

      <Toast toasts={toasts} />
    </div>
  );
}
