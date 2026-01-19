
import React, { useState, useRef, useEffect } from 'react';
import { generateChatResponse, fileToDataUrl } from '../services/gemini';
import { Message } from '../types';

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [useThinking, setUseThinking] = useState(false);
  const [useSearch, setUseSearch] = useState(true);
  const [image, setImage] = useState<{data: string, mimeType: string} | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), [messages]);

  const handleSend = async () => {
    if (!input.trim() && !image) return;
    const userMsg: Message = { 
      role: 'user', 
      parts: [{ text: input, inlineData: image || undefined }], 
      timestamp: new Date() 
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setImage(null);
    setIsLoading(true);

    try {
      const res = await generateChatResponse({
        prompt: input,
        useThinking,
        useSearch,
        image: image || undefined
      });
      setMessages(prev => [...prev, {
        role: 'model',
        parts: [{ text: res.text, groundingLinks: res.links }],
        timestamp: new Date()
      }]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const dataUrl = await fileToDataUrl(file);
      setImage({ data: dataUrl.split(',')[1], mimeType: file.type });
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-950 p-6">
      <div className="flex-1 overflow-y-auto space-y-6 custom-scrollbar pb-32">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-6 rounded-3xl ${m.role === 'user' ? 'bg-blue-600' : 'bg-white/5 border border-white/10'}`}>
              {m.parts[0].inlineData && (
                <img src={`data:${m.parts[0].inlineData.mimeType};base64,${m.parts[0].inlineData.data}`} className="w-48 h-auto rounded-xl mb-4" />
              )}
              <div className="whitespace-pre-wrap text-sm leading-relaxed">{m.parts[0].text}</div>
              {m.parts[0].groundingLinks && m.parts[0].groundingLinks.length > 0 && (
                <div className="mt-4 pt-4 border-t border-white/5 space-y-2">
                  <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Sources</div>
                  <div className="flex flex-wrap gap-2">
                    {m.parts[0].groundingLinks.map((link, li) => (
                      <a key={li} href={link.uri} target="_blank" className="text-[10px] bg-white/5 px-2 py-1 rounded hover:bg-white/10 text-blue-400">
                        {link.title || 'Source'}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && <div className="text-gray-500 italic animate-pulse">Gemini is thinking...</div>}
        <div ref={endRef} />
      </div>

      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-3xl px-4">
        <div className="bg-black/60 backdrop-blur-2xl border border-white/10 p-2 rounded-[2.5rem] shadow-2xl">
          <div className="flex gap-2 mb-2 px-4 py-2 border-b border-white/5">
             <button onClick={() => setUseThinking(!useThinking)} className={`text-[10px] font-bold px-2 py-1 rounded transition-all ${useThinking ? 'bg-purple-600' : 'bg-white/5 text-gray-500'}`}>THINKING MODE</button>
             <button onClick={() => setUseSearch(!useSearch)} className={`text-[10px] font-bold px-2 py-1 rounded transition-all ${useSearch ? 'bg-blue-600' : 'bg-white/5 text-gray-500'}`}>WEB SEARCH</button>
          </div>
          <div className="flex items-center gap-3 px-2">
            <label className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl cursor-pointer">
               📎
               <input type="file" className="hidden" onChange={onFileChange} accept="image/*" />
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything (Deep Thinking or Search enabled)..."
              className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-4 resize-none h-12"
            />
            <button onClick={handleSend} className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform">
               ↗️
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
