'use client';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, Spinner, Empty } from '@/components/ui';
import { analyticsApi, useApi } from '@/lib';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line
} from 'recharts';

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

export default function AnalyticsPage() {
  const { data: dashData, loading: dashLoading } = useApi(() => analyticsApi.dashboard());
  const { data: analyticsData, loading: analyticsLoading } = useApi(() => analyticsApi.get());

  const loading = dashLoading || analyticsLoading;

  const monthlyTrend    = dashData?.monthly_trend || [];
  const bundleAnalytics = analyticsData?.bundle_analytics || [];
  const testStats       = analyticsData?.test_stats || [];
  const stats           = dashData?.stats;

  return (
    <AdminLayout title="Analytics">
      <div className="animate-fade-in space-y-6">

        {loading ? <Spinner center /> : (
          <>
            {/* ─── Summary Stats ──────────────────────────────────────── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="p-4">
                <p className="text-2xl font-bold mb-1" style={{ color: 'var(--accent)' }}>
                  {stats?.total_enrollments ?? 0}
                </p>
                <p className="text-xs font-semibold" style={{ color: 'var(--text)' }}>Total Enrollments</p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>All time</p>
              </Card>
              <Card className="p-4">
                <p className="text-2xl font-bold mb-1" style={{ color: '#10b981' }}>
                  {stats?.paid_enrollments ?? 0}
                </p>
                <p className="text-xs font-semibold" style={{ color: 'var(--text)' }}>Paid Enrollments</p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Confirmed payments</p>
              </Card>
              <Card className="p-4">
                <p className="text-2xl font-bold mb-1" style={{ color: '#8b5cf6' }}>
                  ₹{(stats?.total_revenue ?? 0).toLocaleString('en-IN')}
                </p>
                <p className="text-xs font-semibold" style={{ color: 'var(--text)' }}>Total Revenue</p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>All time</p>
              </Card>
              <Card className="p-4">
                <p className="text-2xl font-bold mb-1" style={{ color: '#f59e0b' }}>
                  {stats?.total_students ?? 0}
                </p>
                <p className="text-xs font-semibold" style={{ color: 'var(--text)' }}>Total Students</p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Registered users</p>
              </Card>
            </div>

            {/* ─── Revenue Trend ──────────────────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="p-5">
                <h3 className="font-bold text-sm mb-1" style={{ color: 'var(--text)' }}>Revenue Trend</h3>
                <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>Monthly revenue (last 6 months)</p>
                {monthlyTrend.length === 0 ? <Empty icon="📊" text="No revenue data yet." /> : (
                  <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={monthlyTrend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false}
                        tickFormatter={(v: number) => `₹${(v / 1000).toFixed(0)}k`} />
                      <Tooltip content={<CustomTooltip />} />
                      <Line type="monotone" dataKey="revenue" stroke="var(--accent)" strokeWidth={2} dot={{ r: 3 }} name="Revenue (₹)" />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </Card>

              <Card className="p-5">
                <h3 className="font-bold text-sm mb-1" style={{ color: 'var(--text)' }}>Monthly Enrollments</h3>
                <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>Enrollments per month</p>
                {monthlyTrend.length === 0 ? <Empty icon="📋" text="No enrollment data yet." /> : (
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={monthlyTrend} barSize={24}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="enrollments" fill="#4361ee" radius={[4, 4, 0, 0]} name="Enrollments" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </Card>
            </div>

            {/* ─── Bundle Analytics ────────────────────────────────────── */}
            <Card className="p-5">
              <h3 className="font-bold text-sm mb-1" style={{ color: 'var(--text)' }}>Bundle Analytics</h3>
              <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>Enrollments and revenue per bundle</p>
              {bundleAnalytics.length === 0 ? <Empty icon="📦" text="No bundle data yet." /> : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr style={{ background: 'var(--bg)' }}>
                        {['Bundle', 'Total Enrollments', 'Paid', 'Revenue'].map(h => (
                          <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold uppercase tracking-wider border-b"
                            style={{ color: 'var(--text-muted)', borderColor: 'var(--border)' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {bundleAnalytics.map((b, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}
                          onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--bg)'}
                          onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
                          <td className="px-4 py-2.5 text-xs font-semibold" style={{ color: 'var(--text)' }}>{b.bundle_title}</td>
                          <td className="px-4 py-2.5 text-xs" style={{ color: 'var(--text-muted)' }}>{b.total_enrollments}</td>
                          <td className="px-4 py-2.5 text-xs" style={{ color: 'var(--text-muted)' }}>{b.paid_enrollments}</td>
                          <td className="px-4 py-2.5 text-xs font-semibold" style={{ color: 'var(--accent)' }}>
                            ₹{b.revenue.toLocaleString('en-IN')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>

            {/* ─── Test Stats ──────────────────────────────────────────── */}
            <Card className="p-5">
              <h3 className="font-bold text-sm mb-1" style={{ color: 'var(--text)' }}>Test Stats</h3>
              <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>All tests in the system</p>
              {testStats.length === 0 ? <Empty icon="📝" text="No tests yet." /> : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr style={{ background: 'var(--bg)' }}>
                        {['Test', 'Subject', 'Questions', 'Type'].map(h => (
                          <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold uppercase tracking-wider border-b"
                            style={{ color: 'var(--text-muted)', borderColor: 'var(--border)' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {testStats.map((t, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}
                          onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--bg)'}
                          onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
                          <td className="px-4 py-2.5 text-xs font-semibold" style={{ color: 'var(--text)' }}>{t.title}</td>
                          <td className="px-4 py-2.5 text-xs" style={{ color: 'var(--text-muted)' }}>{t.subject || '—'}</td>
                          <td className="px-4 py-2.5 text-xs" style={{ color: 'var(--text-muted)' }}>{t.question_count}</td>
                          <td className="px-4 py-2.5 text-xs">
                            <span className="px-2 py-0.5 rounded-lg text-xs font-semibold"
                              style={{
                                background: t.is_free ? '#d1fae5' : '#dbeafe',
                                color: t.is_free ? '#059669' : '#2563eb'
                              }}>
                              {t.is_free ? 'Free' : 'Paid'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </>
        )}
      </div>
    </AdminLayout>
  );
}






// 'use client';
// import AdminLayout from '@/components/layout/AdminLayout';
// import { Card, StatCard } from '@/components/ui';
// import { TrendingUp, DollarSign, Users, Target } from 'lucide-react';
// import {
//   BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
//   ResponsiveContainer, LineChart, Line, Legend, PieChart, Pie, Cell
// } from 'recharts';

// // ─── Mock Data ────────────────────────────────────────────────────────────────
// const FUNNEL = [
//   { stage: 'Visitor',           count: 2840, pct: 100  },
//   { stage: 'Free Test Viewed',  count: 1640, pct: 57.7 },
//   { stage: 'Test Started',      count: 1180, pct: 41.5 },
//   { stage: 'Test Completed',    count: 890,  pct: 31.3 },
//   { stage: 'Bundle Page',       count: 420,  pct: 14.8 },
//   { stage: 'Checkout Started',  count: 180,  pct: 6.3  },
//   { stage: 'Payment Complete',  count: 67,   pct: 2.4  },
// ];

// const SUBJECT_FUNNEL = [
//   { subject: 'Mathematics', pageViews: 1240, starts: 842, completions: 634, avgScore: 68, highScore: 98, lowScore: 12 },
//   { subject: 'English',     pageViews: 980,  starts: 634, completions: 498, avgScore: 72, highScore: 96, lowScore: 18 },
//   { subject: 'Science',     pageViews: 820,  starts: 491, completions: 361, avgScore: 61, highScore: 94, lowScore: 8  },
// ];

// const BUNDLE_ANALYTICS = [
//   { name: 'Foundation', cardViews: 342, buyClicks: 89, checkoutStarts: 67, purchases: 34, revToday: 4000, revWeek: 18000, revMonth: 68000, revAllTime: 340000 },
//   { name: 'Advance',    cardViews: 278, buyClicks: 64, checkoutStarts: 48, purchases: 21, revToday: 7000, revWeek: 28000, revMonth: 98000, revAllTime: 420000 },
//   { name: 'Mastery',    cardViews: 189, buyClicks: 38, checkoutStarts: 24, purchases: 12, revToday: 3000, revWeek: 22000, revMonth: 72000, revAllTime: 288000 },
// ];

// const CONVERSION = [
//   { metric: 'Visitor → Free Test Start',    value: '57.7%', label: 'Top of funnel health' },
//   { metric: 'Free Test Complete → Purchase', value: '7.5%',  label: 'Core product metric' },
//   { metric: 'Bundle Viewed → Purchase',     value: '15.9%', label: 'Bottom of funnel' },
//   { metric: 'Buy Click → Payment Success',  value: '37.2%', label: 'Checkout drop-off' },
// ];

// const TEST_PERF = [
//   { name: 'Maths Free', attempts: 842, completions: 634, avgScore: 68, avgTime: '32m' },
//   { name: 'English Free', attempts: 634, completions: 498, avgScore: 72, avgTime: '28m' },
//   { name: 'Science Free', attempts: 491, completions: 361, avgScore: 61, avgTime: '35m' },
//   { name: 'Maths Pack 1', attempts: 312, completions: 289, avgScore: 71, avgTime: '44m' },
// ];

// const REVENUE_TREND = [
//   { month: 'Jan', revenue: 42000 }, { month: 'Feb', revenue: 58000 },
//   { month: 'Mar', revenue: 67000 }, { month: 'Apr', revenue: 89000 },
//   { month: 'May', revenue: 112000 }, { month: 'Jun', revenue: 134000 },
// ];

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

// export default function AnalyticsPage() {
//   return (
//     <AdminLayout title="Analytics">
//       <div className="animate-fade-in space-y-6">

//         {/* §7 Conversion Metrics */}
//         <div>
//           <h2 className="text-sm font-bold mb-3 flex items-center gap-2" style={{ color: 'var(--text)' }}>
//             <span className="px-2 py-0.5 rounded-lg text-xs" style={{ background: '#fee2e2', color: '#dc2626' }}>High Priority</span>
//             Conversion Metrics
//           </h2>
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//             {CONVERSION.map(c => (
//               <Card key={c.metric} className="p-4">
//                 <p className="text-2xl font-bold mb-1" style={{ color: 'var(--accent)' }}>{c.value}</p>
//                 <p className="text-xs font-semibold mb-0.5" style={{ color: 'var(--text)' }}>{c.metric}</p>
//                 <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{c.label}</p>
//               </Card>
//             ))}
//           </div>
//         </div>

//         {/* §5 User Journey Funnel + Revenue Trend */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
//           <Card className="p-5">
//             <h3 className="font-bold text-sm mb-1" style={{ color: 'var(--text)' }}>§5 User Journey Funnel</h3>
//             <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>Visitor → Payment conversion steps</p>
//             <div className="space-y-3">
//               {FUNNEL.map((f, i) => (
//                 <div key={f.stage}>
//                   <div className="flex justify-between text-xs mb-1">
//                     <span style={{ color: 'var(--text)' }}>{f.stage}</span>
//                     <span style={{ color: 'var(--text-muted)' }}>{f.count.toLocaleString()} ({f.pct}%)</span>
//                   </div>
//                   <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg)' }}>
//                     <div className="h-full rounded-full" style={{ width: `${f.pct}%`, background: `hsl(${230 - i * 25}, 75%, 58%)` }} />
//                   </div>
//                   {i < FUNNEL.length - 1 && (
//                     <div className="flex justify-end">
//                       <span className="text-[10px]" style={{ color: 'var(--text-dim)' }}>
//                         ↓ {((FUNNEL[i + 1].count / f.count) * 100).toFixed(0)}%
//                       </span>
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </Card>

//           <Card className="p-5">
//             <h3 className="font-bold text-sm mb-1" style={{ color: 'var(--text)' }}>Revenue Trend</h3>
//             <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>Monthly revenue — all time</p>
//             <ResponsiveContainer width="100%" height={220}>
//               <LineChart data={REVENUE_TREND}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
//                 <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
//                 <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false}
//                   tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
//                 <Tooltip content={<CustomTooltip />} />
//                 <Line type="monotone" dataKey="revenue" stroke="var(--accent)" strokeWidth={2} dot={{ r: 3 }} name="Revenue (₹)" />
//               </LineChart>
//             </ResponsiveContainer>
//           </Card>
//         </div>

//         {/* §6 Bundle Revenue Analytics */}
//         <Card className="p-5">
//           <h3 className="font-bold text-sm mb-1" style={{ color: 'var(--text)' }}>§6 Bundle & Revenue Analytics</h3>
//           <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>Tracked separately for Foundation, Advance, and Mastery</p>
//           <div className="overflow-x-auto">
//             <table className="w-full text-sm border-collapse">
//               <thead>
//                 <tr style={{ background: 'var(--bg)' }}>
//                   {['Metric', 'Foundation', 'Advance', 'Mastery'].map(h => (
//                     <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold uppercase tracking-wider border-b"
//                       style={{ color: 'var(--text-muted)', borderColor: 'var(--border)' }}>{h}</th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {[
//                   ['Card Views', ...BUNDLE_ANALYTICS.map(b => b.cardViews)],
//                   ['Buy Button Clicks', ...BUNDLE_ANALYTICS.map(b => b.buyClicks)],
//                   ['Checkout Starts', ...BUNDLE_ANALYTICS.map(b => b.checkoutStarts)],
//                   ['Purchases', ...BUNDLE_ANALYTICS.map(b => b.purchases)],
//                   ['Revenue Today', ...BUNDLE_ANALYTICS.map(b => `₹${b.revToday.toLocaleString('en-IN')}`)],
//                   ['Revenue This Week', ...BUNDLE_ANALYTICS.map(b => `₹${b.revWeek.toLocaleString('en-IN')}`)],
//                   ['Revenue This Month', ...BUNDLE_ANALYTICS.map(b => `₹${b.revMonth.toLocaleString('en-IN')}`)],
//                   ['Revenue All-Time', ...BUNDLE_ANALYTICS.map(b => `₹${b.revAllTime.toLocaleString('en-IN')}`)],
//                 ].map((row, i) => (
//                   <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}
//                     onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--bg)'}
//                     onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
//                     {row.map((cell, j) => (
//                       <td key={j} className="px-4 py-2.5 text-xs" style={{ color: j === 0 ? 'var(--text-muted)' : 'var(--text)', fontWeight: j === 0 ? 400 : 600 }}>{cell}</td>
//                     ))}
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </Card>

//         {/* §4 Free Test Funnel */}
//         <Card className="p-5">
//           <h3 className="font-bold text-sm mb-1" style={{ color: 'var(--text)' }}>§4 Free Test Funnel</h3>
//           <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>Tracked separately for Mathematics, English, and Science</p>
//           <div className="overflow-x-auto">
//             <table className="w-full text-sm border-collapse">
//               <thead>
//                 <tr style={{ background: 'var(--bg)' }}>
//                   {['Subject', 'Page Views', 'Test Starts', 'Completions', 'Completion Rate', 'Avg Score', 'High Score', 'Low Score'].map(h => (
//                     <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold uppercase tracking-wider border-b"
//                       style={{ color: 'var(--text-muted)', borderColor: 'var(--border)' }}>{h}</th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {SUBJECT_FUNNEL.map((s, i) => (
//                   <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}
//                     onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--bg)'}
//                     onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
//                     <td className="px-4 py-2.5 text-xs font-semibold" style={{ color: 'var(--text)' }}>{s.subject}</td>
//                     <td className="px-4 py-2.5 text-xs" style={{ color: 'var(--text-muted)' }}>{s.pageViews}</td>
//                     <td className="px-4 py-2.5 text-xs" style={{ color: 'var(--text-muted)' }}>{s.starts}</td>
//                     <td className="px-4 py-2.5 text-xs" style={{ color: 'var(--text-muted)' }}>{s.completions}</td>
//                     <td className="px-4 py-2.5 text-xs">
//                       <div className="flex items-center gap-2">
//                         <div className="h-1.5 w-12 rounded-full overflow-hidden" style={{ background: 'var(--bg)' }}>
//                           <div className="h-full rounded-full" style={{ width: `${(s.completions / s.starts) * 100}%`, background: 'var(--accent)' }} />
//                         </div>
//                         <span style={{ color: 'var(--text-muted)' }}>{((s.completions / s.starts) * 100).toFixed(0)}%</span>
//                       </div>
//                     </td>
//                     <td className="px-4 py-2.5 text-xs font-semibold" style={{ color: 'var(--accent)' }}>{s.avgScore}%</td>
//                     <td className="px-4 py-2.5 text-xs" style={{ color: 'var(--success)' }}>{s.highScore}%</td>
//                     <td className="px-4 py-2.5 text-xs" style={{ color: 'var(--danger)' }}>{s.lowScore}%</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </Card>

//         {/* §9 Test Performance */}
//         <Card className="p-5">
//           <h3 className="font-bold text-sm mb-1" style={{ color: 'var(--text)' }}>§9 Test Performance Analytics</h3>
//           <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>Per-test level stats (question-level deferred to v2)</p>
//           <div className="overflow-x-auto">
//             <table className="w-full text-sm border-collapse">
//               <thead>
//                 <tr style={{ background: 'var(--bg)' }}>
//                   {['Test', 'Attempts', 'Completions', 'Avg Score', 'Avg Time'].map(h => (
//                     <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold uppercase tracking-wider border-b"
//                       style={{ color: 'var(--text-muted)', borderColor: 'var(--border)' }}>{h}</th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {TEST_PERF.map((t, i) => (
//                   <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}
//                     onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--bg)'}
//                     onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
//                     <td className="px-4 py-2.5 text-xs font-semibold" style={{ color: 'var(--text)' }}>{t.name}</td>
//                     <td className="px-4 py-2.5 text-xs" style={{ color: 'var(--text-muted)' }}>{t.attempts}</td>
//                     <td className="px-4 py-2.5 text-xs" style={{ color: 'var(--text-muted)' }}>{t.completions}</td>
//                     <td className="px-4 py-2.5 text-xs">
//                       <div className="flex items-center gap-2">
//                         <div className="h-1.5 w-12 rounded-full overflow-hidden" style={{ background: 'var(--bg)' }}>
//                           <div className="h-full rounded-full" style={{ width: `${t.avgScore}%`, background: 'var(--accent)' }} />
//                         </div>
//                         <span style={{ color: 'var(--text-muted)' }}>{t.avgScore}%</span>
//                       </div>
//                     </td>
//                     <td className="px-4 py-2.5 text-xs" style={{ color: 'var(--text-muted)' }}>{t.avgTime}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </Card>

//       </div>
//     </AdminLayout>
//   );
// }
