"use client";

import { Bell } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

const NotificationMenu = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="relative">
          <Bell size={20} />

          <span
            className="
              absolute -right-1 -top-1
              flex h-4 w-4 items-center
              justify-center rounded-full
              bg-red-500 text-[10px]
              text-white
            "
          >
            5
          </span>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem>New Order Received</DropdownMenuItem>

        <DropdownMenuItem>Refund Request</DropdownMenuItem>

        <DropdownMenuItem>Low Stock Alert</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationMenu;
