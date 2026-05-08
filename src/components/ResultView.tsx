import ReactMarkdown from 'react-markdown';
import { motion } from 'motion/react';
import { CheckCircle2, Info } from 'lucide-react';

interface ResultViewProps {
  content: string;
  isLoading: boolean;
}

export function ResultView({ content, isLoading }: ResultViewProps) {
  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto space-y-6">
        <div className="glass-panel p-10 rounded-[2.5rem] animate-pulse">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-10 w-10 bg-indigo-100 rounded-2xl" />
            <div className="h-8 bg-indigo-100 rounded-full w-48" />
          </div>
          <div className="space-y-4">
            <div className="h-4 bg-slate-100 rounded-full w-full" />
            <div className="h-4 bg-slate-100 rounded-full w-5/6" />
            <div className="h-4 bg-slate-100 rounded-full w-4/6" />
          </div>
          <div className="mt-10 h-64 bg-slate-50 rounded-3xl w-full" />
        </div>
      </div>
    );
  }

  if (!content) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl mx-auto space-y-8 mt-12 p-8 md:p-12 glass-panel rounded-[3rem] relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-50" />
      
      <div className="flex items-center gap-3 text-indigo-600 font-black text-3xl italic tracking-tighter border-b border-indigo-50 pb-8 mb-10 relative z-10">
        <CheckCircle2 size={36} className="text-indigo-500" />
        MISSION CLEAR!
      </div>

      <div className="prose prose-indigo max-w-none relative z-10 px-2">
        <ReactMarkdown
          components={{
            h1: ({ children }) => <h1 className="text-3xl font-black mt-12 mb-6 block gradient-text uppercase tracking-tight">{children}</h1>,
            h2: ({ children }) => <h2 className="text-2xl font-black mt-10 mb-4 text-slate-800 flex items-center gap-2">
              <span className="w-2 h-8 bg-indigo-500 rounded-full" />
              {children}
            </h2>,
            p: ({ children }) => <p className="mb-6 leading-loose text-lg font-medium text-slate-600 whitespace-pre-wrap">{children}</p>,
            strong: ({ children }) => <strong className="font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">{children}</strong>,
            blockquote: ({ children }) => (
              <blockquote className="border-l-8 border-indigo-200 pl-6 my-8 text-slate-500 font-bold italic text-xl italic leading-relaxed">
                {children}
              </blockquote>
            ),
            code: ({ children }) => (
              <code className="bg-slate-800 text-pink-400 px-2 py-1 rounded-lg text-sm font-black shadow-lg mx-1 font-mono">
                {children}
              </code>
            ),
            ul: ({ children }) => <ul className="space-y-4 mb-8 ml-6 list-none">{children}</ul>,
            li: ({ children }) => <li className="flex gap-3 items-center">
              <span className="w-2 h-2 bg-indigo-400 rounded-full shrink-0" />
              {children}
            </li>,
          }}
        >
          {content}
        </ReactMarkdown>
      </div>

      <div className="mt-12 pt-8 border-t border-indigo-50 flex items-start gap-4 text-sm font-bold text-slate-400 bg-indigo-50/30 p-6 rounded-3xl relative z-10">
        <Info size={24} className="shrink-0 text-indigo-300" />
        <p className="leading-relaxed">
          AIの回答は完璧ではありません。特に数学の難問などは、この解説をヒントにして
          <span className="text-indigo-500">キミ自身の頭</span>で最後の一歩を解ききってみよう！
        </p>
      </div>
    </motion.div>
  );
}
