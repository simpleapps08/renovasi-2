-- Create deposits table for admin deposit management
CREATE TABLE IF NOT EXISTS public.deposits (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    user_email VARCHAR(255) NOT NULL,
    user_name VARCHAR(255) NOT NULL,
    project_name VARCHAR(255) NOT NULL,
    amount BIGINT NOT NULL, -- in rupiah
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'completed')),
    payment_method VARCHAR(20) NOT NULL CHECK (payment_method IN ('bank_transfer', 'credit_card', 'e_wallet')),
    payment_proof TEXT, -- URL or file path to payment proof
    notes TEXT, -- User notes about the deposit
    admin_notes TEXT, -- Admin notes about the deposit
    approved_by UUID REFERENCES auth.users(id), -- Admin who approved/rejected
    approved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_deposits_user_id ON public.deposits(user_id);
CREATE INDEX IF NOT EXISTS idx_deposits_status ON public.deposits(status);
CREATE INDEX IF NOT EXISTS idx_deposits_payment_method ON public.deposits(payment_method);
CREATE INDEX IF NOT EXISTS idx_deposits_user_email ON public.deposits(user_email);
CREATE INDEX IF NOT EXISTS idx_deposits_created_at ON public.deposits(created_at);
CREATE INDEX IF NOT EXISTS idx_deposits_approved_by ON public.deposits(approved_by);

-- Enable Row Level Security (RLS)
ALTER TABLE public.deposits ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can only see their own deposits
CREATE POLICY "Users can view own deposits" ON public.deposits
    FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own deposits
CREATE POLICY "Users can insert own deposits" ON public.deposits
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own pending deposits
CREATE POLICY "Users can update own pending deposits" ON public.deposits
    FOR UPDATE USING (auth.uid() = user_id AND status = 'pending');

-- Admin can view all deposits
CREATE POLICY "Admin can view all deposits" ON public.deposits
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE user_id = auth.uid() 
            AND role = 'admin'
        )
    );

-- Admin can manage all deposits
CREATE POLICY "Admin can manage all deposits" ON public.deposits
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE user_id = auth.uid() 
            AND role = 'admin'
        )
    );

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_deposits_updated_at
    BEFORE UPDATE ON public.deposits
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create function to handle deposit approval and create transaction
CREATE OR REPLACE FUNCTION handle_deposit_approval()
RETURNS TRIGGER AS $$
BEGIN
    -- When deposit is approved, create a corresponding transaction
    IF NEW.status = 'approved' AND (OLD.status IS NULL OR OLD.status != 'approved') THEN
        INSERT INTO public.transactions (
            transaction_id,
            user_id,
            type,
            amount,
            description,
            status,
            payment_method,
            payment_proof,
            notes,
            admin_notes,
            processed_by,
            processed_at
        ) VALUES (
            'TXN-' || EXTRACT(EPOCH FROM NOW())::bigint,
            NEW.user_id,
            'deposit',
            NEW.amount,
            'Deposit untuk proyek: ' || NEW.project_name,
            'completed',
            CASE NEW.payment_method
                WHEN 'bank_transfer' THEN 'Bank Transfer'
                WHEN 'credit_card' THEN 'Credit Card'
                WHEN 'e_wallet' THEN 'E-Wallet'
                ELSE NEW.payment_method
            END,
            NEW.payment_proof,
            NEW.notes,
            NEW.admin_notes,
            NEW.approved_by,
            NEW.approved_at
        );
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to handle deposit approval
CREATE TRIGGER handle_deposit_approval_trigger
    AFTER UPDATE ON public.deposits
    FOR EACH ROW
    EXECUTE FUNCTION handle_deposit_approval();

-- Create function to auto-populate user info from auth
CREATE OR REPLACE FUNCTION populate_deposit_user_info()
RETURNS TRIGGER AS $$
BEGIN
    -- Auto-populate user_email and user_name from user_profiles if not provided
    IF NEW.user_email IS NULL OR NEW.user_name IS NULL THEN
        SELECT email, full_name 
        INTO NEW.user_email, NEW.user_name
        FROM public.user_profiles 
        WHERE user_id = NEW.user_id;
        
        -- Fallback to auth.users if not found in user_profiles
        IF NEW.user_email IS NULL THEN
            SELECT email 
            INTO NEW.user_email
            FROM auth.users 
            WHERE id = NEW.user_id;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to auto-populate user info
CREATE TRIGGER populate_deposit_user_info_trigger
    BEFORE INSERT ON public.deposits
    FOR EACH ROW
    EXECUTE FUNCTION populate_deposit_user_info();

-- Grant necessary permissions
GRANT ALL ON public.deposits TO authenticated;
GRANT ALL ON public.deposits TO service_role;