import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api/client';

const MOCK_GROUPS = [
  { id: '1', name: 'Smart Attendance System', members: ['Ali', 'Sara', 'Usman'] },
  { id: '2', name: 'Campus Navigation App', members: ['Fatima', 'Ahmed'] },
];

const MOCK_MESSAGES = [
  { id: 'm1', groupId: '1', senderId: 'u1', senderName: 'Ali', content: 'Hi everyone, let\'s finalize the module breakdown.', createdAt: '10:15 AM', isOwn: false },
  { id: 'm2', groupId: '1', senderId: 'u2', senderName: 'You', content: 'Sure, I think I can take the backend APIs.', createdAt: '10:16 AM', isOwn: true },
  { id: 'm3', groupId: '1', senderId: 'u3', senderName: 'Sara', content: 'I\'ll work on the UI screens.', createdAt: '10:17 AM', isOwn: false },
];

export default function Group() {
  const { user } = useAuth();
  const { groupId } = useParams();
  const [loading, setLoading] = useState(true);
  const [sessionOk, setSessionOk] = useState(false);
  const [canAccessGroup, setCanAccessGroup] = useState(false);
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [input, setInput] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileType, setFileType] = useState('');
  const fileInputRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    setSessionOk(false);
    setCanAccessGroup(false);

    if (!user?.token || !groupId) {
      setLoading(false);
      return;
    }

    api
      .get('/api/sessions/active-id')
      .then((sessionRes) => {
        const activeSessionId = sessionRes.data?.activeSessionId ?? null;
        const mySessionId = user?.sessionId ?? null;
        if (!activeSessionId || !mySessionId || String(activeSessionId) !== String(mySessionId)) {
          setSessionOk(false);
          setLoading(false);
          return;
        }
        setSessionOk(true);

        if (user?.role === 'Student') {
          return api
            .get('/api/students/me')
            .then((meRes) => {
              const studentGroupId = meRes.data?.student?.group_id ?? null;
              setCanAccessGroup(!!studentGroupId && String(studentGroupId) === String(groupId));
            })
            .catch(() => setCanAccessGroup(false));
        }
        if (user?.role === 'Supervisor') {
          return api
            .get('/api/supervisor/groups/own')
            .then((groupsRes) => {
              const groups = groupsRes.data?.groups ?? [];
              const belongs = groups.some((g) => String(g._id) === String(groupId));
              setCanAccessGroup(belongs);
            })
            .catch(() => setCanAccessGroup(false));
        }
        setCanAccessGroup(false);
      })
      .catch(() => {
        setSessionOk(false);
      })
      .finally(() => setLoading(false));
  }, [user?.token, user?.sessionId, user?.role, groupId]);

  const group = useMemo(
    () => MOCK_GROUPS.find((g) => g.id === groupId) ?? MOCK_GROUPS[0],
    [groupId]
  );

  const visibleMessages = useMemo(
    () => messages.filter((m) => m.groupId === group.id),
    [messages, group.id]
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [visibleMessages.length]);

  const handleSend = () => {
    const text = input.trim();
    if (!text && !fileName) return;
    const now = new Date();
    const newMessage = {
      id: `local-${now.getTime()}`,
      groupId: group.id,
      senderId: 'you',
      senderName: 'You',
      content: text || (fileName ? `Sent a file: ${fileName}` : ''),
      createdAt: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isOwn: true,
      fileName: fileName || undefined,
      fileType: fileType || undefined,
    };
    setMessages((prev) => [...prev, newMessage]);
    setInput('');
    setFileName('');
    setFileType('');
  };

  const handleFileClick = () => fileInputRef.current?.click();

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setFileType(file.type?.startsWith('image/') ? 'image' : file.type || 'file');
    e.target.value = '';
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto mt-6">
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-12 text-center">
          <div className="inline-block w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" aria-hidden />
          <p className="mt-4 text-gray-600 text-sm">Loading…</p>
        </div>
      </div>
    );
  }

  if (!sessionOk) {
    return (
      <div className="max-w-4xl mx-auto mt-6">
        <div className="rounded-xl border border-amber-200 bg-amber-50/50 shadow-sm p-8 text-center">
          <p className="text-amber-800 font-medium">Your session is not active.</p>
        </div>
      </div>
    );
  }

  if (!canAccessGroup) {
    return (
      <div className="max-w-4xl mx-auto mt-6">
        <div className="rounded-xl border border-red-200 bg-red-50/50 shadow-sm p-8 text-center">
          <p className="text-red-800 font-medium">You cannot access this group chat.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 rounded-2xl border border-gray-200 bg-white shadow-sm flex flex-col h-[70vh] max-h-[600px]">
      {/* Header */}
      <header className="px-4 sm:px-5 py-3 border-b border-gray-200 flex items-center gap-3 flex-shrink-0">
        <div className="flex-shrink-0 w-9 h-9 rounded-full bg-accent/10 flex items-center justify-center text-accent font-semibold text-sm">
          {group.name?.[0] ?? 'G'}
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-sm sm:text-base font-semibold text-gray-900 truncate">
            {group.name ?? 'Group chat'}
          </h2>
          <p className="text-xs text-gray-500 truncate">
            {group.members?.length ? group.members.join(', ') : 'Members'}
          </p>
        </div>
      </header>

      {/* Messages list */}
      <div className="flex-1 min-h-0 overflow-y-auto px-3 sm:px-4 py-3 bg-gray-50">
        {visibleMessages.map((m) => (
          <div
            key={m.id}
            className={`mb-2 flex ${m.isOwn ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm shadow-sm ${
                m.isOwn
                  ? 'bg-accent text-white rounded-br-sm'
                  : 'bg-white text-gray-900 rounded-bl-sm border border-gray-200'
              }`}
            >
              {!m.isOwn && (
                <p className="text-[11px] font-semibold text-accent mb-0.5">
                  {m.senderName}
                </p>
              )}
              <p className="whitespace-pre-wrap break-words">{m.content}</p>
              <p
                className={`mt-1 text-[10px] ${m.isOwn ? 'text-white/80' : 'text-gray-400'}`}
              >
                {m.createdAt}
              </p>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Message bar */}
      <div className="px-3 sm:px-4 py-2.5 border-t border-gray-200 bg-white flex items-end gap-2 flex-shrink-0">
        <button
          type="button"
          onClick={handleFileClick}
          className="flex-shrink-0 w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-accent/20"
          aria-label="Attach file"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileChange}
        />
        <div className="flex-1 min-w-0 flex flex-col gap-1">
          {fileName && (
            <p className="text-[11px] text-gray-500 truncate">Attached: {fileName}</p>
          )}
          <textarea
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message"
            className="w-full resize-none rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
        </div>
        <button
          type="button"
          onClick={handleSend}
          disabled={!input.trim() && !fileName}
          className="flex-shrink-0 w-9 h-9 rounded-full bg-accent text-white flex items-center justify-center hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-accent/30 disabled:opacity-60 disabled:cursor-not-allowed"
          aria-label="Send"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4l16 8-16 8 4-8-4-8z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
