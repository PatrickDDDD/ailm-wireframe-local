import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  LayoutDashboard, 
  PlusCircle, 
  LogOut, 
  BrainCircuit, 
  Bot, 
  Menu,
  X
} from 'lucide-react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useApp();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItems = [
    { label: '项目仪表盘', path: '/dashboard', icon: LayoutDashboard },
    { label: '新建项目', path: '/new-project', icon: PlusCircle },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen flex text-black font-sans bg-white">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 border-r-2 border-black bg-white">
        <div className="p-6 border-b-2 border-black flex items-center gap-3 bg-gray-50">
          <div className="border-2 border-black p-1 bg-white">
            <BrainCircuit className="w-6 h-6 text-black" />
          </div>
          <span className="font-bold text-xl tracking-tight uppercase">AiLM 线稿版</span>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 border-2 transition-all ${
                isActive(item.path)
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-black border-transparent hover:border-black hover:bg-gray-50'
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive(item.path) ? 'text-white' : 'text-black'}`} />
              <span className="font-bold">{item.label}</span>
            </Link>
          ))}

          <div className="pt-8 mt-8 border-t-2 border-black border-dashed">
             <div className="px-4 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
               工作空间
             </div>
             <Link to="/ai-studio" className={`flex items-center gap-3 px-4 py-3 border-2 ${
                location.pathname.includes('ai-studio') ? 'bg-black text-white border-black' : 'border-transparent hover:border-black'
             }`}>
               <Bot className="w-5 h-5" />
               <span className="font-bold">AI 工作室 (LLM)</span>
             </Link>
          </div>
        </nav>

        <div className="p-4 border-t-2 border-black bg-gray-50">
          <div className="flex items-center gap-3 px-4 py-3 border-2 border-black bg-white mb-2">
            <div className="w-8 h-8 bg-gray-200 border border-black flex items-center justify-center">
                <span className="text-xs font-bold">用户</span>
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold truncate">{user?.email}</p>
              <p className="text-xs text-gray-500 uppercase">管理员</p>
            </div>
          </div>
          <button 
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-bold border-2 border-black hover:bg-black hover:text-white transition-colors"
          >
            <LogOut className="w-4 h-4" />
            退出登录
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 w-full z-50 bg-white border-b-2 border-black p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <BrainCircuit className="w-6 h-6 text-black" />
          <span className="font-bold text-xl uppercase">AiLM</span>
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="border-2 border-black p-1">
          {mobileMenuOpen ? <X className="text-black" /> : <Menu className="text-black" />}
        </button>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-auto md:pt-0 pt-16 relative bg-white">
        {children}
      </main>
    </div>
  );
};