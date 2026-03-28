import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, X, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AIChatPanel = ({ onClose }) => {
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Good morning! I am Shoplytixs AI. I can analyze your store metrics, find churn risks, or identify your top spenders. How can I help today?' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMsg = inputMessage;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg })
      });
      const data = await response.json();
      
      setMessages(prev => [...prev, { role: 'ai', text: data?.reply || data?.message || data?.response || 'Done.', customers: data.customers }]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages(prev => [...prev, { role: 'ai', text: 'Sorry, I encountered an error connecting to the server.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div 
        style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)', zIndex: 99, transition: 'all var(--transition-fast)' }}
        onClick={onClose}
      />
      
      <div style={{ 
        position: 'fixed', right: 0, top: 0, bottom: 0, width: '440px', 
        backgroundColor: 'var(--bg-surface)', zIndex: 100, 
        boxShadow: 'var(--shadow-lg)', borderLeft: '1px solid var(--border-color)', 
        display: 'flex', flexDirection: 'column',
        animation: 'slideInLeft 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes slideInLeft {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
          }
        `}} />
        <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '12px', background: 'linear-gradient(135deg, #4f46e5, #0ea5e9)', color: 'white', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center' }}>
               <Sparkles size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', margin: 0, letterSpacing: '-0.5px' }}>
                Shoplytixs AI
              </h2>
              <span style={{ fontSize: '0.8rem', color: 'var(--success)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--success)' }}></div>
                Online
              </span>
            </div>
          </div>
          <button onClick={onClose} style={{ border: 'none', background: '#f1f5f9', width: '36px', height: '36px', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', transition: 'all 0.2s' }} onMouseOver={e => e.currentTarget.style.backgroundColor = '#e2e8f0'} onMouseOut={e => e.currentTarget.style.backgroundColor = '#f1f5f9'}>
            <X size={18} />
          </button>
        </div>
        
        <div style={{ flex: 1, padding: '32px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '24px', backgroundColor: '#f8fafc' }}>
          {messages.map((msg, index) => (
            <div key={index} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '12px', backgroundColor: msg.role === 'user' ? '#1e293b' : 'white', border: msg.role === 'ai' ? '1px solid #e2e8f0' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', color: msg.role === 'user' ? 'white' : '#4f46e5', flexShrink: 0, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
              </div>
              <div style={{ 
                backgroundColor: msg.role === 'user' ? 'var(--primary-color)' : 'white', 
                color: msg.role === 'user' ? 'white' : 'var(--text-main)',
                border: msg.role === 'ai' ? '1px solid #e2e8f0' : 'none',
                padding: '16px 20px', 
                borderRadius: '16px',
                borderTopRightRadius: msg.role === 'user' ? '4px' : '16px',
                borderTopLeftRadius: msg.role === 'ai' ? '4px' : '16px',
                maxWidth: '85%',
                lineHeight: 1.6,
                fontSize: '0.95rem',
                boxShadow: msg.role === 'user' ? '0 4px 12px rgba(15, 23, 42, 0.15)' : '0 2px 8px rgba(0,0,0,0.04)'
              }}>
                <div style={{ fontWeight: msg.role === 'user' ? 400 : 500 }}>{msg.text}</div>
                
                {msg.customers && msg.customers.length > 0 && (
                  <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Found Entities</div>
                    {msg.customers.slice(0,3).map(c => (
                       <div 
                          key={c.id} 
                          style={{ padding: '12px 16px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'all 0.2s' }}
                          onClick={() => {
                             navigate(`/customers/${c.id}`);
                             onClose();
                          }}
                          onMouseOver={e => e.currentTarget.style.borderColor = '#4f46e5'}
                          onMouseOut={e => e.currentTarget.style.borderColor = '#e2e8f0'}
                       >
                         <div>
                           <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a' }}>{c.name}</div>
                           <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '2px', fontWeight: 500 }}>
                             Spend: ${c.totalSpend}
                           </div>
                         </div>
                         <div style={{ width: '28px', height: '28px', borderRadius: '8px', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4f46e5', border: '1px solid #e2e8f0' }}>
                           <ChevronRight size={16} />
                         </div>
                       </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '12px', backgroundColor: 'white', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4f46e5', flexShrink: 0, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                <Bot size={18} />
              </div>
              <div style={{ padding: '16px 24px', backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', color: '#4f46e5', fontSize: '0.95rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                 <div className="typing-dot" style={{ width: '6px', height: '6px', backgroundColor: '#4f46e5', borderRadius: '50%', animation: 'typing 1s infinite alternate' }}></div>
                 <div className="typing-dot" style={{ width: '6px', height: '6px', backgroundColor: '#4f46e5', borderRadius: '50%', animation: 'typing 1s infinite alternate', animationDelay: '0.2s' }}></div>
                 <div className="typing-dot" style={{ width: '6px', height: '6px', backgroundColor: '#4f46e5', borderRadius: '50%', animation: 'typing 1s infinite alternate', animationDelay: '0.4s' }}></div>
                 <style dangerouslySetInnerHTML={{__html: `
                   @keyframes typing {
                     0% { transform: translateY(0); opacity: 0.5; }
                     100% { transform: translateY(-4px); opacity: 1; }
                   }
                 `}} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div style={{ padding: '24px 32px', borderTop: '1px solid var(--border-color)', backgroundColor: 'white' }}>
          <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '12px' }}>
            <input 
              type="text" 
              placeholder="Ask AI for insights..." 
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              style={{ flex: 1, padding: '14px 20px', borderRadius: '16px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '1rem', backgroundColor: '#f8fafc', fontWeight: 500, transition: 'all 0.2s' }}
              onFocus={e => { e.target.style.borderColor = '#4f46e5'; e.target.style.backgroundColor = 'white'; e.target.style.boxShadow = '0 0 0 3px rgba(79, 70, 229, 0.1)'; }}
              onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.backgroundColor = '#f8fafc'; e.target.style.boxShadow = 'none'; }}
            />
            <button type="submit" disabled={!inputMessage.trim() || isLoading} style={{ width: '48px', height: '48px', borderRadius: '16px', backgroundColor: inputMessage.trim() ? '#4f46e5' : '#e2e8f0', color: 'white', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: inputMessage.trim() ? 'pointer' : 'not-allowed', transition: 'all 0.2s' }}>
              <Send size={20} style={{ marginLeft: '-2px' }} />
            </button>
          </form>
          <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>
            Shoplytixs AI can make mistakes. Verify important data.
          </div>
        </div>
      </div>
    </>
  );
};

export default AIChatPanel;
