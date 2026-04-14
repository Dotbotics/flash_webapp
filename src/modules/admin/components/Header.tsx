/**
 * ADMIN/HEADER.TSX
 * 
 * What it does:
 * The top header for the admin dashboard.
 * 
 * Why it exists:
 * To display the current view's title and provide a "Logout" button.
 * 
 * Connections:
 * - Receives the 'onLogout' handler from 'Dashboard.tsx'.
 * 
 * Module: Admin / Components
 */

import { LogOut } from 'lucide-react';

interface DashboardHeaderProps {
  onLogout: () => void;
}

export const DashboardHeader = ({ onLogout }: DashboardHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-12">
      <h1 className="text-4xl font-bold text-[#262626]">Admin Dashboard</h1>
      <button 
        onClick={onLogout}
        className="flex items-center space-x-2 px-6 py-3 bg-white text-[#262626] rounded-xl font-bold hover:bg-black/5 transition-colors"
      >
        <LogOut className="w-5 h-5" />
        <span>Logout</span>
      </button>
    </div>
  );
};
