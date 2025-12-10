import { Wallet, ArrowUpCircle, Send, Gift } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';

interface BalanceCardProps {
    balance: number;
    points?: number;
    onTopUp?: () => void;
    onPay?: () => void;
    onTransfer?: () => void;
}

export default function BalanceCard({
    balance,
    points = 0,
    onTopUp,
    onPay,
    onTransfer
}: BalanceCardProps) {


    return (
        <Card className="bg-gradient-to-br from-green-600 to-green-700 border-0 shadow-lg">
            <CardContent className="p-5">
                {/* Balance Section */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                            <Wallet className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="text-white/80 text-xs font-medium">Saldo Servisoo</p>
                            <p className="text-white text-xl font-bold">{formatCurrency(balance)}</p>
                        </div>
                    </div>
                    {points > 0 && (
                        <div className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full">
                            <Gift className="w-4 h-4 text-yellow-300" />
                            <span className="text-white text-sm font-semibold">{points} poin</span>
                        </div>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-3 gap-3">
                    <Button
                        onClick={onTopUp}
                        variant="ghost"
                        className="flex flex-col items-center gap-1 h-auto py-3 bg-white/10 hover:bg-white/20 text-white border-0"
                    >
                        <ArrowUpCircle className="w-5 h-5" />
                        <span className="text-xs font-medium">Top Up</span>
                    </Button>
                    <Button
                        onClick={onPay}
                        variant="ghost"
                        className="flex flex-col items-center gap-1 h-auto py-3 bg-white/10 hover:bg-white/20 text-white border-0"
                    >
                        <Wallet className="w-5 h-5" />
                        <span className="text-xs font-medium">Bayar</span>
                    </Button>
                    <Button
                        onClick={onTransfer}
                        variant="ghost"
                        className="flex flex-col items-center gap-1 h-auto py-3 bg-white/10 hover:bg-white/20 text-white border-0"
                    >
                        <Send className="w-5 h-5" />
                        <span className="text-xs font-medium">Transfer</span>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
