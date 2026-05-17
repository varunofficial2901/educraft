import { useState, useEffect } from 'react';
import { dashboardAPI } from '../api';
import { C, Card, Spinner, Empty, Badge, Avatar } from '../components/UI';

function StatCard({ icon, label, value, delta, color }) {
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: '20px 22px', transition: 'border-color 0.2s, transform 0.2s' }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = C.borderLight; e.currentTarget.style.transform = 'translateY(-2px)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.transform = 'none'; }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ width: 42, height: 42, borderRadius: 11, background: color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>{icon}</div>
        {delta != null && <span style={{ fontSize: 11, color: C.success, background: '#0d2418', border: '1px solid #1a3d28', borderRadius: 6, padding: '2px 8px', fontWeight: 700 }}>+{delta}%</span>}
      </div>
      <div style={{ fontSize: 30, fontWeight: 800, color: C.text, fontFamily: 'Georgia, serif', lineHeight: 1 }}>{(value || 0).toLocaleString()}</div>
      <div style={{ fontSize: 13, color: C.textMuted, marginTop: 6 }}>{label}</div>
    </div>
  );
}

function BarChart({ data }) {
  const max = Math.max(...data.map(d => d.count), 1);
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return (
    <Card style={{ padding: 22 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <span style={{ color: C.text, fontWeight: 700, fontFamily: 'Georgia, serif', fontSize: 15 }}>Enrollment Trend</span>
        <span style={{ color: C.textMuted, fontSize: 12 }}>Last 6 months</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 110 }}>
        {data.map((d, i) => (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 10, color: C.textDim, fontWeight: 600 }}>{d.count}</span>
            <div style={{ width: '100%', height: Math.max(Math.round((d.count / max) * 80), 4) + 'px', background: i === data.length - 1 ? C.accent : C.accent + '55', borderRadius: '5px 5px 0 0', transition: 'height 0.5s ease', boxShadow: i === data.length - 1 ? `0 0 12px ${C.accent}44` : 'none' }} />
            <span style={{ fontSize: 10, color: C.textDim }}>{months[(d._id?.month - 1)] || '?'}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

function DonutChart({ data }) {
  if (!data || data.length === 0) return null;
  const colors = [C.accent, C.success, '#7c5cbf', C.warning, C.info];
  const total = data.reduce((s, d) => s + d.count, 0) || 1;
  let offset = 0;
  const R = 40, circumference = 2 * Math.PI * R;
  return (
    <Card style={{ padding: 22 }}>
      <div style={{ fontSize: 15, fontWeight: 700, color: C.text, fontFamily: 'Georgia, serif', marginBottom: 18 }}>Course Distribution</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <svg width={100} height={100} viewBox="-50 -50 100 100" style={{ transform: 'rotate(-90deg)', flexShrink: 0 }}>
          {data.map((d, i) => {
            const pct = d.count / total;
            const dash = pct * circumference;
            const el = <circle key={i} cx={0} cy={0} r={R} fill="none" stroke={colors[i % colors.length]} strokeWidth={18}
              strokeDasharray={`${dash} ${circumference - dash}`} strokeDashoffset={-offset * circumference} />;
            offset += pct;
            return el;
          })}
          <circle cx={0} cy={0} r={30} fill={C.card} />
        </svg>
        <div style={{ flex: 1 }}>
          {data.map((d, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 9 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: colors[i % colors.length], flexShrink: 0 }} />
                <span style={{ fontSize: 12, color: C.textMuted, maxWidth: 110, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.course?.title?.split(' ').slice(0, 2).join(' ') || 'Course'}</span>
              </div>
              <span style={{ fontSize: 12, color: C.text, fontWeight: 700 }}>{d.count}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

export default function Dashboard({ onNav }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardAPI.get()
      .then(res => setData(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner center />;
  if (!data) return <Empty icon="⚠️" text="Failed to load dashboard data." />;

  const { stats, recentEnrollments, recentMessages, courseStats, monthlyTrend } = data;

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ margin: '0 0 4px', color: C.text, fontFamily: 'Georgia, serif', fontSize: 26, fontWeight: 700 }}>Dashboard</h1>
        <p style={{ margin: 0, color: C.textMuted, fontSize: 14 }}>Welcome back — here's your platform overview</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14, marginBottom: 22 }}>
        <StatCard icon="◫" label="Total Courses" value={stats.courses} delta={8} color={C.accent} />
        <StatCard icon="◉" label="Total Students" value={stats.students} delta={12} color={C.success} />
        <StatCard icon="◈" label="Enrollments" value={stats.enrollments} delta={18} color="#7c5cbf" />
        <StatCard icon="⊟" label="Test Papers" value={stats.papers} color={C.warning} />
        <StatCard icon="◻" label="Messages" value={stats.messages} color={C.info} />
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 22 }}>
        <div style={{ gridColumn: 'span 2' }}>
          <BarChart data={monthlyTrend.length ? monthlyTrend : [{ _id: { month: 1 }, count: 0 }]} />
        </div>
        <DonutChart data={courseStats} />
      </div>

      {/* Recent lists */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        {/* Recent Enrollments */}
        <Card style={{ padding: 22 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: C.text, fontFamily: 'Georgia, serif' }}>Recent Enrollments</span>
            <button onClick={() => onNav('enrollments')} style={{ background: 'none', border: 'none', color: C.accent, fontSize: 12, cursor: 'pointer', padding: 0, fontFamily: 'inherit' }}>View all →</button>
          </div>
          {recentEnrollments.length === 0 ? <Empty text="No enrollments yet" /> : recentEnrollments.map(e => (
            <div key={e._id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '9px 0', borderBottom: `1px solid ${C.border}` }}>
              <Avatar name={e.studentName} size={34} color={C.accent} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, color: C.text, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.studentName}</div>
                <div style={{ fontSize: 11, color: C.textMuted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.course?.title || '—'}</div>
              </div>
              <Badge type={e.paymentStatus}>{e.paymentStatus}</Badge>
            </div>
          ))}
        </Card>

        {/* Recent Messages */}
        <Card style={{ padding: 22 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: C.text, fontFamily: 'Georgia, serif' }}>Recent Messages</span>
            <button onClick={() => onNav('messages')} style={{ background: 'none', border: 'none', color: C.accent, fontSize: 12, cursor: 'pointer', padding: 0, fontFamily: 'inherit' }}>View all →</button>
          </div>
          {recentMessages.length === 0 ? <Empty text="No messages yet" /> : recentMessages.map(m => (
            <div key={m._id} style={{ padding: '10px 0', borderBottom: `1px solid ${C.border}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  {!m.read && <div style={{ width: 7, height: 7, borderRadius: '50%', background: C.accent, flexShrink: 0 }} />}
                  <span style={{ fontSize: 13, fontWeight: m.read ? 400 : 700, color: C.text }}>{m.name}</span>
                </div>
                <Badge type={m.read ? 'read' : 'unread'}>{m.read ? 'read' : 'new'}</Badge>
              </div>
              <p style={{ margin: 0, fontSize: 12, color: C.textMuted, lineHeight: 1.5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{m.message}</p>
            </div>
          ))}
          <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
            <button onClick={() => onNav('courses')} style={{ background: C.accent, border: 'none', borderRadius: 8, padding: '7px 14px', color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>➕ Add Course</button>
            <button onClick={() => onNav('enrollments')} style={{ background: 'transparent', border: `1px solid ${C.border}`, borderRadius: 8, padding: '7px 14px', color: C.textMuted, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>View Enrollments</button>
          </div>
        </Card>
      </div>
    </div>
  );
}
