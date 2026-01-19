
import { GoogleGenAI, Modality, Type } from "@google/genai";

// Utility for Base64
export const fileToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const decodeBase64 = (base64: string) => {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

export const encodeBase64 = (bytes: Uint8Array) => {
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

// General Text Generation with Grounding/Thinking
export const generateChatResponse = async (params: {
  prompt: string,
  useThinking?: boolean,
  useSearch?: boolean,
  useMaps?: boolean,
  image?: { data: string, mimeType: string }
}) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = params.useThinking ? 'gemini-3-pro-preview' : 'gemini-3-flash-preview';
  
  const contents: any[] = [{ role: 'user', parts: [{ text: params.prompt }] }];
  if (params.image) {
    contents[0].parts.unshift({ inlineData: params.image });
  }

  const tools: any[] = [];
  if (params.useSearch) tools.push({ googleSearch: {} });
  if (params.useMaps) tools.push({ googleMaps: {} });

  const config: any = {
    tools: tools.length > 0 ? tools : undefined,
  };

  if (params.useThinking) {
    config.thinkingConfig = { thinkingBudget: 32768 };
  }

  // Maps requires location
  if (params.useMaps) {
    try {
      const pos = await new Promise<GeolocationPosition>((res, rej) => navigator.geolocation.getCurrentPosition(res, rej));
      config.toolConfig = {
        retrievalConfig: {
          latLng: { latitude: pos.coords.latitude, longitude: pos.coords.longitude }
        }
      };
    } catch (e) {
      console.warn("Location permission denied for maps grounding");
    }
  }

  const response = await ai.models.generateContent({
    model,
    contents,
    config
  });

  const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  const links = groundingChunks.map((c: any) => ({
    uri: c.web?.uri || c.maps?.uri,
    title: c.web?.title || c.maps?.title
  })).filter((l: any) => l.uri);

  return {
    text: response.text || "",
    links
  };
};

// Pro Image Generation
export const generateProImage = async (prompt: string, aspectRatio: string = "1:1", imageSize: string = "1K") => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: { parts: [{ text: prompt }] },
    config: {
      imageConfig: { aspectRatio: aspectRatio as any, imageSize: imageSize as any }
    }
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
  }
  return null;
};

// Nano Banana Image Editing
export const editImage = async (prompt: string, image: { data: string, mimeType: string }) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        { inlineData: { data: image.data, mimeType: image.mimeType } },
        { text: prompt }
      ]
    }
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
  }
  return null;
};

// Video Generation (Veo)
export const generateVeoVideo = async (prompt: string, initialImage?: { data: string, mimeType: string }, aspectRatio: '16:9' | '9:16' = '16:9') => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt,
    image: initialImage ? { imageBytes: initialImage.data, mimeType: initialImage.mimeType } : undefined,
    config: { numberOfVideos: 1, resolution: '720p', aspectRatio: aspectRatio }
  });

  while (!operation.done) {
    await new Promise(r => setTimeout(r, 10000));
    operation = await ai.operations.getVideosOperation({ operation: operation });
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
  const blob = await response.blob();
  return URL.createObjectURL(blob);
};

// TTS Generation
export const generateSpeech = async (text: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } }
    },
  });

  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!base64Audio) return null;
  
  // Standard Web Audio Playback for raw PCM is complex; we'll return the base64 for decoding in UI
  return base64Audio;
};
