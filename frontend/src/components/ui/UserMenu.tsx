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

const UserMenu = () => {
  return (
  <DropdownMenu>

      <DropdownMenuTrigger asChild>

        <button className="flex items-center gap-3">

            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>

          <div className="text-left">

            <p className="text-sm font-medium">
              Admin User
            </p>

            <p className="text-xs text-muted-foreground">
              Super Admin
            </p>

          </div>

        </button>

      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">

        <DropdownMenuItem>
          <User />
          Profile
        </DropdownMenuItem>

        <DropdownMenuItem>
          <Settings />
          Settings
        </DropdownMenuItem>

        <DropdownMenuItem>
          <LogOut />
          Logout
        </DropdownMenuItem>

      </DropdownMenuContent>

    </DropdownMenu>
  )
}

export default UserMenu