import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./dashboard/Header";
import FinancialSummary from "./dashboard/FinancialSummary";
import AIInsightsPanel from "./dashboard/AIInsightsPanel";
import TransactionsFeed from "./dashboard/TransactionsFeed";
import AddTransactionDialog from "./dashboard/AddTransactionDialog";
import { fetchTransactions } from "@/lib/api";

const Home = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("Alex Johnson");
  const [userAvatar, setUserAvatar] = useState(
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
  );
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Sample data for financial summary
  const [financialSummaryData, setFinancialSummaryData] = useState({
    currentBalance: 12450.75,
    income: 3200.0,
    expenses: 1875.5,
    spendingCategories: [
      { category: "Housing", amount: 850, percentage: 45 },
      { category: "Food & Dining", amount: 425, percentage: 23 },
      { category: "Transportation", amount: 225, percentage: 12 },
      { category: "Entertainment", amount: 175, percentage: 9 },
      { category: "Other", amount: 200.5, percentage: 11 },
    ],
    timeframe: "This Month",
  });

  // Sample data for AI insights
  const aiInsights = [
    {
      id: "1",
      title: "Unusual Spending Pattern",
      description:
        "We've detected higher than normal spending in your dining category this month.",
      type: "pattern",
      importance: "medium",
    },
    {
      id: "2",
      title: "Budget Alert",
      description:
        "You're approaching your entertainment budget limit for this month. Consider reducing spending in this category.",
      type: "alert",
      importance: "high",
    },
    {
      id: "3",
      title: "Saving Opportunity",
      description:
        "Based on your spending habits, you could save $150 monthly by adjusting your subscription services.",
      type: "opportunity",
      importance: "medium",
    },
    {
      id: "4",
      title: "Recurring Payment Increase",
      description:
        "Your monthly internet bill has increased by $15 compared to previous months.",
      type: "alert",
      importance: "low",
    },
  ];

  // Update financial summary based on transactions
  useEffect(() => {
    const updateFinancialSummary = async () => {
      try {
        const transactions = await fetchTransactions();

        // Calculate income and expenses
        let totalIncome = 0;
        let totalExpenses = 0;
        const categoryAmounts = {};

        transactions.forEach((transaction) => {
          if (transaction.amount > 0) {
            totalIncome += transaction.amount;
          } else {
            totalExpenses += Math.abs(transaction.amount);
          }

          // Track spending by category (only for expenses)
          if (transaction.amount < 0) {
            const category = transaction.category;
            if (!categoryAmounts[category]) {
              categoryAmounts[category] = 0;
            }
            categoryAmounts[category] += Math.abs(transaction.amount);
          }
        });

        // Calculate percentages and format for spending categories
        const spendingCategories = [];
        for (const [category, amount] of Object.entries(categoryAmounts)) {
          const percentage =
            totalExpenses > 0 ? Math.round((amount / totalExpenses) * 100) : 0;
          spendingCategories.push({ category, amount, percentage });
        }

        // Sort by amount (highest first)
        spendingCategories.sort((a, b) => b.amount - a.amount);

        // Update financial summary
        setFinancialSummaryData({
          currentBalance: totalIncome - totalExpenses,
          income: totalIncome,
          expenses: totalExpenses,
          spendingCategories:
            spendingCategories.length > 0
              ? spendingCategories
              : financialSummaryData.spendingCategories,
          timeframe: "This Month",
        });
      } catch (error) {
        console.error("Error updating financial summary:", error);
      }
    };

    updateFinancialSummary();
  }, [refreshTrigger]);

  // Event handlers
  const handleRefreshInsights = () => {
    console.log("Refreshing AI insights...");
    // In a real app, this would fetch new insights from the backend
  };

  const handleViewAllInsights = () => {
    console.log("Viewing all insights...");
    // In a real app, this would navigate to a detailed insights page
  };

  // Handle logout
  const handleLogout = () => {
    // In a real app, this would call a logout API
    console.log("Logging out...");
    navigate("/login");
  };

  // Handle transaction added
  const handleTransactionAdded = () => {
    // Trigger a refresh of the transactions list
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header
        userName={userName}
        userAvatar={userAvatar}
        notificationCount={3}
        onLogoutClick={handleLogout}
      />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 space-y-6 max-w-7xl">
        {/* Financial Summary Section */}
        <FinancialSummary
          currentBalance={financialSummaryData.currentBalance}
          income={financialSummaryData.income}
          expenses={financialSummaryData.expenses}
          spendingCategories={financialSummaryData.spendingCategories}
          timeframe={financialSummaryData.timeframe}
        />

        {/* AI Insights Panel */}
        <AIInsightsPanel
          insights={aiInsights}
          onRefreshInsights={handleRefreshInsights}
          onViewAllInsights={handleViewAllInsights}
        />

        {/* Transactions Feed */}
        <TransactionsFeed
          title="Recent Transactions"
          showFilters={true}
          onAddTransaction={() => setIsAddTransactionOpen(true)}
        />
      </main>

      {/* Add Transaction Dialog */}
      <AddTransactionDialog
        isOpen={isAddTransactionOpen}
        onOpenChange={setIsAddTransactionOpen}
        onTransactionAdded={handleTransactionAdded}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 mt-10">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          <p>© 2023 Smart Finance App. All rights reserved.</p>
          <div className="flex justify-center space-x-4 mt-2">
            <a href="#" className="hover:text-gray-700">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-gray-700">
              Terms of Service
            </a>
            <a href="#" className="hover:text-gray-700">
              Contact Support
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
