'use client';
import AdminLayout from '@/components/layout/AdminLayout';
import { StatCard, Card, Spinner, Empty } from '@/components/ui';
import { Users, BookOpen, Package, DollarSign, MessageSquare, FileText, ArrowRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { analyticsApi, useApi } from '@/lib';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl px-3 py-2 text-xs border"
      style={{ background: 'var(--bg-card)', borderColor: 'var(--border)', color: 'var(--text)' }}>
      <p className="font-semibold mb-1">{label}</p>
      {payload.map((p: any) => <p key={p.name} style={{ color: p.color }}>{p.name}: {p.value}</p>)}
    </div>
  );
};

export default function Dashboard() {
  const { data, loading } = useApi(() => analyticsApi.dashboard());

  if (loading) return <AdminLayout title="Dashboard"><Spinner center /></AdminLayout>;

  const stats = data?.stats;
  const trend = data?.monthly_trend || [];
  const recent = data?.recent_enrollments || [];
  const bundleStats = data?.bundle_stats || [];

  return (
    <AdminLayout title="Dashboard">
      <div className="space-y-6 animate-fade-in">

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
          <StatCard label="Total Students"    value={stats?.total_students ?? 0}    icon={<Users size={18} />}       color="#4361ee" />
          <StatCard label="Total Enrollments" value={stats?.total_enrollments ?? 0} icon={<BookOpen size={18} />}    color="#10b981" />
          <StatCard label="Paid"              value={stats?.paid_enrollments ?? 0}  icon={<BookOpen size={18} />}    color="#059669" />
          <StatCard label="Bundles"           value={stats?.total_bundles ?? 0}     icon={<Package size={18} />}     color="#8b5cf6" />
          <StatCard label="Tests"             value={stats?.total_tests ?? 0}       icon={<FileText size={18} />}    color="#f59e0b" />
          <StatCard label="Revenue"
            value={`₹${(stats?.total_revenue ?? 0).toLocaleString('en-IN')}`}
            icon={<DollarSign size={18} />} color="#10b981" />
        </div>

        {/* Revenue Trend + Bundle Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="col-span-2 p-5">
            <div className="mb-4">
              <h3 className="font-bold text-sm" style={{ color: 'var(--text)' }}>Revenue Trend</h3>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Monthly revenue & enrollments</p>
            </div>
            {trend.length === 0 ? <Empty icon="📊" text="No data yet." /> : (
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={trend}>
                  <defs>
                    <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4361ee" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#4361ee" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false}
                    tickFormatter={(v: number) => `₹${(v / 1000).toFixed(0)}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="revenue" name="Revenue (₹)" stroke="#4361ee" fill="url(#rev)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </Card>

          <Card className="p-5">
            <h3 className="font-bold text-sm mb-1" style={{ color: 'var(--text)' }}>Bundle Enrollments</h3>
            <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>Top bundles by signups</p>
            {bundleStats.length === 0 ? <Empty icon="📦" text="No data yet." /> : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={bundleStats} barSize={24}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="bundle_title" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" fill="#4361ee" radius={[4, 4, 0, 0]} name="Enrollments" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Card>
        </div>

        {/* Recent Enrollments + Unread Messages */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm" style={{ color: 'var(--text)' }}>Recent Enrollments</h3>
              <a href="/enrollments" className="text-xs flex items-center gap-1" style={{ color: 'var(--accent)' }}>
                View all <ArrowRight size={12} />
              </a>
            </div>
            {recent.length === 0 ? <Empty icon="📋" text="No enrollments yet." /> : (
              <div className="space-y-3">
                {recent.map((e: any) => (
                  <div key={e._id} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                      style={{ background: 'var(--accent)' }}>{e.student_name?.[0] || '?'}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate" style={{ color: 'var(--text)' }}>{e.student_name}</p>
                      <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{e.bundle_title}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs font-bold" style={{ color: 'var(--text)' }}>₹{e.amount.toLocaleString('en-IN')}</p>
                      <p className="text-xs" style={{ color: e.payment_status === 'paid' ? 'var(--success)' : 'var(--warning)' }}>
                        {e.payment_status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm" style={{ color: 'var(--text)' }}>
                Unread Messages
                {stats?.unread_messages ? (
                  <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-bold text-white"
                    style={{ background: 'var(--danger)' }}>{stats.unread_messages}</span>
                ) : null}
              </h3>
              <a href="/messages" className="text-xs flex items-center gap-1" style={{ color: 'var(--accent)' }}>
                View all <ArrowRight size={12} />
              </a>
            </div>
            <div className="flex flex-col items-center justify-center py-8 gap-2">
              <MessageSquare size={32} style={{ color: 'var(--text-dim)' }} />
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                {stats?.unread_messages
                  ? `${stats.unread_messages} unread message${stats.unread_messages > 1 ? 's' : ''}`
                  : 'No unread messages'}
              </p>
              <a href="/messages" className="text-xs font-semibold mt-1" style={{ color: 'var(--accent)' }}>
                Go to Messages →
              </a>
            </div>
          </Card>
        </div>

      </div>
    </AdminLayout>
  );
}








// 'use client';

// import AdminLayout from '@/components/layout/AdminLayout';
// import { StatCard, Card, Spinner, Empty } from '@/components/ui';
// import { Users, BookOpen, Package, DollarSign, MessageSquare, FileText, ArrowRight } from 'lucide-react';
// import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
// import { analyticsApi, useApi } from '@/lib';


// declare global {
//   namespace JSX {
//     interface IntrinsicElements {
//       [elemName: string]: any;
//     }
//   }
// }

// const CustomTooltip = ({ active, payload, label }: any) => {
//   if (!active || !payload?.length) return null;
//   return (
//     <div className="rounded-xl px-3 py-2 text-xs border"
//       style={{ background: 'var(--bg-card)', borderColor: 'var(--border)', color: 'var(--text)' }}>
//       <p className="font-semibold mb-1">{label}</p>
//       {payload.map((p: any) => <p key={p.name} style={{ color: p.color }}>{p.name}: {p.value}</p>)}
//     </div>
//   );
// };

// export default function Dashboard() {
//   const { data, loading } = useApi(() => analyticsApi.dashboard());

//   if (loading) return <AdminLayout title="Dashboard"><Spinner center /></AdminLayout>;

//   const stats = data?.stats;
//   const trend = data?.monthly_trend || [];
//   const recent = data?.recent_enrollments || [];
//   const bundleStats = data?.bundle_stats || [];

//   return (
//     <AdminLayout title="Dashboard">
//       <div className="space-y-6 animate-fade-in">

//         {/* Stats Grid */}
//         <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
//           <StatCard label="Total Students"   value={stats?.total_students ?? 0}   icon={<Users size={18} />}        color="#4361ee" />
//           <StatCard label="Total Enrollments" value={stats?.total_enrollments ?? 0} icon={<BookOpen size={18} />}    color="#10b981" />
//           <StatCard label="Paid"             value={stats?.paid_enrollments ?? 0}  icon={<BookOpen size={18} />}    color="#059669" />
//           <StatCard label="Bundles"          value={stats?.total_bundles ?? 0}     icon={<Package size={18} />}     color="#8b5cf6" />
//           <StatCard label="Tests"            value={stats?.total_tests ?? 0}       icon={<FileText size={18} />}    color="#f59e0b" />
//           <StatCard label="Revenue"
//             value={`₹${(stats?.total_revenue ?? 0).toLocaleString('en-IN')}`}
//             icon={<DollarSign size={18} />} color="#10b981" />
//         </div>

//         {/* Revenue Trend + Bundle Stats */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
//           <Card className="col-span-2 p-5">
//             <div className="mb-4">
//               <h3 className="font-bold text-sm" style={{ color: 'var(--text)' }}>Revenue Trend</h3>
//               <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Monthly revenue & enrollments</p>
//             </div>
//             {trend.length === 0 ? <Empty icon="📊" text="No data yet." /> : (
//               <ResponsiveContainer width="100%" height={200}>
//                 <AreaChart data={trend}>
//                   <defs>
//                     <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
//                       <stop offset="5%" stopColor="#4361ee" stopOpacity={0.15} />
//                       <stop offset="95%" stopColor="#4361ee" stopOpacity={0} />
//                     </linearGradient>
//                   </defs>
//                   <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
//                   <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
//                   <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false}
//                     tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
//                   <Tooltip content={<CustomTooltip />} />
//                   <Area type="monotone" dataKey="revenue" name="Revenue (₹)" stroke="#4361ee" fill="url(#rev)" strokeWidth={2} />
//                 </AreaChart>
//               </ResponsiveContainer>
//             )}
//           </Card>

//           <Card className="p-5">
//             <h3 className="font-bold text-sm mb-1" style={{ color: 'var(--text)' }}>Bundle Enrollments</h3>
//             <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>Top bundles by signups</p>
//             {bundleStats.length === 0 ? <Empty icon="📦" text="No data yet." /> : (
//               <ResponsiveContainer width="100%" height={200}>
//                 <BarChart data={bundleStats} barSize={24}>
//                   <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
//                   <XAxis dataKey="bundle_title" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
//                   <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
//                   <Tooltip content={<CustomTooltip />} />
//                   <Bar dataKey="count" fill="#4361ee" radius={[4, 4, 0, 0]} name="Enrollments" />
//                 </BarChart>
//               </ResponsiveContainer>
//             )}
//           </Card>
//         </div>

//         {/* Recent Enrollments + Unread Messages */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
//           <Card className="p-5">
//             <div className="flex items-center justify-between mb-4">
//               <h3 className="font-bold text-sm" style={{ color: 'var(--text)' }}>Recent Enrollments</h3>
//               <a href="/enrollments" className="text-xs flex items-center gap-1" style={{ color: 'var(--accent)' }}>
//                 View all <ArrowRight size={12} />
//               </a>
//             </div>
//             {recent.length === 0 ? <Empty icon="📋" text="No enrollments yet." /> : (
//               <div className="space-y-3">
//                 {recent.map((e: { _id: string; student_name?: string; bundle_title?: string; amount: number; payment_status: string }) => (
//                   <div key={e._id} className="flex items-center gap-3">
//                     <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
//                       style={{ background: 'var(--accent)' }}>{e.student_name?.[0] || '?'}</div>
//                     <div className="flex-1 min-w-0">
//                       <p className="text-sm font-semibold truncate" style={{ color: 'var(--text)' }}>{e.student_name}</p>
//                       <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{e.bundle_title}</p>
//                     </div>
//                     <div className="text-right flex-shrink-0">
//                       <p className="text-xs font-bold" style={{ color: 'var(--text)' }}>₹{e.amount.toLocaleString('en-IN')}</p>
//                       <p className="text-xs" style={{ color: e.payment_status === 'paid' ? 'var(--success)' : 'var(--warning)' }}>
//                         {e.payment_status}
//                       </p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </Card>

//           <Card className="p-5">
//             <div className="flex items-center justify-between mb-4">
//               <h3 className="font-bold text-sm" style={{ color: 'var(--text)' }}>
//                 Unread Messages
//                 {stats?.unread_messages ? (
//                   <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-bold text-white"
//                     style={{ background: 'var(--danger)' }}>{stats.unread_messages}</span>
//                 ) : null}
//               </h3>
//               <a href="/messages" className="text-xs flex items-center gap-1" style={{ color: 'var(--accent)' }}>
//                 View all <ArrowRight size={12} />
//               </a>
//             </div>
//             <div className="flex flex-col items-center justify-center py-8 gap-2">
//               <MessageSquare size={32} style={{ color: 'var(--text-dim)' }} />
//               <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
//                 {stats?.unread_messages
//                   ? `${stats.unread_messages} unread message${stats.unread_messages > 1 ? 's' : ''}`
//                   : 'No unread messages'}
//               </p>
//               <a href="/messages" className="text-xs font-semibold mt-1" style={{ color: 'var(--accent)' }}>
//                 Go to Messages →
//               </a>
//             </div>
//           </Card>
//         </div>

//       </div>
//     </AdminLayout>
//   );
// }















// 'use client';
// import AdminLayout from '@/components/layout/AdminLayout';
// import { StatCard, Card } from '@/components/ui';
// import {
//   Users, Activity, BookOpen, TrendingUp,
//   Package, DollarSign, ArrowRight, MessageSquare
// } from 'lucide-react';
// import {
//   AreaChart, Area, XAxis, YAxis, CartesianGrid,
//   Tooltip, ResponsiveContainer, BarChart, Bar, Legend
// } from 'recharts';

// // ─── Mock Data ────────────────────────────────────────────────────────────────
// const STATS = [
//   { label: 'Active Users Now',    value: 24,      delta: '+3',   icon: <Activity size={18} />,    color: '#10b981' },
//   { label: 'New Registrations',   value: 18,      delta: '+12%', icon: <Users size={18} />,       color: '#4361ee' },
//   { label: 'Free Tests Today',    value: 143,     delta: '+8%',  icon: <BookOpen size={18} />,    color: '#f59e0b' },
//   { label: 'Bundle Sales Today',  value: 7,       delta: '+2',   icon: <Package size={18} />,     color: '#8b5cf6' },
//   { label: 'Revenue Today',       value: '₹14,000', delta: '+18%', icon: <DollarSign size={18} />, color: '#10b981' },
//   { label: 'Conversion Rate',     value: '4.9%',  delta: '+0.3', icon: <TrendingUp size={18} />,  color: '#ef4444' },
// ];

// const TRAFFIC_DATA = [
//   { day: 'Mon', visitors: 420, tests: 180 },
//   { day: 'Tue', visitors: 380, tests: 160 },
//   { day: 'Wed', visitors: 510, tests: 230 },
//   { day: 'Thu', visitors: 470, tests: 210 },
//   { day: 'Fri', visitors: 620, tests: 290 },
//   { day: 'Sat', visitors: 780, tests: 360 },
//   { day: 'Sun', visitors: 650, tests: 310 },
// ];

// const BUNDLE_SALES = [
//   { name: 'Foundation', sales: 34, revenue: 34000 },
//   { name: 'Advance',    sales: 21, revenue: 42000 },
//   { name: 'Mastery',    sales: 12, revenue: 36000 },
// ];

// const FUNNEL = [
//   { stage: 'Visitor',       count: 2840, pct: 100 },
//   { stage: 'Free Test',     count: 1420, pct: 50  },
//   { stage: 'Test Complete', count: 980,  pct: 35  },
//   { stage: 'Bundle View',   count: 420,  pct: 15  },
//   { stage: 'Checkout',      count: 180,  pct: 6.3 },
//   { stage: 'Payment',       count: 67,   pct: 2.4 },
// ];

// const RECENT_FEEDBACK = [
//   { user: 'Priya M.', msg: 'Amazing platform! Tests are very relevant.', date: '2h ago', type: 'General' },
//   { user: 'Arjun K.', msg: 'Timer resets on page refresh — bug report', date: '4h ago', type: 'Bug' },
//   { user: 'Sneha R.', msg: 'Add more reasoning tests please!', date: '6h ago', type: 'Suggestion' },
// ];

// const SUBJECT_ATTEMPTS = [
//   { subject: 'Mathematics', attempts: 842, avg: 68 },
//   { subject: 'English',     attempts: 634, avg: 72 },
//   { subject: 'Science',     attempts: 491, avg: 61 },
// ];

// // ─── Custom Tooltip ──────────────────────────────────────────────────────────
// const CustomTooltip = ({ active, payload, label }: any) => {
//   if (!active || !payload?.length) return null;
//   return (
//     <div className="rounded-xl px-3 py-2 text-xs border"
//       style={{ background: 'var(--bg-card)', borderColor: 'var(--border)', color: 'var(--text)' }}>
//       <p className="font-semibold mb-1">{label}</p>
//       {payload.map((p: any) => (
//         <p key={p.name} style={{ color: p.color }}>{p.name}: {p.value}</p>
//       ))}
//     </div>
//   );
// };

// export default function Dashboard() {
//   return (
//     <AdminLayout title="Dashboard">
//       <div className="space-y-6 animate-fade-in">

//         {/* Stats Grid */}
//         <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
//           {STATS.map(s => <StatCard key={s.label} {...s} />)}
//         </div>

//         {/* Traffic Chart + Bundle Sales */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
//           <Card className="col-span-2 p-5">
//             <div className="flex items-center justify-between mb-4">
//               <div>
//                 <h3 className="font-bold text-sm" style={{ color: 'var(--text)' }}>Website Traffic</h3>
//                 <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Visitors & test starts — last 7 days</p>
//               </div>
//             </div>
//             <ResponsiveContainer width="100%" height={200}>
//               <AreaChart data={TRAFFIC_DATA}>
//                 <defs>
//                   <linearGradient id="visitors" x1="0" y1="0" x2="0" y2="1">
//                     <stop offset="5%" stopColor="#4361ee" stopOpacity={0.15} />
//                     <stop offset="95%" stopColor="#4361ee" stopOpacity={0} />
//                   </linearGradient>
//                   <linearGradient id="tests" x1="0" y1="0" x2="0" y2="1">
//                     <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
//                     <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
//                   </linearGradient>
//                 </defs>
//                 <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
//                 <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
//                 <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
//                 <Tooltip content={<CustomTooltip />} />
//                 <Area type="monotone" dataKey="visitors" name="Visitors" stroke="#4361ee" fill="url(#visitors)" strokeWidth={2} />
//                 <Area type="monotone" dataKey="tests" name="Tests" stroke="#10b981" fill="url(#tests)" strokeWidth={2} />
//               </AreaChart>
//             </ResponsiveContainer>
//           </Card>

//           <Card className="p-5">
//             <h3 className="font-bold text-sm mb-1" style={{ color: 'var(--text)' }}>Bundle Sales</h3>
//             <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>This month</p>
//             <ResponsiveContainer width="100%" height={200}>
//               <BarChart data={BUNDLE_SALES} barSize={24}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
//                 <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
//                 <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
//                 <Tooltip content={<CustomTooltip />} />
//                 <Bar dataKey="sales" fill="#4361ee" radius={[4, 4, 0, 0]} name="Sales" />
//               </BarChart>
//             </ResponsiveContainer>
//           </Card>
//         </div>

//         {/* Funnel + Subject Attempts */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
//           {/* User Journey Funnel */}
//           <Card className="p-5">
//             <h3 className="font-bold text-sm mb-1" style={{ color: 'var(--text)' }}>User Journey Funnel</h3>
//             <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>Visitor → Payment conversion</p>
//             <div className="space-y-2">
//               {FUNNEL.map((f, i) => (
//                 <div key={f.stage}>
//                   <div className="flex items-center justify-between text-xs mb-1">
//                     <span style={{ color: 'var(--text)' }}>{f.stage}</span>
//                     <span style={{ color: 'var(--text-muted)' }}>{f.count.toLocaleString()} ({f.pct}%)</span>
//                   </div>
//                   <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg)' }}>
//                     <div className="h-full rounded-full transition-all" style={{
//                       width: `${f.pct}%`,
//                       background: `hsl(${230 - i * 20}, 80%, 60%)`,
//                     }} />
//                   </div>
//                   {i < FUNNEL.length - 1 && (
//                     <div className="flex justify-end mt-0.5">
//                       <span className="text-[10px]" style={{ color: 'var(--text-dim)' }}>
//                         ↓ {((FUNNEL[i + 1].count / f.count) * 100).toFixed(0)}% continue
//                       </span>
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </Card>

//           {/* Subject Attempts + Recent Feedback */}
//           <div className="space-y-4">
//             <Card className="p-5">
//               <h3 className="font-bold text-sm mb-4" style={{ color: 'var(--text)' }}>Subject Attempts</h3>
//               <div className="space-y-3">
//                 {SUBJECT_ATTEMPTS.map(s => (
//                   <div key={s.subject} className="flex items-center gap-3">
//                     <span className="text-sm w-24 flex-shrink-0" style={{ color: 'var(--text)' }}>{s.subject}</span>
//                     <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg)' }}>
//                       <div className="h-full rounded-full" style={{ width: `${s.avg}%`, background: 'var(--accent)' }} />
//                     </div>
//                     <span className="text-xs w-12 text-right" style={{ color: 'var(--text-muted)' }}>{s.attempts}</span>
//                   </div>
//                 ))}
//               </div>
//             </Card>

//             <Card className="p-5">
//               <div className="flex items-center justify-between mb-4">
//                 <h3 className="font-bold text-sm" style={{ color: 'var(--text)' }}>Latest Feedback</h3>
//                 <a href="/messages" className="text-xs flex items-center gap-1" style={{ color: 'var(--accent)' }}>
//                   View all <ArrowRight size={12} />
//                 </a>
//               </div>
//               <div className="space-y-3">
//                 {RECENT_FEEDBACK.map((f, i) => (
//                   <div key={i} className="flex gap-3">
//                     <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-bold"
//                       style={{ background: 'var(--accent)' }}>
//                       {f.user[0]}
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       <div className="flex items-center gap-2 mb-0.5">
//                         <span className="text-xs font-semibold" style={{ color: 'var(--text)' }}>{f.user}</span>
//                         <span className="text-[10px] px-1.5 py-0.5 rounded-md"
//                           style={{ background: 'var(--bg)', color: 'var(--text-muted)' }}>{f.type}</span>
//                         <span className="text-[10px] ml-auto" style={{ color: 'var(--text-dim)' }}>{f.date}</span>
//                       </div>
//                       <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{f.msg}</p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </Card>
//           </div>
//         </div>

//       </div>
//     </AdminLayout>
//   );
// }
