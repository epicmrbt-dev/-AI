import React, { useRef, useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  onClear: () => void;
  selectedImage: File | null;
  disabled?: boolean;
}

export function ImageUpload({ onImageSelect, onClear, selectedImage, disabled }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  React.useEffect(() => {
    if (selectedImage) {
      const url = URL.createObjectURL(selectedImage);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [selectedImage]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (disabled) return;
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      onImageSelect(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onImageSelect(file);
    }
  };

  return (
    <div className="w-full">
      {previewUrl ? (
        <div className="relative group rounded-3xl overflow-hidden glass-panel aspect-video md:aspect-auto">
          <img 
            src={previewUrl} 
            alt="Preview" 
            className="w-full h-full object-contain bg-slate-100/50"
          />
          {!disabled && (
            <button
              onClick={onClear}
              className="absolute top-4 right-4 p-3 bg-red-500 text-white rounded-2xl opacity-0 group-hover:opacity-100 transition-all shadow-xl hover:scale-110 active:scale-95"
              title="画像を削除"
            >
              <X size={24} />
            </button>
          )}
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !disabled && fileInputRef.current?.click()}
          className={cn(
            "relative border-4 border-dashed rounded-[2.5rem] p-12 transition-all cursor-pointer flex flex-col items-center justify-center text-center space-y-6",
            isDragging 
              ? "border-indigo-500 bg-indigo-50/50 scale-[1.02]" 
              : "border-slate-200 hover:border-indigo-400 hover:bg-white/50",
            disabled && "opacity-50 cursor-not-allowed pointer-events-none"
          )}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleChange}
            accept="image/*"
            className="hidden"
          />
          <div className="p-6 rounded-3xl bg-indigo-100 text-indigo-600 shadow-inner">
            <Upload size={40} />
          </div>
          <div>
            <p className="font-black text-2xl text-slate-800 italic uppercase tracking-tight">SHOT THE PROBLEM!</p>
            <p className="text-slate-500 mt-2 font-medium">
              問題用紙や参考書の写真をアップロードしてください
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-black text-indigo-400 bg-indigo-50 px-4 py-1.5 rounded-full uppercase tracking-widest">
            <ImageIcon size={14} />
            PNG, JPG, WEBP READY
          </div>
        </div>
      )}
    </div>
  );
}
