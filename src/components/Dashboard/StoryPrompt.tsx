import React, { useState } from 'react';
import { Send, Globe, RotateCw } from 'lucide-react';

interface StoryPromptProps {
  onSubmit: (prompt: string, episodes: number) => void;
  isGenerating: boolean;
}

export const StoryPrompt: React.FC<StoryPromptProps> = ({ onSubmit, isGenerating }) => {
  const [prompt, setPrompt] = useState('');
  const [episodes, setEpisodes] = useState(5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && episodes > 0) {
      onSubmit(prompt, episodes);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className={`border-t border-zinc-800 bg-[#111111] transition-all duration-300 ease-in-out ${
        isGenerating ? 'translate-y-[80%]' : 'translate-y-0'
      }`}
    >
      <div className="max-w-3xl mx-auto p-4">
        <div className="relative">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ask anything..."
                className="w-full pl-4 pr-24 py-3 bg-zinc-900 text-zinc-100 rounded-lg border border-zinc-800 focus:outline-none focus:border-zinc-700"
                disabled={isGenerating}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <button
                  type="button"
                  className="p-1.5 text-zinc-400 hover:text-zinc-100"
                >
                  <Globe size={16} />
                </button>
                <button
                  type="button"
                  className="p-1.5 text-zinc-400 hover:text-zinc-100"
                >
                  <RotateCw size={16} />
                </button>
              </div>
            </div>
            <div className="w-20">
              <input
                type="number"
                value={episodes}
                onChange={(e) => setEpisodes(parseInt(e.target.value) || 1)}
                min="1"
                max="50"
                className="w-full px-3 py-3 bg-zinc-900 text-zinc-100 rounded-lg border border-zinc-800 focus:outline-none focus:border-zinc-700"
                disabled={isGenerating}
              />
            </div>
            <button
              type="submit"
              disabled={isGenerating || !prompt.trim()}
              className="px-4 py-3 bg-zinc-900 text-zinc-100 rounded-lg border border-zinc-800 hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};