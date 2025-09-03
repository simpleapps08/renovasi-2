-- Create transactions table for billing and deposit history
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    transaction_id VARCHAR(50) UNIQUE NOT NULL, -- e.g., 'TXN-001'
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('deposit', 'payment', 'refund')),
    amount BIGINT NOT NULL, -- in rupiah, can be negative for payments
    description TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('completed', 'pending', 'failed')),
    payment_method VARCHAR(50) NOT NULL, -- 'Bank Transfer', 'GoPay', 'OVO', 'DANA', etc.
    payment_proof TEXT, -- URL or file path to payment proof
    notes TEXT,
    admin_notes TEXT,
    processed_by UUID REFERENCES auth.users(id), -- admin who processed the transaction
    processed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_project_id ON public.transactions(project_id);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON public.transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON public.transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_transaction_id ON public.transactions(transaction_id);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON public.transactions(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can only see their own transactions
CREATE POLICY "Users can view own transactions" ON public.transactions
    FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own transactions
CREATE POLICY "Users can insert own transactions" ON public.transactions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own pending transactions
CREATE POLICY "Users can update own pending transactions" ON public.transactions
    FOR UPDATE USING (auth.uid() = user_id AND status = 'pending');

-- Admin can view all transactions
CREATE POLICY "Admin can view all transactions" ON public.transactions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE user_id = auth.uid() 
            AND role = 'admin'
        )
    );

-- Admin can manage all transactions
CREATE POLICY "Admin can manage all transactions" ON public.transactions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE user_id = auth.uid() 
            AND role = 'admin'
        )
    );

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_transactions_updated_at
    BEFORE UPDATE ON public.transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create function to update user balance when transaction is completed
CREATE OR REPLACE FUNCTION update_user_balance()
RETURNS TRIGGER AS $$
BEGIN
    -- Only update balance when status changes to 'completed'
    IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
        -- Update user's saldo_deposit in user_profiles
        UPDATE public.user_profiles 
        SET saldo_deposit = COALESCE(saldo_deposit, 0) + NEW.amount
        WHERE user_id = NEW.user_id;
    END IF;
    
    -- If transaction is reverted from completed to other status
    IF OLD.status = 'completed' AND NEW.status != 'completed' THEN
        -- Revert the balance change
        UPDATE public.user_profiles 
        SET saldo_deposit = COALESCE(saldo_deposit, 0) - OLD.amount
        WHERE user_id = OLD.user_id;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to update user balance
CREATE TRIGGER update_user_balance_trigger
    AFTER UPDATE ON public.transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_user_balance();

-- Create trigger for new completed transactions
CREATE TRIGGER insert_completed_transaction_trigger
    AFTER INSERT ON public.transactions
    FOR EACH ROW
    WHEN (NEW.status = 'completed')
    EXECUTE FUNCTION update_user_balance();

-- Grant necessary permissions
GRANT ALL ON public.transactions TO authenticated;
GRANT ALL ON public.transactions TO service_role;