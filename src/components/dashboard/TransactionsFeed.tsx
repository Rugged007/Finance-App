import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import TransactionItem from "./TransactionItem";
import TransactionDetails from "./TransactionDetails";
import {
  Search,
  Filter,
  ArrowUpDown,
  Calendar,
  Download,
  Plus,
} from "lucide-react";
import { Transaction } from "@/types/transaction";
import { fetchTransactions, deleteTransaction } from "@/lib/api";
import { format } from "date-fns";

interface TransactionsFeedProps {
  title?: string;
  showFilters?: boolean;
  onAddTransaction?: () => void;
}

const TransactionsFeed = ({
  title = "Recent Transactions",
  showFilters = true,
  onAddTransaction = () => {},
}: TransactionsFeedProps) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Fetch transactions from Supabase
  useEffect(() => {
    const loadTransactions = async () => {
      try {
        setLoading(true);
        const data = await fetchTransactions();
        setTransactions(data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch transactions:", err);
        setError("Failed to load transactions. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadTransactions();
  }, []);

  // Apply filters and sorting
  const getFilteredTransactions = () => {
    let filtered = [...transactions];

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter((transaction) => {
        return (
          transaction.merchant_name.toLowerCase().includes(searchLower) ||
          transaction.category.toLowerCase().includes(searchLower) ||
          (transaction.description?.toLowerCase().includes(searchLower) ??
            false)
        );
      });
    }

    // Apply sorting based on active filter
    if (activeFilter) {
      filtered.sort((a, b) => {
        if (activeFilter === "date") {
          return sortDirection === "asc"
            ? new Date(a.date).getTime() - new Date(b.date).getTime()
            : new Date(b.date).getTime() - new Date(a.date).getTime();
        }
        if (activeFilter === "amount") {
          return sortDirection === "asc"
            ? a.amount - b.amount
            : b.amount - a.amount;
        }
        if (activeFilter === "category") {
          return sortDirection === "asc"
            ? a.category.localeCompare(b.category)
            : b.category.localeCompare(a.category);
        }
        return 0;
      });
    } else {
      // Default sort by date (newest first)
      filtered.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      );
    }

    return filtered;
  };

  const filteredTransactions = getFilteredTransactions();

  // Handle transaction click to open details
  const handleTransactionClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsDetailsOpen(true);
  };

  // Handle filter click
  const handleFilterClick = (filter: string) => {
    if (activeFilter === filter) {
      // Toggle sort direction if clicking the same filter
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // Set new filter and reset sort direction
      setActiveFilter(filter);
      setSortDirection("desc");
    }
  };

  // Handle transaction update
  const handleTransactionUpdate = (updatedTransaction: Transaction) => {
    setTransactions(
      transactions.map((t) =>
        t.id === updatedTransaction.id ? updatedTransaction : t,
      ),
    );
    setIsDetailsOpen(false);
  };

  // Handle transaction delete
  const handleTransactionDelete = async (id: string) => {
    try {
      await deleteTransaction(id);
      setTransactions(transactions.filter((t) => t.id !== id));
      setIsDetailsOpen(false);
    } catch (err) {
      console.error("Failed to delete transaction:", err);
    }
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100">
      <Card className="border-0 shadow-none">
        <CardHeader className="pb-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="text-xl font-semibold">{title}</CardTitle>

            {showFilters && (
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search transactions..."
                    className="pl-9 w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    variant={activeFilter === "date" ? "default" : "outline"}
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={() => handleFilterClick("date")}
                  >
                    <Calendar className="h-4 w-4" />
                    <span className="hidden sm:inline">Date</span>
                    {activeFilter === "date" && (
                      <span className="ml-1">
                        {sortDirection === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </Button>

                  <Button
                    variant={activeFilter === "amount" ? "default" : "outline"}
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={() => handleFilterClick("amount")}
                  >
                    <ArrowUpDown className="h-4 w-4" />
                    <span className="hidden sm:inline">Amount</span>
                    {activeFilter === "amount" && (
                      <span className="ml-1">
                        {sortDirection === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </Button>

                  <Button
                    variant={
                      activeFilter === "category" ? "default" : "outline"
                    }
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={() => handleFilterClick("category")}
                  >
                    <Filter className="h-4 w-4" />
                    <span className="hidden sm:inline">Category</span>
                    {activeFilter === "category" && (
                      <span className="ml-1">
                        {sortDirection === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </Button>

                  <Button
                    variant="default"
                    size="sm"
                    className="flex items-center gap-1 bg-primary text-white"
                    onClick={onAddTransaction}
                  >
                    <Plus className="h-4 w-4" />
                    <span className="hidden sm:inline">Add</span>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardHeader>

        <div className="p-4 pt-0">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <p className="text-red-500">{error}</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => window.location.reload()}
              >
                Retry
              </Button>
            </div>
          ) : filteredTransactions.length > 0 ? (
            <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
              {filteredTransactions.map((transaction) => (
                <TransactionItem
                  key={transaction.id}
                  merchant={transaction.merchant_name}
                  amount={transaction.amount}
                  date={transaction.date}
                  category={transaction.category}
                  isIncome={transaction.is_income}
                  onClick={() => handleTransactionClick(transaction)}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <Search className="h-12 w-12 text-gray-300 mb-3" />
              <h3 className="text-lg font-medium text-gray-900">
                No transactions found
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {searchTerm
                  ? "Try adjusting your search or filters."
                  : "Add your first transaction to get started."}
              </p>
              {!searchTerm && (
                <Button
                  variant="default"
                  size="sm"
                  className="mt-4 flex items-center gap-1"
                  onClick={onAddTransaction}
                >
                  <Plus className="h-4 w-4" />
                  Add Transaction
                </Button>
              )}
            </div>
          )}

          {filteredTransactions.length > 0 && (
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-500">
                Showing {filteredTransactions.length} of {transactions.length}{" "}
                transactions
              </p>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
              >
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          )}
        </div>
      </Card>

      {selectedTransaction && (
        <TransactionDetails
          isOpen={isDetailsOpen}
          onOpenChange={setIsDetailsOpen}
          transaction={{
            id: selectedTransaction.id,
            merchantName: selectedTransaction.merchant_name,
            amount: selectedTransaction.amount,
            date: selectedTransaction.date,
            category: selectedTransaction.category,
            description: selectedTransaction.description || "",
            notes: selectedTransaction.notes || "",
          }}
          onSave={handleTransactionUpdate}
          onDelete={() => handleTransactionDelete(selectedTransaction.id)}
        />
      )}
    </div>
  );
};

export default TransactionsFeed;
