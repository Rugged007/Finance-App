import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  AlertCircle,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Lightbulb,
} from "lucide-react";

interface InsightCardProps {
  title?: string;
  description?: string;
  type?: "alert" | "opportunity" | "pattern";
  importance?: "high" | "medium" | "low";
  icon?: React.ReactNode;
  onViewDetails?: () => void;
}

const getIconByType = (
  type: InsightCardProps["type"],
  customIcon?: React.ReactNode,
) => {
  if (customIcon) return customIcon;

  switch (type) {
    case "alert":
      return <AlertCircle className="h-6 w-6 text-destructive" />;
    case "opportunity":
      return <TrendingUp className="h-6 w-6 text-green-500" />;
    case "pattern":
      return <TrendingDown className="h-6 w-6 text-amber-500" />;
    default:
      return <Lightbulb className="h-6 w-6 text-blue-500" />;
  }
};

const getImportanceBadge = (importance: InsightCardProps["importance"]) => {
  switch (importance) {
    case "high":
      return <Badge variant="destructive">High Priority</Badge>;
    case "medium":
      return <Badge variant="secondary">Medium Priority</Badge>;
    case "low":
      return <Badge variant="outline">Low Priority</Badge>;
    default:
      return null;
  }
};

const InsightCard = ({
  title = "Unusual Spending Pattern",
  description = "We've detected higher than normal spending in your dining category this month.",
  type = "pattern",
  importance = "medium",
  icon,
  onViewDetails = () => console.log("View details clicked"),
}: InsightCardProps) => {
  const cardIcon = getIconByType(type, icon);
  const priorityBadge = getImportanceBadge(importance);

  // Determine background color based on type
  const getBgColor = () => {
    switch (type) {
      case "alert":
        return "bg-red-50";
      case "opportunity":
        return "bg-green-50";
      case "pattern":
        return "bg-amber-50";
      default:
        return "bg-blue-50";
    }
  };

  return (
    <Card
      className={`w-full max-w-[350px] h-[180px] overflow-hidden transition-all duration-200 hover:shadow-md ${getBgColor()}`}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            {cardIcon}
            <CardTitle className="text-lg">{title}</CardTitle>
          </div>
          {priorityBadge}
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-sm line-clamp-2">
          {description}
        </CardDescription>
      </CardContent>
      <CardFooter className="pt-0 mt-auto">
        <Button
          variant="outline"
          size="sm"
          className="ml-auto"
          onClick={onViewDetails}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default InsightCard;
