import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  MapPin,
  Users,
  FileText,
  Settings,
  X
} from 'lucide-react';

const SidebarLink = ({ to, icon, label, exact }) => {
  return (
    <NavLink
      to={to}
      end={exact}
      className={({ isActive }) =>
        `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
          isActive
            ? 'bg-[#404020] text-white'
            : 'text-black hover:bg-gray-200 hover:text-gray-900'
        }`
      }
    >
      <div className="mr-3 flex-shrink-0 h-6 w-6 flex items-center justify-center">
        {icon}
      </div>
      {label}
    </NavLink>
  );
};

const AdminSidebar = ({ visible = true, onClose }) => {
  if (!visible) return null;

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-md flex flex-col lg:static lg:translate-x-0">
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 bg-white">
        <h1 className="text-xl font-bold text-gray-900">Admin Portal</h1>
        {onClose && (
          <button className="lg:hidden" onClick={onClose}>
            <X className="h-5 w-5 text-gray-600" />
          </button>
        )}
      </div>
      <nav className="flex-1 px-2 py-4 overflow-y-auto space-y-1">
        <SidebarLink to="/admin" exact icon={<LayoutDashboard size={20} />} label="Dashboard" />
        <SidebarLink to="/admin/venues" icon={<MapPin size={20} />} label="Venues" />
        <SidebarLink to="/admin/students" icon={<Users size={20} />} label="Students" />
        <SidebarLink to="/admin/reports" icon={<FileText size={20} />} label="Reports" />
        <SidebarLink to="/admin/settings" icon={<Settings size={20} />} label="Settings" />
      </nav>
    </div>
  );
};

export default AdminSidebar;
