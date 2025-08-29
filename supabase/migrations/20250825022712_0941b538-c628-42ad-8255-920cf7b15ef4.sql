-- Fix the deposits trigger
DROP TRIGGER IF EXISTS update_deposits_updated_at ON public.deposits;

CREATE TRIGGER update_deposits_updated_at
  BEFORE UPDATE ON public.deposits
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();