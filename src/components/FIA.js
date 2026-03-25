import { useState } from 'react';

export default function FIA() {
  const [messages, setMessages] = useState([
    { id: 1, from: 'FIA', text: 'Hi! I am FIA (dummy assistant for now). Ask me anything about your FYP.' },
  ]);
  const [input, setInput] = useState('');

  const sendDummy = () => {
    // Dummy only: for now we just echo the user's text locally.
    const t = input.trim();
    if (!t) return;
    setMessages((prev) => [
      ...prev,
      { id: prev.length + 1, from: 'You', text: t },
      { id: prev.length + 2, from: 'FIA', text: 'This is dummy text. Real chat integration comes next.' },
    ]);
    setInput('');
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-900 mb-2">Chat with FIA</h1>
      <p className="text-sm text-gray-500 mb-6">FYP messaging assistant (dummy UI).</p>

      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="p-4 sm:p-6 h-[420px] overflow-y-auto bg-gray-50">
          <div className="space-y-3">
            {messages.map((m) => (
              <div key={m.id} className={m.from === 'You' ? 'flex justify-end' : 'flex justify-start'}>
                <div
                  className={
                    m.from === 'You'
                      ? 'max-w-[80%] rounded-xl bg-accent text-white px-4 py-2 text-sm shadow'
                      : 'max-w-[80%] rounded-xl bg-white text-gray-900 px-4 py-2 text-sm border border-gray-200 shadow-sm'
                  }
                >
                  <div className="font-medium text-xs opacity-90 mb-1">{m.from}</div>
                  <div>{m.text}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 sm:p-6 border-t border-gray-200">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 py-2.5 px-3 border border-gray-200 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:border-accent focus:ring-[3px] focus:ring-accent/20"
              onKeyDown={(e) => {
                if (e.key === 'Enter') sendDummy();
              }}
            />
            <button
              type="button"
              onClick={sendDummy}
              className="px-5 py-2.5 rounded-lg font-medium bg-accent text-white hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

