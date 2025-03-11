import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import {
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  PieChart,
  BarChart3,
  TrendingUp,
} from "lucide-react";

interface FinancialSummaryProps {
  currentBalance?: number;
  income?: number;
  expenses?: number;
  spendingCategories?: {
    category: string;
    amount: number;
    percentage: number;
  }[];
  timeframe?: string;
}

const FinancialSummary = ({
  currentBalance = 12450.75,
  income = 3200.0,
  expenses = 1875.5,
  spendingCategories = [
    { category: "Housing", amount: 850, percentage: 45 },
    { category: "Food & Dining", amount: 425, percentage: 23 },
    { category: "Transportation", amount: 225, percentage: 12 },
    { category: "Entertainment", amount: 175, percentage: 9 },
    { category: "Other", amount: 200.5, percentage: 11 },
  ],
  timeframe = "This Month",
}: FinancialSummaryProps) => {
  const netChange = income - expenses;
  const isPositiveChange = netChange >= 0;

  return (
    <div className="w-full space-y-4 bg-white p-4 rounded-xl">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Financial Summary</h2>
        <Badge variant="outline" className="text-xs">
          {timeframe}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Current Balance Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Current Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 text-green-500 mr-1" />
              <span className="text-2xl font-bold">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(currentBalance)}
              </span>
            </div>
            <div className="mt-2 flex items-center">
              <Badge
                variant={isPositiveChange ? "default" : "destructive"}
                className={cn(
                  "text-xs",
                  isPositiveChange
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800",
                )}
              >
                <span className="flex items-center">
                  {isPositiveChange ? (
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 mr-1" />
                  )}
                  {isPositiveChange ? "+" : "-"}
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(Math.abs(netChange))}
                </span>
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Income vs Expenses Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Income vs Expenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Income</span>
                <span className="font-medium text-green-600">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(income)}
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5">
                <div
                  className="bg-green-500 h-2.5 rounded-full"
                  style={{ width: "100%" }}
                ></div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm">Expenses</span>
                <span className="font-medium text-red-600">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(expenses)}
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5">
                <div
                  className="bg-red-500 h-2.5 rounded-full"
                  style={{ width: `${(expenses / income) * 100}%` }}
                ></div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="text-sm font-medium">Net Savings</span>
                <span
                  className={cn(
                    "font-medium",
                    isPositiveChange ? "text-green-600" : "text-red-600",
                  )}
                >
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(netChange)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Spending Breakdown Card */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-sm text-muted-foreground">
                Spending Breakdown
              </CardTitle>
              <PieChart className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {spendingCategories.slice(0, 4).map((category, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs">{category.category}</span>
                    <span className="text-xs font-medium">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                      }).format(category.amount)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full ${index === 0 ? "bg-blue-500" : index === 1 ? "bg-purple-500" : index === 2 ? "bg-yellow-500" : "bg-green-500"}`}
                      style={{ width: `${category.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}

              {spendingCategories.length > 4 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full mt-2 text-xs"
                >
                  View All Categories
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FinancialSummary;
