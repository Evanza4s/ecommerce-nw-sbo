"use client";

import {
  LogOut,
  Settings,
  User,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "react-toastify";

import { getAvatarUrl } from "@/lib/utils";

const UserMenu = () => {
  const { user, logout } = useAuth();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-3 cursor-pointer focus:outline-none">
          <Avatar>
            <AvatarImage src={getAvatarUrl(user?.avatar) || ""} />
            <AvatarFallback>
              {user ? `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}` || "AD" : "AD"}
            </AvatarFallback>
          </Avatar>

          <div className="text-left hidden sm:block">
            <p className="text-sm font-medium leading-none mb-1">
              {user?.firstName && user?.lastName 
                ? `${user.firstName} ${user.lastName}` 
                : user?.username || 'Admin User'}
            </p>
            <p className="text-xs text-muted-foreground leading-none">
              {user?.role === 'admin' ? 'Admin' : 'Super Admin'}
            </p>
          </div>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem className="cursor-pointer">
          <User className="mr-2 h-4 w-4 text-slate-500" />
          <span>Profile</span>
        </DropdownMenuItem>

        <DropdownMenuItem className="cursor-pointer">
          <Settings className="mr-2 h-4 w-4 text-slate-500" />
          <span>Settings</span>
        </DropdownMenuItem>

        <DropdownMenuItem 
          className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-600"
          onClick={async () => {
            try {
              await logout();
              toast.success('Successfully logged out.');
              window.location.href = '/login';
            } catch (err: any) {
              toast.error('Failed to log out.');
            }
          }}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu