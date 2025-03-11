import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  Edit,
  Flag,
  MoreHorizontal,
  Tag,
  Bookmark,
  BookmarkCheck,
} from "lucide-react";
import { format } from "date-fns";

interface TransactionItemProps {
  merchant?: string;
  amount?: number;
  date?: string;
  category?: string;
  isIncome?: boolean;
  onClick?: () => void;
}

const TransactionItem = ({
  merchant = "Starbucks Coffee",
  amount = 4.95,
  date = "2023-05-15",
  category = "Food & Dining",
  isIncome = false,
  onClick = () => {},
}: TransactionItemProps) => {
  // Format date to be more readable
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  // Format amount with currency symbol
  const formattedAmount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);

  // Get background color based on category
  const getCategoryColor = () => {
    switch (category) {
      case "Food & Dining":
        return "bg-blue-100 text-blue-800";
      case "Shopping":
        return "bg-purple-100 text-purple-800";
      case "Transportation":
        return "bg-indigo-100 text-indigo-800";
      case "Entertainment":
        return "bg-pink-100 text-pink-800";
      case "Income":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div
      className="flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors rounded-lg cursor-pointer bg-white"
      onClick={onClick}
    >
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
          {/* First letter of merchant as avatar placeholder */}
          <span className="text-gray-600 font-medium">
            {merchant.charAt(0)}
          </span>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-900">{merchant}</h4>
          <p className="text-xs text-gray-500">{formattedDate}</p>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <Badge variant="outline" className={cn("text-xs", getCategoryColor())}>
          {category}
        </Badge>

        <span
          className={cn(
            "font-medium",
            isIncome ? "text-green-600" : "text-gray-900",
          )}
        >
          {isIncome ? "+" : ""}
          {formattedAmount}
        </span>

        <div className="flex space-x-1 md:flex hidden">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={(e) => {
                    e.stopPropagation();
                    // This would be handled in a real app
                  }}
                >
                  <Tag className="h-4 w-4 text-gray-500" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Change Category</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={(e) => {
                    e.stopPropagation();
                    // This would be handled in a real app
                  }}
                >
                  <Edit className="h-4 w-4 text-gray-500" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit Transaction</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={(e) => {
                    e.stopPropagation();
                    // This would be handled in a real app
                  }}
                >
                  <Bookmark className="h-4 w-4 text-gray-500" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Save Transaction</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
};

export default TransactionItem;
