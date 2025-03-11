import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DollarSign, Calendar, Tag } from "lucide-react";
import { createTransaction } from "@/lib/api";
import { TRANSACTION_CATEGORIES } from "@/types/transaction";
import { format } from "date-fns";

interface AddTransactionDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onTransactionAdded: () => void;
}

const AddTransactionDialog = ({
  isOpen,
  onOpenChange,
  onTransactionAdded,
}: AddTransactionDialogProps) => {
  const [merchantName, setMerchantName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food & Dining");
  const [description, setDescription] = useState("");
  const [isIncome, setIsIncome] = useState(false);
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetForm = () => {
    setMerchantName("");
    setAmount("");
    setCategory("Food & Dining");
    setDescription("");
    setIsIncome(false);
    setDate(format(new Date(), "yyyy-MM-dd"));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
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

      setSaving(true);

      // Prepare transaction data
      const finalAmount = isIncome ? amountValue : -amountValue;

      const newTransaction = {
        merchant_name: merchantName,
        amount: finalAmount,
        date: date,
        category: category,
        description: description,
        is_income: isIncome,
      };

      // Save to database
      await createTransaction(newTransaction);

      // Reset form and close dialog
      resetForm();
      onTransactionAdded();
      onOpenChange(false);
    } catch (err) {
      console.error("Error adding transaction:", err);
      setError("Failed to add transaction. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white max-w-md w-full">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Add New Transaction
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4 my-4">
            {/* Transaction Type */}
            <div className="flex justify-between items-center">
              <div className="space-y-2 flex-1">
                <label className="text-sm font-medium">Transaction Type</label>
                <Select
                  value={isIncome ? "income" : "expense"}
                  onValueChange={(value) => setIsIncome(value === "income")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="expense">Expense</SelectItem>
                    <SelectItem value="income">Income</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 flex-1 ml-4">
                <label className="text-sm font-medium">Date</label>
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  max={format(new Date(), "yyyy-MM-dd")}
                />
              </div>
            </div>

            {/* Merchant Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Merchant</label>
              <Input
                placeholder="Enter merchant name"
                value={merchantName}
                onChange={(e) => setMerchantName(e.target.value)}
                required
              />
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Amount</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  type="number"
                  placeholder="0.00"
                  className="pl-10"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  step="0.01"
                  min="0"
                  required
                />
              </div>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-1">
                <Tag className="h-4 w-4" /> Category
              </label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
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

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Description (Optional)
              </label>
              <Textarea
                placeholder="Add a description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="resize-none"
                rows={2}
              />
            </div>
          </div>

          <DialogFooter className="flex justify-end space-x-2">
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={saving}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={saving}>
              {saving ? "Adding..." : "Add Transaction"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTransactionDialog;
