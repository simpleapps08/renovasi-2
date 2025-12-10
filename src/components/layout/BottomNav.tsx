import { Home, FileText, Inbox, User, MessageCircle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface NavItem {
    icon: typeof Home | typeof MessageCircle;
    label: string;
    path?: string; // Make path optional for chat item
    action?: () => void;
}

export default function BottomNav() {
    const navigate = useNavigate();
    const location = useLocation();

    const handleOpenChat = () => {
        window.dispatchEvent(new CustomEvent('open-chat'));
    };

    const navItems: NavItem[] = [
        { icon: Home, label: 'Beranda', path: '/dashboard' },
        { icon: FileText, label: 'Pesanan', path: '/dashboard/history' },
        { icon: MessageCircle, label: 'Chat', action: handleOpenChat }, // New chat item
        { icon: Inbox, label: 'Inbox', path: '/dashboard/inbox' },
        { icon: User, label: 'Akun', path: '/dashboard/profile' },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-bottom z-50">
            <div className="max-w-lg mx-auto">
                <nav className="flex items-center justify-around px-2 py-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = item.path && location.pathname === item.path;

                        return (
                            <button
                                key={item.label} // Use label as key for chat item without path
                                onClick={item.path ? () => navigate(item.path!) : item.action}
                                className={cn(
                                    "flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-lg transition-colors",
                                    "focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2",
                                    isActive
                                        ? "text-green-600"
                                        : "text-gray-500 hover:text-gray-700 active:bg-gray-100"
                                )}
                            >
                                <Icon className={cn(
                                    "w-6 h-6",
                                    isActive && "fill-current"
                                )} />
                                <span className={cn(
                                    "text-xs font-medium",
                                    isActive && "font-semibold"
                                )}>
                                    {item.label}
                                </span>
                            </button>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
}
