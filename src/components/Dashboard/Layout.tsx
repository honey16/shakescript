import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Story } from './Story';
import { Library } from './Library';

// export const Layout = () => {
//   return (
//     <div className="flex h-screen bg-[#0A0A0A] text-white">
//       <Sidebar />
//       <main className="flex-1 flex flex-col">
//         <Story /> {/* Ensure Story is always displayed */}
//         <Routes>
//           <Route path="/dashboard" element={<Navigate to="/dashboard" replace />} />
//           <Route path="/discover" />
//           <Route path="/spaces"  />
//           <Route path="/library"  element={<Library/>}/>
//         </Routes>
//       </main>
//     </div>
//   );
// };

export const Layout = () => {
  const location = useLocation();
  const path = location.pathname;
  
  // Check if we're on the main dashboard route
  const isMainDashboard = path === '/dashboard' || path === '/dashboard/';

  return (
    <div className="flex h-screen bg-[#0A0A0A] text-white">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        {/* Only show Story component on main dashboard route */}
        {isMainDashboard && <Story />}
        
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          {/* <Route path="/story" element={<Story />} /> */}
          <Route path="/discover" element={<div>Discover Page</div>} />
          <Route path="/spaces" element={<div>Spaces Page</div>} />
          <Route path="/library" element={<Library />} />
        </Routes>
      </main>
    </div>
  );
};