
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { User, AIResponse, PlanType, HistoryItem } from '../types';
import { MODELS_CONFIG, APP_THEMES } from '../constants';
import { generateChatResponse, generateProImage } from '../services/gemini';

interface CompareAIProps {
  user: User;
}

const CompareAI: React.FC<CompareAIProps> = ({ user }) => {
  const [prompt, setPrompt] = useState('');
  const [responses, setResponses] = useState<AIResponse[]>(
    MODELS_CONFIG.map(m => ({ modelName: m.name, content: '', loading: false }))
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [isImageMode, setIsImageMode] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [themeIndex, setThemeIndex] = useState(0);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load history on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem(`super_ai_history_${user.id}`);
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to load history", e);
      }
    }
  }, [user.id]);

  const saveToHistory = (newHistoryItem: HistoryItem) => {
    const updatedHistory = [newHistoryItem, ...history].slice(0, 5);
    setHistory(updatedHistory);
    localStorage.setItem(`super_ai_history_${user.id}`, JSON.stringify(updatedHistory));
  };

  const handleSend = async () => {
    if (!prompt.trim() || isGenerating) return;

    if (isImageMode && user.plan !== PlanType.PRO) {
      alert("Image generation is a Pro feature. Please upgrade to continue.");
      return;
    }

    const currentPrompt = prompt;
    setIsGenerating(true);
    setGeneratedImage(null);
    setResponses(prev => prev.map(r => ({ ...r, content: '', loading: true, error: undefined })));

    let finalImageUrl: string | null = null;
    let finalResponses: { modelName: string; content: string }[] = [];

    try {
      if (isImageMode) {
        // Generate main image
        finalImageUrl = await generateProImage(currentPrompt, "1:1", "1K");
        setGeneratedImage(finalImageUrl);
        
        // Also get text descriptions/critiques from models about the prompt
        const promises = MODELS_CONFIG.map(async (config, idx) => {
          try {
            const res = await generateChatResponse({
              prompt: `A user is generating an image with this prompt: "${currentPrompt}". As ${config.name}, give a short 2-sentence creative description or critique of this visual concept.`,
              useSearch: false
            });
            
            const content = res.text || '';
            finalResponses.push({ modelName: config.name, content });
            
            setResponses(prev => {
              const newRes = [...prev];
              newRes[idx] = { ...newRes[idx], content, loading: false };
              return newRes;
            });
          } catch (e) {
            setResponses(prev => {
              const newRes = [...prev];
              newRes[idx] = { ...newRes[idx], loading: false, error: 'Failed' };
              return newRes;
            });
          }
        });
        await Promise.all(promises);
      } else {
        // Standard text comparison
        const promises = MODELS_CONFIG.map(async (config, idx) => {
          try {
            const useSearch = config.id === 'perplexity' || config.id === 'gemini';
            const res = await generateChatResponse({
              prompt: `${config.persona}\n\nUser Question: ${currentPrompt}`,
              useSearch
            });
            
            const content = res.text || '';
            finalResponses.push({ modelName: config.name, content });
            
            setResponses(prev => {
              const newRes = [...prev];
              newRes[idx] = { ...newRes[idx], content, loading: false };
              return newRes;
            });
          } catch (e) {
            setResponses(prev => {
              const newRes = [...prev];
              newRes[idx] = { ...newRes[idx], loading: false, error: 'Model failed to respond' };
              return newRes;
            });
          }
        });
        await Promise.all(promises);
      }

      // Save to history after success
      saveToHistory({
        id: Date.now().toString(),
        prompt: currentPrompt,
        responses: finalResponses,
        timestamp: new Date().toISOString(),
        isImage: isImageMode,
        imageUrl: finalImageUrl
      });

    } catch (error) {
      console.error("Generation error:", error);
    } finally {
      setIsGenerating(false);
      setPrompt('');
    }
  };

  const loadFromHistory = (item: HistoryItem) => {
    setIsImageMode(!!item.isImage);
    setGeneratedImage(item.imageUrl || null);
    setResponses(MODELS_CONFIG.map(m => {
      const saved = item.responses.find(r => r.modelName === m.name);
      return {
        modelName: m.name,
        content: saved ? saved.content : 'No response saved',
        loading: false
      };
    }));
    setIsHistoryOpen(false);
  };

  return (
    <div className={`min-h-full transition-all duration-1000 bg-gradient-to-br ${APP_THEMES[themeIndex].colors} text-white flex flex-col relative overflow-hidden`}>
      
      {/* History Sidebar/Drawer */}
      <div className={`fixed inset-y-0 right-0 w-80 bg-gray-950/90 backdrop-blur-2xl border-l border-white/5 z-40 transform transition-transform duration-300 ease-in-out ${isHistoryOpen ? 'translate-x-0' : 'translate-x-full shadow-none'}`}>
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-lg">Recent History</h3>
            <button onClick={() => setIsHistoryOpen(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors">✕</button>
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar">
            {history.length === 0 ? (
              <div className="text-center py-20 text-gray-500 italic text-sm">
                No history yet. Start a comparison!
              </div>
            ) : (
              history.map((item) => (
                <button 
                  key={item.id}
                  onClick={() => loadFromHistory(item)}
                  className="w-full text-left p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-blue-500/50 transition-all group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">{item.isImage ? '🖼️ Image' : '💬 Text'}</span>
                    <span className="text-[10px] text-gray-500">{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p className="text-sm font-medium line-clamp-2 text-gray-200 group-hover:text-white">{item.prompt}</p>
                </button>
              ))
            )}
          </div>
          <p className="text-[10px] text-center text-gray-600 mt-4">Storing your last 5 comparisons locally</p>
        </div>
      </div>

      {/* Header */}
      <header className="h-16 px-6 border-b border-white/5 flex items-center justify-between bg-black/40 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <h2 className="font-bold">Super AI Comparison</h2>
          <div className="flex bg-white/5 rounded-xl p-1 border border-white/10">
            <button 
              onClick={() => setIsImageMode(false)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${!isImageMode ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
            >
              TEXT
            </button>
            <button 
              onClick={() => setIsImageMode(true)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${isImageMode ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
            >
              IMAGE
            </button>
          </div>
        </div>
        <div className="flex gap-3 items-center">
           {isImageMode && user.plan !== PlanType.PRO && (
             <Link to="/upgrade" className="text-[10px] font-bold bg-yellow-500 text-black px-2 py-1 rounded animate-pulse">
               UPGRADE FOR IMAGE GEN
             </Link>
           )}
           <button 
             onClick={() => setIsHistoryOpen(!isHistoryOpen)}
             className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold transition-all border border-white/10"
           >
             <span>🕒</span>
             <span className="hidden sm:inline">HISTORY</span>
           </button>
           <span className="text-[10px] font-bold bg-blue-600/20 text-blue-400 px-2 py-0.5 rounded uppercase">
             {isImageMode ? 'Pro Image Engine' : 'Search Grounding Active'}
           </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-x-auto p-6 custom-scrollbar pb-32">
        {generatedImage && (
          <div className="max-w-xl mx-auto mb-10 animate-in fade-in zoom-in duration-700">
            <div className="relative group p-1 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-[2.5rem] shadow-2xl overflow-hidden">
               <img 
                 src={generatedImage} 
                 alt="Generated AI" 
                 className="w-full h-auto rounded-[2.4rem] object-cover"
               />
               <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all pointer-events-none"></div>
            </div>
          </div>
        )}

        <div className="flex gap-6 min-w-max h-full">
          {responses.map((res, i) => (
            <div key={i} className="w-[350px] flex flex-col bg-black/40 border border-white/5 backdrop-blur-xl rounded-[2.5rem] overflow-hidden shadow-2xl transition-all hover:border-white/20">
              <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold ${isImageMode ? 'bg-purple-600/20 text-purple-400' : 'bg-blue-600/20 text-blue-400'}`}>
                    {res.modelName[0]}
                  </div>
                  <span className="font-bold text-sm tracking-tight">{res.modelName}</span>
                </div>
              </div>
              <div className="flex-1 p-6 overflow-y-auto custom-scrollbar text-sm leading-relaxed text-gray-300">
                {res.loading ? (
                  <div className="space-y-3 animate-pulse">
                    <div className="h-4 bg-white/5 rounded w-3/4"></div>
                    <div className="h-4 bg-white/5 rounded w-full"></div>
                    <div className="h-4 bg-white/5 rounded w-5/6"></div>
                  </div>
                ) : res.error ? (
                  <div className="text-rose-400 font-medium italic">{res.error}</div>
                ) : res.content ? (
                  <div className="whitespace-pre-wrap">{res.content}</div>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-600 italic">
                    {isImageMode ? 'Describe an image to see results...' : 'Enter prompt below...'}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Input Section */}
      <div className="p-8 bg-gradient-to-t from-black via-black/90 to-transparent absolute bottom-0 w-full">
        <div className="max-w-3xl mx-auto bg-white/[0.05] border border-white/10 backdrop-blur-2xl rounded-[2rem] p-2 flex items-center gap-2 shadow-2xl focus-within:border-blue-500/50 transition-all">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl`}>
             {isImageMode ? '🖼️' : '💬'}
          </div>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
            placeholder={isImageMode ? "What image should I create?" : "Ask all AIs at once..."}
            className="flex-1 bg-transparent border-none focus:ring-0 resize-none py-4 text-white text-sm min-h-[50px] max-h-40 font-medium"
          />
          <button 
            onClick={handleSend}
            disabled={isGenerating || !prompt.trim()}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${isGenerating || !prompt.trim() ? 'bg-gray-800 text-gray-600' : (isImageMode ? 'bg-purple-600 hover:bg-purple-500' : 'bg-blue-600 hover:bg-blue-500')}`}
          >
            {isGenerating ? (
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
            ) : "↗️"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompareAI;
