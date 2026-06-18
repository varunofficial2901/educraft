'use client';
import { useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { StatCard, Table, TR, TD, Badge, Btn, Empty, Spinner, useToast, Toast, Confirm } from '@/components/ui';
import { Users, Search } from 'lucide-react';
import { studentsApi, useApi, useMutation } from '@/lib';

export default function StudentsPage() {
  const [search, setSearch] = useState('');
  const [page, setPage]     = useState(1);

  const { data, loading, refetch } = useApi(
    () => studentsApi.list({ search: search || undefined, page, limit: 20 }),
    [search, page]
  );

  const { mutate: toggleStudent } = useMutation(studentsApi.toggle);
  const { mutate: deleteStudent } = useMutation(studentsApi.delete);
  const [confirmDel, setConfirmDel] = useState<string | null>(null);
  const { toasts, add: toast }      = useToast();

  const students   = data?.data || [];
  const pagination = data?.pagination;

  const handleToggle = async (id: string) => {
    await toggleStudent(id);
    toast('Student status updated');
    refetch();
  };

  const handleDelete = async () => {
    if (!confirmDel) return;
    await deleteStudent(confirmDel);
    toast('Student deleted', 'danger');
    setConfirmDel(null);
    refetch();
  };

  return (
    <AdminLayout title="Students">
      <div className="animate-fade-in space-y-5">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <StatCard label="Total Students" value={pagination?.total ?? '—'} icon={<Users size={18} />} color="var(--accent)" />
          <StatCard label="This Page" value={students.length} icon={<Users size={18} />} color="#10b981" />
          <StatCard label="Page" value={`${page} / ${pagination?.pages ?? 1}`} icon={<Users size={18} />} color="#f59e0b" />
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-dim)' }} />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by name or email..."
            className="w-full pl-8 pr-3 py-2.5 rounded-xl text-sm border outline-none"
            style={{ background: 'var(--bg-card)', borderColor: 'var(--border)', color: 'var(--text)' }} />
        </div>

        {loading ? <Spinner center /> : (
          <Table headers={['Student', 'Email', 'Bundles', 'Status', 'Provider', 'Joined', 'Actions']}>
            {students.map((s: any) => (
              <TR key={s._id}>
                <TD>
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                      style={{ background: 'var(--accent)' }}>{s.name?.[0] || '?'}</div>
                    <span className="font-semibold text-sm">{s.name || '—'}</span>
                  </div>
                </TD>
                <TD muted>{s.email}</TD>
                <TD>
                  {s.bundles.length === 0
                    ? <Badge type="default">Free</Badge>
                    : s.bundles.map((b: string, i: number) => <Badge key={i} type="info">{b}</Badge>)
                  }
                </TD>
                <TD>
                  <Badge type={s.is_active ? 'success' : 'danger'}>
                    {s.is_active ? 'Active' : 'Blocked'}
                  </Badge>
                </TD>
                <TD muted>{s.provider}</TD>
                <TD muted>{s.joined ? new Date(s.joined).toLocaleDateString() : '—'}</TD>
                <TD>
                  <div className="flex gap-1.5">
                    <Btn size="sm" variant={s.is_active ? 'danger' : 'secondary'} onClick={() => handleToggle(s._id)}>
                      {s.is_active ? 'Block' : 'Unblock'}
                    </Btn>
                  </div>
                </TD>
              </TR>
            ))}
          </Table>
        )}

        {!loading && students.length === 0 && <Empty icon="👥" text="No students found." />}

        {/* Pagination */}
        {pagination && pagination.pages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-2">
            <Btn size="sm" variant="ghost" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>← Prev</Btn>
            <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Page {page} of {pagination.pages}</span>
            <Btn size="sm" variant="ghost" onClick={() => setPage(p => Math.min(pagination.pages, p + 1))} disabled={page === pagination.pages}>Next →</Btn>
          </div>
        )}
      </div>

      <Confirm open={!!confirmDel} onClose={() => setConfirmDel(null)} onConfirm={handleDelete}
        message="Delete this student permanently?" />
      <Toast toasts={toasts} />
    </AdminLayout>
  );
}











// 'use client';
// import { useState } from 'react';
// import AdminLayout from '@/components/layout/AdminLayout';
// import { Card, StatCard, Table, TR, TD, Badge, Btn, Empty } from '@/components/ui';
// import { Users, UserCheck, TrendingUp, Search } from 'lucide-react';

