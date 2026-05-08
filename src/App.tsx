/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, BrainCircuit, GraduationCap, AlertCircle, RefreshCw } from 'lucide-react';
import { ImageUpload } from './components/ImageUpload';
import { ResultView } from './components/ResultView';
import { analyzeProblemImage } from './services/gemini';
import { cn } from './lib/utils';

export default function App() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelect = (file: File) => {
    setSelectedImage(file);
    setError(null);
    setResult(null);
  };

  const handleClear = () => {
    setSelectedImage(null);
    setResult(null);
    setError(null);
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    setError(null);
    
    try {
      // Convert File to base64
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const result = reader.result as string;
          const base64 = result.split(',')[1];
          resolve(base64);
        };
        reader.onerror = reject;
      });
      reader.readAsDataURL(selectedImage);
      
      const base64Data = await base64Promise;
      const mimeType = selectedImage.type;

      const analysis = await analyzeProblemImage(base64Data, mimeType);
      setResult(analysis);
    } catch (err: any) {
      console.error(err);
      setError('申し訳ありません。解析中にエラーが発生しました。画像を読み取れるか確認して、もう一度お試しください。');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen relative selection:bg-indigo-200">
      {/* Dynamic Background Blobs */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob" />
        <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
      </div>

      <main className="max-w-5xl mx-auto px-4 py-16 md:py-24 relative">
        {/* Header Section */}
        <div className="text-center space-y-8 mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/50 backdrop-blur-md text-indigo-600 text-sm font-bold tracking-widest border border-indigo-100 shadow-sm uppercase"
          >
            <Sparkles size={16} className="text-yellow-500" />
            Next-Gen Learning
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="text-5xl md:text-8xl font-black tracking-tight leading-none"
          >
            <span className="gradient-text">問題解説くん</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl md:text-2xl text-slate-500 max-w-2xl mx-auto font-medium"
          >
            スマホで撮るだけ。AIがキミの勉強を
            <span className="text-indigo-600 font-bold">爆速</span>でサポート。
          </motion.p>
        </div>

        {/* Action Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative">
          {/* Left Column: Features */}
          <div className="lg:col-span-4 space-y-6 order-2 lg:order-1">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="glass-panel p-8 rounded-[2rem] space-y-8"
            >
              <h3 className="font-black text-2xl flex items-center gap-3 italic">
                <BrainCircuit size={28} className="text-indigo-500" />
                POWER UP!
              </h3>
              <ul className="space-y-6 text-sm md:text-base font-medium">
                {[
                  { label: "数学", color: "bg-blue-500", desc: "途中式もロジカルに解説" },
                  { label: "英語", color: "bg-green-500", desc: "和訳と重要文法をマスター" },
                  { label: "理社", color: "bg-orange-500", desc: "暗記じゃなく理由で理解" },
                  { label: "国語", color: "bg-purple-500", desc: "読解のコツを伝授" }
                ].map((item, i) => (
                  <motion.li 
                    key={item.label}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    className="flex items-start gap-4 group"
                  >
                    <div className={cn("mt-1.5 w-3 h-3 rounded-full shrink-0 shadow-lg group-hover:scale-150 transition-transform", item.color)} />
                    <div>
                      <span className="block font-black text-slate-800 tracking-wider mb-0.5">{item.label}</span>
                      <span className="text-slate-500 text-sm leading-tight">{item.desc}</span>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 }}
              className="bg-indigo-600 p-8 rounded-[2rem] text-white shadow-2xl relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
              <div className="relative z-10 space-y-4">
                <h3 className="font-black text-xl flex items-center gap-2">
                  <GraduationCap size={24} />
                  GO BEYOND
                </h3>
                <p className="text-indigo-100 font-medium leading-relaxed">
                  答えだけじゃない。
                  「考える力」をAIと一緒に育てよう。
                </p>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Interaction */}
          <div className="lg:col-span-8 space-y-8 order-1 lg:order-2">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-panel p-4 md:p-8 rounded-[2.5rem] relative overflow-hidden"
            >
              <div className="space-y-8">
                <ImageUpload 
                  onImageSelect={handleImageSelect} 
                  onClear={handleClear}
                  selectedImage={selectedImage}
                  disabled={isAnalyzing}
                />
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={handleAnalyze}
                    disabled={!selectedImage || isAnalyzing}
                    className={cn(
                      "flex-[2] group relative inline-flex items-center justify-center gap-3 py-5 px-10 rounded-2xl font-black text-xl transition-all hover:scale-[1.02] active:scale-95 overflow-hidden",
                      !selectedImage 
                        ? "bg-slate-200 text-slate-400 cursor-not-allowed" 
                        : isAnalyzing
                          ? "bg-indigo-400 text-white cursor-wait"
                          : "bg-indigo-600 text-white shadow-[0_20px_50px_rgba(99,102,241,0.4)] hover:shadow-[0_20px_50px_rgba(99,102,241,0.6)]"
                    )}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    {isAnalyzing ? (
                      <>
                        <RefreshCw size={24} className="animate-spin" />
                        分析中...
                      </>
                    ) : (
                      <>
                        <BrainCircuit size={24} />
                        解説をブースト
                        <Sparkles size={20} className="text-yellow-400" />
                      </>
                    )}
                  </button>
                  
                  {selectedImage && !isAnalyzing && (
                    <button
                      onClick={handleClear}
                      className="flex-1 px-8 py-5 rounded-2xl font-black bg-white/50 backdrop-blur-md border-2 border-indigo-100 text-indigo-600 hover:bg-white hover:border-indigo-200 transition-all active:scale-95"
                    >
                      リセット
                    </button>
                  )}
                </div>
              </div>
            </motion.div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-red-50/80 backdrop-blur-md border border-red-200 p-6 rounded-2xl flex items-start gap-4 text-red-800 shadow-xl"
                >
                  <AlertCircle size={24} className="mt-0.5 shrink-0" />
                  <p className="font-bold text-lg">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Results Area */}
        <div className="mt-12">
          <ResultView content={result || ''} isLoading={isAnalyzing} />
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto px-4 py-16 text-center text-slate-400 font-bold text-sm tracking-widest uppercase">
        <p className="flex items-center justify-center gap-2">
          MADE WITH <span className="text-rose-500">❤️</span> FOR STUDENTS
        </p>
      </footer>
    </div>
  );
}
