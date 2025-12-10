import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronRight } from 'lucide-react';

interface PromotionCardProps {
    title: string;
    description: string;
    image?: string;
    badge?: string;
    onClick?: () => void;
}

export default function PromotionCard({
    title,
    description,
    image,
    badge,
    onClick
}: PromotionCardProps) {
    return (
        <Card
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onClick?.();
                }
            }}
            className="min-w-[280px] cursor-pointer hover:shadow-md transition-shadow border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
            onClick={onClick}
        >
            <CardContent className="p-0">
                {/* Image Section */}
                {image && (
                    <div className="relative h-32 bg-gradient-to-br from-green-100 to-green-200 rounded-t-lg overflow-hidden">
                        <img
                            src={image}
                            alt={title}
                            className="w-full h-full object-cover"
                        />
                        {badge && (
                            <Badge className="absolute top-2 left-2 bg-red-500 text-white border-0">
                                {badge}
                            </Badge>
                        )}
                    </div>
                )}

                {/* Content Section */}
                <div className="p-4">
                    <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                            <h3 className="font-semibold text-sm text-gray-900 mb-1 line-clamp-1">
                                {title}
                            </h3>
                            <p className="text-xs text-gray-600 line-clamp-2">
                                {description}
                            </p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
