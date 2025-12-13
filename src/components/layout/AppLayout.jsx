import { Outlet } from 'react-router-dom';
import NavigationBar from './NavigationBar';
import Sidebar from './Sidebar';
import '../../styles/glassmorphism.css';

const AppLayout = () => {
  return (
    <div className="water-bg min-h-screen">
      {/* Navigation */}
      <NavigationBar />
      
      {/* Main Content Area */}
      <div className="flex">
        {/* Sidebar */}
        <div className="hidden lg:block w-64 fixed left-0 top-16 h-[calc(100vh-4rem)] overflow-y-auto">
          <Sidebar />
        </div>
        
        {/* Main Content */}
        <div className="flex-1 lg:ml-64">
          <main className="container mx-auto px-4 py-6 max-w-4xl">
            <Outlet />
          </main>
        </div>
      </div>
      
      {/* Floating decorative elements */}
      <div className="fixed top-20 left-10 w-20 h-20 bg-white/5 rounded-full floating blur-sm pointer-events-none" />
      <div className="fixed top-40 right-20 w-32 h-32 bg-blue-500/5 rounded-full floating blur-md pointer-events-none" style={{ animationDelay: '2s' }} />
      <div className="fixed bottom-20 left-1/4 w-16 h-16 bg-purple-500/5 rounded-full floating blur-sm pointer-events-none" style={{ animationDelay: '4s' }} />
    </div>
  );
};

export default AppLayout;