import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Bell,
  ChevronDown,
  CreditCard,
  HelpCircle,
  LogOut,
  Menu,
  Search,
  Settings,
  User,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface HeaderProps {
  userName?: string;
  userAvatar?: string;
  notificationCount?: number;
  onNotificationsClick?: () => void;
  onSettingsClick?: () => void;
  onProfileClick?: () => void;
  onLogoutClick?: () => void;
  onHelpClick?: () => void;
}

const Header = ({
  userName = "John Doe",
  userAvatar = "",
  notificationCount = 3,
  onNotificationsClick = () => console.log("Notifications clicked"),
  onSettingsClick = () => console.log("Settings clicked"),
  onProfileClick = () => console.log("Profile clicked"),
  onLogoutClick = () => console.log("Logout clicked"),
  onHelpClick = () => console.log("Help clicked"),
}: HeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Search submitted:", searchQuery);
  };

  return (
    <header className="w-full h-20 bg-white border-b border-gray-200 px-4 md:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-50">
      {/* Logo and Brand */}
      <div className="flex items-center">
        <div className="flex items-center gap-2">
          <CreditCard className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold hidden md:inline">
            Smart Finance
          </span>
        </div>

        {/* Mobile Menu Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden ml-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* Search Bar - Hidden on mobile */}
      <form
        onSubmit={handleSearchSubmit}
        className="hidden md:flex max-w-md w-full mx-4 relative"
      >
        <Input
          type="text"
          placeholder="Search transactions..."
          className="w-full pl-10"
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      </form>

      {/* Right Side Actions */}
      <div className="flex items-center space-x-2">
        {/* Help Button */}
        <Button
          variant="ghost"
          size="icon"
          className="hidden md:flex"
          onClick={onHelpClick}
        >
          <HelpCircle className="h-5 w-5" />
        </Button>

        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          onClick={onNotificationsClick}
        >
          <Bell className="h-5 w-5" />
          {notificationCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {notificationCount}
            </Badge>
          )}
        </Button>

        {/* Settings */}
        <Button
          variant="ghost"
          size="icon"
          className="hidden md:flex"
          onClick={onSettingsClick}
        >
          <Settings className="h-5 w-5" />
        </Button>

        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2 p-1 hover:bg-gray-100 rounded-full"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={userAvatar} alt={userName} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {userName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <span className="hidden md:inline text-sm font-medium">
                {userName}
              </span>
              <ChevronDown className="h-4 w-4 hidden md:inline" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onProfileClick}>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onSettingsClick}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onHelpClick}>
              <HelpCircle className="mr-2 h-4 w-4" />
              <span>Help & Support</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onLogoutClick}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Mobile Menu - Shown when menu is toggled */}
      {isMobileMenuOpen && (
        <div className="absolute top-20 left-0 right-0 bg-white border-b border-gray-200 p-4 md:hidden z-50">
          <div className="space-y-4">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Input
                type="text"
                placeholder="Search transactions..."
                className="w-full pl-10"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </form>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                className="flex items-center justify-start gap-2"
                onClick={onProfileClick}
              >
                <User className="h-4 w-4" />
                <span>Profile</span>
              </Button>
              <Button
                variant="outline"
                className="flex items-center justify-start gap-2"
                onClick={onSettingsClick}
              >
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </Button>
              <Button
                variant="outline"
                className="flex items-center justify-start gap-2"
                onClick={onHelpClick}
              >
                <HelpCircle className="h-4 w-4" />
                <span>Help</span>
              </Button>
              <Button
                variant="outline"
                className="flex items-center justify-start gap-2"
                onClick={onLogoutClick}
              >
                <LogOut className="h-4 w-4" />
                <span>Log out</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
