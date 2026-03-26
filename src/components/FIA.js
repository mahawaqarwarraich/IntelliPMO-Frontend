import { useEffect, useMemo, useRef, useState } from 'react';

export default function FIA() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      from: 'FIA',
      text:
        'Hi! I am FIA, your dummy FYP assistant. Ask for help with choosing a topic, planning milestones, or improving your report structure.',
      createdAt: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  const suggestions = useMemo(
    () => [
      'Suggest research questions and objectives',
      'How do I structure a literature review?',
      'How do I use the FYP management platform for my next steps?',
    ],
    []
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendDummy = () => {
    const t = input.trim();
    if (!t || sending) return;

    setSending(true);
    const userMsg = { id: messages.length + 1, from: 'You', text: t, createdAt: new Date().toISOString() };

    // Simulate response delay so it feels like a real assistant.
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        userMsg,
        {
          id: prev.length + 1,
          from: 'FIA',
          text:
            'Dummy response (for now). Next step: connect this UI to the real FIA/AI backend and generate context-aware answers.',
          createdAt: new Date().toISOString(),
        },
      ]);
      setInput('');
      setSending(false);
    }, 450);
  };

  return (
    <div className="max-w-4xl mx-auto mt-2">
      <div className="mt-6 rounded-2xl border border-gray-200 bg-white shadow-sm flex flex-col h-[70vh] max-h-[600px]">
        <header className="px-4 sm:px-5 py-3 border-b border-gray-200 flex items-center gap-3 flex-shrink-0">
          <div className="flex-shrink-0 w-9 h-9 rounded-full bg-accent/10 flex items-center justify-center text-accent font-semibold text-sm">
            FIA
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-sm sm:text-base font-semibold text-gray-900 truncate">FIA - FYP Intelligent Assistant</h2>
            <p className="text-xs text-gray-500 truncate">Ask for guidance across planning, writing, and milestones.</p>
          </div>
        </header>

        <div className="flex-shrink-0 px-3 sm:px-4 py-2 border-b border-gray-200 bg-white">
          <div className="flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setInput(s)}
                className="px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-accent/20"
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto px-3 sm:px-4 py-3 bg-gray-50">
          <div className="space-y-3">
            {messages.map((m) => (
              <div key={m.id} className={`mb-1 flex ${m.from === 'You' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm shadow-sm ${
                    m.from === 'You'
                      ? 'bg-accent text-white rounded-br-sm'
                      : 'bg-white text-gray-900 rounded-bl-sm border border-gray-200'
                  }`}
                >
                  <p className={`text-[11px] font-semibold mb-1 ${m.from === 'You' ? 'text-white/80' : 'text-accent'}`}>
                    {m.from}
                  </p>
                  <p className="whitespace-pre-wrap break-words">{m.text}</p>
                </div>
              </div>
            ))}
          </div>
          <div ref={bottomRef} />
        </div>

        <div className="px-3 sm:px-4 py-2.5 border-t border-gray-200 bg-white flex items-end gap-2 flex-shrink-0">
          <div className="flex-1 min-w-0 flex flex-col gap-1">
            <textarea
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask FIA about your FYP..."
              className="w-full resize-none rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendDummy();
                }
              }}
            />
          </div>
          <button
            type="button"
            onClick={sendDummy}
            disabled={!input.trim() || sending}
            className="flex-shrink-0 w-9 h-9 rounded-full bg-accent text-white flex items-center justify-center hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-accent/30 disabled:opacity-60 disabled:cursor-not-allowed"
            aria-label="Send"
          >
            {sending ? (
              <div className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin" aria-hidden />
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4l16 8-16 8 4-8-4-8z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

