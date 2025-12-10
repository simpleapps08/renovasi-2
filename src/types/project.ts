export interface Project {
  id: string;
  title: string;
  status: 'in_progress' | 'completed' | 'pending';
  date: string;
  amount: number;
}
