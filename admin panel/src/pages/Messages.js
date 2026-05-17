






import { useState, useEffect, useCallback } from 'react';
import { messagesAPI } from '../api';
import { C, Badge, Spinner, Empty, SearchBar, PageHeader, Confirm, Card, useToast, Toast } from '../components/UI';

function MessageItem({ msg, selected, onClick, onDelete }) {
  return (
    <div onClick={onClick}
      style={{ padding: '14px 18px', borderBottom: `1px solid ${C.border}`, cursor: 'pointer', background: selected ? C.accentGlow : 'transparent', transition: 'background 0.1s', borderLeft: selected ? `3px solid ${C.accent}` : '3px solid transparent' }}
      onMouseEnter={e => { if (!selected) e.currentTarget.style.background = C.cardHover; }}
      onMouseLeave={e => { if (!selected) e.currentTarget.style.background = 'transparent'; }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 5 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {!msg.read && <div style={{ width: 7, height: 7, borderRadius: '50%', background: C.accent, flexShrink: 0 }} />}
          <span style={{ fontSize: 14, fontWeight: msg.read ? 400 : 700, color: C.text }}>{msg.name}</span>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
          <span style={{ fontSize: 11, color: C.textDim }}>{new Date(msg.createdAt).toLocaleDateString()}</span>
          <button onClick={e => { e.stopPropagation(); onDelete(); }}
            style={{ background: 'none', border: 'none', color: C.danger, cursor: 'pointer', fontSize: 14, padding: '2px 5px', borderRadius: 4, opacity: 0.7, transition: 'opacity 0.15s' }}
            onMouseEnter={e => e.target.style.opacity = 1} onMouseLeave={e => e.target.style.opacity = 0.7}>✕</button>
        </div>
      </div>
      <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 4 }}>{msg.email}</div>
      <p style={{ margin: 0, fontSize: 12, color: C.textDim, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', lineHeight: 1.5 }}>{msg.message}</p>
    </div>
  );
}

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [confirmDel, setConfirmDel] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const { toasts, add: toast } = useToast();

  const load = useCallback(() => {
    setLoading(true);
    const params = {};
    if (search) params.search = search;
    messagesAPI.getAll(params)
      .then(res => {
        setMessages(res.data.data);
        setUnreadCount(res.data.unreadCount);
      })
      .catch(() => toast('Failed to load messages', 'danger'))
      .finally(() => setLoading(false));
  }, [search]);

  useEffect(load, [load]);

  const handleSelect = async (msg) => {
    setSelected(msg);
    if (!msg.read) {
      try {
        await messagesAPI.markRead(msg._id);
        setMessages(msgs => msgs.map(m => m._id === msg._id ? { ...m, read: true } : m));
        setUnreadCount(c => Math.max(0, c - 1));
      } catch {}
    }
  };

  const handleDelete = async () => {
    try {
      await messagesAPI.delete(confirmDel);
      toast('Message deleted', 'danger');
      if (selected?._id === confirmDel) setSelected(null);
      setConfirmDel(null);
      load();
    } catch {
      toast('Failed to delete message', 'danger');
    }
  };

  const handleMarkUnread = async (id) => {
    try {
      await messagesAPI.markUnread(id);
      toast('Marked as unread');
      load();
    } catch {}
  };

  return (
    <div>
      <PageHeader title="Messages" subtitle={`${unreadCount} unread message${unreadCount !== 1 ? 's' : ''}`} />

      <div style={{ marginBottom: 14 }}>
        <SearchBar value={search} onChange={v => setSearch(v)} placeholder="Search by name, email, or message content..." />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 1.1fr' : '1fr', gap: 14 }}>
        {/* Message list */}
        <Card style={{ overflow: 'hidden', maxHeight: '70vh', display: 'flex', flexDirection: 'column' }}>
          <div style={{ overflowY: 'auto', flex: 1 }}>
            {loading ? <Spinner center /> : messages.length === 0 ? (
              <Empty icon="📭" text="No messages found." />
            ) : messages.map(m => (
              <MessageItem key={m._id} msg={m} selected={selected?._id === m._id}
                onClick={() => handleSelect(m)}
                onDelete={() => setConfirmDel(m._id)} />
            ))}
          </div>
        </Card>

        {/* Message detail */}
        {selected && (
          <Card style={{ padding: 24, maxHeight: '70vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: C.accent + '33', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, color: C.accent, fontWeight: 800, flexShrink: 0 }}>
                {selected.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <button onClick={() => setSelected(null)}
                style={{ background: 'none', border: 'none', color: C.textMuted, cursor: 'pointer', fontSize: 20, lineHeight: 1, padding: '0 4px' }}>×</button>
            </div>

            <h3 style={{ margin: '0 0 6px', color: C.text, fontSize: 17, fontFamily: 'Georgia, serif', fontWeight: 700 }}>{selected.name}</h3>
            <a href={`mailto:${selected.email}`} style={{ display: 'block', color: C.accent, fontSize: 13, marginBottom: 4, textDecoration: 'none' }}>{selected.email}</a>
            {selected.phone && <p style={{ margin: '0 0 16px', color: C.textMuted, fontSize: 13 }}>📞 {selected.phone}</p>}

            <div style={{ background: '#0f0f18', borderRadius: 10, padding: '16px 18px', marginBottom: 18, border: `1px solid ${C.border}` }}>
              <p style={{ margin: 0, fontSize: 14, color: C.text, lineHeight: 1.75 }}>{selected.message}</p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 12, color: C.textDim }}>{new Date(selected.createdAt).toLocaleString()}</span>
              <div style={{ display: 'flex', gap: 8 }}>
                <a href={`mailto:${selected.email}?subject=Re: Your Message&body=Hi ${selected.name},%0D%0A%0D%0A`}
                  style={{ background: '#0d2418', border: '1px solid #1a3d28', borderRadius: 7, padding: '6px 12px', color: C.success, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  ✉ Reply
                </a>
                <button onClick={() => handleMarkUnread(selected._id)}
                  style={{ background: 'none', border: `1px solid ${C.border}`, borderRadius: 7, padding: '6px 12px', color: C.textMuted, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>
                  Mark Unread
                </button>
                <button onClick={() => setConfirmDel(selected._id)}
                  style={{ background: '#2a1418', border: '1px solid #3a1c22', borderRadius: 7, padding: '6px 12px', color: C.danger, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>
                  Delete
                </button>
              </div>
            </div>
          </Card>
        )}
      </div>

      <Confirm open={!!confirmDel} onClose={() => setConfirmDel(null)} onConfirm={handleDelete}
        message="Delete this message permanently?" confirmLabel="Delete Message" />

      <Toast toasts={toasts} />
    </div>
  );
}



















// import { useState, useEffect, useCallback } from 'react';
// import { messagesAPI } from '../api';
// import { C, Badge, Spinner, Empty, SearchBar, PageHeader, Confirm, Card, useToast, Toast } from '../components/UI';

// function MessageItem({ msg, selected, onClick, onDelete }) {
//   return (
//     <div onClick={onClick}
//       style={{ padding: '14px 18px', borderBottom: `1px solid ${C.border}`, cursor: 'pointer', background: selected ? C.accentGlow : 'transparent', transition: 'background 0.1s', borderLeft: selected ? `3px solid ${C.accent}` : '3px solid transparent' }}
//       onMouseEnter={e => { if (!selected) e.currentTarget.style.background = C.cardHover; }}
//       onMouseLeave={e => { if (!selected) e.currentTarget.style.background = 'transparent'; }}>
//       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 5 }}>
//         <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
//           {!msg.read && <div style={{ width: 7, height: 7, borderRadius: '50%', background: C.accent, flexShrink: 0 }} />}
//           <span style={{ fontSize: 14, fontWeight: msg.read ? 400 : 700, color: C.text }}>{msg.name}</span>
//         </div>
//         <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
//           <span style={{ fontSize: 11, color: C.textDim }}>{new Date(msg.createdAt).toLocaleDateString()}</span>
//           <button onClick={e => { e.stopPropagation(); onDelete(); }}
//             style={{ background: 'none', border: 'none', color: C.danger, cursor: 'pointer', fontSize: 14, padding: '2px 5px', borderRadius: 4, opacity: 0.7, transition: 'opacity 0.15s' }}
//             onMouseEnter={e => e.target.style.opacity = 1} onMouseLeave={e => e.target.style.opacity = 0.7}>✕</button>
//         </div>
//       </div>
//       <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 4 }}>{msg.email}</div>
//       <p style={{ margin: 0, fontSize: 12, color: C.textDim, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', lineHeight: 1.5 }}>{msg.message}</p>
//     </div>
//   );
// }

// export default function Messages() {
//   const [messages, setMessages] = useState([]);
//   const [selected, setSelected] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [search, setSearch] = useState('');
//   const [confirmDel, setConfirmDel] = useState(null);
//   const [unreadCount, setUnreadCount] = useState(0);
//   const { toasts, add: toast } = useToast();

//   const load = useCallback(() => {
//     setLoading(true);
//     const params = {};
//     if (search) params.search = search;
//     messagesAPI.getAll(params)
//       .then(res => {
//         setMessages(res.data.data);
//         setUnreadCount(res.data.unreadCount);
//       })
//       .catch(() => toast('Failed to load messages', 'danger'))
//       .finally(() => setLoading(false));
//   }, [search]);

//   useEffect(load, [load]);

//   const handleSelect = async (msg) => {
//     setSelected(msg);
//     if (!msg.read) {
//       try {
//         await messagesAPI.markRead(msg._id);
//         setMessages(msgs => msgs.map(m => m._id === msg._id ? { ...m, read: true } : m));
//         setUnreadCount(c => Math.max(0, c - 1));
//       } catch {}
//     }
//   };

//   const handleDelete = async () => {
//     try {
//       await messagesAPI.delete(confirmDel);
//       toast('Message deleted', 'danger');
//       if (selected?._id === confirmDel) setSelected(null);
//       setConfirmDel(null);
//       load();
//     } catch {
//       toast('Failed to delete message', 'danger');
//     }
//   };

//   const handleMarkUnread = async (id) => {
//     try {
//       await messagesAPI.markUnread(id);
//       toast('Marked as unread');
//       load();
//     } catch {}
//   };

//   return (
//     <div>
//       <PageHeader title="Messages" subtitle={`${unreadCount} unread message${unreadCount !== 1 ? 's' : ''}`} />

//       <div style={{ marginBottom: 14 }}>
//         <SearchBar value={search} onChange={v => setSearch(v)} placeholder="Search by name, email, or message content..." />
//       </div>

//       <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 1.1fr' : '1fr', gap: 14 }}>
//         {/* Message list */}
//         <Card style={{ overflow: 'hidden', maxHeight: '70vh', display: 'flex', flexDirection: 'column' }}>
//           <div style={{ overflowY: 'auto', flex: 1 }}>
//             {loading ? <Spinner center /> : messages.length === 0 ? (
//               <Empty icon="📭" text="No messages found." />
//             ) : messages.map(m => (
//               <MessageItem key={m._id} msg={m} selected={selected?._id === m._id}
//                 onClick={() => handleSelect(m)}
//                 onDelete={() => setConfirmDel(m._id)} />
//             ))}
//           </div>
//         </Card>

//         {/* Message detail */}
//         {selected && (
//           <Card style={{ padding: 24, maxHeight: '70vh', overflowY: 'auto' }}>
//             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
//               <div style={{ width: 48, height: 48, borderRadius: '50%', background: C.accent + '33', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, color: C.accent, fontWeight: 800, flexShrink: 0 }}>
//                 {selected.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
//               </div>
//               <button onClick={() => setSelected(null)}
//                 style={{ background: 'none', border: 'none', color: C.textMuted, cursor: 'pointer', fontSize: 20, lineHeight: 1, padding: '0 4px' }}>×</button>
//             </div>

//             <h3 style={{ margin: '0 0 6px', color: C.text, fontSize: 17, fontFamily: 'Georgia, serif', fontWeight: 700 }}>{selected.name}</h3>
//             <a href={`mailto:${selected.email}`} style={{ display: 'block', color: C.accent, fontSize: 13, marginBottom: 4, textDecoration: 'none' }}>{selected.email}</a>
//             {selected.phone && <p style={{ margin: '0 0 16px', color: C.textMuted, fontSize: 13 }}>📞 {selected.phone}</p>}

//             <div style={{ background: '#0f0f18', borderRadius: 10, padding: '16px 18px', marginBottom: 18, border: `1px solid ${C.border}` }}>
//               <p style={{ margin: 0, fontSize: 14, color: C.text, lineHeight: 1.75 }}>{selected.message}</p>
//             </div>

//             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//               <span style={{ fontSize: 12, color: C.textDim }}>{new Date(selected.createdAt).toLocaleString()}</span>
//               <div style={{ display: 'flex', gap: 8 }}>
//                 <button onClick={() => handleMarkUnread(selected._id)}
//                   style={{ background: 'none', border: `1px solid ${C.border}`, borderRadius: 7, padding: '6px 12px', color: C.textMuted, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>
//                   Mark Unread
//                 </button>
//                 <button onClick={() => setConfirmDel(selected._id)}
//                   style={{ background: '#2a1418', border: '1px solid #3a1c22', borderRadius: 7, padding: '6px 12px', color: C.danger, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>
//                   Delete
//                 </button>
//               </div>
//             </div>
//           </Card>
//         )}
//       </div>

//       <Confirm open={!!confirmDel} onClose={() => setConfirmDel(null)} onConfirm={handleDelete}
//         message="Delete this message permanently?" confirmLabel="Delete Message" />

//       <Toast toasts={toasts} />
//     </div>
//   );
// }
