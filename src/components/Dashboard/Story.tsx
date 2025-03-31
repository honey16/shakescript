import { useState } from 'react';
import axios from 'axios';
import { StoryPrompt } from './StoryPrompt';
import { StoryDisplay } from './StoryDisplay';
import { Episode, StoryResponse } from '../../types/story';

export const Story = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [story, setStory] = useState<{ title?: string; episodes: Episode[] }>({
    episodes: []
  });

  const handleSubmit = async (prompt: string, numEpisodes: number) => {
    setIsGenerating(true);
    try {
      // First API call to create story
      const createStoryResponse = await axios.post<StoryResponse>(
        'http://localhost:8000/api/v1/stories/',
        {
          prompt,
          num_episodes: numEpisodes,
        }
      );

      // Second API call to generate episodes
      const episodesResponse = await axios.post<Episode[]>(
        `http://localhost:8000/api/v1/episodes/${createStoryResponse.data.story_id}/generate`,
        null,
        {
          params: {
            all: true
          }
        }
      );

      setStory({
        title: createStoryResponse.data.title,
        episodes: episodesResponse.data,
      });
    } catch (error) {
      console.error('Error generating story:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <div className="flex-1 overflow-y-auto pb-32">
        {story.episodes.length === 0 && !isGenerating ? (
          <div className="h-full flex items-center justify-center">
            <h1 className="text-5xl font-bold text-center text-zinc-100">
              Start generating your story now!
            </h1>
          </div>
        ) : (
          <StoryDisplay
            title={story.title}
            episodes={story.episodes}
            isGenerating={isGenerating}
          />
        )}
      </div>
      <StoryPrompt onSubmit={handleSubmit} isGenerating={isGenerating} />
    </>
  );
};