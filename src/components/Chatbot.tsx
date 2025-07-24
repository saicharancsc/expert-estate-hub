import React, { useState, useEffect, useRef } from 'react';

interface ChatbotProps {
  clientId: string;
}

interface Message {
  text: string;
  sender: 'user' | 'bot';
  timestamp: number;
}

const LOCALSTORAGE_PREFIX = 'client_chat_';

const Chatbot: React.FC<ChatbotProps> = ({ clientId }) => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Load messages from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(LOCALSTORAGE_PREFIX + clientId);
    if (stored) {
      setMessages(JSON.parse(stored));
    }
  }, [clientId]);

  // Save messages to localStorage
  useEffect(() => {
    localStorage.setItem(LOCALSTORAGE_PREFIX + clientId, JSON.stringify(messages));
  }, [messages, clientId]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  const handleSend = () => {
    if (!input.trim()) return;
    const newMsg: Message = {
      text: input,
      sender: 'user',
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, newMsg]);
    setInput('');
    // Optionally, add a simple bot reply
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          text: 'Thank you for your message! (Bot reply)',
          sender: 'bot',
          timestamp: Date.now(),
        },
      ]);
    }, 800);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1000,
          background: '#2563eb',
          color: 'white',
          borderRadius: '50%',
          width: 56,
          height: 56,
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          border: 'none',
          fontSize: 28,
          cursor: 'pointer',
        }}
        aria-label="Open chatbot"
      >
        💬
      </button>
      {/* Chat Window */}
      {open && (
        <div
          style={{
            position: 'fixed',
            bottom: 90,
            right: 24,
            width: 320,
            maxHeight: 420,
            background: 'white',
            borderRadius: 12,
            boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
            zIndex: 1001,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{ padding: '12px 16px', borderBottom: '1px solid #eee', fontWeight: 600, background: '#2563eb', color: 'white', borderTopLeftRadius: 12, borderTopRightRadius: 12 }}>
            Chatbot
            <button
              onClick={() => setOpen(false)}
              style={{ float: 'right', background: 'none', border: 'none', color: 'white', fontSize: 18, cursor: 'pointer' }}
              aria-label="Close chatbot"
            >
              ×
            </button>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: 12, background: '#f9f9f9' }}>
            {messages.length === 0 && <div style={{ color: '#888', textAlign: 'center', marginTop: 40 }}>No messages yet.</div>}
            {messages.map((msg, idx) => (
              <div key={idx} style={{ marginBottom: 10, textAlign: msg.sender === 'user' ? 'right' : 'left' }}>
                <span
                  style={{
                    display: 'inline-block',
                    background: msg.sender === 'user' ? '#2563eb' : '#e5e7eb',
                    color: msg.sender === 'user' ? 'white' : '#222',
                    borderRadius: 16,
                    padding: '8px 14px',
                    maxWidth: '80%',
                    wordBreak: 'break-word',
                  }}
                >
                  {msg.text}
                </span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSend();
            }}
            style={{ display: 'flex', borderTop: '1px solid #eee', padding: 8, background: '#fff', borderBottomLeftRadius: 12, borderBottomRightRadius: 12 }}
          >
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Type a message..."
              style={{ flex: 1, border: 'none', outline: 'none', padding: 8, borderRadius: 8, fontSize: 15, background: '#f3f4f6' }}
            />
            <button
              type="submit"
              style={{ marginLeft: 8, background: '#2563eb', color: 'white', border: 'none', borderRadius: 8, padding: '8px 16px', fontWeight: 600, cursor: 'pointer' }}
            >
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default Chatbot; 