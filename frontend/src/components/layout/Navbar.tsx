"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { LogIn, LogOut, Package, User, Bell } from "lucide-react";

import Logo from "@/assets/images/logo_e-commerce.png";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CartIcon } from "@/assets/icons/CartIcon";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  return (
    <header className="sticky top-0 z-50 border-b bg-white/90 drop-shadow-md backdrop-blur-md">
      <nav className="container mx-auto flex h-20 items-center justify-between px-4">
        <div>
          <Link href={"/"}>
            <Image src={Logo} alt="Logo" height={40} />
          </Link>
        </div>

        <div className="hidden md:block">
          <ul className="flex justify-between gap-6">
            <li className="text-xl font-black">
              <Link href={"#Home"}>Home</Link>
            </li>
            <li className="text-xl font-black">
              <Link href={"#Product"}>Product</Link>
            </li>
            <li className="text-xl font-black">
              <Link href={"#Category"}>Category</Link>
            </li>
            <li className="text-xl font-black">
              <Link href={"#Contact"}>Contact</Link>
            </li>
          </ul>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div>
            <Link href={"/cart"} aria-label="Cart">
              <CartIcon className="h-10 w-10 stroke-dark" />
            </Link>
          </div>
          
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                  <Avatar>
                    <AvatarImage src={isLoggedIn ? "https://github.com/shadcn.png" : ""} />
                    <AvatarFallback>{isLoggedIn ? "EA" : "U"}</AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56">
                {isLoggedIn ? (
                  <>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">Evanza</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          evanza@neoweave.com
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem asChild>
                        <Link href="/account/profile" className="cursor-pointer">
                          <User className="mr-2 h-4 w-4 text-slate-500" />
                          <span>Profile</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/orders" className="cursor-pointer">
                          <Package className="mr-2 h-4 w-4 text-slate-500" />
                          <span>My Orders</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/account/notifications" className="cursor-pointer">
                          <Bell className="mr-2 h-4 w-4 text-slate-500" />
                          <span>Notifications</span>
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-600"
                      onClick={() => setIsLoggedIn(false)}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sign Out</span>
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/login" className="cursor-pointer">
                        <LogIn className="mr-2 h-4 w-4 text-slate-500" />
                        <span>Log In</span>
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;