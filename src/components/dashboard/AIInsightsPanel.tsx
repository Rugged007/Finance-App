import React, { useState } from "react";
import { Card, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  ArrowRight,
  Brain,
  DollarSign,
  Filter,
  Lightbulb,
  RefreshCw,
  Search,
  Sparkles,
} from "lucide-react";
import InsightCard from "./InsightCard";

interface AIInsightsPanelProps {
  insights?: Array<{
    id: string;
    title: string;
    description: string;
    type: "alert" | "opportunity" | "pattern";
    importance: "high" | "medium" | "low";
  }>;
  onViewAllInsights?: () => void;
  onRefreshInsights?: () => void;
}

const AIInsightsPanel = ({
  insights = [
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
  ],
  onViewAllInsights = () => console.log("View all insights clicked"),
  onRefreshInsights = () => console.log("Refresh insights clicked"),
}: AIInsightsPanelProps) => {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter insights based on active filter and search query
  const filteredInsights = insights.filter((insight) => {
    // Filter by type if a filter is active
    if (activeFilter && insight.type !== activeFilter) {
      return false;
    }

    // Filter by search query if one exists
    if (
      searchQuery &&
      !insight.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !insight.description.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    return true;
  });

  return (
    <div className="w-full bg-white rounded-xl border shadow-sm p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-500" />
          <h2 className="text-xl font-semibold">AI-Powered Insights</h2>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onRefreshInsights}
          className="flex items-center gap-1"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search insights..."
            className="pl-9 pr-4 py-2 w-full border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Badge
            variant={activeFilter === null ? "secondary" : "outline"}
            className={cn(
              "cursor-pointer px-3 py-1",
              activeFilter === null ? "bg-gray-100" : "",
            )}
            onClick={() => setActiveFilter(null)}
          >
            All
          </Badge>
          <Badge
            variant={activeFilter === "alert" ? "destructive" : "outline"}
            className="cursor-pointer px-3 py-1"
            onClick={() =>
              setActiveFilter(activeFilter === "alert" ? null : "alert")
            }
          >
            <AlertCircle className="h-3 w-3 mr-1" />
            Alerts
          </Badge>
          <Badge
            variant={activeFilter === "opportunity" ? "secondary" : "outline"}
            className={cn(
              "cursor-pointer px-3 py-1",
              activeFilter === "opportunity"
                ? "bg-green-100 text-green-800"
                : "",
            )}
            onClick={() =>
              setActiveFilter(
                activeFilter === "opportunity" ? null : "opportunity",
              )
            }
          >
            <Lightbulb className="h-3 w-3 mr-1" />
            Opportunities
          </Badge>
          <Badge
            variant={activeFilter === "pattern" ? "secondary" : "outline"}
            className={cn(
              "cursor-pointer px-3 py-1",
              activeFilter === "pattern" ? "bg-amber-100 text-amber-800" : "",
            )}
            onClick={() =>
              setActiveFilter(activeFilter === "pattern" ? null : "pattern")
            }
          >
            <Brain className="h-3 w-3 mr-1" />
            Patterns
          </Badge>
        </div>
      </div>

      {/* Insights Grid */}
      {filteredInsights.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredInsights.map((insight) => (
            <InsightCard
              key={insight.id}
              title={insight.title}
              description={insight.description}
              type={insight.type}
              importance={insight.importance}
              onViewDetails={() =>
                console.log(`View details for insight ${insight.id}`)
              }
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <DollarSign className="h-12 w-12 text-gray-300 mb-3" />
          <h3 className="text-lg font-medium text-gray-700">
            No insights found
          </h3>
          <p className="text-gray-500 mt-1 max-w-md">
            {searchQuery || activeFilter
              ? "Try adjusting your search or filters to see more results."
              : "We'll analyze your financial data and provide insights soon."}
          </p>
          {(searchQuery || activeFilter) && (
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => {
                setSearchQuery("");
                setActiveFilter(null);
              }}
            >
              <Filter className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          )}
        </div>
      )}

      {/* View All Link */}
      {filteredInsights.length > 0 && (
        <div className="flex justify-center mt-4">
          <Button
            variant="link"
            onClick={onViewAllInsights}
            className="text-blue-600 flex items-center gap-1"
          >
            View All Financial Insights
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default AIInsightsPanel;
