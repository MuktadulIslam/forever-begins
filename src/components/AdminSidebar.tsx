'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Heart,
  Image,
  Users,
  Settings,
  Calendar,
  LayoutDashboard,
  LogOut,
  Folder
} from 'lucide-react';

interface MenuItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href: string;
}

const menuItems: MenuItem[] = [
  {
    icon: LayoutDashboard,
    label: 'Dashboard',
    href: '/user/admin'
  },
  {
    icon: Heart,
    label: 'Love Story Timeline',
    href: '/user/admin/timeline'
  },
  {
    icon: Folder,
    label: 'Photo Albums',
    href: '/user/admin/albums'
  },
  {
    icon: Image,
    label: 'Memory Cards',
    href: '/user/admin/memory-cards'
  },
  {
    icon: Users,
    label: 'Guest List',
    href: '/user/admin/guests'
  },
  {
    icon: Calendar,
    label: 'Events',
    href: '/user/admin/events'
  },
  {
    icon: Settings,
    label: 'Settings',
    href: '/user/admin/settings'
  }
];

export default function AdminSidebar({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: React.Dispatch<React.SetStateAction<boolean>> }) {
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      });
      router.push('/user/auth/login');
    } catch (error) {
      console.error('Logout error:', error);
      setLoading(false);
    }
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/20 bg-opacity-50 z-40"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full bg-white shadow-xl z-40 transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static
          w-64
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo/Header */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 font-playfair">
              Admin Panel
            </h2>
            <p className="text-sm text-gray-500 mt-1">Forever Begins</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1 px-3">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`
                        flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                        ${
                          isActive
                            ? 'bg-linear-to-r from-[#9caf88] to-[#d4a5a5] text-white shadow-md'
                            : 'text-gray-700 hover:bg-gray-100'
                        }
                      `}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Logout Button (Mobile & Tablet) */}
          <div className="lg:hidden p-3 border-gray-200">
            <button
              onClick={handleLogout}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-4 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">
                {loading ? 'Logging out...' : 'Logout'}
              </span>
            </button>
          </div>

          {/* Footer */}
          <div className="px-4 py-1.5 border-t border-gray-200 lg:border-t-0">
            <p className="text-xs text-gray-500 text-center">
              &copy; 2025 Forever Begins
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
