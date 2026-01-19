
import React, { useState } from 'react';
import { generateProImage, generateVeoVideo, editImage, fileToDataUrl } from '../services/gemini';

const Studio: React.FC = () => {
  const [tab, setTab] = useState<'create' | 'edit' | 'video'>('create');
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '4:3' | '16:9' | '9:16' | '21:9'>('16:9');
  const [size, setSize] = useState('1K');
  const [image, setImage] = useState<{data: string, mimeType: string} | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim() && tab !== 'edit') return;
    if (tab === 'edit' && !image) {
      alert("Please upload an image to edit.");
      return;
    }

    setLoading(true);
    setResult(null);
    try {
      if (tab === 'create') {
        const res = await generateProImage(prompt, aspectRatio, size);
        setResult(res);
      } else if (tab === 'edit') {
        if (!image) return;
        const res = await editImage(prompt || "Edit this image", image);
        setResult(res);
      } else {
        // Veo only supports 16:9 or 9:16
        const veoRatio = (aspectRatio === '9:16') ? '9:16' : '16:9';
        const res = await generateVeoVideo(prompt, image || undefined, veoRatio);
        setResult(res);
      }
    } catch (e) {
      console.error(e);
      alert("Operation failed. Please try again.");
    } finally {
      setLoading(false);
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
    <div className="p-12 max-w-6xl mx-auto space-y-12">
      <header className="text-center">
        <h1 className="text-5xl font-black mb-4">Creative Studio</h1>
        <div className="flex justify-center bg-white/5 p-1 rounded-full border border-white/10 w-fit mx-auto gap-1">
          <button 
            onClick={() => { setTab('create'); setResult(null); }} 
            className={`px-6 py-2 rounded-full font-bold transition-all text-sm ${tab === 'create' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
          >
            Create
          </button>
          <button 
            onClick={() => { setTab('edit'); setResult(null); }} 
            className={`px-6 py-2 rounded-full font-bold transition-all text-sm ${tab === 'edit' ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
          >
            Edit
          </button>
          <button 
            onClick={() => { setTab('video'); setResult(null); }} 
            className={`px-6 py-2 rounded-full font-bold transition-all text-sm ${tab === 'video' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
          >
            Animate
          </button>
        </div>
      </header>

      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-1 space-y-8 bg-white/[0.03] border border-white/5 p-8 rounded-[40px] shadow-2xl">
          <div className="space-y-4">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Settings</label>
            
            {(tab === 'create' || tab === 'video') && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Aspect Ratio</p>
                <div className="grid grid-cols-3 gap-2">
                  {(tab === 'video' ? ['16:9', '9:16'] : ['1:1', '4:3', '16:9', '9:16', '21:9']).map(r => (
                    <button 
                      key={r} 
                      onClick={() => setAspectRatio(r as any)} 
                      className={`text-[10px] p-2 rounded-xl border transition-all ${aspectRatio === r ? 'border-blue-500 bg-blue-500/10 text-blue-400' : 'border-white/10 text-gray-500 hover:border-white/20'}`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {tab === 'create' && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Resolution</p>
                <div className="grid grid-cols-3 gap-2">
                  {['1K', '2K', '4K'].map(s => (
                    <button 
                      key={s} 
                      onClick={() => setSize(s)} 
                      className={`text-[10px] p-2 rounded-xl border transition-all ${size === s ? 'border-blue-500 bg-blue-500/10 text-blue-400' : 'border-white/10 text-gray-500 hover:border-white/20'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {(tab === 'edit' || tab === 'video') && (
              <div className="space-y-2">
                <p className="text-sm font-medium">{tab === 'edit' ? 'Source Image' : 'Start Frame (Optional)'}</p>
                <div className="relative group">
                  <input type="file" onChange={onFileChange} className="hidden" id="studio-upload" accept="image/*" />
                  <label htmlFor="studio-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/10 rounded-2xl cursor-pointer hover:bg-white/5 transition-all overflow-hidden">
                    {image ? (
                      <img src={`data:${image.mimeType};base64,${image.data}`} className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center">
                        <span className="text-2xl mb-1 block">📁</span>
                        <span className="text-[10px] text-gray-500 uppercase font-bold">Choose Image</span>
                      </div>
                    )}
                  </label>
                  {image && (
                    <button onClick={() => setImage(null)} className="absolute top-2 right-2 bg-black/60 p-1 rounded-lg text-xs hover:bg-rose-600 transition-colors">✕</button>
                  )}
                </div>
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            <p className="text-sm font-medium">Prompt</p>
            <textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full h-32 bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:ring-1 focus:ring-blue-500 outline-none resize-none transition-all placeholder:text-gray-700"
              placeholder={tab === 'edit' ? "e.g., 'Add a retro filter' or 'Make it sunset'" : "Describe your vision..."}
            />
          </div>

          <button 
            disabled={loading}
            onClick={handleGenerate}
            className={`w-full py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-3 ${loading ? 'bg-gray-800' : (tab === 'create' ? 'bg-blue-600 hover:bg-blue-500' : tab === 'edit' ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-purple-600 hover:bg-purple-500')} hover:scale-[1.02] active:scale-[0.98]`}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                <span>Processing...</span>
              </>
            ) : (
              <span>{tab === 'create' ? 'Generate Image' : tab === 'edit' ? 'Edit Image' : 'Generate Video'}</span>
            )}
          </button>
        </div>

        <div className="lg:col-span-2 flex items-center justify-center bg-black/40 border border-white/5 rounded-[40px] relative overflow-hidden min-h-[500px] shadow-inner group">
          {loading ? (
            <div className="text-center space-y-6 z-10 p-12">
              <div className="w-20 h-20 border-4 border-blue-600/10 border-t-blue-600 rounded-full animate-spin mx-auto shadow-2xl shadow-blue-500/20"></div>
              <div className="space-y-2">
                <p className="text-blue-400 font-bold text-xl animate-pulse">
                  {tab === 'video' ? 'Generating Video (can take 2 mins)...' : 'Gemini is thinking...'}
                </p>
                <p className="text-xs text-gray-500 uppercase tracking-widest">
                  {tab === 'video' ? 'Our GPUs are animating your story' : 'Synthesizing pixels based on your prompt'}
                </p>
              </div>
            </div>
          ) : result ? (
             <div className="w-full h-full flex items-center justify-center p-8 animate-in fade-in zoom-in duration-700">
               {tab === 'video' ? (
                 <video src={result} controls autoPlay loop className="max-w-full max-h-[600px] rounded-3xl shadow-2xl border border-white/10" />
               ) : (
                 <img src={result} className="max-w-full max-h-[600px] rounded-3xl shadow-2xl border border-white/10 object-contain" />
               )}
               <div className="absolute top-4 right-4 flex gap-2">
                  <a href={result} download={`superai-${Date.now()}.${tab === 'video' ? 'mp4' : 'png'}`} className="bg-white/10 hover:bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-xs font-bold transition-all border border-white/10">
                    Download
                  </a>
               </div>
             </div>
          ) : (
            <div className="text-center text-gray-800 transition-all group-hover:scale-110 duration-700">
               <div className="text-8xl mb-6 opacity-10">
                  {tab === 'create' ? '✨' : tab === 'edit' ? '🪄' : '🎬'}
               </div>
               <p className="text-lg font-medium opacity-20 uppercase tracking-[0.2em]">Awaiting Output</p>
            </div>
          )}
          
          {/* Subtle background glow */}
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 via-transparent to-purple-500/5 pointer-events-none"></div>
        </div>
      </div>
    </div>
  );
};

export default Studio;
