import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { messagesAPI } from './api';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import Papers from './pages/Papers';
import Enrollments from './pages/Enrollments';
import Students from './pages/Students';
import Messages from './pages/Messages';
import { Settings, LoginPage } from './pages/Settings';
import { C, Spinner } from './components/UI';

const styles = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: ${C.bg}; color: ${C.text}; }
  @keyframes slideIn { from { transform: translateX(20px); opacity: 0; } to { transform: none; opacity: 1; } }
  @keyframes fadeIn { from { opacity: 0; transform: scale(0.97); } to { opacity: 1; transform: none; } }
  @keyframes spin { to { transform: rotate(360deg); } }
  ::-webkit-scrollbar { width: 5px; height: 5px; }
  ::-webkit-scrollbar-track { background: ${C.bg}; }
  ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: ${C.borderLight}; }
  select option { background: #17171f; }
  a { color: ${C.accent}; }
`;

function AdminLayout() {
  const { admin, loading } = useAuth();
  const [page, setPage] = useState('dashboard');
  const [collapsed, setCollapsed] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (admin) {
      messagesAPI.getAll({ limit: 1 })
        .then(res => setUnread(res.data.unreadCount || 0))
        .catch(() => {});
    }
  }, [admin, page]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: C.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, margin: '0 auto 16px' }}>✦</div>
          <Spinner center />
        </div>
      </div>
    );
  }

  if (!admin) return <LoginPage />;

  const navigate = (p) => { setPage(p); setSelectedCourse(null); };

  const renderPage = () => {
    if (page === 'courses' && selectedCourse) {
      return <CourseDetail course={selectedCourse} onBack={() => setSelectedCourse(null)} />;
    }
    switch (page) {
      case 'dashboard':   return <Dashboard onNav={navigate} />;
      case 'courses':     return <Courses onSelectCourse={c => { setSelectedCourse(c); }} />;
      case 'papers':      return <Papers />;
      case 'enrollments': return <Enrollments />;
      case 'students':    return <Students />;
      case 'messages':    return <Messages />;
      case 'settings':    return <Settings />;
      default:            return <Dashboard onNav={navigate} />;
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: C.bg, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <Sidebar active={page} onNav={navigate} collapsed={collapsed} unread={unread} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
        {/* Topbar */}
        <header style={{ background: C.bgSec, borderBottom: `1px solid ${C.border}`, padding: '0 24px', height: 58, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <button onClick={() => setCollapsed(c => !c)}
            style={{ background: 'none', border: 'none', color: C.textMuted, cursor: 'pointer', fontSize: 20, padding: '4px 6px', borderRadius: 7, transition: 'color 0.15s' }}
            onMouseEnter={e => e.target.style.color = C.text} onMouseLeave={e => e.target.style.color = C.textMuted}>
            ☰
          </button>

          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: C.textMuted }}>
            <span>EduAdmin</span>
            <span style={{ color: C.textDim }}>/</span>
            <span style={{ color: C.text, fontWeight: 600, textTransform: 'capitalize' }}>
              {page === 'courses' && selectedCourse ? selectedCourse.title : page}
            </span>
          </div>

          {/* Admin info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {unread > 0 && (
              <button onClick={() => navigate('messages')}
                style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px', borderRadius: 8, color: C.textMuted, fontSize: 18 }}>
                ◻
                <span style={{ position: 'absolute', top: 0, right: 0, width: 16, height: 16, background: C.accent, borderRadius: '50%', fontSize: 10, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>{unread > 9 ? '9+' : unread}</span>
              </button>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer', padding: '4px 10px', borderRadius: 9, border: `1px solid ${C.border}`, transition: 'border-color 0.15s' }}
              onClick={() => navigate('settings')}
              onMouseEnter={e => e.currentTarget.style.borderColor = C.borderLight}
              onMouseLeave={e => e.currentTarget.style.borderColor = C.border}>
              <div style={{ width: 30, height: 30, borderRadius: '50%', background: C.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, color: '#fff', fontWeight: 800 }}>
                {admin?.name?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div>
                <div style={{ fontSize: 13, color: C.text, fontWeight: 600, lineHeight: 1.2 }}>{admin?.name}</div>
                <div style={{ fontSize: 10, color: C.textDim, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Administrator</div>
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main style={{ flex: 1, padding: 28, overflowY: 'auto' }}>
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <>
      <style>{styles}</style>
      <AuthProvider>
        <AdminLayout />
      </AuthProvider>
    </>
  );
}
