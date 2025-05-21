import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileQuestion, 
  Users, 
  BarChart3, 
  Settings, 
  LogOut,
  Menu,
  NotepadTextDashed,
  Workflow,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const logo = "/logo.png";

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const { user, logout } = useAuth();
  
  const navItems = [
    {
      title: 'Dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />,
      href: '/dashboard',
    },
    {
      title: 'Forms',
      icon: <FileQuestion className="h-5 w-5" />,
      href: '/forms',
      active: location.pathname.includes('/forms'),
    },
    {
      title: 'Users',
      icon: <Users className="h-5 w-5" />,
      href: '/users',
    },
    {
      title: 'Payments',
      icon: <BarChart3 className="h-5 w-5" />,
      href: '/payments',
    },
    {
      title: 'Templates',
      icon: <NotepadTextDashed className="h-5 w-5" />,
      href: '/templates/list',
    },
    {
      title: 'Workflows',
      icon: <Workflow className="h-5 w-5" />,
      href: '/workflows',
    },
    {
      title: 'Settings',
      icon: <Settings className="h-5 w-5" />,
      href: '/settings',
    },
  ];
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-30">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="bg-white"
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>
      
      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-20 w-64 transform bg-white border-r border-gray-200 transition-transform duration-200 ease-in-out",
        sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center h-16 px-6 border-b">
            <Link to="/dashboard" className="flex items-center">
              <div className="bg-transparent text-white p-1.5 rounded mr-2">
                {/* <FileQuestion className="h-6 w-6" /> */}
                <img src={logo} alt="Logo" className="h-8 w-8" />
              </div>
              <span className="text-xl font-bold">Ecom Africa Pro</span>
            </Link>
          </div>
          
          {/* Nav Items */}
          <nav className="flex-1 px-4 pt-4 pb-4 space-y-1 overflow-y-auto">
            {navItems.map((item, index) => (
              <Link
                key={index}
                to={item.href}
                className={cn(
                  "flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-all",
                  location.pathname === item.href || item.active
                    ? "bg-brand-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                <span className={cn(
                  "mr-3",
                  location.pathname === item.href || item.active
                    ? "text-blue-600"
                    : "text-gray-500"
                )}>
                  {item.icon}
                </span>
                {item.title}
              </Link>
            ))}
          </nav>
          
          {/* User Profile */}
          <div className="p-4 border-t">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-semibold">
                {user?.name?.charAt(0)}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              <Button variant="ghost" size="icon" className="ml-auto" title="Log out" onClick={logout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </aside>
      
      {/* Main Content */}
      <div className="lg:pl-64">
        <main className="min-h-screen p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
      
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-10 bg-black bg-opacity-50 lg:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default DashboardLayout;
