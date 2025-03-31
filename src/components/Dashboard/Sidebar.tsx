import { NavLink } from 'react-router-dom';
import { Home, Compass, FolderKanban, Library } from 'lucide-react';

export const Sidebar = () => {
  return (
    <div className="w-[240px] bg-[#111111] border-r border-zinc-800 flex flex-col">
      <div className="p-4 flex items-center gap-2">
        <div className="w-6 h-6">
          <svg viewBox="0 0 24 24" className="text-emerald-500 w-6 h-6">
            <path
              fill="currentColor"
              d="M12 2L2 19h20L12 2zm0 3.8L18.5 17H5.5L12 5.8z"
            />
          </svg>
        </div>
        <span className="font-semibold text-zinc-100">Story Generator</span>
      </div>
      
      <div className="p-2">
        <button className="w-full flex items-center gap-2 px-3 py-1.5 text-sm bg-zinc-900 text-zinc-100 rounded-md">
          <span className="text-xs">New Thread</span>
          <span className="text-xs text-zinc-500 ml-auto">Ctrl ⌘ P</span>
        </button>
      </div>

      <nav className="flex-1 p-2">
        <ul className="space-y-1">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 text-sm ${
                  isActive ? 'text-zinc-100 bg-zinc-800' : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800'
                } rounded-md`
              }
            >
              <Home size={16} />
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/discover"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 text-sm ${
                  isActive ? 'text-zinc-100 bg-zinc-800' : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800'
                } rounded-md`
              }
            >
              <Compass size={16} />
              Discover
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/spaces"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 text-sm ${
                  isActive ? 'text-zinc-100 bg-zinc-800' : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800'
                } rounded-md`
              }
            >
              <FolderKanban size={16} />
              Spaces
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/library"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 text-sm ${
                  isActive ? 'text-zinc-100 bg-zinc-800' : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800'
                } rounded-md`
              }
            >
              <Library size={16} />
              Library
            </NavLink>
          </li>
        </ul>
      </nav>

      {/* <div className="p-2 mt-auto">
        <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-zinc-400 hover:text-zinc-100 rounded-md hover:bg-zinc-800">
          <Download size={16} />
          Download
        </button>
      </div> */}
    </div>
  );
};