'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Camera, X, CheckCircle2, RefreshCw, Zap, ArrowLeft, Info } from 'lucide-react';
import Webcam from 'react-webcam';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

export default function ScanPage() {
  const [mounted, setMounted] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<{
    material: string;
    weight: number;
    value: number;
    price_per_kg: number;
    image: string | null;
  } | null>(null);
  const webcamRef = useRef<Webcam>(null);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const capture = useCallback(async () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (!imageSrc) return;

    setIsScanning(true);
    setResult(null);

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      
      const base64Data = imageSrc.split(',')[1];
      const imagePart = {
        inlineData: {
          data: base64Data,
          mimeType: "image/jpeg"
        },
      };

      const prompt = 'You are an AI for a waste recycling app in India. Analyze this image. Identify the primary waste material. Reply ONLY with a raw JSON object containing these keys: "material" (e.g., PET Plastic, Aluminum, Steel, Mixed Glass, Paper, E-Waste) and "price_per_kg". Use these exact rates: PET Plastic: 40, Aluminum: 80, Steel: 50, Mixed Glass: 10, Paper: 15, E-Waste: 150. Pick the closest matching category. Do not include markdown formatting or backticks.';

      const result = await model.generateContent([prompt, imagePart]);
      const response = await result.response;
      const text = response.text();
      
      const cleanJson = text.replace(/```json|```/g, '').trim();
      const data = JSON.parse(cleanJson);

      setResult({
        material: data.material,
        weight: 0, // Reset to 0 for manual entry
        price_per_kg: data.price_per_kg,
        value: 0,
        image: imageSrc,
      });
    } catch (error) {
      console.error('FULL SCAN ERROR:', error);
      alert(`AI Detection Failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsScanning(false);
    }
  }, [webcamRef]);

  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const weight = parseFloat(e.target.value) || 0;
    if (result) {
      setResult({
        ...result,
        weight: weight,
        value: weight * result.price_per_kg
      });
    }
  };

  const handleConfirm = async () => {
    if (!result) return;

    const scanPayload = {
      material: result.material,
      weight: result.weight,
      total_value: result.value,
      created_at: new Date().toISOString(),
    };

    try {
      const { error } = await supabase.from('scans').insert([scanPayload]);
      if (error) throw error;
      router.push('/dashboard');
    } catch (error: any) {
      console.warn('Supabase Error (Falling back to local):', error);
      const offlineScans = JSON.parse(localStorage.getItem('offline_scans') || '[]');
      const updatedOffline = [{ ...scanPayload, id: Date.now() }, ...offlineScans];
      localStorage.setItem('offline_scans', JSON.stringify(updatedOffline));
      router.push('/dashboard');
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-cream pb-32">
      {/* Header */}
      <div className="bg-gradient-to-r from-rose-700 to-rose-800 text-white px-6 py-8 shadow-lg rounded-b-[2.5rem]">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <Link href="/dashboard" className="p-2 hover:bg-white/20 rounded-full transition-colors">
            <ArrowLeft size={24} className="text-white" />
          </Link>
          <div className="text-center">
            <h1 className="text-xl font-black text-white">AI Scanner</h1>
            <p className="text-rose-100 text-[10px] uppercase font-black tracking-widest">Powered by Gemini 2.5</p>
          </div>
          <button className="p-2 hover:bg-white/20 rounded-full transition-colors">
            <Info size={24} className="text-white" />
          </button>
        </div>
      </div>

      <div className="max-w-md mx-auto px-6 mt-8 space-y-6">
        {/* Webcam Viewfinder */}
        <div className="relative aspect-[4/5] w-full rounded-[2.5rem] overflow-hidden bg-black border-4 border-white shadow-2xl">
          {!result && (
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={{ facingMode: "environment" }}
              className="w-full h-full object-cover"
            />
          )}

          {isScanning && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10 text-white">
              <div className="absolute top-0 left-0 w-full h-1 bg-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.8)] animate-pulse"></div>
              <div className="flex flex-col items-center gap-4">
                <div className="p-4 bg-white/10 rounded-full backdrop-blur-md">
                  <RefreshCw className="text-white animate-spin" size={48} />
                </div>
                <p className="text-white font-black text-xl tracking-tight">Analyzing Waste...</p>
              </div>
            </div>
          )}

          {result && result.image && (
            <div className="absolute inset-0 z-10 animate-in fade-in zoom-in duration-300">
              <img src={result.image} alt="Captured item" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-rose-900/10" />
            </div>
          )}

          {/* Viewfinder Overlay */}
          {!result && !isScanning && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-12 left-12 w-12 h-12 border-t-4 border-l-4 border-white/50 rounded-tl-3xl" />
              <div className="absolute top-12 right-12 w-12 h-12 border-t-4 border-r-4 border-white/50 rounded-tr-3xl" />
              <div className="absolute bottom-12 left-12 w-12 h-12 border-b-4 border-l-4 border-white/50 rounded-bl-3xl" />
              <div className="absolute bottom-12 right-12 w-12 h-12 border-b-4 border-r-4 border-white/50 rounded-br-3xl" />
              
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-white/20 rounded-full border-dashed animate-[spin_8s_linear_infinite]" />
            </div>
          )}
        </div>

        {/* Controls */}
        {!result && !isScanning && (
          <button
            onClick={capture}
            className="w-full bg-rose-700 hover:bg-rose-800 text-white py-6 rounded-[2rem] font-black text-lg flex items-center justify-center gap-3 shadow-xl shadow-rose-200 active:scale-95 transition-all group"
          >
            <Zap size={24} className="text-white group-hover:scale-110 transition-transform fill-current" />
            <span className="text-white">Capture & Analyze</span>
          </button>
        )}

        {/* Result Card */}
        {result && (
          <div className="bg-white rounded-[2.5rem] p-8 space-y-6 shadow-xl border border-rose-100 animate-in slide-in-from-bottom-8 duration-500">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3 text-sage-800 font-black">
                <div className="p-2 bg-sage-50 rounded-xl">
                  <CheckCircle2 size={24} className="text-sage-700" />
                </div>
                <div className="leading-tight">
                  <p className="text-[10px] uppercase tracking-widest text-gray-500 font-black">AI Detection</p>
                  <p className="text-lg text-black font-black">{result.material}</p>
                </div>
              </div>
              <button 
                onClick={() => setResult(null)} 
                className="p-3 bg-gray-100 text-gray-500 hover:text-rose-700 hover:bg-rose-50 rounded-2xl transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 focus-within:border-rose-300 transition-colors">
                <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Enter Weight (kg)</p>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  placeholder="0.0"
                  value={result.weight || ''}
                  onChange={handleWeightChange}
                  className="w-full bg-transparent text-xl font-black text-black focus:outline-none placeholder:text-gray-300"
                  autoFocus
                />
              </div>
              <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200">
                <p className="text-[10px] text-rose-700 uppercase font-black tracking-widest mb-1">Total Value (₹)</p>
                <p className="text-xl font-black text-black">₹{result.value.toFixed(2)}</p>
                <p className="text-[8px] text-rose-400 font-bold uppercase mt-1">₹{result.price_per_kg}/kg</p>
              </div>
            </div>

            <button
              onClick={handleConfirm}
              disabled={!result.weight || result.weight <= 0}
              className={`w-full py-5 rounded-[2rem] font-black shadow-lg active:scale-95 transition-all flex items-center justify-center gap-3 ${
                !result.weight || result.weight <= 0 
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                : 'bg-sage-700 hover:bg-sage-800 text-white shadow-sage-100'
              }`}
            >
              <span className="text-white">Save Scan & Log Data</span>
              <CheckCircle2 size={20} className="text-white" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
