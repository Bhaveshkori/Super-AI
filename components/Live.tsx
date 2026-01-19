
import React, { useState, useRef } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';
import { decodeBase64, encodeBase64 } from '../services/gemini';

const LiveHub: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [transcription, setTranscription] = useState<string[]>([]);
  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef(new Set<AudioBufferSourceNode>());

  const startSession = async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    const outputNode = audioContextRef.current.createGain();
    outputNode.connect(audioContextRef.current.destination);

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    
    sessionRef.current = await ai.live.connect({
      model: 'gemini-2.5-flash-native-audio-preview-12-2025',
      callbacks: {
        onopen: () => {
          setIsActive(true);
          const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
          const source = inputCtx.createMediaStreamSource(stream);
          const processor = inputCtx.createScriptProcessor(4096, 1, 1);
          processor.onaudioprocess = (e) => {
            const inputData = e.inputBuffer.getChannelData(0);
            const int16 = new Int16Array(inputData.length);
            for (let i = 0; i < inputData.length; i++) int16[i] = inputData[i] * 32768;
            sessionRef.current.sendRealtimeInput({ 
              media: { data: encodeBase64(new Uint8Array(int16.buffer)), mimeType: 'audio/pcm;rate=16000' }
            });
          };
          source.connect(processor);
          processor.connect(inputCtx.destination);
        },
        onmessage: async (msg: any) => {
          if (msg.serverContent?.outputTranscription) {
            setTranscription(prev => [...prev, msg.serverContent.outputTranscription.text]);
          }
          const base64Audio = msg.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
          if (base64Audio && audioContextRef.current) {
            const bytes = decodeBase64(base64Audio);
            const dataInt16 = new Int16Array(bytes.buffer);
            const buffer = audioContextRef.current.createBuffer(1, dataInt16.length, 24000);
            const channelData = buffer.getChannelData(0);
            for (let i = 0; i < dataInt16.length; i++) channelData[i] = dataInt16[i] / 32768.0;
            
            const source = audioContextRef.current.createBufferSource();
            source.buffer = buffer;
            source.connect(audioContextRef.current.destination);
            const startAt = Math.max(nextStartTimeRef.current, audioContextRef.current.currentTime);
            source.start(startAt);
            nextStartTimeRef.current = startAt + buffer.duration;
            sourcesRef.current.add(source);
            source.onended = () => sourcesRef.current.delete(source);
          }
        },
        onclose: () => setIsActive(false),
      },
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
        outputAudioTranscription: {},
      },
    });
  };

  const stopSession = () => {
    if (sessionRef.current) sessionRef.current.close();
    setIsActive(false);
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-12 bg-gray-950">
      <div className="relative mb-12">
        <div className={`w-64 h-64 rounded-full border-4 transition-all duration-500 flex items-center justify-center ${isActive ? 'border-blue-500 scale-110 shadow-[0_0_50px_rgba(59,130,246,0.5)]' : 'border-white/10 opacity-30'}`}>
          {isActive ? (
             <div className="flex gap-1 items-end h-20">
                {[...Array(12)].map((_, i) => (
                   <div key={i} className="w-2 bg-blue-500 rounded-full animate-bounce" style={{ height: `${Math.random() * 100}%`, animationDelay: `${i * 0.1}s` }} />
                ))}
             </div>
          ) : <div className="text-4xl">🎙️</div>}
        </div>
      </div>
      
      <div className="text-center max-w-xl mb-12">
        <h2 className="text-3xl font-bold mb-4">{isActive ? 'Conversation Live' : 'Voice Interaction'}</h2>
        <p className="text-gray-500 text-sm">Experience real-time, zero-latency human-like voice conversation powered by Gemini 2.5 Native Audio.</p>
      </div>

      <button 
        onClick={isActive ? stopSession : startSession}
        className={`px-12 py-4 rounded-full font-bold text-lg transition-all active:scale-95 ${isActive ? 'bg-rose-600 hover:bg-rose-700' : 'bg-blue-600 hover:bg-blue-700'}`}
      >
        {isActive ? 'Stop Conversation' : 'Start Talking'}
      </button>

      <div className="mt-12 w-full max-w-2xl bg-white/[0.02] border border-white/5 rounded-3xl p-6 h-48 overflow-y-auto">
        <div className="text-[10px] font-bold text-gray-500 uppercase mb-4 tracking-widest">Live Transcription</div>
        <div className="space-y-2">
          {transcription.map((t, i) => <div key={i} className="text-sm text-gray-300">{t}</div>)}
          {transcription.length === 0 && <div className="text-sm text-gray-700 italic">Waiting for voice input...</div>}
        </div>
      </div>
    </div>
  );
};

export default LiveHub;
