import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, Loader2, Sparkles, Maximize2, Minimize2, X } from 'lucide-react';
import axios from 'axios';

export default function Chatbot({ currentUser }) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isFull, setIsFull] = useState(false); // New Fullscreen State
  const [messages, setMessages] = useState([
    { role: 'ai', text: `Welcome to the Aether Sanctuary, ${currentUser || 'Traveler'}. Where shall we design your next legacy?` }
  ]);
  
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    setMessages(prev => [...prev, { role: 'user', text: input }]);
    setInput('');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:8000/chat', { message: input });
      setMessages(prev => [...prev, { role: 'ai', text: res.data.response }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'ai', text: "The aetheric winds are blocked. Please retry." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`transition-all duration-500 ease-in-out mx-auto bg-[#0a0a0a] overflow-hidden shadow-2xl border border-white/5 flex flex-col
      ${isFull 
        ? 'fixed inset-0 z-[10000] rounded-0 w-screen h-screen' 
        : 'relative w-full max-w-5xl my-12 rounded-[3rem] h-[700px]'
      }`}>
      
      {/* --- HEADER --- */}
      <div className="p-8 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-slate-900 to-black">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]">
            <Bot size={28} />
          </div>
          <div>
            <h2 className="text-xl font-serif font-bold text-white italic">Aurelius V.2</h2>
            <p className="text-[10px] text-blue-400 font-bold uppercase tracking-[0.3em]">Multi-Agent Concierge</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {/* TOGGLE FULLSCREEN BUTTON */}
          <button 
            onClick={() => setIsFull(!isFull)} 
            className="p-2 text-slate-400 hover:text-white transition-colors"
          >
            {isFull ? <Minimize2 size={22} /> : <Maximize2 size={22} />}
          </button>
          <Sparkles className="text-slate-600" size={20} />
        </div>
      </div>

      {/* --- MESSAGES --- */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-10 space-y-8">
        <div className={`mx-auto ${isFull ? 'max-w-4xl' : 'w-full'}`}>
          {messages.map((m, i) => (
            <div key={i} className={`flex mb-8 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-7 rounded-[2.5rem] text-lg leading-relaxed shadow-lg ${
                m.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-none' 
                  : 'bg-white/5 text-slate-200 rounded-tl-none border border-white/10'
              }`}>
                <div className="whitespace-pre-wrap font-light">{m.text}</div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex items-center gap-4 text-blue-500 italic">
              <Loader2 className="animate-spin" size={20} />
              <span className="text-sm font-bold uppercase tracking-widest">Coordinating Intelligence...</span>
            </div>
          )}
        </div>
      </div>

      {/* --- INPUT --- */}
      <div className="p-8 bg-black/40 border-t border-white/5">
        <div className={`flex gap-4 mx-auto bg-white/5 p-2 rounded-[2rem] border border-white/10 focus-within:border-blue-500 transition-all ${isFull ? 'max-w-4xl' : 'w-full'}`}>
          <input 
            className="flex-1 bg-transparent border-none outline-none text-white px-6 py-4 text-lg"
            placeholder="Plan a luxury escape..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button onClick={handleSend} className="bg-blue-600 text-white p-5 rounded-full hover:bg-blue-700 transition-all shadow-lg">
            <Send size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}