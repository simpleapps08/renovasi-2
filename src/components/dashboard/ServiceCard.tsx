import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ServiceCardProps {
    icon: ReactNode;
    label: string;
    onClick?: () => void;
    className?: string;
}

export default function ServiceCard({ icon, label, onClick, className }: ServiceCardProps) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "flex flex-col items-center justify-center gap-1 p-2 rounded-lg",
                "hover:bg-gray-100 active:bg-gray-200 transition-colors",
                "focus:outline-none focus:ring-2 focus:ring-green-500",
                className
            )}
        >
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                {icon}
            </div>
            <span className="text-[10px] font-medium text-gray-800 text-center leading-tight">
                {label}
            </span>
        </button>
    );
}
