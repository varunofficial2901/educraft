'use client';
import { useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { StatCard, Table, TR, TD, Badge, Btn, Empty, Spinner, useToast, Toast } from '@/components/ui';
import { BookOpen, DollarSign, TrendingUp, Search } from 'lucide-react';
import { enrollmentsApi, useApi, useMutation } from '@/lib';
import type { PaymentStatus } from '@/lib';

const STATUS_TYPE: Record<string, any> = {
  paid: 'success', pending: 'warning', failed: 'danger', refunded: 'default',
};

export default function EnrollmentsPage() {
  const [search, setSearch]           = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [page, setPage]               = useState(1);

  const { data, loading, refetch } = useApi(
    () => enrollmentsApi.list({
      search: search || undefined,
      payment_status: statusFilter !== 'All' ? statusFilter : undefined,
      page,
      limit: 20,
    }),
    [search, statusFilter, page]
  );

  const { mutate: updateStatus } = useMutation(
    (id: string, status: PaymentStatus) => enrollmentsApi.updateStatus(id, status)
  );
  const { mutate: toggleAccess } = useMutation(enrollmentsApi.toggleAccess);
  const { toasts, add: toast }   = useToast();

  const enrollments: any[] = data?.data || [];
  const pagination  = data?.pagination;

  const paid    = enrollments.filter(e => e.payment_status === 'paid').length;
  const pending = enrollments.filter(e => e.payment_status === 'pending').length;
  const revenue = enrollments.filter(e => e.payment_status === 'paid').reduce<number>((sum: number, e) => sum + e.amount, 0);

  const handleStatusChange = async (id: string, status: PaymentStatus) => {
    await updateStatus(id, status);
    toast('Status updated');
    refetch();
  };

  const handleAccessToggle = async (id: string) => {
    await toggleAccess(id);
    toast('Access updated');
    refetch();
  };

  const statuses = ['All', 'paid', 'pending', 'failed', 'refunded'];

  return (
    <AdminLayout title="Enrollments">
      <div className="animate-fade-in space-y-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Total" value={pagination?.total ?? '—'} icon={<BookOpen size={18} />} color="var(--accent)" />
          <StatCard label="Paid" value={paid} icon={<TrendingUp size={18} />} color="#10b981" />
          <StatCard label="Pending" value={pending} icon={<TrendingUp size={18} />} color="#f59e0b" />
          <StatCard label="Revenue (page)" value={`₹${revenue.toLocaleString('en-IN')}`} icon={<DollarSign size={18} />} color="#8b5cf6" />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-48">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-dim)' }} />
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search student..."
              className="w-full pl-8 pr-3 py-2.5 rounded-xl text-sm border outline-none"
              style={{ background: 'var(--bg-card)', borderColor: 'var(--border)', color: 'var(--text)' }} />
          </div>
          <div className="flex gap-2 flex-wrap">
            {statuses.map(s => (
              <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all"
                style={{ background: statusFilter === s ? 'var(--accent)' : 'var(--bg-card)', color: statusFilter === s ? '#fff' : 'var(--text-muted)', border: '1px solid var(--border)' }}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {loading ? <Spinner center /> : (
          <Table headers={['Student', 'Bundle', 'Amount', 'Status', 'Access', 'Date', 'Actions']}>
            {enrollments.map(e => (
              <TR key={e._id}>
                <TD>
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                      style={{ background: 'var(--accent)' }}>{e.student_name?.[0] || '?'}</div>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{e.student_name}</p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{e.email}</p>
                    </div>
                  </div>
                </TD>
                <TD muted>{e.bundle_title}</TD>
                <TD><span className="font-semibold text-sm">₹{e.amount.toLocaleString('en-IN')}</span></TD>
                <TD>
                  <select value={e.payment_status}
                    onChange={ev => handleStatusChange(e._id, ev.target.value as PaymentStatus)}
                    className="text-xs px-2 py-1 rounded-lg border outline-none capitalize"
                    style={{ background: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text)' }}>
                    {['paid', 'pending', 'failed', 'refunded'].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </TD>
                <TD>
                  <span className="text-xs font-semibold" style={{ color: e.access_active ? 'var(--success)' : 'var(--danger)' }}>
                    {e.access_active ? '✓ Active' : '✕ Locked'}
                  </span>
                </TD>
                <TD muted>{e.created_at ? new Date(e.created_at).toLocaleDateString() : '—'}</TD>
                <TD>
                  <Btn size="sm" variant={e.access_active ? 'danger' : 'secondary'} onClick={() => handleAccessToggle(e._id)}>
                    {e.access_active ? 'Revoke' : 'Grant'}
                  </Btn>
                </TD>
              </TR>
            ))}
          </Table>
        )}

        {!loading && enrollments.length === 0 && <Empty icon="📋" text="No enrollments found." />}

        {pagination && pagination.pages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-2">
            <Btn size="sm" variant="ghost" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>← Prev</Btn>
            <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Page {page} of {pagination.pages}</span>
            <Btn size="sm" variant="ghost" onClick={() => setPage(p => Math.min(pagination.pages, p + 1))} disabled={page === pagination.pages}>Next →</Btn>
          </div>
        )}
      </div>
      <Toast toasts={toasts} />
    </AdminLayout>
  );
}










// 'use client';
// import { useState } from 'react';
// import AdminLayout from '@/components/layout/AdminLayout';
// import { StatCard, Table, TR, TD, Badge, Btn, Empty, useToast, Toast } from '@/components/ui';
// import { BookOpen, TrendingUp, DollarSign, Search } from 'lucide-react';

// const MOCK_ENROLLMENTS = [
//   { _id: '1', student: 'Priya Sharma', email: 'priya@gmail.com', bundle: 'Advance Bundle', price: 3499, status: 'paid', date: '2026-05-01', access: true },
//   { _id: '2', student: 'Arjun Kumar', email: 'arjun@gmail.com', bundle: 'Foundation Bundle', price: 1999, status: 'pending', date: '2026-05-03', access: false },
//   { _id: '3', student: 'Sneha Reddy', email: 'sneha@gmail.com', bundle: 'Mastery Bundle', price: 5999, status: 'paid', date: '2026-05-05', access: true },
//   { _id: '4', student: 'Rahul Verma', email: 'rahul@gmail.com', bundle: 'Foundation Bundle', price: 1999, status: 'failed', date: '2026-05-08', access: false },
//   { _id: '5', student: 'Anjali Patel', email: 'anjali@gmail.com', bundle: 'Advance Bundle', price: 3499, status: 'paid', date: '2026-05-10', access: true },
//   { _id: '6', student: 'Vikram Singh', email: 'vikram@gmail.com', bundle: 'Mastery Bundle', price: 5999, status: 'refunded', date: '2026-05-12', access: false },
//   { _id: '7', student: 'Meera Joshi', email: 'meera@gmail.com', bundle: 'Mastery Bundle', price: 5999, status: 'paid', date: '2026-05-14', access: true },
//   { _id: '8', student: 'Karan Malhotra', email: 'karan@gmail.com', bundle: 'Foundation Bundle', price: 1999, status: 'pending', date: '2026-05-16', access: false },
// ];

// const STATUS_TYPE: Record<string, any> = {
//   paid: 'success', pending: 'warning', failed: 'danger', refunded: 'default',
// };

// export default function EnrollmentsPage() {
//   const [enrollments, setEnrollments] = useState(MOCK_ENROLLMENTS);
//   const [search, setSearch] = useState('');
//   const [statusFilter, setStatusFilter] = useState('All');
//   const { toasts, add: toast } = useToast();

//   const statuses = ['All', 'paid', 'pending', 'failed', 'refunded'];
//   const filtered = enrollments
//     .filter(e => statusFilter === 'All' || e.status === statusFilter)
//     .filter(e => !search || e.student.toLowerCase().includes(search.toLowerCase()) || e.email.toLowerCase().includes(search.toLowerCase()));

//   const updateStatus = (id: string, status: string) => {
//     setEnrollments(es => es.map(e => e._id === id ? {
//       ...e, status, access: status === 'paid',
//     } : e));
//     toast('Payment status updated');
//   };

//   const totalRevenue = enrollments.filter(e => e.status === 'paid').reduce((s, e) => s + e.price, 0);
//   const paidCount = enrollments.filter(e => e.status === 'paid').length;

//   return (
//     <AdminLayout title="Enrollments">
//       <div className="animate-fade-in space-y-5">
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//           <StatCard label="Total Enrollments" value={enrollments.length} icon={<BookOpen size={18} />} color="var(--accent)" />
//           <StatCard label="Paid" value={paidCount} icon={<TrendingUp size={18} />} color="#10b981" />
//           <StatCard label="Pending" value={enrollments.filter(e => e.status === 'pending').length} icon={<TrendingUp size={18} />} color="#f59e0b" />
//           <StatCard label="Revenue" value={`₹${totalRevenue.toLocaleString('en-IN')}`} icon={<DollarSign size={18} />} color="#8b5cf6" />
//         </div>

//         <div className="flex flex-wrap items-center gap-3">
//           <div className="relative flex-1 min-w-48">
//             <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-dim)' }} />
//             <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search student..."
//               className="w-full pl-8 pr-3 py-2.5 rounded-xl text-sm border outline-none"
//               style={{ background: 'var(--bg-card)', borderColor: 'var(--border)', color: 'var(--text)' }} />
//           </div>
//           <div className="flex gap-2">
//             {statuses.map(s => (
//               <button key={s} onClick={() => setStatusFilter(s)}
//                 className="px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all"
//                 style={{ background: statusFilter === s ? 'var(--accent)' : 'var(--bg-card)', color: statusFilter === s ? '#fff' : 'var(--text-muted)', border: '1px solid var(--border)' }}>
//                 {s}
//               </button>
//             ))}
//           </div>
//         </div>

//         <Table headers={['Student', 'Bundle', 'Amount', 'Status', 'Access', 'Date', 'Actions']}>
//           {filtered.map(e => (
//             <TR key={e._id}>
//               <TD>
//                 <div className="flex items-center gap-2.5">
//                   <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
//                     style={{ background: 'var(--accent)' }}>{e.student[0]}</div>
//                   <div>
//                     <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{e.student}</p>
//                     <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{e.email}</p>
//                   </div>
//                 </div>
//               </TD>
//               <TD muted>{e.bundle}</TD>
//               <TD><span className="font-semibold text-sm">₹{e.price.toLocaleString('en-IN')}</span></TD>
//               <TD>
//                 <select value={e.status} onChange={ev => updateStatus(e._id, ev.target.value)}
//                   className="text-xs px-2 py-1 rounded-lg border outline-none capitalize"
//                   style={{ background: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text)' }}>
//                   {['paid', 'pending', 'failed', 'refunded'].map(s => <option key={s} value={s}>{s}</option>)}
//                 </select>
//               </TD>
//               <TD>
//                 <span className="text-xs font-semibold" style={{ color: e.access ? 'var(--success)' : 'var(--danger)' }}>
//                   {e.access ? '✓ Active' : '✕ Locked'}
//                 </span>
//               </TD>
//               <TD muted>{new Date(e.date).toLocaleDateString()}</TD>
//               <TD>
//                 <Btn size="sm" variant={e.access ? 'danger' : 'secondary'}
//                   onClick={() => { setEnrollments(es => es.map(x => x._id === e._id ? { ...x, access: !x.access } : x)); toast('Access updated'); }}>
//                   {e.access ? 'Revoke' : 'Grant'}
//                 </Btn>
//               </TD>
//             </TR>
//           ))}
//         </Table>
//         {filtered.length === 0 && <Empty icon="📋" text="No enrollments found." />}
//       </div>
//       <Toast toasts={toasts} />
//     </AdminLayout>
//   );
// }
