import React from 'react';
import { Episode } from '../../types/story';

interface StoryDisplayProps {
  title?: string;
  episodes: Episode[];
  isGenerating: boolean;
}

export const StoryDisplay: React.FC<StoryDisplayProps> = ({ title, episodes, isGenerating }) => {
  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      {title && (
        <h1 className="text-4xl font-bold text-zinc-100 animate-in fade-in">
          {title}
        </h1>
      )}
      <div className="space-y-6">
        {episodes.map((episode, index) => (
          <div
            key={episode.episode_id}
            className="animate-in fade-in"
            style={{ animationDelay: `${index * 200}ms` }}
          >
            <h2 className="text-xl font-semibold mb-2 text-zinc-100">
              Episode {episode.episode_number}: {episode.episode_title}
            </h2>
            <p className="text-zinc-400 leading-relaxed">
              {episode.episode_content}
            </p>
          </div>
        ))}
        {isGenerating && (
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-zinc-800 rounded w-3/4"></div>
            <div className="h-4 bg-zinc-800 rounded w-1/2"></div>
          </div>
        )}
      </div>
    </div>
  );
};