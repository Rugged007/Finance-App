export interface Transaction {
  id: string;
  merchant_name: string;
  amount: number;
  date: string;
  category: string;
  description?: string;
  notes?: string;
  is_income: boolean;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
}

export const TRANSACTION_CATEGORIES = [
  "Food & Dining",
  "Shopping",
  "Transportation",
  "Entertainment",
  "Bills & Utilities",
  "Health & Fitness",
  "Travel",
  "Income",
  "Other",
];
