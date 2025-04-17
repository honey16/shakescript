import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Compass, FolderKanban, Library, ChevronLeft, ChevronRight } from 'lucide-react';
import { StoryPrompt } from './StoryPrompt';

interface SidebarProps {
  onSubmit: (prompt: string, episodes: number, isHinglish: boolean, refineMethod: 'human' | 'ai', batchSize: number) => void;
  isGenerating: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ onSubmit, isGenerating }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showStoryPrompt, setShowStoryPrompt] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      <div 
        className={`relative bg-[#111111] border-r border-zinc-800 flex flex-col transition-all duration-300 ${
          isCollapsed ? 'w-[80px]' : 'w-[240px]'
        }`}
      >
        <div className={`p-6 flex items-center gap-2 ${isCollapsed ? 'justify-center' : ''}`}>
          <div className="w-6 h-6 flex-shrink-0">
            <svg viewBox="0 0 24 24" className="text-emerald-500 w-6 h-6">
              <path
                fill="currentColor"
                d="M12 2L2 19h20L12 2zm0 3.8L18.5 17H5.5L12 5.8z"
              />
            </svg>
          </div>
          {!isCollapsed && <span className="font-semibold text-zinc-100">Story Generator</span>}
        </div>
        
        <div className={`p-2 ${isCollapsed ? 'px-2' : ''}`}>
          <button 
            onClick={() => setShowStoryPrompt(true)}
            className={`w-full flex items-center gap-2 px-3 py-2 text-sm bg-zinc-900 text-zinc-100 rounded-md hover:bg-zinc-800 transition-colors ${
              isCollapsed ? 'justify-center' : ''
            }`}
          >
            {!isCollapsed && <span className="text-xs">New Thread</span>}
            {!isCollapsed && <span className="text-xs text-zinc-500 ml-auto">Ctrl ⌘ P</span>}
            {isCollapsed && <span className="text-xs">+</span>}
          </button>
        </div>

        <nav className="flex-1 px-4">
          <ul className="space-y-1">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 text-sm ${
                    isActive ? 'text-zinc-100 bg-zinc-800' : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800'
                  } rounded-md ${isCollapsed ? 'justify-center' : ''}`
                }
              >
                <Home size={16} />
                {!isCollapsed && 'Home'}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/discover"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 text-sm ${
                    isActive ? 'text-zinc-100 bg-zinc-800' : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800'
                  } rounded-md ${isCollapsed ? 'justify-center' : ''}`
                }
              >
                <Compass size={16} />
                {!isCollapsed && 'Discover'}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/spaces"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 text-sm ${
                    isActive ? 'text-zinc-100 bg-zinc-800' : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800'
                  } rounded-md ${isCollapsed ? 'justify-center' : ''}`
                }
              >
                <FolderKanban size={16} />
                {!isCollapsed && 'Spaces'}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/dashboard/library"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 text-sm ${
                    isActive ? 'text-zinc-100 bg-zinc-800' : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800'
                  } rounded-md ${isCollapsed ? 'justify-center' : ''}`
                }
              >
                <Library size={16} />
                {!isCollapsed && 'Library'}
              </NavLink>
            </li>
          </ul>
        </nav>

        {/* Collapse button */}
        <button
          onClick={toggleSidebar}
          className="absolute -right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-zinc-800 border border-zinc-700 rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-100 hover:bg-zinc-700 transition-colors z-10"
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* Story Prompt Modal */}
      {showStoryPrompt && (
        <StoryPrompt
          onSubmit={onSubmit}
          isGenerating={isGenerating}
          onClose={() => setShowStoryPrompt(false)}
        />
      )}
    </>
  );
};