// const MOCK_STUDENTS = [
//   { _id: '1', name: 'Priya Sharma', email: 'priya@gmail.com', joined: '2026-05-01', tests: 12, bundle: 'Advance', lastActive: '2h ago', score: 74 },
//   { _id: '2', name: 'Arjun Kumar', email: 'arjun@gmail.com', joined: '2026-05-03', tests: 8, bundle: 'Free', lastActive: '1d ago', score: 61 },
//   { _id: '3', name: 'Sneha Reddy', email: 'sneha@gmail.com', joined: '2026-05-05', tests: 21, bundle: 'Mastery', lastActive: '30m ago', score: 88 },
//   { _id: '4', name: 'Rahul Verma', email: 'rahul@gmail.com', joined: '2026-05-08', tests: 5, bundle: 'Foundation', lastActive: '3d ago', score: 55 },
//   { _id: '5', name: 'Anjali Patel', email: 'anjali@gmail.com', joined: '2026-05-10', tests: 15, bundle: 'Advance', lastActive: '5h ago', score: 79 },
//   { _id: '6', name: 'Vikram Singh', email: 'vikram@gmail.com', joined: '2026-05-12', tests: 3, bundle: 'Free', lastActive: '2d ago', score: 48 },
//   { _id: '7', name: 'Meera Joshi', email: 'meera@gmail.com', joined: '2026-05-14', tests: 18, bundle: 'Mastery', lastActive: '1h ago', score: 82 },
//   { _id: '8', name: 'Karan Malhotra', email: 'karan@gmail.com', joined: '2026-05-16', tests: 9, bundle: 'Foundation', lastActive: '4h ago', score: 67 },
// ];

// const BUNDLE_MAP: Record<string, 'success' | 'info' | 'warning' | 'default'> = {
//   Free:       'default',
//   Foundation: 'info',
//   Advance:    'warning',
//   Mastery:    'success',
// };

// export default function StudentsPage() {
//   const [search, setSearch] = useState('');
//   const [filter, setFilter] = useState('All');

//   const bundles = ['All', 'Free', 'Foundation', 'Advance', 'Mastery'];
//   const filtered = MOCK_STUDENTS
//     .filter(s => filter === 'All' || s.bundle === filter)
//     .filter(s => !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase()));

//   return (
//     <AdminLayout title="Students">
//       <div className="animate-fade-in space-y-5">
//         {/* Stats */}
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//           <StatCard label="Total Students" value={1284} delta="+12%" icon={<Users size={18} />} color="var(--accent)" />
//           <StatCard label="New This Week" value={48} delta="+8" icon={<UserCheck size={18} />} color="#10b981" />
//           <StatCard label="Active Today" value={143} icon={<TrendingUp size={18} />} color="#f59e0b" />
//           <StatCard label="Avg Score" value="68%" icon={<TrendingUp size={18} />} color="#8b5cf6" />
//         </div>

//         {/* Filters */}
//         <div className="flex flex-wrap items-center gap-3">
//           <div className="relative flex-1 min-w-48">
//             <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-dim)' }} />
//             <input value={search} onChange={e => setSearch(e.target.value)}
//               placeholder="Search by name or email..."
//               className="w-full pl-8 pr-3 py-2.5 rounded-xl text-sm border outline-none"
//               style={{ background: 'var(--bg-card)', borderColor: 'var(--border)', color: 'var(--text)' }} />
//           </div>
//           <div className="flex gap-2">
//             {bundles.map(b => (
//               <button key={b} onClick={() => setFilter(b)}
//                 className="px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
//                 style={{ background: filter === b ? 'var(--accent)' : 'var(--bg-card)', color: filter === b ? '#fff' : 'var(--text-muted)', border: '1px solid var(--border)' }}>
//                 {b}
//               </button>
//             ))}
//           </div>
//         </div>

//         <Table headers={['Student', 'Email', 'Bundle', 'Tests Taken', 'Avg Score', 'Joined', 'Last Active']}>
//           {filtered.map(s => (
//             <TR key={s._id}>
//               <TD>
//                 <div className="flex items-center gap-2.5">
//                   <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
//                     style={{ background: 'var(--accent)' }}>{s.name[0]}</div>
//                   <span className="font-semibold text-sm">{s.name}</span>
//                 </div>
//               </TD>
//               <TD muted>{s.email}</TD>
//               <TD><Badge type={BUNDLE_MAP[s.bundle] || 'default'}>{s.bundle}</Badge></TD>
//               <TD muted>{s.tests}</TD>
//               <TD>
//                 <div className="flex items-center gap-2">
//                   <div className="h-1.5 w-14 rounded-full overflow-hidden" style={{ background: 'var(--bg)' }}>
//                     <div className="h-full rounded-full" style={{ width: `${s.score}%`, background: s.score >= 75 ? 'var(--success)' : s.score >= 60 ? 'var(--accent)' : 'var(--warning)' }} />
//                   </div>
//                   <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{s.score}%</span>
//                 </div>
//               </TD>
//               <TD muted>{new Date(s.joined).toLocaleDateString()}</TD>
//               <TD muted>{s.lastActive}</TD>
//             </TR>
//           ))}
//         </Table>

//         {filtered.length === 0 && <Empty icon="👥" text="No students found." />}
//       </div>
//     </AdminLayout>
//   );
// }
