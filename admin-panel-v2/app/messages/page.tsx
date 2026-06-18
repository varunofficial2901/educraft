'use client';
// @ts-ignore
import { useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, Badge, Btn, Empty, Spinner, useToast, Toast } from '@/components/ui';
import { Search, Trash2, Mail, MailOpen } from 'lucide-react';
import { messagesApi, useApi, useMutation } from '@/lib';
import type { Message } from '@/lib';

const TYPE_MAP: Record<string, any> = {
  General: 'default', Bug: 'danger', Suggestion: 'info', Support: 'warning',
};

export default function MessagesPage() {
  const [search, setSearch]       = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [selected, setSelected]   = useState<Message | null>(null);
  const { toasts, add: toast }    = useToast();

  const { data, loading, refetch } = useApi(() => messagesApi.list({ search: search || undefined }), [search]);

  const { mutate: markRead }   = useMutation(messagesApi.markRead);
  const { mutate: markUnread } = useMutation(messagesApi.markUnread);
  const { mutate: deleteMsg }  = useMutation(messagesApi.delete);

  const messages: Message[] = data?.data || [];
  const unreadCount = data?.unread_count ?? 0;

  const types = ['All', 'General', 'Bug', 'Suggestion', 'Support'];
  const filtered = typeFilter === 'All' ? messages : messages.filter(m => m.type === typeFilter);

  const handleSelect = async (msg: Message) => {
    setSelected(msg);
    if (!msg.read) {
      await markRead(msg._id);
      refetch();
    }
  };

  const handleDelete = async (id: string) => {
    await deleteMsg(id);
    if (selected?._id === id) setSelected(null);
    toast('Message deleted', 'danger');
    refetch();
  };

  const handleMarkUnread = async (id: string) => {
    await markUnread(id);
    toast('Marked as unread');
    refetch();
  };

  return (
    <AdminLayout title="Messages">
      <div className="animate-fade-in space-y-4">
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          {unreadCount} unread message{unreadCount !== 1 ? 's' : ''}
        </p>

        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-48">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-dim)' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search messages..."
              className="w-full pl-8 pr-3 py-2.5 rounded-xl text-sm border outline-none"
              style={{ background: 'var(--bg-card)', borderColor: 'var(--border)', color: 'var(--text)' }} />
          </div>
          <div className="flex gap-2">
            {types.map(t => (
              <button key={t} onClick={() => setTypeFilter(t)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
                style={{ background: typeFilter === t ? 'var(--accent)' : 'var(--bg-card)', color: typeFilter === t ? '#fff' : 'var(--text-muted)', border: '1px solid var(--border)' }}>
                {t}
              </button>
            ))}
          </div>
        </div>

        {loading ? <Spinner center /> : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* List */}
            <Card className="overflow-hidden">
              <div className="overflow-y-auto" style={{ maxHeight: '60vh' }}>
                {filtered.length === 0 ? <Empty icon="📭" text="No messages found." /> : (
                  filtered.map(m => (
                    <div key={m._id} onClick={() => handleSelect(m)}
                      className="flex gap-3 p-4 cursor-pointer transition-all border-b"
                      style={{
                        borderColor: 'var(--border)',
                        background: selected?._id === m._id ? 'var(--accent-light)' : 'transparent',
                        borderLeft: selected?._id === m._id ? '3px solid var(--accent)' : '3px solid transparent',
                      }}>
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                        style={{ background: 'var(--accent)' }}>{m.name[0]}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          {!m.read && <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: 'var(--accent)' }} />}
                          <span className="text-sm font-semibold truncate" style={{ color: 'var(--text)' }}>{m.name}</span>
                          <Badge type={TYPE_MAP[m.type] || 'default'}>{m.type}</Badge>
                          <span className="text-xs ml-auto" style={{ color: 'var(--text-dim)' }}>
                            {m.created_at ? new Date(m.created_at).toLocaleDateString() : ''}
                          </span>
                        </div>
                        <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{m.message}</p>
                      </div>
                      <button onClick={e => { e.stopPropagation(); handleDelete(m._id); }}
                        className="flex-shrink-0 p-1 opacity-0 hover:opacity-100 transition-opacity"
                        style={{ color: 'var(--danger)' }}>
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </Card>

            {/* Detail */}
            {selected ? (
              <Card className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
                      style={{ background: 'var(--accent)' }}>{selected.name[0]}</div>
                    <div>
                      <p className="font-bold text-sm" style={{ color: 'var(--text)' }}>{selected.name}</p>
                      <a href={`mailto:${selected.email}`} className="text-xs" style={{ color: 'var(--accent)' }}>{selected.email}</a>
                    </div>
                  </div>
                  <button onClick={() => setSelected(null)} style={{ color: 'var(--text-muted)' }}>×</button>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <Badge type={TYPE_MAP[selected.type] || 'default'}>{selected.type}</Badge>
                  <span className="text-xs" style={{ color: 'var(--text-dim)' }}>
                    {selected.created_at ? new Date(selected.created_at).toLocaleString() : ''}
                  </span>
                </div>

                <div className="rounded-xl p-4 mb-4" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text)' }}>{selected.message}</p>
                </div>

                <div className="flex gap-2">
                  <a href={`mailto:${selected.email}?subject=Re: Your message on EduCraft`}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-white"
                    style={{ background: 'var(--accent)' }}>
                    <Mail size={13} /> Reply via Email
                  </a>
                  <Btn size="sm" variant="ghost" onClick={() => handleMarkUnread(selected._id)}>
                    <MailOpen size={13} /> Mark Unread
                  </Btn>
                  <Btn size="sm" variant="danger" onClick={() => handleDelete(selected._id)}>
                    <Trash2 size={13} /> Delete
                  </Btn>
                </div>
              </Card>
            ) : (
              <Card className="flex items-center justify-center min-h-[200px]">
                <Empty icon="💬" text="Select a message to read" />
              </Card>
            )}
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
// import { Card, Badge, Btn, Empty, useToast, Toast } from '@/components/ui';
// import { Search, Trash2, Mail, MailOpen } from 'lucide-react';

// const MOCK_MESSAGES = [
//   { _id: '1', name: 'Priya Sharma', email: 'priya@gmail.com', message: 'Amazing platform! The tests are very relevant to the syllabus. Keep it up!', type: 'General', read: false, date: '2026-06-07T10:30:00' },
//   { _id: '2', name: 'Arjun Kumar', email: 'arjun@gmail.com', message: 'Timer resets on page refresh — this is a bug, please fix it soon.', type: 'Bug', read: false, date: '2026-06-07T08:15:00' },
//   { _id: '3', name: 'Sneha Reddy', email: 'sneha@gmail.com', message: 'Can you add more reasoning tests? The current ones are too easy.', type: 'Suggestion', read: true, date: '2026-06-06T18:45:00' },
//   { _id: '4', name: 'Rahul Verma', email: 'rahul@gmail.com', message: 'I paid for the Advance bundle but still no access. Please help!', type: 'Support', read: false, date: '2026-06-06T14:20:00' },
//   { _id: '5', name: 'Anjali Patel', email: 'anjali@gmail.com', message: 'The analysis page is very helpful. Would love to see topic-wise breakdown.', type: 'Suggestion', read: true, date: '2026-06-05T11:00:00' },
// ];

// const TYPE_MAP: Record<string, any> = {
//   General: 'default', Bug: 'danger', Suggestion: 'info', Support: 'warning',
// };

// export default function MessagesPage() {
//   const [messages, setMessages] = useState(MOCK_MESSAGES);
//   const [selected, setSelected] = useState<any>(null);
//   const [search, setSearch] = useState('');
//   const [typeFilter, setTypeFilter] = useState('All');
//   const { toasts, add: toast } = useToast();

//   const types = ['All', 'General', 'Bug', 'Suggestion', 'Support'];
//   const filtered = messages
//     .filter(m => typeFilter === 'All' || m.type === typeFilter)
//     .filter(m => !search || m.name.toLowerCase().includes(search.toLowerCase()) || m.message.toLowerCase().includes(search.toLowerCase()));

//   const unread = messages.filter(m => !m.read).length;

//   const markRead = (id: string) => setMessages(ms => ms.map(m => m._id === id ? { ...m, read: true } : m));
//   const markUnread = (id: string) => setMessages(ms => ms.map(m => m._id === id ? { ...m, read: false } : m));
//   const deleteMsg = (id: string) => {
//     setMessages(ms => ms.filter(m => m._id !== id));
//     if (selected?._id === id) setSelected(null);
//     toast('Message deleted', 'danger');
//   };

//   const handleSelect = (msg: any) => {
//     setSelected(msg);
//     if (!msg.read) markRead(msg._id);
//   };

//   return (
//     <AdminLayout title="Messages">
//       <div className="animate-fade-in space-y-4">
//         <div className="flex items-center gap-3">
//           <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
//             {unread} unread message{unread !== 1 ? 's' : ''}
//           </p>
//         </div>

//         {/* Filters */}
//         <div className="flex flex-wrap gap-3">
//           <div className="relative flex-1 min-w-48">
//             <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-dim)' }} />
//             <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search messages..."
//               className="w-full pl-8 pr-3 py-2.5 rounded-xl text-sm border outline-none"
//               style={{ background: 'var(--bg-card)', borderColor: 'var(--border)', color: 'var(--text)' }} />
//           </div>
//           <div className="flex gap-2">
//             {types.map(t => (
//               <button key={t} onClick={() => setTypeFilter(t)}
//                 className="px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
//                 style={{ background: typeFilter === t ? 'var(--accent)' : 'var(--bg-card)', color: typeFilter === t ? '#fff' : 'var(--text-muted)', border: '1px solid var(--border)' }}>
//                 {t}
//               </button>
//             ))}
//           </div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
//           {/* Message List */}
//           <Card className="overflow-hidden">
//             <div className="overflow-y-auto" style={{ maxHeight: '60vh' }}>
//               {filtered.length === 0 ? <Empty icon="📭" text="No messages found." /> : (
//                 filtered.map(m => (
//                   <div key={m._id} onClick={() => handleSelect(m)}
//                     className="flex gap-3 p-4 cursor-pointer transition-all border-b"
//                     style={{
//                       borderColor: 'var(--border)',
//                       background: selected?._id === m._id ? 'var(--accent-light)' : 'transparent',
//                       borderLeft: selected?._id === m._id ? '3px solid var(--accent)' : '3px solid transparent',
//                     }}
//                     onMouseEnter={e => { if (selected?._id !== m._id) (e.currentTarget as HTMLElement).style.background = 'var(--bg)'; }}
//                     onMouseLeave={e => { if (selected?._id !== m._id) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}>
//                     <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
//                       style={{ background: 'var(--accent)' }}>{m.name[0]}</div>
//                     <div className="flex-1 min-w-0">
//                       <div className="flex items-center gap-2 mb-0.5">
//                         {!m.read && <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: 'var(--accent)' }} />}
//                         <span className="text-sm font-semibold truncate" style={{ color: 'var(--text)' }}>{m.name}</span>
//                         <Badge type={TYPE_MAP[m.type]}>{m.type}</Badge>
//                         <span className="text-xs ml-auto" style={{ color: 'var(--text-dim)' }}>
//                           {new Date(m.date).toLocaleDateString()}
//                         </span>
//                       </div>
//                       <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{m.message}</p>
//                     </div>
//                     <button onClick={e => { e.stopPropagation(); deleteMsg(m._id); }}
//                       className="flex-shrink-0 opacity-0 hover:opacity-100 transition-opacity p-1"
//                       style={{ color: 'var(--danger)' }}
//                       onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '1'}
//                       onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '0'}>
//                       <Trash2 size={13} />
//                     </button>
//                   </div>
//                 ))
//               )}
//             </div>
//           </Card>

//           {/* Message Detail */}
//           {selected ? (
//             <Card className="p-5">
//               <div className="flex items-start justify-between mb-4">
//                 <div className="flex gap-3">
//                   <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
//                     style={{ background: 'var(--accent)' }}>{selected.name[0]}</div>
//                   <div>
//                     <p className="font-bold text-sm" style={{ color: 'var(--text)' }}>{selected.name}</p>
//                     <a href={`mailto:${selected.email}`} className="text-xs" style={{ color: 'var(--accent)' }}>{selected.email}</a>
//                   </div>
//                 </div>
//                 <button onClick={() => setSelected(null)} style={{ color: 'var(--text-muted)' }}>×</button>
//               </div>

//               <div className="flex items-center gap-2 mb-4">
//                 <Badge type={TYPE_MAP[selected.type]}>{selected.type}</Badge>
//                 <span className="text-xs" style={{ color: 'var(--text-dim)' }}>{new Date(selected.date).toLocaleString()}</span>
//               </div>

//               <div className="rounded-xl p-4 mb-4" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
//                 <p className="text-sm leading-relaxed" style={{ color: 'var(--text)' }}>{selected.message}</p>
//               </div>

//               <div className="flex gap-2">
//                 <a href={`mailto:${selected.email}?subject=Re: Your message on EduCraft`}
//                   className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-white"
//                   style={{ background: 'var(--accent)' }}>
//                   <Mail size={13} /> Reply via Email
//                 </a>
//                 <Btn size="sm" variant="ghost" onClick={() => markUnread(selected._id)}>
//                   <MailOpen size={13} /> Mark Unread
//                 </Btn>
//                 <Btn size="sm" variant="danger" onClick={() => deleteMsg(selected._id)}>
//                   <Trash2 size={13} /> Delete
//                 </Btn>
//               </div>
//             </Card>
//           ) : (
//             <Card className="flex items-center justify-center" style={{ minHeight: '200px' }}>
//               <Empty icon="💬" text="Select a message to read" />
//             </Card>
//           )}
//         </div>
//       </div>
//       <Toast toasts={toasts} />
//     </AdminLayout>
//   );
// }
