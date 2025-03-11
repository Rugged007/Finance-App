import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertTriangle,
  Calendar,
  CreditCard,
  DollarSign,
  Tag,
  Trash2,
} from "lucide-react";
import { updateTransaction } from "@/lib/api";
import { TRANSACTION_CATEGORIES } from "@/types/transaction";
import { format, parseISO } from "date-fns";

interface TransactionDetailsProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  transaction?: {
    id: string;
    merchantName: string;
    amount: number;
    date: string;
    category: string;
    description?: string;
    notes?: string;
  };
  onSave?: (updatedTransaction: any) => void;
  onDelete?: (id: string) => void;
}

const TransactionDetails = ({
  isOpen = true,
  onOpenChange,
  transaction = {
    id: "tx-123456",
    merchantName: "Starbucks Coffee",
    amount: 4.95,
    date: "2023-05-15",
    category: "Food & Dining",
    description: "Morning coffee and bagel",
    notes: "",
  },
  onSave,
  onDelete,
}: TransactionDetailsProps) => {
  const [merchantName, setMerchantName] = useState(transaction.merchantName);
  const [amount, setAmount] = useState(transaction.amount.toString());
  const [date, setDate] = useState(transaction.date);
  const [category, setCategory] = useState(transaction.category);
  const [description, setDescription] = useState(transaction.description || "");
  const [notes, setNotes] = useState(transaction.notes || "");
  const [isFlagged, setIsFlagged] = useState(false);
  const [isIncome, setIsIncome] = useState(parseFloat(amount) > 0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset form when transaction changes
  useEffect(() => {
    if (transaction) {
      setMerchantName(transaction.merchantName);
      setAmount(Math.abs(transaction.amount).toString());
      setDate(transaction.date);
      setCategory(transaction.category);
      setDescription(transaction.description || "");
      setNotes(transaction.notes || "");
      setIsIncome(transaction.amount > 0);
    }
  }, [transaction]);

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);

      // Validate inputs
      if (!merchantName.trim()) {
        setError("Merchant name is required");
        return;
      }

      const amountValue = parseFloat(amount);
      if (isNaN(amountValue) || amountValue <= 0) {
        setError("Please enter a valid amount");
        return;
      }

      // Prepare the updated transaction
      const finalAmount = isIncome ? amountValue : -amountValue;

      const updatedTransaction = {
        id: transaction.id,
        merchant_name: merchantName,
        amount: finalAmount,
        date: date,
        category: category,
        description: description,
        notes: notes,
        is_income: isIncome,
      };

      // In a real implementation, this would save the changes to the database
      await updateTransaction(transaction.id, updatedTransaction);

      if (onSave) {
        onSave(updatedTransaction);
      }

      onOpenChange?.(false);
    } catch (err) {
      console.error("Error saving transaction:", err);
      setError("Failed to save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      try {
        setSaving(true);
        if (onDelete) {
          onDelete(transaction.id);
        }
      } catch (err) {
        console.error("Error deleting transaction:", err);
        setError("Failed to delete transaction. Please try again.");
      } finally {
        setSaving(false);
      }
    }
  };

  // Format date for display
  const formattedDate = date ? format(new Date(date), "MMM dd, yyyy") : "";

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white max-w-md w-full">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Transaction Details
          </DialogTitle>
        </DialogHeader>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4 my-4">
          {/* Transaction Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-2 rounded-full">
                <CreditCard className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <Input
                    value={merchantName}
                    onChange={(e) => setMerchantName(e.target.value)}
                    className="font-medium text-lg h-8 px-2"
                    placeholder="Merchant name"
                  />
                </div>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <Calendar className="h-3.5 w-3.5 mr-1" />
                  <span>{formattedDate}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-2">
                <Select
                  value={isIncome ? "income" : "expense"}
                  onValueChange={(value) => setIsIncome(value === "income")}
                >
                  <SelectTrigger className="w-24 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">Income</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                  </SelectContent>
                </Select>
                <div className="relative">
                  <DollarSign className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pl-8 w-24 h-8"
                    step="0.01"
                    min="0"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Transaction Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Input
              placeholder="Add a description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Category Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-1">
              <Tag className="h-4 w-4" /> Category
            </label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {TRANSACTION_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Notes</label>
            <Textarea
              placeholder="Add notes about this transaction..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="resize-none"
              rows={3}
            />
          </div>

          {/* Flag as Suspicious */}
          <div className="flex items-center space-x-2 pt-2">
            <Button
              variant={isFlagged ? "destructive" : "outline"}
              size="sm"
              className="flex items-center gap-1"
              onClick={() => setIsFlagged(!isFlagged)}
            >
              <AlertTriangle className="h-4 w-4" />
              {isFlagged ? "Flagged as Suspicious" : "Flag as Suspicious"}
            </Button>
          </div>
        </div>

        <DialogFooter className="flex justify-between space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
            onClick={handleDelete}
            disabled={saving}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>

          <div className="flex space-x-2">
            <DialogClose asChild>
              <Button variant="outline" disabled={saving}>
                Cancel
              </Button>
            </DialogClose>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionDetails;
