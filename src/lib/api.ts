import { supabase } from "./supabase";
import { Transaction } from "@/types/transaction";

// Transactions API
export const fetchTransactions = async (): Promise<Transaction[]> => {
  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .order("date", { ascending: false });

  if (error) {
    console.error("Error fetching transactions:", error);
    throw error;
  }

  return data as Transaction[];
};

export const createTransaction = async (
  transaction: Omit<Transaction, "id">,
): Promise<Transaction> => {
  const { data, error } = await supabase
    .from("transactions")
    .insert(transaction)
    .select()
    .single();

  if (error) {
    console.error("Error creating transaction:", error);
    throw error;
  }

  return data as Transaction;
};

export const updateTransaction = async (
  id: string,
  updates: Partial<Transaction>,
): Promise<Transaction> => {
  const { data, error } = await supabase
    .from("transactions")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating transaction:", error);
    throw error;
  }

  return data as Transaction;
};

export const deleteTransaction = async (id: string): Promise<void> => {
  const { error } = await supabase.from("transactions").delete().eq("id", id);

  if (error) {
    console.error("Error deleting transaction:", error);
    throw error;
  }
};

export const getTransactionById = async (id: string): Promise<Transaction> => {
  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching transaction:", error);
    throw error;
  }

  return data as Transaction;
};

// Categories
export const getCategories = async (): Promise<string[]> => {
  const { data, error } = await supabase
    .from("transactions")
    .select("category")
    .order("category");

  if (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }

  // Extract unique categories
  const categories = [...new Set(data.map((item) => item.category))];
  return categories;
};
