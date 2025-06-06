import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  CheckSquare,
  Settings
} from 'lucide-react';

const SidebarLink = ({ to, icon, label, exact }) => (
  <NavLink
    to={to}
    end={exact}
    className={({ isActive }) =>
      `group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
        isActive
          ? 'bg-[#404020] text-white'
          : 'text-gray-700 hover:bg-gray-200 hover:text-gray-900'
      }`
    }
  >
    <span className="mr-3">{icon}</span>
    {label}
  </NavLink>
);

const TeacherSidebar = () => (
  <aside
    className="
      hidden lg:flex
      flex-col
      fixed inset-y-0 left-0
      w-64
      bg-white
      border-r border-gray-200
      overflow-y-auto
    "
  >
    <div className="flex items-center h-16 px-4 border-b border-gray-200">
      <h1 className="text-xl font-bold text-gray-900">Teacher Portal</h1>
    </div>
    <nav className="flex-1 px-2 py-4 space-y-1">
      <SidebarLink to="/teacher" exact icon={<LayoutDashboard size={20} />} label="Dashboard" />
      <SidebarLink to="/teacher/classes" icon={<BookOpen size={20} />} label="My Classes" />
      <SidebarLink to="/teacher/attendance" icon={<CheckSquare size={20} />} label="Attendance" />
      <SidebarLink to="/teacher/settings" icon={<Settings size={20} />} label="Settings" />
    </nav>
  </aside>
);

export default TeacherSidebar;
