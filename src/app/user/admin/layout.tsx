'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { LogOut, X, Menu } from 'lucide-react';

interface AdminLayoutProps {
    children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

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
        <div className="flex h-screen overflow-hidden bg-linear-to-br from-[#f8f5f0] via-[#fef9f3] to-[#f5ebe0]">
            {/* Sidebar */}
            <AdminSidebar isOpen={isOpen} setIsOpen={setIsOpen} />

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Navigation */}
                <nav className="bg-white shadow-md px-3 sm:px-6 py-2 md:py-4">
                    <div className="flex justify-between items-center">
                        {/* Left Side - Title with spacing for hamburger menu on mobile */}
                        <h1 className="text-xl md:text-2xl font-bold text-gray-800">
                            Admin Dashboard
                        </h1>

                        <button
                            onClick={handleLogout}
                            disabled={loading}
                            className="hidden lg:flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <LogOut className="w-4 h-4" />
                            <span>{loading ? 'Logging out...' : 'Logout'}</span>
                        </button>

                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="lg:hidden p-2 rounded-md bg-white shadow-md hover:bg-gray-50 transition-colors"
                            aria-label="Toggle menu"
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>

                    </div>
                </nav>

                <main className="flex-1 overflow-y-auto p-2 sm:p-4 lg:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}