import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { Search, Download, ArrowLeft } from 'lucide-react';
import { jsPDF } from 'jspdf';

interface Story {
  story_id: number;
  title: string;
}

interface Character {
  Name: string;
  Role: string;
  Description: string;
  Relationship: Record<string, any>;
  role_active: boolean;
}

interface StoryDetails {
  story_id: number;
  title: string;
  setting: string[];
  characters: Record<string, Character>;
  special_instructions: string;
  story_outline: Record<string, string>;
  current_episode: number;
  episodes: {
    id: number;
    number: number;
    title: string;
    content: string;
    summary: string;
  }[];
  summary: string;
}

const ClassicLoader = () => {
  return (
    <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-emerald-500" />
  );
};

export const Library = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [selectedStory, setSelectedStory] = useState<StoryDetails | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingStories, setLoadingStories] = useState(true);

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/v1/stories/all');
      setStories(response.data.stories);
    } catch (error) {
      console.error('Error fetching stories:', error);
    } finally {
      setLoadingStories(false);
    }
  };

  const handleStoryClick = async (storyId: number) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8000/api/v1/stories/${storyId}`);
      setSelectedStory(response.data);
    } catch (error) {
      console.error('Error fetching story details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!selectedStory) return;

    const doc = new jsPDF();
    const lineHeight = 10;
    let yPosition = 20;

    // Add title
    doc.setFontSize(24);
    doc.text(selectedStory.title, 20, yPosition);
    yPosition += lineHeight * 2;

    // Add summary
    doc.setFontSize(14);
    const summaryLines = doc.splitTextToSize(selectedStory.summary, 170);
    summaryLines.forEach((line: string) => {
      doc.text(line, 20, yPosition);
      yPosition += lineHeight;
    });
    yPosition += lineHeight;

    // Add episodes
    selectedStory.episodes.forEach((episode) => {
      // Episode title
      doc.setFontSize(16);
      doc.text(`Episode ${episode.number}: ${episode.title}`, 20, yPosition);
      yPosition += lineHeight;

      // Episode content
      doc.setFontSize(12);
      const contentLines = doc.splitTextToSize(episode.content, 170);
      contentLines.forEach((line: string) => {
        if (yPosition > 280) {
          doc.addPage();
          yPosition = 20;
        }
        doc.text(line, 20, yPosition);
        yPosition += lineHeight;
      });
      yPosition += lineHeight;
    });

    doc.save(`${selectedStory.title.toLowerCase().replace(/\s+/g, '-')}.pdf`);
  };

  const filteredStories = stories.filter((story) =>
    story.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 bg-[#0A0A0A] p-8 overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        {!selectedStory ? (
          <>
            <div className="mb-8 space-y-4">
              <h1 className="text-3xl font-bold text-zinc-100">Your Library</h1>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search stories..."
                  className="w-full pl-10 pr-4 py-3 bg-[#111111] text-zinc-100 rounded-lg border border-zinc-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {loadingStories ? (
              <div className="flex items-center justify-center py-12">
                <ClassicLoader />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <AnimatePresence>
                  {filteredStories.map((story) => (
                    <motion.div
                      key={story.story_id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleStoryClick(story.story_id)}
                      className="cursor-pointer rounded-xl p-6 bg-[#111111] border border-zinc-800 hover:border-zinc-700 transition-all duration-300"
                    >
                      <h3 className="text-lg font-medium text-zinc-100 mb-4">{story.title}</h3>
                      <div className="h-[2px] w-12 bg-emerald-500 rounded-full" />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </>
        ) : (
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <button
                onClick={() => setSelectedStory(null)}
                className="flex items-center gap-2 text-zinc-400 hover:text-zinc-100 transition-colors"
              >
                <ArrowLeft size={20} />
                <span>Back to Library</span>
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
              >
                <Download size={20} />
                <span>Download PDF</span>
              </button>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <ClassicLoader />
              </div>
            ) : (
              <div className="space-y-8 animate-in fade-in">
                <div>
                  <h1 className="text-4xl font-bold text-zinc-100 mb-4">{selectedStory.title}</h1>
                  <p className="text-zinc-400">{selectedStory.summary}</p>
                </div>

                <div className="space-y-6">
                  {selectedStory.episodes.map((episode) => (
                    <div
                      key={episode.id}
                      className="p-6 bg-[#111111] border border-zinc-800 rounded-xl"
                    >
                      <h2 className="text-xl font-semibold text-zinc-100 mb-4">
                        Episode {episode.number}: {episode.title}
                      </h2>
                      <div className="text-zinc-400 leading-relaxed">
                        {episode.content.split('\n').map((line, i) => (
                          <p key={i}>{line}</p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};