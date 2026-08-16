import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, PieChart, Target, Bell, LogOut, Wallet, TrendingUp } from 'lucide-react';

export default function Sidebar({ onLogout }) {
  const menuItems = [
    { name: 'Dashboard', icon: Home, path: '/' },
    { name: 'Expenses', icon: PieChart, path: '/expenses' },
    { name: 'Budgets', icon: TrendingUp, path: '/budgets' },
    { name: 'Goals', icon: Target, path: '/goals' },
    { name: 'Reminders', icon: Bell, path: '/reminders' },
  ];

  return (
    <aside className="flex flex-col w-full lg:w-64 bg-white border-b lg:border-b-0 lg:border-r border-slate-200 sticky lg:fixed top-0 lg:top-0 lg:left-0 lg:h-screen z-20">
      <div className="min-w-0 p-4 lg:p-8 lg:pb-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center space-x-3 text-primary-600 min-w-0">
            <div className="p-2 bg-primary-50 rounded-lg flex-shrink-0">
              <Wallet size={24} strokeWidth={2.5} />
            </div>
            <div className="min-w-0">
              <h1 className="text-xl font-black tracking-tight text-slate-900 truncate">Trackify</h1>
              <p className="hidden lg:block text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Smart Finance Assistant</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            aria-label="Logout"
            className="lg:hidden flex items-center justify-center p-3 text-slate-500 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all duration-200 flex-shrink-0"
          >
            <LogOut className="w-5 h-5" strokeWidth={2} />
          </button>
        </div>
      </div>

      <nav className="flex lg:flex-col items-center lg:items-stretch gap-2 lg:gap-0 lg:space-y-2 overflow-x-auto lg:overflow-visible px-4 lg:px-4 pb-4 lg:pb-0 lg:mt-4 lg:flex-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-xl transition-all duration-200 whitespace-nowrap lg:whitespace-normal ${
                isActive
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-200'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className={`w-5 h-5 mr-3 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} strokeWidth={isActive ? 2.5 : 2} />
                <span className="font-black">{item.name}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="hidden lg:block lg:border-t lg:border-slate-100 lg:p-4">
        <button
          onClick={onLogout}
          className="flex w-full items-center px-4 py-3 text-slate-500 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all duration-200"
        >
          <LogOut className="w-5 h-5 mr-3" strokeWidth={2} />
          <span className="font-black">Logout</span>
        </button>
      </div>
    </aside>
  );
}
