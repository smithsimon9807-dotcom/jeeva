import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Users, 
  ClipboardList, 
  MessageSquare, 
  BarChart3, 
  LogOut, 
  User, 
  CheckSquare,
  LayoutDashboard,
  Star
} from 'lucide-react';
import { cn } from '../lib/utils';

interface SidebarProps {
  role: 'Admin' | 'Employee';
}

export const Sidebar: React.FC<SidebarProps> = ({ role }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const adminLinks = [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/employees', icon: Users, label: 'Employees' },
    { to: '/admin/tasks', icon: ClipboardList, label: 'Tasks' },
    { to: '/admin/responses', icon: MessageSquare, label: 'Responses' },
    { to: '/admin/feedback', icon: Star, label: 'Feedback' },
    { to: '/admin/analysis', icon: BarChart3, label: 'Analysis' },
  ];

  const employeeLinks = [
    { to: '/employee/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/employee/profile', icon: User, label: 'My Profile' },
    { to: '/employee/tasks', icon: ClipboardList, label: 'Assigned Tasks' },
    { to: '/employee/responses', icon: CheckSquare, label: 'My Responses' },
    { to: '/employee/feedback', icon: Star, label: 'My Feedback' },
  ];

  const links = role === 'Admin' ? adminLinks : employeeLinks;

  return (
    <div className="fixed left-0 top-0 h-full w-[230px] bg-[#f8c8dc] border-r border-[#e75480]/20 flex flex-col shadow-lg z-40">
      <div className="p-6 border-b border-[#e75480]/20">
        <h1 className="text-xl font-bold text-[#e75480] tracking-tight">EMS Tracker</h1>
        <p className="text-xs text-[#e75480]/70 mt-1 uppercase tracking-widest">{role} Portal</p>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
              isActive 
                ? "bg-[#e75480] text-white shadow-md" 
                : "text-[#e75480] hover:bg-[#e75480]/10"
            )}
          >
            <link.icon size={20} className={cn("transition-transform group-hover:scale-110")} />
            <span className="font-medium">{link.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-[#e75480]/20">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-[#e75480] hover:bg-red-50 hover:text-red-600 transition-all duration-200 group"
        >
          <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};
