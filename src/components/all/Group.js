import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api/client';

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
  const [groupInfo, setGroupInfo] = useState(null);
  const [groupDetailsLoading, setGroupDetailsLoading] = useState(false);
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [input, setInput] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileType, setFileType] = useState('');
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const toastTimerRef = useRef(null);
  const fileInputRef = useRef(null);
  const bottomRef = useRef(null);

  const showToast = useCallback((message, type = 'success') => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ show: true, message, type });
    toastTimerRef.current = setTimeout(() => {
      setToast((t) => ({ ...t, show: false }));
      toastTimerRef.current = null;
    }, 3000);
  }, []);

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

  // Fetch real group name and member names when user has access (for header).
  useEffect(() => {
    if (!canAccessGroup || !groupId || !user?.token) {
      setGroupInfo(null);
      return;
    }
    setGroupDetailsLoading(true);
    api
      .get(`/api/groups/details/${groupId}`)
      .then((res) => {
        const g = res.data?.group;
        setGroupInfo(
          g
            ? {
                ideaName: g.ideaName ?? '',
                memberNames: Array.isArray(g.memberNames) ? g.memberNames : [],
                supervisorName: g.supervisorName ?? '',
              }
            : null
        );
      })
      .catch(() => setGroupInfo(null))
      .finally(() => setGroupDetailsLoading(false));
  }, [canAccessGroup, groupId, user?.token]);

  const groupName = groupInfo?.ideaName ?? (groupDetailsLoading ? 'Loading…' : 'Group chat');
  const memberNames = groupInfo?.memberNames ?? [];
  const supervisorName = groupInfo?.supervisorName ?? '';
  const allMemberNames = [...memberNames, ...(supervisorName ? [supervisorName] : [])];
  const visibleMessages = useMemo(
    () => messages.filter((m) => String(m.groupId) === String(groupId)),
    [messages, groupId]
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [visibleMessages.length]);

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    if (!user?.id) return;
    setSending(true);
    api
      .post('/api/messages', { groupId, senderId: user.id, content: text })
      .then((res) => {
        const msg = res.data?.message;
        if (!msg) return;
        const createdAt =
          msg.createdAt
            ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setMessages((prev) => [
          ...prev,
          {
            id: msg._id,
            groupId: msg.groupId,
            senderId: msg.senderId,
            senderName: msg.senderName ?? 'You',
            content: msg.content ?? text,
            createdAt,
            isOwn: true,
          },
        ]);
        setInput('');
      })
      .catch((err) => {
        const msg = err.response?.data?.message ?? err.message ?? 'Failed to send message.';
        showToast(msg, 'error');
      })
      .finally(() => setSending(false));
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
    <>
    <div className="mt-6 rounded-2xl border border-gray-200 bg-white shadow-sm flex flex-col h-[70vh] max-h-[600px]">
      {/* Header: real group name and member names from API */}
      <header className="px-4 sm:px-5 py-3 border-b border-gray-200 flex items-center gap-3 flex-shrink-0">
        <div className="flex-shrink-0 w-9 h-9 rounded-full bg-accent/10 flex items-center justify-center text-accent font-semibold text-sm">
          {groupName?.[0] ?? 'G'}
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-sm sm:text-base font-semibold text-gray-900 truncate">
            {groupName}
          </h2>
          <p className="text-xs text-gray-500 truncate">
            {allMemberNames.length > 0 ? allMemberNames.join(', ') : 'Members'}
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
          disabled={!input.trim() || sending}
          className="flex-shrink-0 w-9 h-9 rounded-full bg-accent text-white flex items-center justify-center hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-accent/30 disabled:opacity-60 disabled:cursor-not-allowed"
          aria-label="Send"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4l16 8-16 8 4-8-4-8z" />
          </svg>
        </button>
      </div>
    </div>
    {toast.show && (
      <div
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-lg text-white text-sm font-medium shadow-lg ${
          toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
        }`}
        style={{ animation: 'toast-fade-in 0.25s ease-out' }}
        role="alert"
      >
        <span>{toast.message}</span>
      </div>
    )}
    </>
  );
}
